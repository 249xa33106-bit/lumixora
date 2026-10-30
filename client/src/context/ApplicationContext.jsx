import React, { createContext, useContext, useState, useEffect } from 'react';

const ApplicationContext = createContext();

const DRAFT_STORAGE_KEY = 'lumixora_app_draft_v1';

const INITIAL_STATE = {
  personal: {
    fullName: '',
    dob: '',
    gender: '',
    email: '',
    mobileNumber: '',
    whatsappNumber: '',
    city: '',
    state: '',
    country: 'India'
  },
  education: {
    collegeName: '',
    degree: 'B.Tech',
    department: '',
    currentYear: '3rd Year',
    currentSemester: '',
    graduationYear: '2027',
    collegeLocation: '',
    rollNumber: ''
  },
  preferences: {
    preferredDomain: 'Full-Stack Web Development',
    secondaryDomain: 'None',
    whyJoin: '',
    expectationsToLearn: '',
    duration: '3 Months',
    expectedJoiningDate: '',
    workingArrangement: 'Hybrid'
  },
  skills: {
    technicalSkills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS'],
    programmingLanguages: ['JavaScript', 'TypeScript', 'Python'],
    toolsAndTech: ['Git', 'Vite', 'Postman'],
    experience: '',
    projects: [
      {
        title: '',
        description: '',
        techStack: '',
        link: ''
      }
    ],
    domainSpecific: {}
  },
  social: {
    linkedin: '',
    github: '',
    portfolio: '',
    instagram: ''
  },
  consent: {
    accuracyConfirmed: false,
    recruitmentConsent: false,
    termsAndPrivacyConsent: false
  }
};

