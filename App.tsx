import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Dimensions, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Modal,
  Image,
  Share
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// Core pre-loaded datasets
import { 
  UNIVERSITIES, 
  MCQS, 
  FORMULAS, 
  CURRICULUM_UNITS 
} from './src/data';
import { 
  StudentInfo, 
  University, 
  MCQQuestion, 
  CurriculumUnit, 
  FormulaItem 
} from './src/types';

// Mobile-friendly inline vector icons
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Bookmark, 
  Lightbulb, 
  Search, 
  TrendingUp, 
  Target, 
  GraduationCap, 
  Maximize2, 
  Cpu, 
  FolderSync, 
  Plus, 
  ChevronRight, 
  Languages, 
  MapPin, 
  Phone, 
  Mail, 
  School, 
  User, 
  Calendar,
  Eye,
  ArrowRight,
  RefreshCw,
  Clock,
  Send,
  Sliders,
  Award
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Math Notation Clean-up for mobile text (Unicode equivalents for LaTeX)
const cleanMathNotation = (formula: string): string => {
  let cleaned = formula;
  cleaned = cleaned.replace(/\\frac\{([^\}]+)\}\{([^\}]+)\}/g, '($1) / ($2)');
  cleaned = cleaned.replace(/\\cdot/g, ' · ');
  cleaned = cleaned.replace(/\\theta/g, 'θ');
  cleaned = cleaned.replace(/\\cos/g, 'cos');
  cleaned = cleaned.replace(/\\sin/g, 'sin');
  cleaned = cleaned.replace(/\\approx/g, '≈');
  cleaned = cleaned.replace(/\\neq/g, '≠');
  cleaned = cleaned.replace(/\\infty/g, '∞');
  cleaned = cleaned.replace(/\\times/g, '×');
  cleaned = cleaned.replace(/\^2/g, '²');
  cleaned = cleaned.replace(/\^3/g, '³');
  cleaned = cleaned.replace(/\^n/g, 'ⁿ');
  cleaned = cleaned.replace(/_1/g, '₁');
  cleaned = cleaned.replace(/_2/g, '₂');
  cleaned = cleaned.replace(/_3/g, '₃');
  cleaned = cleaned.replace(/_n/g, 'ₙ');
  cleaned = cleaned.replace(/_eq/g, 'ₑ_q');
  return cleaned;
};

// Local cache keys
const STORAGE_KEYS = {
  STUDENT_INFO: 'aksum_student_info',
  COMPLETED_MINUTES: 'aksum_study_minutes',
  CUSTOM_MCQS: 'aksum_custom_mcqs',
  CUSTOM_UNIVERSITIES: 'aksum_custom_unis',
  ANSWERS_HISTORY: 'aksum_answers_history'
};

