export const APTITUDE_CATEGORIES = [
  { id: 'All', name: 'All Aptitude', icon: 'Brain' },
  { id: 'Quantitative', name: 'Quantitative Aptitude', icon: 'Calculator' },
  { id: 'Logical', name: 'Logical Reasoning', icon: 'Cpu' },
  { id: 'Verbal', name: 'Verbal Ability', icon: 'BookOpen' },
  { id: 'Technical Output', name: 'C/C++ Pseudocode & Output', icon: 'Code' }
];

export const APTITUDE_COMPANIES = [
  'All',
  'TCS NQT',
  'Accenture ASE',
  'Wipro NLTH',
  'Infosys DSE',
  'Cognizant GenC',
  'Amazon',
  'Capgemini'
];

export const COMPANY_TEST_PRESETS = [
  { id: 'tcs', name: 'TCS NQT Cognitive Challenge', company: 'TCS NQT', duration: 15, questionCount: 10, badge: 'TCS Certified' },
  { id: 'accenture', name: 'Accenture Technical & Logic Sprint', company: 'Accenture ASE', duration: 12, questionCount: 8, badge: 'Accenture Ready' },
  { id: 'infosys', name: 'Infosys DSE Pseudocode Assessment', company: 'Infosys DSE', duration: 15, questionCount: 10, badge: 'Infosys Top Coder' },
  { id: 'amazon', name: 'Amazon Technical Aptitude Sprint', company: 'Amazon', duration: 20, questionCount: 10, badge: 'Amazon SDE Master' }
];

export const APTITUDE_FORMULAS = [
  {
    category: 'Quantitative',
    title: 'Time & Work Reciprocal Rule',
    formula: 'If A takes X days and B takes Y days, together they take (X * Y) / (X + Y) days.',
    trick: 'For 3 people (X, Y, Z): Total Days = (XYZ) / (XY + YZ + ZX).'
  },
  {
    category: 'Quantitative',
    title: 'Speed Unit Conversion',
    formula: '1 m/s = (18/5) km/h | 1 km/h = (5/18) m/s',
    trick: 'To convert m/s to km/h, multiply by 3.6 directly.'
  },
  {
    category: 'Quantitative',
    title: 'Percentage Consumption Reduction',
    formula: 'Reduction % = [ R / (100 + R) ] * 100%',
    trick: 'If price increases by 25%, reduction is 25/125 = 20%.'
  },
  {
    category: 'Logical',
    title: 'Alphabet Reverse Rank Formula',
    formula: 'Reverse Position of Letter = 27 - Forward Position',
    trick: 'Memory mnemonic: A=1, E=5, J=10, O=15, T=20, Y=25 (EJOTY).'
  },
  {
    category: 'Logical',
    title: 'Blood Relation Symbol Mapping',
    formula: 'Male = [ + ] or Square | Female = [ - ] or Circle | Couple = [ = ] | Siblings = [ - ]',
    trick: 'Draw generation levels vertically from grandparents down to children.'
  },
  {
    category: 'Technical Output',
    title: 'C Pointer Arithmetic Rule',
    formula: 'ptr + n = address + (n * sizeof(datatype))',
    trick: '`*(ptr + i)` is identical to `ptr[i]`. Array name is a constant pointer to 1st element.'
  },
  {
    category: 'Technical Output',
    title: 'Bitwise XOR Properties',
    formula: 'A ^ A = 0 | A ^ 0 = A | A ^ B = B ^ A',
    trick: 'XORing a number with itself cancels it out (used for finding single non-repeating number).'
  }
];

