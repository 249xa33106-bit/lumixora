
const attendanceData = {
  'Batch - 1': 'A',
  'batch': 'B',
  'Batch': 'C',
  'Batch(1)': 'D',
  'ITCA-NON ITCA': 'Python-3'
};

let totalDays = 0;
Object.entries(attendanceData).forEach(([key, value]) => {
  const normalized = key.replace(/\s+/g, '').toLowerCase();
  const isStatic = ['lastupdated', 'name', 'studentname', 'branch', 'department', 'dept', 'rollno', 'rollnumber', 'section', 'year', 'no', 'sno', 'slno', 'category', 'percentage', '%', 'totalclasses', 'noofclassespresent', 'noofabsent', 'gender', 'dob', 'phone', 'email', 'batch'].includes(normalized) || normalized.includes('itca') || normalized.includes('batch');
  if (isStatic || key.includes('__EMPTY') || normalized.startsWith('column_')) {
    console.log('Skipping:', key);
    return;
  }
  console.log('Counting:', key);
  totalDays++;
});
console.log('Total Days:', totalDays);

