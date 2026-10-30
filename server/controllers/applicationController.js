const path = require('path');
const fs = require('fs');
const { getDatabase } = require('../db/database');
const { ALLOWED_DOMAINS, PHOTOS_DIR, DOCUMENTS_DIR } = require('../config/config');
const emailService = require('../services/emailService');

function cleanFile(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.error('Failed to cleanup file:', filePath, e);
    }
  }
}

async function submitApplication(req, res) {
  const uploadedFiles = req.files || {};
  let bodyData = {};

  try {
    if (req.body.payload) {
      bodyData = JSON.parse(req.body.payload);
    } else {
      bodyData = req.body;
    }
  } catch (err) {
    // Clean up uploaded files on JSON parse error
    Object.values(uploadedFiles).flat().forEach(f => cleanFile(f.path));
    return res.status(400).json({
      success: false,
      message: 'Malformed application payload provided.'
    });
  }

  const { personal, education, preferences, skills, social, consent } = bodyData;

  // Validation helper
  const missing = [];
  if (!personal?.fullName?.trim()) missing.push('Full Name');
  if (!personal?.dob?.trim()) missing.push('Date of Birth');
  if (!personal?.email?.trim()) missing.push('Email Address');
  if (!personal?.mobileNumber?.trim()) missing.push('Mobile Number with country code');
  if (!personal?.city?.trim()) missing.push('Current City');
  if (!personal?.state?.trim()) missing.push('Current State');
  if (!personal?.country?.trim()) missing.push('Country');

  // Profile photo validation
  const photoFile = uploadedFiles['photo']?.[0];
  if (!photoFile) missing.push('Profile Photo (Mandatory)');

  // Education validation
  if (!education?.collegeName?.trim()) missing.push('College / University Name');
  if (!education?.degree?.trim()) missing.push('Degree');
  if (!education?.department?.trim()) missing.push('Department / Branch');
  if (!education?.currentYear?.trim()) missing.push('Current Year of Study');
  if (!education?.graduationYear?.toString().trim()) missing.push('Graduation Year');
  if (!education?.collegeLocation?.trim()) missing.push('College Location');

  // Preferences validation
  if (!preferences?.preferredDomain?.trim()) {
    missing.push('Preferred Internship Domain');
  } else if (!ALLOWED_DOMAINS.includes(preferences.preferredDomain.trim())) {
    missing.push(`Valid Preferred Domain (Must be one of the 8 approved Lumixora domains)`);
  }

  if (!preferences?.whyJoin?.trim() || preferences.whyJoin.trim().length < 20) {
    missing.push('Why do you want to join Lumixora (Minimum 20 characters)');
  }
  if (!preferences?.expectationsToLearn?.trim() || preferences.expectationsToLearn.trim().length < 20) {
    missing.push('What do you expect to learn (Minimum 20 characters)');
  }
  if (!preferences?.duration?.trim()) missing.push('Preferred Internship Duration');
  if (!preferences?.expectedJoiningDate?.trim()) missing.push('Expected Joining Date');
  if (!preferences?.workingArrangement?.trim()) missing.push('Preferred Working Arrangement');

  // Resume validation
  const resumeFile = uploadedFiles['resume']?.[0];
  if (!resumeFile) missing.push('Resume / CV PDF (Mandatory)');

  // Consent validation
  if (!consent?.accuracyConfirmed) missing.push('Confirmation that provided information is accurate');
  if (!consent?.recruitmentConsent) missing.push('Consent to processing information for recruitment');
  if (!consent?.termsAndPrivacyConsent) missing.push('Agreement to internship program terms & privacy policy');

  if (missing.length > 0) {
    // Clean up uploaded files
    Object.values(uploadedFiles).flat().forEach(f => cleanFile(f.path));
    return res.status(400).json({
      success: false,
      message: `Please complete all required fields: ${missing.join(', ')}`,
      missingFields: missing
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(personal.email.trim())) {
    Object.values(uploadedFiles).flat().forEach(f => cleanFile(f.path));
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  const db = getDatabase();

  // Check duplicate application
  const existingApp = db.isDuplicateApplication(personal.email);
  if (existingApp) {
    Object.values(uploadedFiles).flat().forEach(f => cleanFile(f.path));
    return res.status(409).json({
      success: false,
      message: `An application with email address "${personal.email}" has already been submitted (Application ID: ${existingApp.id}). To prevent duplicates, each applicant may only submit once per recruitment season. You can track your status using your Application ID.`,
      existingApplicationId: existingApp.id
    });
  }

  // Construct secure file records (DO NOT STORE BASE64 in DB)
  const photoRecord = {
    filename: photoFile.filename,
    originalName: photoFile.originalname,
    mimetype: photoFile.mimetype,
    size: photoFile.size,
    path: `photos/${photoFile.filename}`,
    uploadedAt: new Date().toISOString()
  };

  const resumeRecord = {
    filename: resumeFile.filename,
    originalName: resumeFile.originalname,
    mimetype: resumeFile.mimetype,
    size: resumeFile.size,
    path: `documents/${resumeFile.filename}`,
    uploadedAt: new Date().toISOString()
  };

  const certFile = uploadedFiles['certificates']?.[0];
  const certRecord = certFile ? {
    filename: certFile.filename,
    originalName: certFile.originalname,
    mimetype: certFile.mimetype,
    size: certFile.size,
    path: `documents/${certFile.filename}`,
    uploadedAt: new Date().toISOString()
  } : null;

  const portFile = uploadedFiles['portfolioDoc']?.[0];
  const portRecord = portFile ? {
    filename: portFile.filename,
    originalName: portFile.originalname,
    mimetype: portFile.mimetype,
    size: portFile.size,
    path: `documents/${portFile.filename}`,
    uploadedAt: new Date().toISOString()
  } : null;

  const addFile = uploadedFiles['additionalDoc']?.[0];
  const addRecord = addFile ? {
    filename: addFile.filename,
    originalName: addFile.originalname,
    mimetype: addFile.mimetype,
    size: addFile.size,
    path: `documents/${addFile.filename}`,
    uploadedAt: new Date().toISOString()
  } : null;

  // Prepare full sanitized applicant record
  const applicantRecord = {
    personal: {
      fullName: personal.fullName.trim(),
      dob: personal.dob.trim(),
      gender: personal.gender?.trim() || 'Not Specified',
      email: personal.email.trim().toLowerCase(),
      mobileNumber: personal.mobileNumber.trim(),
      whatsappNumber: personal.whatsappNumber?.trim() || personal.mobileNumber.trim(),
      city: personal.city.trim(),
      state: personal.state.trim(),
      country: personal.country.trim(),
      photo: photoRecord
    },
    education: {
      collegeName: education.collegeName.trim(),
      degree: education.degree.trim(),
      department: education.department.trim(),
      currentYear: education.currentYear.trim(),
      currentSemester: education.currentSemester?.trim() || '',
      graduationYear: String(education.graduationYear).trim(),
      collegeLocation: education.collegeLocation.trim(),
      rollNumber: education.rollNumber?.trim() || ''
    },
    preferences: {
      preferredDomain: preferences.preferredDomain.trim(),
      secondaryDomain: preferences.secondaryDomain?.trim() || 'None',
      whyJoin: preferences.whyJoin.trim(),
      expectationsToLearn: preferences.expectationsToLearn.trim(),
      duration: preferences.duration.trim(),
      expectedJoiningDate: preferences.expectedJoiningDate.trim(),
      workingArrangement: preferences.workingArrangement.trim()
    },
    skills: {
      technicalSkills: Array.isArray(skills?.technicalSkills) 
        ? skills.technicalSkills 
        : (typeof skills?.technicalSkills === 'string' ? skills.technicalSkills.split(',').map(s => s.trim()).filter(Boolean) : []),
      programmingLanguages: Array.isArray(skills?.programmingLanguages) 
        ? skills.programmingLanguages 
        : (typeof skills?.programmingLanguages === 'string' ? skills.programmingLanguages.split(',').map(s => s.trim()).filter(Boolean) : []),
      toolsAndTech: Array.isArray(skills?.toolsAndTech) 
        ? skills.toolsAndTech 
        : (typeof skills?.toolsAndTech === 'string' ? skills.toolsAndTech.split(',').map(s => s.trim()).filter(Boolean) : []),
      experience: skills?.experience?.trim() || '',
      projects: Array.isArray(skills?.projects) ? skills.projects : [],
      domainSpecific: skills?.domainSpecific || {}
    },
    social: {
      linkedin: social?.linkedin?.trim() || '',
      github: social?.github?.trim() || '',
      portfolio: social?.portfolio?.trim() || '',
      instagram: social?.instagram?.trim() || ''
    },
    documents: {
      resume: resumeRecord,
      certificates: certRecord,
      portfolioDoc: portRecord,
      additionalDoc: addRecord
    },
    consent: {
      accuracyConfirmed: true,
      recruitmentConsent: true,
      termsAndPrivacyConsent: true
    }
  };

  // Save in database
  const created = db.createApplication(applicantRecord);

  // Send confirmation email asynchronously
  emailService.sendApplicationConfirmation(created).catch(err => {
    console.error('Email dispatch error on submission:', err);
  });

  return res.status(201).json({
    success: true,
    message: 'Internship application submitted successfully! A confirmation notification has been sent.',
    applicationId: created.id,
    application: {
      id: created.id,
      fullName: created.personal.fullName,
      email: created.personal.email,
      preferredDomain: created.preferences.preferredDomain,
      status: created.status,
      createdAt: created.createdAt
    }
  });
}

async function trackApplication(req, res) {
  try {
    const { email, applicationId } = req.body;

    if (!email || !applicationId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your Application ID and registered Email address.'
      });
    }

    const db = getDatabase();
    const app = db.getApplicationByEmailAndId(email, applicationId);

    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'No matching application was found with that Application ID and Email address. Please double-check your inputs.'
      });
    }

    // Return safe applicant tracking view
    return res.status(200).json({
      success: true,
      application: {
        id: app.id,
        fullName: app.personal.fullName,
        email: app.personal.email,
        preferredDomain: app.preferences.preferredDomain,
        workingArrangement: app.preferences.workingArrangement,
        duration: app.preferences.duration,
        status: app.status,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        photoFilename: app.personal.photo?.filename
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve application status.'
    });
  }
}

module.exports = {
  submitApplication,
  trackApplication
};
