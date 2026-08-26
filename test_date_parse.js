const baseDates = [
  "WED APR 08 2026 053000 GMT0530 INDIA STANDARD TIME",
  "SUN NOV 08 2026 053000 GMT0530 INDIA STANDARD TIME",
  "THU OCT 08 2026 053000 GMT0530 INDIA STANDARD TIME"
];

for (let baseDate of baseDates) {
  let originalBaseDate = baseDate;
  try {
    let fixedStr = baseDate.replace(/(\d{2})(\d{2})(\d{2}) GMT/, '$1:$2:$3 GMT');
    console.log("fixedStr:", fixedStr);
    let d = new Date(fixedStr);
    console.log("Date from fixedStr:", d);
    if (isNaN(d.getTime())) {
      d = new Date(baseDate);
    }
    
    if (!isNaN(d.getTime())) {
      const actualDay = String(d.getMonth() + 1).padStart(2, '0');
      const actualMonth = String(d.getDate()).padStart(2, '0');
      const actualYear = d.getFullYear();
      baseDate = `${actualDay}-${actualMonth}-${actualYear}`;
    } else {
      const parts = baseDate.split(' ');
      if (parts.length >= 4) {
        const monthStr = parts[1];
        const dayStr = parts[2];
        const yearStr = parts[3];
        const monthIndex = new Date(`${monthStr} 1, 2000`).getMonth() + 1;
        if (!isNaN(monthIndex)) {
          baseDate = `${String(monthIndex).padStart(2, '0')}-${dayStr.padStart(2, '0')}-${yearStr}`;
        }
      }
    }
  } catch(e) {
    console.error('Date parse error:', e);
  }
  console.log("Original:", originalBaseDate, "=>", baseDate);
}
