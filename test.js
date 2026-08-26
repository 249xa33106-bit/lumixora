const key = 'THU OCT 08 2026 053000 GMT0530 INDIA STANDARD TIME FN';
let baseDate = key;
const upperKey = key.toUpperCase();
if (/\b(?:FN|AM)\b/.test(upperKey)) {
  baseDate = key.replace(/\b(?:FN|AM)\b/i, '').trim();
}
console.log('After FN replace:', baseDate);

let processed = false;
if (baseDate.length > 20 && (baseDate.includes('GMT') || baseDate.includes('INDIA') || baseDate.includes('Standard Time') || baseDate.includes('STANDARD TIME'))) {
  try {
    let fixedStr = baseDate.replace(/(\d{2})(\d{2})(\d{2}) GMT/, '$1:$2:$3 GMT');
    console.log('After fixedStr:', fixedStr);
    let parsed = new Date(fixedStr);
    console.log('parsed Date:', parsed);
    if (!isNaN(parsed.getTime())) {
      const d = String(parsed.getDate()).padStart(2, '0');
      const m = String(parsed.getMonth() + 1).padStart(2, '0');
      const y = parsed.getFullYear();
      baseDate = d + '-' + m + '-' + y;
      processed = true;
    }
    if (!processed) {
      const match = baseDate.match(/(?:[a-z]{3}\s+)?([a-z]{3})\s+(\d{1,2})\s+(\d{4})/i);
      console.log('Regex match:', match);
      if (match) {
        const monthStr = match[1].toUpperCase();
        const dayStr = match[2];
        const yearStr = match[3];
        const monthMap = { 'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12' };
        const mm = monthMap[monthStr];
        if (mm) {
          baseDate = dayStr.padStart(2, '0') + '-' + mm + '-' + yearStr;
        }
      }
    }
  } catch(e) {
    console.log(e);
  }
}
console.log('Final baseDate:', baseDate);
