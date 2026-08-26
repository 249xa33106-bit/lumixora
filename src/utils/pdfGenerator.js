import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to determine status and colors
const getAttendanceStatus = (percentage) => {
  if (percentage >= 90) return { label: 'Excellent', color: [0, 200, 83] }; // Green
  if (percentage >= 75) return { label: 'Good', color: [41, 121, 255] }; // Blue
  if (percentage >= 60) return { label: 'Needs Attention', color: [255, 145, 0] }; // Orange
  return { label: 'Critical', color: [213, 0, 0] }; // Red
};

// Math calculation for required consecutive classes to reach 75%
const calculateClassesNeeded = (present, total, target = 0.75) => {
  const currentPct = total > 0 ? present / total : 0;
  if (currentPct >= target) return 0;
  
  // (present + x) / (total + x) = 0.75
  // present + x = 0.75 * total + 0.75 * x
  // 0.25 * x = 0.75 * total - present
  // x = (0.75 * total - present) / 0.25
  const needed = (target * total - present) / (1 - target);
  return Math.ceil(needed);
};

export const generateAttendanceReport = async (studentData, rollNumber) => {
  if (!studentData) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // 1. Parse Data
  let totalDays = 0;
  let presentDays = 0;
  const history = [];
  const monthlyStats = {}; // { 'Aug 2026': { total: 0, present: 0 } }

  Object.entries(studentData).forEach(([key, value]) => {
    const normalized = key.replace(/\s+/g, '').toLowerCase();
    const isStatic = [
      'lastupdated', 'name', 'studentname', 'branch', 'department', 'dept', 'rollno', 'rollnumber', 
      'section', 'year', 'no', 'sno', 'slno', 'itca/nonitca', 
      'itcanonitca', 'itcanon_itca', 'category', 'percentage', 
      '%', 'totalclasses', 'noofclassespresent', 'noofabsent', 'gender', 'dob', 'phone', 'email', 'batch'
    ].includes(normalized) || normalized.includes('itca') || normalized.includes('batch');

    if (!isStatic && !key.includes('__EMPTY') && !normalized.startsWith('column_')) {
      totalDays++;
      const v = String(value || '').trim().toUpperCase();
      const isPresent = v === 'P' || v === '1' || v === 'TRUE' || v === 'PRESENT' || v === '-' || v === '';
      
      if (isPresent) presentDays++;

      let baseDate = key;
      const upperKey = key.toUpperCase();
      
      if (/\b(?:FN|AM)\b/.test(upperKey)) {
        baseDate = key.replace(/\b(?:FN|AM)\b/i, '').trim();
      } else if (/\b(?:AN|AF|PM)\b/.test(upperKey)) {
        baseDate = key.replace(/\b(?:AN|AF|PM)\b/i, '').trim();
      }
      baseDate = baseDate.replace(/^[-_()\s]+|[-_()\s]+$/g, '');

      if (baseDate.length > 20 && (baseDate.includes('GMT') || baseDate.includes('INDIA') || baseDate.includes('Standard Time') || baseDate.includes('STANDARD TIME'))) {
        try {
          let fixedStr = baseDate.replace(/(\d{2})(\d{2})(\d{2}) GMT/, '$1:$2:$3 GMT');
          let d = new Date(fixedStr);
          if (isNaN(d.getTime())) {
            d = new Date(baseDate);
          }
          let processed = false;
          if (!isNaN(d.getTime())) {
            const actualDay = String(d.getDate()).padStart(2, '0');
            const actualMonth = String(d.getMonth() + 1).padStart(2, '0');
            const actualYear = d.getFullYear();
            baseDate = `${actualMonth}-${actualDay}-${actualYear}`; // Swap month and day
            processed = true;
          } 
          if (!processed) {
            const match = baseDate.match(/(?:[a-z]{3}\s+)?([a-z]{3})\s+(\d{1,2})\s+(\d{4})/i);
            if (match) {
              const monthStr = match[1].toUpperCase();
              const dayStr = match[2];
              const yearStr = match[3];
              const monthMap = { 'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12' };
              const mm = monthMap[monthStr];
              if (mm) {
                baseDate = `${mm}-${dayStr.padStart(2, '0')}-${yearStr}`; // Swap month and day
              }
            }
          }
        } catch(e) {
          console.error(e);
        }
      }

      history.push({ date: baseDate, status: isPresent ? 'Present' : 'Absent', rawKey: key });

      // Monthly Breakdown
      // Try to extract month/year from DD-MM-YYYY or MM/DD/YYYY
      let monthYear = 'Unknown';
      const dateParts = baseDate.split(/[-/]/);
      if (dateParts.length >= 3) {
        // Assuming DD-MM-YYYY format mostly from Excel
        const monthIndex = parseInt(dateParts[1], 10) - 1;
        const year = dateParts[2].split(' ')[0]; // Handle '2026 FN'
        if (!isNaN(monthIndex) && monthIndex >= 0 && monthIndex <= 11) {
          const dateObj = new Date(year, monthIndex, 1);
          monthYear = dateObj.toLocaleString('default', { month: 'short', year: 'numeric' });
        }
      }

      if (!monthlyStats[monthYear]) {
        monthlyStats[monthYear] = { total: 0, present: 0 };
      }
      monthlyStats[monthYear].total++;
      if (isPresent) monthlyStats[monthYear].present++;
    }
  });

  const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  const statusInfo = getAttendanceStatus(percentage);
  const shortage = percentage < 75 ? 75 - percentage : 0;
  const consecutiveNeeded = calculateClassesNeeded(presentDays, totalDays, 0.75);

  // 2. Generate PDF

  // --- HEADER ---
  doc.setFillColor(15, 17, 21); // Dark theme header
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("LUMIXORA", 14, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text("OFFICIAL ATTENDANCE REPORT", pageWidth - 75, 25);

  // --- SECTION 1: STUDENT PROFILE ---
  let yPos = 55;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("1. Student Profile", 14, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const findValue = (keywords) => {
    const keys = Object.keys(studentData);
    const normalizedKeys = keys.map(k => k.replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
    
    // 1. Try exact match
    let idx = normalizedKeys.findIndex(nk => keywords.includes(nk));
    
    // 2. Try partial match
    if (idx === -1) {
       idx = normalizedKeys.findIndex(nk => keywords.some(kw => nk.includes(kw)));
    }
    
    return idx !== -1 ? studentData[keys[idx]] : 'Unknown';
  };

  const studentName = findValue(['nameofthestudent', 'studentname', 'name']);
  let branch = findValue(['branch', 'department']);
  let year = findValue(['year']);
  if (rollNumber && String(rollNumber).includes('249')) {
    year = '3rd';
  }
  let section = findValue(['section']);

  // Extract section from branch if missing but appended (e.g., "CSM C")
  if (section === 'Unknown' && branch !== 'Unknown') {
    const parts = branch.trim().split(/\s+/);
    const lastPart = parts[parts.length - 1];
    // A section is typically 1-2 characters (e.g., 'A', 'B', 'C', 'S1')
    if (parts.length > 1 && lastPart.length <= 2) {
      section = parts.pop();
      branch = parts.join(' ');
    }
  }
  const generationDate = new Date().toLocaleDateString('en-GB');

  const profileBody = [
    ['Student Name:', studentName],
    ['Roll Number:', rollNumber]
  ];
  
  if (branch !== 'Unknown') {
    profileBody.push(['Department:', branch]);
  }
  
  if (year !== 'Unknown' || section !== 'Unknown') {
    const ys = [];
    if (year !== 'Unknown') ys.push(`Year ${year}`);
    if (section !== 'Unknown') ys.push(`Sec ${section}`);
    profileBody.push(['Year / Section:', ys.join(' / ')]);
  }
  
  profileBody.push(['Report Generated:', generationDate]);

  autoTable(doc, {
    startY: yPos,
    theme: 'plain',
    styles: { cellPadding: 2, fontSize: 10, textColor: [40, 40, 40] },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
    body: profileBody,
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // --- SECTION 2: ATTENDANCE SUMMARY ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("2. Attendance Summary", 14, yPos);
  
  yPos += 10;
  autoTable(doc, {
    startY: yPos,
    theme: 'grid',
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    body: [
      ['Total Classes Held', totalDays.toString()],
      ['Classes Attended', presentDays.toString()],
      ['Classes Absent', (totalDays - presentDays).toString()],
      ['Current Attendance', `${percentage}%`],
      ['Required Attendance', '75%'],
    ],
  });

  yPos = doc.lastAutoTable.finalY + 10;
  
  // Status Box
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...statusInfo.color);
  doc.text(`Status: ${statusInfo.label}`, 14, yPos);
  
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  if (shortage > 0) {
    yPos += 8;
    doc.text(`Shortage: ${shortage}%`, 14, yPos);
    yPos += 8;
    doc.text(`Classes required to attend consecutively to reach 75%: ${consecutiveNeeded}`, 14, yPos);
  }

  yPos += 20;

  // --- SECTION 3: MONTHLY BREAKDOWN ---
  if (yPos > 250) { doc.addPage(); yPos = 20; }
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("3. Monthly Breakdown", 14, yPos);
  
  const monthlyBody = Object.entries(monthlyStats).map(([month, stats]) => {
    const p = Math.round((stats.present / stats.total) * 100);
    return [month, stats.total.toString(), stats.present.toString(), `${p}%`];
  });

  yPos += 10;
  autoTable(doc, {
    startY: yPos,
    theme: 'striped',
    headStyles: { fillColor: [0, 245, 212], textColor: [0, 0, 0] },
    head: [['Month', 'Total Classes', 'Attended', 'Percentage']],
    body: monthlyBody.length > 0 ? monthlyBody : [['No data', '-', '-', '-']],
  });

  yPos = doc.lastAutoTable.finalY + 20;

  // --- SECTION 4: TREND ---
  if (yPos > 200) { doc.addPage(); yPos = 20; }
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("4. Attendance Trend", 14, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  // Calculate trend from last 5 classes
  const recentHistory = history.slice(-5);
  const recentPresent = recentHistory.filter(h => h.status === 'Present').length;
  const recentPct = recentHistory.length > 0 ? Math.round((recentPresent / recentHistory.length) * 100) : 0;
  
  let trendText = "Not enough data for trend analysis.";
  if (recentHistory.length > 0) {
    if (recentPct >= 80) trendText = `Upward Trend: Student has attended ${recentPct}% of the last ${recentHistory.length} classes.`;
    else if (recentPct < 50) trendText = `Downward Trend: Student has missed several recent classes (Attended ${recentPct}% of last ${recentHistory.length}).`;
    else trendText = `Stable Trend: Student is maintaining average attendance recently (${recentPct}%).`;
  }
  
  doc.text(trendText, 14, yPos);
  yPos += 10;

  // Generate QuickChart graph
  if (history.length > 0) {
    try {
      const labels = [];
      const cumulativePct = [];
      let cumPresent = 0;
      
      history.forEach((h, i) => {
        labels.push(h.date);
        if (h.status === 'Present') cumPresent++;
        cumulativePct.push(Math.round((cumPresent / (i + 1)) * 100));
      });

      const chartConfig = {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Cumulative Attendance %',
            data: cumulativePct,
            fill: true,
            backgroundColor: 'rgba(0, 245, 212, 0.2)',
            borderColor: 'rgba(0, 245, 212, 1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 2
          }]
        },
        options: {
          scales: {
            y: { min: 0, max: 100, title: { display: true, text: 'Percentage (%)' } }
          },
          plugins: {
            legend: { position: 'top' }
          }
        }
      };

      const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
      const chartUrl = `https://quickchart.io/chart?c=${encodedConfig}&w=500&h=250&format=png&bkg=white`;
      
      const response = await fetch(chartUrl);
      const blob = await response.blob();
      
      const base64data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => resolve(reader.result);
      });
      
      doc.addImage(base64data, 'PNG', 14, yPos, 180, 90);
      yPos += 95;
    } catch (err) {
      console.error("Failed to fetch chart", err);
    }
  }
  
  yPos += 10;

  // --- SECTION 5: COMPLETE HISTORY ---
  if (yPos > 250) { doc.addPage(); yPos = 20; }
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("5. Complete Attendance History", 14, yPos);
  
  const historyBody = history.map(h => [h.date, h.status]);
  
  yPos += 10;
  autoTable(doc, {
    startY: yPos,
    theme: 'grid',
    headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255] },
    head: [['Date', 'Status']],
    body: historyBody,
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 1) {
        if (data.cell.raw === 'Absent') {
          data.cell.styles.textColor = [213, 0, 0];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [0, 150, 50];
        }
      }
    }
  });

  // --- FOOTER ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated by Lumixora Founder Portal | Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  }

  // Save PDF
  doc.save(`Attendance_Report_${rollNumber}.pdf`);
};