export default function App() {
  // Onboarding registration state
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    age: '',
    phone: '',
    email: '',
    school: '',
    gradeLevel: 'Grade 12',
    fieldStream: 'Natural Science',
    targetUniversity: 'Addis Ababa University',
    primaryGoal: 'Scoring 500+ in national ESSLCE Matric Exam',
    preferredLanguage: 'amh',
    isRegistered: false
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'curriculum' | 'aiTutor' | 'formulas' | 'universities'>('dashboard');
  const [lang, setLang] = useState<'amh' | 'eng'>('amh');

  // Study Pomodoro states
  const [pomodoroLeft, setPomodoroLeft] = useState(2700); // 45 mins defaults
  const [timerRunning, setTimerRunning] = useState(false);
  const [focusMode, setFocusMode] = useState<'focus' | 'break'>('focus');
  const [timerMax, setTimerMax] = useState(2700);
  const [completedMinutes, setCompletedMinutes] = useState(0);

  // Curriculum, notes & practice states
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('math-u1');
  const [curriculumUnits, setCurriculumUnits] = useState<CurriculumUnit[]>(CURRICULUM_UNITS);
  const [customMCQs, setCustomMCQs] = useState<MCQQuestion[]>(MCQS);
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [revealMCQAnswer, setRevealMCQAnswer] = useState(false);
  const [answersState, setAnswersState] = useState<Record<string, { selected: number; correct: boolean }>>({});
  const [quizFilter, setQuizFilter] = useState<'all' | 'unanswered'>('all');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  // AI chat state
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'user' | 'ai'; text: string; time: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Formulas state
  const [formulaSearch, setFormulaSearch] = useState('');
  const [formulaSubject, setFormulaSubject] = useState<'All' | 'Mathematics' | 'Physics' | 'Chemistry'>('All');

  // Universities state
  const [universities, setUniversities] = useState<University[]>(UNIVERSITIES);
  const [universityModalVisible, setUniversityModalVisible] = useState(false);
  const [newUniName, setNewUniName] = useState('');
  const [newUniAmName, setNewUniAmName] = useState('');
  const [newUniLocation, setNewUniLocation] = useState('');
  const [newUniDescription, setNewUniDescription] = useState('');
  const [newUniCutoffNatural, setNewUniCutoffNatural] = useState('380');
  const [newUniCutoffSocial, setNewUniCutoffSocial] = useState('350');

  // Timer Ref
  const timerIntervalRef = useRef<any>(null);

  // Fetch initial profile
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const cachedInfo = await AsyncStorage.getItem(STORAGE_KEYS.STUDENT_INFO);
        const cachedMins = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_MINUTES);
        const cachedMcqs = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_MCQS);
        const cachedUnis = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_UNIVERSITIES);
        const cachedHistory = await AsyncStorage.getItem(STORAGE_KEYS.ANSWERS_HISTORY);

        if (cachedInfo) {
          const parsedInfo = JSON.parse(cachedInfo);
          setStudentInfo(parsedInfo);
          setLang(parsedInfo.preferredLanguage || 'amh');
        }

        if (cachedMins) {
          setCompletedMinutes(parseInt(cachedMins, 10));
        }

        if (cachedMcqs) {
          setCustomMCQs(JSON.parse(cachedMcqs));
        }

        if (cachedUnis) {
          setUniversities(JSON.parse(cachedUnis));
        }

        if (cachedHistory) {
          setAnswersState(JSON.parse(cachedHistory));
        }
      } catch (e) {
        console.warn('Bootstrapping error:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Sync profile edits
  const saveStudentInfo = async (info: StudentInfo) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STUDENT_INFO, JSON.stringify(info));
      setStudentInfo(info);
      setLang(info.preferredLanguage);
    } catch (e) {
      Alert.alert('Saving Error', 'Failed to store profile details.');
    }
  };

  // Sync study time
  const incrementStudyMinutes = async (additionalMins: number) => {
    try {
      const nextMins = completedMinutes + additionalMins;
      setCompletedMinutes(nextMins);
      await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_MINUTES, nextMins.toString());
    } catch (e) {
      console.warn(e);
    }
  };

  // Pomodoro Interval Timer
  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setPomodoroLeft((prev) => {
          if (prev <= 1) {
            handleTimerCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerRunning, focusMode]);

  const handleTimerCompletion = () => {
    setTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    if (focusMode === 'focus') {
      const focusMins = Math.round(timerMax / 60);
      incrementStudyMinutes(focusMins);
      Alert.alert(
        lang === 'amh' ? '🎉 ታላቅ ነው!' : '🎉 Congratulations!',
        lang === 'amh' 
          ? `የ ${focusMins} ደቂቃ ትኩረት ጥናትዎን በተሳካ ሁኔታ አጠናቀዋል። አሁን የ 5 ደቂቃ እረፍት ይውሰዱ።` 
          : `You successfully finished your ${focusMins}-minute focus session! Take a well-deserved 5-minute break now.`
      );
      setFocusMode('break');
      setPomodoroLeft(300); // 5 mins
      setTimerMax(300);
    } else {
      Alert.alert(
        lang === 'amh' ? '⏰ እረፍት ተጠናቀቀ' : '⏰ Break Completed',
        lang === 'amh' ? 'አሁን ወደ ጥናትዎ ለመመለስ ዝግጁ ነዎት?' : 'Ready to resume your VIP studies?'
      );
      setFocusMode('focus');
      setPomodoroLeft(2700); // 45 mins
      setTimerMax(2700);
    }
  };

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    if (focusMode === 'focus') {
      setPomodoroLeft(2700);
      setTimerMax(2700);
    } else {
      setPomodoroLeft(300);
      setTimerMax(300);
    }
  };

  // Add Custom University locally
  const handleAddUniversity = async () => {
    if (!newUniName.trim() || !newUniLocation.trim() || !newUniDescription.trim()) {
      Alert.alert('Validation Error', 'Please complete all required fields.');
      return;
    }

    const createdUni: University = {
      id: `custom-uni-${Date.now()}`,
      name: newUniName,
      amharicName: newUniAmName || newUniName,
      location: newUniLocation,
      established: '2026',
      description: newUniDescription,
      amharicDescription: newUniDescription,
      worldRank: 3500 + Math.floor(Math.random() * 500),
      nationalRank: universities.length + 1,
      tier: 'Elite Tier-A',
      departments: ['Software Engineering', 'Business Management', 'Industrial Chemistry'],
      notableAlumni: ['New Generation Leaders'],
      admissionStats: {
        naturalCutoff: parseFloat(newUniCutoffNatural) || 380,
        socialCutoff: parseFloat(newUniCutoffSocial) || 350,
        acceptanceRate: 'Top 5% of Applicants'
      },
      specialFacts: ['State-of-the-art startup incubator centers'],
      bannerGradient: 'from-amber-600 to-amber-900'
    };

    const nextUnis = [...universities, createdUni];
    setUniversities(nextUnis);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_UNIVERSITIES, JSON.stringify(nextUnis));
      Alert.alert('Success', 'University added to custom VIP deck!');
      setUniversityModalVisible(false);
      setNewUniName('');
      setNewUniAmName('');
      setNewUniLocation('');
      setNewUniDescription('');
    } catch (e) {
      console.warn(e);
    }
  };

  // Generate ESSLCE Questions offline / procedural simulation
  const handleGenerateQuestions = async () => {
    setIsGeneratingQuiz(true);
    
    // Simulate smart AI generation of questions aligning with the selected unit
    setTimeout(async () => {
      const activeUnit = curriculumUnits.find(u => u.id === selectedUnitId) || curriculumUnits[0];
      
      const newQuestion: MCQQuestion = {
        id: `gen-q-${selectedSubject.toLowerCase()}-${Date.now()}`,
        subject: selectedSubject,
        grade: activeUnit.grade,
        question: `Which of the following describes the core objective of ${activeUnit.title} when evaluated under standard ESSLCE parameters?`,
        questionAmharic: `ከእነዚህ ውስጥ በብሔራዊ ፈተና መመዘኛ መሠረት የ ${activeUnit.titleAmharic}ን ቁልፍ ጽንሰ-ሐሳብ የሚወክለው የትኛው ነው?`,
        options: [
          "a) Achieving dynamic proportional convergence",
          "b) Maintaining isolated static state values",
          "c) Complete elimination of catalyzer reactions",
          "d) Adhering strictly to arbitrary constants"
        ],
        optionsAmharic: [
          "ሀ) ቀጣይነት ያለው ቀመርንና ሚዛናዊነት ዝምድናን መገንባት",
          "ለ) ተጽእኖ የሌለው የማይንቀሳቀስ እሴት ማስቀመጥ",
          "ሐ) ለውጥ የሚያመጡ ማነቃቂያዎችን ሙሉ በሙሉ ማስወገድ",
          "መ) በዘፈቀደ በተቀመጡ ቋሚ ልኬቶች ላይ ብቻ መደገፍ"
        ],
        answerIndex: 0,
        explanation: `Under ESSLCE structural curriculum matrix, ${activeUnit.title} focuses heavily on proportionality, change, and convergent functions instead of static limits. This validates Option A.`,
        explanationAmharic: `በማትሪክ የሲላበስ መዋቅር መሠረት፣ ይህ ምዕራፍ የሚያተኩረው ቀጣይነት ባላቸው ስልቶችና ውህዶች መሆኑን ስለሚገልጽ ትክክለኛው መልስ ሀ) ነው።`,
        year: "2018 E.C. (ESSLCE Simulated)",
        stream: studentInfo.fieldStream === 'General' ? 'Both' : studentInfo.fieldStream,
        unitNumber: activeUnit.unitNumber,
        topic: activeUnit.title
      };

      const updatedMcqs = [newQuestion, ...customMCQs];
      setCustomMCQs(updatedMcqs);
      
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_MCQS, JSON.stringify(updatedMcqs));
        setCurrentMCQIndex(0);
        setRevealMCQAnswer(false);
        Alert.alert(
          lang === 'amh' ? '🔮 ጥያቄ ተፈጠረ!' : '🔮 Exam Synthesized!',
          lang === 'amh' 
            ? 'አዲስ የሙከራ ጥያቄ በሲላበሱ መሠረት ተፈጥሮ ወደ ዝርዝርዎ ገብቷል።' 
            : 'A procedural syllabus-aligned MCQ was generated on the fly and placed at the top of your revision list.'
        );
      } catch (err) {
        console.warn(err);
      } finally {
        setIsGeneratingQuiz(false);
      }
    }, 1500);
  };

  // Store quiz interactions
  const handleSelectMCQOption = async (selectedIdx: number, correctIdx: number) => {
    const activeQuestion = filteredQuizPool[currentMCQIndex];
    if (!activeQuestion) return;

    const isCorrect = selectedIdx === correctIdx;
    const nextAnswers = {
      ...answersState,
      [activeQuestion.id]: { selected: selectedIdx, correct: isCorrect }
    };

    setAnswersState(nextAnswers);
    setRevealMCQAnswer(true);

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ANSWERS_HISTORY, JSON.stringify(nextAnswers));
    } catch (e) {
      console.warn(e);
    }
  };

  // AI chat companion simulation
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg = {
      id: `chat-${Date.now()}`,
      sender: 'user' as const,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const prompt = chatInput;
    setChatInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      let aiText = '';
      const subjectWord = prompt.toLowerCase();
      
      if (lang === 'amh') {
        if (subjectWord.includes('ማትሪክ') || subjectWord.includes('ፈተና')) {
          aiText = `ጎበዝ፣ የማትሪክ ፈተና ትልቅ ዕድል ነው። ለመዘጋጀት በመጀመሪያ የተመረጡ ዩኒት ማስታወሻዎችን ደፍነህ አንብብ፣ በመቀጠልም ቢያንስ ${customMCQs.length} የሚሆኑ የሙከራ ጥያቄዎችን ደጋግመህ ሥሩ! አክሱም VIP አካዳሚ ምንጊዜም ከአንተ ጋር ነው! 💪`;
        } else if (subjectWord.includes('ስም') || subjectWord.includes('ማን')) {
          aiText = `እንኳን ደህና መጣህ የኔ ተማሪ ${studentInfo.name || 'ጓደኛዬ'}! እኔ "አክሱም ጂፒቲ ፕሮ" እባላለሁ - የኢትዮጵያ ማትሪክ ፈተናዎችን በላቀ ደረጃ እንድታልፍ የተዘጋጀሁ ጠቢብ ረዳትህ ነኝ። ለመጀመር የፈለግከውን የአካዳሚክ ጥያቄ ጠይቀኝ! 🏛️`;
        } else {
          aiText = `በጣም ድንቅ ጥያቄ ነው! ${studentInfo.name || 'ጎበዝ'}፣ በጥናት መሰረት አጠቃላይ የ ${selectedSubject} ጥልቅ ሃሳቦች ለማስታወስ ፎርሙላዎችን መሸምደድ ብቻ ሳይሆን በተግባር ጥያቄ መስራት ይቀድማል። በምዕራፍ ${curriculumUnits.find(u => u.id === selectedUnitId)?.unitNumber || 1} ላይ ያሉትን ፎርሙላዎች አይተሃል?`;
        }
      } else {
        if (subjectWord.includes('matric') || subjectWord.includes('exam')) {
          aiText = `Excellent query, ${studentInfo.name || 'scholar'}! For ESSLCE matric prep, split your time between notes cramming and solving interactive MCQs. Currently, our system holds ${customMCQs.length} customizable questions. Start practicing! 🚀`;
        } else if (subjectWord.includes('who') || subjectWord.includes('name')) {
          aiText = `I am Aksum GPT Pro, your elite educational AI companion. I'm tailored specifically for Ethiopian High School prep (Grades 10-12) to help candidates target prestigious universities like Addis Ababa University! Ask me anything about ${selectedSubject}!`;
        } else {
          aiText = `Fascinating academic thought! To master ${selectedSubject}, make sure to write down the equations from your Cheat Sheet. If we look closely at "${selectedSubject}", active recall is 10x better than passive highlighting. What specific unit can I explain for you?`;
        }
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsAiTyping(false);
    }, 1200);
  };

  // Share Stats
  const handleShareStats = async () => {
    try {
      const shareMsg = lang === 'amh'
        ? `🔥 በአክሱም VIP አካዳሚ የሞባይል መተግበሪያ ላይ የጥናት ሪከርድ ሰበርኩ! \n⏱️ ጠቅላላ የጥናት ጊዜዬ፡ ${completedMinutes} ደቂቃ \n🎯 ቀዳሚ መዳረሻዬ፡ ${studentInfo.targetUniversity} \nአሁኑኑ መተግበሪያውን አውርደው ስኬትዎን ያፋጥኑ!`
        : `🔥 I smashed my ESSLCE study targets on Aksum VIP Academy iOS/Android App! \n⏱️ Total Focused Minutes: ${completedMinutes} mins \n🎯 Target Destination: ${studentInfo.targetUniversity} \nJoin the modern educational revolution today!`;
      
      await Share.share({ message: shareMsg });
    } catch (e) {
      console.warn(e);
    }
  };

  // Filters and dynamic datasets
  const filteredUnits = useMemo(() => {
    return curriculumUnits.filter(u => u.subject === selectedSubject);
  }, [selectedSubject, curriculumUnits]);

  const activeUnit = useMemo(() => {
    return curriculumUnits.find(u => u.id === selectedUnitId) || filteredUnits[0] || curriculumUnits[0];
  }, [selectedUnitId, filteredUnits, curriculumUnits]);

  const filteredQuizPool = useMemo(() => {
    let pool = customMCQs.filter(q => q.subject === selectedSubject && q.unitNumber === activeUnit.unitNumber);
    if (quizFilter === 'unanswered') {
      pool = pool.filter(q => !answersState[q.id]);
    }
    return pool;
  }, [selectedSubject, activeUnit, customMCQs, quizFilter, answersState]);

  const filteredFormulas = useMemo(() => {
    let list = FORMULAS;
    if (formulaSubject !== 'All') {
      list = FORMULAS.filter(f => f.subject === formulaSubject);
    }
    if (formulaSearch.trim()) {
      const query = formulaSearch.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(query) || f.formula.toLowerCase().includes(query) || f.description.toLowerCase().includes(query));
    }
    return list;
  }, [formulaSearch, formulaSubject]);

  // Initial welcome screen complete
  const handleOnboardingComplete = (data: StudentInfo) => {
    saveStudentInfo({
      ...data,
      isRegistered: true
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>🏛️ Loading Aksum VIP Academy Mobile...</Text>
      </View>
    );
  }

  // Welcome Screen (Onboarding)
  if (!studentInfo.isRegistered) {
    return (
      <SafeAreaView style={styles.onboardingContainer}>
        <ExpoStatusBar style="light" />
        <ScrollView contentContainerStyle={styles.onboardingScroll}>
          {/* Header */}
          <View style={styles.onboardingHeader}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200' }} 
              style={styles.onboardingLogoPlaceholder}
            />
            <Text style={styles.titleGradient}>🏛️ AKSUM VIP ACADEMY</Text>
            <Text style={styles.onboardingSubtext}>
              {lang === 'amh'
                ? 'ከጥንታዊ የአክሱም ታላቅነትና ጥበብ የተቀዳ፣ ለብሔራዊ ማትሪክ ፈተና ማሸነፊያ የተዘጋጀ ቅንጡ የሞባይል ተቋም!'
                : 'Inspired by ancient African civilizations, the ultimate high-fidelity mobile workspace for ESSLCE prep!'}
            </Text>

            {/* Language Selection */}
            <TouchableOpacity 
              style={styles.langOnboardingBtn}
              onPress={() => setLang(lang === 'amh' ? 'eng' : 'amh')}
            >
              <Languages size={16} color="#FFD700" />
              <Text style={styles.langOnboardingText}>
                {lang === 'amh' ? '🌍 English Version' : '🌍 በአማርኛ ለመቀጠል'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Onboarding Card Form */}
          <View style={styles.onboardingCard}>
            <Text style={styles.cardHeaderTitle}>
              <GraduationCap size={20} color="#FFD700" /> {lang === 'amh' ? ' የመግቢያ ቅጽ' : ' Student Enrollment'}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{lang === 'amh' ? 'ሙሉ ስም' : 'Full Name'}</Text>
              <TextInput 
                style={styles.textInput}
                placeholder={lang === 'amh' ? 'ለምሳሌ፡ የኔታ አበበ' : 'e.g., Alazar Tesfaye'}
                placeholderTextColor="#64748b"
                value={studentInfo.name}
                onChangeText={(text) => setStudentInfo({...studentInfo, name: text})}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>{lang === 'amh' ? 'ዕድሜ' : 'Age'}</Text>
                <TextInput 
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="e.g., 18"
                  placeholderTextColor="#64748b"
                  value={studentInfo.age.toString()}
                  onChangeText={(text) => setStudentInfo({...studentInfo, age: text ? parseInt(text, 10) : ''})}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.inputLabel}>{lang === 'amh' ? 'ስልክ ቁጥር' : 'Phone'}</Text>
                <TextInput 
                  style={styles.textInput}
                  keyboardType="phone-pad"
                  placeholder="0912345678"
                  placeholderTextColor="#64748b"
                  value={studentInfo.phone}
                  onChangeText={(text) => setStudentInfo({...studentInfo, phone: text})}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{lang === 'amh' ? 'ትምህርት ቤት' : 'School'}</Text>
              <TextInput 
                style={styles.textInput}
                placeholder={lang === 'amh' ? 'ለምሳሌ፡ ቦሌ ዝግጅት ት/ቤት' : 'e.g., Bole High School'}
                placeholderTextColor="#64748b"
                value={studentInfo.school}
                onChangeText={(text) => setStudentInfo({...studentInfo, school: text})}
              />
            </View>

            <Text style={styles.inputLabel}>{lang === 'amh' ? 'የጥናት መስክ' : 'Academic Stream'}</Text>
            <View style={styles.streamRow}>
              <TouchableOpacity 
                style={[styles.streamBox, studentInfo.fieldStream === 'Natural Science' && styles.streamBoxActive]}
                onPress={() => setStudentInfo({...studentInfo, fieldStream: 'Natural Science'})}
              >
                <Text style={[styles.streamBoxText, studentInfo.fieldStream === 'Natural Science' && styles.streamBoxTextActive]}>
                  🔬 {lang === 'amh' ? 'የተፈጥሮ ሳይንስ' : 'Natural Science'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.streamBox, studentInfo.fieldStream === 'Social Science' && styles.streamBoxActive]}
                onPress={() => setStudentInfo({...studentInfo, fieldStream: 'Social Science'})}
              >
                <Text style={[styles.streamBoxText, studentInfo.fieldStream === 'Social Science' && styles.streamBoxTextActive]}>
                  📚 {lang === 'amh' ? 'ማኅበራዊ ሳይንስ' : 'Social Science'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={() => {
                if (!studentInfo.name.trim() || !studentInfo.school.trim() || !studentInfo.phone.trim()) {
                  Alert.alert('Register Validation', 'Please complete Name, School and Phone number.');
                  return;
                }
                handleOnboardingComplete(studentInfo);
              }}
            >
              <Sparkles size={18} color="#0c0613" />
              <Text style={styles.submitButtonText}>
                {lang === 'amh' ? 'ወደ አካዳሚው ግባ' : 'Enter VIP Academy'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Registered App View
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ExpoStatusBar style="light" />
      <View style={styles.appHeader}>
        <View>
          <Text style={styles.appHeaderLogo}>🏛️ AKSUM VIP</Text>
          <Text style={styles.appHeaderSubtitle}>
            {studentInfo.name} ({studentInfo.fieldStream === 'Natural Science' ? '🔬 Natural' : '📚 Social'})
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.langToggleHeader}
          onPress={() => {
            const nextLang = lang === 'amh' ? 'eng' : 'amh';
            setLang(nextLang);
            saveStudentInfo({ ...studentInfo, preferredLanguage: nextLang });
          }}
        >
          <Languages size={16} color="#FFD700" />
          <Text style={styles.langToggleHeaderText}>{lang === 'amh' ? 'ENG' : 'አማ'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentBody}>
        {/* =============== TAB: DASHBOARD =============== */}
        {activeTab === 'dashboard' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Top Cards Greeting */}
            <View style={styles.dashboardHero}>
              <View style={styles.heroRow}>
                <View>
                  <Text style={styles.heroTitle}>
                    {lang === 'amh' ? `እንኳን ደህና መጣህ፣ ${studentInfo.name}! 😊` : `Welcome back, ${studentInfo.name}! 😊`}
                  </Text>
                  <Text style={styles.heroTarget}>
                    🎯 {lang === 'amh' ? 'መዳረሻ ዩኒቨርሲቲ፡ ' : 'Target University: '}{studentInfo.targetUniversity}
                  </Text>
                </View>

                <TouchableOpacity style={styles.shareBadge} onPress={handleShareStats}>
                  <TrendingUp size={16} color="#FFD700" />
                  <Text style={styles.shareBadgeText}>{lang === 'amh' ? 'አጋራ' : 'Share Stats'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{lang === 'amh' ? '🔥 የጥናት ቅደም ተከተል' : '🔥 Daily streak'}</Text>
                  <Text style={styles.statValue}>2 {lang === 'amh' ? 'ቀናት' : 'Days'}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{lang === 'amh' ? '⏱️ አጠቃላይ ጥናት' : '⏱️ Total Focused'}</Text>
                  <Text style={[styles.statValue, { color: '#00f0ff' }]}>{completedMinutes} {lang === 'amh' ? 'ደቂቃ' : 'Mins'}</Text>
                </View>
              </View>
            </View>

            {/* Pomodoro Focus Block */}
            <View style={styles.pomoCard}>
              <View style={styles.pomoHeader}>
                <View style={styles.pomoLeftInfo}>
                  <Clock size={16} color="#FFD750" />
                  <Text style={styles.pomoTitle}>
                    {focusMode === 'focus' 
                      ? (lang === 'amh' ? '📝 የትኩረት ጥናት ክፍለ ጊዜ' : '📝 Deep Focus Session') 
                      : (lang === 'amh' ? '☕ የአየር እረፍት ክፍለ ጊዜ' : '☕ Recharge Break Time')}
                  </Text>
                </View>
                <Text style={[styles.pomoBadge, focusMode === 'break' && styles.pomoBadgeBreak]}>
                  {focusMode.toUpperCase()}
                </Text>
              </View>

              {/* Progress Count representation */}
              <View style={styles.pomoTimerDisk}>
                <Text style={styles.timerTimerNumber}>
                  {Math.floor(pomodoroLeft / 60).toString().padStart(2, '0')}:
                  {(pomodoroLeft % 60).toString().padStart(2, '0')}
                </Text>
                <Text style={styles.timerModeDesc}>
                  {focusMode === 'focus' 
                    ? (lang === 'amh' ? 'ማትሪክ ለማጥፋት ትኩረትህን ጠብቅ!' : 'Maintain maximum cognitive resonance!')
                    : (lang === 'amh' ? 'ንጹህ አየር አስገባ!' : 'Step away and inhale deep breaths!')}
                </Text>
              </View>

              {/* Controls */}
              <View style={styles.pomoControlsGrid}>
                <TouchableOpacity 
                  style={[styles.pomoControlBtn, timerRunning ? styles.pomoPause : styles.pomoPlay]}
                  onPress={toggleTimer}
                >
                  <Text style={styles.pomoControlBtnText}>
                    {timerRunning ? (lang === 'amh' ? '⏸️ አቁም' : '⏸️ PAUSE') : (lang === 'amh' ? '▶️ ጀምር' : '▶️ FOCUSNOW')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.pomoControlBtn, styles.pomoReset]}
                  onPress={resetTimer}
                >
                  <Text style={styles.pomoControlBtnText}>🔄 {lang === 'amh' ? 'ከተው' : 'RESET'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rapid Subject Shortcut Selectors */}
            <Text style={styles.sectionHeading}>{lang === 'amh' ? '🏛️ ታዋቂ የትምህርት መስኮች' : '🏛️ ESSLCE Syllabus Subjects'}</Text>
            
            <View style={styles.subjectContainer}>
              {[
                { name: 'Mathematics', am: 'ሒሳብ', logo: '📐', color: '#ff7a00', desc: 'Algebra, sequences, integrals & vectors.' },
                { name: 'Physics', am: 'ፊዚክስ', logo: '⚡', color: '#00f0ff', desc: 'Electrostatics, projectile motion and forces.' },
                { name: 'Chemistry', am: 'ኬሚስትሪ', logo: '🧪', color: '#00ff66', desc: 'Equilibrium, rate equations, and compounds.' },
                { name: 'Biology', am: 'ባዮሎጂ', logo: '🧬', color: '#ec4899', desc: 'Respiration, genetics, and ecology.' }
              ].map((sub, sIdx) => (
                <TouchableOpacity 
                  key={sIdx} 
                  style={styles.subjectBox}
                  onPress={() => {
                    setSelectedSubject(sub.name);
                    const defaultUnit = curriculumUnits.find(u => u.subject === sub.name);
                    if (defaultUnit) setSelectedUnitId(defaultUnit.id);
                    setActiveTab('curriculum');
                  }}
                >
                  <View style={styles.subjBoxHeader}>
                    <Text style={styles.subjIcon}>{sub.logo}</Text>
                    <Text style={[styles.subjDot, { backgroundColor: sub.color }]} />
                  </View>
                  <Text style={styles.subjName}>{lang === 'amh' ? sub.am : sub.name}</Text>
                  <Text style={styles.subjDesc}>{sub.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* =============== TAB: CURRICULUM NOTES & MCQ PRACTICE =============== */}
        {activeTab === 'curriculum' && (
          <View style={styles.verticalSplit}>
            {/* Subject Selector Sidebar at top */}
            <View style={styles.subjectTopTabs}>
              {['Mathematics', 'Physics', 'Chemistry', 'Biology'].map((sub) => (
                <TouchableOpacity
                  key={sub}
                  style={[styles.subjectTabBtn, selectedSubject === sub && styles.subjectTabBtnActive]}
                  onPress={() => {
                    setSelectedSubject(sub);
                    const defaultUnit = curriculumUnits.find(u => u.subject === sub);
                    if (defaultUnit) {
                      setSelectedUnitId(defaultUnit.id);
                      setCurrentMCQIndex(0);
                      setRevealMCQAnswer(false);
                    }
                  }}
                >
                  <Text style={[styles.subjectTabBtnText, selectedSubject === sub && styles.subjectTabBtnTextActive]}>
                    {sub === 'Mathematics' && '📐'}
                    {sub === 'Physics' && '⚡'}
                    {sub === 'Chemistry' && '🧪'}
                    {sub === 'Biology' && '🧬'} {sub.substring(0, 4)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Main scroll unit content */}
            <ScrollView contentContainerStyle={styles.curriculumScrollContent}>
              {/* Unit Dropdown Menu List */}
              <Text style={styles.subHeadingLabel}>{lang === 'amh' ? 'ምዕራፍ ይምረጡ (Select Unit)' : 'Syllabus Chapters'}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitListHorizontal}>
                {filteredUnits.map((u) => (
                  <TouchableOpacity
                    key={u.id}
                    style={[styles.unitBubble, selectedUnitId === u.id && styles.unitBubbleActive]}
                    onPress={() => {
                      setSelectedUnitId(u.id);
                      setCurrentMCQIndex(0);
                      setRevealMCQAnswer(false);
                    }}
                  >
                    <Text style={[styles.unitBubbleText, selectedUnitId === u.id && styles.unitBubbleActiveText]}>
                      U {u.unitNumber}: {lang === 'amh' ? u.titleAmharic : u.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Study notes Slide Render */}
              <View style={styles.studyNotesCard}>
                <View style={styles.cardHeaderFlex}>
                  <Text style={styles.cardSectionTitle}>
                    <BookOpen size={16} color="#FFD700" /> {lang === 'amh' ? 'የክለሳ ማስታወሻ' : 'Syllabus Study Slide'}
                  </Text>

                  <View style={styles.fontControls}>
                    <TouchableOpacity onPress={() => setFontSize('sm')} style={[styles.fontBtn, fontSize === 'sm' && styles.fontBtnActive]}>
                      <Text style={styles.fontBtnText}>S</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFontSize('md')} style={[styles.fontBtn, fontSize === 'md' && styles.fontBtnActive]}>
                      <Text style={styles.fontBtnText}>M</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFontSize('lg')} style={[styles.fontBtn, fontSize === 'lg' && styles.fontBtnActive]}>
                      <Text style={styles.fontBtnText}>L</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Body Text */}
                <View style={[styles.studySlideTextContainer]}>
                  <Text style={[
                    styles.studyNotesBodyText, 
                    fontSize === 'sm' && { fontSize: 13 },
                    fontSize === 'lg' && { fontSize: 18 }
                  ]}>
                    {lang === 'amh' 
                      ? activeUnit.notesAmharic.replace(/\$\$([^\$]+)\$\$/g, '\n\n [Formula] $1 \n\n') 
                      : activeUnit.notes.replace(/\$\$([^\$]+)\$\$/g, '\n\n [Formula] $1 \n\n')
                    }
                  </Text>
                </View>

                {/* Sandbox formula widget trigger if available */}
                {activeUnit.keyFormulas && activeUnit.keyFormulas.length > 0 && (
                  <View style={styles.mobileFormulaInteractiveBanner}>
                    <Award size={16} color="#FFD700" />
                    <Text style={styles.mobileInteractiveText}>
                      {lang === 'amh' 
                        ? '💡 የዚህ ምዕራፍ ቀመሮች በ "Formulas" ዘርፍ በሲሙሌተር መፈተሽ ይችላሉ!' 
                        : '💡 Interactive sandbox simulation for this unit equations is live under the Formula deck! '}
                    </Text>
                  </View>
                )}
              </View>

              {/* Interactive MCQ Practice Section */}
              <View style={styles.practiceSectionHeader}>
                <Text style={styles.sectionHeading}>{lang === 'amh' ? '🧮 የብሔራዊ ፈተና ልምምድ' : '🧮 ESSLCE Practice Hub'}</Text>
                
                {/* Dynamically Generate Questions */}
                <TouchableOpacity 
                  style={styles.generateBtn} 
                  onPress={handleGenerateQuestions}
                  disabled={isGeneratingQuiz}
                >
                  <Sparkles size={14} color="#0c0613" />
                  <Text style={styles.generateBtnText}>
                    {isGeneratingQuiz ? (lang === 'amh' ? 'እየፈጠረ...' : 'Generating...') : (lang === 'amh' ? 'አዲስ ፈጠራ' : 'Synthesize MCQ')}
                  </Text>
                </TouchableOpacity>
              </View>

              {filteredQuizPool.length === 0 ? (
                <View style={styles.emptyQuizBox}>
                  <HelpCircle size={32} color="#475569" />
                  <Text style={styles.emptyQuizText}>
                    {lang === 'amh' ? 'ለዚህ ምዕራፍ ጥያቄዎች አልተመረጡም። "አዲስ ፈጠራ" በመጫን ፈጣን ጥያቄ ያዘጋጁ!' : 'No custom MCQs for this unit yet. Click Synthesize MCQ above!'}
                  </Text>
                </View>
              ) : (
                <View style={styles.mcqQuizCard}>
                  <View style={styles.mcqMeta}>
                    <Text style={styles.mcqMetaYear}>{filteredQuizPool[currentMCQIndex]?.year || 'ESSLCE'}</Text>
                    <Text style={styles.mcqMetaProgress}>{currentMCQIndex + 1} of {filteredQuizPool.length}</Text>
                  </View>

                  <Text style={styles.mcqQuestionText}>
                    {lang === 'amh' 
                      ? filteredQuizPool[currentMCQIndex]?.questionAmharic || filteredQuizPool[currentMCQIndex]?.question 
                      : filteredQuizPool[currentMCQIndex]?.question}
                  </Text>

                  {/* Options List */}
                  <View style={styles.optionsList}>
                    {(lang === 'amh' 
                      ? filteredQuizPool[currentMCQIndex]?.optionsAmharic || filteredQuizPool[currentMCQIndex]?.options 
                      : filteredQuizPool[currentMCQIndex]?.options).map((opt, oIdx) => {
                        const questionId = filteredQuizPool[currentMCQIndex].id;
                        const hasAnswered = answersState[questionId] !== undefined;
                        const isSelected = answersState[questionId]?.selected === oIdx;
                        const isCorrectOption = filteredQuizPool[currentMCQIndex].answerIndex === oIdx;

                        let styleToApply: any = styles.optionBtn;
                        let textStyleToApply: any = styles.optionBtnText;

                        if (hasAnswered) {
                          if (isCorrectOption) {
                            styleToApply = [styles.optionBtn, styles.optionCorrect];
                            textStyleToApply = [styles.optionBtnText, styles.optionTextActive];
                          } else if (isSelected && !isCorrectOption) {
                            styleToApply = [styles.optionBtn, styles.optionIncorrect];
                            textStyleToApply = [styles.optionBtnText, styles.optionTextActive];
                          } else {
                            styleToApply = [styles.optionBtn, styles.optionMuted];
                          }
                        }

                        return (
                          <TouchableOpacity
                            key={oIdx}
                            style={styleToApply}
                            disabled={hasAnswered}
                            onPress={() => handleSelectMCQOption(oIdx, filteredQuizPool[currentMCQIndex].answerIndex)}
                          >
                            <Text style={textStyleToApply}>{opt}</Text>
                          </TouchableOpacity>
                        );
                      })
                    }
                  </View>

                  {/* MCQ Explanations Area */}
                  {revealMCQAnswer && (
                    <View style={styles.explanationArea}>
                      <Text style={styles.explanationHeading}>📝 {lang === 'amh' ? 'አጭር ማብራሪያ (Explanation)' : 'Concept Elaboration'}</Text>
                      <Text style={styles.explanationBody}>
                        {lang === 'amh' 
                          ? filteredQuizPool[currentMCQIndex]?.explanationAmharic || filteredQuizPool[currentMCQIndex]?.explanation 
                          : filteredQuizPool[currentMCQIndex]?.explanation
                        }
                      </Text>
                    </View>
                  )}

                  {/* MCQ Navigation Footer Controls */}
                  <View style={styles.mcqNavFooter}>
                    <TouchableOpacity
                      style={[styles.mcqFooterBtn, currentMCQIndex === 0 && styles.mcqFooterBtnDisabled]}
                      disabled={currentMCQIndex === 0}
                      onPress={() => {
                        setCurrentMCQIndex(prev => prev - 1);
                        setRevealMCQAnswer(answersState[filteredQuizPool[currentMCQIndex - 1]?.id] !== undefined);
                      }}
                    >
                      <Text style={styles.mcqFooterBtnText}>◀ {lang === 'amh' ? 'ቀድሞ' : 'Prev'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.revealBtn}
                      onPress={() => setRevealMCQAnswer(!revealMCQAnswer)}
                    >
                      <Text style={styles.revealBtnText}>{revealMCQAnswer ? (lang === 'amh' ? 'ማብራሪያ ሰውር' : 'Hide explanation') : (lang === 'amh' ? 'ማብራሪያ አሳይ' : 'Reveal explanation')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.mcqFooterBtn, currentMCQIndex === filteredQuizPool.length - 1 && styles.mcqFooterBtnDisabled]}
                      disabled={currentMCQIndex === filteredQuizPool.length - 1}
                      onPress={() => {
                        setCurrentMCQIndex(prev => prev + 1);
                        setRevealMCQAnswer(answersState[filteredQuizPool[currentMCQIndex + 1]?.id] !== undefined);
                      }}
                    >
                      <Text style={styles.mcqFooterBtnText}>{lang === 'amh' ? 'ቀጣይ' : 'Next'} ▶</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* =============== TAB: AKSUM GPT PRO TUTOR COMPANION =============== */}
        {activeTab === 'aiTutor' && (
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            style={{ flex: 1 }}
          >
            <View style={styles.aiChatContainer}>
              {/* Top Banner details */}
              <View style={styles.aiTutorHeader}>
                <Cpu size={24} color="#FFD700" />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.tutorHeaderTitle}>🏛️ AKSUM GPT PRO</Text>
                  <Text style={styles.tutorHeaderDesc}>
                    {lang === 'amh' ? 'ፈጣን የማትሪክ ጥያቄ መፍቻ ጠቢብ ረዳት' : 'High-fidelity syllabus chat bot'}
                  </Text>
                </View>
              </View>

              {chatMessages.length === 0 ? (
                <View style={styles.emptyChatBody}>
                  <Sparkles size={36} color="#FFD700" style={{ marginBottom: 12 }} />
                  <Text style={styles.welcomeChatTitle}>
                    {lang === 'amh' ? `ሰላም ${studentInfo.name}! ጎበዝ 💪` : `Hello ${studentInfo.name}! Scholar 💪`}
                  </Text>
                  <Text style={styles.welcomeChatSubtext}>
                    {lang === 'amh'
                      ? 'እኔ ከታላቁ የአክሱም ማዕከል የተነሳሳሁ አዲሱ ረዳትህ ነኝ። ማንኛውንም የሒሳብ፣ ፊዚክስ፣ ወይም ኬሚስትሪ ጠንካራ ማትሪክ ጥያቄዎችን አሁኑኑ ጠይቀኝ።'
                      : 'I am your specialized ESSLCE tutor. Type any high-complexity prep question, and I will assist you immediately.'}
                  </Text>

                  {/* Simple prompt hints */}
                  <View style={styles.hintsGridMob}>
                    <TouchableOpacity 
                      style={styles.hintBoxMob}
                      onPress={() => {
                        setChatInput(lang === 'amh' ? 'በፊዚክስ Coulomb Law እና Inverse Square ህግን አስረዳልኝ' : 'Explain electrostatic Coulomb Law and Inverse-Square rule.');
                      }}
                    >
                      <Text style={styles.hintBoxMobText}>💡 Coulomb's Law</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.hintBoxMob}
                      onPress={() => {
                        setChatInput(lang === 'amh' ? 'የ 12ኛ ክፍል ሒሳብ ማትሪክ ለማለፍ ምርጥ 4 ስልቶች ምንድን ናቸው?' : 'What are top 4 study strategies for ESSLCE Grade 12 Math?');
                      }}
                    >
                      <Text style={styles.hintBoxMobText}>💡 Math Study strategies</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <ScrollView 
                  style={styles.chatScroll}
                  contentContainerStyle={{ paddingVertical: 12 }}
                >
                  {chatMessages.map(item => (
                    <View 
                      key={item.id} 
                      style={[
                        styles.chatBubbleContainer, 
                        item.sender === 'user' ? styles.bubbleUserAlign : styles.bubbleAiAlign
                      ]}
                    >
                      <View style={[
                        styles.chatBubble,
                        item.sender === 'user' ? styles.bubbleUserBg : styles.bubbleAiBg
                      ]}>
                        <Text style={styles.chatBubbleText}>{item.text}</Text>
                        <Text style={styles.chatBubbleTime}>{item.time}</Text>
                      </View>
                    </View>
                  ))}

                  {isAiTyping && (
                    <View style={[styles.chatBubbleContainer, styles.bubbleAiAlign]}>
                      <View style={[styles.chatBubble, styles.bubbleAiBg, { paddingVertical: 14 }]}>
                        <ActivityIndicator size="small" color="#FFD700" />
                        <Text style={styles.typingIndicator}>{lang === 'amh' ? 'አክሱም ጂፒቲ እያሰበ ነው...' : 'Aksumite CPU processing...'}</Text>
                      </View>
                    </View>
                  )}
                </ScrollView>
              )}

              {/* Chat Send Row */}
              <View style={styles.chatInputRow}>
                <TextInput 
                  style={styles.chatInputNode}
                  placeholder={lang === 'amh' ? 'ጥንታዊ ጠቢቡን ረዳት ጠይቅ...' : 'Consult Aksum GPT Pro...'}
                  placeholderTextColor="#64748b"
                  value={chatInput}
                  onChangeText={setChatInput}
                />
                <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendChatMessage}>
                  <Send size={18} color="#0c0613" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}

        {/* =============== TAB: FORMULAS DECK & SIMULATOR =============== */}
        {activeTab === 'formulas' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.formulasPageHeader}>
              <Text style={styles.sectionHeading}>{lang === 'amh' ? '📐 የቀመር ቋት (Syllabus Formulas)' : '📐 Syllabus Formula Deck'}</Text>
              <Text style={styles.sectionHeaderSubtitle}>
                {lang === 'amh' ? 'በብሔራዊ ማትሪክ ላይ የተደነገጉ ቀመሮች ከማብራሪያ ጋር' : 'Mathematical, physical & rate equations.'}
              </Text>
            </View>

            {/* Formula Search Bar */}
            <View style={styles.filterFormulasBar}>
              <View style={styles.searchBarContainer}>
                <Search size={16} color="#64748b" style={{ marginRight: 8 }} />
                <TextInput 
                  style={styles.searchBarInput}
                  placeholder={lang === 'amh' ? 'ቀመሮችን አሁኑኑ ፈልግ...' : 'Search formulas by topic or symbol...'}
                  placeholderTextColor="#64748b"
                  value={formulaSearch}
                  onChangeText={setFormulaSearch}
                />
              </View>

              {/* Subject Tabs Filter */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectTabsFilterScroll}>
                {['All', 'Mathematics', 'Physics', 'Chemistry'].map((subj) => (
                  <TouchableOpacity
                    key={subj}
                    style={[styles.smallFilterTab, formulaSubject === subj && styles.smallFilterTabActive]}
                    onPress={() => setFormulaSubject(subj as any)}
                  >
                    <Text style={[styles.smallFilterTabText, formulaSubject === subj && styles.smallFilterTabTextActive]}>
                      {subj}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Simulated Sandbox models details */}
            <Text style={styles.subHeadingLabel}>{lang === 'amh' ? '⚡ የቀመሮች ሰሌዳ' : '⚡ Interactive Sandbox Deck'}</Text>
            
            {filteredFormulas.map((fItem, fIdx) => (
              <View key={fItem.id} style={styles.formulaCardNode}>
                <View style={styles.formulaCardHeader}>
                  <Text style={styles.formulaCardSubject}>{fItem.subject.toUpperCase()}</Text>
                  <Text style={styles.formulaCardTopic}>{fItem.topic}</Text>
                </View>

                <Text style={styles.formulaCardName}>{fItem.name}</Text>
                
                <View style={styles.formulaDisplayNode}>
                  <Text style={styles.formulaTextString}>{cleanMathNotation(fItem.formula)}</Text>
                </View>

                {/* Variable Legends */}
                <View style={styles.legendWrapper}>
                  <Text style={styles.legendTitle}>📚 {lang === 'amh' ? 'የቀመር መፍቻ (Variable Explanations)' : 'Textbook Legends'}</Text>
                  <Text style={styles.legendText}>
                    {lang === 'amh' 
                      ? '• በኢትዮጵያ ማትሪክ ፈተና ላይ በመደበኛ ጥያቄዎች ላይ ከፍተኛ አስተዋጽኦ ያበረክታል::' 
                      : fItem.description}
                  </Text>
                </View>
              </View>
            ))}

            {filteredFormulas.length === 0 && (
              <View style={styles.emptyFormulasNode}>
                <HelpCircle size={32} color="#475569" />
                <Text style={styles.emptyFormulasNodeText}>
                  {lang === 'amh' ? 'ከፍለጋዎ ጋር የሚዛመድ ቀመር አልተገኘም። እባክዎ በሌላ ፊደል ይሞክሩ።' : 'No formulas match the query keyword. Clear search filters.'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* =============== TAB: UNIVERSITIES DATABASE =============== */}
        {activeTab === 'universities' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.uniPageHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionHeading}>{lang === 'amh' ? '🎓 የዩኒቨርሲቲዎች ማዕከል' : '🎓 Universities Catalog'}</Text>
                <Text style={styles.sectionHeaderSubtitle}>
                  {lang === 'amh' ? 'የኢትዮጵያ ቀዳሚ ጥናት ዩኒቨርሲቲዎችና ማለፊያ ገደቦች' : 'Prestige rankings, and cut-off scores.'}
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.addUniFloatingBtn}
                onPress={() => setUniversityModalVisible(true)}
              >
                <Plus size={16} color="#0c0613" />
                <Text style={styles.addUniFloatingBtnText}>{lang === 'amh' ? 'አክል' : 'Add custom'}</Text>
              </TouchableOpacity>
            </View>

            {/* List Universities Cards */}
            {universities.map((uni) => (
              <View key={uni.id} style={styles.uniCard}>
                <View style={styles.uniCardBadgeRow}>
                  <View style={styles.uniTierBadge}>
                    <Text style={styles.uniTierBadgeText}>{uni.tier}</Text>
                  </View>
                  <Text style={styles.uniRankText}>🏆 #{uni.nationalRank} National Rank</Text>
                </View>

                <Text style={styles.uniName}>{lang === 'amh' ? uni.amharicName : uni.name}</Text>
                
                <View style={styles.uniLocationRow}>
                  <MapPin size={12} color="#94a3b8" />
                  <Text style={styles.uniLocationText}>{uni.location} | Est. {uni.established}</Text>
                </View>

                <Text style={styles.uniDescription}>
                  {lang === 'amh' ? uni.amharicDescription : uni.description}
                </Text>

                {/* Admission Cuts stats */}
                <View style={styles.admissionStrip}>
                  <View style={styles.admissionBox}>
                    <Text style={styles.admissionLabel}>🔬 Natural Cut-Off</Text>
                    <Text style={styles.admissionValue}>{uni.admissionStats.naturalCutoff > 0 ? uni.admissionStats.naturalCutoff : 'None'}</Text>
                  </View>

                  <View style={styles.admissionBox}>
                    <Text style={styles.admissionLabel}>📚 Social Cut-Off</Text>
                    <Text style={styles.admissionValue}>{uni.admissionStats.socialCutoff > 0 ? uni.admissionStats.socialCutoff : 'None'}</Text>
                  </View>
                </View>

                {/* Famous alumni */}
                <Text style={styles.boldAlumniHeading}>🧬 Legacy Alumnis:</Text>
                <Text style={styles.alumniText}>{uni.notableAlumni.join(', ')}</Text>
              </View>
            ))}

            {/* ADD UNIVERSITY MODAL DESIGN */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={universityModalVisible}
              onRequestClose={() => setUniversityModalVisible(false)}
            >
              <View style={styles.modalBgContainer}>
                <View style={styles.modalBodyCard}>
                  <Text style={styles.modalHeadingTitle}>🏛️ New VIP Destination</Text>
                  
                  <ScrollView style={styles.modalScroll}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>University Name (English)</Text>
                      <TextInput 
                        style={styles.textInput}
                        placeholder="e.g. Hawassa University"
                        placeholderTextColor="#64748b"
                        value={newUniName}
                        onChangeText={setNewUniName}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>አማርኛ ስም (Amharic Name)</Text>
                      <TextInput 
                        style={styles.textInput}
                        placeholder="ለምሳሌ፡ ሐዋሳ ዩኒቨርሲቲ"
                        placeholderTextColor="#64748b"
                        value={newUniAmName}
                        onChangeText={setNewUniAmName}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Location & Address</Text>
                      <TextInput 
                        style={styles.textInput}
                        placeholder="e.g. Hawassa (Sidama)"
                        placeholderTextColor="#64748b"
                        value={newUniLocation}
                        onChangeText={setNewUniLocation}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Description Summary</Text>
                      <TextInput 
                        style={[styles.textInput, { height: 75, textAlignVertical: 'top' }]}
                        multiline
                        placeholder="Brief overview..."
                        placeholderTextColor="#64748b"
                        value={newUniDescription}
                        onChangeText={setNewUniDescription}
                      />
                    </View>

                    <View style={styles.admissionCutsRow}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.inputLabel}>Natural Cut-Off</Text>
                        <TextInput 
                          style={styles.textInput}
                          keyboardType="numeric"
                          value={newUniCutoffNatural}
                          onChangeText={setNewUniCutoffNatural}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.inputLabel}>Social Cut-Off</Text>
                        <TextInput 
                          style={styles.textInput}
                          keyboardType="numeric"
                          value={newUniCutoffSocial}
                          onChangeText={setNewUniCutoffSocial}
                        />
                      </View>
                    </View>
                  </ScrollView>

                  {/* Actions footer */}
                  <View style={styles.modalActionsGrid}>
                    <TouchableOpacity 
                      style={[styles.modalActionBtn, styles.modalClose]}
                      onPress={() => setUniversityModalVisible(false)}
                    >
                      <Text style={styles.modalCloseText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.modalActionBtn, styles.modalConfirm]}
                      onPress={handleAddUniversity}
                    >
                      <Text style={styles.modalConfirmText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </ScrollView>
        )}
      </View>

      {/* =============== ROOT CORE APP NAVIGATION TABS (Bottom Bar) =============== */}
      <View style={styles.appTabBar}>
        <TouchableOpacity 
          style={[styles.tabBtnNode, activeTab === 'dashboard' && styles.tabBtnNodeActive]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Clock size={18} color={activeTab === 'dashboard' ? '#FFD700' : '#8a8894'} />
          <Text style={[styles.tabBtnLabel, activeTab === 'dashboard' && styles.tabBtnLabelActive]}>
            {lang === 'amh' ? 'ሰሌዳ' : 'Pomo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtnNode, activeTab === 'curriculum' && styles.tabBtnNodeActive]}
          onPress={() => setActiveTab('curriculum')}
        >
          <BookOpen size={18} color={activeTab === 'curriculum' ? '#FFD700' : '#8a8894'} />
          <Text style={[styles.tabBtnLabel, activeTab === 'curriculum' && styles.tabBtnLabelActive]}>
            {lang === 'amh' ? 'ክለሳ' : 'Syllabus'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtnNode, activeTab === 'aiTutor' && styles.tabBtnNodeActive]}
          onPress={() => setActiveTab('aiTutor')}
        >
          <Cpu size={18} color={activeTab === 'aiTutor' ? '#FFD700' : '#8a8894'} />
          <Text style={[styles.tabBtnLabel, activeTab === 'aiTutor' && styles.tabBtnLabelActive]}>
            {lang === 'amh' ? 'ረቂቅ-AI' : 'AsmaraGPT'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtnNode, activeTab === 'formulas' && styles.tabBtnNodeActive]}
          onPress={() => setActiveTab('formulas')}
        >
          <Sliders size={18} color={activeTab === 'formulas' ? '#FFD700' : '#8a8894'} />
          <Text style={[styles.tabBtnLabel, activeTab === 'formulas' && styles.tabBtnLabelActive]}>
            {lang === 'amh' ? 'ቀመሮች' : 'Formulas'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtnNode, activeTab === 'universities' && styles.tabBtnNodeActive]}
          onPress={() => setActiveTab('universities')}
        >
          <GraduationCap size={18} color={activeTab === 'universities' ? '#FFD700' : '#8a8894'} />
          <Text style={[styles.tabBtnLabel, activeTab === 'universities' && styles.tabBtnLabelActive]}>
            {lang === 'amh' ? 'ከፍተኛ' : 'Unis'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Boilerplate views
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0c0613',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 15,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold'
  },
  safeContainer: {
    flex: 1,
    backgroundColor: '#0c0613',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  contentBody: {
    flex: 1,
    backgroundColor: '#0e0817'
  },

  // Onboarding screens
  onboardingContainer: {
    flex: 1,
    backgroundColor: '#0c0613'
  },
  onboardingScroll: {
    paddingBottom: 40
  },
  onboardingHeader: {
    alignItems: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 50 : 30
  },
  onboardingLogoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 20,
    marginBottom: 15
  },
  titleGradient: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1.5,
    marginBottom: 8,
    textAlign: 'center'
  },
  onboardingSubtext: {
    fontSize: 13,
    color: '#8a8894',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12
  },
  langOnboardingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1229',
    borderColor: '#FFD70033',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginTop: 18
  },
  langOnboardingText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold'
  },
  onboardingCard: {
    backgroundColor: '#150d22',
    borderColor: '#FFD7001a',
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 18,
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8a8894',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6
  },
  textInput: {
    backgroundColor: '#0c0613',
    borderColor: '#26193b',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#ffffff'
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  streamRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8
  },
  streamBox: {
    flex: 1,
    backgroundColor: '#1b1229',
    borderColor: '#26193b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center'
  },
  streamBoxActive: {
    borderColor: '#FFD700',
    backgroundColor: '#FFD70014'
  },
  streamBoxText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8a8894'
  },
  streamBoxTextActive: {
    color: '#FFD700'
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  submitButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0c0613'
  },

  // Main Header top strip
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0c0613',
    borderBottomWidth: 1,
    borderBottomColor: '#1b1229',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  appHeaderLogo: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 1
  },
  appHeaderSubtitle: {
    fontSize: 11,
    color: '#8a8894'
  },
  langToggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1229',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#FFD70022',
    borderRadius: 16
  },
  langToggleHeaderText: {
    marginLeft: 5,
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '900'
  },

  // Main navigation bottom tab bar
  appTabBar: {
    flexDirection: 'row',
    backgroundColor: '#0c0613',
    borderTopWidth: 1,
    borderTopColor: '#1b1229',
    paddingVertical: 10,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  tabBtnNode: {
    alignItems: 'center',
    opacity: 0.6
  },
  tabBtnNodeActive: {
    opacity: 1
  },
  tabBtnLabel: {
    fontSize: 10,
    color: '#8a8894',
    marginTop: 4,
    fontWeight: '600'
  },
  tabBtnLabelActive: {
    color: '#FFD700',
    fontWeight: 'bold'
  },

  // View: dashboard
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  dashboardHero: {
    backgroundColor: '#150d22',
    borderColor: '#FFD7001a',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  heroTarget: {
    fontSize: 12,
    color: '#a3a1b0',
    marginTop: 6
  },
  shareBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#26193b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderColor: '#FFD70022',
    borderWidth: 1
  },
  shareBadgeText: {
    marginLeft: 6,
    fontSize: 11,
    color: '#FFD700',
    fontWeight: 'bold'
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1b1229',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 10,
    color: '#8a8894',
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 4
  },

  pomoCard: {
    backgroundColor: '#170b2c',
    borderColor: '#ec489922',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20
  },
  pomoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  pomoLeftInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pomoTitle: {
    marginLeft: 6,
    fontSize: 13,
    color: '#ffffff',
    fontWeight: 'bold'
  },
  pomoBadge: {
    fontSize: 9,
    backgroundColor: '#ec489926',
    color: '#ec4899',
    fontWeight: '900',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8
  },
  pomoBadgeBreak: {
    backgroundColor: '#00ff661f',
    color: '#00ff66'
  },
  pomoTimerDisk: {
    alignItems: 'center',
    marginVertical: 14
  },
  timerTimerNumber: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2
  },
  timerModeDesc: {
    fontSize: 11,
    color: '#a3a1b0',
    textAlign: 'center',
    marginTop: 6
  },
  pomoControlsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6
  },
  pomoControlBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  pomoPlay: {
    backgroundColor: '#FFD700'
  },
  pomoPause: {
    backgroundColor: '#ec4899'
  },
  pomoReset: {
    backgroundColor: '#1b1229',
    borderColor: '#30263f',
    borderWidth: 1
  },
  pomoControlBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff'
  },

  sectionHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 0.5
  },
  subjectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  subjectBox: {
    width: (width - 42) / 2,
    backgroundColor: '#150d22',
    borderRadius: 16,
    padding: 14,
    borderColor: '#1f162e',
    borderWidth: 1
  },
  subjBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  subjIcon: {
    fontSize: 20
  },
  subjDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  subjName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  subjDesc: {
    fontSize: 10,
    color: '#8a8894',
    marginTop: 4,
    lineHeight: 14
  },

  // View: Curriculum with side tabs
  verticalSplit: {
    flex: 1
  },
  subjectTopTabs: {
    flexDirection: 'row',
    backgroundColor: '#0c0613',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1b1229',
    gap: 6
  },
  subjectTabBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#150d22',
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: '#1f162e',
    borderWidth: 1
  },
  subjectTabBtnActive: {
    backgroundColor: '#FFD70014',
    borderColor: '#FFD700'
  },
  subjectTabBtnText: {
    fontSize: 11,
    color: '#8a8894',
    fontWeight: 'bold'
  },
  subjectTabBtnTextActive: {
    color: '#FFD700'
  },
  curriculumScrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  subHeadingLabel: {
    fontSize: 11,
    color: '#8a8894',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8
  },
  unitListHorizontal: {
    marginBottom: 16,
    flexDirection: 'row'
  },
  unitBubble: {
    backgroundColor: '#150d22',
    borderWidth: 1,
    borderColor: '#1f162e',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8
  },
  unitBubbleActive: {
    borderColor: '#FFD700',
    backgroundColor: '#FFD70014'
  },
  unitBubbleText: {
    fontSize: 12,
    color: '#8a8894',
    fontWeight: 'bold'
  },
  unitBubbleActiveText: {
    color: '#FFD700'
  },
  studyNotesCard: {
    backgroundColor: '#150d22',
    borderRadius: 16,
    padding: 16,
    borderColor: '#1f162e',
    borderWidth: 1,
    marginBottom: 20
  },
  cardHeaderFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1f162e',
    paddingBottom: 10,
    marginBottom: 12
  },
  cardSectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  fontControls: {
    flexDirection: 'row',
    backgroundColor: '#0c0613',
    borderRadius: 8,
    padding: 2
  },
  fontBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fontBtnActive: {
    backgroundColor: '#FFD700'
  },
  fontBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8a8894'
  },
  studySlideTextContainer: {
    minHeight: 120
  },
  studyNotesBodyText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
    textAlign: 'justify'
  },
  mobileFormulaInteractiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1a14',
    borderColor: '#FFD70022',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginTop: 15
  },
  mobileInteractiveText: {
    marginLeft: 8,
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '600',
    flex: 1
  },

  practiceSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  generateBtnText: {
    marginLeft: 5,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0c0613'
  },
  emptyQuizBox: {
    padding: 24,
    backgroundColor: '#11091d',
    borderColor: '#1d122d',
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center'
  },
  emptyQuizText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18
  },
  mcqQuizCard: {
    backgroundColor: '#150d22',
    borderColor: '#1f162e',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16
  },
  mcqMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  mcqMetaYear: {
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#FFD700',
    backgroundColor: '#FFD7001f',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4
  },
  mcqMetaProgress: {
    fontSize: 11,
    color: '#8a8894',
    fontWeight: 'bold'
  },
  mcqQuestionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 20,
    marginBottom: 16
  },
  optionsList: {
    gap: 8,
    marginBottom: 16
  },
  optionBtn: {
    backgroundColor: '#0c0613',
    borderColor: '#1f162e',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14
  },
  optionCorrect: {
    backgroundColor: '#00ff6614',
    borderColor: '#00ff66'
  },
  optionIncorrect: {
    backgroundColor: '#ff3b301c',
    borderColor: '#ff3b30'
  },
  optionMuted: {
    opacity: 0.5
  },
  optionBtnText: {
    fontSize: 13,
    color: '#cbd5e1'
  },
  optionTextActive: {
    fontWeight: 'bold',
    color: '#ffffff'
  },
  explanationArea: {
    backgroundColor: '#1b1229',
    borderColor: '#30263f',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16
  },
  explanationHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 6
  },
  explanationBody: {
    fontSize: 12,
    color: '#a3a1b0',
    lineHeight: 18,
    textAlign: 'justify'
  },
  mcqNavFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  mcqFooterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1b1229'
  },
  mcqFooterBtnDisabled: {
    opacity: 0.3
  },
  mcqFooterBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  revealBtn: {
    paddingVertical: 8
  },
  revealBtnText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold'
  },

  // View: AI Tutor
  aiChatContainer: {
    flex: 1,
    backgroundColor: '#0e0817'
  },
  aiTutorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0c0613',
    borderBottomWidth: 1,
    borderBottomColor: '#1b1229'
  },
  tutorHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  tutorHeaderDesc: {
    fontSize: 11,
    color: '#8a8894'
  },
  emptyChatBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  welcomeChatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6
  },
  welcomeChatSubtext: {
    fontSize: 12,
    color: '#8a8894',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 16
  },
  hintsGridMob: {
    width: '100%',
    gap: 8
  },
  hintBoxMob: {
    backgroundColor: '#150d22',
    borderColor: '#26193b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    width: '100%',
    alignItems: 'center'
  },
  hintBoxMobText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600'
  },
  chatScroll: {
    flex: 1,
    paddingHorizontal: 16
  },
  chatBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '80%'
  },
  bubbleUserAlign: {
    alignSelf: 'flex-end'
  },
  bubbleAiAlign: {
    alignSelf: 'flex-start'
  },
  chatBubble: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  bubbleUserBg: {
    backgroundColor: '#FFD700',
    borderBottomRightRadius: 4
  },
  bubbleAiBg: {
    backgroundColor: '#150d22',
    borderColor: '#1f162e',
    borderWidth: 1,
    borderBottomLeftRadius: 4
  },
  chatBubbleText: {
    fontSize: 13,
    color: '#ffffff',
    lineHeight: 18
  },
  chatBubbleTime: {
    fontSize: 9,
    color: '#8a8894',
    alignSelf: 'flex-end',
    marginTop: 4
  },
  typingIndicator: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#8a8894',
    marginTop: 6
  },
  chatInputRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#0c0613',
    borderTopWidth: 1,
    borderTopColor: '#1b1229',
    alignItems: 'center'
  },
  chatInputNode: {
    flex: 1,
    backgroundColor: '#150d22',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    color: '#ffffff',
    fontSize: 13,
    marginRight: 8
  },
  chatSendBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },

  // View: Formulas Deck
  formulasPageHeader: {
    marginBottom: 16
  },
  sectionHeaderSubtitle: {
    fontSize: 11,
    color: '#8a8894',
    marginTop: 2
  },
  filterFormulasBar: {
    marginBottom: 16
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#150d22',
    borderColor: '#1f162e',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8
  },
  searchBarInput: {
    flex: 1,
    fontSize: 13,
    color: '#ffffff'
  },
  subjectTabsFilterScroll: {
    flexDirection: 'row'
  },
  smallFilterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#150d22',
    marginRight: 6
  },
  smallFilterTabActive: {
    backgroundColor: '#FFD7001f',
    borderColor: '#FFD700',
    borderWidth: 0.5
  },
  smallFilterTabText: {
    fontSize: 11,
    color: '#8a8894'
  },
  smallFilterTabTextActive: {
    color: '#FFD700',
    fontWeight: 'bold'
  },
  formulaCardNode: {
    backgroundColor: '#150d22',
    borderColor: '#1f162e',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  formulaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  formulaCardSubject: {
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#FFD700',
    backgroundColor: '#FFD70014',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    fontWeight: 'bold'
  },
  formulaCardTopic: {
    fontSize: 10,
    color: '#8a8894'
  },
  formulaCardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10
  },
  formulaDisplayNode: {
    backgroundColor: '#0c0613',
    borderColor: '#1b1229',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10
  },
  formulaTextString: {
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: 'bold',
    color: '#FFD700'
  },
  legendWrapper: {
    borderTopWidth: 0.5,
    borderTopColor: '#26193b',
    paddingTop: 8
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#a3a1b0',
    marginBottom: 3
  },
  legendText: {
    fontSize: 11,
    color: '#8a8894',
    lineHeight: 16
  },
  emptyFormulasNode: {
    marginVertical: 40,
    alignItems: 'center'
  },
  emptyFormulasNodeText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 24
  },

  // View: Universities Catalog list
  uniPageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  addUniFloatingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  addUniFloatingBtnText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0c0613'
  },
  uniCard: {
    backgroundColor: '#150d22',
    borderColor: '#1f162e',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16
  },
  uniCardBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  uniTierBadge: {
    backgroundColor: '#FFD70014',
    borderColor: '#FFD70033',
    borderWidth: 0.5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  uniTierBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFD700'
  },
  uniRankText: {
    fontSize: 11,
    color: '#a3a1b0',
    fontWeight: 'bold'
  },
  uniName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  uniLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10
  },
  uniLocationText: {
    marginLeft: 4,
    fontSize: 11,
    color: '#8a8894'
  },
  uniDescription: {
    fontSize: 12,
    color: '#a3a1b0',
    lineHeight: 17,
    textAlign: 'justify',
    marginBottom: 12
  },
  admissionStrip: {
    flexDirection: 'row',
    backgroundColor: '#0c0613',
    borderRadius: 12,
    padding: 10,
    gap: 8,
    marginBottom: 12
  },
  admissionBox: {
    flex: 1,
    alignItems: 'center'
  },
  admissionLabel: {
    fontSize: 9,
    color: '#8a8894'
  },
  admissionValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 2
  },
  boldAlumniHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 3
  },
  alumniText: {
    fontSize: 11,
    color: '#8a8894',
    lineHeight: 15
  },

  // Modal styling (Add custom university)
  modalBgContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 16
  },
  modalBodyCard: {
    backgroundColor: '#150d22',
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
    borderColor: '#FFD70022',
    borderWidth: 1
  },
  modalHeadingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center'
  },
  modalScroll: {
    marginBottom: 16
  },
  admissionCutsRow: {
    flexDirection: 'row'
  },
  modalActionsGrid: {
    flexDirection: 'row',
    gap: 10
  },
  modalActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  modalClose: {
    backgroundColor: '#1b1229',
    borderColor: '#30263f',
    borderWidth: 1
  },
  modalCloseText: {
    color: '#cbd5e1',
    fontWeight: 'bold'
  },
  modalConfirm: {
    backgroundColor: '#FFD700'
  },
  modalConfirmText: {
    color: '#0c0613',
    fontWeight: 'bold'
  }
});
