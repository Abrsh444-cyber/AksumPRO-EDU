import { University, MCQQuestion, FormulaItem, CurriculumUnit } from "./types";

export const UNIVERSITIES: University[] = [
  {
    id: "aau",
    name: "Addis Ababa University",
    amharicName: "አዲስ አበባ ዩኒቨርሲቲ",
    location: "Addis Ababa (Sidist Kilo)",
    established: "1950",
    description: "The flagship and oldest higher education institution in Ethiopia, Addis Ababa University is a premier research university producing legendary leaders, engineers, doctors, and scholars.",
    amharicDescription: "በኢትዮጵያ ውስጥ የቀዳሚው እና ትልቁ የከፍተኛ ትምህርት ተቋም ሲሆን፣ እጅግ አንቱ የተባሉ ምሁራንን፣ መሐንዲሶችን፣ ሐኪሞችንና መሪዎችን ያፈራ የጥናትና ምርምር ማዕከል ነው።",
    worldRank: 602,
    nationalRank: 1,
    tier: "VIP Sovereign",
    departments: [
      "School of Medicine (Black Lion)",
      "Addis Ababa Institute of Technology (AAiT)",
      "College of Business and Economics",
      "School of Law and Governance",
      "College of Natural and Computational Sciences",
      "College of Humanities and Social Sciences"
    ],
    notableAlumni: [
      "Dr. Eleni Gabre-Madhin (ECX Founder)",
      "Haile-Mariam Desalegn (Former Prime Minister)",
      "Professor Sebsebe Demissew (Botanist)",
      "Dr. Tedros Adhanom (WHO Director-General)"
    ],
    admissionStats: {
      naturalCutoff: 410,
      socialCutoff: 380,
      acceptanceRate: "Top 2% of Matricants"
    },
    specialFacts: [
      "Hosts the Institute of Ethiopian Studies, containing invaluable ancient manuscripts.",
      "Initially established as University College of Addis Ababa under Emperor Haile Selassie I.",
      "The Sidist Kilo main campus boasts the iconic palace gates and gardens."
    ],
    bannerGradient: "from-amber-600 via-amber-700 to-amber-900"
  },
  {
    id: "astu",
    name: "Adama Science and Technology University",
    amharicName: "አዳማ ሳይንስና ቴክኖሎጂ ዩኒቨርሲቲ",
    location: "Adama (Oromia)",
    established: "1993",
    description: "Dedicated to transforming Ethiopia from an agrarian society to an industrialized economy. ASTU is a specialized powerhouse for cutting-edge engineering, advanced computing, and science disciplines.",
    amharicDescription: "ኢትዮጵያን በሳይንስና ቴክኖሎጂ ወደ ላቀ የኢንዱስትሪ ደረጃ ለማሻገር የተቋቋመ ልዩ የቴክኖሎጂ ምርምር ተቋም ነው።",
    worldRank: 1450,
    nationalRank: 2,
    tier: "Technology Focus",
    departments: [
      "School of Electrical Engineering & Computing",
      "School of Mechanical, Chemical & Materials Engineering",
      "School of Civil Engineering & Architecture",
      "School of Applied Natural Sciences"
    ],
    notableAlumni: [
      "Eng. Fitsum Arega (Diplomat & Economic Advisor)",
      "Countless leading tech startup founders in Addis Ababa"
    ],
    admissionStats: {
      naturalCutoff: 425,
      socialCutoff: 0, // Natural sciences only
      acceptanceRate: "Top 1.5% in Engineering Streams"
    },
    specialFacts: [
      "Under exclusive direct mandate to model East Asian tech giants.",
      "State-of-the-art laboratory centers heavily sponsored by South Korean and German technical mentors.",
      "Maintains direct high-tech incubation link with O-Hub innovation space."
    ],
    bannerGradient: "from-cyan-700 via-blue-800 to-vip-dark"
  },
  {
    id: "aastu",
    name: "Addis Ababa Science and Technology University",
    amharicName: "አዲስ አበባ ሳይንስና ቴክኖሎጂ ዩኒቨርሲቲ",
    location: "Addis Ababa (Kilinto)",
    established: "2011",
    description: "Designed to serve as a key broker for technology transfer, local research, and high-quality industry synergy. AASTU boasts specialized Centers of Excellence in Artificial Intelligence and Biotech.",
    amharicDescription: "የቴክኖሎጂ ሽግግርንና የሀገር በቀል ፈጠራዎችን ለማነቃቃት የተቋቋመ ሲሆን፣ በሰው ሰራሽ አስተውሎት (AI) እና ባዮቴክኖሎጂ የላቀ ማዕከል አለው።",
    worldRank: 1680,
    nationalRank: 3,
    tier: "Technology Focus",
    departments: [
      "College of Electrical & Mechanical Engineering",
      "College of Biological & Chemical Engineering",
      "College of Architecture & Civil Engineering",
      "College of Natural & Social Sciences"
    ],
    notableAlumni: [
      "Prominent research leads at the Ethiopian Space Science and Technology Institute",
      "Major corporate tech leads in Ethio Telecom and ministries."
    ],
    admissionStats: {
      naturalCutoff: 430, // Entrance examinations and premium cutoff applied
      socialCutoff: 0,
      acceptanceRate: "Exquisite entry entrance exam required"
    },
    specialFacts: [
      "Requires a specialized entry exam in addition to standard ESSLCE results.",
      "Hosts world-class centers of excellence in nanotechnology, nuclear science engineering, and AI."
    ],
    bannerGradient: "from-emerald-700 via-teal-800 to-slate-900"
  },
  {
    id: "gondar",
    name: "University of Gondar",
    amharicName: "ጎንደር ዩኒቨርሲቲ",
    location: "Gondar (Amhara)",
    established: "1954",
    description: "Originally founded as the Public Health College and Training Center, the University of Gondar is Ethiopia's pioneer medical school, world-renowned for epidemiological and healthcare studies.",
    amharicDescription: "ቀድሞ የሕዝብ ጤና አጠባበቅ ኮሌጅ ተብሎ የተመሠረተ ሲሆን፣ የኢትዮጵያ ቀዳሚው የሕክምና ምርምር ተቋም እና እጅግ አንጋፋው የጤና ማዕከል ነው።",
    worldRank: 1202,
    nationalRank: 4,
    tier: "Elite Tier-A",
    departments: [
      "College of Medicine and Health Sciences",
      "Hospital Administration",
      "Department of Veterinary Medicine",
      "Informatics & Software Engineering"
    ],
    notableAlumni: [
      "Numerous globally acclaimed public health directors and medical faculty advisors",
      "Dr. Tewolde Berhan Gebre-Egziabher (Global Environmental Champion)"
    ],
    admissionStats: {
      naturalCutoff: 395,
      socialCutoff: 370,
      acceptanceRate: "Highly competitive medical slots"
    },
    specialFacts: [
      "Known as the 'Cradle of Public Health' in East Africa.",
      "Has robust collaborative ties with prestigious North American and European medical boards.",
      "The scenic Maraki Main Campus overlooks the historic castle city of Gondar."
    ],
    bannerGradient: "from-red-800 via-yellow-700 to-green-800"
  },
  {
    id: "jimma",
    name: "Jimma University",
    amharicName: "ጅማ ዩኒቨርሲቲ",
    location: "Jimma (Oromia)",
    established: "1999",
    description: "Famous for its unique institutional philosophy: Community-Based Education (CBE). At Jimma, students don't just sit in classrooms; they go into the community to directly solve real-world problems.",
    amharicDescription: "በማኅበረሰብ አቀፍ ትምህርት ፍልስፍናው (CBE) የሚታወቅ ሲሆን፣ ተማሪዎች በትምህርታቸው ማኅበረሰቡን በቀጥታ የሚረዱበትን መንገድ ያመቻቻል።",
    worldRank: 1220,
    nationalRank: 5,
    tier: "Elite Tier-A",
    departments: [
      "Jimma Institute of Technology (JiT)",
      "College of Health Sciences (CBE Pioneer)",
      "College of Agriculture and Veterinary Medicine",
      "College of Law and Governance"
    ],
    notableAlumni: [
      "Abiy Ahmed Ali (PhD, Prime Minister of Ethiopia & Nobel Peace Laureate)",
      "Pioneering coffee quality specialists active in Jimma and Kaffa zones."
    ],
    admissionStats: {
      naturalCutoff: 390,
      socialCutoff: 365,
      acceptanceRate: "Top 4% of matric students"
    },
    specialFacts: [
      "Consistently ranked as Ethiopia's leading multi-disciplinary university for several consecutive years.",
      "Formed by the combination of the historic Jimma College of Agriculture (1952) and Jimma Institute of Health Sciences.",
      "The campus is nestled in the fertile, original birthplace of Arabica Coffee."
    ],
    bannerGradient: "from-indigo-800 via-blue-900 to-purple-950"
  },
  {
    id: "bdu",
    name: "Bahir Dar University",
    amharicName: "ባሕር ዳር ዩኒቨርሲቲ",
    location: "Bahir Dar (Amhara)",
    established: "1953",
    description: "Adorning the beautiful shores of Lake Tana and the Blue Nile source, Bahir Dar University is exceptionally prestigious for its Maritime Academy, textile technologies, and environmental research.",
    amharicDescription: "በጣና ሐይቅ እና በዓባይ መነሻ አቅራቢያ የሚገኝ ውብ ግቢ ሲሆን፣ በባሕር ኃይል እና መርከበኝነት አካዳሚ፣ በጨርቃጨርቅ ምህንድስና ምርምሩ ይታወቃል።",
    worldRank: 1390,
    nationalRank: 6,
    tier: "Elite Tier-A",
    departments: [
      "Ethiopian Institute of Textile and Fashion Technology",
      "Bahir Dar Institute of Technology (BiT)",
      "Maritime Academy (Exclusive maritime officer training)",
      "Institute of Land Administration"
    ],
    notableAlumni: [
      "Leading captains and chief engineers in international maritime shipping fleets",
      "Leading designers driving the cultural fabric sector of East Africa"
    ],
    admissionStats: {
      naturalCutoff: 382,
      socialCutoff: 358,
      acceptanceRate: "Highly prestigious maritime allocations"
    },
    specialFacts: [
      "Hosts Ethiopia's only internationally approved Maritime Academy training merchant marine officers.",
      "Home to the blue biotechnology center specializing in Lake Tana's unique fish and algae ecosystem studies.",
      "Students love the dynamic 'Peda' pedagogy campus with beautiful tree canopies."
    ],
    bannerGradient: "from-blue-700 via-teal-700 to-indigo-900"
  },
  {
    id: "hawassa",
    name: "Hawassa University",
    amharicName: "ሐዋሳ ዩኒቨርሲቲ",
    location: "Hawassa (Sidama)",
    established: "1999",
    description: "Located alongside the scenic Lake Hawassa, this university is a premier national Center of Excellence in Agricultural Sciences and Forestry Research, as well as a key business training center.",
    amharicDescription: "በሐዋሳ ሐይቅ ዳርቻ የሚገኝ ግሩም የከፍተኛ ትምህርት ማዕከል ሲሆን፣ በግብርና፣ በደን ሳይንስና በቢዝነስ ትምህርቶች ግንባር ቀደም ነው።",
    worldRank: 1540,
    nationalRank: 7,
    tier: "Elite Tier-A",
    departments: [
      "Wondo Genet College of Forestry and Natural Resources",
      "College of Agriculture",
      "College of Medicine and Health Sciences",
      "College of Business and Economics"
    ],
    notableAlumni: [
      "Hundreds of chief agricultural researchers and conservation heads in East Africa",
      "Top industrialists guiding Hawassa Industrial Park operations"
    ],
    admissionStats: {
      naturalCutoff: 380,
      socialCutoff: 355,
      acceptanceRate: "Top 5% of matric students"
    },
    specialFacts: [
      "Wondo Genet forestry college is an internationally critical epicenter for Afro-montane forestry research.",
      "Beautiful campus environment characterized by monkeys co-existing in forest shadows and lake breeze.",
      "Maintains direct workspace links with the massive Hawassa Apparel Industrial Hub."
    ],
    bannerGradient: "from-emerald-800 via-green-700 to-violet-900"
  }
];

