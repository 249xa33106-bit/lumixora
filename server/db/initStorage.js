const fs = require('fs');
const path = require('path');
const { PHOTOS_DIR, DOCUMENTS_DIR } = require('../config/config');

// Simple 1x1 transparent/colored JPEG header or small valid JPEG buffer
const minimalJpeg = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');

// Minimal valid PDF structure
const minimalPdf = Buffer.from(
`%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 55 >>
stream
BT
/F1 18 Tf
100 700 Td
(Lumixora Internship Candidate Resume) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
310
%%EOF`, 'utf8');

[PHOTOS_DIR, DOCUMENTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

['sample_aarav.jpg', 'sample_priya.jpg', 'sample_tanvi.jpg'].forEach(file => {
  const p = path.join(PHOTOS_DIR, file);
  if (!fs.existsSync(p)) fs.writeFileSync(p, minimalJpeg);
});

['sample_aarav_resume.pdf', 'sample_aarav_cert.pdf', 'sample_priya_resume.pdf', 'sample_tanvi_resume.pdf'].forEach(file => {
  const p = path.join(DOCUMENTS_DIR, file);
  if (!fs.existsSync(p)) fs.writeFileSync(p, minimalPdf);
});
console.log('Sample storage assets generated.');
