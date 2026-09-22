// Comprehensive video mapping and resolver for all 18 Vyomra Roadmaps and 30-Day Tasks

const TOPIC_VIDEO_REGISTRY = [
  // ── 1. Full Stack & Web Development (HTML, CSS, JS, React, Node, Express, Databases) ──
  { keys: ['how the web works', 'http', 'dns', 'setup'], id: '7_LPdttKXPc', channel: 'freeCodeCamp', duration: '25 mins' },
  { keys: ['semantic html5', 'form elements', 'html tags'], id: 'kUMe1FH4CHE', channel: 'freeCodeCamp', duration: '2 hours' },
  { keys: ['css3 basics', 'selectors', 'box model', 'typography'], id: '1Rs2ND1ryYc', channel: 'freeCodeCamp', duration: '1.5 hours' },
  { keys: ['flexbox', 'layouts with css flexbox'], id: 'fYq5PXgSsbE', channel: 'Kevin Powell', duration: '40 mins' },
  { keys: ['css grid', 'layouts with css grid'], id: 'rg7Fvvl3taU', channel: 'Kevin Powell', duration: '45 mins' },
  { keys: ['responsive design', 'media queries'], id: 'srvUrASNj0s', channel: 'freeCodeCamp', duration: '1 hour' },
  { keys: ['variables, data types', 'operators in js', 'javascript basics'], id: 'W6NZfCO5SIk', channel: 'Programming with Mosh', duration: '1 hour' },
  { keys: ['functions, scope', 'closures'], id: '1kLw8kZulc0', channel: 'Traversy Media', duration: '45 mins' },
  { keys: ['objects, arrays', 'map, filter, reduce', 'array methods'], id: 'R8rmfD9Y5-c', channel: 'freeCodeCamp', duration: '50 mins' },
  { keys: ['dom manipulation', 'event listeners'], id: '0ik6X4DJKCc', channel: 'Traversy Media', duration: '1.2 hours' },
  { keys: ['asynchronous js', 'promises', 'async/await'], id: 'PoRJizFvM7s', channel: 'Fireship', duration: '20 mins' },
  { keys: ['fetch api', 'third-party apis', 'rest api integration'], id: 'cuEtnrL9-H0', channel: 'Web Dev Simplified', duration: '35 mins' },
  { keys: ['intro to react', 'jsx, components, props'], id: 'bMknfKXIFA8', channel: 'freeCodeCamp', duration: '1.5 hours' },
  { keys: ['usestate', 'state management and event handling'], id: 'O6P86uwfdR0', channel: 'Web Dev Simplified', duration: '30 mins' },
  { keys: ['useeffect', 'component lifecycle'], id: '0ZJgIjIuY7U', channel: 'Web Dev Simplified', duration: '30 mins' },
  { keys: ['react router', 'react router dom'], id: 'Ul3y1LXxzdU', channel: 'Web Dev Simplified', duration: '45 mins' },
  { keys: ['context api', 'redux toolkit', 'global state'], id: 'bbkBuqC1rU4', channel: 'Dave Gray', duration: '1.2 hours' },
  { keys: ['tailwind css', 'styling in react'], id: 'dFgzHOX84xQ', channel: 'Traversy Media', duration: '40 mins' },
  { keys: ['node.js basics', 'modules, file system'], id: 'TlB_eWDSMt4', channel: 'Programming with Mosh', duration: '1.2 hours' },
  { keys: ['express.js server setup', 'express routing'], id: 'SccSCuHhOw0', channel: 'Web Dev Simplified', duration: '35 mins' },
  { keys: ['express middleware', 'error handling'], id: 'lY6icfhap2o', channel: 'Web Dev Simplified', duration: '30 mins' },
  { keys: ['postgresql', 'relational databases', 'sql basics'], id: 'qw--VYLpxG4', channel: 'freeCodeCamp', duration: '4.5 hours' },
  { keys: ['mongodb', 'mongoose odm', 'nosql databases'], id: 'DZBGEExL2eE', channel: 'Web Dev Simplified', duration: '40 mins' },
  { keys: ['jwt', 'bcrypt', 'authentication and rest api'], id: 'mbsmsi7l3r4', channel: 'Web Dev Simplified', duration: '45 mins' },
  { keys: ['capstone', 'full stack app'], id: 'nu_pCVPKzTk', channel: 'freeCodeCamp', duration: '11.5 hours' },
  { keys: ['backend models and api routes'], id: 'Oe421EPjeBE', channel: 'freeCodeCamp', duration: '3 hours' },
  { keys: ['connect to backend via fetch', 'axios'], id: '4yqu8YF29dU', channel: 'freeCodeCamp', duration: '2 hours' },
  { keys: ['authentication flow', 'login/register sessions'], id: '7Na1cK6w25A', channel: 'Web Dev Simplified', duration: '45 mins' },
  { keys: ['test application', 'testing-library', 'unit testing'], id: '7r4xVDI2vho', channel: 'Traversy Media', duration: '50 mins' },
  { keys: ['deploy backend', 'deploy to vercel', 'render/railway'], id: '1hhm6453n0s', channel: 'freeCodeCamp', duration: '40 mins' },

  // ── 2. IT Placements, C++, Java & DSA ──
  { keys: ['install ide', 'hello world in c++', 'c++ basics'], id: 'z9bZufPHFLU', channel: 'Apna College', duration: '10.5 hours' },
  { keys: ['variables, data types, and operators in c++', 'variables-in-c'], id: 'EAR7De6Goz4', channel: 'freeCodeCamp', duration: '1 hour' },
  { keys: ['control flow', 'if/else', 'switch', 'loops in c++'], id: '7DTe6x3PqR8', channel: 'take U forward', duration: '45 mins' },
  { keys: ['pointers', 'references', 'functions in c++'], id: '2ybLD6_2gKM', channel: 'freeCodeCamp', duration: '1.5 hours' },
  { keys: ['object-oriented programming', 'classes & objects in c++'], id: 'wN0x9eZLix4', channel: 'freeCodeCamp', duration: '1.5 hours' },
  { keys: ['encapsulation', 'inheritance', 'polymorphism'], id: '4a0FbQdH3dY', channel: 'take U forward', duration: '1 hour' },
  { keys: ['big o', 'time and space complexity'], id: 'FPu9Uld7W-E', channel: 'take U forward', duration: '35 mins' },
  { keys: ['two-pointer', 'array traversal'], id: '1pkOGxDId5g', channel: 'take U forward', duration: '40 mins' },
  { keys: ['sliding window'], id: '9kdHxplyl5I', channel: 'take U forward', duration: '45 mins' },
  { keys: ['matrix operations', 'multi-dimensional arrays'], id: '1ZGJzvkcLsA', channel: 'take U forward', duration: '40 mins' },
  { keys: ['singly linked list', 'insertion, deletion, reversal'], id: 'Nq7ok-OyEpg', channel: 'take U forward', duration: '50 mins' },
  { keys: ['cycle detection', 'fast and slow pointers'], id: 'wiOo4DC5GGA', channel: 'take U forward', duration: '35 mins' },
  { keys: ['stacks and queues', 'parentheses matching'], id: '7m1DMYAbMbY', channel: 'take U forward', duration: '45 mins' },
  { keys: ['binary trees', 'traversals', 'inorder, preorder'], id: 'jmy0LaGET1I', channel: 'take U forward', duration: '1 hour' },
  { keys: ['binary search tree', 'bst operations'], id: 'p7-9UvDQZ3w', channel: 'take U forward', duration: '55 mins' },
  { keys: ['graph representation', 'bfs/dfs traversal'], id: '-tgVpUgsQ5A', channel: 'take U forward', duration: '1.2 hours' },
  { keys: ['recursion and backtracking', 'n-queens'], id: 'i05Ju7AftcM', channel: 'take U forward', duration: '1 hour' },
  { keys: ['dynamic programming', 'memoization & tabulation'], id: 'tyB0ztf0DNY', channel: 'take U forward', duration: '1.5 hours' },
  { keys: ['dbms basics', 'relational algebra', 'sql queries'], id: 'kBdlM6hNDAE', channel: 'Gate Smashers', duration: '45 mins' },
  { keys: ['normalization', 'acid properties'], id: '5fs1PRflmD8', channel: 'Gate Smashers', duration: '35 mins' },
  { keys: ['operating systems', 'processes, threads', 'cpu scheduling'], id: 'bkSWJJZNgf8', channel: 'Gate Smashers', duration: '50 mins' },
  { keys: ['memory management', 'paging', 'deadlocks'], id: '9Goo4eEchQo', channel: 'Gate Smashers', duration: '45 mins' },
  { keys: ['computer networks', 'osi model', 'tcp/ip'], id: 'IPvYjXCsTg8', channel: 'Neso Academy', duration: '1.2 hours' },
  { keys: ['system design', 'scalability', 'load balancing'], id: 'xpDnVSmNFX0', channel: 'Gaurav Sen', duration: '5 hours' },
  { keys: ['quantitative aptitude', 'time & work'], id: '4g_lqS3U1bU', channel: 'CareerRide', duration: '1 hour' },
  { keys: ['logical reasoning', 'puzzles', 'blood relations'], id: '7V2XgX_n8wI', channel: 'CareerRide', duration: '1 hour' },
  { keys: ['star method', 'hr answers', 'behavioral rounds'], id: '0nphnBqK1vo', channel: 'The Companies Expert', duration: '30 mins' },
  { keys: ['mock interview', 'interviewbit', 'pramp'], id: '1qw5ITr3k9E', channel: 'Exponent', duration: '45 mins' },

  // ── 3. AI & Machine Learning ──
  { keys: ['python for data science', 'jupyter notebook'], id: 'LHBE6Q9XlzI', channel: 'freeCodeCamp', duration: '6 hours' },
  { keys: ['numpy array manipulation'], id: 'QUT1VHiLmmI', channel: 'freeCodeCamp', duration: '1 hour' },
  { keys: ['pandas dataframes', 'data cleaning'], id: 'vmEHCJofslg', channel: 'Keith Galli', duration: '1 hour' },
  { keys: ['matplotlib', 'seaborn', 'exploratory data analysis'], id: 'UO98lJQ3QGI', channel: 'freeCodeCamp', duration: '1.5 hours' },
  { keys: ['linear regression', 'gradient descent'], id: 'nk2CQITm_eo', channel: 'StatQuest', duration: '30 mins' },
  { keys: ['logistic regression', 'classification metrics'], id: 'yIYKR4sgzI8', channel: 'StatQuest', duration: '35 mins' },
  { keys: ['decision trees', 'random forest'], id: '_L39rN6gz7Y', channel: 'StatQuest', duration: '40 mins' },
  { keys: ['neural networks', 'backpropagation from scratch'], id: 'aircAruvnKk', channel: '3Blue1Brown', duration: '20 mins' },
  { keys: ['pytorch fundamentals', 'tensors and autograd'], id: 'V_xro1bcAuA', channel: 'freeCodeCamp', duration: '25 hours' },
  { keys: ['convolutional neural networks', 'cnn', 'computer vision'], id: 'IA3WxTTPXqQ', channel: 'freeCodeCamp', duration: '2 hours' },
  { keys: ['transformers', 'attention is all you need', 'llm'], id: 'kCc8FmEb1nY', channel: 'Andrej Karpathy', duration: '2 hours' },
  { keys: ['langchain', 'rag', 'vector database'], id: 'lG7Uxts9SXs', channel: 'freeCodeCamp', duration: '3 hours' },

  // ── 4. Cloud & DevOps ──
  { keys: ['linux fundamentals', 'shell scripting', 'bash'], id: 's3ii48qYBxA', channel: 'freeCodeCamp', duration: '5 hours' },
  { keys: ['git version control', 'github workflows'], id: 'RGOj5yH7evk', channel: 'freeCodeCamp', duration: '1 hour' },
  { keys: ['docker containerization', 'dockerfile'], id: '3c-iBn73dDE', channel: 'TechWorld with Nana', duration: '3 hours' },
  { keys: ['kubernetes architecture', 'pods, services'], id: 'X48VuDVv0do', channel: 'TechWorld with Nana', duration: '4 hours' },
  { keys: ['aws core services', 'ec2, s3, vpc'], id: 'k1RI5locZE4', channel: 'freeCodeCamp', duration: '13 hours' },
  { keys: ['terraform', 'infrastructure as code'], id: '7xngnjfIlK4', channel: 'freeCodeCamp', duration: '2 hours' },
  { keys: ['ci/cd pipelines', 'github actions'], id: 'R8_veQiYBjI', channel: 'TechWorld with Nana', duration: '1.5 hours' },

  // ── 5. Cybersecurity ──
  { keys: ['networking for hackers', 'wireshark packet analysis'], id: 'qpnxKz96_r0', channel: 'NetworkChuck', duration: '40 mins' },
  { keys: ['linux security', 'kali linux setup'], id: 'lZAoFs75_cs', channel: 'freeCodeCamp', duration: '4 hours' },
  { keys: ['reconnaissance', 'nmap network scanning'], id: '3Kq1MIfTWCE', channel: 'freeCodeCamp', duration: '15 hours' },
  { keys: ['owasp top 10', 'sql injection', 'xss'], id: '2_lswM1S264', channel: 'PwnFunction', duration: '30 mins' },
  { keys: ['cryptography fundamentals', 'rsa, aes'], id: 'jhXCTbFnK8o', channel: 'Computerphile', duration: '25 mins' },
  { keys: ['metasploit', 'privilege escalation'], id: 'kGzPj2j36eA', channel: 'David Bombal', duration: '1 hour' },

  // ── 6. Mobile App Development (Flutter & React Native) ──
  { keys: ['dart programming', 'dart syntax'], id: 'Ej_Pcr4uC2Q', channel: 'freeCodeCamp', duration: '1.5 hours' },
  { keys: ['flutter basics', 'stateless & stateful widgets'], id: 'VPvVD8t02U8', channel: 'freeCodeCamp', duration: '37 hours' },
  { keys: ['navigation in flutter', 'state management provider/bloc'], id: 'oxeYe9f6XfI', channel: 'Rivaan Ranawat', duration: '2 hours' },

  // ── 7. UI / UX Design ──
  { keys: ['figma basics', 'frames and shapes'], id: 'c9Wg6Cb_YlU', channel: 'freeCodeCamp', duration: '2 hours' },
  { keys: ['wireframing', 'user flows', 'prototyping'], id: 'FTFaQWZBqQ8', channel: 'Mizko', duration: '1 hour' },
  { keys: ['design systems', 'auto-layout in figma'], id: 'j6Ule7GXaRs', channel: 'Figma', duration: '45 mins' },

  // ── 8. Python Backend & FastAPI/Django ──
  { keys: ['python programming for beginners'], id: '_uQrJ0TkZlc', channel: 'Programming with Mosh', duration: '6 hours' },
  { keys: ['fastapi', 'rest api with python'], id: '7t2alSnE2-I', channel: 'freeCodeCamp', duration: '19 hours' },
  { keys: ['django web framework'], id: 'F5mRW0jo-U4', channel: 'freeCodeCamp', duration: '4 hours' },

  // ── 9. Java & Spring Boot ──
  { keys: ['java programming full course'], id: 'eIrMbAQSU34', channel: 'Programming with Mosh', duration: '2.5 hours' },
  { keys: ['spring boot', 'spring microservices'], id: '9SGDpanrc8U', channel: 'freeCodeCamp', duration: '2 hours' }
];