export const MCQS: MCQQuestion[] = [
  {
    id: "g9-math-01",
    subject: "Mathematics",
    grade: 9,
    question: "Which of the following numbers belongs to the set of Irrational Numbers (Q')?",
    questionAmharic: "ከእነዚህ ቁጥሮች ውስጥ ወደ ኢረሽናል ቁጥር (Q') ስብስብ የሚመደበው የትኛው ነው?",
    options: [
      "a) 3.14159",
      "b) 22/7",
      "c) √3",
      "d) 0.3333..."
    ],
    optionsAmharic: [
      "ሀ) 3.14159",
      "ለ) 22/7",
      "ሐ) √3",
      "መ) 0.3333..."
    ],
    answerIndex: 2, // √3
    explanation: "Irrational numbers are decimals that are non-terminating and non-recurring. √3 cannot be expressed as a ratio of two integers and yields a non-recurring sequence, whereas 3.14159 is terminating, 22/7 is a ratio (rational), and 0.333... is a repeating decimal (rational).",
    explanationAmharic: "ማብራሪያ፡- ኢረሽናል ቁጥሮች ማለት በደሲማል ሲጻፉ የማያልቁና የማይደጋገሙ ቁጥሮች ናቸው። √3 በሁለት ኢንቲጀሮች ውድር (p/q) መልክ መጻፍ አይችልም። ስለዚህ ሐ) ትክክለኛ መልስ ነው።",
    year: "Model Exam",
    stream: "Both"
  },
  {
    id: "g9-phys-01",
    subject: "Physics",
    grade: 9,
    question: "Which of the following physical quantities is classified as a vector quantity?",
    questionAmharic: "ከእነዚህ መለኪያ አካላት ውስጥ ቬክተር (Vector) የሆነው የትኛው ነው?",
    options: [
      "a) Mass",
      "b) Displacement",
      "c) Temperature",
      "d) Speed"
    ],
    optionsAmharic: [
      "ሀ) ግዝፈት (Mass)",
      "ለ) ስፍረ-ምደባ (Displacement)",
      "ሐ) ሙቀት (Temperature)",
      "መ) ፈጣንነት (Speed)"
    ],
    answerIndex: 1, // Displacement
    explanation: "A vector quantity has both magnitude and a defined direction. Displacement specifies the shortest distance from the start to the end point along with its direction, while mass, temperature, and speed are scalars (having magnitude only).",
    explanationAmharic: "ማብራሪያ፡- ቬክተር መጠንና አቅጣጫ ያለው ነው። ስፍረ-ምደባ (Displacement) ከአንድ ቦታ ወደሌላ ያለውን አጭር ርቀት ከአቅጣጫ ጋር ስለሚገልጽ ቬክተር ነው።",
    year: "Model Exam",
    stream: "Both"
  },
  {
    id: "g10-math-01",
    subject: "Mathematics",
    grade: 10,
    question: "If the polynomial function P(x) = x³ - 2x² + kx - 6 is exactly divisible by x - 2, what is the value of the constant k?",
    questionAmharic: "ፖሊኖሚያል P(x) = x³ - 2x² + kx - 6 ለ x - 2 ያለ ቀሪ ከተካፈለ የ ኮንስታንት k ዋጋ ስንት ነው?",
    options: [
      "a) 3",
      "b) -3",
      "c) 2",
      "d) 0"
    ],
    optionsAmharic: [
      "ሀ) 3",
      "ለ) -3",
      "ሐ) 2",
      "መ) 0"
    ],
    answerIndex: 0, // k = 3
    explanation: "According to the Factor Theorem, if P(x) is exactly divisible by x - 2, then P(2) must equal 0.\nP(2) = (2)³ - 2(2)² + k(2) - 6 = 0\n8 - 8 + 2k - 6 = 0\n2k - 6 = 0 => 2k = 6 => k = 3.\nThus, option a is correct.",
    explanationAmharic: "ማብራሪያ፡- በአባዢ ቲዎረም (Factor Theorem) መሠረት ቀሪው 0 ከሆነ P(2) = 0 ነው።\nP(2) = (2)³ - 2(2)² + k(2) - 6 = 0 => 8 - 8 + 2k - 6 = 0 => 2k = 6 => k = 3።",
    year: "National Exam",
    stream: "Both"
  },
  {
    id: "g10-chem-01",
    subject: "Chemistry",
    grade: 10,
    question: "What is the general chemical formula representing unsaturated hydrocarbons known as Alkynes?",
    questionAmharic: "የአልካይንስ (Alkynes) አጠቃላይ ኬሚካላዊ ፎርሙላ የትኛው ነው?",
    options: [
      "a) C_n H_{2n+2}",
      "b) C_n H_{2n}",
      "c) C_n H_{2n-2}",
      "d) C_n H_n"
    ],
    optionsAmharic: [
      "ሀ) C_n H_{2n+2}",
      "ለ) C_n H_{2n}",
      "ሐ) C_n H_{2n-2}",
      "መ) C_n H_n"
    ],
    answerIndex: 2, // C_n H_{2n-2}
    explanation: "Alkynes are unsaturated hydrocarbons containing at least one carbon-carbon triple bond. Their general formula is C_n H_{2n-2}. Alkanes are C_n H_{2n+2} and Alkenes are C_n H_{2n}.",
    explanationAmharic: "ማብራሪያ፡- አልካይኖች በካርቦኖች መካከል የሦስትዮሽ ቦንድ (triple bond) የሚይዙ ሃይድሮካርቦኖች ሲሆኑ አጠቃላይ ቀመራቸው C_n H_{2n-2} ነው።",
    year: "National Exam",
    stream: "Natural Science"
  },
  {
    id: "fresh-math-01",
    subject: "Mathematics",
    grade: 13,
    question: "Which of the following statement compound form is logically equivalent to the implication P ⇒ Q?",
    questionAmharic: "ከእነዚህ ሎጂካዊ ውህዶች ውስጥ ከ P ⇒ Q ጋር ተመሳሳይ ትርጉም (Equivalent) ያለው የትኛው ነው?",
    options: [
      "a) P ∨ ¬Q",
      "b) ¬P ∨ Q",
      "c) ¬P ∧ Q",
      "d) ¬Q ⇒ ¬P"
    ],
    optionsAmharic: [
      "ሀ) P ∨ ¬Q",
      "ለ) ¬P ∨ Q",
      "ሐ) ¬P ∧ Q",
      "መ) ¬Q ⇒ ¬P"
    ],
    answerIndex: 1, // ¬P ∨ Q
    explanation: "In propositional logic, the conditional statement P ⇒ Q is truth-functionally identical to 'not P, or Q' (¬P ∨ Q). Their truth tables match exactly, being False only when P is True and Q is False.",
    explanationAmharic: "ማብራሪያ፡- በሂሳብ ሎጂክ መሠረት P ⇒ Q ከ '¬P ∨ Q' ጋር እኩል ነው። ሁለቱም ሐሰት (False) የሚሆኑት P እውነት ሆኖ Q ሐሰት ከሆነ ብቻ ነው።",
    year: "Freshman College Exam",
    stream: "Both"
  },
  {
    id: "fresh-phys-01",
    subject: "Physics",
    grade: 13,
    question: "A rigid flywheel accelerates from rest to an angular velocity of 12 rad/s in 4.0 seconds under constant torque. What is its angular acceleration in rad/s²?",
    questionAmharic: "አንድ በቶርክ አማካኝነት የሚሽከረከር አካል በ 4 ሰከንድ ውስጥ ፍጥነቱ ከ 0 ወደ 12 rad/s ቢጨምር አንግላዊ ፍጥነት መጨመሪያው (angular acceleration) ስንት ነው?",
    options: [
      "a) 48 rad/s²",
      "b) 3.0 rad/s²",
      "c) 4.0 rad/s²",
      "d) 0.33 rad/s²"
    ],
    optionsAmharic: [
      "ሀ) 48 rad/s²",
      "ለ) 3.0 rad/s²",
      "ሐ) 4.0 rad/s²",
      "መ) 0.33 rad/s²"
    ],
    answerIndex: 1, // 3.0 rad/s²
    explanation: "Angular acceleration is given by α = Δω / Δt.\nα = (ω_final - ω_initial) / t = (12 - 0) / 4 = 3.0 rad/s².",
    explanationAmharic: "ማብራሪያ፡- አንግላዊ ፍጥነት መጨመሪያ (α) = (ω_final - ω_initial) / t = (12 - 0) / 4 = 3 rad/s² ነው።",
    year: "Freshman College Exam",
    stream: "Natural Science"
  },
  {
    id: "fresh-eng-01",
    subject: "English",
    grade: 13,
    question: "Which reading sub-skill is primarily utilized when a student scans a long academic chapter to look for a specific name, date, or statistical parameter?",
    questionAmharic: "አንድ ተማሪ በደቂቃዎች ውስጥ የተወሰነ ዓመተ ምሕረት ወይም ስም ብቻ ጽሑፉን በፍጥነት በማገላበጥ ቢፈልግ የትኛውን የማንበብ ስልት ተጠቀመ?",
    options: [
      "a) Skimming",
      "b) Critical Reading",
      "c) Scanning",
      "d) Intensive Review"
    ],
    optionsAmharic: [
      "ሀ) ስኪሚንግ (Skimming)",
      "ለ) ክሪቲካል ሪዲንግ (Critical)",
      "ሐ) ስካኒንግ (Scanning)",
      "መ) ኢንቴንሲቭ ሪቪው (Intensive)"
    ],
    answerIndex: 2, // Scanning
    explanation: "Scanning involves looking for a specific piece of information (such as dates, metrics, or names) without reading the entire surrounding text, whereas skimming is reading quickly to lock into the top-level main idea.",
    explanationAmharic: "ማብራሪያ፡- የሰነዱን አጠቃላይ ይዘት ሳይሆን፣ የተወሰኑ ቃላትን ወይም ቁጥሮችን ብቻ ለይቶ በፍጥነት መፈለግ ስካኒንግ (Scanning) ይባላል።",
    year: "Freshman English Exam",
    stream: "Both"
  },
  {
    id: "math-01",
    subject: "Mathematics",
    grade: 12,
    question: "If the sequence is defined recursively by a_1 = 3 and a_{n+1} = 2a_n - 1 for n ≥ 1, then what is the 5th term (a_5) of the sequence?",
    options: [
      "a) 17",
      "b) 33",
      "c) 65",
      "d) 9"
    ],
    answerIndex: 1, // 33
    explanation: "Let's calculate the terms step by step:\n- a_1 = 3\n- a_2 = 2(3) - 1 = 5\n- a_3 = 2(5) - 1 = 9\n- a_4 = 2(9) - 1 = 17\n- a_5 = 2(17) - 1 = 33.\nHence, the correct option is (b) 33.",
    year: "2015 E.C.",
    stream: "Both"
  },
  {
    id: "phys-02",
    subject: "Physics",
    grade: 12,
    question: "A car travels in a circular track of radius 50m with a constant speed of 20 m/s. What is the centripetal acceleration of the car?",
    options: [
      "a) 0.4 m/s²",
      "b) 8 m/s²",
      "c) 10 m/s²",
      "d) 2.5 m/s²"
    ],
    answerIndex: 1, // 8 m/s²
    explanation: "The formula for centripetal acceleration is a_c = v² / r.\nGiven:\n- Speed v = 20 m/s\n- Radius r = 50 m\nCalculation:\na_c = (20)² / 50 = 400 / 50 = 8 m/s².\nTherefore, the correct answer is b) 8 m/s².",
    year: "2016 E.C.",
    stream: "Natural Science"
  },
  {
    id: "chem-03",
    subject: "Chemistry",
    grade: 12,
    question: "Which of the following organic compounds will yield a silver mirror with Tollen's reagent (ammoniacal silver nitrate solution)?",
    options: [
      "a) Propanone (Acetone)",
      "b) Propanal (Propionaldehyde)",
      "c) Propan-2-ol",
      "d) Ethyl acetate"
    ],
    answerIndex: 1, // Propanal
    explanation: "Tollen's reagent is a mild oxidizing agent that selectively oxidizes aldehydes to carboxylic acids, reducing Ag⁺ ions to metallic silver (the silver mirror effect). Ketones (like Propanone), secondary alcohols (like Propan-2-ol), and esters (like Ethyl acetate) do not react with Tollen's reagent. Propanal is an aldehyde and thus positive for this test. Correct option is b).",
    year: "2014 E.C.",
    stream: "Natural Science"
  },
  {
    id: "eng-04",
    subject: "English Syntax & Grammar",
    grade: 12,
    question: "Choose the correct option: By the time the invigilator collects the papers, we ________ all the fifty questions.",
    options: [
      "a) will solve",
      "b) solved",
      "c) will have solved",
      "d) are solving"
    ],
    answerIndex: 2, // will have solved
    explanation: "The clause 'By the time ...' indicates a future perfect action that will be completed prior to another future point. The correct form is 'will have solved' (Future Perfect). Correct option is c).",
    year: "2016 E.C.",
    stream: "Both"
  },
  {
    id: "bio-05",
    subject: "Biology",
    grade: 12,
    question: "Which organelle is responsible for generating energy in the form of ATP during respiration and is commonly referred to as the powerhouse of the cell?",
    options: [
      "a) Chloroplast",
      "b) Golgi Apparatus",
      "c) Lysosome",
      "d) Mitochondrion"
    ],
    answerIndex: 3, // Mitochondrion
    explanation: "Mitochondria are the sites of aerobic respiration where oxidative phosphorylation occurs to yield high amounts of cellular energy in the form of Adenosine Triphosphate (ATP). Option d is correct.",
    year: "2015 E.C.",
    stream: "Natural Science"
  },
  {
    id: "hist-06",
    subject: "History",
    grade: 12,
    question: "The Battle of Adwa (March 1, 1896) ended with a decisive victory for Ethiopia over Italy. Who was the reigning Emperor of Ethiopia during this historical struggle?",
    options: [
      "a) Emperor Tewodros II",
      "b) Emperor Yohannes IV",
      "c) Emperor Menelik II",
      "d) Emperor Haile Selassie I"
    ],
    answerIndex: 2, // Menelik II
    explanation: "Emperor Menelik II, alongside Empress Taytu Betul, masterfully mobilized over 100,000 patriotic warriors nationwide to confront and decisively defeat the invading Italian forces at Adwa, securing African independence. Correct option is c).",
    year: "2015 E.C.",
    stream: "Social Science"
  },
  {
    id: "geog-07",
    subject: "Geography",
    grade: 12,
    question: "What is the name of the majestic continental rift system that splits Ethiopia down the center, heavily framing its chain of volcanic lakes?",
    options: [
      "a) The Mid-Atlantic Ridge",
      "b) The East African Rift Valley",
      "c) The San Andreas Fault",
      "d) The Marianas Trench"
    ],
    answerIndex: 1, // East African Rift Valley
    explanation: "The East African Rift Valley stretches from Northern Syria down to Mozambique, splitting Ethiopia into the northwestern and southeastern highlands, hosting the iconic Ethiopian Rift Valley Lakes chain. Correct option is b).",
    year: "2016 E.C.",
    stream: "Social Science"
  }
];

