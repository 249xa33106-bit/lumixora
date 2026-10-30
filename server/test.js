const http = require('http');
const fs = require('fs');
const path = require('path');
const { app, server } = require('./server');

const BASE_URL = 'http://localhost:5000';

function makeRequest(method, endpoint, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let parsed = data;
        try {
          parsed = JSON.parse(data);
        } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });

    req.on('error', reject);

    if (body) {
      if (Buffer.isBuffer(body) || typeof body === 'string') {
        req.write(body);
      } else {
        req.write(JSON.stringify(body));
      }
    }
    req.end();
  });
}

// Multipart builder helper
function buildMultipart(fields, files) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substring(2);
  const chunks = [];

  for (const [key, val] of Object.entries(fields)) {
    chunks.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${val}\r\n`
    ));
  }

  for (const file of files) {
    chunks.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${file.field}"; filename="${file.filename}"\r\nContent-Type: ${file.contentType}\r\n\r\n`
    ));
    chunks.push(file.buffer);
    chunks.push(Buffer.from('\r\n'));
  }

  chunks.push(Buffer.from(`--${boundary}--\r\n`));
  const fullBody = Buffer.concat(chunks);

  return {
    contentType: `multipart/form-data; boundary=${boundary}`,
    body: fullBody
  };
}

async function runTests() {
  console.log('--- Starting Automated Test Suite for Lumixora Internship Portal ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    console.log('\n[1] Health Check');
    const health = await makeRequest('GET', '/api/health');
    assert(health.status === 200 && health.body.status === 'ok', 'Server is healthy');

    // 2. Admin Login
    console.log('\n[2] Admin Authentication');
    const loginRes = await makeRequest('POST', '/api/auth/login', { 'Content-Type': 'application/json' }, {
      email: 'admin@lumixora.com',
      password: 'LumixoraAdmin2026!'
    });
    assert(loginRes.status === 200, 'Admin login succeeds with default credentials');
    assert(!!loginRes.body.token, 'Admin receives JWT token');
    const adminToken = loginRes.body.token;

    // 3. Unauthorized access check
    console.log('\n[3] Security & Route Protection');
    const unauthRes = await makeRequest('GET', '/api/admin/applicants');
    assert(unauthRes.status === 401, 'Protected applicant endpoint rejects request without token');

    const authRes = await makeRequest('GET', '/api/admin/applicants', {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(authRes.status === 200 && Array.isArray(authRes.body.applicants), 'Protected endpoint allows authorized admin');

    // 4. Form validation failure on missing fields
    console.log('\n[4] Application Submission Validation');
    const invalidSubmit = await makeRequest('POST', '/api/applications/apply', { 'Content-Type': 'application/json' }, {});
    assert(invalidSubmit.status === 400, 'Rejects empty submission with 400 Bad Request');

    // 5. Successful application submission with multipart upload
    console.log('\n[5] Full Application Submission with Photo & Documents');
    const testEmail = `candidate.${Date.now()}@example.com`;
    const payload = {
      personal: {
        fullName: 'Vikramaditya Roy',
        dob: '2004-08-12',
        gender: 'Male',
        email: testEmail,
        mobileNumber: '+91 9845012345',
        whatsappNumber: '+91 9845012345',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India'
      },
      education: {
        collegeName: 'RV College of Engineering, Bangalore',
        degree: 'B.E.',
        department: 'Information Science & Engineering',
        currentYear: '3rd Year',
        currentSemester: 'Sem 6',
        graduationYear: '2027',
        collegeLocation: 'Bengaluru, Karnataka',
        rollNumber: '1RV23IS099'
      },
      preferences: {
        preferredDomain: 'Full-Stack Web Development',
        secondaryDomain: 'Software Testing & Quality Assurance',
        whyJoin: 'Lumixora leads developer education through immersive platforms. I want to build robust web systems and test real-time collaboration engines.',
        expectationsToLearn: 'I expect to learn production architecture design, automated integration testing, and team code review practices.',
        duration: '3 Months',
        expectedJoiningDate: '2026-11-20',
        workingArrangement: 'Hybrid'
      },
      skills: {
        technicalSkills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
        programmingLanguages: ['JavaScript', 'TypeScript', 'Java'],
        toolsAndTech: ['Git', 'Vite', 'Postman'],
        experience: 'Built club website with 3000+ monthly active student visitors.',
        projects: [
          {
            title: 'CampusEvent Hub',
            description: 'Ticketing and event registration platform for college fests.',
            techStack: 'React, Express, SQLite',
            link: 'https://github.com/vikramroy/campusevent'
          }
        ]
      },
      social: {
        linkedin: 'https://linkedin.com/in/vikram-roy-dev',
        github: 'https://github.com/vikramroy',
        portfolio: 'https://vikramroy.me'
      },
      consent: {
        accuracyConfirmed: true,
        recruitmentConsent: true,
        termsAndPrivacyConsent: true
      }
    };

    const mockPhotoBuffer = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');
    const mockResumeBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF', 'utf8');

    const multipart = buildMultipart(
      { payload: JSON.stringify(payload) },
      [
        { field: 'photo', filename: 'vikram_headshot.jpg', contentType: 'image/jpeg', buffer: mockPhotoBuffer },
        { field: 'resume', filename: 'vikram_resume.pdf', contentType: 'application/pdf', buffer: mockResumeBuffer }
      ]
    );

    const submitRes = await makeRequest('POST', '/api/applications/apply', {
      'Content-Type': multipart.contentType
    }, multipart.body);

    assert(submitRes.status === 201, 'Application submitted with status 201 Created');
    assert(!!submitRes.body.applicationId, 'Application ID generated');
    assert(/^LMX-202[0-9]-[0-9]{5}$/.test(submitRes.body.applicationId), `Application ID format matches LMX-YYYY-XXXXX (${submitRes.body.applicationId})`);
    
    const newAppId = submitRes.body.applicationId;

    // 6. Duplicate submission check
    console.log('\n[6] Duplicate Submission Prevention');
    const dupRes = await makeRequest('POST', '/api/applications/apply', {
      'Content-Type': multipart.contentType
    }, multipart.body);
    assert(dupRes.status === 409, 'Duplicate submission blocked with status 409 Conflict');

    // 7. Verify photo NOT stored as Base64 in DB
    console.log('\n[7] Database Storage & Base64 Absence Verification');
    const dbApplicant = await makeRequest('GET', `/api/admin/applicants/${newAppId}`, {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(dbApplicant.status === 200, 'Admin can fetch full applicant details');
    const photoData = dbApplicant.body.applicant.personal.photo;
    assert(photoData && photoData.path && !photoData.base64 && !photoData.data, 'Photo stored as file path reference, NOT Base64 in DB');

    // 8. Application Status Tracking
    console.log('\n[8] Applicant Status Tracking');
    const trackRes = await makeRequest('POST', '/api/applications/track', { 'Content-Type': 'application/json' }, {
      email: testEmail,
      applicationId: newAppId
    });
    assert(trackRes.status === 200 && trackRes.body.application.status === 'Submitted', 'Applicant can track status using ID & Email');

    // 9. Admin Status Update & Notes
    console.log('\n[9] Admin Status Update & Internal Notes');
    const statusUpdateRes = await makeRequest('PATCH', `/api/admin/applicants/${newAppId}/status`, {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }, { status: 'Under Review' });
    assert(statusUpdateRes.status === 200 && statusUpdateRes.body.applicant.status === 'Under Review', 'Admin can update status to "Under Review"');

    const noteRes = await makeRequest('POST', `/api/admin/applicants/${newAppId}/notes`, {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }, { note: 'Strong engineering fundamentals. Resume verified.' });
    assert(noteRes.status === 201 && !!noteRes.body.note, 'Admin can add internal recruiter note');

    // 10. Secure File Download
    console.log('\n[10] Secure File Access');
    const fileRes = await makeRequest('GET', `/api/admin/files/photo/${photoData.filename}?token=${adminToken}`);
    assert(fileRes.status === 200, 'Admin can securely view/download uploaded photo');

    // 11. Metrics & CSV Export
    console.log('\n[11] Admin Metrics & CSV Export');
    const metricsRes = await makeRequest('GET', '/api/admin/metrics', {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(metricsRes.status === 200 && metricsRes.body.metrics.total >= 4, 'Metrics calculate total applicants');

    const csvRes = await makeRequest('GET', '/api/admin/export-csv', {
      'Authorization': `Bearer ${adminToken}`
    });
    assert(csvRes.status === 200 && csvRes.headers['content-type'].includes('text/csv'), 'CSV export generates proper text/csv headers');
    assert(csvRes.body.includes(newAppId), 'CSV contains the newly submitted application record');

    console.log('\n========================================');
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log('========================================');
  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  } finally {
    server.close(() => {
      console.log('Test server closed.');
      process.exit(failed > 0 ? 1 : 0);
    });
  }
}

runTests();
