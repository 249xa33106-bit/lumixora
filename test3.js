const attendanceData = {
  "27-07-2026 FN": "P",
  "BRANCH": "CSM C",
  "Sun Nov 08 2026 053000 GMT0530 India Standard Time FN": "",
  "NAME": "KUMARKALAVA MOHAMMED SOWBAN",
  "28-07-2026 AN": "P",
  "21-07-2026 AN": "P",
  "Thu Oct 08 2026 053000 GMT0530 India Standard Time FN": "",
  "13-07-2026 FN": "P",
  "14-07-2026 FN": "P",
  "Wed Apr 08 2026 053000 GMT0530 India Standard Time AN": "",
  "14-07-2026 AN": "P",
  "20-07-2026 AN": "P",
  "21-07-2026 FN": "P",
  "ROLL NO": "249XA33106",
  "13-07-2026 AN": "P",
  "Wed Apr 08 2026 053000 GMT0530 India Standard Time FN": "",
  "27-07-2026 AN": "P",
  "20-07-2026 FN": "P",
  "28-07-2026 FN": "P",
  "Thu Oct 08 2026 053000 GMT0530 India Standard Time AN": "",
  "NO": "49",
  "Sun Nov 08 2026 053000 GMT0530 India Standard Time AN": "",
  "ITCA-NON ITCA": "Python-3"
};

let totalDays = 0;
let presentDays = 0;

const grouped = {};

Object.entries(attendanceData).forEach(([key, value]) => {
  const normalized = key.replace(/\s+/g, '').toLowerCase();
  const isStatic = ['lastupdated', 'name', 'studentname', 'branch', 'department', 'dept', 'rollno', 'rollnumber', 'section', 'year', 'no', 'sno', 'slno', 'category', 'percentage', '%', 'totalclasses', 'noofclassespresent', 'noofabsent', 'gender', 'dob', 'phone', 'email', 'batch'].includes(normalized) || normalized.includes('itca') || normalized.includes('batch');
  
  if (!isStatic && !key.includes('__EMPTY') && !normalized.startsWith('column_')) {
    totalDays++;
    const upperVal = String(value).trim().toUpperCase();
    if (upperVal === 'P' || upperVal === '1' || upperVal === 'TRUE' || upperVal === 'PRESENT' || upperVal === '-') {
      presentDays++;
    }
  }

  if (isStatic || key.includes('__EMPTY') || normalized.startsWith('column_')) return;

  let baseDate = key;
  let period = 'Full Day';
  const upperKey = key.toUpperCase();

  if (/\b(?:FN|AM)\b/.test(upperKey)) {
    baseDate = key.replace(/\b(?:FN|AM)\b/i, '').trim();
    period = 'FN';
  } else if (/\b(?:AN|AF|PM)\b/.test(upperKey)) {
    baseDate = key.replace(/\b(?:AN|AF|PM)\b/i, '').trim();
    period = 'AN';
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
        baseDate = `${actualDay}-${actualMonth}-${actualYear}`;
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
            baseDate = `${dayStr.padStart(2, '0')}-${mm}-${yearStr}`;
          }
        }
      }
    } catch(e) {
      console.error('Date parse error:', e);
    }
  }

  if (!grouped[baseDate]) {
    grouped[baseDate] = {};
  }
  grouped[baseDate][period] = value;
});

console.log('Total Days:', totalDays);
console.log('Present Days:', presentDays);
console.log('Grouped Dates:', Object.keys(grouped));