export const FORMULAS: FormulaItem[] = [
  {
    id: "form-01",
    subject: "Mathematics",
    topic: "Calculus - Derivatives",
    name: "The Power Rule",
    formula: "d/dx [x^n] = n * x^(n-1)",
    description: "The fundamental formula to derive any algebraic power expression quickly."
  },
  {
    id: "form-02",
    subject: "Physics",
    topic: "Electricity & Magnetism",
    name: "Coulomb's Law",
    formula: "F = k * (|q1 * q2|) / r^2",
    description: "Calculates the electrostatic attractive or repulsive force between two charges separated by distance r."
  },
  {
    id: "form-03",
    subject: "Chemistry",
    topic: "Solutions & Stoichiometry",
    name: "The Ideal Gas Law",
    formula: "P * V = n * R * T",
    description: "Connects Pressure, Volume, Moles, gas constant (R), and Temperature in Kelvins for ideal gas modules."
  },
  {
    id: "form-04",
    subject: "Mathematics",
    topic: "Coordinate Geometry",
    name: "The Distance Formula",
    formula: "d = sqrt((x2 - x1)^2 + (y2 - y1)^2)",
    description: "Calculates the precise linear distance between any two geometric points in a Cartesian plane."
  },
  {
    id: "form-05",
    subject: "Mathematics",
    topic: "Algebra & Roots",
    name: "The Quadratic Formula",
    formula: "x = (-b ± sqrt(b^2 - 4ac)) / (2a)",
    description: "Solves any quadratic equation ax^2 + bx + c = 0 to pinpoint its zeroes."
  },
  {
    id: "form-06",
    subject: "Physics",
    topic: "Classical Mechanics",
    name: "Newton's Second Law (Kinematics)",
    formula: "F = m * a  (or F = dp/dt)",
    description: "Relates force to mass and acceleration, explaining speed changes under load."
  },
  {
    id: "form-07",
    subject: "Physics",
    topic: "Modern Quantum Physics",
    name: "Planck-Einstein Equation",
    formula: "E = h * f  (or E = h * c / λ)",
    description: "Determines the energy carried by a single photon based on its oscillator frequency or wavelength."
  },
  {
    id: "form-08",
    subject: "Chemistry",
    topic: "Acid-Base Chemistry",
    name: "pH Calculation",
    formula: "pH = -log10[H3O+]",
    description: "Evaluates acidity or basicity of a solution based on hydronium concentration."
  },
  {
    id: "form-09",
    subject: "Chemistry",
    topic: "Solutions",
    name: "Molarity Formula",
    formula: "M = n (solute) / V (solution, L)",
    description: "Measures concentrations of chemical solutions in moles per liter."
  }
];

