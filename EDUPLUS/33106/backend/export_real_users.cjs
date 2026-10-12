const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://ykuyzkhhnltjccyzduap.supabase.co';
const supabaseAnonKey = 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function exportUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Supabase error:', error);
    process.exit(1);
  }

  const students = [];
  const seenRolls = new Set();

  data.forEach((u, index) => {
    let extra = {};
    const raw = u.name || '';
    if (raw.includes('{')) {
      try {
        extra = JSON.parse(raw.substring(raw.indexOf('{')));
      } catch (e) {}
    }
    let cleanName = raw.includes('{') ? raw.split('{')[0].trim() : raw;
    cleanName = cleanName || extra.name || (u.email ? u.email.split('@')[0] : 'Scholar ' + (index + 1));
    cleanName = cleanName.replace(/["'\\]/g, '').trim();

    let roll = extra.rollNumber || (u.email && u.email.includes('@gprec.ac.in') ? u.email.split('@')[0].toUpperCase() : null);
    if (!roll || roll.length < 5) {
      roll = '249X1A' + String(500 + index).padStart(4, '0');
    }
    roll = roll.toUpperCase();
    if (seenRolls.has(roll)) {
      roll = roll + '_' + (index + 1);
    }
    seenRolls.add(roll);

    let dept = (extra.department || extra.branch || '').toUpperCase();
    let batchId = 1;
    let batchName = 'B.Tech CSE - 2026 Alpha';
    if (dept.includes('AI') || dept.includes('ML') || dept.includes('CSM') || roll.includes('33') || roll.includes('42')) {
      batchId = 2;
      batchName = 'B.Tech AI&ML - 2026 Sigma';
    } else if (dept.includes('ECE') || dept.includes('COMM') || roll.includes('04')) {
      batchId = 3;
      batchName = 'B.Tech ECE - 2026 Zenith';
    }

    students.push({
      id: index + 1,
      student_uid: 'STU-' + (1000 + index + 1),
      full_name: cleanName,
      roll_number: roll,
      email: u.email || '',
      batch_id: batchId,
      batch_name: batchName,
      department: dept || 'CSE',
      qualification: extra.qualification || 'B.Tech',
      college: extra.college || 'GPREC'
    });
  });

  fs.writeFileSync('EDUPLUS/33106/backend/real_users.json', JSON.stringify(students, null, 2));
  console.log(`Successfully exported ${students.length} real registered scholars to real_users.json`);
}

exportUsers();
