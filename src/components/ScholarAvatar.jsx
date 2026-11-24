import React from 'react';

/**
 * Intelligent gender detection helper based on common Indian & academic first names.
 */
export function detectGenderFromName(nameStr = '') {
  if (!nameStr || typeof nameStr !== 'string') return 'male';
  
  // Clean string and break into words
  const clean = nameStr.toLowerCase().replace(/[^a-z\s]/g, ' ').trim();
  const tokens = clean.split(/\s+/).filter(Boolean);
  
  const femaleKeywords = new Set([
    'priya', 'ananya', 'sneha', 'pooja', 'kavya', 'divya', 'swathi', 'bhavana', 
    'deepika', 'shreya', 'aishwarya', 'lakshmi', 'keerthi', 'meghana', 'siri', 
    'sahithi', 'ramya', 'jahnavi', 'manasa', 'yamini', 'tanuja', 'bhavya', 
    'haritha', 'mounika', 'sravani', 'pravallika', 'tejaswi', 'anusha', 'renu', 
    'renuka', 'sirisha', 'padma', 'gayatri', 'swetha', 'roopa', 'deepthi', 
    'sandhya', 'vidya', 'shilpa', 'soumya', 'archana', 'madhuri', 'vani', 
    'radha', 'geetha', 'saranya', 'pallavi', 'alekhya', 'bindu', 'sindhu', 
    'sushma', 'lavanya', 'supriya', 'pratyusha', 'harika', 'amulya', 'kusuma',
    'girl', 'female', 'woman', 'ms', 'mrs', 'miss'
  ]);

  const maleKeywords = new Set([
    'akhil', 'sowban', 'mohammed', 'mohd', 'md', 'rahul', 'rohit', 'sai', 
    'karthik', 'karthikeya', 'rohan', 'aditya', 'varun', 'shiva', 'siva', 
    'krishna', 'ajay', 'vijay', 'suresh', 'ramesh', 'harsha', 'charan', 
    'kalyan', 'teja', 'pranav', 'nikhil', 'vignesh', 'vivek', 'abhishek', 
    'venkat', 'venkatesh', 'srikanth', 'prasad', 'ravi', 'raju', 'manoj', 
    'deepak', 'sandeep', 'pavan', 'pavankumar', 'bharath', 'tarun', 'chaitanya', 
    'madhav', 'naveen', 'anil', 'sunil', 'rajesh', 'ganesh', 'sujit', 'shravan', 
    'mahendra', 'mahendrakar', 'anand', 'dinesh', 'santosh', 'naresh', 'vinay', 
    'lokesh', 'jagadeesh', 'surya', 'vamsi', 'arun', 'arjun', 'karan', 'dev', 
    'siddharth', 'gopal', 'bala', 'chandra', 'ram', 'kishore', 'srinivas', 
    'suhas', 'vishnu', 'yeshwanth', 'rishi', 'boy', 'male', 'man', 'mr'
  ]);

  for (const t of tokens) {
    if (femaleKeywords.has(t)) return 'female';
    if (maleKeywords.has(t)) return 'male';
  }

  return 'male'; // Sensible academic default
}

/**
 * Male Scholar Vector Avatar
 */