export function ApplicationProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          consent: {
            accuracyConfirmed: false,
            recruitmentConsent: false,
            termsAndPrivacyConsent: false
          }
        };
      }
    } catch (e) {
      console.warn('Failed to load draft from localStorage');
    }
    return INITIAL_STATE;
  });

  // Binary file state (kept in memory, never serialized)
  const [files, setFiles] = useState({
    photo: null,
    photoPreviewUrl: null,
    resume: null,
    resumeInfo: null,
    certificates: null,
    certificatesInfo: null,
    portfolioDoc: null,
    portfolioDocInfo: null,
    additionalDoc: null,
    additionalDocInfo: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Save non-binary form inputs to localStorage
  useEffect(() => {
    try {
      const { consent, ...draftableData } = formData;
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftableData));
    } catch (e) {}
  }, [formData]);

  const updatePersonal = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const updateEducation = (field, value) => {
    setFormData(prev => ({
      ...prev,
      education: { ...prev.education, [field]: value }
    }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const updatePreferences = (field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const updateSkills = (field, value) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [field]: value }
    }));
  };

  const updateDomainSpecific = (field, value) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        domainSpecific: {
          ...prev.skills.domainSpecific,
          [field]: value
        }
      }
    }));
  };

  const updateSocial = (field, value) => {
    setFormData(prev => ({
      ...prev,
      social: { ...prev.social, [field]: value }
    }));
  };

  const updateConsent = (field, value) => {
    setFormData(prev => ({
      ...prev,
      consent: { ...prev.consent, [field]: value }
    }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Profile Photo Handler
  const handlePhotoSelect = (file) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, photo: 'Only JPG, JPEG, PNG, or WEBP photos are allowed.' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Profile photo size must be less than 5 MB.' }));
      return;
    }

    // Clean previous preview
    if (files.photoPreviewUrl) {
      URL.revokeObjectURL(files.photoPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setFiles(prev => ({
      ...prev,
      photo: file,
      photoPreviewUrl: previewUrl
    }));

    setErrors(prev => {
      const copy = { ...prev };
      delete copy.photo;
      return copy;
    });
  };

  const removePhoto = () => {
    if (files.photoPreviewUrl) {
      URL.revokeObjectURL(files.photoPreviewUrl);
    }
    setFiles(prev => ({
      ...prev,
      photo: null,
      photoPreviewUrl: null
    }));
  };

  // Document File Handler (PDFs)
  const handleDocSelect = (fieldName, file) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrors(prev => ({ ...prev, [fieldName]: 'Only PDF documents are accepted.' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [fieldName]: 'Document size must be under 5 MB.' }));
      return;
    }

    setFiles(prev => ({
      ...prev,
      [fieldName]: file,
      [`${fieldName}Info`]: {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      }
    }));

    setErrors(prev => {
      const copy = { ...prev };
      delete copy[fieldName];
      return copy;
    });
  };

  const removeDoc = (fieldName) => {
    setFiles(prev => ({
      ...prev,
      [fieldName]: null,
      [`${fieldName}Info`]: null
    }));
  };

  // Step Validation
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.personal.fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (!formData.personal.dob.trim()) newErrors.dob = 'Date of birth is required';
      if (!formData.personal.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personal.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.personal.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number with country code is required';
      if (!formData.personal.city.trim()) newErrors.city = 'Current city is required';
      if (!formData.personal.state.trim()) newErrors.state = 'Current state is required';
      if (!formData.personal.country.trim()) newErrors.country = 'Country is required';
      if (!files.photo) newErrors.photo = 'Profile photo is mandatory (Max 5MB)';
    }

    if (step === 2) {
      if (!formData.education.collegeName.trim()) newErrors.collegeName = 'College / University name is required';
      if (!formData.education.degree.trim()) newErrors.degree = 'Degree is required';
      if (!formData.education.department.trim()) newErrors.department = 'Department / Branch is required';
      if (!formData.education.currentYear.trim()) newErrors.currentYear = 'Year of study is required';
      if (!formData.education.graduationYear.toString().trim()) newErrors.graduationYear = 'Graduation year is required';
      if (!formData.education.collegeLocation.trim()) newErrors.collegeLocation = 'College location (City, State) is required';
    }

    if (step === 3) {
      if (!formData.preferences.preferredDomain) newErrors.preferredDomain = 'Please select your preferred internship domain';
      if (!formData.preferences.whyJoin.trim() || formData.preferences.whyJoin.trim().length < 20) {
        newErrors.whyJoin = 'Please provide at least 20 characters explaining why you wish to join Lumixora';
      }
      if (!formData.preferences.expectationsToLearn.trim() || formData.preferences.expectationsToLearn.trim().length < 20) {
        newErrors.expectationsToLearn = 'Please provide at least 20 characters describing what you expect to learn';
      }
      if (!formData.preferences.duration) newErrors.duration = 'Please select internship duration';
      if (!formData.preferences.expectedJoiningDate) newErrors.expectedJoiningDate = 'Please select expected joining date';
      if (!formData.preferences.workingArrangement) newErrors.workingArrangement = 'Please select preferred working arrangement';
    }

    if (step === 4) {
      if (formData.skills.technicalSkills.length === 0) {
        newErrors.technicalSkills = 'Please provide at least one technical skill or tool';
      }
    }

    if (step === 5) {
      if (!files.resume) newErrors.resume = 'Resume / CV PDF is mandatory (Max 5MB)';
    }

    if (step === 6) {
      if (!formData.consent.accuracyConfirmed) newErrors.accuracyConfirmed = 'You must confirm the accuracy of your information';
      if (!formData.consent.recruitmentConsent) newErrors.recruitmentConsent = 'Recruitment processing consent is required';
      if (!formData.consent.termsAndPrivacyConsent) newErrors.termsAndPrivacyConsent = 'Agreement to terms and privacy policy is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Application
  const submitApplication = async () => {
    if (!validateStep(6)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const data = new FormData();

      // Append payload JSON
      data.append('payload', JSON.stringify(formData));

      // Append binary files
      if (files.photo) data.append('photo', files.photo);
      if (files.resume) data.append('resume', files.resume);
      if (files.certificates) data.append('certificates', files.certificates);
      if (files.portfolioDoc) data.append('portfolioDoc', files.portfolioDoc);
      if (files.additionalDoc) data.append('additionalDoc', files.additionalDoc);

      const response = await fetch('/api/applications/apply', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit application.');
      }

      setSubmissionSuccess(result);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (err) {
      setSubmitError(err.message || 'Network error occurred while submitting application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setFormData(INITIAL_STATE);
    setFiles({
      photo: null,
      photoPreviewUrl: null,
      resume: null,
      resumeInfo: null,
      certificates: null,
      certificatesInfo: null,
      portfolioDoc: null,
      portfolioDocInfo: null,
      additionalDoc: null,
      additionalDocInfo: null
    });
    setErrors({});
    setCurrentStep(1);
    setSubmissionSuccess(null);
    setSubmitError(null);
  };

  return (
    <ApplicationContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        formData,
        files,
        errors,
        isSubmitting,
        submissionSuccess,
        submitError,
        updatePersonal,
        updateEducation,
        updatePreferences,
        updateSkills,
        updateDomainSpecific,
        updateSocial,
        updateConsent,
        handlePhotoSelect,
        removePhoto,
        handleDocSelect,
        removeDoc,
        validateStep,
        nextStep,
        prevStep,
        goToStep,
        submitApplication,
        resetForm
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  return useContext(ApplicationContext);
}
