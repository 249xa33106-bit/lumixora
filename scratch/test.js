
let baseDate = 'WED APR 08 2026 053000 GMT0530 INDIA STANDARD TIME';
let processed = false;
let fixedStr = baseDate.replace(/(\d{2})(\d{2})(\d{2}) GMT/, '$1:$2:$3 GMT');
let d = new Date(fixedStr);
if (isNaN(d.getTime())) { d = new Date(baseDate); }
if (!isNaN(d.getTime())) {
  const actualDay = String(d.getDate()).padStart(2, '0');
  const actualMonth = String(d.getMonth() + 1).padStart(2, '0');
  const actualYear = d.getFullYear();
  baseDate = actualDay + '-' + actualMonth + '-' + actualYear;
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
    if (mm) { baseDate = dayStr.padStart(2, '0') + '-' + mm + '-' + yearStr; }
  }
}
console.log(baseDate);

