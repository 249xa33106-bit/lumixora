const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { DB_FILE, DATA_DIR, STORAGE_DIR, PHOTOS_DIR, DOCUMENTS_DIR, ADMIN_DEFAULT } = require('../config/config');

// Ensure necessary directories exist
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
        this.seedInitialData();
        this.save();
      }
    } catch (err) {
      console.error('Error loading database file, initializing clean state:', err);
      this.seedInitialData();
      this.save();
    }
  }

  seedInitialData() {
    // Seed default admin user
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(ADMIN_DEFAULT.password, salt);

    this.data.users = [
      {
        id: 'usr_admin_lumixora_1',
        email: ADMIN_DEFAULT.email,
        password: hashedPassword,
        name: ADMIN_DEFAULT.name,
        role: ADMIN_DEFAULT.role,
        createdAt: new Date().toISOString()
      }
    ];

    // Seed 3 realistic applicants so dashboard has rich demo data right away
    const sampleApplicants = [
      {
        id: 'LMX-2026-48192',
        personal: {
          fullName: 'Aarav Sharma',
          dob: '2004-05-14',
          gender: 'Male',
          email: 'aarav.sharma@example.com',
          mobileNumber: '+91 9876543210',
          whatsappNumber: '+91 9876543210',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          photo: {
            filename: 'sample_aarav.jpg',
            originalName: 'aarav_headshot.jpg',
            mimetype: 'image/jpeg',
            size: 245000,
            path: 'photos/sample_aarav.jpg',
            uploadedAt: '2026-10-25T10:15:00.000Z'
          }
        },
        education: {
          collegeName: 'National Institute of Technology, Karnataka (NITK Surathkal)',
          degree: 'B.Tech',
          department: 'Computer Science and Engineering',
          currentYear: '3rd Year',
          currentSemester: 'Sem 6',
          graduationYear: '2027',
          collegeLocation: 'Surathkal, Karnataka',
          rollNumber: '23CS108'
        },
        preferences: {
          preferredDomain: 'Full-Stack Web Development',
          secondaryDomain: 'AI & Machine Learning',
          whyJoin: 'Lumixora represents the vanguard of modern engineering and product innovation. I want to build scalable architectures that directly impact thousands of active learners and professionals.',
          expectationsToLearn: 'I expect to deepen my understanding of distributed microservices, edge rendering optimizations, and collaborative product engineering practices with senior mentors.',
          duration: '3 Months',
          expectedJoiningDate: '2026-11-15',
          workingArrangement: 'Hybrid'
        },
        skills: {
          technicalSkills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'GraphQL', 'Tailwind CSS', 'Docker'],
          programmingLanguages: ['JavaScript', 'TypeScript', 'Python', 'C++'],
          toolsAndTech: ['Git', 'Docker', 'Vite', 'Postman', 'Linux', 'Vercel'],
          experience: 'Built an open-source real-time markdown collaborative editor with WebSockets and IndexedDB caching during hackathon (1st Runner Up).',
          projects: [
            {
              title: 'CollabFlow - Real-time Workspace',
              description: 'Operational transform based markdown documentation workspace with live cursor tracking.',
              techStack: 'React, Node.js, WebSockets, Redis',
              link: 'https://github.com/aaravsharma/collabflow'
            },
            {
              title: 'EduMetric Dashboard',
              description: 'Campus placement analytics platform with automated resume parser pipeline.',
              techStack: 'Next.js, FastAPI, PostgreSQL',
              link: 'https://github.com/aaravsharma/edumetric'
            }
          ],
          domainSpecific: {
            preferredStack: 'Full-Stack TypeScript (Next.js + Fastify + Prisma)',
            deployedProjectUrl: 'https://collabflow-demo.lumixora.dev'
          }
        },
        social: {
          linkedin: 'https://linkedin.com/in/aarav-sharma-dev',
          github: 'https://github.com/aaravsharma',
          portfolio: 'https://aaravsharma.dev',
          instagram: ''
        },
        documents: {
          resume: {
            filename: 'sample_aarav_resume.pdf',
            originalName: 'Aarav_Sharma_Resume_2026.pdf',
            mimetype: 'application/pdf',
            size: 480200,
            path: 'documents/sample_aarav_resume.pdf',
            uploadedAt: '2026-10-25T10:15:00.000Z'
          },
          certificates: {
            filename: 'sample_aarav_cert.pdf',
            originalName: 'AWS_Certified_Cloud_Practitioner.pdf',
            mimetype: 'application/pdf',
            size: 320100,
            path: 'documents/sample_aarav_cert.pdf',
            uploadedAt: '2026-10-25T10:15:00.000Z'
          },
          portfolioDoc: null,
          additionalDoc: null
        },
        status: 'Shortlisted',
        internalNotes: [
          {
            id: 'note_1',
            author: 'Lumixora Lead Recruiter',
            text: 'Impressive GitHub contributions and clean system design in CollabFlow project. Scheduled for technical discussion.',
            createdAt: '2026-10-26T14:30:00.000Z'
          }
        ],
        consent: {
          accuracyConfirmed: true,
          recruitmentConsent: true,
          termsAndPrivacyConsent: true
        },
        createdAt: '2026-10-25T10:15:00.000Z',
        updatedAt: '2026-10-26T14:30:00.000Z'
      },
      {
        id: 'LMX-2026-72814',
        personal: {
          fullName: 'Priya Sundaram',
          dob: '2003-11-20',
          gender: 'Female',
          email: 'priya.sundaram@example.com',
          mobileNumber: '+91 9123456789',
          whatsappNumber: '+91 9123456789',
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
          photo: {
            filename: 'sample_priya.jpg',
            originalName: 'priya_avatar.jpg',
            mimetype: 'image/jpeg',
            size: 198000,
            path: 'photos/sample_priya.jpg',
            uploadedAt: '2026-10-27T09:00:00.000Z'
          }
        },
        education: {
          collegeName: 'International Institute of Information Technology (IIIT Hyderabad)',
          degree: 'B.Tech',
          department: 'Artificial Intelligence & Data Science',
          currentYear: '4th Year',
          currentSemester: 'Sem 7',
          graduationYear: '2026',
          collegeLocation: 'Hyderabad, Telangana',
          rollNumber: '2022UGCS044'
        },
        preferences: {
          preferredDomain: 'AI & Machine Learning',
          secondaryDomain: 'Research & Product Strategy',
          whyJoin: 'Lumixora is applying cutting-edge machine learning and agentic workflows to educational platforms. I am eager to apply my research background in transformer fine-tuning to real-world user scenarios.',
          expectationsToLearn: 'Hands-on production deployment of quantized LLMs, evaluation harnesses, and RLHF alignment strategies under production traffic constraints.',
          duration: '6 Months',
          expectedJoiningDate: '2026-11-01',
          workingArrangement: 'Remote'
        },
        skills: {
          technicalSkills: ['PyTorch', 'Hugging Face', 'LangChain', 'Scikit-Learn', 'Vector Databases (Chroma/FAISS)', 'FastAPI'],
          programmingLanguages: ['Python', 'SQL', 'C++'],
          toolsAndTech: ['Weights & Biases', 'Git', 'Linux', 'CUDA', 'Docker'],
          experience: 'Summer research fellow at IIIT Speech & Vision Lab working on multi-lingual speech transcription enhancement.',
          projects: [
            {
              title: 'DocuQuery - Multimodal RAG Engine',
              description: 'Hybrid sparse-dense retrieval pipeline for complex multi-column scientific PDF documents.',
              techStack: 'PyTorch, Hugging Face, Qdrant, Streamlit',
              link: 'https://github.com/priyasundaram/docuquery'
            }
          ],
          domainSpecific: {
            frameworks: 'PyTorch, Hugging Face Transformers, vLLM, DeepSpeed',
            kaggleOrHuggingFaceUrl: 'https://huggingface.co/priyasundaram'
          }
        },
        social: {
          linkedin: 'https://linkedin.com/in/priya-sundaram-ai',
          github: 'https://github.com/priyasundaram',
          portfolio: 'https://priyasundaram.ai',
          instagram: ''
        },
        documents: {
          resume: {
            filename: 'sample_priya_resume.pdf',
            originalName: 'Priya_Sundaram_CV.pdf',
            mimetype: 'application/pdf',
            size: 512000,
            path: 'documents/sample_priya_resume.pdf',
            uploadedAt: '2026-10-27T09:00:00.000Z'
          },
          certificates: null,
          portfolioDoc: null,
          additionalDoc: null
        },
        status: 'Under Review',
        internalNotes: [],
        consent: {
          accuracyConfirmed: true,
          recruitmentConsent: true,
          termsAndPrivacyConsent: true
        },
        createdAt: '2026-10-27T09:00:00.000Z',
        updatedAt: '2026-10-27T09:00:00.000Z'
      },
      {
        id: 'LMX-2026-93041',
        personal: {
          fullName: 'Tanvi Deshmukh',
          dob: '2005-02-18',
          gender: 'Female',
          email: 'tanvi.deshmukh@example.com',
          mobileNumber: '+91 9988776655',
          whatsappNumber: '+91 9988776655',
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          photo: {
            filename: 'sample_tanvi.jpg',
            originalName: 'tanvi_profile.png',
            mimetype: 'image/png',
            size: 310000,
            path: 'photos/sample_tanvi.jpg',
            uploadedAt: '2026-10-29T11:20:00.000Z'
          }
        },
        education: {
          collegeName: 'MIT Institute of Design, Pune',
          degree: 'B.Des',
          department: 'User Experience & Interaction Design',
          currentYear: '3rd Year',
          currentSemester: 'Sem 5',
          graduationYear: '2027',
          collegeLocation: 'Pune, Maharashtra',
          rollNumber: 'DES2023-88'
        },
        preferences: {
          preferredDomain: 'UI/UX & Product Design',
          secondaryDomain: 'Content Creation & Social Media',
          whyJoin: 'Lumixora crafts exceptional digital experiences that empower early-career developers. I want to design intuitive, accessible interfaces that feel welcoming and delightful to use.',
          expectationsToLearn: 'I look forward to contributing to design system tokenization, user research synthesis, and rapid prototyping workflows in an agile tech environment.',
          duration: '3 Months',
          expectedJoiningDate: '2026-11-20',
          workingArrangement: 'Remote'
        },
        skills: {
          technicalSkills: ['Figma', 'Design Systems', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing'],
          programmingLanguages: ['HTML', 'CSS (Tailwind)', 'Basic JavaScript'],
          toolsAndTech: ['Figma', 'Adobe Creative Cloud', 'Miro', 'Notion', 'Lottie', 'Maze'],
          experience: 'Freelance UI designer for 2 student startups, designed onboarding flow that improved 7-day retention by 34%.',
          projects: [
            {
              title: 'LearnEase Mobile App Concept',
              description: 'Microlearning app concept tailored for neurodivergent learners.',
              techStack: 'Figma, Maze Usability Testing',
              link: 'https://behance.net/gallery/learnease'
            }
          ],
          domainSpecific: {
            designTools: 'Figma (Auto Layout, Variables, Component Sets), Adobe Illustrator',
            portfolioLink: 'https://tanvidesign.framer.website'
          }
        },
        social: {
          linkedin: 'https://linkedin.com/in/tanvi-deshmukh-design',
          github: '',
          portfolio: 'https://tanvidesign.framer.website',
          instagram: 'https://instagram.com/tanvi_ux'
        },
        documents: {
          resume: {
            filename: 'sample_tanvi_resume.pdf',
            originalName: 'Tanvi_Deshmukh_Design_Resume.pdf',
            mimetype: 'application/pdf',
            size: 615000,
            path: 'documents/sample_tanvi_resume.pdf',
            uploadedAt: '2026-10-29T11:20:00.000Z'
          },
          certificates: null,
          portfolioDoc: null,
          additionalDoc: null
        },
        status: 'Submitted',
        internalNotes: [],
        consent: {
          accuracyConfirmed: true,
          recruitmentConsent: true,
          termsAndPrivacyConsent: true
        },
        createdAt: '2026-10-29T11:20:00.000Z',
        updatedAt: '2026-10-29T11:20:00.000Z'
      }
    ];

    this.data.applications = sampleApplicants;
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
      app.personal.email.trim().toLowerCase() === normalized
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
      result = result.filter(app => app.preferences.preferredDomain === filters.domain);
    }

    if (filters.status && filters.status !== 'All') {
      result = result.filter(app => app.status === filters.status);
    }

    if (filters.degree && filters.degree !== 'All') {
      result = result.filter(app => 
        (app.education.degree || '').toLowerCase().includes(filters.degree.toLowerCase())
      );
    }

    if (filters.graduationYear && filters.graduationYear !== 'All') {
      result = result.filter(app => String(app.education.graduationYear) === String(filters.graduationYear));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(app => 
        (app.id && app.id.toLowerCase().includes(q)) ||
        (app.personal.fullName && app.personal.fullName.toLowerCase().includes(q)) ||
        (app.personal.email && app.personal.email.toLowerCase().includes(q)) ||
        (app.education.collegeName && app.education.collegeName.toLowerCase().includes(q)) ||
        (app.preferences.preferredDomain && app.preferences.preferredDomain.toLowerCase().includes(q))
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
      app.personal.email.trim().toLowerCase() === email.trim().toLowerCase()
    ) || null;
  }

  updateApplicationStatus(id, newStatus, authorName = 'Admin') {
    const app = this.getApplicationById(id);
    if (!app) return null;

    const oldStatus = app.status;
    app.status = newStatus;
    app.updatedAt = new Date().toISOString();

    // Log status change
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
      // By status
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;

      // By domain
      const dom = app.preferences.preferredDomain || 'Other';
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