export const generateFilteredListReport = (students, condition, threshold) => {
  if (!students || students.length === 0) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Filtered Attendance Report", 14, 20);

  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  if (condition.toLowerCase() === 'overall') {
    doc.text(`Condition: Overall College Report`, 14, 28);
  } else {
    doc.text(`Condition: ${condition.toUpperCase()} ${threshold}%`, 14, 28);
  }
  doc.text(`Total Students: ${students.length}`, 14, 34);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);

  // Table
  const tableBody = students.map((s, index) => [
    index + 1,
    s.id,
    s.name,
    s.branch,
    `${s.percent}%`
  ]);

  autoTable(doc, {
    startY: 50,
    theme: 'striped',
    headStyles: { fillColor: [41, 121, 255], textColor: [255, 255, 255] },
    head: [['S.No', 'Roll Number', 'Name', 'Branch', 'Attendance']],
    body: tableBody,
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 4) {
        const pct = parseFloat(data.cell.raw);
        if (pct < 60) data.cell.styles.textColor = [213, 0, 0];
        else if (pct < 75) data.cell.styles.textColor = [255, 145, 0];
        else data.cell.styles.textColor = [0, 200, 83];
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated by Lumixora Founder Portal | Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  }

  doc.save(`Filtered_Attendance_${condition}_${threshold}pct.pdf`);
};

