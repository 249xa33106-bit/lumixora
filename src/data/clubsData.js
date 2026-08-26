export const BANNER_COLOR_PRESETS = [
  { label: 'Deep Ocean Cyber', value: 'from-blue-600 via-indigo-600 to-purple-600' },
  { label: 'Emerald Aurora', value: 'from-emerald-500 via-teal-600 to-cyan-600' },
  { label: 'Solar Flare', value: 'from-amber-500 via-orange-600 to-red-600' },
  { label: 'Neon Velvet', value: 'from-pink-500 via-purple-600 to-rose-600' },
  { label: 'Spartan Mint', value: 'from-green-500 via-emerald-600 to-teal-700' },
  { label: 'Cosmic Violet', value: 'from-violet-600 via-purple-600 to-indigo-700' },
  { label: 'Candy Fuchsia', value: 'from-fuchsia-500 via-pink-600 to-purple-600' },
  { label: 'Electric Sunset', value: 'from-orange-500 via-rose-600 to-purple-700' }
];

export const DEFAULT_CLUB_CATEGORIES = [
  'Communication & Awareness',
  'Coding',
  'Entrepreneurship',
  'Cultural Activities'
];

export const DEFAULT_COLLEGE_CLUBS = [
  {
    id: 'club-code-craft',
    name: 'CodeCraft - Algorithmic & Open Source Society',
    shortName: 'CodeCraft Society',
    category: 'Coding',
    code: 'CODECRAFT',
    logo: '💻',
    bannerColor: 'from-blue-600 via-indigo-600 to-purple-600',
    description: 'Premier competitive programming and open-source development club. We host weekly coding sprints, hackathons, and GSoC preparation tracks.',
    leadName: 'Shaik Sowban & Tech Core',
    leadEmail: 'codecraft@lumixora.app',
    memberCount: 240,
    establishedYear: '2023',
    meetingSchedule: 'Every Wednesday @ 04:30 PM (CSM Lab)',
    tags: ['Competitive Coding', 'DSA', 'Open Source', 'Web3', 'FullStack'],
    scoreXP: 4850,
    upcomingEvents: [
      {
        id: 'evt-101',
        title: 'Lumixora CodeSprint 2026 - 48H Hackathon',
        date: '28 Aug 2026',
        time: '10:00 AM - 05:00 PM',
        venue: 'GPREC Main Auditorium & AI Lab',
        rewards: '₹15,000 Cash Pool + Certificates',
        category: 'Hackathon',
        status: 'Registration Open'
      },
      {
        id: 'evt-102',
        title: 'Mastering Graph Algorithms & DP Sprints',
        date: '02 Sep 2026',
        time: '04:00 PM - 06:00 PM',
        venue: 'Block B - Room 204',
        rewards: 'Skill XP & Badge',
        category: 'Workshop',
        status: 'Upcoming'
      }
    ],
    announcements: [
      'Registration open for Lumixora CodeSprint 2026!',
      'GitHub Student Developer Pack bootcamp scheduled for next Friday.'
    ]
  },
  {
    id: 'club-robotics-ai',
    name: 'RoboAI - Robotics & Embedded Systems Club',
    shortName: 'RoboAI Innovation Lab',
    category: 'Coding',
    code: 'ROBOAI',
    logo: '🤖',
    bannerColor: 'from-emerald-500 via-teal-600 to-cyan-600',
    description: 'Hardware innovation hub focusing on Autonomous Drones, IoT Sensors, Microcontrollers (Arduino/Raspberry Pi), and ROS-based Robotics.',
    leadName: 'ECE & Mech Core Team',
    leadEmail: 'roboai@lumixora.app',
    memberCount: 175,
    establishedYear: '2024',
    meetingSchedule: 'Every Saturday @ 02:00 PM (Electrical Lab)',
    tags: ['IoT', 'Robotics', 'Arduino', 'Drone Tech', 'PCB Design'],
    scoreXP: 4210,
    upcomingEvents: [
      {
        id: 'evt-201',
        title: 'Autonomous Line-Follower & Obstacle Bot Contest',
        date: '05 Sep 2026',
        time: '11:00 AM - 03:00 PM',
        venue: 'Block C - Robotics Research Center',
        rewards: 'Trophies & Hardware Kits',
        category: 'Competition',
        status: 'Registration Open'
      }
    ],
    announcements: [
      '3D Printer access now enabled for all registered RoboAI members.'
    ]
  },
  {
    id: 'club-ecell',
    name: 'E-Cell - Entrepreneurship & Incubation Cell',
    shortName: 'Lumixora E-Cell',
    category: 'Entrepreneurship',
    code: 'ECELL',
    logo: '🚀',
    bannerColor: 'from-amber-500 via-orange-600 to-red-600',
    description: 'Fostering student startup founders, product managers, and venture ideation. Pitching sessions with angel investors & incubation support.',
    leadName: 'Startup Innovation Board',
    leadEmail: 'ecell@lumixora.app',
    memberCount: 190,
    establishedYear: '2023',
    meetingSchedule: 'Bi-Weekly Thursdays @ 04:00 PM',
    tags: ['Startup Pitch', 'Venture Capital', 'Product Management', 'Marketing'],
    scoreXP: 3940,
    upcomingEvents: [
      {
        id: 'evt-301',
        title: 'Campus Founder Pitch Day 2026',
        date: '12 Sep 2026',
        time: '02:00 PM - 05:30 PM',
        venue: 'Central Seminar Hall',
        rewards: 'Seed Grants up to ₹50,000',
        category: 'Pitching',
        status: 'Upcoming'
      }
    ],
    announcements: [
      'Applications open for 2026 Campus Incubation Batch.'
    ]
  },
  {
    id: 'club-nexus-ai',
    name: 'NexusAI - Machine Learning & Intelligence Guild',
    shortName: 'NexusAI Guild',
    category: 'Coding',
    code: 'NEXUSAI',
    logo: '🧠',
    bannerColor: 'from-violet-600 via-purple-600 to-indigo-700',
    description: 'Deep dive into Generative AI, Large Language Models, Computer Vision, and Neural Networks. Building real-world AI applications.',
    leadName: 'AI Research Group',
    leadEmail: 'nexusai@lumixora.app',
    memberCount: 215,
    establishedYear: '2024',
    meetingSchedule: 'Fridays @ 04:00 PM (AI Supercomputer Lab)',
    tags: ['PyTorch', 'LLMs', 'Generative AI', 'Deep Learning', 'Kaggle'],
    scoreXP: 4500,
    upcomingEvents: [
      {
        id: 'evt-601',
        title: 'Building Custom RAG Apps with LLMs & Vector DBs',
        date: '18 Sep 2026',
        time: '03:00 PM - 06:00 PM',
        venue: 'AI Innovation Hub',
        rewards: 'GPU Credits + Certificates',
        category: 'Workshop',
        status: 'Registration Open'
      }
    ],
    announcements: [
      'Free Access to H100 GPU cluster granted for club research projects!'
    ]
  },
  {
    id: 'club-cultural-beat',
    name: 'Sanskriti - Cultural & Performing Arts Club',
    shortName: 'Sanskriti Club',
    category: 'Cultural Activities',
    code: 'SANSKRITI',
    logo: '🎭',
    bannerColor: 'from-pink-500 via-purple-600 to-rose-600',
    description: 'Celebrating music, dance, dramatics, photography, and fine arts. Organizing annual college cultural fests, flash mobs, and talent showcases.',
    leadName: 'Cultural Committee',
    leadEmail: 'cultural@lumixora.app',
    memberCount: 310,
    establishedYear: '2022',
    meetingSchedule: 'Fridays @ 04:30 PM (Canteen Amphitheatre)',
    tags: ['Music', 'Dance', 'Dramatics', 'Photography', 'Fine Arts'],
    scoreXP: 4720,
    upcomingEvents: [
      {
        id: 'evt-401',
        title: 'Annual Campus Talent Hunt & Music Night',
        date: '20 Sep 2026',
        time: '05:00 PM - 09:00 PM',
        venue: 'Grand Outdoor Amphitheatre',
        rewards: 'Exciting Prizes & Trophies',
        category: 'Cultural Fest',
        status: 'Registration Open'
      }
    ],
    announcements: [
      'Auditions for College Band & Dance Troupe starting next Monday!'
    ]
  },
  {
    id: 'club-pixelcraft',
    name: 'PixelCraft - Design & Digital Media Studio',
    shortName: 'PixelCraft Studio',
    category: 'Communication & Awareness',
    code: 'PIXELCRAFT',
    logo: '🎨',
    bannerColor: 'from-fuchsia-500 via-pink-600 to-purple-600',
    description: 'Design community focusing on UI/UX, Motion Graphics, 3D Rendering (Blender), Video Editing, and Graphic Branding.',
    leadName: 'Creative Media Crew',
    leadEmail: 'pixelcraft@lumixora.app',
    memberCount: 160,
    establishedYear: '2024',
    meetingSchedule: 'Mondays @ 04:00 PM (Design Lab)',
    tags: ['Figma', 'UI/UX', 'Blender 3D', 'After Effects', 'Branding'],
    scoreXP: 3680,
    upcomingEvents: [
      {
        id: 'evt-701',
        title: '24-Hour UI/UX Redesign Hackathon',
        date: '24 Sep 2026',
        time: '10:00 AM - 10:00 AM Next Day',
        venue: 'Design Studio 101',
        rewards: 'Figma Pro Subscriptions & Cash',
        category: 'Hackathon',
        status: 'Upcoming'
      }
    ],
    announcements: [
      'Figma Organization Plan licenses now available for registered design team members.'
    ]
  },
  {
    id: 'club-sports-league',
    name: 'Spartans - College Sports & Fitness League',
    shortName: 'Spartans Sports Club',
    category: 'Cultural Activities',
    code: 'SPARTANS',
    logo: '🏆',
    bannerColor: 'from-green-500 via-emerald-600 to-teal-700',
    description: 'Promoting athleticism, inter-college sports tournaments, badminton leagues, cricket championships, and daily fitness routines.',
    leadName: 'Sports Board',
    leadEmail: 'sports@lumixora.app',
    memberCount: 280,
    establishedYear: '2022',
    meetingSchedule: 'Daily @ 05:00 PM (Sports Arena)',
    tags: ['Cricket', 'Badminton', 'Volleyball', 'Chess', 'Fitness'],
    scoreXP: 4390,
    upcomingEvents: [
      {
        id: 'evt-501',
        title: 'Inter-Departmental Cricket Trophy 2026',
        date: '15 Sep 2026',
        time: '08:00 AM - 04:00 PM',
        venue: 'College Sports Ground',
        rewards: 'Championship Shield & Medals',
        category: 'Tournament',
        status: 'Registration Open'
      }
    ],
    announcements: [
      'Registrations open for Inter-Branch Badminton Singles & Doubles.'
    ]
  }
];
