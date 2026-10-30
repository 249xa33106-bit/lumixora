const path = require('path');
const fs = require('fs');
const { getDatabase } = require('../db/database');
const { PHOTOS_DIR, DOCUMENTS_DIR, STATUSES } = require('../config/config');

function getApplicants(req, res) {
  try {
    const { domain, status, degree, graduationYear, search } = req.query;
    const db = getDatabase();

    const applicants = db.getApplications({
      domain,
      status,
      degree,
      graduationYear,
      search
    });

    return res.status(200).json({
      success: true,
      count: applicants.length,
      applicants
    });
  } catch (err) {
    console.error('Error fetching applicants:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve applicant list.'
    });
  }
}

function getApplicantById(req, res) {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const applicant = db.getApplicationById(id);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      applicant
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve applicant record.'
    });
  }
}

function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${STATUSES.join(', ')}`
      });
    }

    const db = getDatabase();
    const updated = db.updateApplicationStatus(id, status, req.user?.name || 'Administrator');

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Applicant record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Application status successfully updated to "${status}".`,
      applicant: updated
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update application status.'
    });
  }
}

function addInternalNote(req, res) {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note content cannot be empty.'
      });
    }

    const db = getDatabase();
    const newNote = db.addInternalNote(id, note.trim(), req.user?.name || 'Administrator');

    if (!newNote) {
      return res.status(404).json({
        success: false,
        message: 'Applicant record not found.'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Internal recruitment note added.',
      note: newNote
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add internal note.'
    });
  }
}

function getMetrics(req, res) {
  try {
    const db = getDatabase();
    const metrics = db.getMetrics();
    return res.status(200).json({
      success: true,
      metrics
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to compute dashboard metrics.'
    });
  }
}

function exportCsv(req, res) {
  try {
    const db = getDatabase();
    const applicants = db.getApplications(req.query);

    const headers = [
      'Application ID',
      'Full Name',
      'Email',
      'Mobile Number',
      'WhatsApp Number',
      'Date of Birth',
      'Gender',
      'City',
      'State',
      'Country',
      'College / University',
      'Degree',
      'Department / Branch',
      'Year of Study',
      'Semester',
      'Graduation Year',
      'College Location',
      'Roll Number',
      'Preferred Domain',
      'Secondary Domain',
      'Working Arrangement',
      'Internship Duration',
      'Expected Joining Date',
      'Status',
      'LinkedIn URL',
      'GitHub URL',
      'Portfolio URL',
      'Instagram URL',
      'Submitted At'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = applicants.map(a => [
      escapeCsv(a.id),
      escapeCsv(a.personal?.fullName),
      escapeCsv(a.personal?.email),
      escapeCsv(a.personal?.mobileNumber),
      escapeCsv(a.personal?.whatsappNumber),
      escapeCsv(a.personal?.dob),
      escapeCsv(a.personal?.gender),
      escapeCsv(a.personal?.city),
      escapeCsv(a.personal?.state),
      escapeCsv(a.personal?.country),
      escapeCsv(a.education?.collegeName),
      escapeCsv(a.education?.degree),
      escapeCsv(a.education?.department),
      escapeCsv(a.education?.currentYear),
      escapeCsv(a.education?.currentSemester),
      escapeCsv(a.education?.graduationYear),
      escapeCsv(a.education?.collegeLocation),
      escapeCsv(a.education?.rollNumber),
      escapeCsv(a.preferences?.preferredDomain),
      escapeCsv(a.preferences?.secondaryDomain),
      escapeCsv(a.preferences?.workingArrangement),
      escapeCsv(a.preferences?.duration),
      escapeCsv(a.preferences?.expectedJoiningDate),
      escapeCsv(a.status),
      escapeCsv(a.social?.linkedin),
      escapeCsv(a.social?.github),
      escapeCsv(a.social?.portfolio),
      escapeCsv(a.social?.instagram),
      escapeCsv(a.createdAt)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="lumixora_applicants_${new Date().toISOString().slice(0, 10)}.csv"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    console.error('CSV export error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate applicant CSV export.'
    });
  }
}

// Secure file access controller
function serveSecureFile(req, res) {
  try {
    const { type, filename } = req.params;
    // Prevent directory traversal
    const safeFilename = path.basename(filename);

    let baseDir = DOCUMENTS_DIR;
    if (type === 'photo') {
      baseDir = PHOTOS_DIR;
    }

    const fullPath = path.join(baseDir, safeFilename);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: 'The requested document or file does not exist on storage.'
      });
    }

    const ext = path.extname(safeFilename).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';

    res.setHeader('Content-Type', contentType);
    if (req.query.download === 'true') {
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    } else {
      res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
    }

    const fileStream = fs.createReadStream(fullPath);
    return fileStream.pipe(res);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to read file from secure storage.'
    });
  }
}

module.exports = {
  getApplicants,
  getApplicantById,
  updateApplicationStatus,
  addInternalNote,
  getMetrics,
  exportCsv,
  serveSecureFile
};