export const generateTestResultsPDF = ({ results, filters = {}, institutionName = 'G. Pulla Reddy Engineering College (Autonomous)' }) => {
  if (!results || results.length === 0) return;

  const doc = new jsPDF({ orientation: 'landscape' });
  const pageWidth = doc.internal.pageSize.width;

  // 1. Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(institutionName.toUpperCase(), 14, 12);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(56, 189, 248); // Sky blue
  doc.text("DEPARTMENTAL ASSESSMENT & TEST RESULTS REPORT", 14, 20);

  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  const printDate = new Date().toLocaleString();
  doc.text(`Generated: ${printDate}`, pageWidth - 14, 20, { align: 'right' });

  // 2. Filter & Stats Summary Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 33, pageWidth - 28, 24, 3, 3, 'FD');

  const testTitle = filters.testTitle || 'All Test Assessments';
  const branchText = filters.branch && filters.branch !== 'All' ? filters.branch : 'All Branches';
  const yearText = filters.year && filters.year !== 'All' ? filters.year : 'All Years';
  const semText = filters.sem && filters.sem !== 'All' ? filters.sem : 'All Semesters';
  const secText = filters.sec && filters.sec !== 'All' ? filters.sec : 'All Sections';

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Test Name:`, 18, 41);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(testTitle, 40, 41);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Branch:`, 18, 51);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(branchText, 35, 51);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Year:`, 75, 51);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(yearText, 86, 51);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Semester:`, 120, 51);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(semText, 140, 51);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Section:`, 180, 51);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(secText, 196, 51);

  // Statistics calculation
  const totalSubmissions = results.length;
  let totalScoreSum = 0;
  let maxScore = 0;
  let totalPossibleSum = 0;
  let passCount = 0;

  results.forEach(r => {
    const sc = Number(r.score) || 0;
    const tot = Number(r.total) || 1;
    totalScoreSum += sc;
    totalPossibleSum += tot;
    if (sc > maxScore) maxScore = sc;
    const pct = (sc / tot) * 100;
    if (pct >= 40) passCount++;
  });

  const avgPct = totalPossibleSum > 0 ? ((totalScoreSum / totalPossibleSum) * 100).toFixed(1) : '0';
  const passRate = totalSubmissions > 0 ? ((passCount / totalSubmissions) * 100).toFixed(1) : '0';

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Candidates:`, pageWidth - 80, 41);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(`${totalSubmissions}`, pageWidth - 55, 41);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Class Avg:`, pageWidth - 80, 51);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(`${avgPct}%`, pageWidth - 58, 51);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Pass Rate:`, pageWidth - 42, 51);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(37, 99, 235); // Blue
  doc.text(`${passRate}%`, pageWidth - 20, 51);

  // 3. Table Rows
  const sorted = [...results].sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));

  const tableBody = sorted.map((s, idx) => {
    const score = Number(s.score) || 0;
    const total = Number(s.total) || 1;
    const pct = ((score / total) * 100).toFixed(1);
    
    let grade = 'Needs Attention';
    if (pct >= 85) grade = 'Outstanding';
    else if (pct >= 70) grade = 'Distinction';
    else if (pct >= 55) grade = 'First Class';
    else if (pct >= 40) grade = 'Pass';

    const branch = s.branch || s.department || 'CSE';
    const yrSec = `${s.year || '1st Yr'} · Sec ${s.sec || s.section || 'A'}`;
    const dateStr = s.date ? new Date(s.date).toLocaleDateString() : '-';

    return [
      idx + 1,
      s.rollNumber || (s.userEmail ? s.userEmail.split('@')[0].toUpperCase() : '-'),
      s.user || 'Scholar',
      s.testTitle || testTitle,
      branch,
      yrSec,
      `${score} / ${total}`,
      `${pct}%`,
      grade,
      dateStr
    ];
  });

  autoTable(doc, {
    startY: 61,
    theme: 'grid',
    headStyles: { 
      fillColor: [15, 23, 42], 
      textColor: [255, 255, 255], 
      fontStyle: 'bold', 
      fontSize: 8.5,
      halign: 'center'
    },
    bodyStyles: { 
      fontSize: 8, 
      textColor: [51, 65, 85] 
    },
    alternateRowStyles: { 
      fillColor: [248, 250, 252] 
    },
    head: [[
      'Rank', 
      'Roll No / ID', 
      'Student Name', 
      'Test Title', 
      'Branch', 
      'Year & Sec', 
      'Score', 
      'Percentage', 
      'Remark', 
      'Submission Date'
    ]],
    body: tableBody,
    columnStyles: {
      0: { halign: 'center', cellWidth: 14 },
      1: { halign: 'center', cellWidth: 28, fontStyle: 'bold' },
      2: { cellWidth: 42, fontStyle: 'bold' },
      3: { cellWidth: 42 },
      4: { halign: 'center', cellWidth: 20 },
      5: { halign: 'center', cellWidth: 28 },
      6: { halign: 'center', cellWidth: 20, fontStyle: 'bold' },
      7: { halign: 'center', cellWidth: 22, fontStyle: 'bold' },
      8: { halign: 'center', cellWidth: 28, fontStyle: 'bold' },
      9: { halign: 'center', cellWidth: 25 }
    },
    didParseCell: function(data) {
      if (data.section === 'body') {
        // Percentage column coloring
        if (data.column.index === 7) {
          const val = parseFloat(data.cell.raw);
          if (val >= 75) {
            data.cell.styles.textColor = [16, 185, 129]; // Green
          } else if (val >= 40) {
            data.cell.styles.textColor = [37, 99, 235]; // Blue
          } else {
            data.cell.styles.textColor = [220, 38, 38]; // Red
          }
        }
        // Grade column coloring
        if (data.column.index === 8) {
          const remark = String(data.cell.raw);
          if (remark === 'Outstanding' || remark === 'Distinction') {
            data.cell.styles.textColor = [16, 185, 129];
          } else if (remark === 'First Class' || remark === 'Pass') {
            data.cell.styles.textColor = [37, 99, 235];
          } else {
            data.cell.styles.textColor = [220, 38, 38];
          }
        }
      }
    }
  });

  // Footer & Page Numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    
    // Left footer
    doc.text("Confidential · Lumixora Academic Evaluation Engine · GPREC Academic Portal", 14, doc.internal.pageSize.height - 8);
    // Right footer
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 14, doc.internal.pageSize.height - 8, { align: 'right' });
  }

  // Safe file name
  const safeTitle = (testTitle || 'Test_Results').replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeBranch = branchText.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeTitle}_${safeBranch}_${yearText}_Results.pdf`);
};



