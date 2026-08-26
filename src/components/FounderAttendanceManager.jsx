import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, FileSpreadsheet, Loader2, Database, Download, Search, Calendar, Save, User, Filter, CheckSquare, Square, BarChart, TrendingUp, PieChart, TrendingDown } from 'lucide-react';
import ExcelJS from 'exceljs';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, writeBatch, deleteField, collection, getDocs } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';
import { generateAttendanceReport, generateFilteredListReport } from '../utils/pdfGenerator';

export default function FounderAttendanceManager() {
  const { addToast } = useToast();
  
  // Tabs State
  const [activeTab, setActiveTab] = useState('live'); // 'live', 'upload', 'manage'

  // ==========================================
  // LIVE CLASS MARKING STATE
  // ==========================================
  const [liveFilters, setLiveFilters] = useState({
    branch: '',
    section: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [liveStudents, setLiveStudents] = useState([]);
  const [fetchingLive, setFetchingLive] = useState(false);
  const [attendanceMarks, setAttendanceMarks] = useState({}); // { [roll]: { fn: true/false, an: true/false } }
  const [savingLive, setSavingLive] = useState(false);

  const getSafeValue = (data, keywords) => {
    if (!data) return '';
    const keys = Object.keys(data);
    const normalizedKeys = keys.map(k => k.replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
    
    let idx = normalizedKeys.findIndex(nk => keywords.includes(nk));
    if (idx === -1) {
       idx = normalizedKeys.findIndex(nk => keywords.some(kw => nk.includes(kw)));
    }
    return idx !== -1 ? data[keys[idx]] : '';
  };

  const handleFetchLiveStudents = async () => {
    if (!liveFilters.branch) {
      addToast({ message: 'Please provide at least a Branch to fetch students.', type: 'warning' });
      return;
    }
    setFetchingLive(true);
    setLiveStudents([]);
    try {
      const snapshot = await getDocs(collection(db, 'attendance'));
      const fetched = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        
        let rawBranch = getSafeValue(data, ['branch', 'department', 'dept']);
        let rawSection = getSafeValue(data, ['section', 'sec']);
        
        let b = String(rawBranch || '').trim().toUpperCase();
        let s = String(rawSection || '').trim().toUpperCase();

        if (b.includes(' ') && b.length <= 6) {
          const parts = b.split(/\s+/);
          const lastPart = parts[parts.length - 1];
          if (lastPart.length <= 2) {
             if (!s) s = lastPart;
             b = parts.slice(0, -1).join(' ');
          }
        }
        
        const filterBranch = liveFilters.branch.toUpperCase().trim();
        const filterSection = liveFilters.section.toUpperCase().trim();
        
        const branchMatch = !filterBranch || b === filterBranch || b.includes(filterBranch);
        const sectionMatch = !filterSection || s === filterSection || s.includes(filterSection) || filterSection.includes(s);
        
        if (branchMatch && sectionMatch) {
          fetched.push({
            id: doc.id,
            name: getSafeValue(data, ['nameofthestudent', 'studentname', 'name']) || '-',
            branch: b || rawBranch,
            section: s || rawSection,
          });
        }
      });
      fetched.sort((a, b) => a.id.localeCompare(b.id));
      setLiveStudents(fetched);
      
      const initialMarks = {};
      fetched.forEach(student => {
         initialMarks[student.id] = { p1: true, p2: true, p3: true, p4: true, p5: true, p6: true }; // True = Ticked = Present
      });
      setAttendanceMarks(initialMarks);
      
      if (fetched.length === 0) {
        addToast({ message: 'No students found matching this criteria.', type: 'warning' });
      } else {
        addToast({ message: `Fetched ${fetched.length} students.`, type: 'success' });
      }
    } catch (error) {
      console.error(error);
      addToast({ message: 'Failed to fetch students', type: 'error' });
    } finally {
      setFetchingLive(false);
    }
  };

  const toggleAll = (targetGroup, value) => {
    setAttendanceMarks(prev => {
      const newMarks = { ...prev };
      const periodsToUpdate = targetGroup === 'fn' 
        ? ['p1', 'p2', 'p3', 'p4'] 
        : targetGroup === 'an' 
        ? ['p5', 'p6'] 
        : [targetGroup];

      liveStudents.forEach(student => {
        const current = newMarks[student.id] || { p1: true, p2: true, p3: true, p4: true, p5: true, p6: true };
        const updated = { ...current };
        periodsToUpdate.forEach(p => { updated[p] = value; });
        newMarks[student.id] = updated;
      });
      return newMarks;
    });
  };

  const handleSaveLiveAttendance = async () => {
    if (liveStudents.length === 0) return;
    if (!liveFilters.date) { addToast({ message: 'Date is required', type: 'error' }); return; }
    
    setSavingLive(true);
    const [yyyy, mm, dd] = liveFilters.date.split('-');
    const fnDateKey = `${dd}-${mm}-${yyyy} FN`;
    const anDateKey = `${dd}-${mm}-${yyyy} AN`;
    
    try {
      const BATCH_SIZE = 400;
      for (let i = 0; i < liveStudents.length; i += BATCH_SIZE) {
         const batch = writeBatch(db);
         const chunk = liveStudents.slice(i, i + BATCH_SIZE);
         chunk.forEach(student => {
           const marks = attendanceMarks[student.id] || { p1: true, p2: true, p3: true, p4: true, p5: true, p6: true };
           const fnPresent = marks.p1 || marks.p2 || marks.p3 || marks.p4;
           const anPresent = marks.p5 || marks.p6;

           batch.update(doc(db, 'attendance', student.id), {
             [fnDateKey]: fnPresent ? 'P' : 'A',
             [anDateKey]: anPresent ? 'P' : 'A',
             [`${dd}-${mm}-${yyyy} P1`]: marks.p1 ? 'P' : 'A',
             [`${dd}-${mm}-${yyyy} P2`]: marks.p2 ? 'P' : 'A',
             [`${dd}-${mm}-${yyyy} P3`]: marks.p3 ? 'P' : 'A',
             [`${dd}-${mm}-${yyyy} P4`]: marks.p4 ? 'P' : 'A',
             [`${dd}-${mm}-${yyyy} P5`]: marks.p5 ? 'P' : 'A',
             [`${dd}-${mm}-${yyyy} P6`]: marks.p6 ? 'P' : 'A',
             lastUpdated: serverTimestamp()
           });
         });
         await batch.commit();
      }
      
      addToast({ message: `6-Period Attendance saved for ${liveStudents.length} students on ${dd}-${mm}-${yyyy}!`, type: 'success' });
      setLiveStudents([]);
      setAttendanceMarks({});
    } catch (error) {
      console.error(error);
      addToast({ message: 'Failed to save attendance', type: 'error' });
    } finally {
      setSavingLive(false);
    }
  };


  // ==========================================
  // BULK UPLOAD STATE
  // ==========================================
  const [file, setFile] = useState(null);
  const [dataPreview, setDataPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ total: 0, valid: 0, errors: 0 });

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await selectedFile.arrayBuffer());
      const worksheet = workbook.worksheets[0];
      
      const formattedData = [];
      const headers = [];

      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber === 1) {
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            let actualCell = cell;
            if (cell.isMerged && cell.master) actualCell = cell.master;
            let val = actualCell.text ? String(actualCell.text).trim() : actualCell.value;
            if (val && typeof val === 'object' && val.richText) val = val.richText.map(rt => rt.text).join('');
            else if (val && typeof val === 'object' && val.text) val = val.text;
            else if (val && val instanceof Date) {
               const d = String(val.getDate()).padStart(2, '0');
               const m = String(val.getMonth() + 1).padStart(2, '0');
               const y = val.getFullYear();
               val = `${d}-${m}-${y}`;
            }
            else val = val ? val.toString().trim() : '';
            
            val = val.replace(/\//g, '-');
            headers[colNumber] = val || `Column_${colNumber}`;
          });
          return;
        } 
        
        if (rowNumber === 2) {
          let isSubHeader = false;
          let tempSubHeaders = {};
          
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const val = cell.text ? String(cell.text).trim() : (cell.value ? String(cell.value).trim() : '');
            tempSubHeaders[colNumber] = val;
            const vUpper = val.toUpperCase();
            if (/\b(?:AN|FN|AM|PM)\b/.test(vUpper)) isSubHeader = true;
          });
          
          if (isSubHeader) {
             Object.keys(tempSubHeaders).forEach(colNumber => {
                const v = tempSubHeaders[colNumber];
                 if (v && headers[colNumber] && !headers[colNumber].startsWith('Column_')) {
                    const vUpper = v.toUpperCase().trim();
                    if (/\b(?:AN|PM)\b/.test(vUpper)) headers[colNumber] += ' AN';
                    else if (/\b(?:FN|AM)\b/.test(vUpper)) headers[colNumber] += ' FN';
                 }
              });
             return;
          }
        }

        const rowData = {};
        let rollKey = null;

          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const header = headers[colNumber];
            if (!header) return;

            if (header.replace(/\s+/g, '').toLowerCase().includes('roll')) rollKey = header;

            let val = cell.text ? String(cell.text).trim() : cell.value;
            if (val && typeof val === 'object' && val.richText) val = val.richText.map(rt => rt.text).join('');
            else if (val && typeof val === 'object' && val.text) val = val.text;
            else if (val && typeof val === 'object' && val.result !== undefined) val = val.result;
            else if (val && val instanceof Date) {
              const d = String(val.getDate()).padStart(2, '0');
              const m = String(val.getMonth() + 1).padStart(2, '0');
              const y = val.getFullYear();
              val = `${d}-${m}-${y}`;
            } else if (val !== null && val !== undefined) val = String(val).trim();
            else val = '';

            let isRed = false;
            if (cell.style && cell.style.fill) {
              const fg = cell.style.fill.fgColor?.argb?.toUpperCase();
              const bg = cell.style.fill.bgColor?.argb?.toUpperCase();
              const checkColor = (c) => c && (c.includes('FF0000') || c === 'FFFF000C' || c === 'FFFFC7CE');
              if (checkColor(fg) || checkColor(bg)) isRed = true;
            }

            const isDateHeader = /^\d{1,2}[-/\\]\d{1,2}[-/\\]\d{2,4}(?: (FN|AN))?$/i.test(header) || /^\d{2,4}[-/\\]\d{1,2}[-/\\]\d{1,2}(?: (FN|AN))?$/i.test(header) || header.toUpperCase() === 'FN' || header.toUpperCase() === 'AN';
            if (isDateHeader) {
               if (isRed) val = val || 'A';
               else val = val || 'P';
            }

            if (!header.includes('__EMPTY') && !header.toLowerCase().startsWith('column_')) {
              rowData[header] = val;
            }
          });
          
          if (Object.keys(rowData).length > 0) {
             formattedData.push({
               _id: rollKey && rowData[rollKey] ? String(rowData[rollKey]).trim().toUpperCase() : null,
               ...rowData
             });
          }
      });

      const validCount = formattedData.filter(r => r._id).length;
      
      setDataPreview(formattedData);
      setStats({ total: formattedData.length, valid: validCount, errors: formattedData.length - validCount });
      addToast({ message: `Successfully parsed ${formattedData.length} records.`, type: 'success' });
    } catch (error) {
      addToast({ message: "Failed to parse Excel file. Ensure it's a valid .xlsx format.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadToDatabase = async () => {
    if (dataPreview.length === 0) return;
    setUploading(true);
    let successCount = 0; let failCount = 0;

    try {
      const validRows = dataPreview.filter(row => row._id);
      const mergedRows = {};
      let validCount = 0;

      validRows.forEach(row => {
        const id = String(row._id || '').trim().replace(/\//g, '_');
        if (!id || id === '-') return;
        if (!mergedRows[id]) { mergedRows[id] = {}; validCount++; }
        Object.keys(row).forEach(k => {
          const safeKey = String(k).trim().replace(/[^a-zA-Z0-9 _-]/g, '');
          if (row[k] !== undefined && k !== '_id' && safeKey !== '') {
            let safeVal = row[k];
            if (typeof safeVal === 'object' && safeVal !== null) {
              try { safeVal = JSON.stringify(safeVal); } catch(e) { safeVal = String(safeVal); }
            }
            mergedRows[id][safeKey] = safeVal;
          }
        });
      });

      failCount += dataPreview.length - validCount;
      const uniqueIds = Object.keys(mergedRows);
      
      const BATCH_SIZE = 400;
      for (let i = 0; i < uniqueIds.length; i += BATCH_SIZE) {
        const batch = writeBatch(db);
        const chunkIds = uniqueIds.slice(i, i + BATCH_SIZE);
        chunkIds.forEach(id => {
          const uploadData = { ...mergedRows[id], lastUpdated: serverTimestamp() };
          try { batch.set(doc(db, 'attendance', id), uploadData); } catch (e) {}
        });
        await batch.commit();
        successCount += chunkIds.length;
      }

      addToast({ message: `Upload Complete: ${successCount} successful, ${failCount} skipped/invalid.`, type: 'success' });
      if (failCount === 0) { setFile(null); setDataPreview([]); setStats({ total: 0, valid: 0, errors: 0 }); }
    } catch (error) { addToast({ message: `Upload failed`, type: 'error' }); } 
    finally { setUploading(false); }
  };


  // ==========================================
  // MANAGE & REPORTS STATE
  // ==========================================
  const [reportRoll, setReportRoll] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [exportingDatabase, setExportingDatabase] = useState(false);
  
  const [searchRoll, setSearchRoll] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceData, setAttendanceData] = useState({ fn: '', p1: '', p2: '', p3: '', p4: '', an: '', p5: '', p6: '' });
  const [updatingAttendance, setUpdatingAttendance] = useState(false);
  const [resolvedKeys, setResolvedKeys] = useState({ fnKey: '', p1Key: '', p2Key: '', p3Key: '', p4Key: '', anKey: '', p5Key: '', p6Key: '' });
  
  const [filterPercent, setFilterPercent] = useState('');
  const [filterCondition, setFilterCondition] = useState('below');
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterSection, setFilterSection] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [generatingOverall, setGeneratingOverall] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filterStats, setFilterStats] = useState(null);
  const handleFilterAttendance = async (e) => {
    e.preventDefault();
    if (!filterPercent) return;
    setIsFiltering(true);
    setFilteredStudents([]);
    try {
      const snapshot = await getDocs(collection(db, 'attendance'));
      const results = [];
      const threshold = parseFloat(filterPercent);
      
      snapshot.forEach(doc => {
        const data = doc.data();
        
        // Ultra-resilient key extraction
        let dataBranch = '';
        let dataSection = '';
        let dataYear = '';
        let dataName = '-';
        let fullRowText = '';
        
        Object.keys(data).forEach(k => {
           const norm = k.replace(/\s+/g, '').toUpperCase();
           const val = String(data[k]).trim().toUpperCase();
           
           if (norm.includes('BRANCH') || norm.includes('DEPT')) dataBranch = val;
           if (norm.includes('SEC') || norm === 'CLASS') dataSection = val;
           if (norm.includes('YEAR') || norm.includes('SEM')) dataYear = val;
           if (norm === 'NAME' || norm === 'STUDENTNAME') dataName = String(data[k]).trim();
           
           fullRowText += val + ' ';
        });
        
        if (filterBranch !== 'All') {
            const br = filterBranch.toUpperCase();
            if (dataBranch) {
                if (!dataBranch.includes(br) && dataBranch !== br) return;
            } else {
                if (!fullRowText.includes(br)) return;
            }
        }
        
        if (filterSection !== 'All') {
            const sec = filterSection.toUpperCase();
            if (dataSection) {
                if (!dataSection.includes(sec) && dataSection !== sec) return;
            } else {
                if (!fullRowText.split(/[\s-]+/).includes(sec)) return;
            }
        }
        
        if (filterYear !== 'All') {
            const yr = filterYear.toUpperCase();
            const romanYr = yr === '1' ? 'I' : yr === '2' ? 'II' : yr === '3' ? 'III' : yr === '4' ? 'IV' : yr;
            if (dataYear) {
                if (!dataYear.includes(yr) && dataYear !== yr && dataYear !== romanYr) return;
            } else {
                if (!fullRowText.includes(yr) && !fullRowText.split(/[\s-]+/).includes(romanYr)) return;
            }
        }
        
        let presentDays = 0;
        let totalDays = 0;
        Object.entries(data).forEach(([key, value]) => {
          const normalized = key.replace(/\s+/g, '').toLowerCase();
          const isStatic = ['lastupdated', 'name', 'studentname', 'branch', 'department', 'dept', 'rollno', 'rollnumber', 'section', 'year', 'no', 'sno', 'slno', 'category', 'percentage', '%', 'totalclasses', 'noofclassespresent', 'noofabsent', 'gender', 'dob', 'phone', 'email', 'batch'].includes(normalized) || normalized.includes('itca') || normalized.includes('batch');
          const hasNumber = /\d/.test(key);
          const isExactFNAN = key.toUpperCase() === 'FN' || key.toUpperCase() === 'AN';
          if ((hasNumber || isExactFNAN) && !isStatic && !key.includes('__EMPTY') && !normalized.startsWith('column_')) {
            const v = String(value || '').trim().toUpperCase();
            if (['P', '1', 'TRUE', 'PRESENT', 'OD', 'ON DUTY'].includes(v)) {
              totalDays++;
              presentDays++;
            } else if (['A', '0', 'FALSE', 'ABSENT', 'AB', 'L', 'LEAVE'].includes(v)) {
              totalDays++;
            }
          }
        });
        
        let percentVal = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
        
        // Fallback: If no daily columns found, look for pre-calculated percentage or total/present columns
        if (totalDays === 0) {
           let foundPercent = null;
           let foundTotal = null;
           let foundPresent = null;
           Object.keys(data).forEach(k => {
             const norm = k.replace(/\s+/g, '').toLowerCase();
             if (norm === 'percentage' || norm === '%' || norm === 'attendance%' || norm === 'att%') {
                const val = parseFloat(data[k]);
                if (!isNaN(val)) foundPercent = val;
             }
             if (norm.includes('totalclasses') || norm === 'total') {
                const val = parseFloat(data[k]);
                if (!isNaN(val)) foundTotal = val;
             }
             if (norm.includes('classespresent') || norm === 'present' || norm.includes('attended')) {
                const val = parseFloat(data[k]);
                if (!isNaN(val)) foundPresent = val;
             }
           });
           
           if (foundPercent !== null) {
             percentVal = Math.round(foundPercent);
           } else if (foundTotal > 0 && foundPresent !== null) {
             percentVal = Math.round((foundPresent / foundTotal) * 100);
           }
        }
        
        if (filterCondition === 'below' && percentVal <= threshold) {
           results.push({ id: doc.id, name: dataName, branch: dataBranch || '-', percent: percentVal });
        } else if (filterCondition === 'above' && percentVal >= threshold) {
           results.push({ id: doc.id, name: dataName, branch: dataBranch || '-', percent: percentVal });
        }
      });
      
      results.sort((a, b) => a.percent - b.percent);
      setFilteredStudents(results);
      if (results.length === 0) {
        setFilterStats(null);
        addToast({ message: `No students found with attendance ${filterCondition} ${threshold}%`, type: 'warning' });
      } else {
        const totalPercent = results.reduce((sum, s) => sum + s.percent, 0);
        const avg = Math.round(totalPercent / results.length);
        const min = results[0].percent;
        const max = results[results.length - 1].percent;
        
        let d50 = 0, d75 = 0, d90 = 0, d100 = 0;
        results.forEach(s => {
          if (s.percent < 50) d50++;
          else if (s.percent < 75) d75++;
          else if (s.percent < 90) d90++;
          else d100++;
        });

        setFilterStats({ avg, min, max, dist: { d50, d75, d90, d100 }, count: results.length });
        addToast({ message: `Found ${results.length} students.`, type: 'success' });
      }
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to filter students', type: 'error' });
    } finally {
      setIsFiltering(false);
    }
  };

  const findExistingDateKeys = (data, dd, mm, yyyy) => {
    const fourDigit = `${dd}-${mm}-${yyyy}`;
    const twoDigit = `${dd}-${mm}-${yyyy.slice(-2)}`;
    let prefix = fourDigit;
    if (data[`${twoDigit} FN`] !== undefined || data[`${twoDigit} AN`] !== undefined || data[`${twoDigit} P1`] !== undefined) {
      prefix = twoDigit;
    }
    return {
      prefix,
      fnKey: `${prefix} FN`,
      p1Key: `${prefix} P1`,
      p2Key: `${prefix} P2`,
      p3Key: `${prefix} P3`,
      p4Key: `${prefix} P4`,
      anKey: `${prefix} AN`,
      p5Key: `${prefix} P5`,
      p6Key: `${prefix} P6`,
    };
  };

  const handleDownloadOverallReport = async () => {
    setGeneratingOverall(true);
    try {
      const snapshot = await getDocs(collection(db, 'attendance'));
      const results = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        let presentDays = 0;
        let totalDays = 0;
        Object.entries(data).forEach(([key, value]) => {
          const normalized = key.replace(/\s+/g, '').toLowerCase();
          const isStatic = ['lastupdated', 'name', 'studentname', 'branch', 'department', 'dept', 'rollno', 'rollnumber', 'section', 'year', 'no', 'sno', 'slno', 'category', 'percentage', '%', 'totalclasses', 'noofclassespresent', 'noofabsent', 'gender', 'dob', 'phone', 'email', 'batch'].includes(normalized) || normalized.includes('itca') || normalized.includes('batch');
          const hasNumber = /\d/.test(key);
          const isExactFNAN = key.toUpperCase() === 'FN' || key.toUpperCase() === 'AN';
          if ((hasNumber || isExactFNAN) && !isStatic && !key.includes('__EMPTY') && !normalized.startsWith('column_')) {
            const v = String(value || '').trim().toUpperCase();
            if (['P', '1', 'TRUE', 'PRESENT', 'OD', 'ON DUTY'].includes(v)) {
              totalDays++;
              presentDays++;
            } else if (['A', '0', 'FALSE', 'ABSENT', 'AB', 'L', 'LEAVE'].includes(v)) {
              totalDays++;
            }
          }
        });
        
        let percentVal = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
        
        // Fallback: If no daily columns found, look for pre-calculated percentage or total/present columns
        if (totalDays === 0) {
           let foundPercent = null;
           let foundTotal = null;
           let foundPresent = null;
           Object.keys(data).forEach(k => {
             const norm = k.replace(/\s+/g, '').toLowerCase();
             if (norm === 'percentage' || norm === '%' || norm === 'attendance%' || norm === 'att%') {
                const val = parseFloat(data[k]);
                if (!isNaN(val)) foundPercent = val;
             }
             if (norm.includes('totalclasses') || norm === 'total') {
                const val = parseFloat(data[k]);
                if (!isNaN(val)) foundTotal = val;
             }
             if (norm.includes('classespresent') || norm === 'present' || norm.includes('attended')) {
                const val = parseFloat(data[k]);
                if (!isNaN(val)) foundPresent = val;
             }
           });
           
           if (foundPercent !== null) {
             percentVal = Math.round(foundPercent);
           } else if (foundTotal > 0 && foundPresent !== null) {
             percentVal = Math.round((foundPresent / foundTotal) * 100);
           }
        }
        results.push({ id: doc.id, name: data['NAME'] || data['Name'] || '-', branch: data['BRANCH'] || data['Branch'] || '-', percent: percentVal });
      });
      
      results.sort((a, b) => a.percent - b.percent);
      if (results.length > 0) {
        generateFilteredListReport(results, "Overall", "College");
        addToast({ message: "Overall report generated", type: 'success' });
      } else {
        addToast({ message: "No data to report", type: 'warning' });
      }
    } catch (err) {
      console.error(err);
      addToast({ message: "Failed to generate overall report", type: 'error' });
    } finally {
      setGeneratingOverall(false);
    }
  };

  const handleDownloadReport = async (e) => {
    e.preventDefault();
    if (!reportRoll.trim()) return;
    setGeneratingReport(true);
    try {
      const docSnap = await getDoc(doc(db, 'attendance', reportRoll.toUpperCase()));
      if (docSnap.exists()) {
        await generateAttendanceReport(docSnap.data(), reportRoll.toUpperCase());
        addToast({ message: `Report generated`, type: 'success' });
        setReportRoll('');
      } else addToast({ message: `No record found`, type: 'error' });
    } catch (err) { addToast({ message: "Failed to generate report", type: 'error' }); } 
    finally { setGeneratingReport(false); }
  };

  const handleExportDatabase = async () => {
    setExportingDatabase(true);
    try {
      const snapshot = await getDocs(collection(db, 'attendance'));
      if (snapshot.empty) { addToast({ message: "Database empty.", type: 'warning' }); return; }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Live Attendance');
      const allKeys = new Set(); const allRows = [];
      snapshot.forEach(doc => {
        const data = doc.data(); const row = { 'ROLL NUMBER': doc.id };
        Object.keys(data).forEach(key => { if (key !== 'lastUpdated') { allKeys.add(key); row[key] = data[key]; } });
        allRows.push(row);
      });
      const baseHeaders = ['ROLL NUMBER'];
      const metadata = ['NAME', 'Name', 'BRANCH', 'SECTION', 'YEAR', 'PERCENTAGE'];
      const parseDateKey = (k) => {
        const p = k.split(' ')[0].split('-');
        if (p.length === 3) return new Date((parseInt(p[2]) < 100 ? parseInt(p[2])+2000 : parseInt(p[2])), parseInt(p[1])-1, parseInt(p[0])).getTime();
        return 0;
      };
      const sortedKeys = Array.from(allKeys).sort((a, b) => {
        const aM = metadata.includes(a); const bM = metadata.includes(b);
        if (aM && !bM) return -1; if (!aM && bM) return 1;
        if (!aM && !bM) {
          const aT = parseDateKey(a); const bT = parseDateKey(b);
          if (aT !== bT) return aT - bT;
          if (a.includes('FN') && b.includes('AN')) return -1;
          if (a.includes('AN') && b.includes('FN')) return 1;
        }
        return a.localeCompare(b);
      });
      const finalHeaders = [...baseHeaders, ...sortedKeys];
      worksheet.addRow(finalHeaders);
      allRows.forEach(r => worksheet.addRow(finalHeaders.map(h => r[h] || '')));
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url;
      a.download = `Live_Attendance_Export_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
      a.click(); window.URL.revokeObjectURL(url);
      addToast({ message: "Exported successfully!", type: 'success' });
    } catch (error) { addToast({ message: "Failed to export", type: 'error' }); } 
    finally { setExportingDatabase(false); }
  };

  const handleSearchStudent = async (e) => {
    e.preventDefault();
    if (!searchRoll.trim()) return;
    setSearchingStudent(true); setStudentData(null); setSelectedDate(''); 
    setAttendanceData({ fn: '', p1: '', p2: '', p3: '', p4: '', an: '', p5: '', p6: '' });
    try {
      const docSnap = await getDoc(doc(db, 'attendance', searchRoll.toUpperCase()));
      if (docSnap.exists()) setStudentData({ id: docSnap.id, ...docSnap.data() });
      else addToast({ message: `No record found`, type: 'error' });
    } catch (err) { addToast({ message: "Failed to fetch student", type: 'error' }); } 
    finally { setSearchingStudent(false); }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    if (studentData && newDate) {
      const p = newDate.split('-');
      const keys = findExistingDateKeys(studentData, p[2], p[1], p[0]);
      setResolvedKeys(keys);
      setAttendanceData({ 
        fn: studentData[keys.fnKey] || '',
        p1: studentData[keys.p1Key] || '',
        p2: studentData[keys.p2Key] || '',
        p3: studentData[keys.p3Key] || '',
        p4: studentData[keys.p4Key] || '',
        an: studentData[keys.anKey] || '',
        p5: studentData[keys.p5Key] || '',
        p6: studentData[keys.p6Key] || '',
      });
    } else { 
      setResolvedKeys({ fnKey: '', p1Key: '', p2Key: '', p3Key: '', p4Key: '', anKey: '', p5Key: '', p6Key: '' }); 
      setAttendanceData({ fn: '', p1: '', p2: '', p3: '', p4: '', an: '', p5: '', p6: '' }); 
    }
  };

  const handlePeriodChange = (field, val, session) => {
    setAttendanceData(prev => {
      const updated = { ...prev, [field]: val };
      if (session === 'fn') {
        const fnPeriods = [updated.p1, updated.p2, updated.p3, updated.p4];
        if (fnPeriods.some(p => p === 'P')) updated.fn = 'P';
        else if (fnPeriods.every(p => p === 'A')) updated.fn = 'A';
        else if (fnPeriods.every(p => p === 'DELETE')) updated.fn = 'DELETE';
      } else if (session === 'an') {
        const anPeriods = [updated.p5, updated.p6];
        if (anPeriods.some(p => p === 'P')) updated.an = 'P';
        else if (anPeriods.every(p => p === 'A')) updated.an = 'A';
        else if (anPeriods.every(p => p === 'DELETE')) updated.an = 'DELETE';
      }
      return updated;
    });
  };

  const handleUpdateAttendance = async () => {
    if (!studentData || !selectedDate) return;
    setUpdatingAttendance(true);
    try {
      const updates = {};
      const keyMap = {
        fn: resolvedKeys.fnKey,
        p1: resolvedKeys.p1Key,
        p2: resolvedKeys.p2Key,
        p3: resolvedKeys.p3Key,
        p4: resolvedKeys.p4Key,
        an: resolvedKeys.anKey,
        p5: resolvedKeys.p5Key,
        p6: resolvedKeys.p6Key,
      };

      Object.keys(keyMap).forEach(field => {
        const val = attendanceData[field];
        const key = keyMap[field];
        if (key) {
          if (val === 'DELETE') updates[key] = deleteField();
          else if (val !== '') updates[key] = val;
        }
      });
      
      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, 'attendance', studentData.id), updates);
        setStudentData(prev => {
          const newData = { ...prev };
          Object.keys(keyMap).forEach(field => {
            const val = attendanceData[field];
            const key = keyMap[field];
            if (key) {
              if (val === 'DELETE') delete newData[key];
              else if (val !== '') newData[key] = val;
            }
          });
          return newData;
        });
        addToast({ message: `Attendance updated for ${studentData.id}`, type: 'success' });
      } else addToast({ message: "No changes made.", type: 'warning' });
    } catch (err) { 
      console.error(err);
      addToast({ message: "Update failed", type: 'error' }); 
    }
    finally { setUpdatingAttendance(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-blue flex items-center justify-center text-black">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Attendance Manager</h2>
            <p className="text-sm text-gray-400">Manage student attendance efficiently.</p>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-white/10 mb-6 relative z-10 overflow-x-auto custom-scrollbar">
          <button onClick={() => setActiveTab('live')} className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'live' ? 'border-brand-teal text-brand-teal' : 'border-transparent text-gray-400 hover:text-white'}`}>Live Class Marking</button>
          <button onClick={() => setActiveTab('upload')} className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'upload' ? 'border-brand-teal text-brand-teal' : 'border-transparent text-gray-400 hover:text-white'}`}>Bulk Excel Upload</button>
          <button onClick={() => setActiveTab('manage')} className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'manage' ? 'border-brand-teal text-brand-teal' : 'border-transparent text-gray-400 hover:text-white'}`}>Reports & Edit</button>
        </div>

        {/* TAB 1: LIVE CLASS MARKING */}
        {activeTab === 'live' && (
          <div className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-black/40 rounded-2xl border border-white/5">
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Branch</label>
                <input type="text" value={liveFilters.branch} onChange={e => setLiveFilters({...liveFilters, branch: e.target.value.toUpperCase()})} placeholder="e.g. CSM" className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-brand-teal/50 outline-none" />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Section (Optional)</label>
                <input type="text" value={liveFilters.section} onChange={e => setLiveFilters({...liveFilters, section: e.target.value.toUpperCase()})} placeholder="e.g. C" className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-brand-teal/50 outline-none" />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Date</label>
                <input type="date" value={liveFilters.date} onChange={e => setLiveFilters({...liveFilters, date: e.target.value})} className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-brand-teal/50 outline-none [color-scheme:dark]" />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button onClick={handleFetchLiveStudents} disabled={fetchingLive} className="w-full h-[38px] bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-colors border border-white/10 flex items-center justify-center">
                  {fetchingLive ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch Class'}
                </button>
              </div>
            </div>

            {liveStudents.length > 0 && (
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-black/40 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">Students: {liveStudents.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-xs text-gray-400">Ticked = Present, Unticked = Absent</span>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#0c0c16] z-10 shadow-md">
                      {/* Category Header Row */}
                      <tr className="border-b border-white/10 text-[10px] text-gray-400 font-bold uppercase text-center">
                        <th colSpan="4" className="p-2.5 bg-emerald-500/10 border-r border-white/10 text-emerald-400 tracking-wider">
                          <div className="flex justify-between items-center px-1">
                            <span className="font-black text-xs">FN (Morn - 4 Periods)</span>
                            <div className="flex gap-1.5">
                              <button onClick={() => toggleAll('fn', true)} className="text-[9px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded font-bold hover:bg-emerald-500/50 cursor-pointer">All ✓</button>
                              <button onClick={() => toggleAll('fn', false)} className="text-[9px] bg-red-500/30 text-red-300 px-2 py-0.5 rounded font-bold hover:bg-red-500/50 cursor-pointer">None ✗</button>
                            </div>
                          </div>
                        </th>
                        <th colSpan="2" className="p-2.5 bg-purple-500/10 border-r border-white/10 text-purple-400 tracking-wider">
                          <div className="flex justify-between items-center px-1">
                            <span className="font-black text-xs">AN (Aft - 2 Periods)</span>
                            <div className="flex gap-1.5">
                              <button onClick={() => toggleAll('an', true)} className="text-[9px] bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded font-bold hover:bg-purple-500/50 cursor-pointer">All ✓</button>
                              <button onClick={() => toggleAll('an', false)} className="text-[9px] bg-red-500/30 text-red-300 px-2 py-0.5 rounded font-bold hover:bg-red-500/50 cursor-pointer">None ✗</button>
                            </div>
                          </div>
                        </th>
                        <th colSpan="3" className="p-2.5 text-left text-gray-300 font-black text-xs">STUDENT DETAILS</th>
                      </tr>

                      {/* Period Sub-Headers */}
                      <tr className="border-b border-white/10 text-[10px] text-gray-400 font-bold tracking-wider uppercase text-center">
                        <th className="p-2 w-14 bg-emerald-500/5 border-r border-white/5">
                          <div className="flex flex-col items-center">
                            <span>P1</span>
                            <button onClick={() => toggleAll('p1', true)} className="text-[8px] text-emerald-400 hover:underline">✓</button>
                          </div>
                        </th>
                        <th className="p-2 w-14 bg-emerald-500/5 border-r border-white/5">
                          <div className="flex flex-col items-center">
                            <span>P2</span>
                            <button onClick={() => toggleAll('p2', true)} className="text-[8px] text-emerald-400 hover:underline">✓</button>
                          </div>
                        </th>
                        <th className="p-2 w-14 bg-emerald-500/5 border-r border-white/5">
                          <div className="flex flex-col items-center">
                            <span>P3</span>
                            <button onClick={() => toggleAll('p3', true)} className="text-[8px] text-emerald-400 hover:underline">✓</button>
                          </div>
                        </th>
                        <th className="p-2 w-14 bg-emerald-500/5 border-r border-white/10">
                          <div className="flex flex-col items-center">
                            <span>P4</span>
                            <button onClick={() => toggleAll('p4', true)} className="text-[8px] text-emerald-400 hover:underline">✓</button>
                          </div>
                        </th>
                        <th className="p-2 w-14 bg-purple-500/5 border-r border-white/5">
                          <div className="flex flex-col items-center">
                            <span>P5</span>
                            <button onClick={() => toggleAll('p5', true)} className="text-[8px] text-purple-400 hover:underline">✓</button>
                          </div>
                        </th>
                        <th className="p-2 w-14 bg-purple-500/5 border-r border-white/10">
                          <div className="flex flex-col items-center">
                            <span>P6</span>
                            <button onClick={() => toggleAll('p6', true)} className="text-[8px] text-purple-400 hover:underline">✓</button>
                          </div>
                        </th>
                        <th className="p-3 text-left">Roll Number</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Branch / Sec</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveStudents.map((student) => {
                        const marks = attendanceMarks[student.id] || { p1: true, p2: true, p3: true, p4: true, p5: true, p6: true };
                        return (
                          <tr key={student.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            {['p1', 'p2', 'p3', 'p4'].map(pKey => (
                              <td key={pKey} className="p-2 text-center border-r border-white/5 bg-emerald-500/[0.02]">
                                <button 
                                  onClick={() => setAttendanceMarks(prev => ({
                                    ...prev, 
                                    [student.id]: { ...prev[student.id], [pKey]: !prev[student.id]?.[pKey] }
                                  }))} 
                                  className="focus:outline-none cursor-pointer"
                                >
                                  {marks[pKey] ? (
                                    <CheckSquare className="w-5 h-5 text-emerald-400 mx-auto" />
                                  ) : (
                                    <Square className="w-5 h-5 text-gray-600 mx-auto hover:text-white" />
                                  )}
                                </button>
                              </td>
                            ))}

                            {['p5', 'p6'].map(pKey => (
                              <td key={pKey} className="p-2 text-center border-r border-white/5 bg-purple-500/[0.02]">
                                <button 
                                  onClick={() => setAttendanceMarks(prev => ({
                                    ...prev, 
                                    [student.id]: { ...prev[student.id], [pKey]: !prev[student.id]?.[pKey] }
                                  }))} 
                                  className="focus:outline-none cursor-pointer"
                                >
                                  {marks[pKey] ? (
                                    <CheckSquare className="w-5 h-5 text-purple-400 mx-auto" />
                                  ) : (
                                    <Square className="w-5 h-5 text-gray-600 mx-auto hover:text-white" />
                                  )}
                                </button>
                              </td>
                            ))}

                            <td className="p-3 font-bold text-white text-xs">{student.id}</td>
                            <td className="p-3 text-gray-300 text-xs font-medium">{student.name}</td>
                            <td className="p-3 text-gray-400 text-[11px] font-bold">{student.branch} {student.section ? `/ ${student.section}` : ''}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 border-t border-white/10 bg-black/40">
                  <button onClick={handleSaveLiveAttendance} disabled={savingLive} className="w-full py-4 bg-gradient-to-r from-brand-teal to-brand-blue text-black font-extrabold rounded-xl hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
                    {savingLive ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Full Day Attendance for {liveFilters.date}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BULK UPLOAD */}
        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 border-dashed hover:border-brand-teal/50 transition-colors flex flex-col items-center justify-center text-center min-h-[250px]">
              <UploadCloud className="w-12 h-12 text-brand-teal mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-white mb-2">Select Excel File</h3>
              <p className="text-xs text-gray-400 mb-6 max-w-[250px]">
                Supported formats: .xlsx, .xls, .csv. Required columns: ROLL NUMBER, BRANCH, SECTION, YEAR.
              </p>
              <label className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl cursor-pointer transition-all border border-white/10">
                Browse Files
                <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleFileUpload} disabled={loading || uploading} />
              </label>
              {file && <p className="mt-4 text-xs text-brand-teal font-semibold">Selected: {file.name}</p>}
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-widest flex items-center gap-2"><Database className="w-4 h-4 text-brand-blue" /> Data Preview Stats</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <span className="block text-2xl font-black text-white">{stats.total}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Total Rows</span>
                  </div>
                  <div className="bg-brand-teal/10 p-3 rounded-xl border border-brand-teal/20">
                    <span className="block text-2xl font-black text-brand-teal">{stats.valid}</span>
                    <span className="text-[10px] text-brand-teal/70 font-bold uppercase">Valid (With Roll)</span>
                  </div>
                  <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                    <span className="block text-2xl font-black text-red-400">{stats.errors}</span>
                    <span className="text-[10px] text-red-400/70 font-bold uppercase">Missing Roll</span>
                  </div>
                </div>
              </div>
              <button onClick={handleUploadToDatabase} disabled={dataPreview.length === 0 || uploading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-teal to-brand-blue text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50 shadow-lg cursor-pointer">
                {uploading ? <><Loader2 className="w-5 h-5 animate-spin" />Syncing...</> : <><CheckCircle className="w-5 h-5" />Upload {stats.valid} Records</>}
              </button>
            </div>
            
            {dataPreview.length > 0 && (
              <div className="md:col-span-2 mt-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 overflow-hidden">
                  <h3 className="text-sm font-bold text-white mb-4">Data Preview</h3>
                  <div className="overflow-x-auto max-h-[300px] custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-[#0c0c16] z-10 shadow-md">
                        <tr className="border-b border-white/10 text-[10px] text-gray-400 font-bold tracking-wider uppercase">
                          <th className="p-3">Status</th>
                          {Object.keys(dataPreview[0]).filter(k => k !== '_id').map((key) => (
                            <th key={key} className="p-3 whitespace-nowrap">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dataPreview.slice(0, 50).map((row, idx) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] text-xs font-semibold text-gray-300">
                            <td className="p-3">
                              {row._id ? <CheckCircle className="w-4 h-4 text-brand-teal" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                            </td>
                            {Object.keys(row).filter(k => k !== '_id').map((key) => (
                              <td key={key} className="p-3 whitespace-nowrap">{row[key] || '-'}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MANAGE & REPORTS */}
        {activeTab === 'manage' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-6">
              {/* Generate Report Section */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Download className="w-5 h-5 text-brand-orange" /> Download Individual Report</h3>
                <p className="text-xs text-gray-400 mb-4">Enter a student's Roll Number to instantly generate a professional PDF attendance report.</p>
                <form onSubmit={handleDownloadReport} className="flex gap-3">
                  <input type="text" value={reportRoll} onChange={(e) => setReportRoll(e.target.value.toUpperCase())} placeholder="e.g. 219X1A0501" className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold uppercase tracking-widest focus:outline-none focus:border-brand-orange/50 transition-colors" />
                  <button type="submit" disabled={generatingReport || !reportRoll.trim()} className="px-4 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-pink text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2">
                    {generatingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} {generatingReport ? 'Generating...' : 'Download'}
                  </button>
                </form>
              </div>
              
              {/* Export Database Section */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Database className="w-5 h-5 text-brand-teal" /> Export Live Database</h3>
                <p className="text-xs text-gray-400 mb-4">Download the active attendance database or a PDF report for all students.</p>
                <div className="flex flex-col gap-3">
                  <button onClick={handleExportDatabase} disabled={exportingDatabase} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border border-white/10">
                    {exportingDatabase ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />} {exportingDatabase ? 'Exporting...' : 'Export to Excel (.xlsx)'}
                  </button>
                  <button onClick={handleDownloadOverallReport} disabled={generatingOverall} className="w-full py-3 rounded-xl bg-brand-teal/20 hover:bg-brand-teal/30 text-brand-teal font-bold text-sm transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border border-brand-teal/30">
                    {generatingOverall ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} {generatingOverall ? 'Generating...' : 'Overall College PDF Report'}
                  </button>
                </div>
              </div>

              {/* Filter Attendance Section */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Filter className="w-5 h-5 text-brand-pink" /> Filter by Attendance</h3>
                <p className="text-xs text-gray-400 mb-4">Find students whose attendance percentage is above or below a specific threshold.</p>
                <form onSubmit={handleFilterAttendance} className="space-y-4">
                  <div className="flex gap-3">
                    <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold tracking-widest focus:outline-none focus:border-brand-pink/50 transition-colors">
                      <option value="All">All Branches</option>
                      <option value="CSM">CSM</option>
                      <option value="CSE">CSE</option>
                      <option value="EEE">EEE</option>
                      <option value="ECE">ECE</option>
                      <option value="CIVIL">CIVIL</option>
                      <option value="MECH">MECH</option>
                    </select>
                    <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold tracking-widest focus:outline-none focus:border-brand-pink/50 transition-colors">
                      <option value="All">All Years</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                    <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold tracking-widest focus:outline-none focus:border-brand-pink/50 transition-colors">
                      <option value="All">All Sections</option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                      <option value="E">Section E</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <input type="number" value={filterPercent} onChange={(e) => setFilterPercent(e.target.value)} placeholder="e.g. 80" className="w-24 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold tracking-widest focus:outline-none focus:border-brand-pink/50 transition-colors" min="0" max="100" />
                    <span className="flex items-center text-gray-400 font-bold">%</span>
                    <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-brand-pink/50 transition-colors">
                      <option value="below">Below threshold</option>
                      <option value="above">Above threshold</option>
                    </select>
                  </div>
                  <button type="submit" disabled={isFiltering || !filterPercent} className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-pink to-brand-orange text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                    {isFiltering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />} {isFiltering ? 'Filtering...' : 'Filter Students'}
                  </button>
                </form>

                {filteredStudents.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-white font-bold text-sm">Filtered Results ({filteredStudents.length})</h4>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setShowAnalytics(!showAnalytics)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-brand-pink text-xs font-bold transition-colors border border-white/10"
                        >
                          <BarChart className="w-3 h-3" /> {showAnalytics ? 'Hide Analytics' : 'Analytics View'}
                        </button>
                        <button 
                          onClick={() => generateFilteredListReport(filteredStudents, filterCondition, filterPercent)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                        >
                          <Download className="w-3 h-3" /> Download PDF
                        </button>
                      </div>
                    </div>

                    {showAnalytics && filterStats && (
                      <div className="bg-black/20 rounded-xl p-4 border border-white/10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-brand-teal" /> Average</p>
                            <p className="text-xl font-black text-white">{filterStats.avg}%</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5"><TrendingDown className="w-3 h-3 text-brand-pink" /> Lowest</p>
                            <p className="text-xl font-black text-white">{filterStats.min}%</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5"><PieChart className="w-3 h-3 text-brand-orange" /> Highest</p>
                            <p className="text-xl font-black text-white">{filterStats.max}%</p>
                          </div>
                        </div>

                        {/* Distribution Bar Chart */}
                        <div>
                          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-3">Attendance Distribution</p>
                          <div className="flex h-6 rounded-full overflow-hidden border border-white/10">
                            {filterStats.dist.d50 > 0 && <div style={{ width: `${(filterStats.dist.d50 / filterStats.count) * 100}%` }} className="bg-brand-pink relative group" title={`<50%: ${filterStats.dist.d50}`}><span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">{filterStats.dist.d50}</span></div>}
                            {filterStats.dist.d75 > 0 && <div style={{ width: `${(filterStats.dist.d75 / filterStats.count) * 100}%` }} className="bg-brand-orange relative group" title={`50-74%: ${filterStats.dist.d75}`}><span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">{filterStats.dist.d75}</span></div>}
                            {filterStats.dist.d90 > 0 && <div style={{ width: `${(filterStats.dist.d90 / filterStats.count) * 100}%` }} className="bg-brand-blue relative group" title={`75-89%: ${filterStats.dist.d90}`}><span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">{filterStats.dist.d90}</span></div>}
                            {filterStats.dist.d100 > 0 && <div style={{ width: `${(filterStats.dist.d100 / filterStats.count) * 100}%` }} className="bg-brand-teal relative group" title={`90-100%: ${filterStats.dist.d100}`}><span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-black/50 opacity-0 group-hover:opacity-100 transition-opacity">{filterStats.dist.d100}</span></div>}
                          </div>
                          <div className="flex justify-between mt-2 text-[9px] text-gray-500 font-bold px-1">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-pink"></span> &lt;50%</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-orange"></span> 50-74%</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-blue"></span> 75-89%</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-teal"></span> 90-100%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="max-h-60 overflow-y-auto custom-scrollbar border border-white/10 rounded-xl">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="sticky top-0 bg-[#161623] z-10 text-[10px] uppercase font-extrabold tracking-wider text-gray-400">
                        <tr>
                          <th className="px-4 py-3 border-b border-white/10">Roll Number</th>
                          <th className="px-4 py-3 border-b border-white/10">Name</th>
                          <th className="px-4 py-3 border-b border-white/10">Branch</th>
                          <th className="px-4 py-3 border-b border-white/10 text-right">%</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredStudents.map(student => (
                          <tr key={student.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 font-bold text-white text-xs">{student.id}</td>
                            <td className="px-4 py-3 text-gray-300 text-xs">{student.name}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{student.branch}</td>
                            <td className="px-4 py-3 text-right font-bold text-brand-pink text-xs">{student.percent}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Update Section */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><User className="w-5 h-5 text-brand-teal" /> Manual Live Update</h3>
              <p className="text-xs text-gray-400 mb-4">Search for a student and manually update their attendance for a specific date in real-time.</p>
              <form onSubmit={handleSearchStudent} className="flex gap-3 mb-6">
                <input type="text" value={searchRoll} onChange={(e) => setSearchRoll(e.target.value.toUpperCase())} placeholder="Enter Roll Number" className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold uppercase tracking-widest focus:outline-none focus:border-brand-teal/50 transition-colors" />
                <button type="submit" disabled={searchingStudent || !searchRoll.trim()} className="px-4 py-3 rounded-xl bg-gradient-to-r from-brand-teal to-brand-blue text-black font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2">
                  {searchingStudent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Search
                </button>
              </form>

              {studentData && (
                <div className="bg-black/40 rounded-2xl p-5 border border-white/10 space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Roll Number</p>
                      <p className="font-semibold text-white">{studentData.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Name</p>
                      <p className="font-semibold text-white">{studentData['NAME'] || studentData['Name'] || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Branch & Sec</p>
                      <p className="font-semibold text-white">{studentData['BRANCH'] || '-'} / {studentData['SECTION'] || '-'}</p>
                    </div>
                  </div>
                  <div className="h-px w-full bg-white/10"></div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block mb-2">Select Date</label>
                      <div className="relative">
                        <input type="date" value={selectedDate} onChange={handleDateChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white font-semibold focus:outline-none focus:border-brand-teal/50 [color-scheme:dark]" />
                        <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    {selectedDate && (
                      <>
                        {/* FN (FORENOON - 4 PERIODS) */}
                        <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">FN (Forenoon - 4 Periods)</span>
                            <div className="flex gap-1.5">
                              <button type="button" onClick={() => setAttendanceData(p => ({ ...p, p1: 'P', p2: 'P', p3: 'P', p4: 'P', fn: 'P' }))} className="text-[9px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded font-bold hover:bg-emerald-500/50 cursor-pointer">All P</button>
                              <button type="button" onClick={() => setAttendanceData(p => ({ ...p, p1: 'A', p2: 'A', p3: 'A', p4: 'A', fn: 'A' }))} className="text-[9px] bg-red-500/30 text-red-300 px-2 py-0.5 rounded font-bold hover:bg-red-500/50 cursor-pointer">All A</button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {['p1', 'p2', 'p3', 'p4'].map((pKey, i) => (
                              <div key={pKey}>
                                <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1">P{i + 1}</label>
                                <select value={attendanceData[pKey]} onChange={(e) => handlePeriodChange(pKey, e.target.value, 'fn')} className="w-full bg-[#10101b] border border-white/10 rounded-lg px-2 py-2 text-white text-xs font-semibold focus:outline-none focus:border-brand-teal/50">
                                  <option value="">No Change</option>
                                  <option value="P">Present (P)</option>
                                  <option value="A">Absent (A)</option>
                                  <option value="DELETE">Remove</option>
                                </select>
                              </div>
                            ))}
                          </div>

                          <div>
                            <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1">FN Overall Status</label>
                            <select value={attendanceData.fn} onChange={(e) => setAttendanceData(p => ({ ...p, fn: e.target.value }))} className="w-full bg-[#10101b] border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-brand-teal/50">
                              <option value="">No Change / Empty</option>
                              <option value="P">Present (P)</option>
                              <option value="A">Absent (A)</option>
                              <option value="DELETE">Remove/Clear Entry</option>
                            </select>
                          </div>
                        </div>

                        {/* AN (AFTERNOON - 2 PERIODS) */}
                        <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">AN (Afternoon - 2 Periods)</span>
                            <div className="flex gap-1.5">
                              <button type="button" onClick={() => setAttendanceData(p => ({ ...p, p5: 'P', p6: 'P', an: 'P' }))} className="text-[9px] bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded font-bold hover:bg-purple-500/50 cursor-pointer">All P</button>
                              <button type="button" onClick={() => setAttendanceData(p => ({ ...p, p5: 'A', p6: 'A', an: 'A' }))} className="text-[9px] bg-red-500/30 text-red-300 px-2 py-0.5 rounded font-bold hover:bg-red-500/50 cursor-pointer">All A</button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {['p5', 'p6'].map((pKey, i) => (
                              <div key={pKey}>
                                <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1">P{i + 5}</label>
                                <select value={attendanceData[pKey]} onChange={(e) => handlePeriodChange(pKey, e.target.value, 'an')} className="w-full bg-[#10101b] border border-white/10 rounded-lg px-2 py-2 text-white text-xs font-semibold focus:outline-none focus:border-brand-teal/50">
                                  <option value="">No Change</option>
                                  <option value="P">Present (P)</option>
                                  <option value="A">Absent (A)</option>
                                  <option value="DELETE">Remove</option>
                                </select>
                              </div>
                            ))}
                          </div>

                          <div>
                            <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1">AN Overall Status</label>
                            <select value={attendanceData.an} onChange={(e) => setAttendanceData(p => ({ ...p, an: e.target.value }))} className="w-full bg-[#10101b] border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-brand-teal/50">
                              <option value="">No Change / Empty</option>
                              <option value="P">Present (P)</option>
                              <option value="A">Absent (A)</option>
                              <option value="DELETE">Remove/Clear Entry</option>
                            </select>
                          </div>
                        </div>

                        <button onClick={handleUpdateAttendance} disabled={updatingAttendance || (!attendanceData.fn && !attendanceData.p1 && !attendanceData.p2 && !attendanceData.p3 && !attendanceData.p4 && !attendanceData.an && !attendanceData.p5 && !attendanceData.p6)} className="w-full py-3 rounded-xl bg-brand-teal text-black font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                          {updatingAttendance ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update Live Sheet
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
