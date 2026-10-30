const path = require('path');
require('dotenv').config();

const ROOT_DIR = path.resolve(__dirname, '..');
const STORAGE_DIR = path.join(ROOT_DIR, 'storage');
const PHOTOS_DIR = path.join(STORAGE_DIR, 'photos');
const DOCUMENTS_DIR = path.join(STORAGE_DIR, 'documents');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'lumixora_jwt_secret_key_2026_super_secure',
  JWT_EXPIRES_IN: '24h',
  ROOT_DIR,
  STORAGE_DIR,
  PHOTOS_DIR,
  DOCUMENTS_DIR,
  DATA_DIR,
  DB_FILE,
  ADMIN_DEFAULT: {
    email: process.env.ADMIN_EMAIL || 'admin@lumixora.com',
    password: process.env.ADMIN_PASSWORD || 'LumixoraAdmin2026!',
    name: 'Lumixora Lead Recruiter',
    role: 'SUPER_ADMIN'
  },
  MAX_PHOTO_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DOC_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_DOMAINS: [
    'AI & Machine Learning',
    'Full-Stack Web Development',
    'Software Testing & Quality Assurance',
    'UI/UX & Product Design',
    'Digital Marketing & Growth',
    'Content Creation & Social Media',
    'Business Development & College Partnerships',
    'Research & Product Strategy'
  ],
  STATUSES: [
    'Submitted',
    'Under Review',
    'Shortlisted',
    'Interview Scheduled',
    'Selected',
    'Rejected'
  ]
};