export function MaleScholarGraphic({ className = "w-full h-full" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Male Scholar"
    >
      <defs>
        <linearGradient id="maleBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="60%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="maleHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="maleJacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#312e81" />
          <stop offset="60%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id="maleHalo" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background Frame */}
      <rect width="100" height="100" rx="20" fill="url(#maleBgGrad)" />
      <circle cx="50" cy="42" r="32" fill="url(#maleHalo)" />

      {/* Base / Shoulders & Jacket */}
      <path 
        d="M20 95 C20 74 34 68 50 68 C66 68 80 74 80 95 Z" 
        fill="url(#maleJacketGrad)" 
      />
      {/* Tech Collar / Inner Shirt */}
      <path d="M42 68 L50 82 L58 68 Z" fill="#0f172a" />
      <path d="M50 82 L50 95" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />

      {/* Neck */}
      <path d="M43 55 L57 55 L56 68 L44 68 Z" fill="#f6c29b" />

      {/* Head / Face */}
      <rect x="36" y="32" width="28" height="28" rx="10" fill="#fcd3b2" />
      <path d="M40 50 Q50 61 60 50" fill="#fcd3b2" />

      {/* Clean Modern Tech Eyeglasses */}
      <rect x="38" y="39" width="10" height="7" rx="2" stroke="#38bdf8" strokeWidth="1.2" fill="#38bdf8" fillOpacity="0.1" />
      <rect x="52" y="39" width="10" height="7" rx="2" stroke="#38bdf8" strokeWidth="1.2" fill="#38bdf8" fillOpacity="0.1" />
      <line x1="48" y1="42.5" x2="52" y2="42.5" stroke="#38bdf8" strokeWidth="1.2" />

      {/* Eyes */}
      <circle cx="43" cy="42.5" r="1.3" fill="#0f172a" />
      <circle cx="57" cy="42.5" r="1.3" fill="#0f172a" />

      {/* Friendly Smile */}
      <path d="M46 51 Q50 54 54 51" stroke="#b45309" strokeWidth="1" strokeLinecap="round" fill="none" />

      {/* Modern Hairstyle (Sharp Crop / Fade) */}
      <path 
        d="M34 35 C34 22 44 19 50 19 C58 19 66 22 66 35 C66 37 64 36 62 36 C59 36 56 31 50 31 C44 31 41 36 38 36 C36 36 34 37 34 35 Z" 
        fill="url(#maleHairGrad)" 
      />

      {/* Wireless Tech Earbud */}
      <circle cx="34.5" cy="45" r="2.2" fill="#38bdf8" />
      <circle cx="65.5" cy="45" r="2.2" fill="#38bdf8" />

      {/* Subtle Verified / Scholar Micro Crest */}
      <circle cx="78" cy="22" r="7" fill="#0284c7" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1" />
      <path d="M75 22 L77.5 24.5 L81.5 19.5" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Female Scholar Vector Avatar
 */
export function FemaleScholarGraphic({ className = "w-full h-full" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Female Scholar"
    >
      <defs>
        <linearGradient id="femBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#311042" />
          <stop offset="60%" stopColor="#180e29" />
          <stop offset="100%" stopColor="#090514" />
        </linearGradient>
        <linearGradient id="femHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2e1065" />
          <stop offset="60%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="femJacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#581c87" />
          <stop offset="60%" stopColor="#3b0764" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id="femHalo" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background Frame */}
      <rect width="100" height="100" rx="20" fill="url(#femBgGrad)" />
      <circle cx="50" cy="42" r="32" fill="url(#femHalo)" />

      {/* Base / Shoulders & High-Neck Jacket */}
      <path 
        d="M20 95 C20 74 34 68 50 68 C66 68 80 74 80 95 Z" 
        fill="url(#femJacketGrad)" 
      />
      {/* V-Neck / Violet Tech Line */}
      <path d="M44 68 L50 80 L56 68 Z" fill="#180e29" />
      <path d="M50 80 L50 95" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" />

      {/* Neck */}
      <path d="M44 55 L56 55 L55 68 L45 68 Z" fill="#fde0c8" />

      {/* Head / Face */}
      <rect x="37" y="33" width="26" height="26" rx="9" fill="#fde0c8" />
      <path d="M41 49 Q50 60 59 49" fill="#fde0c8" />

      {/* Stylish Modern Eyeglasses */}
      <rect x="38" y="39" width="10" height="7" rx="2" stroke="#c084fc" strokeWidth="1.2" fill="#c084fc" fillOpacity="0.1" />
      <rect x="52" y="39" width="10" height="7" rx="2" stroke="#c084fc" strokeWidth="1.2" fill="#c084fc" fillOpacity="0.1" />
      <line x1="48" y1="42.5" x2="52" y2="42.5" stroke="#c084fc" strokeWidth="1.2" />

      {/* Expressive Eyes */}
      <circle cx="43" cy="42.5" r="1.3" fill="#1e1b4b" />
      <circle cx="57" cy="42.5" r="1.3" fill="#1e1b4b" />

      {/* Smile */}
      <path d="M46 51 Q50 54 54 51" stroke="#9333ea" strokeWidth="1" strokeLinecap="round" fill="none" />

      {/* Sleek Hair Style (Modern High Ponytail & Bob) */}
      <path 
        d="M32 37 C32 21 42 18 50 18 C58 18 68 21 68 37 C68 49 66 56 64 56 C62 56 62 39 58 35 C54 32 46 32 42 35 C38 39 38 56 36 56 C34 56 32 49 32 37 Z" 
        fill="url(#femHairGrad)" 
      />
      {/* Top Hair knot accent */}
      <circle cx="50" cy="18" r="4" fill="#581c87" />

      {/* Wireless Tech Earbud */}
      <circle cx="34.5" cy="45" r="2.2" fill="#c084fc" />
      <circle cx="65.5" cy="45" r="2.2" fill="#c084fc" />

      {/* Verified Scholar Micro Crest */}
      <circle cx="78" cy="22" r="7" fill="#7e22ce" fillOpacity="0.2" stroke="#c084fc" strokeWidth="1" />
      <path d="M75 22 L77.5 24.5 L81.5 19.5" stroke="#c084fc" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Lumixora Tech Scholar Emblem (Official Monogram)
 */
export function TechScholarGraphic({ className = "w-full h-full" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lumixora Scholar Crest"
    >
      <defs>
        <linearGradient id="crestBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="60%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="crestGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      <rect width="100" height="100" rx="20" fill="url(#crestBg)" />

      {/* Tech Hexagon / Diamond Core */}
      <path 
        d="M50 18 L76 33 L76 67 L50 82 L24 67 L24 33 Z" 
        stroke="url(#crestGlow)" 
        strokeWidth="2.5" 
        fill="#042f2e" 
        fillOpacity="0.6" 
      />

      {/* Graduation Cap Tech Motif */}
      <path d="M50 32 L68 40 L50 48 L32 40 Z" fill="#10b981" />
      <path d="M38 44 L38 52 C38 56 62 56 62 52 L62 44" stroke="#34d399" strokeWidth="1.5" fill="none" />
      <path d="M66 41 L66 54" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="66" cy="55" r="1.5" fill="#38bdf8" />

      {/* Lumixora "L" Hologram */}
      <path 
        d="M44 57 L44 68 L56 68" 
        stroke="#ffffff" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

export const AVATAR_3D_MALE = '/images/avatars/male_scholar_3d.jpg';
export const AVATAR_3D_FEMALE = '/images/avatars/female_scholar_3d.jpg';

/**
 * Universal ScholarAvatar Component
 * 
 * Renders an attractive, Pixar/Octane-style 3D rendered character portrait
 * based on student gender (or custom uploaded photo).
 */
export default function ScholarAvatar({
  user = null,
  avatarUrl = '',
  gender = '',
  name = '',
  size = 'md',
  className = '',
  rounded = 'rounded-xl',
  border = 'border border-slate-700/80',
  showRing = false,
  alt = ''
}) {
  const [imgError, setImgError] = React.useState(false);

  // Extract from user object if provided
  const resolvedAvatarUrl = avatarUrl || user?.avatar || user?.photoURL || '';
  const resolvedName = name || user?.name || user?.displayName || '';
  const resolvedGender = (gender || user?.gender || detectGenderFromName(resolvedName) || 'male').toLowerCase().trim();

  // Handle standard sizing if className is not overriding dimensions
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };
  const finalClass = className || sizeClasses[size] || sizeClasses.md;

  // If user uploaded a valid custom image photo
  if (resolvedAvatarUrl && resolvedAvatarUrl !== '/lumixora_logo.jpg' && !resolvedAvatarUrl.startsWith('data:image/svg+xml;base64,PHN2Zy')) {
    return (
      <div className={`${finalClass} ${rounded} ${border} overflow-hidden shrink-0 shadow-inner bg-slate-900 relative`}>
        <img 
          src={resolvedAvatarUrl} 
          alt={alt || resolvedName || "Scholar Avatar"} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  const avatar3dSrc = resolvedGender === 'female' ? AVATAR_3D_FEMALE : AVATAR_3D_MALE;

  if (resolvedGender !== 'tech' && !imgError) {
    return (
      <div className={`${finalClass} ${rounded} ${border} overflow-hidden shrink-0 shadow-md relative group bg-slate-950 flex items-center justify-center ${showRing ? 'ring-2 ring-indigo-500/40' : ''}`}>
        <img 
          src={avatar3dSrc} 
          alt={alt || `${resolvedGender} 3D Scholar Avatar`} 
          className="w-full h-full object-cover object-top select-none transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`${finalClass} ${rounded} ${border} overflow-hidden shrink-0 shadow-sm relative group bg-slate-950 flex items-center justify-center ${showRing ? 'ring-2 ring-indigo-500/30' : ''}`}>
      {resolvedGender === 'female' ? (
        <FemaleScholarGraphic className="w-full h-full object-cover" />
      ) : resolvedGender === 'tech' || resolvedGender === 'other' ? (
        <TechScholarGraphic className="w-full h-full object-cover" />
      ) : (
        <MaleScholarGraphic className="w-full h-full object-cover" />
      )}
    </div>
  );
}