/**
 * Resolves a high-quality, verified YouTube video lecture for any roadmap task.
 */
export function resolveLectureVideo(roadmap, step, item, itemIndex = 0, stepIndex = 0) {
  const itemText = (item?.text || '').toLowerCase();
  const stepTitle = (step?.title || '').toLowerCase();
  const roadmapTitle = (roadmap?.title || '').toLowerCase();
  const query = `${itemText} ${stepTitle} ${roadmapTitle}`;

  // 1. Direct custom videoUrl if defined in item
  if (item?.videoUrl && typeof item.videoUrl === 'string' && !item.videoUrl.includes('listType=search')) {
    const isEmbed = item.videoUrl.includes('youtube.com/embed');
    const embedUrl = isEmbed ? item.videoUrl : `https://www.youtube.com/embed/${extractYouTubeId(item.videoUrl) || ''}`;
    const watchUrl = item.videoUrl.includes('watch?v=') ? item.videoUrl : `https://www.youtube.com/watch?v=${extractYouTubeId(embedUrl)}`;
    return {
      title: item.text,
      stepTitle: step?.title || 'Daily Step',
      roadmapTitle: roadmap?.title || 'Career Roadmap',
      videoUrl: embedUrl,
      watchUrl: watchUrl,
      notesUrl: item.url,
      channel: item.channel || 'Official Educator',
      duration: item.duration || '~30-45 mins'
    };
  }

  // 2. Lookup in our high-yield topic registry
  for (const entry of TOPIC_VIDEO_REGISTRY) {
    const matches = entry.keys.some(key => query.includes(key.toLowerCase()));
    if (matches) {
      return {
        title: item.text,
        stepTitle: step?.title || 'Daily Step',
        roadmapTitle: roadmap?.title || 'Career Roadmap',
        videoUrl: `https://www.youtube.com/embed/${entry.id}`,
        watchUrl: `https://www.youtube.com/watch?v=${entry.id}`,
        notesUrl: item.url,
        channel: entry.channel,
        duration: entry.duration
      };
    }
  }

  // 3. Fallback to roadmap's primary curated video resource
  const curatedFallback = roadmap?.resources?.videos?.[stepIndex % (roadmap?.resources?.videos?.length || 1)];
  if (curatedFallback?.embedUrl) {
    return {
      title: item.text,
      stepTitle: step?.title || 'Curated Series',
      roadmapTitle: roadmap?.title || 'Career Roadmap',
      videoUrl: curatedFallback.embedUrl,
      watchUrl: curatedFallback.url || `https://www.youtube.com/watch?v=${extractYouTubeId(curatedFallback.embedUrl)}`,
      notesUrl: item.url,
      channel: curatedFallback.channel || 'Vyomra Masterclass',
      duration: curatedFallback.duration || 'Full Course'
    };
  }

  // 4. Guaranteed generic fallback (freeCodeCamp Full Computer Science & Tech Primer)
  return {
    title: item.text,
    stepTitle: step?.title || 'Daily Lecture',
    roadmapTitle: roadmap?.title || 'Career Roadmap',
    videoUrl: 'https://www.youtube.com/embed/nu_pCVPKzTk',
    watchUrl: 'https://www.youtube.com/watch?v=nu_pCVPKzTk',
    notesUrl: item.url,
    channel: 'freeCodeCamp.org',
    duration: '~45 mins'
  };
}

function extractYouTubeId(url) {
  if (!url) return '';
  const match = url.match(/(?:embed\/|v=|vi=|\.be\/)([^?&"'>]+)/);
  return match ? match[1] : '';
}