export const INITIAL_APTITUDE_QUESTIONS = [
  // --- Quantitative Aptitude ---
  {
    id: 'apt-1',
    category: 'Quantitative',
    subTopic: 'Time and Work',
    company: 'TCS NQT',
    difficulty: 'Easy',
    question: 'A can complete a piece of work in 12 days and B can complete the same work in 18 days. If they work together, in how many days will the work be finished?',
    options: ['7.2 days', '6.5 days', '7.5 days', '8 days'],
    correctAnswer: 0, // '7.2 days'
    explanation: 'A\'s 1 day work = 1/12. B\'s 1 day work = 1/18.\nCombined 1 day work = 1/12 + 1/18 = (3 + 2)/36 = 5/36.\nTotal days required = 36/5 = 7.2 days.'
  },
  {
    id: 'apt-2',
    category: 'Quantitative',
    subTopic: 'Speed, Distance & Time',
    company: 'Accenture ASE',
    difficulty: 'Medium',
    question: 'A train 150 meters long passes a telegraph pole in 9 seconds. What is the speed of the train in km/h?',
    options: ['50 km/h', '60 km/h', '54 km/h', '45 km/h'],
    correctAnswer: 1, // '60 km/h'
    explanation: 'Speed = Distance / Time = 150m / 9s = 50/3 m/s.\nTo convert m/s to km/h, multiply by 18/5:\nSpeed in km/h = (50/3) * (18/5) = 10 * 6 = 60 km/h.'
  },
  {
    id: 'apt-3',
    category: 'Quantitative',
    subTopic: 'Percentages',
    company: 'Wipro NLTH',
    difficulty: 'Easy',
    question: 'If the price of sugar increases by 25%, by what percentage must a household reduce its consumption so that the expenditure remains unchanged?',
    options: ['20%', '25%', '15%', '18%'],
    correctAnswer: 0, // '20%'
    explanation: 'Reduction in consumption = [R / (100 + R)] * 100%\n= [25 / (100 + 25)] * 100%\n= (25 / 125) * 100% = 1/5 * 100% = 20%.'
  },
  {
    id: 'apt-4',
    category: 'Quantitative',
    subTopic: 'Profit and Loss',
    company: 'Infosys DSE',
    difficulty: 'Medium',
    question: 'An article is sold for ₹840 at a profit of 20%. What was its cost price?',
    options: ['₹700', '₹720', '₹750', '₹680'],
    correctAnswer: 0, // '₹700'
    explanation: 'Selling Price (SP) = Cost Price (CP) * 1.20\n840 = CP * 1.20\nCP = 840 / 1.20 = ₹700.'
  },
  {
    id: 'apt-5',
    category: 'Quantitative',
    subTopic: 'Probability',
    company: 'Cognizant GenC',
    difficulty: 'Hard',
    question: 'Two dice are thrown simultaneously. What is the probability of getting a sum equal to 8?',
    options: ['5/36', '1/6', '7/36', '1/9'],
    correctAnswer: 0, // '5/36'
    explanation: 'Total possible outcomes = 6 * 6 = 36.\nFavorable outcomes for sum = 8 are: (2,6), (3,5), (4,4), (5,3), (6,2) -> 5 outcomes.\nProbability = 5 / 36.'
  },
  {
    id: 'apt-6',
    category: 'Quantitative',
    subTopic: 'Ratios & Proportions',
    company: 'TCS NQT',
    difficulty: 'Easy',
    question: 'If A : B = 3 : 4 and B : C = 8 : 9, find A : C.',
    options: ['2 : 3', '1 : 2', '3 : 2', '4 : 5'],
    correctAnswer: 0, // '2 : 3'
    explanation: 'A/B = 3/4 and B/C = 8/9.\nA/C = (A/B) * (B/C) = (3/4) * (8/9) = 24/36 = 2/3.'
  },

  // --- Logical Reasoning ---
  {
    id: 'apt-7',
    category: 'Logical',
    subTopic: 'Coding-Decoding',
    company: 'TCS NQT',
    difficulty: 'Easy',
    question: 'In a certain code language, "COMPUTER" is written as "RFUVQNPC". How is "MEDICINE" written in that code?',
    options: ['EOJDEJFM', 'EOJDJEFM', 'MFEDJJOE', 'MFEJDJOE'],
    correctAnswer: 1, // 'EOJDJEFM'
    explanation: 'The word is reversed first: R E T U P M O C.\nThen each letter except start & end is incremented by 1 shift: R->R, E->F, T->U, U->V, P->Q, M->N, O->P, C->C.\nApplying reverse to MEDICINE: E N I C I D E M -> Shift middle letters +1 -> E O J D J E F M.'
  },
  {
    id: 'apt-8',
    category: 'Logical',
    subTopic: 'Blood Relations',
    company: 'Accenture ASE',
    difficulty: 'Medium',
    question: 'Pointing to a photograph, a man said, "I have no brother or sister, but that man\'s father is my father\'s son." Whose photograph was it?',
    options: ['His son\'s', 'His own', 'His father\'s', 'His nephew\'s'],
    correctAnswer: 0, // 'His son\'s'
    explanation: '"My father\'s son" = the man himself (since he has no brothers or sisters).\nSo, "that man\'s father" = the speaker himself.\nTherefore, the photograph is of his son.'
  },
  {
    id: 'apt-9',
    category: 'Logical',
    subTopic: 'Series Completion',
    company: 'Wipro NLTH',
    difficulty: 'Easy',
    question: 'Find the next term in the series: 4, 9, 19, 39, 79, ?',
    options: ['159', '149', '169', '139'],
    correctAnswer: 0, // '159'
    explanation: 'Pattern: Each term is multiplied by 2 and 1 is added:\n4 * 2 + 1 = 9\n9 * 2 + 1 = 19\n19 * 2 + 1 = 39\n39 * 2 + 1 = 79\n79 * 2 + 1 = 159.'
  },
  {
    id: 'apt-10',
    category: 'Logical',
    subTopic: 'Syllogisms',
    company: 'Amazon',
    difficulty: 'Hard',
    question: 'Statements:\n1. All cars are vehicles.\n2. No vehicle is a boat.\nConclusions:\nI. No car is a boat.\nII. Some vehicles are cars.',
    options: ['Both I and II follow', 'Only I follows', 'Only II follows', 'Neither I nor II follows'],
    correctAnswer: 0, // 'Both I and II follow'
    explanation: 'Conclusion I: Since all cars are inside vehicles and no vehicle is a boat, no car can be a boat. (Valid)\nConclusion II: Since all cars are vehicles, those vehicle parts containing cars are vehicles. (Valid)'
  },
  {
    id: 'apt-11',
    category: 'Logical',
    subTopic: 'Direction Sense',
    company: 'Infosys DSE',
    difficulty: 'Medium',
    question: 'A person walks 5 km North, turns right and walks 3 km, then turns right again and walks 5 km. In which direction is he from the starting point?',
    options: ['East', 'West', 'South', 'North'],
    correctAnswer: 0, // 'East'
    explanation: 'North 5 km (+5 Y), Right turn (East) 3 km (+3 X), Right turn (South) 5 km (-5 Y).\nFinal coordinate: (3, 0), which is due East of origin.'
  },

  // --- Verbal Ability ---
  {
    id: 'apt-12',
    category: 'Verbal',
    subTopic: 'Synonyms & Antonyms',
    company: 'Cognizant GenC',
    difficulty: 'Easy',
    question: 'Choose the word which is most SIMILAR in meaning to "PRAGMATIC".',
    options: ['Practical', 'Theoretical', 'Idealistic', 'Impractical'],
    correctAnswer: 0, // 'Practical'
    explanation: '"Pragmatic" means dealing with things sensibly and realistically based on practical considerations.'
  },
  {
    id: 'apt-13',
    category: 'Verbal',
    subTopic: 'Sentence Correction',
    company: 'Capgemini',
    difficulty: 'Medium',
    question: 'Identify the error in the sentence: "Neither of the two candidates have submitted their resume."',
    options: ['have submitted (should be has submitted)', 'Neither of (should be Either of)', 'their resume (should be its)', 'No error'],
    correctAnswer: 0, // 'have submitted'
    explanation: '"Neither" takes a singular verb. The correct phrase is "has submitted".'
  },
  {
    id: 'apt-14',
    category: 'Verbal',
    subTopic: 'Para Jumbles',
    company: 'TCS NQT',
    difficulty: 'Hard',
    question: 'Rearrange the sentences into a coherent paragraph:\nP. Technology has revolutionized the education system.\nQ. Students can now access courses online from anywhere.\nR. This has bridged the geographic divide significantly.\nS. Traditional classrooms are no longer the sole source of knowledge.',
    options: ['P-S-Q-R', 'P-Q-R-S', 'Q-P-S-R', 'S-P-Q-R'],
    correctAnswer: 0, // 'P-S-Q-R'
    explanation: 'P introduces the main subject (technology in education). S expands on traditional vs modern. Q details online access. R concludes with geographic impact.'
  },

  // --- Technical Output & C/C++ Pseudocode ---
  {
    id: 'apt-15',
    category: 'Technical Output',
    subTopic: 'C Pointers & Memory',
    company: 'TCS NQT',
    difficulty: 'Medium',
    question: 'What is the output of the following C code snippet?\n\n#include <stdio.h>\nint main() {\n    int a[] = {10, 20, 30, 40};\n    int *p = a;\n    printf("%d", *(p + 2));\n    return 0;\n}',
    options: ['30', '20', '10', '40'],
    correctAnswer: 0, // '30'
    explanation: '`p` points to the first element `a[0]` (10).\n`p + 2` moves pointer 2 positions ahead to `a[2]`.\nDereferencing `*(p + 2)` returns `30`.'
  },
  {
    id: 'apt-16',
    category: 'Technical Output',
    subTopic: 'Recursion Output',
    company: 'Accenture ASE',
    difficulty: 'Hard',
    question: 'What does the function `func(4)` return?\n\nint func(int n) {\n    if (n <= 1) return 1;\n    return n + func(n - 1);\n}',
    options: ['10', '24', '15', '8'],
    correctAnswer: 0, // '10'
    explanation: 'func(4) = 4 + func(3)\nfunc(3) = 3 + func(2)\nfunc(2) = 2 + func(1)\nfunc(1) = 1\nResult = 4 + 3 + 2 + 1 = 10.'
  },
  {
    id: 'apt-17',
    category: 'Technical Output',
    subTopic: 'Bitwise Operations',
    company: 'Amazon',
    difficulty: 'Medium',
    question: 'What is the value of `x` after evaluating: `int x = 5 ^ 3;` in C/C++?',
    options: ['6', '2', '8', '15'],
    correctAnswer: 0, // '6'
    explanation: '5 in binary = 0101\n3 in binary = 0011\nXOR (^) operation:\n0101 ^ 0011 = 0110 in binary = 6.'
  },
  {
    id: 'apt-18',
    category: 'Technical Output',
    subTopic: 'Loop Control',
    company: 'Infosys DSE',
    difficulty: 'Easy',
    question: 'How many times will "Lumixora" be printed?\n\nfor(int i = 0; i < 10; i += 3) {\n    printf("Lumixora\\n");\n}',
    options: ['4 times', '3 times', '10 times', '5 times'],
    correctAnswer: 0, // '4 times'
    explanation: 'i values: 0, 3, 6, 9. When i becomes 12, i < 10 is false. Total iterations = 4.'
  },

  // --- Additional Quantitative Aptitude ---
  {
    id: 'apt-19',
    category: 'Quantitative',
    subTopic: 'Permutations & Combinations',
    company: 'TCS NQT',
    difficulty: 'Medium',
    question: 'In how many different ways can the letters of the word "LEADING" be arranged so that the vowels always come together?',
    options: ['720', '360', '5040', '1440'],
    correctAnswer: 0, // 720
    explanation: 'Vowels in LEADING: E, A, I (3 vowels). Consonants: L, D, N, G (4 consonants).\nGroup 3 vowels into 1 single unit -> Total units to arrange = 4 consonants + 1 unit = 5 units.\n5 units can be arranged in 5! = 120 ways.\nThe 3 vowels inside the group can be arranged in 3! = 6 ways.\nTotal arrangements = 120 * 6 = 720 ways.'
  },
  {
    id: 'apt-20',
    category: 'Quantitative',
    subTopic: 'Averages',
    company: 'Accenture ASE',
    difficulty: 'Easy',
    question: 'The average weight of 8 men is increased by 1.5 kg when one of the men who weighs 65 kg is replaced by a new man. What is the weight of the new man?',
    options: ['77 kg', '75 kg', '80 kg', '72.5 kg'],
    correctAnswer: 0, // 77 kg
    explanation: 'Total weight increase = 8 * 1.5 kg = 12 kg.\nWeight of new man = Weight of replaced man + Total increase = 65 + 12 = 77 kg.'
  },
  {
    id: 'apt-21',
    category: 'Quantitative',
    subTopic: 'Clocks',
    company: 'Wipro NLTH',
    difficulty: 'Hard',
    question: 'At what angle are the hands of a clock inclined at 15 minutes past 4 o\'clock?',
    options: ['37.5°', '30°', '45°', '52.5°'],
    correctAnswer: 0, // 37.5°
    explanation: 'Hour hand angle at 4:15 = 30 * 4 + 0.5 * 15 = 120 + 7.5 = 127.5°.\nMinute hand angle at 15 mins = 6 * 15 = 90°.\nAngle difference = 127.5° - 90° = 37.5°.'
  },
  {
    id: 'apt-22',
    category: 'Quantitative',
    subTopic: 'Simple & Compound Interest',
    company: 'Infosys DSE',
    difficulty: 'Medium',
    question: 'Find the compound interest on ₹10,000 at 10% per annum for 2 years compounded annually.',
    options: ['₹2,100', '₹2,000', '₹2,200', '₹1,900'],
    correctAnswer: 0, // ₹2,100
    explanation: 'Amount = P * (1 + R/100)^n = 10,000 * (1.10)^2 = 10,000 * 1.21 = ₹12,100.\nCI = Amount - Principal = 12,100 - 10,000 = ₹2,100.'
  },
  {
    id: 'apt-23',
    category: 'Quantitative',
    subTopic: 'Pipes & Cisterns',
    company: 'Cognizant GenC',
    difficulty: 'Medium',
    question: 'Pipe A can fill a tank in 20 hours and Pipe B can fill it in 30 hours. If both pipes are opened together, how long will it take to fill the tank?',
    options: ['12 hours', '15 hours', '10 hours', '25 hours'],
    correctAnswer: 0, // 12 hours
    explanation: 'Combined rate = 1/20 + 1/30 = (3 + 2)/60 = 5/60 = 1/12.\nTime required = 12 hours.'
  },

  // --- Additional Logical Reasoning ---
  {
    id: 'apt-24',
    category: 'Logical',
    subTopic: 'Seating Arrangement',
    company: 'Amazon',
    difficulty: 'Hard',
    question: 'Five people A, B, C, D, and E are sitting in a row facing North. C is sitting next to E and D. B is sitting at the extreme right end. A is sitting next to D. Who is sitting in the middle?',
    options: ['D', 'C', 'E', 'A'],
    correctAnswer: 0, // D
    explanation: 'B is at extreme right (Position 5).\nA is next to D. C is between E and D.\nArrangement from left to right: E - C - D - A - B.\nThe person in the middle (3rd position) is D.'
  },
  {
    id: 'apt-25',
    category: 'Logical',
    subTopic: 'Data Sufficiency',
    company: 'TCS NQT',
    difficulty: 'Hard',
    question: 'Is X an even integer?\nStatement 1: X + 3 is an odd integer.\nStatement 2: 2X is an even integer.',
    options: ['Statement 1 alone is sufficient', 'Statement 2 alone is sufficient', 'Both statements together are sufficient', 'Neither statement is sufficient'],
    correctAnswer: 0, // Statement 1 alone
    explanation: 'Statement 1: X + 3 = Odd => X = Odd - 3 = Even. (Sufficient alone).\nStatement 2: 2X is always even for any integer X (odd or even), so Statement 2 gives no info about X.'
  },
  {
    id: 'apt-26',
    category: 'Logical',
    subTopic: 'Number Analogy',
    company: 'Capgemini',
    difficulty: 'Easy',
    question: 'Select the related number from given alternatives: 7 : 56 :: 9 : ?',
    options: ['90', '72', '81', '63'],
    correctAnswer: 0, // 90
    explanation: 'Pattern: n : n*(n+1)\n7 : 7*8 = 56\n9 : 9*10 = 90.'
  },
  {
    id: 'apt-27',
    category: 'Logical',
    subTopic: 'Statement & Assumptions',
    company: 'Accenture ASE',
    difficulty: 'Medium',
    question: 'Statement: "Join our IT skills acceleration program to guarantee campus placement." - An advertisement.\nAssumption 1: Students want to get placed.\nAssumption 2: The program provides effective IT training.',
    options: ['Both assumptions 1 and 2 are implicit', 'Only assumption 1 is implicit', 'Only assumption 2 is implicit', 'Neither is implicit'],
    correctAnswer: 0, // Both 1 and 2 implicit
    explanation: 'An advertisement assumes target audience desire (students want placement) and offering validity (training works).'
  },

  // --- Additional Verbal Ability ---
  {
    id: 'apt-28',
    category: 'Verbal',
    subTopic: 'Idioms & Phrases',
    company: 'Wipro NLTH',
    difficulty: 'Easy',
    question: 'What does the idiom "Burn the midnight oil" mean?',
    options: ['Work or study late into the night', 'Waste fuel uselessly', 'Create a fire at night', 'Work early in the morning'],
    correctAnswer: 0, // Work or study late into the night
    explanation: '"Burning the midnight oil" refers to staying up late into the night working or studying.'
  },
  {
    id: 'apt-29',
    category: 'Verbal',
    subTopic: 'Reading Comprehension',
    company: 'Infosys DSE',
    difficulty: 'Medium',
    question: 'Passage: "Artificial Intelligence does not seek to replace human intuition, but to augment human decision-making with rapid pattern analysis."\nAccording to the passage, AI\'s primary role is to:',
    options: ['Augment human decision-making', 'Replace human intuition completely', 'Eliminate human roles in IT', 'Automate physical labor'],
    correctAnswer: 0, // Augment human decision-making
    explanation: 'The passage explicitly states AI seeks "to augment human decision-making with rapid pattern analysis".'
  },
  {
    id: 'apt-30',
    category: 'Verbal',
    subTopic: 'One Word Substitution',
    company: 'Cognizant GenC',
    difficulty: 'Easy',
    question: 'Give one word for: "A person who speaks many languages."',
    options: ['Polyglot', 'Linguist', 'Grammarian', 'Bilingual'],
    correctAnswer: 0, // Polyglot
    explanation: 'Polyglot is a person who knows and uses several languages.'
  },

  // --- Additional Technical Output & Pseudocode ---
  {
    id: 'apt-31',
    category: 'Technical Output',
    subTopic: 'Pre & Post Increment Operator',
    company: 'TCS NQT',
    difficulty: 'Medium',
    question: 'What is the output of the following C program?\n\n#include <stdio.h>\nint main() {\n    int x = 5;\n    int y = x++ + ++x;\n    printf("%d %d", x, y);\n    return 0;\n}',
    options: ['7 12', '7 11', '6 12', 'Undefined Behavior in standard C'],
    correctAnswer: 3, // Undefined behavior
    explanation: 'Modifying a variable (`x++` and `++x`) multiple times between sequence points yields Undefined Behavior in standard C/C++.'
  },
  {
    id: 'apt-32',
    category: 'Technical Output',
    subTopic: 'Static Variables',
    company: 'Accenture ASE',
    difficulty: 'Medium',
    question: 'What will be printed when `count()` is called 3 times?\n\nvoid count() {\n    static int c = 0;\n    c++;\n    printf("%d ", c);\n}',
    options: ['1 2 3', '1 1 1', '0 1 2', '3 3 3'],
    correctAnswer: 0, // 1 2 3
    explanation: '`static` variables preserve their value across function calls. 1st call: c=1, 2nd call: c=2, 3rd call: c=3.'
  },
  {
    id: 'apt-33',
    category: 'Technical Output',
    subTopic: 'String Character Pointers',
    company: 'Amazon',
    difficulty: 'Hard',
    question: 'What is the output of this C code snippet?\n\nchar *str = "Lumixora";\nprintf("%s", str + 4);',
    options: ['xora', 'mixora', 'Lumix', 'ora'],
    correctAnswer: 0, // xora
    explanation: '`str` points to \'L\'. `str + 4` shifts pointer 4 characters to \'x\'. Printing `%s` outputs "xora".'
  },
  {
    id: 'apt-34',
    category: 'Technical Output',
    subTopic: 'Ternary Operator',
    company: 'Wipro NLTH',
    difficulty: 'Easy',
    question: 'What is the value of `result`?\n\nint a = 10, b = 20;\nint result = (a > b) ? a : b;',
    options: ['20', '10', '1', '0'],
    correctAnswer: 0, // 20
    explanation: 'Condition (10 > 20) is false. Therefore, the ternary operator evaluates to the second operand `b` (20).'
  },
  {
    id: 'apt-35',
    category: 'Technical Output',
    subTopic: 'Recursion Base Case',
    company: 'Infosys DSE',
    difficulty: 'Hard',
    question: 'What is returned by `gcd(48, 18)`?\n\nint gcd(int a, int b) {\n    if (b == 0) return a;\n    return gcd(b, a % b);\n}',
    options: ['6', '12', '18', '24'],
    correctAnswer: 0, // 6
    explanation: 'gcd(48, 18) -> gcd(18, 48%18=12) -> gcd(12, 18%12=6) -> gcd(6, 12%6=0) -> b==0 returns 6.'
  }
];
