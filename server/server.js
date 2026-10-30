const express = require('express');
const cors = require('cors');
const path = require('path');
const { PORT } = require('./config/config');
const { getDatabase } = require('./db/database');

const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const adminRoutes = require('./routes/admin');

const app = express();

// Initialize DB and ensure storage directories
getDatabase();

// CORS & Body parser
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Lumixora Internship Recruitment Portal',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

// Serve static frontend build if present
const clientDistPath = path.resolve(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// Fallback for SPA routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('Lumixora Internship Portal API is active on port ' + PORT);
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` Lumixora Internship Portal Server Running       `);
  console.log(` URL: http://localhost:${PORT}                   `);
  console.log(` Default Admin: admin@lumixora.com / LumixoraAdmin2026! `);
  console.log(`=================================================`);
});

module.exports = { app, server };
