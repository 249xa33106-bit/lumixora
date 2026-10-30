const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { DB_FILE, DATA_DIR, STORAGE_DIR, PHOTOS_DIR, DOCUMENTS_DIR } = require('../config/config');

// Ensure storage directories exist
[DATA_DIR, STORAGE_DIR, PHOTOS_DIR, DOCUMENTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

let dbInstance = null;

class Database {
  constructor() {
    this.data = {
      applications: [],
      users: [],
      notes: [],
      auditLogs: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading database file, initializing clean state:', err);
      this.data = {
        applications: [],
        users: [],
        notes: [],
        auditLogs: []
      };
      this.save();
    }
  }

  save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempFile, DB_FILE);
      return true;
    } catch (err) {
      console.error('Failed to save database file atomically:', err);
      return false;
    }
  }

  hasAdminUser() {
    return Array.isArray(this.data.users) && this.data.users.length > 0;
  }

  createAdminUser({ email, password, name }) {
    if (this.hasAdminUser()) {
      throw new Error('An administrator account already exists. Only one master admin can be registered initially.');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      id: `usr_${Date.now()}`,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      role: 'SUPER_ADMIN',
      createdAt: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  // Generate unique Application ID: LMX-YYYY-XXXXX
  generateApplicationId() {
    const year = new Date().getFullYear();
    let id;
    let exists = true;
    while (exists) {
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      id = `LMX-${year}-${randomDigits}`;
      exists = this.data.applications.some(app => app.id === id);
    }
    return id;
  }

  // Check duplicate submission
  isDuplicateApplication(email) {
    if (!email) return false;
    const normalized = email.trim().toLowerCase();
    return this.data.applications.find(app => 
      app.personal?.email?.trim().toLowerCase() === normalized
    );
  }

  createApplication(applicantData) {
    const id = this.generateApplicationId();
    const newRecord = {
      id,
      ...applicantData,
      status: 'Submitted',
      internalNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.applications.unshift(newRecord);
    this.save();
    return newRecord;
  }

  getApplications(filters = {}) {
    let result = [...this.data.applications];

    if (filters.domain && filters.domain !== 'All') {
      result = result.filter(app => app.preferences?.preferredDomain === filters.domain);
    }

    if (filters.status && filters.status !== 'All') {
      result = result.filter(app => app.status === filters.status);
    }

    if (filters.degree && filters.degree !== 'All') {
      result = result.filter(app => 
        (app.education?.degree || '').toLowerCase().includes(filters.degree.toLowerCase())
      );
    }

    if (filters.graduationYear && filters.graduationYear !== 'All') {
      result = result.filter(app => String(app.education?.graduationYear) === String(filters.graduationYear));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(app => 
        (app.id && app.id.toLowerCase().includes(q)) ||
        (app.personal?.fullName && app.personal.fullName.toLowerCase().includes(q)) ||
        (app.personal?.email && app.personal.email.toLowerCase().includes(q)) ||
        (app.education?.collegeName && app.education.collegeName.toLowerCase().includes(q)) ||
        (app.preferences?.preferredDomain && app.preferences.preferredDomain.toLowerCase().includes(q))
      );
    }

    return result;
  }

  getApplicationById(id) {
    return this.data.applications.find(app => app.id === id) || null;
  }

  getApplicationByEmailAndId(email, id) {
    if (!email || !id) return null;
    return this.data.applications.find(app => 
      app.id.trim().toUpperCase() === id.trim().toUpperCase() &&
      app.personal?.email?.trim().toLowerCase() === email.trim().toLowerCase()
    ) || null;
  }

  updateApplicationStatus(id, newStatus, authorName = 'Admin') {
    const app = this.getApplicationById(id);
    if (!app) return null;

    const oldStatus = app.status;
    app.status = newStatus;
    app.updatedAt = new Date().toISOString();

    this.data.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      applicationId: id,
      action: 'STATUS_CHANGE',
      details: `Status changed from ${oldStatus} to ${newStatus} by ${authorName}`,
      timestamp: new Date().toISOString()
    });

    this.save();
    return app;
  }

  addInternalNote(id, noteText, authorName = 'Admin') {
    const app = this.getApplicationById(id);
    if (!app) return null;

    if (!app.internalNotes) {
      app.internalNotes = [];
    }

    const note = {
      id: `note_${Date.now()}`,
      author: authorName,
      text: noteText,
      createdAt: new Date().toISOString()
    };

    app.internalNotes.unshift(note);
    app.updatedAt = new Date().toISOString();
    this.save();
    return note;
  }

  getUserByEmail(email) {
    if (!email) return null;
    return this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  }

  getMetrics() {
    const total = this.data.applications.length;
    const statusCounts = {};
    const domainCounts = {};

    this.data.applications.forEach(app => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
      const dom = app.preferences?.preferredDomain || 'Other';
      domainCounts[dom] = (domainCounts[dom] || 0) + 1;
    });

    return {
      total,
      statusCounts,
      domainCounts,
      recentCount: this.data.applications.filter(a => {
        const d = new Date(a.createdAt);
        const now = new Date();
        const diffDays = (now - d) / (1000 * 3600 * 24);
        return diffDays <= 7;
      }).length
    };
  }
}

function getDatabase() {
  if (!dbInstance) {
    dbInstance = new Database();
  }
  return dbInstance;
}

module.exports = {
  getDatabase
};