export const GENERAL_STUDY_PILLS = [
  {
    title: "The Pomodoro Technique (ፖሞዶሮ)",
    desc: "Study for 25-45 minutes intensely, then rest for 5-10 minutes. Repeat 4 times and take a 30-min long break.",
    icon: "Clock"
  },
  {
    title: "Active Recall (አክቲቭ ሪኮል)",
    desc: "Don't just re-read notes! Cover the paragraph and try to explain it aloud or write down what you remember from scratch.",
    icon: "BrainCircuit"
  },
  {
    title: "Feynman Technique (ፌይንማን ዘዴ)",
    desc: "Try to explain a difficult Ethiopian curriculum topic as if you are teaching it to a 5-year-old child. Highlights your gaps.",
    icon: "BookOpen"
  },
  {
    title: "Spaced Repetition (የተራራቁ ድግግሞሾች)",
    desc: "Review a concept after 1 day, then 3 days, 1 week, and 2 weeks. This pushes knowledge from short-term to long-term memory.",
    icon: "Sparkles"
  }
];

export const CURRICULUM_UNITS: CurriculumUnit[] = [
  {
    id: "math-u1",
    subject: "Mathematics",
    unitNumber: 1,
    title: "Sequences and Series",
    titleAmharic: "ቅደም ተከተሎች እና ተከታታዮች",
    grade: 12,
    notes: `### 📈 Unit 1: Sequences & Series Core Notes
An **infinite sequence** is a function whose domain is the set of positive integers. We denote terms as a_1, a_2, ..., a_n.

#### 1. Arithmetic Sequences (A.P.)
A sequence where the difference between consecutive terms is constant, known as the common difference ($d$).
- **General Term ($a_n$):** 
  $$a_n = a_1 + (n - 1)d$$
- **Arithmetic Mean:** Two indices $x$ and $y$ have arithmetic mean $(x + y) / 2$.
- **Sum of first $n$ terms ($S_sn$):**
  $$S_n = \\frac{n}{2}(a_1 + a_n) = \\frac{n}{2}[2a_1 + (n - 1)d]$$

#### 2. Geometric Sequences (G.P.)
A sequence where each term after the first is obtained by multiplying the preceding term by a non-zero constant ($r$), known as the common ratio.
- **General Term ($a_n$):** 
  $$a_n = a_1 \\cdot r^{n-1}$$
- **Sum of first $n$ terms ($S_sn$):**
  $$S_n = a_1 \\frac{1 - r^n}{1 - r} \\text{ (for } r \\neq 1\\text{)}$$
- **Sum of Infinite Geometric Series ($S_\\infty$):**
  $$S_\\infty = \\frac{a_1}{1 - r} \\text{, converges if and only if } |r| < 1.$$`,
    notesAmharic: `### 📈 ምዕራፍ 1፡ ቅደም ተከተሎች እና ተከታታዮች (Sequences & Series)
**ቅደም ተከተል (Sequence)** ማለት አባላቶቹ በቁጥር ቅደም ተከተል የተቀመጡ እና በዶሜናቸው የፖዘቲቭ ኢንቲጀር ስብስብ የሆኑ ፋንክሽኖች ናቸው።

#### 1. አሪትሜቲክ ቅደም ተከተል (Arithmetic Sequences - A.P.)
በተከታታይ አባላት መካከል ያለው ልዩነት ቋሚ ወይም እኩል ($d$) ሲሆን አሪትሜቲክ ይባላል።
- **አጠቃላይ ፎርሙላ ($a_n$):** 
  $$a_n = a_1 + (n - 1)d$$
- **የመጀመሪያዎቹ $n$ አባላት ድምር ($S_n$):**
  $$S_n = \\frac{n}{2}(a_1 + a_n) = \\frac{n}{2}[2a_1 + (n - 1)d]$$

#### 2. ጂኦሜትሪክ ቅደም ተከተል (Geometric Sequences - G.P.)
እያንዳንዱ አባል የሚከተለውን ለማግኘት በቋሚ ቁጥር ($r$) ሲባዛ የሚገኝ ቅደም ተከተል ነው።
- **አጠቃላይ ፎርሙላ ($a_n$):** 
  $$a_n = a_1 \\cdot r^{n-1}$$
- **ወሰን የሌለው የጂኦሜትሪክ ድምር ($S_\\infty$):**
  $$S_\\infty = \\frac{a_1}{1 - r} \\text{ (የሚሰበሰበው ወይም Converge የሚያደርገው } |r| < 1 \\text{ ሲሆን ብቻ ነው።)}$$`,
    keyFormulas: ["a_n = a_1 + (n-1)d", "S_n = n/2 * (a_1 + a_n)", "S_inf = a1 / (1 - r)"]
  },
  {
    id: "math-u2",
    subject: "Mathematics",
    unitNumber: 2,
    title: "Limits and Continuity",
    titleAmharic: "ሊሚት እና ተከታታይነት",
    grade: 12,
    notes: `### 🌀 Unit 2: Limits & Continuity Notes
The limit of a function describes how the function behaves near a target point.

#### 1. Fundamental Limit Theorems
If $\\lim_{x \\to c} f(x) = L$ and $\\lim_{x \\to c} g(x) = M$, then:
- **Sum Rule:** $\\lim [f(x) + g(x)] = L + M$
- **Product Rule:** $\\lim [f(x) \\cdot g(x)] = L \\cdot M$
- **Special Limit:** 
  $$\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$$

#### 2. Continuity Conditions
A function $f(x)$ is continuous at a point $x = c$ if and only if three requirements are satisfied:
1. $f(c)$ is defined.
2. $\\lim_{x \\to c} f(x)$ exists.
3. $\\lim_{x \\to c} f(x) = f(c)$.`,
    notesAmharic: `### 🌀 ምዕራፍ 2፡ ሊሚት እና ተከታታይነት (Limits & Continuity)
ሊሚት ማለት አንድ ፋንክሽን ወደ ተወሰነ ግብዓት ሲጠጋ የሚኖረውን የውጤት ባህሪ መመርመሪያ ነው።

#### 1. የሊሚት መሠረታዊ ሕጎች
$\\lim_{x \\to c} f(x) = L$ እና $\\lim_{x \\to c} g(x) = M$ ከሆኑ፡
- **የድምር ሕግ:** $\\lim [f(x) + g(x)] = L + M$
- **ልዩ ሊሚት:** $\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$

#### 2. ተከታታይነት (Continuity)
አንድ ፋንክሽን $f(x)$ በአንድ ነጥብ $x = c$ ላይ ተከታታይ (continuous) የሚባለው፡
1. $f(c)$ ትክክለኛ ዋጋ ሲኖረው (Defined).
2. $\\lim_{x \\to c} f(x)$ ሲኖር።
3. ሁለቱም እኩል ሲሆኑ፡ $\\lim_{x \\to c} f(x) = f(c)$።`,
    keyFormulas: ["lim (sin x)/x = 1", "lim (1+x)^(1/x) = e"]
  },
  {
    id: "phys-u1",
    subject: "Physics",
    unitNumber: 1,
    title: "Two-Dimensional Motion",
    titleAmharic: "ባለ ሁለት አቅጣጫ እንቅስቃሴ",
    grade: 11,
    notes: `### 🏹 Unit 1: Two-Dimensional Motion
Kinematics of particles moving on a plane, including projectile motion and uniform circular motion vectors.

#### 1. Projectile Motion
An object fired with initial velocity $u$ at angle $\\theta$ to the horizontal.
- **Horizontal component ($u_x$):** $u \\cos\\theta$ (remains constant)
- **Vertical component ($u_y$):** $u \\sin\\theta - gt$
- **Maximum Height ($H$):** 
  $$H = \\frac{u^2 \\sin^2\\theta}{2g}$$
- **Horizontal Range ($R$):** 
  $$R = \\frac{u^2 \\sin(2\\theta)}{g}$$`,
    notesAmharic: `### 🏹 ምዕራፍ 1፡ ባለ ሁለት አቅጣጫ እንቅስቃሴ (Two-Dimensional Motion)
በአንድ ጠፍጣፋ አካል ላይ የሚደረግ የቁሶች እንቅስቃሴ (ለምሳሌ የፕሮጀክታይል እንቅስቃሴ እና ክብ እንቅስቃሴ)።

#### 1. የፕሮጀክታይል እንቅስቃሴ (Projectile Motion)
አንድን ቁስ በተንሸዋረረ $u$ ፍጥነት በ አንግል $\\theta$ ወደ ላይ መወርወር።
- **አግድም ፍጥነት ($u_x$):** $u \\cos\\theta$ (ሁልጊዜ ቋሚ ነው)
- **የደረሰበት ከፍተኛ ከፍታ ($H$):** 
  $$H = \\frac{u^2 \\sin^2\\theta}{2g}$$
- **አጠቃላይ የተጓዘበት አግድም ርቀት ($R$):** 
  $$R = \\frac{u^2 \\sin(2\\theta)}{g}$$`,
    keyFormulas: ["Range = u^2 sin(2θ) / g", "H_max = u^2 (sin θ)^2 / 2g"]
  },
  {
    id: "phys-u2",
    subject: "Physics",
    unitNumber: 2,
    title: "Electrostatics",
    titleAmharic: "ኤሌክትሮስታቲክስ",
    grade: 12,
    notes: `### ⚡ Unit 2: Electrostatics
The study of electric charges at rest, electric force field, and potentials.

#### 1. Coulomb's Law
The electrostatic force $F$ between two charges $q_1$ and $q_2$ separated by a distance $r$:
$$F = k \\frac{|q_1 q_2|}{r^2}$$
where $k \\approx 8.99 \\times 10^9 \\text{ N m}^2/\\text{C}^2$.

#### 2. Electric Potential ($V$)
The potential energy per unit charge at a point:
$$V = k \\frac{q}{r}$$`,
    notesAmharic: `### ⚡ ምዕራፍ 2፡ ኤሌክትሮስታቲክስ (Electrostatics)
ሳይንቀሳቀሱ በአንድ ቦታ የተቀመጡ የኤሌክትሪክ ቻርጆችን፣ ጉልበታቸውንና አቅማቸውን የሚያጠና ዘርፍ ነው።

#### 1. የኩሎምብ ሕግ (Coulomb's Law)
በሁለት ቻርጆች ($q_1$ እና $q_2$) መካከል የሚፈጠር የሳቢነት ወይም ገፊነት ኃይል $F$፡
$$F = k \\frac{|q_1 q_2|}{r^2}$$
እዚህ ውስጥ $k$ የኤሌክትሮስታቲክስ ኮንስታንት ($8.99 \\times 10^9$) ነው።`,
    keyFormulas: ["F = k * q1 q2 / r^2", "E = F / q"]
  },
  {
    id: "chem-u1",
    subject: "Chemistry",
    unitNumber: 1,
    title: "Chemical Thermodynamics",
    titleAmharic: "ኬሚካል ቴርሞዳይናሚክስ",
    grade: 12,
    notes: `### 🧪 Unit 1: Chemical Thermodynamics Core Notes
The study of heat energy exchange during chemical processes.

#### 1. Laws of Thermodynamics
- **First Law Enthalpy ($H$):**
  $$\\Delta H = \\Delta U + P\\Delta V = q_p$$
- **Second Law Entropy ($S$):** Spontaneous processes must increase total entropy of universe ($\\Delta S_{univ} > 0$).

#### 2. Gibbs Free Energy ($G$)
Determines absolute spontaneity of a system at constant temperature and pressure.
$$\\Delta G = \\Delta H - T\\Delta S$$
- $\\Delta G < 0$: Spontaneous, energy is released (exergonic).
- $\\Delta G > 0$: Non-spontaneous, requires external energy.
- $\\Delta G = 0$: The chemical reaction has reached equilibrium.`,
    notesAmharic: `### 🧪 ምዕራፍ 1፡ ኬሚካል ቴርሞዳይናሚክስ (Chemical Thermodynamics)
በኬሚካላዊ ግብረመልስ (reactions) ጊዜ የሚፈጠረውን የሙቀት ኃይል ግንኙነት የሚያጠና ክፍል ነው።

#### 1. የቴርሞዳይናሚክስ ሕጎች
- **የመጀመሪያው ሕግ (ፈሳሽ ሙቀት - Enthalpy $\\Delta H$):** ሙቀት አይፈጠርም፣ አይጠፋም፣ ወደ ሌላ ዓይነት ኃይል ይቀየራል እንጂ።
- **ኤንትሮፒ (Entropy $S$):** በዓለም ላይ ያሉ ነገሮች በሙሉ ወደ መበታተን (disorder) ያመራሉ።

#### 2. የጊብስ ፍሪ ኢነርጂ (Gibbs Free Energy $G$)
የአንድ ግብረመልስ በራሱ ጊዜ መካሄድ (Spontaneity) መወሰኛ ቀመር ነው፡
$$\\Delta G = \\Delta H - T\\Delta S$$
- $\\Delta G < 0$ ከሆነ፡ ግብረመልሱ በራሱ ጊዜ ይካሄዳል (Spontaneous)።
- $\\Delta G > 0$ ከሆነ፡ ያለ ተጨማሪ ኃይል ሊካሄድ አይችልም (Non-spontaneous)።`,
    keyFormulas: ["ΔG = ΔH - TΔS", "ΔH = H_products - H_reactants"]
  },
  {
    id: "bio-u1",
    subject: "Biology",
    unitNumber: 1,
    title: "Cell Physiology & Enzymes",
    titleAmharic: "የሴል ባዮሎጂ እና ኤንዛይሞች",
    grade: 11,
    notes: `### 🦠 Unit 1: Cell Biology & Enzymes
Focus on metabolic processes, cellular organelles, and biocatalysts.

#### 1. Enzymes as Biocatalysts
Enzymes are protein molecules that speed up physiological reactions by lowering activation energy ($E_a$).
- Speed up reaction rates up to $10^{12}$ times.
- Show remarkable specificity determined by their **active site** configuration (Lock and Key / Induced Fit theory).

#### 2. Factors Affecting Enzyme Activity
- Temperature (optimal human enzyme activity at $\\approx 37^\\circ\\text{C}$).
- pH level (e.g. Pepsin is optimal at highly acidic pH 2, Amylase at neutral pH 7).`,
    notesAmharic: `### 🦠 ምዕራፍ 1፡ የሴል ባዮሎጂ እና ኤንዛይሞች (Cell Physiology)
ስለ ሕዋሳት ፊዚዮሎጂ እና ስለ ባዮሎጂካል ካታሊስቶች (ኤንዛይሞች) ጥልቅ ማብራሪያ።

#### 1. ኤንዛይሞች (Enzymes)
ኤንዛይሞች የግብረመልሶችን መነሻ አነቃቂ ኃይል (Activation Energy) በመቀነስ የሴል ሜታቦሊዝምን የሚያፋጥኑ ፕሮቲኖች ናቸው።
- በሥራ ቦታቸው (Active Site) ውስጥ እንደ መቆለፊያ እና ቁልፍ (Lock and Key) እጅግ በጣም መራጭ (Specific) ናቸው።

#### 2. የኤንዛይም ፍጥነት ላይ ተጽእኖ የሚያሳድሩ ነገሮች፡
- የሙቀት መጠን (Temperature) (የሰው ልጅ አካል ተስማሚ ሙቀት 37 ዲግሪ ሴልሺየስ አካባቢ ነው)።
- ፒኤች (pH) ደረጃ (ለምሳሌ በጨጓራ የሚገኘው ፔፕሲን በአሲድማ pH ደረጃ 2 ላይ ምርጥ ይሰራል።)`,
    keyFormulas: ["Activation Energy (Ea) Reduction Model"]
  },
  {
    id: "hist-u1",
    subject: "History",
    unitNumber: 1,
    title: "The Great Aksumite Civilization",
    titleAmharic: "ታላቁ የአክሱም ሥልጣኔ",
    grade: 12,
    notes: `### 🏛️ History Unit 1: The Great Aksumite Civilization
The Aksumite Empire was an ancient kingdom centered in northern Ethiopia. It became a global commercial superpower between the 1st and 7th centuries AD.

#### 1. Wealth of Aksum and Trade Ports
- **Adulis:** The premium international port on the Red Sea. It linked imports from Rome, Byzantium, India, and China with exports of gold, ivory, obsidian, and spices.
- **Aksumite Currency:** One of the few ancient global empires to mint its own gold, silver, and bronze coinage under Kings like Endubis and Aphilas.

#### 2. Architectural Marvels
- **The Stelae (Obelisks):** Massive single-stone pillars carved with luxury doors and windows, representing royal tombs. Giant Stele (Stele 1) stood 33 meters high, weighing over 500 tons, representing pinnacle ancient engineering.
- **Conversion to Christianity:** King Ezana adopted Christianity around 330 AD, coin designs shifted from crescent moon/solar-disc symbols to a Christian Cross.`,
    notesAmharic: `### 🏛️ ታሪክ ምዕራፍ 1፡ ታላቁ የአክሱም ሥልጣኔ
የአክሱም መንግሥት ከ1ኛው እስከ 7ኛው መቶ ክፍለ ዘመን በዓለም ላይ ካሉ አራት ታላላቅ ኃያላን መንግሥታት (ሮማ፣ ፋርስ፣ ቻይና፣ አክሱም) አንዱ የነበረ ጥንታዊ የንግድና የባህል ማዕከል ነው።

#### 1. የንግድና የቆርቆሮ ጥበብ
- **አዱሊስ ወደብ (Adulis):** በጥንታዊው ቀይ ባሕር ላይ የሚገኝ ታዋቂ ዓለም አቀፍ የንግድ ወደብ ነበር። ከሮም፣ ግብፅ፣ ሕንድና ቻይና የንግድ ዕቃዎች ይመጡበት ነበር።
- **የአክሱም ሳንቲሞች (Coinage):** አክሱም በራሱ በወርቅ፣ በብርና በነሐስ ሳንቲም የቀረጸ የመጀመሪያው አፍሪካዊ መንግሥት ነው። (በንጉሥ አንዱቢስ ዘመን ተጀመረ)።

#### 2. የአክሱም ሐውልቶች (Stelae)
- ግዙፍ ነጠላ ቋጥኝ ድንጋዮች (Monolithic Obelisks) ተፈልፍለው የተሰሩ የቅርስ ድንቆች ናቸው። የንጉሥ ዔዛና ሐውልት እና ታላቁ የተጋደመው ሐውልት በአክሱም የሚገኙ ጥበቦች ማሳያ ናቸው። ንጉሥ ዔዛና በ330 ዓ.ም ክርስትናን ከተቀበለ በኋላ በሳንቲሞች ላይ የነበረው የጨረቃና ፀሐይ ምልክት በክርስቲያን መስቀል ተተካ።`,
    keyFormulas: ["Trade Ports: Adulis, Avalites, Mundus", "Kings: Endubis, Ezana, Kaleb"]
  },
  {
    id: "geog-u1",
    subject: "Geography",
    unitNumber: 1,
    title: "The Great Rift Valley of Ethiopia",
    titleAmharic: "ታላቁ የኢትዮጵያ ስምጥ ሸለቆ",
    grade: 12,
    notes: `### 🌍 Geography Unit 1: The Great Rift Valley of Ethiopia
The Rift Valley is a major graben system cutting through the center of Ethiopia, active since the Miocene epoch.

#### 1. Topographic Divisions
Ethiopia is split into three main physiographic regions:
1. **Western Highlands & Lowlands**
2. **Southeastern Highlands & Lowlands**
3. **The Rift Valley** (consists of the Afar Triangle/Depression, the Main Ethiopian Rift, and the Southern River Basin).

#### 2. Features and Lakes
- The Afar Triangle contains the lowest point in Africa (Danakil Depression, Dallol, -125 meters below sea level).
- Home to volcanic chain lakes: Ziway, Langano, Abijatta, Shalla, Awassa, Abaya, and Chamo.`,
    notesAmharic: `### 🌍 ጂኦግራፊ ምዕራፍ 1፡ ታላቁ የኢትዮጵያ ስምጥ ሸለቆ (Great Rift Valley)
ስምጥ ሸለቆ ኢትዮጵያን ለሁለት የሚከፍል ከቀይ ባሕር እስከ ሞዛምቢክ የሚዘልቅ ጥልቅ መልክዓ ምድራዊ ስምጥ ነው።

#### 1. የመልክዓ ምድር ክፍሎች፡
ኢትዮጵያ በሦስት ዋና ዋና ክፍሎች ትመደባለች፡
1. **የምዕራብ ደጋማና ዝቅተኛ ቦታዎች**
2. **የምሥራቅ/በስተደቡብ ደጋማና ዝቅተኛ ቦታዎች**
3. **የኢትዮጵያ ስምጥ ሸለቆ** (አፋር ትሪያንግል፣ መካከለኛው ስምጥ ሸለቆ እና የደቡብ ወንዞች ተፋሰስን ያካትታል)።

#### 2. የስምጥ ሸለቆ ሐይቆች፡
- በአፋር የሚገኘው ዳሎል (ከባሕር ጠለል በታች -125 ሜትር) በዓለም እጅግ ሞቃታማና ዝቅተኛ ቦታ ነው።
- በውስጡ በርካታ የእሳተ ገሞራ ፍንጣቂ ሐይቆችን ይዟል (ዝዋይ፣ ላንጋኖ፣ አሲያታ፣ ሻላ፣ ሐዋሳ፣ አባያ እና ጫሞ)።`,
    keyFormulas: ["Lowest point: Dallol -125m", "Main Rift Lakes: Shalla, Langano, Chamo"]
  },
  {
    id: "math9-u1",
    subject: "Mathematics",
    unitNumber: 1,
    title: "The Number System",
    titleAmharic: "የቁጥር ስርዓት",
    grade: 9,
    notes: `### 🔢 Grade 9 Math Unit 1: The Number System Core Notes
The number system is the foundation of secondary algebra. 

#### 1. Classification of Numbers
- **Natural Numbers ($N$):** $\{1, 2, 3, \dots\}$
- **Integers ($Z$):** $\{\dots, -2, -1, 0, 1, 2, \dots\}$
- **Rational Numbers ($Q$):** Any number expressible in $p/q$ form where $p, q \in Z, q \neq 0$.
- **Irrational Numbers ($Q'$):** Decimal representations that are non-terminating and non-recurring (e.g., $\sqrt{2}$, $\pi$).
- **Real Numbers ($R$):** The union of rational and irrational numbers ($Q \cup Q'$).

#### 2. Exponents and Radicals Laws
For real numbers $a, b > 0$ and rational exponents:
- **Product Law:** $a^m \cdot a^n = a^{m+n}$
- **Quotient Law:** $a^m / a^n = a^{m-n}$
- **Power of Power:** $(a^m)^n = a^{m \cdot n}$`,
    notesAmharic: `### 🔢 ሒሳብ 9ኛ ክፍል ምዕራፍ 1፡ የቁጥር ስርዓት ማጠቃለያ ማስታወሻ
የቁጥር ስርዓት ለሁለተኛ ደረጃ አልጀብራ መሠረት ነው።

#### 1. የቁጥሮች ምደባ
- **ተፈጥሯዊ ቁጥሮች ($N$):** $\{1, 2, 3, \dots\}$
- **ሙሉ ቁጥሮች ($Z$):** $\{\dots, -2, -1, 0, 1, 2, \dots\}$
- **ረሽናል ቁጥሮች ($Q$):** በ $p/q$ መልክ መጻፍ የሚችሉ ቁጥሮች (እዚህ ጋር $q \neq 0$)።
- **ኢረሽናል ቁጥሮች ($Q'$):** በደሲማል ሲቀመጡ የማይደጋገሙና የማይቆሙ (ለምሳሌ $\sqrt{2}$፣ $\pi$)።
- **ሪል ቁጥሮች ($R$):** የረሽናል እና ኢረሽናል ቁጥሮች ስብስብ ($Q \cup Q'$)።

#### 2. የኤክስፖነንት እና ራዲካል መሠረታዊ ሕጎች፡
- **የማባዛት ሕግ:** $a^m \cdot a^n = a^{m+n}$
- **የማካፈል ሕግ:** $a^m / a^n = a^{m-n}$
- **የኃይል ኃይል ሕግ:** $(a^m)^n = a^{m \cdot n}$`,
    keyFormulas: ["a^m * a^n = a^(m+n)", "R = Q U Q'"]
  },
  {
    id: "phys9-u1",
    subject: "Physics",
    unitNumber: 1,
    title: "Introduction to Physics and Vectors",
    titleAmharic: "ፊዚክስ መግቢያ እና ቬክተሮች",
    grade: 9,
    notes: `### 📏 Grade 9 Physics Unit 1: Core Notes on Introduction & Vectors
Physics is the quantitative study of matter, energy, and their mutual interactions. 

#### 1. Physical Quantities and SI Units
There are two categories of physical quantities:
1. **Base Quantities:** Mass (kg), Length (m), Time (s), Electric Current (A), Temperature (K), Amount of substance (mol), Luminous intensity (cd).
2. **Derived Quantities:** Speed ($m/s$), Acceleration ($m/s^2$), Force ($N = kg \cdot m/s^2$).

#### 2. Scalar vs. Vector Quantities
- **Scalar:** Represented by magnitude (size) and unit only (e.g., Mass, Temperature, Speed).
- **Vector:** Represented by both magnitude and direction (e.g., Velocity, Displacement, Force).
- **Vector Addition:** Adding collinear vectors or using triangular/parallelogram rules.`,
    notesAmharic: `### 📏 ፊዚክስ 9ኛ ክፍል ምዕራፍ 1፡ መግቢያ እና ቬክተሮች
ፊዚክስ ስለ ቁሶች፣ ኃይል እና በመካከላቸው ስላለው ግንኙነት የሚያጠና የሳይንስ ዘርፍ ነው።

#### 1. መሠረታዊ እና ተዋጽኦ ልኬቶች (SI Units)
- **መሠረታዊ ልኬቶች (Base Quantities):** ግዝፈት (kg)፣ ርዝመት (m)፣ ጊዜ (s)፣ የኤሌክትሪክ ፍሰት (A) እና ቴምፕሬቸር (K)።
- **ተዋጽኦ ልኬቶች (Derived Quantities):** ፍጥነት ($m/s$)፣ ፍጥነት መጨመር ($m/s^2$)፣ ኃይል ($N$)።

#### 2. ስኬላር እና ቬክተር ልኬቶች (Scalar vs Vector)
- **ስኬላር (Scalar):** መጠንና መለኪያ ብቻ ያላቸው (ለምሳሌ፡ ግዝፈት፣ ሙቀት፣ ፍጥነት)።
- **ቬክተር (Vector):** መጠን፣ መለኪያ እና አቅጣጫ ያላቸው (ለምሳሌ፡ ፍጥነት በአቅጣጫ - Velocity፣ የመሳብ ኃይል - Force)።`,
    keyFormulas: ["Force = mass * acceleration", "collinear vectors sum"]
  },
  {
    id: "math10-u1",
    subject: "Mathematics",
    unitNumber: 1,
    title: "Polynomial Functions",
    titleAmharic: "ፖሊኖሚያል ፋንክሽኖች",
    grade: 10,
    notes: `### 📈 Grade 10 Math Unit 1: Polynomial Functions Notes
Polynomial functions of single variable $x$ are critical structures under matric and preparatory curricula.

#### 1. Structure of Polynomials
A polynomial function of degree $n$ is defined by:
$$P(x) = a_n x^n + a_{n-1} x^{n-1} + \dots + a_1 x + a_0$$
where $a_n \neq 0$ and $n$ is a non-negative integer.

#### 2. Core Theorems of Polynomial Division
- **Remainder Theorem:** If a polynomial $P(x)$ is divided by $x - c$, then the remainder is $R = P(c)$.
- **Factor Theorem:** A polynomial $P(x)$ has a factor $(x - c)$ if and only if $P(c) = 0$.
- **Rational Root Theorem:** All rational zeros of a polynomial of form $a_n x^n + \dots + a_0 = 0$ must be of form $p/q$, where $p$ divides $a_0$ and $q$ divides $a_n$.`,
    notesAmharic: `### 📈 ሒሳብ 10ኛ ክፍል ምዕራፍ 1፡ ፖሊኖሚያል ፋንክሽኖች (Polynomial Functions)
ፖሊኖሚያል በአልጀብራዊ ቀመሮች ውስጥ ትልቅ ድርሻ አላቸው።

#### 1. የፖሊኖሚያል መዋቅር
የደረጃ $n$ ፖሊኖሚያል ቀመር፡
$$P(x) = a_n x^n + a_{n-1} x^{n-1} + \dots + a_1 x + a_0$$
እዚህ ላይ $a_n \neq 0$ ሲሆን $n$ ደግሞ ፖዘቲቭ ሙሉ ቁጥር (non-negative integer) መሆን አለበት።

#### 2. የፖሊኖሚያል ማካፈል ቲዎረሞች
- **የቀሪ ቲዎረም (Remainder Theorem):** ፖሊኖሚያል $P(x)$ ለ $x - c$ ሲካፈል ቀሪው $R = P(c)$ ነው።
- **የአባዢ ቲዎረም (Factor Theorem):** $P(c) = 0$ ከሆነ $x - c$ የ $P(x)$ አባዢ (factor) ነው ማለት ነው።`,
    keyFormulas: ["P(x) = Q(x)(x - c) + R", "Factor test: P(c) = 0"]
  },
  {
    id: "chem10-u1",
    subject: "Chemistry",
    unitNumber: 1,
    title: "Introduction to Organic Chemistry",
    titleAmharic: "ኦርጋኒክ ኬሚስትሪ መግቢያ",
    grade: 10,
    notes: `### 🧪 Grade 10 Chemistry Unit 1: Introduction to Organic Chemistry
Organic chemistry is the scientific branch dedicated to carbon-containing compounds. Carbon exhibits high catenation capacity (capacity to bond to itself on chains).

#### 1. Hydrocarbons Classification
Compounds containing only Carbon and Hydrogen:
1. **Saturated Hydrocarbons (Alkanes):** Single covalent bonds. General formula: $C_n H_{2n+2}$ (Suffix: -ane).
2. **Unsaturated Hydrocarbons:**
   - **Alkenes:** Double covalent bond. General formula: $C_n H_{2n}$ (Suffix: -ene).
   - **Alkynes:** Triple covalent bond. General formula: $C_n H_{2n-2}$ (Suffix: -yne).

#### 2. Functional Groups
Atoms or groups of atoms that govern the chemical behavior of organic compounds (e.g. Alcohols: $-OH$, Carboxylic acids: $-COOH$, Esters: $-COOR$).`,
    notesAmharic: `### 🧪 ኬሚስትሪ 10ኛ ክፍል ምዕራፍ 1፡ ኦርጋኒክ ኬሚስትሪ መግቢያ
ኦርጋኒክ ኬሚስትሪ ካርቦንን ያቀፉ ውህዶችን የሚያጠና የኬሚስትሪ ክፍል ነው።

#### 1. ሃይድሮካርቦን ምደባ (Hydrocarbons)
ካርቦንና ሃይድሮጅን ብቻ የያዙ ውህዶች፡
1. **ሳቹሬትድ (Alkanes):** ነጠላ ቦንድ ያላቸው። ፎርሙላ፡ $C_n H_{2n+2}$
2. **አንሳቹሬትድ (Unsaturated):**
   - **Alkenes:** እጥፍ (Double) ቦንድ ያላቸው። ፎርሙላ፡ $C_n H_{2n}$
   - **Alkynes:** ሦስት እጥፍ (Triple) ቦንድ ያላቸው። ፎርሙላ፡ $C_n H_{2n-2}$`,
    keyFormulas: ["C_n H_(2n+2) [Alkane]", "C_n H_(2n) [Alkene]"]
  },
  {
    id: "freshman-math-u1",
    subject: "Mathematics",
    unitNumber: 1,
    title: "Propositional Logic and Set Theory",
    titleAmharic: "ሎጂክ እና ላዕላይ ስብስብ ቲዎሪ",
    grade: 13, // 13 represents Freshman / University Prep Level
    notes: `### 🏛️ Freshman Math Unit 1: Propositional Logic & Set Theory
This university freshman foundation course introduces mathematical arguments and set models.

#### 1. Propositional Logic
A **proposition** is a declarative sentence that is either true (T) or false (F), but not both.
- **Conjunction ($\land$):** True only if both statements are True.
- **Disjunction ($\lor$):** False only if both statements are False.
- **Implication ($P \implies Q$):** False only when $P$ is True and $Q$ is False.
- **Biconditional ($P \iff Q$):** True if both $P$ and $Q$ share identical truth values.

#### 2. Set Theory & Relations
- **Power Set ($P(A)$):** The set of all subsets of $A$. If $|A| = n$, then $|P(A)| = 2^n$.
- **Equivalence Relation:** A relation that is simultaneously reflexive, symmetric, and transitive.`,
    notesAmharic: `### 🏛️ የዩኒቨርሲቲ ፈርስት ይየር (Freshman) ሂሳብ ምዕራፍ 1፡ ሎጂክ እና ስብስብ ጥናት
የከፍተኛ ትምህርት መነሻ ሂሳብ ትንተና።

#### 1. ፕሮፖዚሽናል ሎጂክ (Propositional Logic)
አንድ ዓረፍተ ነገር እውነት (T) ወይም ሐሰት (F) ብቻ ሲሆን ፈርጅ ሎጂክ ይባላል።
- **Conjunction ($\land$ - እና):** ሁለቱም እውነት ሲሆኑ ብቻ እውነት ነው።
- **Disjunction ($\lor$ - ወይም):** ሁለቱም ሐሰት ሲሆኑ ብቻ ሐሰት ነው።
- **Implication ($P \implies Q$):** $P$ እውነት ሆኖ $Q$ ሐሰት ሲሆን ብቻ ሐሰት ይሆናል።

#### 2. ስብሳባዊ ጥናት (Set Theory)
- **ፓወር ሴት (Power Set):** የሁሉም ሰብሴቶች (subsets) ስብስብ ነው። የአባላት ብዛት $2^n$ ነው።`,
    keyFormulas: ["P -> Q === ~P V Q", "PowerSet subsets = 2^n"]
  },
  {
    id: "freshman-phys-u1",
    subject: "Physics",
    unitNumber: 1,
    title: "Mechanics and Rotational Dynamics",
    titleAmharic: "ሜካኒክስ እና የክብ እንቅስቃሴ ዳይናሚክስ",
    grade: 13,
    notes: `### 🌀 Freshman Physics Unit 1: Mechanics & Rotational Dynamics
Advanced Newtonian mechanics including angular motions and energy conservation principles of rigid bodies.

#### 1. Rotational Kinematics Variables
- **Angular Displacement ($\theta$):** measured in Radians.
- **Angular Velocity ($\omega$):** $\omega = d\theta / dt$
- **Angular Acceleration ($\alpha$):** $\alpha = d\omega / dt$
- **Rotational Inertia / Moment of Inertia ($I$):** resistance to rotational acceleration. $I = \sum m_i r_i^2$.

#### 2. Rotational Kinetic Energy and Torque
- **Torque ($\tau$):** Angular force vector $\tau = \vec{r} \times \vec{F} = I\alpha$.
- **Rotational Kinetic Energy ($K_r$):** 
  $$K_r = \frac{1}{2} I \omega^2$$
- **Conservation of Angular Momentum ($L$):** $L = I\omega = \text{constant}$ in the absence of net external torque.`,
    notesAmharic: `### 🌀 Freshman ፊዚክስ ምዕራፍ 1፡ ክብ እንቅስቃሴና ዳይናሚክስ (Rotational Dynamics)
የዩኒቨርሲቲ አንደኛ ዓመት የላቀ ፊዚክስ (መካኒክስ)።

#### 1. ክብ እንቅስቃሴ (Rotational Physics)
- **አንግላር ቬሎሲቲ ($\omega$):** በሰከንድ የሚደረግ አንግላዊ ርቀት።
- **ሞመንት ኦፍ ኢነርሺያ ($I$):** ክብ እንቅስቃሴን የመቋቋም አቅም፤ $I = \sum m_i r_i^2$።

#### 2. ቶርክ እና የክብ እንቅስቃሴ ኃይል (Torque & Kr)
- **ቶርክ ($\tau$):** የማዞሪያ ኃይል፤ $\tau = I\cdot\alpha$።
- **አንግላር ሞመንተም ($L$):** $L = I \cdot \omega$ (ከውጭ የሚመጣ ቶርክ ካልተፈጠረ ሁልጊዜ ቋሚ ነው)።`,
    keyFormulas: ["Torque = I * alpha", "K_rotational = 1/2 * I * w^2"]
  },
  {
    id: "freshman-eng-u1",
    subject: "English",
    unitNumber: 1,
    title: "Academic Reading Skills and Vocabulary",
    titleAmharic: "አካዳሚክ የማንበብ ብቃት እና የቃላት ጥናት",
    grade: 13,
    notes: `### ✍️ Freshman English Unit 1: Academic Writing & Vocabulary
Improving reading comprehension and logical structuring of academic scripts at the university level.

#### 1. Reading Strategies
- **Skimming:** Rapid reading of texts to grasp general main ideas in exams.
- **Scanning:** Searching for specialized exact keywords or stats parameters directly.
- **Active Context Clues:** Dissecting word morphology (Roots, Prefixes like *multi-*, *de-*, *chrono-*, and Suffixes like *-ism*, *-ology*) to infer definitions of unfamiliar jargon.

#### 2. Academic Sentence Structures
- **Compound Sentence:** Two independent clauses joined by coordinating conjunctions (FANBOYS: For, And, Nor, But, Or, Yet, So).
- **Complex Sentence:** One independent clause and one or more dependent clauses introduced by subordinators (e.g., although, since, because).`,
    notesAmharic: `### ✍️ Freshman እንግሊዝኛ ምዕራፍ 1፡ አካዳሚክ የማንበብ ብቃት እና ሰዋስው
የከፍተኛ ትምህርት መነሻ እንግሊዝኛ።

#### 1. የንባብ ስልቶች (Reading Strategies)
- **ስኪሚንግ (Skimming):** የአንድን ጽሑፍ አጠቃላይ ዋና ሃሳብ ፈጥኖ መረዳት።
- **ስካኒንግ (Scanning):** በጽሑፉ ውስጥ የተወሰኑ ቁጥሮችን ወይም ቀናትን መፈለግ።
- **የአገባብ ፍንጮች (Context Clues):** የቃላቱን መነሻ (prefixes) እና መድረሻ (suffixes) በማየት ፍችውን መገመት።

#### 2. የአረፍተ ነገር አወቃቀሮች (Sentence Structures)
- **Compound Sentence:** ሁለት ራሳቸውን የቻሉ አረፍተ ነገሮችን በ "FANBOYS" ማገናኘት።
- **Complex Sentence:** አንድ ራሱን የቻለ እና አንድ ጥገኛ አረፍተ ነገርን ማገናኘት።`,
    keyFormulas: ["skimming vs scanning", "FANBOYS links"]
  }
];

