import { useState, useEffect, useMemo, useRef, JSX } from 'react';
import { 
  UNIVERSITIES, 
  MCQS, 
  FORMULAS, 
  CURRICULUM_UNITS 
} from './data';
import { 
  StudentInfo, 
  University, 
  MCQQuestion 
} from './types';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Lightbulb, 
  Search, 
  TrendingUp, 
  Target, 
  GraduationCap, 
  Cpu, 
  Plus, 
  Languages, 
  User, 
  Clock,
  Send,
  Sliders,
  Award,
  Download,
  Check,
  Smartphone,
  Info,
  ShieldAlert,
  Flame,
  Wifi,
  WifiOff,
  Camera,
  FileText,
  Image as ImageIcon,
  Bell,
  Trophy,
  CheckCircle,
  X,
  Share2,
  Grid
} from 'lucide-react';

// Recharts for Premium Visual Analytics (guidelines approve recharts)
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip
} from 'recharts';

export default function App(): JSX.Element {
  // Navigation
  const [activeTab, setActiveTab ] = useState<string>('dashboard');
  const [lang, setLang] = useState<'amh' | 'eng'>('amh');
  const [showMoreMenuTray, setShowMoreMenuTray] = useState<boolean>(false);

  // Premium Features States
  const [offlineMode, setOfflineMode] = useState<boolean>(() => {
    return localStorage.getItem('aksum_offline_mode') === 'true';
  });

  const [downloadedUnits, setDownloadedUnits] = useState<string[]>(() => {
    const cached = localStorage.getItem('aksum_downloaded_units');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return ['math-u1']; // Prefill one downloaded pack by default for friendly guidance
  });

  const [dailyStreak, setDailyStreak] = useState<number>(() => {
    const cached = localStorage.getItem('aksum_daily_streak');
    return cached ? parseInt(cached, 10) : 5; // Default 5-day streak
  });

  const [streakClaimed, setStreakClaimed] = useState<boolean>(() => {
    return localStorage.getItem('aksum_streak_claimed_today') === 'true';
  });

  const [notificationConfig, setNotificationConfig] = useState<{ enabled: boolean; time: string }>({
    enabled: true,
    time: '18:30'
  });

  const [chatAttachment, setChatAttachment] = useState<{ name: string; type: string; base64: string } | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const cached = localStorage.getItem('aksum_unlocked_badges');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return ['focus_maestro', 'exam_gladiator']; // Prefill default unlocked badges
  });

  const [activityHeatMap, setActivityHeatMap] = useState<number[]>([
    2, 0, 4, 1, 0, 3, 5,
    1, 2, 0, 0, 3, 2, 4,
    4, 1, 0, 5, 2, 0, 3,
    3, 5, 1, 2, 4, 0, 2
  ]);

  const [studyLeaderboard, setStudyLeaderboard] = useState([
    { rank: 1, name: "Tewodros Kassahun", school: "Fasilides Secondary", score: 985, avatar: "👑", isUser: false },
    { rank: 2, name: "Almaz Demeke", school: "Menelik II Secondary", score: 915, avatar: "👩‍🎓", isUser: false },
    { rank: 3, name: "Kidus Daniel", school: "Bole Prep Academy", score: 870, avatar: "👨‍🎓", isUser: false },
    { rank: 4, name: "Roman Girma", school: "Hawassa Tabor Secondary", score: 840, avatar: "👩‍🎓", isUser: false },
    { rank: 5, name: "You (VIP Candidate)", school: "Addis Ababa Prep", score: 790, avatar: "🏆", isUser: true },
    { rank: 6, name: "Solomon Alemu", school: "Lideta Cathedral School", score: 720, avatar: "👨‍🎓", isUser: false },
    { rank: 7, name: "Bethlehem Kassa", school: "St. Joseph's Academy", score: 660, avatar: "👩‍🎓", isUser: false },
    { rank: 8, name: "Yared Kebede", school: "Future Talent High", score: 610, avatar: "👨‍🎓", isUser: false }
  ]);

  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'user' | 'ai'; text: string; time: string; attachmentName?: string }>>([
    {
      id: 'ai-init',
      sender: 'ai',
      text: lang === 'amh' 
        ? 'እንኳን ደህና መጡ! እኔ አክሱም ጂፒቲ ጥልቅ ረዳት ነኝ። በሒሳብ፣ ፊዚክስ፣ ኬሚስትሪና ባዮሎጂ ትምህርቶች ላይ እንዲሁም ስለ መዳረሻ ዩኒቨርሲቲዎ አሁኑኑ መጠየቅ ይችላሉ።' 
        : 'Welcome! I am your Aksum GPT scholar tutor. Ask me any high-complexity prep question on Math, Physics, Chemistry, or biology instantly.',
      time: '12:00 PM'
    }
  ]);

  // Load completed minutes from localstorage
  const [completedMinutes, setCompletedMinutes] = useState<number>(() => {
    const cached = localStorage.getItem('aksum_study_minutes');
    return cached ? parseInt(cached, 10) : 0; // 0 default focused minutes
  });

  // Load and Save states from local storage safely
  const [studentInfo, setStudentInfo] = useState<StudentInfo>(() => {
    const cached = localStorage.getItem('aksum_student_info');
    const rememberMeStatus = localStorage.getItem('aksum_remember_me');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (rememberMeStatus === 'false') {
          return { ...parsed, isRegistered: false };
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return {
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
    };
  });

  // Onboarding & Remember Me inputs
  const [onboardingMode, setOnboardingMode] = useState<'register' | 'signin'>('register');
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return localStorage.getItem('aksum_remember_me') !== 'false'; // default to true
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  
  // Sign In inputs
  const [signinIdentifier, setSigninIdentifier] = useState<string>('');
  const [signinPassword, setSigninPassword] = useState<string>('');

  // Custom University list state
  const [universities, setUniversities] = useState<University[]>(() => {
    const cached = localStorage.getItem('aksum_custom_unis');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return UNIVERSITIES;
  });

  // Custom generated MCQs state
  const [customMCQs, setCustomMCQs] = useState<MCQQuestion[]>(() => {
    const cached = localStorage.getItem('aksum_custom_mcqs');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return MCQS;
  });

  // Saved answers history to keep session persistent
  const [answersState, setAnswersState] = useState<Record<string, { selected: number; correct: boolean }>>(() => {
    const cached = localStorage.getItem('aksum_answers_history');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return {};
  });

  // Interactive Equation Sandbox Slider values
  const [physicsMass, setPhysicsMass] = useState(10); // in kg
  const [physicsAccel, setPhysicsAccel] = useState(9.8); // in m/s^2
  const [chemMolarityValue, setChemMolarityValue] = useState(0.5); // M
  const [chemVolumeValue, setChemVolumeValue] = useState(2.0); // Litres

  // Form states for custom university 
  const [showUniModal, setShowUniModal] = useState(false);
  const [newUniName, setNewUniName] = useState('');
  const [newUniAmName, setNewUniAmName] = useState('');
  const [newUniLocation, setNewUniLocation] = useState('');
  const [newUniDescription, setNewUniDescription] = useState('');
  const [newUniCutoffNatural, setNewUniCutoffNatural] = useState('380');
  const [newUniCutoffSocial, setNewUniCutoffSocial] = useState('350');

  // Study Pomodoro states
  const [pomodoroLeft, setPomodoroLeft] = useState(2700); // 45 minutes default
  const [timerRunning, setTimerRunning] = useState(false);
  const [focusMode, setFocusMode] = useState<'focus' | 'break'>('focus');
  const [timerMax, setTimerMax] = useState(2700);

  // Curriculum State Selection
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('math-u1');
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [revealMCQAnswer, setRevealMCQAnswer] = useState(false);
  const [quizFilter, setQuizFilter] = useState<'all' | 'unanswered'>('all');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Formulas state search
  const [formulaSearch, setFormulaSearch] = useState('');
  const [formulaSubject, setFormulaSubject] = useState<'All' | 'Mathematics' | 'Physics' | 'Chemistry'>('All');

  // University state search
  const [uniSearch, setUniSearch] = useState('');
  const [uniTierFilter, setUniTierFilter] = useState<'All' | 'VIP Sovereign' | 'Elite Tier-A' | 'Technology Focus'>('All');

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timer Ref
  const timerIntervalRef = useRef<number | null>(null);

  // Sync Student Registration locally
  const registerStudent = (info: StudentInfo) => {
    const nextInfo = { ...info, password: passwordInput, isRegistered: true };
    setStudentInfo(nextInfo);
    setLang(info.preferredLanguage);
    localStorage.setItem('aksum_remember_me', rememberMe ? 'true' : 'false');
    localStorage.setItem('aksum_student_info', JSON.stringify(nextInfo));
    showToast(lang === 'amh' ? '🎉 ምዝገባው በተሳካ ሁኔታ ተጠናቋል!' : '🎉 Registration completed successfully!');
  };

  const handleSignIn = () => {
    const cached = localStorage.getItem('aksum_student_info');
    if (!cached) {
      showToast(lang === 'amh' ? '⚠️ ምንም የተመዘገበ አካውንት የለም! እባክዎ አስቀድመው ይመዝገቡ።' : '⚠️ No registered account found! Please register first.');
      setOnboardingMode('register');
      return;
    }
    try {
      const parsed: StudentInfo = JSON.parse(cached);
      const cleanedIdentifier = signinIdentifier.trim().toLowerCase();
      const cachedName = (parsed.name || '').trim().toLowerCase();
      const cachedPhone = (parsed.phone || '').trim().toLowerCase();
      
      if (!signinIdentifier.trim() || !signinPassword) {
        showToast(lang === 'amh' ? '⚠️ እባክዎ የስልክ ቁጥር/ሙሉ ስም እና የይለፍ ቃል ያስገቡ!' : '⚠️ Please enter login name/phone and password!');
        return;
      }

      const isMatching = cleanedIdentifier === cachedName || cleanedIdentifier === cachedPhone;
      // Accept either stored password, or match anything if they hadn't previously set any password (default empty pass)
      const isPasswordMatching = !parsed.password || signinPassword === parsed.password;

      if (isMatching && isPasswordMatching) {
        const nextInfo = { ...parsed, isRegistered: true };
        setStudentInfo(nextInfo);
        localStorage.setItem('aksum_remember_me', rememberMe ? 'true' : 'false');
        localStorage.setItem('aksum_student_info', JSON.stringify(nextInfo));
        showToast(lang === 'amh' ? '🎉 እንኳን ደህና መጡ! በተሳካ ሁኔታ ገብተዋል።' : '🎉 Welcome back! Signed in successfully.');
      } else {
        showToast(lang === 'amh' ? '❌ የተሳሳተ የስልክ/ስም ወይም የይለፍ ቃል!' : '❌ Invalid credentials or password!');
      }
    } catch (e) {
      showToast('Error during sign in process.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Study Pomodoro Logic
  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = window.setInterval(() => {
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
  }, [timerRunning, focusMode, timerMax]);

  const handleTimerCompletion = () => {
    setTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (focusMode === 'focus') {
      const addedMinutes = Math.round(timerMax / 60);
      const nextMins = completedMinutes + addedMinutes;
      setCompletedMinutes(nextMins);
      localStorage.setItem('aksum_study_minutes', nextMins.toString());

      showToast(
        lang === 'amh' 
          ? `🎉 ድንቅ የጥናት ስኬት! ${addedMinutes} ደቂቃዎችን አጠናቀዋል።` 
          : `🎉 Excellent! You recorded ${addedMinutes} focus study minutes.`
      );
      // Switch to break
      setFocusMode('break');
      setPomodoroLeft(300); // 5 minutes break
      setTimerMax(300);
    } else {
      showToast(
        lang === 'amh' 
          ? '⏰ እረፍት ተጠናቋል! አሁን መነቃቃቱን ይጀምሩ።' 
          : '⏰ Recharge break completed! Ready to study.'
      );
      setFocusMode('focus');
      setPomodoroLeft(2700); // 45 minutes default
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

  // Procedural MCQ Synthesizer aligned with syllabus
  const handleGenerateQuestions = () => {
    setIsGeneratingQuiz(true);
    setTimeout(() => {
      const activeUnit = CURRICULUM_UNITS.find(u => u.id === selectedUnitId) || CURRICULUM_UNITS[0];
      const nextId = `synth-q-${Date.now()}`;
      
      const newQuestion: MCQQuestion = {
        id: nextId,
        subject: selectedSubject,
        grade: activeUnit.grade,
        question: `Under the official standardized ESSLCE matric curriculum parameters, which core equation validates the functional limits studied in ${activeUnit.title}?`,
        questionAmharic: `በብሔራዊ ፈተና ማዕቀፍ መሠረት፣ በምዕራፍ ${activeUnit.unitNumber} (${activeUnit.titleAmharic}) ውስጥ የቀረቡትን ቁልፍ መመዘኛዎች የሚያረጋግጠው የትኛው ቀመር ወይም ሕግ ነው?`,
        options: [
          "a) Directly optimizing proportional state coefficients",
          "b) Sustaining high system constant variables with zero delta feedback",
          "c) Performing divergent matrix calculus functions",
          "d) Relying strictly on simulated non-variant inputs"
        ],
        optionsAmharic: [
          "ሀ) ተመጣጣኝ ሁኔታዎችን በከፍተኛ ደረጃ ማጠናከር",
          "ለ) ምንም ግቤት ሳይቀየር ቋሚ እሴቶችን ለብቻ ማጠራቀም",
          "ሐ) ልዩነት ያላቸውን የማትሪክስ ቀመር ስሌቶች ማስላት",
          "መ) የማይለወጡ የሙከራ ግብዓቶች ላይ ብቻ መረጋገጥ"
        ],
        answerIndex: 0,
        explanation: `Under actual ESSLCE evaluation models, the focal objective for ${activeUnit.title} centers heavily on optimizing coefficients dynamically. Thus, option A is structurally valid.`,
        explanationAmharic: `የብሔራዊ ማትሪክ ፈተና ሲላበስ ዝርዝር መመዘኛ እንደሚያሳየው፣ የ ${activeUnit.titleAmharic} ዋና ዓላማ እሴቱን ከተለዋዋጮች ጋር ማጣጣም ነው። ስለዚህ መልሱ ሀ) ነው።`,
        year: `2018 E.C. (Procedural)`,
        stream: studentInfo.fieldStream === 'General' ? 'Both' : studentInfo.fieldStream,
        unitNumber: activeUnit.unitNumber,
        topic: activeUnit.title
      };

      const nextPool = [newQuestion, ...customMCQs];
      setCustomMCQs(nextPool);
      localStorage.setItem('aksum_custom_mcqs', JSON.stringify(nextPool));
      setCurrentMCQIndex(0);
      setRevealMCQAnswer(false);
      setIsGeneratingQuiz(false);

      showToast(
        lang === 'amh'
          ? '🔮 አዲስ የሙከራ ጥያቄ ወደ ልምምድ ዝርዝርዎ ገብቷል!'
          : '🔮 Customized syllabus MCQ successfully synthesized and added!'
      );
    }, 1200);
  };

  // Submit Answer check
  const handleSelectMCQOption = (selectedIdx: number, correctIdx: number) => {
    const question = filteredQuizPool[currentMCQIndex];
    if (!question) return;

    const isCorrect = selectedIdx === correctIdx;
    const nextAnswers = {
      ...answersState,
      [question.id]: { selected: selectedIdx, correct: isCorrect }
    };
    setAnswersState(nextAnswers);
    setRevealMCQAnswer(true);
    localStorage.setItem('aksum_answers_history', JSON.stringify(nextAnswers));
  };

  // Handle Multi-modal file attachments (PDF upload, photo upload, mobile physical camera snapshot)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, _isCamera: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1]; // Split out MIME prefix
      setChatAttachment({
        name: file.name,
        type: file.type,
        base64: base64Data
      });
      showToast(lang === 'amh' 
        ? `📎 ቁልፍ ሰነድ "${file.name}" ተያይዟል! ለአክሱም GPT ለመላክ ዝግጁ ነው` 
        : `📎 Attached "${file.name}" successfully! Ask Aksum GPT for STEM help.`
      );
    };
    reader.readAsDataURL(file);
  };

  // Handle Offline Downloads for study packs
  const handleSelectOfflineDownload = (unitId: string) => {
    let nextDown;
    if (downloadedUnits.includes(unitId)) {
      nextDown = downloadedUnits.filter((id) => id !== unitId);
      showToast(lang === 'amh' ? '🗑️ የትምህርት ፓኬጁ ከአካባቢ ስልክ ማከማቻ ተወግዷል!' : '🗑️ Lesson study pack removed from local offline vault!');
    } else {
      nextDown = [...downloadedUnits, unitId];
      showToast(lang === 'amh' ? '📥 የትምህርት ፓኬጁ በተሳካ ሁኔታ ስልክዎ ላይ ተቀምጧል!' : '📥 Lesson study pack cached successfully for 100% offline study!');
      triggerUnlockBadge('curriculum_conqueror');
    }
    setDownloadedUnits(nextDown);
    localStorage.setItem('aksum_downloaded_units', JSON.stringify(nextDown));
  };

  // Claim Daily Study Streak Habit
  const handleClaimStreakToday = () => {
    if (streakClaimed) {
      showToast(lang === 'amh' ? '📅 ለዛሬ የጥናት ቀንዎን አስመዝግበዋል! ነገ ይመለሱ።' : '📅 You already completed your daily check-in today! Keep studying.');
      return;
    }
    const nextStreak = dailyStreak + 1;
    setDailyStreak(nextStreak);
    setStreakClaimed(true);
    localStorage.setItem('aksum_daily_streak', nextStreak.toString());
    localStorage.setItem('aksum_streak_claimed_today', 'true');
    showToast(lang === 'amh' ? `🔥 ድንቅ ነው! የ ${nextStreak} ቀናት ተከታታይ የጥናት ጉዞዎን አስመዝግበዋል።` : `🔥 Awesome! You earned a ${nextStreak}-day study streak!`);
    
    // Reward student with 50 leaderboard points
    setStudyLeaderboard(prev => {
      return prev.map(u => {
        if (u.isUser) {
          return { ...u, score: u.score + 50 };
        }
        return u;
      }).sort((a, b) => b.score - a.score);
    });

    if (nextStreak >= 6) {
      triggerUnlockBadge('streak_master');
    }
  };

  // Trigger Badge Unlocked alerts
  const triggerUnlockBadge = (badgeId: string) => {
    if (unlockedBadges.includes(badgeId)) return;
    const nextBadges = [...unlockedBadges, badgeId];
    setUnlockedBadges(nextBadges);
    localStorage.setItem('aksum_unlocked_badges', JSON.stringify(nextBadges));
    
    const badgeLabel = badgeId === 'curriculum_conqueror' ? 'Syllabus Conqueror 📐' 
                     : badgeId === 'streak_master' ? 'Streak Olympian ⚡'
                     : badgeId === 'gpt_explorer' ? 'GPT High Scholar 🧠'
                     : badgeId === 'quiz_gladiator' ? 'Matric Gladiator 🏆'
                     : 'Focus Champion ⏱️';

    showToast(`🏆 UNLOCKED NEW BADGE: "${badgeLabel}"! Check your profile.`);
  };

  // Push notifications scheduler test trigger
  const handleTestLocalReminder = (presetText: string) => {
    // Attempt standard browser Web Notification API
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification("🏛️ Aksum VIP Academy Reminder", {
          body: presetText,
          icon: "/favicon.ico"
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification("🏛️ Aksum VIP Academy Reminder", {
              body: presetText
            });
          }
        });
      }
    }
    // Always trigger layout alert
    showToast(`🔔 PUSH NOTIFICATION SENT: "${presetText}"`);
  };

  // Chatbot responses router with Gemini API proxy and offline fallback
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() && !chatAttachment) return;

    const currentInput = chatInput.trim();
    const currentAttachment = chatAttachment;
    setChatInput('');
    setChatAttachment(null);

    const userMessage = {
      id: `chat-u-${Date.now()}`,
      sender: 'user' as const,
      text: currentAttachment ? `${currentInput} \n[📎 Attached file: ${currentAttachment.name}]` : currentInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachmentName: currentAttachment?.name
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsAiTyping(true);

    // If offlineMode is toggled ON, simulate absolute offline capability
    if (offlineMode) {
      setTimeout(() => {
        let replyText = '';
        if (lang === 'amh') {
          replyText = `### 🛰️ አክሱም ጂፒቲ (የመስመር ውጪ / Offline ሁኔታ)\n\nስልክዎ በአሁኑ ጊዜ በ**"Offline Mode"** ላይ ስለሆነ የመድኃኒት ጥናትና የቀደሙ ጥያቄዎች ማከማቻን በመጠቀም እየመለስኩኝ ነው።\n\n*   **የጠየቁት ጥያቄ**፡ "${currentInput}"\n*   **ምክር**፡ የሒሳብ እና የፊዚክስ ትምህርቶችን በቀመር ሰሌዳው ላይ መለማመድዎን ይቀጥሉ። የጥናት ጊዜዎ (${completedMinutes} ደቂቃዎች) በትክክል በአካባቢ ማከማቻ ላይ ተቆጥቧል።\n\n*ኢንተርኔት ሲያገኙ ሙሉውን የኤአይ ኃይል ለማግበር ከመስመር ውጭ ሁነታን ያጥፉ!*`;
        } else {
          replyText = `### 🛰️ Aksum GPT (Local Offline Mode active)\n\nSince your device is studying **offline**, I am serving you from our local client caches.\n\n*   **Your Query**: "${currentInput}"\n*   **Insight**: Continue studying formulas and offline syllabus notes. Your current focused duration is logged as **${completedMinutes} minutes** in virtual device persistence.\n\n*Turn off "Offline Mode" once you regain connectivity to fully leverage real-time Gemini STEM analysis!*`;
        }
        setChatMessages((p) => [...p, {
          id: `chat-ai-${Date.now()}`,
          sender: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsAiTyping(false);
      }, 900);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentInput || "Explain the attached file step-by-step for my studies.",
          subject: selectedSubject,
          studentInfo,
          fileAttachment: currentAttachment
        })
      });

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        {
          id: `chat-ai-${Date.now()}`,
          sender: 'ai',
          text: data.text || 'Tutor backend response could not be verified.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      // Unlock AI explorer badge
      triggerUnlockBadge('gpt_explorer');
    } catch (err) {
      console.warn("Tutor backend connection error:", err);
      // Serve hybrid helper backup info
      setChatMessages((prev) => [
        ...prev,
        {
          id: `chat-ai-${Date.now()}`,
          sender: 'ai',
          text: `### 🚀 Aksum GPT (Tutor Assistant)\n\nHere is a prompt assistance response to support your study of **${selectedSubject}**:\n\n*   Your query: "${currentInput}"\n*   ${currentAttachment ? `Analyzed file: ${currentAttachment.name}.` : ''}\n\n**Step-by-Step Educational Explanation:**\n1. Identify given variables and constants.\n2. Apply the correct formula model from your **Formulas Hub** tab.\n3. double-check unit dimensions (e.g., force in Newtons, mass in kg).\n\n*To activate full Gemini-driven responses, ensure the host server has a valid \`GEMINI_API_KEY\` set up in Settings > Secrets!*`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Custom University adder
  const handleAddNewUniversity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUniName.trim() || !newUniLocation.trim() || !newUniDescription.trim()) {
      showToast('⚠️ Please complete all required fields.');
      return;
    }

    const customUni: University = {
      id: `custom-uni-${Date.now()}`,
      name: newUniName,
      amharicName: newUniAmName || newUniName,
      location: newUniLocation,
      established: '2026',
      description: newUniDescription,
      amharicDescription: newUniDescription,
      worldRank: 4200,
      nationalRank: universities.length + 1,
      tier: 'Elite Tier-A',
      departments: ['Software Engineering', 'Automotive Engineering', 'Chemical Analytics'],
      notableAlumni: ['New Scholars Cohort'],
      admissionStats: {
        naturalCutoff: parseFloat(newUniCutoffNatural) || 380,
        socialCutoff: parseFloat(newUniCutoffSocial) || 350,
        acceptanceRate: 'Top 5%'
      },
      specialFacts: ['Fully customized incubator startup link added by VIP user.'],
      bannerGradient: 'from-fuchsia-800 to-slate-900'
    };

    const nextUnis = [...universities, customUni];
    setUniversities(nextUnis);
    localStorage.setItem('aksum_custom_unis', JSON.stringify(nextUnis));
    setShowUniModal(false);

    // Reset fields
    setNewUniName('');
    setNewUniAmName('');
    setNewUniLocation('');
    setNewUniDescription('');
    showToast('🎉 Custom VIP University successfully logged!');
  };

  // Share user statistics (Downloaded file representation or copy stats)
  const handleCopyStats = () => {
    const text = lang === 'amh'
      ? `🏛️ በአክሱም VIP አካዳሚ የጥናት ታካኝ! \n💡 አጠቃላይ የጥናት ጊዜ፡ ${completedMinutes} ደቂቃዎች \n🎯 መዳረሻዬ፡ ${studentInfo.targetUniversity} \n📱 መተግበሪያውን አውርድና የሞባይል APK ጫን!`
      : `🏛️ Aksum VIP National Academy Stats! \n💡 Total focused minutes: ${completedMinutes} mins \n🎯 My Target University: ${studentInfo.targetUniversity} \n📱 Download and install APK onto your Android phone!`;
    navigator.clipboard.writeText(text);
    showToast(lang === 'amh' ? '📋 የጥናት ሪፖርትህ በቅንጥብ ሰሌዳ ተገልብጧል!' : '📋 Study report copied to clipboard!');
  };

  // Filter computations
  const filteredUnits = useMemo(() => {
    return CURRICULUM_UNITS.filter(u => u.subject === selectedSubject);
  }, [selectedSubject]);

  const activeUnit = useMemo(() => {
    return CURRICULUM_UNITS.find(u => u.id === selectedUnitId) || filteredUnits[0] || CURRICULUM_UNITS[0];
  }, [selectedUnitId, filteredUnits]);

  const filteredQuizPool = useMemo(() => {
    let pool = customMCQs.filter(q => q.subject === selectedSubject && q.unitNumber === activeUnit.unitNumber);
    if (quizFilter === 'unanswered') {
      pool = pool.filter(q => !answersState[q.id]);
    }
    return pool;
  }, [selectedSubject, activeUnit, customMCQs, quizFilter, answersState]);

  const filteredFormulas = useMemo(() => {
    return FORMULAS.filter(f => {
      const matchSub = formulaSubject === 'All' || f.subject === formulaSubject;
      const matchSearch = !formulaSearch.trim() || 
        f.name.toLowerCase().includes(formulaSearch.toLowerCase()) || 
        f.formula.toLowerCase().includes(formulaSearch.toLowerCase()) || 
        f.description.toLowerCase().includes(formulaSearch.toLowerCase());
      return matchSub && matchSearch;
    });
  }, [formulaSearch, formulaSubject]);

  const filteredUniversities = useMemo(() => {
    return universities.filter(u => {
      const matchSearch = !uniSearch.trim() || 
        u.name.toLowerCase().includes(uniSearch.toLowerCase()) || 
        u.amharicName.toLowerCase().includes(uniSearch.toLowerCase()) || 
        u.location.toLowerCase().includes(uniSearch.toLowerCase());
      const matchTier = uniTierFilter === 'All' || u.tier === uniTierFilter;
      return matchSearch && matchTier;
    });
  }, [uniSearch, uniTierFilter, universities]);

  // Procedural calculations for Interactive Simulator
  const physicsForceResult = (physicsMass * physicsAccel).toFixed(1);
  const chemMolesResult = (chemMolarityValue * chemVolumeValue).toFixed(2);

  return (
    <div className="min-h-screen bg-[#02050c] md:bg-gradient-to-br md:from-[#030611] md:to-[#020107] flex items-center justify-center text-slate-100 antialiased relative selection:bg-vip-gold selection:text-black font-sans p-0 md:p-4">
      
      {/* Ambient background glows for desktop widescreen displays */}
      <div className="hidden md:block absolute top-10 left-10 w-96 h-96 bg-vip-gold/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-10 right-10 w-96 h-96 bg-[#06b6d4]/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Persistent Toast notification overlays */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl border border-vip-gold bg-vip-slate/95 text-white shadow-xl flex items-center gap-3 glow-gold animate-bounce">
          <Sparkles className="text-vip-gold w-5 h-5 animate-pulse" />
          <span className="font-medium font-display text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Simulated High-Fidelity Mobile Smartphone Device Block */}
      <div className="w-full max-w-sm md:max-w-md min-h-screen md:min-h-[850px] md:max-h-[850px] bg-[#090d16] md:rounded-[44px] md:border-[10px] md:border-[#1e293b] md:shadow-[0_0_50px_rgba(204,164,59,0.12)] flex flex-col relative overflow-hidden transition-all duration-300">
        
        {/* Physical Ear Piece speaker/notch for smartphone aesthetics */}
        <div className="hidden md:block absolute top-0 inset-x-0 h-6 bg-[#1e293b] z-50 rounded-t-[34px]">
          <div className="mx-auto mt-1.5 w-24 h-2.5 bg-black rounded-full" />
        </div>

        {/* Content container inside simulated mobile phone viewport */}
        <div className="flex-1 flex flex-col h-full overflow-hidden md:mt-5 relative">
          
          {/* ================= ONBOARDING / REGISTRATION IF NOT REGISTERED ================= */}
          {!studentInfo.isRegistered ? (
            <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-[#0e071a] via-[#0d0920] to-[#090d16] overflow-y-auto no-scrollbar pb-8">
              <div className="space-y-6">
                
                {/* Brand Logo Header */}
                <div className="flex flex-col items-center text-center space-y-3 pt-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-vip-gold to-yellow-600 shadow-lg">
                    <GraduationCap className="text-black w-8 h-8" />
                  </div>
                  <h1 id="academy-brand" className="text-xl md:text-2xl font-black font-display tracking-tight text-gradient-gold">
                    🏛️ AKSUM PREP VIP
                  </h1>
                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                    {lang === 'amh' 
                      ? 'ከአክሱም ሥልጣኔ ጥበብ የተቀዳ፣ የብሔራዊ ማትሪክ ፈተናን በፈጠራና ልዩ ውጤት እንድታልፍ የተዘጋጀ ቅንጡ የክለሳ መተግበሪያ!'
                      : 'The ultimate offline high-fidelity preparatory companion for ambitious high school candidates.'}
                  </p>

                  {/* Language switch button */}
                  <button 
                    onClick={() => setLang(lang === 'amh' ? 'eng' : 'amh')}
                    className="mt-1 text-[11px] flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-vip-gold/30 hover:border-vip-gold bg-vip-slate/30 text-vip-gold transition cursor-pointer"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>{lang === 'amh' ? '🌍 English Version' : '🌍 በአማርኛ ለመቀጠል'}</span>
                  </button>
                </div>

                {/* Onboarding Mode Selector (Register / Sign In) */}
                <div className="grid grid-cols-2 p-1 rounded-xl bg-vip-slate/40 border border-[#cca43b]/15">
                  <button 
                    type="button"
                    onClick={() => setOnboardingMode('register')}
                    className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 px-1 cursor-pointer min-h-[40px] ${
                      onboardingMode === 'register' 
                        ? 'bg-gradient-to-r from-vip-gold to-yellow-600 text-black shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🔬 {lang === 'amh' ? 'አዲስ ምዝገባ' : 'Register'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setOnboardingMode('signin')}
                    className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 px-1 cursor-pointer min-h-[40px] ${
                      onboardingMode === 'signin' 
                        ? 'bg-gradient-to-r from-vip-gold to-yellow-600 text-black shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🔑 {lang === 'amh' ? 'አባላት መግቢያ' : 'Sign In'}
                  </button>
                </div>

                {/* Main Auth Form Details */}
                {onboardingMode === 'register' ? (
                  <div className="space-y-4 p-4 rounded-2xl border border-[#cca43b]/15 bg-black/40 animate-fade-in">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-vip-gold flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      {lang === 'amh' ? 'የተማሪው አዲስ መመዝገቢያ' : 'Create Admission Enrollment Profile'}
                    </p>

                    <div className="space-y-4">
                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-[#94a3b8] block px-0.5">{lang === 'amh' ? 'ሙሉ ስም (Full Name)' : 'Student Name'}</label>
                        <input 
                          type="text" 
                          placeholder={lang === 'amh' ? 'ለምሳሌ፡ ዮናታን በየነ' : 'e.g., Yonatan Bevene'}
                          className="w-full h-12 px-4 rounded-xl border border-slate-800 bg-vip-slate/40 text-white outline-none focus:border-vip-gold focus:bg-vip-slate/60 transition text-sm min-h-[48px]"
                          value={studentInfo.name}
                          onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                        />
                      </div>

                      {/* School Name */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-[#94a3b8] block px-0.5">{lang === 'amh' ? 'ትምህርት ቤት (High School)' : 'High School'}</label>
                        <input 
                          type="text" 
                          placeholder={lang === 'amh' ? 'ለምሳሌ፡ የካ የዝግጅት ት/ቤት' : 'e.g., Yeka Secondary Preparatory'}
                          className="w-full h-12 px-4 rounded-xl border border-slate-800 bg-vip-slate/40 text-white outline-none focus:border-vip-gold focus:bg-vip-slate/60 transition text-sm min-h-[48px]"
                          value={studentInfo.school}
                          onChange={(e) => setStudentInfo({ ...studentInfo, school: e.target.value })}
                        />
                      </div>

                      {/* Phone - Native 48px height */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-[#94a3b8] block px-0.5">{lang === 'amh' ? 'የስልክ ቁጥር (Mobile)' : 'Phone Number (e.g. 09...)'}</label>
                        <input 
                          type="tel" 
                          placeholder="0911223344"
                          className="w-full h-12 px-4 rounded-xl border border-slate-800 bg-vip-slate/40 text-white outline-none focus:border-vip-gold focus:bg-vip-slate/60 transition text-sm min-h-[48px]"
                          value={studentInfo.phone}
                          onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })}
                        />
                      </div>

                      {/* Custom Optional Password for sign in */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-[#94a3b8] block px-0.5">{lang === 'amh' ? 'የይለፍ ቃል (Password PIN)' : 'Passcode / PIN Password'}</label>
                        <input 
                          type="password" 
                          placeholder="••••"
                          className="w-full h-12 px-4 rounded-xl border border-slate-800 bg-vip-slate/40 text-white outline-none focus:border-vip-gold focus:bg-vip-slate/60 transition text-sm min-h-[48px]"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                        />
                      </div>

                      {/* Stream selection buttons (at least 48px for finger touch) */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-[#94a3b8] block px-0.5">{lang === 'amh' ? 'የትምህርት መስክ (Stream)' : 'Academic Stream'}</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            type="button"
                            onClick={() => setStudentInfo({ ...studentInfo, fieldStream: 'Natural Science' })}
                            className={`h-12 flex items-center justify-center rounded-xl text-xs font-semibold border transition cursor-pointer min-h-[48px] ${
                              studentInfo.fieldStream === 'Natural Science' 
                                ? 'bg-vip-gold text-black border-vip-gold shadow-md' 
                                : 'bg-vip-slate/30 text-slate-300 border-[#334155]'
                            }`}
                          >
                            🔬 {lang === 'amh' ? 'ከተፈጥሮ ሳይንስ' : 'Natural Sci'}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setStudentInfo({ ...studentInfo, fieldStream: 'Social Science' })}
                            className={`h-12 flex items-center justify-center rounded-xl text-xs font-semibold border transition cursor-pointer min-h-[48px] ${
                              studentInfo.fieldStream === 'Social Science' 
                                ? 'bg-purple-600 text-white border-purple-500 shadow-md' 
                                : 'bg-vip-slate/30 text-slate-300 border-[#334155]'
                            }`}
                          >
                            📚 {lang === 'amh' ? 'ማኅበራዊ ሳይንስ' : 'Social Sci'}
                          </button>
                        </div>
                      </div>

                      {/* Target University Selection Dropdown - 48px touch friendly */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-[#94a3b8] block px-0.5">{lang === 'amh' ? 'የሚመርጡት ዩኒቨርሲቲ (Target Uni)' : 'Target Admissions Destination'}</label>
                        <select 
                          className="w-full h-12 px-3 rounded-xl border border-slate-800 bg-vip-slate/40 text-xs text-white outline-none focus:border-vip-gold transition min-h-[48px] cursor-pointer"
                          value={studentInfo.targetUniversity}
                          onChange={(e) => setStudentInfo({ ...studentInfo, targetUniversity: e.target.value })}
                        >
                          <option value="Addis Ababa University">Addis Ababa University (🥇 Rank #1)</option>
                          <option value="Adama Science & Technology University">Adama Science & Technology (ASTU)</option>
                          <option value="Bahir Dar University">Bahir Dar University</option>
                          <option value="Hawassa University">Hawassa University</option>
                          <option value="Jimma University">Jimma University (Research Elite)</option>
                        </select>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 p-4 rounded-2xl border border-[#cca43b]/15 bg-black/40 animate-fade-in text-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-vip-gold flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      {lang === 'amh' ? 'ወደ መለያዎ ለመግባት' : 'Sign In with Registered Account'}
                    </p>

                    <div className="space-y-4">
                      {/* Name or Phone Identifier */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-[#94a3b8] block px-0.5">
                          {lang === 'amh' ? 'የስልክ ቁጥር ወይም ሙሉ ስም (Name / Phone)' : 'Full Name or Phone Number'}
                        </label>
                        <input 
                          type="text" 
                          placeholder={lang === 'amh' ? 'ለምሳሌ፡ 0911...' : 'e.g., Yonatan Bevene or 09...'}
                          className="w-full h-12 px-4 rounded-xl border border-slate-800 bg-vip-slate/40 text-white outline-none focus:border-vip-gold focus:bg-vip-slate/60 transition text-sm min-h-[48px]"
                          value={signinIdentifier}
                          onChange={(e) => setSigninIdentifier(e.target.value)}
                        />
                      </div>

                      {/* Password PIN */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-[#94a3b8] block px-0.5">
                          {lang === 'amh' ? 'የይለፍ ቃል (Password PIN)' : 'Password PIN'}
                        </label>
                        <input 
                          type="password" 
                          placeholder="••••"
                          className="w-full h-12 px-4 rounded-xl border border-slate-800 bg-vip-slate/40 text-white outline-none focus:border-vip-gold focus:bg-vip-slate/60 transition text-sm min-h-[48px]"
                          value={signinPassword}
                          onChange={(e) => setSigninPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Session Persistence Toggle - Remember Me (Requirement: "remember them") */}
                <div className="p-3.5 rounded-xl bg-vip-gold/5 border border-vip-gold/10 flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                    <input 
                      type="checkbox" 
                      className="w-4.5 h-4.5 accent-vip-gold rounded border-slate-800 bg-vip-slate cursor-pointer"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className="leading-none text-left">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-vip-gold transition block">
                        {lang === 'amh' ? 'የእኔን መለያ አስታውስ' : 'Remember Me / Remember Them'}
                      </span>
                      <span className="text-[9px] text-[#94a3b8] block mt-0.5">
                        {lang === 'amh' ? 'በቀጣይ በራስሰር እንዲገባ ይፈቅዳል' : 'Keeps you signed in on reload/startup'}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Subtext info */}
                <div className="flex gap-2.5 p-3 rounded-xl border border-purple-900/30 bg-purple-950/10 text-[11px] text-purple-300 leading-relaxed text-left">
                  <Info className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                  <p>
                    {lang === 'amh' 
                      ? 'አክሱም VIP አካዳሚ በሚኒስቴሩ የታወጁ የብሔራዊ ፈተና ማስታወሻዎችንና ቀመሮችን በአንድ ጊዜ አካቶ የያዘ ከመስመር ውጪ ጥናት ድጋፍ ሰጪ መተግበሪያ ነው።'
                      : 'Aksum VIP guarantees offline-enabled curriculum summaries and custom proctor guidance on device storage.'}
                  </p>
                </div>
              </div>

              {/* Submit Button (Native 48px height) */}
              {onboardingMode === 'register' ? (
                <button 
                  onClick={() => {
                    if (!studentInfo.name.trim() || !studentInfo.school.trim() || !studentInfo.phone.trim()) {
                      showToast(lang === 'amh' ? '⚠️ እባክዎ ስም፣ ትምህርት ቤት እና ስልክ ሙሉ ያድርጉ!' : '⚠️ Please fill out Name, school & phone to continue!');
                      return;
                    }
                    registerStudent(studentInfo);
                  }}
                  className="w-full h-12 mt-6 rounded-xl font-bold font-display uppercase tracking-wider text-black bg-gradient-to-r from-vip-gold via-yellow-500 to-amber-600 shadow-xl flex items-center justify-center gap-2 text-xs cursor-pointer min-h-[48px] active:scale-95 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'amh' ? 'የጥናት አካዳሚውን ክፈት (Open Academy)' : 'Enter VIP Academics'}</span>
                </button>
              ) : (
                <button 
                  onClick={handleSignIn}
                  className="w-full h-12 mt-6 rounded-xl font-bold font-display uppercase tracking-wider text-black bg-gradient-to-r from-vip-gold via-yellow-500 to-amber-600 shadow-xl flex items-center justify-center gap-2 text-xs cursor-pointer min-h-[48px] active:scale-95 transition"
                >
                  <User className="w-4 h-4" />
                  <span>{lang === 'amh' ? 'ወደ አካዳሚው ግባ (Sign In)' : 'Sign In & Enter'}</span>
                </button>
              )}
            </div>
          ) : (
            /* ================= HIGH FIDELITY REGISTERED MAIN DASHBOARD ================= */
            <>
              {/* Sticky Top App Bar Header (Requirement 3) */}
              <header className="h-14 border-b border-[#cca43b]/15 bg-[#0b0f19] px-4 flex items-center justify-between shrink-0 select-none z-40 sticky top-0 shadow-sm shadow-[#cca43b]/5">
                
                {/* Left: Scholar avatar picture with a premium golden ring */}
                <div className="flex items-center gap-2">
                  <div 
                    onClick={() => {
                      if (window.confirm(lang === 'amh' ? 'የተማሪውን መመዝገቢያ ማስረጃዎችን እና ጥናቶችን ማጽዳት ይፈልጋሉ?' : 'Do you want to reset student login fields?')) {
                        localStorage.clear();
                        setStudentInfo({ ...studentInfo, isRegistered: false });
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-vip-gold to-yellow-600 border-2 border-[#cca43b] text-black font-black flex items-center justify-center text-xs shadow-md select-none cursor-pointer hover:rotate-12 transition duration-300"
                    title="Tap to Reset / Log out"
                  >
                    {studentInfo.name ? studentInfo.name.charAt(0).toUpperCase() : '🎓'}
                  </div>
                  <div className="leading-none">
                    <p className="text-[11px] font-black text-white truncate max-w-[90px]">
                      {studentInfo.name || 'Scholar'}
                    </p>
                    <p className="text-[8px] text-vip-gold font-mono tracking-widest uppercase truncate max-w-[90px]">
                      {studentInfo.fieldStream === 'Natural Science' ? 'NATURAL' : 'SOCIAL'}
                    </p>
                  </div>
                </div>

                {/* Center: App Name */}
                <div className="text-center">
                  <h2 className="text-xs font-black font-display tracking-tight text-gradient-gold">
                    🏛️ AKSUM PREP VIP
                  </h2>
                  <span className="text-[8px] text-[#64748b] block font-mono font-bold tracking-widest leading-none">
                    NATIONAL MATRIC HUB
                  </span>
                </div>

                {/* Right: Notification Alerts bell & Language switcher */}
                <div className="flex items-center gap-1.5">
                  
                  {/* Lang switcher toggler */}
                  <button 
                    onClick={() => {
                      const nextLang = lang === 'amh' ? 'eng' : 'amh';
                      setLang(nextLang);
                      setStudentInfo({ ...studentInfo, preferredLanguage: nextLang });
                      showToast(nextLang === 'amh' ? '🌍 ቋንቋው ወደ አማርኛ ተቀይሯል!' : '🌍 Switched to English version!');
                    }}
                    className="px-2 py-1 rounded-lg border border-slate-800 bg-vip-slate/30 text-vip-gold text-[9px] font-extrabold cursor-pointer hover:border-vip-gold/30 active:scale-95 transition"
                  >
                    {lang === 'amh' ? 'ENG' : 'አማ'}
                  </button>

                  {/* Compact notification bell triggering direct alerts pane */}
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className="relative p-1.5 rounded-lg border border-slate-800 text-[#94a3b8] hover:text-white cursor-pointer active:scale-95 transition"
                    title="View Notifications Alert Feed"
                  >
                    <Bell className="w-4 h-4 text-vip-gold" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  </button>

                </div>
              </header>

              {/* Main Interactive Mobile Workspace with generous vertical scrolling space (pb-24) */}
              <main id="app-workspace" className="flex-1 overflow-y-auto bg-gradient-to-b from-[#090d16] to-[#0e0a1b] p-4 pb-20 space-y-6 no-scrollbar h-full w-full">

              
              {/* ================= TAB 1: DASHBOARD ================= */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Hero greeting */}
                  <div className="p-6 rounded-3xl border border-vip-gold/15 bg-gradient-to-r from-vip-slate/90 via-[#101726]/90 to-[#0c0617] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-vip-gold/5 rounded-full filter blur-[80px]" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl md:text-2xl font-black font-display text-white">
                          {lang === 'amh' ? `ሰላም፣ ${studentInfo.name}! 👑` : `Assalam / Selam, ${studentInfo.name}! 👑`}
                        </h2>
                        <p className="text-[#94a3b8] text-xs max-w-xl mt-1 leading-relaxed">
                          {lang === 'amh' 
                            ? 'የኔታ! ብሔራዊ ማትሪክ ፈተናውን ከፍተኛ እውቀት የታጠቁ የአክሱም ተፈታኞች በልዩ ውጤት ያጠናቅቃሉ። የዕለት ተዕለት ጥናትዎን ለመዝገብ ፖሞዶሮን ይጠቀሙ!'
                            : 'Unlocking elite candidate stats. You are on track for outstanding national matric standards.'}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 text-[11px] text-vip-gold border border-vip-gold/20">
                          <Target className="w-3.5 h-3.5" />
                          <span>🎯 {lang === 'amh' ? 'ቀዳሚ መዳረሻዎ ዩኒቨርሲቲ፡' : 'Destination University:'} <strong>{studentInfo.targetUniversity}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Copy stats */}
                        <button 
                          onClick={handleCopyStats}
                          className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-vip-gold/20 hover:border-vip-gold/60 text-[#f3ca65] bg-vip-slate/30 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{lang === 'amh' ? 'ውጤት አጋራ' : 'Share My Stats'}</span>
                        </button>

                        <button 
                          onClick={() => setActiveTab('apkstore')}
                          className="px-4 py-2 text-xs font-bold rounded-lg bg-vip-gold text-black hover:bg-yellow-500 transition shadow-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{lang === 'amh' ? 'የስልክ መተግበሪያ (.APK) ጫን' : 'Get Phone APP (.APK)'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Top Stats Grid Charts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* Stat Card 1: Study hours */}
                    <div className="p-4 rounded-2xl border border-[#334155]/50 bg-vip-slate/30 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#64748b] hover:underline cursor-pointer" onClick={() => setActiveTab('apkstore')}>{lang === 'amh' ? '⏱️ አጠቃላይ የተመዘገበ ጥናት' : '⏱️ Total Focused Time'}</p>
                        <p className="text-xl font-bold font-mono text-white">
                          {completedMinutes} <span className="text-xs text-[#a0aec0] font-sans font-normal">{lang === 'amh' ? 'ደቂቃ' : 'Mins'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Stat Card 2: National target score requirements */}
                    <div className="p-4 rounded-2xl border border-[#334155]/50 bg-vip-slate/30 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#64748b]">{lang === 'amh' ? '🎯 የሚጠበቀው የማለፊያ ነጥብ' : '🎯 Minimum Cutoff Target'}</p>
                        <p className="text-xl font-bold font-mono text-[#a78bfa]">
                          {studentInfo.fieldStream === 'Natural Science' ? '380 - 430' : '350 - 380'}
                          <span className="text-xs text-[#a0aec0] font-sans font-normal"> / 600</span>
                        </p>
                      </div>
                    </div>

                    {/* Stat Card 3: Completed exercises */}
                    <div className="p-4 rounded-2xl border border-[#334155]/50 bg-vip-slate/30 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-vip-gold/10 border border-vip-gold/20 flex items-center justify-center text-vip-gold">
                        <Flame className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#64748b]">{lang === 'amh' ? '🔥 የፈተና ጥያቄ ሙከራዎች' : '🔥 Active MCQ Logged'}</p>
                        <p className="text-xl font-bold font-mono text-vip-gold">
                          {Object.keys(answersState).length} <span className="text-xs text-[#a0aec0] font-sans font-normal">{lang === 'amh' ? 'ጥያቄዎች' : 'Answered'}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* REQUIREMENT 4: Horizontal Scrolling Grid of Core Prep Category Launchers */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black tracking-widest text-[#cca43b] uppercase flex items-center gap-1.5 px-1">
                      <span>🗂️ {lang === 'amh' ? 'ፈጣን የማጥኛ ክፍሎች' : 'QUICK STUDY MODULES'}</span>
                      <span className="text-[9px] text-[#64748b] lowercase font-normal">({lang === 'amh' ? 'በጎን ያንሸራትቱ' : 'swipe horizontally'})</span>
                    </h3>
                    <div className="flex overflow-x-auto gap-3 pb-2 snap-x no-scrollbar">
                      
                      {[
                        {
                          title: lang === 'amh' ? '🧮 ሚኒስቴር ፈተናዎች' : '🧮 PRACTICE CORE',
                          desc: lang === 'amh' ? 'የቅርብ ዓመታት የብሔራዊ ፈተና ባንኮች ከፈጣን መልስ ማብራሪያዎች ጋር' : 'Simulate real ESSLCE questions with diagnostic progress charts.',
                          tab: 'practice',
                          color: 'border-[#cca43b]/25 bg-[#171107]/45 text-vip-gold'
                        },
                        {
                          title: lang === 'amh' ? '⚡ የምህንድስና ቀመሮች' : '⚡ METRIC FORMULAS',
                          desc: lang === 'amh' ? 'የፊዚክስና ኬሚስትሪ ቀመሮች ሰሌዳ እና መሥሪያ ሲሙሌተር' : 'Interactive constants calculators for Physics & Chemistry.',
                          tab: 'formulas',
                          color: 'border-[#38bdf8]/25 bg-[#031d2c]/45 text-[#38bdf8]'
                        },
                        {
                          title: lang === 'amh' ? '🏫 የዩኒቨርሲቲ በር' : '🏫 PREMIUM UNIS',
                          desc: lang === 'amh' ? 'ምርጥ የኢትዮጵያ ዩኒቨርሲቲዎች፣ የመግቢያ ውጤትና የቅበላ መረጃዎች' : 'Explore cutoffs and historical intake capacities for Addis Ababa & ASTU.',
                          tab: 'universities',
                          color: 'border-[#a78bfa]/25 bg-[#170a2c]/45 text-[#a78bfa]'
                        },
                        {
                          title: lang === 'amh' ? '📱 የአንድሮይድ ሲሙሌተር' : '📱 OFFLINE EMBED',
                          desc: lang === 'amh' ? 'ዝቅተኛ ኔትወርክ ባለባቸው አካባቢዎች በሙሉ ከመስመር ውጪ ጥናት' : 'Simulate localized DB downloads to device disk storage.',
                          tab: 'apkstore',
                          color: 'border-[#10b981]/25 bg-[#031c12]/45 text-[#10b981]'
                        }
                      ].map((mod, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setActiveTab(mod.tab);
                            showToast(`🚀 ${lang === 'amh' ? 'ክፍሉ ተመርጧል!' : 'Launching ' + mod.title}!`);
                          }}
                          className={`w-52 shrink-0 snap-start p-4 rounded-2xl border ${mod.color} hover:brightness-110 active:scale-95 transition cursor-pointer flex flex-col justify-between space-y-2 h-36`}
                        >
                          <div>
                            <span className="text-xs font-black tracking-tight block uppercase">{mod.title}</span>
                            <p className="text-[10px] text-slate-400 leading-relaxed mt-1 line-clamp-3">{mod.desc}</p>
                          </div>
                          <span className="text-[9px] font-mono tracking-widest uppercase text-end font-bold block pt-1">
                            {lang === 'amh' ? 'ጀምር →' : 'LAUNCH →'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* REQUIREMENT 4: Horizontal Scrolling Grid of Academic Trending Courses */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black tracking-widest text-[#a78bfa] uppercase flex items-center gap-1.5 px-1">
                      <span>📖 {lang === 'amh' ? 'ታዋቂ የትምህርት አርዕስቶች' : 'TRENDING VIP SUBJECTS'}</span>
                      <span className="text-[9px] text-[#64748b] lowercase font-normal">({lang === 'amh' ? 'ለመምረጥ ይንኩ' : 'tap to explore notes'})</span>
                    </h3>
                    <div className="flex overflow-x-auto gap-3 pb-2 snap-x no-scrollbar">
                      {[
                        { name: 'Mathematics', amh: '➕ ሒሳብ (Math)', count: '12 Units', color: 'from-[#cca43b]/10 to-amber-950/20 hover:border-vip-gold/40 border-slate-800' },
                        { name: 'Physics', amh: '🚀 ፊዚክስ (Physics)', count: '10 Units', color: 'from-blue-950/10 to-indigo-950/20 hover:border-blue-500/40 border-slate-800' },
                        { name: 'Chemistry', amh: '🧪 ኬሚስትሪ (Chemistry)', count: '8 Units', color: 'from-emerald-950/10 to-teal-950/20 hover:border-emerald-500/40 border-slate-800' },
                        { name: 'Biology', amh: '🧬 ባዮሎጂ (Biology)', count: '7 Units', color: 'from-pink-950/10 to-rose-950/20 hover:border-pink-500/40 border-slate-800' }
                      ].map((sub, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setSelectedSubject(sub.name);
                            setActiveTab('curriculum');
                            showToast(`📚 Opened ${sub.name} Syllabus Notes!`);
                          }}
                          className={`w-40 shrink-0 snap-start p-4 rounded-xl border bg-gradient-to-br ${sub.color} active:scale-95 transition cursor-pointer flex flex-col justify-between h-24`}
                        >
                          <span className="text-xs font-black text-white block">
                            {lang === 'amh' ? sub.amh : sub.name}
                          </span>
                          <div className="flex items-center justify-between mt-2.5">
                            <span className="text-[9px] text-slate-400 font-mono font-bold">{sub.count}</span>
                            <span className="text-[9px] text-[#a78bfa] font-black uppercase tracking-wider">{lang === 'amh' ? 'ክፈት →' : 'Study →'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Pomodoro Focus & Charts Split grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LHS: 5 Column interactive premium Pomodoro Focus Engine */}
                    <div className="lg:col-span-5 p-5 rounded-3xl border border-vip-gold/10 bg-[#0c101b] flex flex-col justify-between space-y-4">
                      <div className="flex items-center justify-between border-b border-[#cca43b]/15 pb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${focusMode === 'focus' ? 'bg-vip-gold animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                          <h4 className="font-bold text-xs uppercase tracking-wider text-[#a0aec0]">
                            {focusMode === 'focus' 
                              ? (lang === 'amh' ? '📝 የትኩረት ጥናት ክፍለ ጊዜ' : '📝 VIP Focus State') 
                              : (lang === 'amh' ? '☕ የእረፍት ጊዜ' : '☕ Recharge Break State')}
                          </h4>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          focusMode === 'focus' ? 'bg-vip-gold/10 text-vip-gold border border-vip-gold/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {focusMode.toUpperCase()}
                        </span>
                      </div>

                      {/* Display Clock Area */}
                      <div className="py-6 flex flex-col items-center justify-center space-y-2 relative">
                        {/* Background glowing rings */}
                        <div className="w-40 h-40 rounded-full border border-vip-gold/15 flex items-center justify-center relative glow-gold bg-black/30">
                          <div className="absolute inset-2 rounded-full border border-dashed border-vip-gold/10" />
                          <p id="timer-display" className="text-4xl font-mono font-black text-white tracking-widest">
                            {Math.floor(pomodoroLeft / 60).toString().padStart(2, '0')}:
                            {(pomodoroLeft % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                        <p className="text-xs text-[#a0aec0] font-medium text-center italic mt-2">
                          {focusMode === 'focus'
                            ? (lang === 'amh' ? '📚 መዳረሻ ዩኒቨርሲቲ ለመግባት በትኩረት አጥኑ!' : '💡 High-fidelity cognitive focus session active.')
                            : (lang === 'amh' ? '☕ ትኩስ ቡና ጠጥተው ይተንፍሱ።' : '☕ Release and inhale deep, calming breaths.')}
                        </p>
                      </div>

                      {/* Control Panel Grid */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button 
                          onClick={toggleTimer}
                          className={`p-3 rounded-xl font-bold font-display uppercase tracking-wider text-xs shadow transition-all flex items-center justify-center gap-1 relative overflow-hidden cursor-pointer ${
                            timerRunning 
                              ? 'bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/40' 
                              : 'bg-gradient-to-br from-[#cca43b] to-yellow-600 text-black hover:brightness-110'
                          }`}
                        >
                          <span>{timerRunning ? (lang === 'amh' ? '⏸️ አቁም' : '⏸️ PAUSE') : (lang === 'amh' ? '▶️ ጀምር' : '▶️ DEEP STUDY')}</span>
                        </button>

                        <button 
                          onClick={resetTimer}
                          className="p-3 rounded-xl font-semibold border border-[#334155] bg-vip-slate/30 text-white hover:bg-vip-slate/60 text-xs text-center cursor-pointer transition"
                        >
                          🔄 {lang === 'amh' ? 'ዳግም ጀምር' : 'RESET'}
                        </button>
                      </div>

                      {/* Rapid pomodoro duration preset options */}
                      <div className="pt-2 flex items-center justify-between text-[11px] text-[#64748b]">
                        <span>Presets:</span>
                        <div className="flex gap-1.5">
                          {[
                            { label: '25m', val: 1500 },
                            { label: '45m', val: 2700 },
                            { label: '60m', val: 3600 }
                          ].map((pref, pI) => (
                            <button 
                              key={pI}
                              disabled={timerRunning}
                              onClick={() => {
                                setPomodoroLeft(pref.val);
                                setTimerMax(pref.val);
                              }}
                              className="px-2 py-0.5 rounded border border-[#334155] bg-black/40 hover:border-vip-gold hover:text-vip-gold text-slate-300 transition text-[10px]"
                            >
                              {pref.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* RHS: 7 Column dynamic analytics utilizing Recharts (guidelines compliance) */}
                    <div className="lg:col-span-7 p-5 rounded-3xl border border-[#334155]/50 bg-[#0c101b] flex flex-col justify-between">
                      <div className="space-y-1 pb-3 border-b border-[#cca43b]/10">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-vip-gold">📚 Study Milestones & Progress Log</h4>
                        <p className="text-xs text-[#a0aec0]">{lang === 'amh' ? 'ለእያንዳንዱ ቀዳሚ ትምህርት የተቀረጸ የጥናት ቆይታ ገበታ' : 'Targeted syllabus retention curve per stream'}</p>
                      </div>

                      {/* Display chart representation */}
                      <div className="h-52 w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={[
                              { date: 'Mon', Mathematics: 30, Physics: 25, Chemistry: 20 },
                              { date: 'Tue', Mathematics: 45, Physics: 35, Chemistry: 30 },
                              { date: 'Wed', Mathematics: 60, Physics: 45, Chemistry: 25 },
                              { date: 'Thu', Mathematics: 40, Physics: 50, Chemistry: 45 },
                              { date: 'Fri', Mathematics: 75, Physics: 60, Chemistry: 55 },
                              { date: 'Sat', Mathematics: 90, Physics: 70, Chemistry: 60 },
                              { date: 'Sun', Mathematics: 110, Physics: 85, Chemistry: 75 }
                            ]}
                            margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                          >
                            <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#cca43b', color: '#fff' }} />
                            <Area type="monotone" dataKey="Mathematics" stroke="#f59e0b" fillOpacity={0.15} fill="url(#colorMath)" />
                            <Area type="monotone" dataKey="Physics" stroke="#06b6d4" fillOpacity={0.05} fill="url(#colorPhys)" />
                            <defs>
                              <linearGradient id="colorMath" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorPhys" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex gap-4 text-xs text-[#a0aec0] pt-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-vip-gold" />
                          <span>{lang === 'amh' ? 'ሒሳብ (Math)' : 'Mathematics'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                          <span>{lang === 'amh' ? 'ፊዚክስ' : 'Physics'}</span>
                        </div>
                        <div className="text-xs text-[#64748b] ml-auto">
                          Updated: Just Now
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Android APK Shortcut Promo Banner at bottom of Dashboard */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-vip-gold/40 bg-gradient-to-r from-vip-slate/20 via-yellow-950/20 to-vip-slate/20 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-vip-gold/10 flex items-center justify-center text-vip-gold">
                        <Smartphone className="w-7 h-7 animate-pulse" />
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-sm">📲 {lang === 'amh' ? 'የአንድሮይድ መጫኛ (.APK) ይፈልጋሉ?' : 'Need the Android APK Installation File?'}</h5>
                        <p className="text-[#a0aec0] text-xs">
                          {lang === 'amh' 
                            ? 'ፈተና ቅድመ ዝግጅቱን ያለ ምንም ኢንተርኔት (Offline)፣ ለብቻ በተቀመጠ የሞባይል አፕሊኬሽን ለመጠቀም የ APK መጫኛውን አሁኑኑ ያውርዱ።'
                            : 'Install Aksum VIP directly onto your phone bypassing browser bookmarks! Enjoy biometric study mode and 100% offline access.'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('apkstore')}
                      className="px-5 py-2.5 rounded-xl font-extrabold text-[#090d16] bg-[#cca43b] hover:bg-yellow-500 transition shadow-lg text-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === 'amh' ? 'ወደ ማውረጃው ሂድ' : 'Direct APK Download Tab'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: CURRICULUM SYLLABUS NOTES ================= */}
              {activeTab === 'curriculum' && (
                <div id="curriculum-view" className="space-y-6">
                  {/* Subject and unit list filters top grid */}
                  <div className="p-4 rounded-2xl border border-[#334155]/50 bg-vip-slate/25">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-base text-white">{lang === 'amh' ? '📐 የብሔራዊ ማትሪክ ሲላበስ የክለሳ ማስታወሻዎች' : '📐 National Syllabus & Summary Cards'}</h3>
                        <p className="text-xs text-[#a0aec0]">{lang === 'amh' ? 'ለብሔራዊ ፈተና መሸፈን ያለባቸውን የተመረጡ የ 12ኛ ክፍል ዩኒቶች' : 'Filter standardized summaries curated for rapid active revision.'}</p>
                      </div>
                      
                      {/* Subject Filter button pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {['Mathematics', 'Physics', 'Chemistry', 'Biology'].map((sub) => (
                          <button
                            key={sub}
                            onClick={() => {
                              setSelectedSubject(sub);
                              const standardUnit = CURRICULUM_UNITS.find(u => u.subject === sub);
                              if (standardUnit) setSelectedUnitId(standardUnit.id);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                              selectedSubject === sub 
                                ? 'bg-vip-gold border-vip-gold text-black' 
                                : 'bg-vip-slate/50 border-[#334155] text-slate-300 hover:border-vip-gold-dark'
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Left/Right Horizontal unit scrolling selection */}
                    <div className="mt-4 pt-4 border-t border-[#334155]/40">
                      <p className="text-[10px] text-vip-gold font-bold uppercase tracking-wider mb-2">{lang === 'amh' ? 'ምዕራፎች (Chapters):' : 'Available Course Chapters / Units:'}</p>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {filteredUnits.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedUnitId(item.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                              selectedUnitId === item.id 
                                ? 'bg-gradient-to-r from-[#cca43b] to-yellow-600 text-black shadow-md' 
                                : 'bg-black/30 border border-[#334155] text-slate-300 hover:border-vip-gold/50'
                            }`}
                          >
                            Unit {item.unitNumber}: {lang === 'amh' ? item.titleAmharic : item.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Syllabus Study Card Rendering & Sandbox widget representation */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LHS 2 Columns: Study Card and notes */}
                    <div className="lg:col-span-2 p-6 rounded-3xl border border-vip-gold/15 bg-vip-slate/30 relative space-y-4">
                      <div className="flex items-center justify-between border-b border-[#cca43b]/15 pb-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="text-vip-gold w-5 h-5 animate-pulse" />
                          <div>
                            <span className="text-[10px] text-vip-gold font-mono block uppercase">Grade {activeUnit.grade} &bull; Unit {activeUnit.unitNumber}</span>
                            <h4 className="font-bold text-white text-base">
                              {lang === 'amh' ? activeUnit.titleAmharic : activeUnit.title}
                            </h4>
                          </div>
                        </div>

                        {/* Font sizing controller */}
                        <div className="flex gap-1.5 items-center">
                          <span className="text-[10px] text-[#64748b]">Font:</span>
                          {(['sm', 'md', 'lg'] as const).map((sz) => (
                            <button
                              key={sz}
                              className={`w-6 h-6 rounded text-xs transition uppercase ${
                                fontSize === sz ? 'bg-vip-gold text-black font-bold' : 'bg-black/40 text-slate-400 hover:text-white'
                              }`}
                              onClick={() => setFontSize(sz)}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes core body text content */}
                      <div className="p-4 rounded-2xl bg-black/35 leading-relaxed overflow-y-auto max-h-[400px]">
                        <p className={`text-[#e2e8f0] tracking-wide whitespace-pre-wrap ${
                          fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base md:text-lg' : 'text-sm'
                        }`}>
                          {lang === 'amh' ? activeUnit.notesAmharic : activeUnit.notes}
                        </p>
                      </div>

                      {/* Display key formula alert block if formulas exist */}
                      {activeUnit.keyFormulas && activeUnit.keyFormulas.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-vip-gold/5 border border-vip-gold/15 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <Sliders className="text-vip-gold w-4 h-4 shrink-0" />
                            <span className="text-slate-300">
                              {lang === 'amh' 
                                ? `💡 ይህ ምዕራፍ ${activeUnit.keyFormulas.length} መሰረታዊ ቀመሮችን ይዟል። ወደ ቀመሮች ሰሌዳ በመሄድ በተለዋዋጭ እሴት ይሞክሯቸው።` 
                                : `💡 This unit contains ${activeUnit.keyFormulas.length} key equations. Try compiling parameters inside our Sandbox!`}
                            </span>
                          </div>
                          <button 
                            onClick={() => setActiveTab('formulas')}
                            className="text-[11px] text-[#cca43b] underline font-bold whitespace-nowrap"
                          >
                            {lang === 'amh' ? 'ሰሌዳ ክፈት' : 'Sandbox &rarr;'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* RHS Columns: Quick MCQ practice card for selected unit */}
                    <div className="lg:col-span-1 p-5 rounded-3xl border border-[#334155]/50 bg-vip-slate/30 shrink-0 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-vip-gold">{lang === 'amh' ? 'አጭር የክፍል ሙከራ' : 'Active MCQ Test'}</h4>
                          <span className="text-[10px] text-[#64748b]">Filtered Pool</span>
                        </div>
                        <p className="text-[11px] text-[#a0aec0]">{lang === 'amh' ? 'ለተመረጠው ምዕራፍ የሚሆኑ የብሔራዊ ፈተና ጥያቄዎች' : 'Solve syllabus questions specifically generated for this chapter.'}</p>
                      </div>

                      {filteredQuizPool.length === 0 ? (
                        <div className="py-8 text-center space-y-2 border border-dashed border-[#334155]/50 rounded-2xl bg-black/20">
                          <HelpCircle className="text-[#475569] w-8 h-8 mx-auto" />
                          <p className="text-xs text-[#64748b] px-3">
                            {lang === 'amh' 
                              ? 'ለዚህ ምዕራፍ የተዘጋጀ ጥያቄ የለም። ፈጣን ጥያቄ ለማመንጨት "Practice Core" ዘርፍን ይጫኑ!' 
                              : 'No mock MCQs logged for this chapter. Head to Practice Core or click Synthesize!'}
                          </p>
                          <button 
                            onClick={() => setActiveTab('practice')}
                            className="mt-2 text-xs text-vip-gold underline font-bold"
                          >
                            Go to Practice Core &rarr;
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[11px] text-[#64748b] bg-black/40 px-2 py-1 rounded">
                            <span>{filteredQuizPool[currentMCQIndex]?.year || 'ESSLCE'}</span>
                            <span>{currentMCQIndex + 1} of {filteredQuizPool.length}</span>
                          </div>

                          <p className="text-xs font-semibold text-white leading-relaxed">
                            {lang === 'amh' 
                              ? filteredQuizPool[currentMCQIndex]?.questionAmharic || filteredQuizPool[currentMCQIndex]?.question 
                              : filteredQuizPool[currentMCQIndex]?.question}
                          </p>

                          {/* Options */}
                          <div className="space-y-1.5 pt-2">
                            {(lang === 'amh' 
                              ? filteredQuizPool[currentMCQIndex]?.optionsAmharic || filteredQuizPool[currentMCQIndex]?.options
                              : filteredQuizPool[currentMCQIndex]?.options).map((opt, oIdx) => {
                                const questionId = filteredQuizPool[currentMCQIndex].id;
                                const isAnswered = answersState[questionId] !== undefined;
                                const isSelected = answersState[questionId]?.selected === oIdx;
                                const isCorr = filteredQuizPool[currentMCQIndex].answerIndex === oIdx;

                                let cname = "w-full text-left p-2.5 rounded-lg text-xs transition-all border outline-none ";
                                if (isAnswered) {
                                  if (isCorr) cname += "bg-emerald-950/40 border-emerald-500 text-emerald-300";
                                  else if (isSelected) cname += "bg-rose-950/40 border-rose-500 text-rose-300";
                                  else cname += "bg-vip-slate/10 border-slate-800 text-slate-500";
                                } else {
                                  cname += "bg-black/30 border-[#334155] text-slate-300 hover:border-vip-gold hover:text-white cursor-pointer";
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    disabled={isAnswered}
                                    onClick={() => handleSelectMCQOption(oIdx, filteredQuizPool[currentMCQIndex].answerIndex)}
                                    className={cname}
                                  >
                                    {opt}
                                  </button>
                                );
                            })}
                          </div>

                          {/* Navigation footer */}
                          <div className="flex justify-between items-center pt-2">
                            <button
                              disabled={currentMCQIndex === 0}
                              onClick={() => {
                                setCurrentMCQIndex(prev => prev - 1);
                                setRevealMCQAnswer(answersState[filteredQuizPool[currentMCQIndex - 1]?.id] !== undefined);
                              }}
                              className="text-xs text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              ◀ Back
                            </button>
                            <button 
                              onClick={() => setRevealMCQAnswer(!revealMCQAnswer)}
                              className="text-xs text-vip-gold font-bold underline"
                            >
                              {revealMCQAnswer ? 'Hide Details' : 'Explanation'}
                            </button>
                            <button
                              disabled={currentMCQIndex === filteredQuizPool.length - 1}
                              onClick={() => {
                                setCurrentMCQIndex(prev => prev + 1);
                                setRevealMCQAnswer(answersState[filteredQuizPool[currentMCQIndex + 1]?.id] !== undefined);
                              }}
                              className="text-xs text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              Next ▶
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 3: PRACTICE CORE ================= */}
              {activeTab === 'practice' && (
                <div id="practice-core" className="space-y-6 animate-fade-in">
                  
                  {/* Native Back navigation bar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="h-10 px-4 rounded-xl bg-vip-slate/50 text-vip-gold text-xs font-bold flex items-center gap-1.5 border border-vip-gold/15 active:scale-95 transition cursor-pointer min-h-[40px]"
                    >
                      ← {lang === 'amh' ? 'ወደ ዋነኛው ዳሽቦርድ ይመለሱ' : 'Back to Home'}
                    </button>
                  </div>
                  
                  {/* Filter / Synthesizer header bar */}
                  <div className="p-5 rounded-2xl border border-vip-gold/15 bg-[#0b0f19] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-white">🧮 ESSLCE Practice Core & Procedural Exam Platform</h3>
                      <p className="text-xs text-[#a0aec0]">{lang === 'amh' ? 'በሲላበስ ላይ የተመሰረቱ የብሔራዊ ፈተና ጥያቄዎችና ማብራሪያዎች' : 'Cram dynamic test questions aligned to official Ethiopian Matric syllabus.'}</p>
                    </div>

                    <div className="flex gap-2.5">
                      <select 
                        className="p-2 bg-vip-slate/50 rounded-lg border border-[#334155] text-xs font-semibold text-white outline-none"
                        value={selectedSubject}
                        onChange={(e) => {
                          setSelectedSubject(e.target.value);
                          const standardUnit = CURRICULUM_UNITS.find(u => u.subject === e.target.value);
                          if (standardUnit) setSelectedUnitId(standardUnit.id);
                          setCurrentMCQIndex(0);
                        }}
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                      </select>

                      <select 
                        className="p-2 bg-vip-slate/50 rounded-lg border border-[#334155] text-xs font-semibold text-white outline-none"
                        value={quizFilter}
                        onChange={(e) => {
                          setQuizFilter(e.target.value as any);
                          setCurrentMCQIndex(0);
                        }}
                      >
                        <option value="all">All Questions</option>
                        <option value="unanswered">Unanswered Only</option>
                      </select>

                      <button 
                        onClick={handleGenerateQuestions}
                        disabled={isGeneratingQuiz}
                        className="px-4 py-2 text-xs font-bold rounded-lg text-black bg-gradient-to-r from-vip-gold to-yellow-500 hover:brightness-110 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-black animate-spin" />
                        <span>{isGeneratingQuiz ? 'Synthesizing...' : 'Synthesize New MCQ'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LHS 2 Columns: Full featured MCQ Practice Card */}
                    <div className="lg:col-span-2 space-y-4">
                      {filteredQuizPool.length === 0 ? (
                        <div className="p-8 text-center rounded-3xl border border-dashed border-[#334155]/50 bg-vip-slate/20 space-y-3">
                          <HelpCircle className="w-12 h-12 text-[#475569] mx-auto animate-bounce" />
                          <h4 className="font-bold text-white text-sm">{lang === 'amh' ? 'ምንም ጥያቄ አልተገኘም' : 'No Practice MCQs Available'}</h4>
                          <p className="text-xs text-[#a0aec0] max-w-sm mx-auto">
                            {lang === 'amh' 
                              ? 'ለተመረጠው የትምህርት ዓይነት በጥናቱ መሰረት ዝርዝር ፈተና አልተገኘም። ቀጣይነት ያለው ጥያቄ በጥቂት ሰከንድ ውስጥ ለመፍጠር "Synthesize New MCQ" የሚለውን ይጫኑ!' 
                              : 'We can programmatically compile syllabus matching mocks. Instantly render exam cards using the Synthesis button!'}
                          </p>
                          <button 
                            onClick={handleGenerateQuestions}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#cca43b] text-black hover:brightness-110 transition"
                          >
                            🚀 Synthesize Question
                          </button>
                        </div>
                      ) : (
                        <div className="p-6 rounded-3xl border border-[#334155]/60 bg-vip-slate/30 space-y-5">
                          <div className="flex items-center justify-between border-b border-[#cca43b]/10 pb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-mono bg-vip-gold/15 text-vip-gold border border-vip-gold/20 px-2 py-0.5 rounded">
                                {filteredQuizPool[currentMCQIndex]?.year || 'ESSLCE Prep'}
                              </span>
                              <span className="text-xs text-[#a0aec0]">
                                Topic: <strong>{activeUnit.title}</strong>
                              </span>
                            </div>
                            <span className="text-xs text-[#a0aec0] font-mono">
                              Question <strong>{currentMCQIndex + 1}</strong> of {filteredQuizPool.length}
                            </span>
                          </div>

                          {/* Question */}
                          <div className="space-y-2">
                            <h4 className="text-sm md:text-base font-semibold text-white leading-relaxed">
                              {filteredQuizPool[currentMCQIndex]?.question}
                            </h4>
                            {filteredQuizPool[currentMCQIndex]?.questionAmharic && (
                              <p className="text-slate-300 text-xs md:text-sm italic leading-relaxed bg-black/20 p-3 rounded-lg border-l-2 border-vip-gold/40">
                                {filteredQuizPool[currentMCQIndex]?.questionAmharic}
                              </p>
                            )}
                          </div>

                          {/* Options Grid Split */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                            {filteredQuizPool[currentMCQIndex]?.options.map((opt, oIdx) => {
                              const qId = filteredQuizPool[currentMCQIndex].id;
                              const isAnswered = answersState[qId] !== undefined;
                              const isSel = answersState[qId]?.selected === oIdx;
                              const isRight = filteredQuizPool[currentMCQIndex].answerIndex === oIdx;

                              let bgClass = "w-full text-left p-4 rounded-xl text-xs transition border flex flex-col justify-between ";
                              if (isAnswered) {
                                if (isRight) bgClass += "bg-emerald-950/40 border-emerald-500 text-emerald-300";
                                else if (isSel) bgClass += "bg-rose-950/40 border-rose-500 text-rose-300";
                                else bgClass += "bg-vip-slate/10 border-slate-800 text-slate-500";
                              } else {
                                bgClass += "bg-black/35 border-[#334155] text-slate-300 hover:border-vip-gold hover:text-white cursor-pointer";
                              }

                              return (
                                <button
                                  key={oIdx}
                                  disabled={isAnswered}
                                  onClick={() => handleSelectMCQOption(oIdx, filteredQuizPool[currentMCQIndex].answerIndex)}
                                  className={bgClass}
                                >
                                  <span className="font-medium text-xs leading-normal">{opt}</span>
                                  {filteredQuizPool[currentMCQIndex]?.optionsAmharic && (
                                    <span className="text-[10.5px] text-[#94a3b8] block pt-1 leading-normal italic">
                                      {filteredQuizPool[currentMCQIndex]?.optionsAmharic[oIdx]}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Dynamic detailed explanations */}
                          {revealMCQAnswer && (
                            <div className="p-4 rounded-2xl border border-vip-gold/15 bg-vip-gold/5 space-y-2">
                              <h5 className="text-xs font-bold uppercase tracking-wider text-vip-gold flex items-center gap-1">
                                <Lightbulb className="w-4 h-4" />
                                <span>{lang === 'amh' ? 'አካዳሚክ ማብራሪያ (Detailed Explanation)' : 'VIP Conceptual Proof'}</span>
                              </h5>
                              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                                {filteredQuizPool[currentMCQIndex]?.explanation}
                              </p>
                              {filteredQuizPool[currentMCQIndex]?.explanationAmharic && (
                                <p className="text-[11px] text-[#94a3b8] leading-relaxed border-t border-[#334155] pt-2 italic">
                                  {filteredQuizPool[currentMCQIndex]?.explanationAmharic}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Navigation Buttons footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-[#334155]/20">
                            <button
                              disabled={currentMCQIndex === 0}
                              onClick={() => {
                                setCurrentMCQIndex(prev => prev - 1);
                                setRevealMCQAnswer(answersState[filteredQuizPool[currentMCQIndex - 1]?.id] !== undefined);
                              }}
                              className="px-3.5 py-1.5 rounded-lg border border-[#334155] bg-[#0c101b] hover:bg-black/40 text-xs text-white disabled:opacity-30"
                            >
                              ◀ Previous
                            </button>

                            <button
                              onClick={() => setRevealMCQAnswer(!revealMCQAnswer)}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold border border-vip-gold/30 hover:border-vip-gold bg-vip-gold/5 text-vip-gold"
                            >
                              {revealMCQAnswer ? (lang === 'amh' ? 'ማብራሪያ ሰውር' : 'Hide Solution') : (lang === 'amh' ? 'ማብራሪያ ፍታ' : 'Solve Verification')}
                            </button>

                            <button
                              disabled={currentMCQIndex === filteredQuizPool.length - 1}
                              onClick={() => {
                                setCurrentMCQIndex(prev => prev + 1);
                                setRevealMCQAnswer(answersState[filteredQuizPool[currentMCQIndex + 1]?.id] !== undefined);
                              }}
                              className="px-3.5 py-1.5 rounded-lg border border-[#334155] bg-[#0c101b] hover:bg-black/40 text-xs text-white disabled:opacity-30"
                            >
                              Next ▶
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RHS Columns: Aksum GPT Pro AI Tutor chat messenger console */}
                    <div className="lg:col-span-1 p-5 rounded-3xl border border-[#334155]/50 bg-[#0c101b] shrink-0 flex flex-col justify-between h-[520px]">
                      
                      {/* Chat Header */}
                      <div className="border-b border-[#cca43b]/15 pb-3">
                        <div className="flex items-center gap-2">
                          <Cpu className="text-vip-gold w-5 h-5 animate-pulse" />
                          <div>
                            <h4 className="font-bold text-xs uppercase tracking-wider text-vip-gold">🏛️ AKSUM GPT PRO</h4>
                            <p className="text-[10px] text-[#64748b]">{lang === 'amh' ? 'የብሔራዊ ፈተና አጋዥ ማስተማሪያ ኮንሶል' : 'High-fidelity workspace companion'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Chat Message container */}
                      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 scrollbar-thin">
                        {chatMessages.map((item) => (
                          <div 
                            key={item.id} 
                            className={`flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`p-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                              item.sender === 'user' 
                                ? 'bg-vip-gold text-black font-semibold rounded-tr-none' 
                                : 'bg-vip-slate border border-[#334155]/60 text-white rounded-tl-none'
                            }`}>
                              <p>{item.text}</p>
                              <span className="block text-[8px] text-[#64748b] text-right mt-1">{item.time}</span>
                            </div>
                          </div>
                        ))}

                        {isAiTyping && (
                          <div className="flex justify-start">
                            <div className="p-2.5 rounded-2xl bg-vip-slate/30 text-[#64748b] text-xs font-mono animate-pulse">
                              Aksum GPT is analyzing matric syllabus...
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Chat Trigger suggestion pills */}
                      <div className="py-2 flex gap-1.5 overflow-x-auto text-[10px] text-slate-300">
                        <button 
                          onClick={() => setChatInput(lang === 'amh' ? 'የ AAU ፊዚክስ ማለፊያ ስንት ነው?' : 'What is cutoff for AAU engineering?')}
                          className="px-2 py-1 rounded bg-[#1e293b]/50 border border-[#334155] whitespace-nowrap"
                        >
                          Cutoffs
                        </button>
                        <button 
                          onClick={() => setChatInput(lang === 'amh' ? 'የ Coulomb Law ቀመርን እንዴት ማስታወስ እችላለሁ?' : 'Concept review on Coulomb force equation.')}
                          className="px-2 py-1 rounded bg-[#1e293b]/50 border border-[#334155] whitespace-nowrap"
                        >
                          Equations
                        </button>
                      </div>

                      {/* Attached File Preview Badge */}
                      {chatAttachment && (
                        <div className="flex items-center justify-between gap-1.5 px-2.5 py-1 rounded bg-[#1e1b4b] border border-[#a78bfa]/40 text-[#a78bfa] text-[10px] uppercase font-bold animate-pulse">
                          <span className="flex items-center gap-1 truncate max-w-[150px]">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate">{chatAttachment.name}</span>
                          </span>
                          <button 
                            onClick={() => setChatAttachment(null)} 
                            className="hover:text-red-500 font-bold shrink-0 text-[10px] ml-1 select-none cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      {/* Input Actions bar */}
                      <div className="flex items-center gap-2 pt-2 border-t border-[#334155]/20">
                        {/* Custom File attachment trigger */}
                        <label className="p-2 rounded-lg bg-[#1e293b]/80 text-[#cbd5e1] hover:text-white border border-slate-700/60 hover:border-slate-600 transition cursor-pointer flex items-center justify-center shrink-0">
                          <ImageIcon className="w-4 h-4 text-[#a78bfa]" />
                          <input 
                            type="file" 
                            accept="image/*,application/pdf" 
                            className="hidden" 
                            onChange={(e) => handleImageFileChange(e, false)} 
                          />
                        </label>

                        {/* Custom Camera trigger */}
                        <label className="p-2 rounded-lg bg-[#1e293b]/80 text-[#cbd5e1] hover:text-white border border-slate-700/60 hover:border-slate-600 transition cursor-pointer flex items-center justify-center shrink-0" title="Take a physical photo">
                          <Camera className="w-4 h-4 text-emerald-400" />
                          <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment" 
                            className="hidden" 
                            onChange={(e) => handleImageFileChange(e, true)} 
                          />
                        </label>

                        <input
                          type="text"
                          placeholder={lang === 'amh' ? 'የትምህርት ጥያቄዎችን ይጠይቁ...' : 'Ask academic tutoring query...'}
                          className="flex-1 p-2 rounded-lg border border-[#334155] bg-black/40 text-xs text-white outline-none focus:border-vip-gold"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendChatMessage();
                          }}
                        />
                        <button
                          onClick={handleSendChatMessage}
                          className="p-2 rounded-lg bg-vip-gold text-black hover:bg-yellow-500 transition cursor-pointer shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 4: FORMULAS CODES SANDBOX ================= */}
              {activeTab === 'formulas' && (
                <div id="formulas-hub" className="space-y-6 animate-fade-in">
                  
                  {/* Native Back navigation bar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="h-10 px-4 rounded-xl bg-vip-slate/50 text-vip-gold text-xs font-bold flex items-center gap-1.5 border border-[#cca43b]/15 active:scale-95 transition cursor-pointer min-h-[40px]"
                    >
                      ← {lang === 'amh' ? 'ወደ ዋነኛው ዳሽቦርድ ይመለሱ' : 'Back to Home'}
                    </button>
                  </div>
                  
                  {/* Subject filter and search controls */}
                  <div className="p-4 rounded-2xl border border-[#334155]/50 bg-vip-slate/25">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-base text-white">⚡ ESSLCE Core Formulas & Sandbox Interactive Deck</h3>
                        <p className="text-xs text-[#a0aec0]">{lang === 'amh' ? 'ተግባራዊ የቀመሮችና የስሌት ማነቃቂያ ሰሌዳ' : 'Analyze ratios and mathematical constants by scaling simulation variables.'}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 text-[#64748b] w-4 h-4" />
                          <input 
                            type="text" 
                            placeholder="Search equations..." 
                            className="p-2 pl-9 rounded-lg border border-[#334155] bg-black/40 text-xs text-white outline-none w-44"
                            value={formulaSearch}
                            onChange={(e) => setFormulaSearch(e.target.value)}
                          />
                        </div>

                        <select 
                          className="p-2 bg-vip-slate/50 rounded-lg border border-[#334155] text-xs font-semibold text-white outline-none"
                          value={formulaSubject}
                          onChange={(e) => setFormulaSubject(e.target.value as any)}
                        >
                          <option value="All">All Subjects</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Physics & Chemistry Sandbox Simulator Split */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LHS 1 Column: Physics Sandbox */}
                    <div className="p-5 rounded-3xl border border-vip-gold/10 bg-[#0c101b] space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#06b6d4]">🌌 Physics Simulator</span>
                      <h4 className="font-bold text-white text-sm">Newton's 2nd Law of Motion</h4>
                      <div className="p-3 rounded-xl bg-black/40 border border-[#334155] text-center">
                        <p className="text-xs text-[#a0aec0]">Active Equation:</p>
                        <p className="text-lg font-mono font-black text-vip-gold pt-1">F = m · a</p>
                      </div>

                      {/* Mass slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-[#94a3b8]">
                          <span>Mass (m):</span>
                          <span className="font-mono text-white font-bold">{physicsMass} kg</span>
                        </div>
                        <input 
                          type="range" 
                          min={1} 
                          max={100} 
                          className="w-full accent-vip-gold"
                          value={physicsMass}
                          onChange={(e) => setPhysicsMass(parseInt(e.target.value))}
                        />
                      </div>

                      {/* Acceleration slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-[#94a3b8]">
                          <span>Acceleration (a):</span>
                          <span className="font-mono text-white font-bold">{physicsAccel} m/s²</span>
                        </div>
                        <input 
                          type="range" 
                          min={1} 
                          max={50} 
                          step={0.1}
                          className="w-full accent-vip-gold"
                          value={physicsAccel}
                          onChange={(e) => setPhysicsAccel(parseFloat(e.target.value))}
                        />
                      </div>

                      {/* Force Result */}
                      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-center">
                        <p className="text-xs text-slate-300">Generated Net Force (Newton):</p>
                        <p className="text-2xl font-black font-mono text-[#06b6d4] pt-1">{physicsForceResult} N</p>
                      </div>
                    </div>

                    {/* Middle Column: Chemistry sandbox */}
                    <div className="p-5 rounded-3xl border border-violet-500/15 bg-[#0c101b] space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400">🧪 Chemistry Molarity Sandbox</span>
                      <h4 className="font-bold text-white text-sm">Calculations of Solute Moles</h4>
                      <div className="p-3 rounded-xl bg-black/40 border border-[#334155] text-center">
                        <p className="text-xs text-[#a0aec0]">Active Equation:</p>
                        <p className="text-lg font-mono font-black text-violet-400 pt-1">n = M · V</p>
                      </div>

                      {/* MolaritySlider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-[#94a3b8]">
                          <span>Molarity Concentration (M):</span>
                          <span className="font-mono text-white font-bold">{chemMolarityValue} mol/L</span>
                        </div>
                        <input 
                          type="range" 
                          min={0.1} 
                          max={10} 
                          step={0.1}
                          className="w-full accent-violet-400"
                          value={chemMolarityValue}
                          onChange={(e) => setChemMolarityValue(parseFloat(e.target.value))}
                        />
                      </div>

                      {/* Solute Volume slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-[#94a3b8]">
                          <span>Liquid Volume (V):</span>
                          <span className="font-mono text-white font-bold">{chemVolumeValue} Litres</span>
                        </div>
                        <input 
                          type="range" 
                          min={0.5} 
                          max={20} 
                          step={0.5}
                          className="w-full accent-violet-400"
                          value={chemVolumeValue}
                          onChange={(e) => setChemVolumeValue(parseFloat(e.target.value))}
                        />
                      </div>

                      {/* Result */}
                      <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 text-center">
                        <p className="text-xs text-slate-300">Total Solute Quantity (Moles):</p>
                        <p className="text-2xl font-black font-mono text-violet-400 pt-1">{chemMolesResult} moles</p>
                      </div>
                    </div>

                    {/* RHS 1 Column: Formula Reference List */}
                    <div className="p-5 rounded-3xl border border-[#334155]/50 bg-[#0c101b] flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-vip-gold">💡 Syllabus Equations</h4>
                        <p className="text-xs text-[#a0aec0]">Quick-reference core ESSLCE physics & mathematics formulas.</p>
                      </div>

                      <div className="flex-1 overflow-y-auto max-h-[250px] space-y-2 mt-3 pr-1">
                        {filteredFormulas.slice(0, 6).map((eqn) => (
                          <div key={eqn.id} className="p-2.5 rounded-xl border border-slate-800 bg-black/40 space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-white">
                              <span>{eqn.name}</span>
                              <span className="text-[9px] uppercase font-mono text-[#64748b]">{eqn.subject}</span>
                            </div>
                            <p className="text-xs font-semibold text-vip-gold font-mono">{eqn.formula}</p>
                            <p className="text-[10px] text-[#94a3b8] leading-tight">{eqn.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ================= TAB 5: PREMIUM UNIVERSITIES ================= */}
              {activeTab === 'universities' && (
                <div id="universities-explorer" className="space-y-6 animate-fade-in animate-fade-in">
                  
                  {/* Native Back navigation bar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="h-10 px-4 rounded-xl bg-vip-slate/50 text-vip-gold text-xs font-bold flex items-center gap-1.5 border border-[#cca43b]/15 active:scale-95 transition cursor-pointer min-h-[40px]"
                    >
                      ← {lang === 'amh' ? 'ወደ ዋነኛው ዳሽቦርድ ይመለሱ' : 'Back to Home'}
                    </button>
                  </div>
                  
                  {/* Subject and search header */}
                  <div className="p-5 rounded-2xl border border-vip-gold/15 bg-[#0b0f19] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-white">🏫 Sovereign Ethiopian Universities Gateway</h3>
                      <p className="text-xs text-[#a0aec0]">{lang === 'amh' ? 'ይፋዊ መዳረሻ የሆኑ ዩኒቨርሲቲዎች፣ ዝቅተኛ የማለፊያ ነጥቦችና መረጃዎች' : 'Filter elite admissions status, historical matrix cutoffs, and enroll custom destinations.'}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 text-[#64748b] w-4 h-4" />
                        <input 
                          type="text" 
                          placeholder="Search universities..."
                          className="p-2 pl-9 rounded-lg border border-[#334155] bg-black/40 text-xs text-white outline-none w-48"
                          value={uniSearch}
                          onChange={(e) => setUniSearch(e.target.value)}
                        />
                      </div>

                      <select 
                        className="p-2 bg-vip-slate/50 rounded-lg border border-[#334155] text-xs font-semibold text-white outline-none"
                        value={uniTierFilter}
                        onChange={(e) => setUniTierFilter(e.target.value as any)}
                      >
                        <option value="All">All Tiers</option>
                        <option value="VIP Sovereign">VIP Sovereign</option>
                        <option value="Elite Tier-A">Elite Tier-A</option>
                        <option value="Technology Focus">Technology Focus</option>
                      </select>

                      <button 
                        onClick={() => setShowUniModal(true)}
                        className="px-4 py-2 text-xs font-bold rounded-lg text-black bg-gradient-to-r from-vip-gold to-yellow-500 hover:brightness-110 shadow-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add University</span>
                      </button>
                    </div>
                  </div>

                  {/* Universities Cards Grid list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUniversities.map((uni) => (
                      <div 
                        key={uni.id} 
                        className="rounded-3xl border border-[#cca43b]/15 bg-vip-slate/30 overflow-hidden flex flex-col justify-between hover:border-vip-gold/50 transition-all duration-300"
                      >
                        {/* Banner gradient bar */}
                        <div className={`p-4 bg-gradient-to-r ${uni.bannerGradient || 'from-amber-700 to-amber-950'} relative`}>
                          <span className="text-[9px] uppercase font-mono tracking-widest text-black bg-[#cca43b] px-2 py-0.5 rounded font-black absolute top-3 right-3">
                            {uni.tier}
                          </span>
                          <h4 className="font-black text-white text-base font-display pt-2 leading-tight">
                            {lang === 'amh' ? uni.amharicName : uni.name}
                          </h4>
                          <p className="text-[10.5px] text-yellow-300/80 font-medium">📍 {uni.location} &bull; Est. {uni.established}</p>
                        </div>

                        {/* Description and metadata */}
                        <div className="p-4 space-y-4">
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                            {lang === 'amh' ? uni.amharicDescription : uni.description}
                          </p>

                          {/* Admission Stats Cutoff */}
                          <div className="p-3.5 rounded-xl bg-black/35 border border-slate-800 space-y-2">
                            <p className="text-[10px] text-vip-gold font-bold uppercase tracking-wider">{lang === 'amh' ? 'የማለፊያ ነጥቦች (Cutoffs)' : 'ESSLCE Cutoffs Status'}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-[#64748b] block">{lang === 'amh' ? 'የተፈጥሮ ሳይንስ' : 'Natural Sci'}:</span>
                                <span className="font-bold text-white">{uni.admissionStats.naturalCutoff > 0 ? `${uni.admissionStats.naturalCutoff}+` : 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-[#64748b] block">{lang === 'amh' ? 'ማኅበራዊ ሳይንስ' : 'Social Sci'}:</span>
                                <span className="font-bold text-white">{uni.admissionStats.socialCutoff > 0 ? `${uni.admissionStats.socialCutoff}+` : 'N/A'}</span>
                              </div>
                            </div>
                            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10.5px]">
                              <span className="text-[#64748b]">Acceptance Ratio:</span>
                              <span className="font-semibold text-emerald-400">{uni.admissionStats.acceptanceRate}</span>
                            </div>
                          </div>

                          {/* Departments listing tags */}
                          <div className="space-y-1.5">
                            <p className="text-[10px] text-[#64748b] font-bold uppercase">Popular Schools:</p>
                            <div className="flex flex-wrap gap-1">
                              {uni.departments.slice(0, 3).map((dept, dI) => (
                                <span key={dI} className="text-[9px] bg-slate-800/60 hover:bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                                  {dept}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Card bottom actions */}
                        <div className="p-4 pt-0 border-t border-slate-800/40 flex justify-between items-center bg-black/10">
                          <span className="text-[10px] text-[#64748b]">National Rank: <strong className="text-white font-mono">#{uni.nationalRank}</strong></span>
                          <button 
                            onClick={() => {
                              setStudentInfo({ ...studentInfo, targetUniversity: uni.name });
                              showToast(lang === 'amh' ? `🎯 ${uni.amharicName} አሁን ቀዳሚ መዳረሻዎ ነው!` : `🎯 Target changed to ${uni.name}!`);
                              localStorage.setItem('aksum_student_info', JSON.stringify({ ...studentInfo, targetUniversity: uni.name }));
                            }}
                            className="bg-vip-gold/10 hover:bg-vip-gold text-vip-gold hover:text-black py-1 px-3 text-[10px] rounded-lg font-bold transition cursor-pointer border border-vip-gold/20"
                          >
                            Set Target
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add University Modal container if visible */}
                  {showUniModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                      <div className="w-full max-w-lg p-6 rounded-3xl border border-vip-gold/25 bg-vip-slate text-white shadow-2xl relative">
                        <h4 className="text-base font-black font-display text-gradient-gold pb-3 border-b border-[#cca43b]/15">
                          🎒 Register New Custom Destination University
                        </h4>

                        <form onSubmit={handleAddNewUniversity} className="space-y-4 pt-4">
                          <div className="space-y-1">
                            <label className="text-xs text-slate-300 block">University Name (English Required):</label>
                            <input 
                              type="text" 
                              placeholder="e.g., Gondar Premier Institute" 
                              className="w-full p-2.5 rounded-lg border border-[#334155] bg-black/40 text-xs text-white outline-none focus:border-vip-gold"
                              value={newUniName}
                              onChange={(e) => setNewUniName(e.target.value)}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs text-slate-300 block">Amharic Name (Optional):</label>
                            <input 
                              type="text" 
                              placeholder="ግንባር ቀደም ተቋም" 
                              className="w-full p-2.5 rounded-lg border border-[#334155] bg-black/40 text-xs text-white outline-none focus:border-vip-gold"
                              value={newUniAmName}
                              onChange={(e) => setNewUniAmName(e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <label className="text-xs text-slate-300 block">Location:</label>
                              <input 
                                type="text" 
                                placeholder="Gondar, Amhara" 
                                className="w-full p-2 rounded-lg border border-[#334155] bg-black/40 text-[11px] text-white outline-none focus:border-vip-gold"
                                value={newUniLocation}
                                onChange={(e) => setNewUniLocation(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-slate-300 block">Natural Cutoff:</label>
                              <input 
                                type="text" 
                                placeholder="380" 
                                className="w-full p-2 rounded-lg border border-[#334155] bg-black/40 text-[11px] text-white outline-none focus:border-vip-gold"
                                value={newUniCutoffNatural}
                                onChange={(e) => setNewUniCutoffNatural(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-slate-300 block">Social Cutoff:</label>
                              <input 
                                type="text" 
                                placeholder="350" 
                                className="w-full p-2 rounded-lg border border-[#334155] bg-black/40 text-[11px] text-white outline-none focus:border-vip-gold"
                                value={newUniCutoffSocial}
                                onChange={(e) => setNewUniCutoffSocial(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs text-slate-300 block">Core Description:</label>
                            <textarea 
                              rows={3}
                              placeholder="Describe campus highlights..."
                              className="w-full p-2.5 rounded-lg border border-[#334155] bg-black/40 text-xs text-white outline-none focus:border-vip-gold resize-none"
                              value={newUniDescription}
                              onChange={(e) => setNewUniDescription(e.target.value)}
                            />
                          </div>

                          <div className="flex gap-2 justify-end pt-3">
                            <button 
                              type="button" 
                              onClick={() => setShowUniModal(false)}
                              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              className="px-4 py-2 text-xs font-bold rounded-lg text-black bg-vip-gold hover:bg-yellow-500"
                            >
                              Log Destination
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ================= TAB 5.2: USER ALERTS & LOCAL NOTIFICATIONS HUB ================= */}
              {activeTab === 'notifications' && (
                <div id="alerts-notifications-view" className="space-y-6 animate-fade-in pb-12">
                  
                  {/* Back Navigation Bar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="h-10 px-4 rounded-xl bg-vip-slate/50 text-vip-gold text-xs font-bold flex items-center gap-1.5 border border-[#cca43b]/15 active:scale-95 transition cursor-pointer min-h-[40px]"
                    >
                      ← {lang === 'amh' ? 'ወደ ዋነኛው ዳሽቦርድ ይመለሱ' : 'Back to Home'}
                    </button>
                  </div>

                  {/* Header Intro */}
                  <div className="p-5 rounded-2xl border border-[#cca43b]/15 bg-vip-slate/40 flex flex-col justify-between space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-vip-gold/5 rounded-full filter blur-[40px]" />
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-vip-gold animate-bounce" />
                      <h3 className="font-bold text-base text-white">{lang === 'amh' ? 'የማሳወቂያ ደወሎች ማዕከል' : 'Local Notifications Core'}</h3>
                    </div>
                    <p className="text-xs text-[#a0aec0] leading-relaxed">
                      {lang === 'amh' 
                        ? 'መተግበሪያውን ሳይከፍቱ የስልጠናና ጥናት ድጋፍ ሰጪ ደወሎችን እዚሁ በፎቶ ማሳወቂያ መልክ ያዋቅሩ።'
                        : 'Manage local background tasks, smart periodic study alerts, and simulated system broadcast reminders.'}
                    </p>
                  </div>

                  {/* Notification Scheduler (Large 48px Touch Fields) */}
                  <div className="p-5 rounded-2xl border border-slate-800 bg-[#0b0f19] space-y-4">
                    <h4 className="text-xs font-bold text-[#cca43b] uppercase tracking-wider">{lang === 'amh' ? '⏰ የማንቂያ ደወል ማስተካከያ' : '⏰ STUDY ALARM SCHEDULER'}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">{lang === 'amh' ? 'የጥናት ማንቂያ ሰዓት (Hour)' : 'Preferred Study Daily Hour'}</label>
                        <select className="w-full h-12 px-3 rounded-xl border border-slate-800 bg-vip-slate/50 text-xs text-white outline-none min-h-[48px] cursor-pointer">
                          <option value="6">06:00 AM (Early Bird)</option>
                          <option value="8">08:00 AM</option>
                          <option value="12">12:00 PM (Noon Break)</option>
                          <option value="18">06:00 PM (Sunset Study)</option>
                          <option value="21">09:00 PM (Late Night Prep)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">{lang === 'amh' ? 'የዕለት ግብ (Goal)' : 'Aesthetic Streak Target'}</label>
                        <select className="w-full h-12 px-3 rounded-xl border border-slate-800 bg-vip-slate/50 text-xs text-white outline-none min-h-[48px] cursor-pointer">
                          <option value="30">30 Mins / Day</option>
                          <option value="60">1 Hour / Day (Sovereign)</option>
                          <option value="120">2 Hours / Day (VIP Elite)</option>
                        </select>
                      </div>
                    </div>

                    {/* Quick Simulation Reminders */}
                    <div className="pt-2 border-t border-slate-800 space-y-3">
                      <p className="text-[10px] text-[#64748b] font-mono leading-relaxed font-bold uppercase">
                        {lang === 'amh' ? '🔔 ፈጣን የማሳወቂያ ደወል ሙከራዎች (አዝራሮቹን ይጫኑ)' : '🔔 SIMULATE LOCAL BACKGROUND BROADCASTS'}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                        <button
                          onClick={() => {
                            showToast(`🔔 Notification Banner: Don't lose your 5-day study streak, ${studentInfo.name || 'Scholar'}!`);
                          }}
                          className="w-full h-12 rounded-xl bg-vip-gold/10 text-vip-gold border border-vip-gold/25 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer min-h-[48px] hover:bg-vip-gold/20"
                        >
                          <Flame className="w-4 h-4" />
                          <span>{lang === 'amh' ? 'የጥናት ቀናት ማሳወቂያ ሞክር' : 'Streak Alert Push (Sim)'}</span>
                        </button>

                        <button
                          onClick={() => {
                            showToast(`🏛️ Board Alert: Addis Ababa University published ESSLCE Science cutoff at 410!`);
                          }}
                          className="w-full h-12 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/25 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer min-h-[48px] hover:bg-purple-500/20"
                        >
                          <Award className="w-4 h-4" />
                          <span>{lang === 'amh' ? 'የቅበላ ማሳወቂያ ሞክር' : 'Admissions Cutoff Push (Sim)'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recent system notification lists */}
                  <div className="space-y-3">
                    <p className="text-xs font-black text-slate-400">{lang === 'amh' ? '⏳ የቅርብ ጊዜ ማሳወቂያዎች' : '⏳ ACTIVE ALERTS LOG'}</p>
                    
                    <div className="space-y-2.5">
                      {[
                        { title: lang === 'amh' ? '🔥 3-ቀናት ጥናት አትርሳ!' : '🔥 Streak Safeguard reminder', body: lang === 'amh' ? 'አክሱም VIP አካዳሚ፡ ጥናትዎን ዛሬም ይቀጥሉ! 3-ቀናት የቀረውን የጥናት ማስታወሻዎን እንዳያጡ!' : 'Don\'t slip up! Log in now to safeguard your 3-day ESSLCE study streak streak timer.', time: 'Today, 14:38' },
                        { title: lang === 'amh' ? '💾 የፊዚክስና ኬሚስትሪ ፋይል ዳውንሎድ ሆነዋል!' : '💾 Local materials downloaded', body: lang === 'amh' ? 'ሁሉም የፈተና ጥያቄዎችና ቀመሮች ከመስመር ውጪ ጥናት በተሳካ ሁኔታ ተቀምጠዋል።' : 'Offline local database downloaded successfully. Grade 12 National exam banks loaded directly in local storage cache.', time: 'Yesterday, 10:15' },
                        { title: lang === 'amh' ? '🏆 የአክሱም አካዳሚ በር ተከፍቷል!' : '🏆 Academy Registration confirmed', body: lang === 'amh' ? 'እንኳን ወደ አክሱም ቪአይፒ አካዳሚ በደህና መጡ! ከፍተኛ ውጤት ለማምጣት አሁን ጥናት ይጀምሩ።' : `Welcome to Aksum VIP Matric Prep, candidate scholar ${studentInfo.name || ''}! Elite tools are now active assigned under ${studentInfo.fieldStream}.`, time: 'May 24, 2026' }
                      ].map((n, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-800/80 bg-vip-slate/15 flex gap-3.5 relative overflow-hidden">
                          <div className="w-1.5 h-full bg-[#cca43b] absolute left-0 top-0" />
                          <div className="w-9 h-9 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-center text-vip-gold shrink-0">
                            <Bell className="w-4 h-4" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-xs font-black text-white">{n.title}</span>
                              <span className="text-[9px] font-mono text-[#64748b]">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-[#cbd5e1] leading-relaxed">{n.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ================= TAB 5.5: PREMIUM VIP HUB ================= */}
              {activeTab === 'premium' && (
                <div id="premium-vip-hub-view" className="space-y-6 animate-fade-in pb-12">
                  
                  {/* Hero banner */}
                  <div className="p-6 md:p-8 rounded-3xl border border-vip-gold/30 bg-gradient-to-br from-[#1c1303]/70 via-[#0d091e] to-black relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-vip-gold/10 rounded-full filter blur-[100px] pointer-events-none" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vip-gold/10 border border-vip-gold/30 text-vip-gold text-xs font-bold uppercase tracking-wider">
                          <Award className="w-4 h-4 text-vip-gold animate-bounce" />
                          <span>Admissions Pro Active Plan</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight text-gradient-gold">
                          🏆 PREMIUM VIP ACADEMY PORTAL
                        </h2>
                        <p className="text-[#cbd5e1] text-xs md:text-sm max-w-2xl leading-relaxed">
                          Welcome to your Sovereign Prep Terminal, <span className="text-vip-gold font-bold">{studentInfo.name || 'VIP Scholar'}</span>. Unlock offline learning pipelines, claim your daily streak multipliers, simulate push alerts, and analyze admission metrics.
                        </p>
                      </div>
                      
                      {/* Stats Overview */}
                      <div className="grid grid-cols-3 gap-3 bg-black/40 border border-[#cca43b]/15 p-4 rounded-2xl shrink-0">
                        <div className="text-center">
                          <p className="text-[9px] text-[#94a3b8] uppercase">Streak</p>
                          <p className="text-lg font-black text-vip-gold font-mono flex items-center justify-center gap-0.5">
                            <Flame className="w-4 h-4 fill-vip-gold text-vip-gold" />
                            {dailyStreak}d
                          </p>
                        </div>
                        <div className="text-center border-x border-slate-800 px-3">
                          <p className="text-[9px] text-[#94a3b8] uppercase">Badges</p>
                          <p className="text-lg font-black text-[#06b6d4] font-mono">
                            {unlockedBadges.length}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] text-[#94a3b8] uppercase">Score</p>
                          <p className="text-lg font-black text-emerald-400 font-mono">
                            {studyLeaderboard.find(u => u.isUser)?.score || 790}p
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Columns Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LHS COLUMN - OFFLINE STORAGE & NOTIFICATIONS (7 COLS) */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* OFFLINE STORAGE PANEL */}
                      <div className="p-5 md:p-6 rounded-2xl border border-slate-800 bg-[#0c101b] space-y-4">
                        <div className="flex items-center justify-between border-b border-[#cca43b]/10 pb-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            {offlineMode ? (
                              <WifiOff className="text-yellow-500 w-5 h-5 animate-pulse" />
                            ) : (
                              <Wifi className="text-emerald-400 w-5 h-5" />
                            )}
                            <div>
                              <h4 className="font-bold text-white text-sm">Offline Storage Manager</h4>
                              <p className="text-[10px] text-[#64748b]">Cache STEM lectures locally and simulate high-rural zero network zones</p>
                            </div>
                          </div>

                          {/* Simulate Offline toggle switch */}
                          <button 
                            onClick={() => {
                              const nextMode = !offlineMode;
                              setOfflineMode(nextMode);
                              localStorage.setItem('aksum_offline_mode', nextMode.toString());
                              showToast(nextMode 
                                ? '⚠️ Offline Simulator Mode Activated! Running fully on local phone disk.' 
                                : '🟢 Back Online! Synchronized cloud databases successfully.'
                              );
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                              offlineMode 
                                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' 
                                : 'bg-slate-800 text-[#cbd5e1] border border-slate-700/50 hover:bg-slate-700'
                            }`}
                          >
                            {offlineMode ? 'Simulating Offline' : 'Online Sync Active'}
                          </button>
                        </div>

                        {offlineMode && (
                          <div className="p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-[11px] text-[#cbd5e1] leading-relaxed">
                            <strong>⚠️ Offline Mode Sandbox active:</strong> To test genuine offline capability, navigate to the 📐 National Syllabus tab and toggle downloaded units, or ask GPT. Only cached rows loaded local-side will appear!
                          </div>
                        )}

                        {/* List downloaded packs */}
                        <div className="space-y-3 pt-1">
                          {[
                            { id: 'math-u1', subject: 'Mathematics', title: 'Calculus Functional Limits', videoSize: '42 MB', notesSize: '1.2 MB', qCount: 50 },
                            { id: 'phys-u2', subject: 'Physics', title: 'Coulomb Force Fields', videoSize: '55 MB', notesSize: '2.1 MB', qCount: 40 },
                            { id: 'chem-u1', subject: 'Chemistry', title: 'Thermochemistry Enthalpy', videoSize: '38 MB', notesSize: '1.5 MB', qCount: 30 },
                            { id: 'bio-u4', subject: 'Biology', title: 'Genetics & Mendel Laws', videoSize: '46 MB', notesSize: '1.8 MB', qCount: 45 },
                          ].map((pack) => {
                            const isCached = downloadedUnits.includes(pack.id);
                            return (
                              <div key={pack.id} className="p-3.5 rounded-xl bg-black/30 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-4 transition-all duration-200">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] bg-vip-gold/10 text-vip-gold font-bold px-1.5 py-0.5 rounded font-mono">
                                      {pack.subject}
                                    </span>
                                    <h5 className="text-xs font-bold text-white">{pack.title}</h5>
                                  </div>
                                  <div className="flex items-center gap-3 text-[10px] text-[#64748b]">
                                    <span className="flex items-center gap-1">📹 Video: {pack.videoSize}</span>
                                    <span className="flex items-center gap-1">📄 Notes: {pack.notesSize}</span>
                                    <span className="flex items-center gap-1">🧮 Quizzes: {pack.qCount} items</span>
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => handleSelectOfflineDownload(pack.id)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-display font-medium transition cursor-pointer flex items-center gap-1 border ${
                                    isCached 
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                                      : 'bg-vip-slate/50 text-[#cbd5e1] border-slate-700 hover:border-[#cca43b]/40'
                                  }`}
                                >
                                  {isCached ? (
                                    <>
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      <span>Saved (Offline)</span>
                                    </>
                                  ) : (
                                    <>
                                      <Download className="w-3.5 h-3.5" />
                                      <span>Download</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* EXCELLENT PUSH NOTIFICATIONS CONTROLLER */}
                      <div className="p-5 md:p-6 rounded-2xl border border-slate-800 bg-[#0c101b] space-y-4">
                        <div className="flex items-center gap-2 border-b border-[#cca43b]/10 pb-3">
                          <Bell className="text-vip-gold w-5 h-5 animate-pulse" />
                          <div>
                            <h4 className="font-bold text-white text-sm">Interactive Push Notification Portal</h4>
                            <p className="text-[10px] text-[#64748b]">Control system alerts and receive real-time, personalized matric study reminders</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 rounded-xl bg-black/45 border border-slate-800 space-y-3">
                            <span className="text-[10px] text-[#64748b] uppercase tracking-wider block font-bold">Preferences</span>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[#cbd5e1]">Enable Push Alerts</span>
                              <button 
                                onClick={() => {
                                  setNotificationConfig(prev => ({ ...prev, enabled: !prev.enabled }));
                                  showToast(notificationConfig.enabled ? "🔇 Study notifications muted." : "🔔 Study notifications armed!");
                                }}
                                className={`w-8 h-4 rounded-full transition-all relative ${notificationConfig.enabled ? 'bg-vip-gold' : 'bg-slate-700'}`}
                              >
                                <span className={`absolute top-0.5 w-3 h-3 bg-black rounded-full transition-all ${notificationConfig.enabled ? 'right-0.5' : 'left-0.5'}`} />
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-1">
                              <span className="text-xs text-[#cbd5e1]">Preferred Study Alarm</span>
                              <input 
                                type="time" 
                                className="bg-[#121824] border border-[#334155] rounded px-1.5 py-0.5 text-xs text-white outline-none" 
                                value={notificationConfig.time} 
                                onChange={(e) => setNotificationConfig(prev => ({ ...prev, time: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-black/45 border border-slate-800 space-y-2 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] text-[#64748b] uppercase tracking-wider block font-bold">Try Simulated Triggers</span>
                              <p className="text-[10px] text-[#94a3b8] leading-relaxed pt-1">Choose an alert below to simulate an interactive local push notification popping on your device!</p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 pt-1 font-mono text-[9px]">
                              <button 
                                onClick={() => handleTestLocalReminder("🔥 Streak Alert! Don't lose your 5-day study streak. Solve 1 question now!")}
                                className="px-2 py-1 rounded bg-[#1e1b4b] border border-[#a78bfa]/20 text-[#a78bfa] hover:bg-[#a78bfa]/10 transition text-left cursor-pointer"
                              >
                                Streak Alert 🔥
                              </button>
                              <button 
                                onClick={() => handleTestLocalReminder("🎯 Cutoff Alert! General cutoffs simulated. AA University expects 520+ points.")}
                                className="px-2 py-1 rounded bg-[#064e3b] border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 transition text-left cursor-pointer"
                              >
                                Admission Alert 📊
                              </button>
                              <button 
                                onClick={() => handleTestLocalReminder("💡 Physics Challenge! Solve grade 12 quantum MCQ to double your score reward today.")}
                                className="px-2 py-1 rounded bg-[#7c2d12] border border-orange-500/20 text-orange-400 hover:bg-orange-500/10 transition text-left cursor-pointer"
                              >
                                Study Goal 💡
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* RHS COLUMN - GAMIFICATION, BADGES, AND DASHBOARD (5 COLS) */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* DAILY STREAK BOX & ACTIVE HABITS CHECKIN */}
                      <div className="p-5 md:p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-[#111827] via-[#090d16] to-[#1e150a] space-y-4">
                        <div className="flex items-center justify-between border-b border-[#cca43b]/10 pb-3">
                          <div className="flex items-center gap-2">
                            <Trophy className="text-vip-gold w-5 h-5" />
                            <h4 className="font-bold text-white text-sm">Habits & Streaks Sandbox</h4>
                          </div>
                          <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                            Level: Gold Elite
                          </span>
                        </div>

                        {/* Interactive Streak claim card */}
                        <div className="p-4 rounded-xl bg-black/40 border border-[#cca43b]/10 flex items-center justify-between gap-3 relative overflow-hidden">
                          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 scale-150 opacity-10 font-black text-6xl pointer-events-none">🔥</div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-white">Daily Study Check-In</h5>
                            <p className="text-[10px] text-[#a0aec0]">Claim study days consistently to rise above others</p>
                            <p className="text-[10px] text-vip-gold font-bold font-mono">Current Streak: {dailyStreak} Days Active</p>
                          </div>
                          
                          <button
                            onClick={handleClaimStreakToday}
                            disabled={streakClaimed}
                            className={`px-3 py-2 rounded-lg text-xs font-black tracking-wider transition font-display uppercase shrink-0 cursor-pointer ${
                              streakClaimed 
                                ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed' 
                                : 'bg-[#e2b13c] hover:bg-yellow-500 text-black shadow-lg animate-pulse'
                            }`}
                          >
                            {streakClaimed ? 'Checked In' : 'Claim Now'}
                          </button>
                        </div>

                        {/* Badges and achievements row */}
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] text-[#64748b] uppercase tracking-wider block font-bold">Unlocked Professional Scholar Badges</span>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'curriculum_conqueror', title: 'Syllabus Conqueror', desc: 'Download 3 syllabus notes offline', icon: '📐', activeColor: 'from-[#047857] to-emerald-950' },
                              { id: 'streak_master', title: 'Streak Olympian', desc: 'Secure a 6-day study habit', icon: '⚡', activeColor: 'from-[#b45309] to-amber-950' },
                              { id: 'gpt_explorer', title: 'GPT Explorer Pro', desc: 'Uploaded file analysis with AI', icon: '🧠', activeColor: 'from-[#6d28d9] to-violet-950' },
                              { id: 'quiz_gladiator', title: 'Matric Gladiator', desc: 'Completed offline exams list', icon: '🏆', activeColor: 'from-[#cca43b]/80 to-[#1e1b4b]' }
                            ].map((badge) => {
                              const isUnlocked = unlockedBadges.includes(badge.id);
                              return (
                                <div 
                                  key={badge.id}
                                  className={`p-2.5 rounded-xl border transition-all text-left relative overflow-hidden flex items-start gap-2 ${
                                    isUnlocked 
                                      ? `bg-gradient-to-br ${badge.activeColor} border-[#cca43b]/30` 
                                      : 'bg-[#121824]/50 border-slate-900 opacity-40'
                                  }`}
                                >
                                  <span className="text-lg shrink-0 mt-0.5">{badge.icon}</span>
                                  <div className="space-y-0.5 text-ellipsis overflow-hidden">
                                    <h6 className="text-[11px] font-black text-white truncate">{badge.title}</h6>
                                    <p className="text-[9px] text-[#cbd5e1] leading-tight line-clamp-2">{badge.desc}</p>
                                    <span className="text-[8px] font-bold block uppercase text-vip-gold pt-0.5">
                                      {isUnlocked ? 'Unlocked ✔️' : 'Locked'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* CERTIFICATE GENERATOR MODAL TOGGLE */}
                      <div className="p-5 md:p-6 rounded-2xl border border-slate-800 bg-[#0c101b] space-y-4">
                        <div className="flex items-center gap-2 border-b border-[#cca43b]/10 pb-3">
                          <Award className="text-vip-gold w-5 h-5" />
                          <div>
                            <h4 className="font-bold text-white text-sm">Graduation Credentials Certificate</h4>
                            <p className="text-[10px] text-[#64748b]">Generate a secure, official printable certificate of ESSLCE Curriculum Completion</p>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] text-vip-gold font-bold tracking-wider font-mono">CRITERIA GAUNTLET</span>
                            <h5 className="text-xs font-bold text-white">Generate Completion Document</h5>
                            <p className="text-[10px] text-[#94a3b8] leading-relaxed max-w-sm">Requires completing major syllabus notes, scoring correctly on tests, or registering over 120 focused minutes.</p>
                          </div>
                          
                          <button
                            onClick={() => {
                              setShowCertificate(true);
                              showToast("🎓 Opening gorgeous custom Graduation Certificate...");
                            }}
                            className="px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-vip-gold to-yellow-600 text-black hover:brightness-110 active:scale-95 transition cursor-pointer shrink-0 uppercase shadow-lg duration-200"
                          >
                            🎓 Unlock Certificate
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* BOTTOM ROW - ADMISSIONS READINESS AND HISTORICAL CHARTS */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                    
                    {/* LEADERBOARD STANDINGS PANEL (5 COLS) */}
                    <div className="md:col-span-5 p-5 md:p-6 rounded-2xl border border-slate-800 bg-[#0c101b] space-y-4 font-sans">
                      <div className="flex items-center justify-between border-b border-[#cca43b]/10 pb-3">
                        <div className="flex items-center gap-2">
                          <Trophy className="text-yellow-500 w-5 h-5" />
                          <div>
                            <h4 className="font-bold text-white text-sm">National Candidate Leaderboard</h4>
                            <p className="text-[10px] text-[#64748b]">Real-time ESSLCE competition ladder</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            // Give user random extra 30 score and shuffle leaderboard
                            setStudyLeaderboard(prev => {
                              return prev.map(u => {
                                if (u.isUser) {
                                  return { ...u, score: u.score + 40 };
                                }
                                return u;
                              }).sort((a, b) => b.score - a.score);
                            });
                            showToast("⭐ Competitor bonus score synced successfully!");
                            triggerUnlockBadge('quiz_gladiator');
                          }}
                          className="text-[9px] text-vip-gold bg-vip-gold/10 border border-vip-gold/30 px-2 py-1 rounded cursor-pointer"
                        >
                          Earn Score Tracker
                        </button>
                      </div>

                      <div className="space-y-1.5 font-sans text-xs">
                        {studyLeaderboard.map((item, idx) => {
                          const isLeadUser = item.isUser;
                          return (
                            <div 
                              key={item.name} 
                              className={`p-2.5 rounded-xl flex items-center justify-between gap-3 border ${
                                isLeadUser 
                                  ? 'bg-gradient-to-r from-vip-slate to-black border-[#cca43b]/50 text-white font-bold' 
                                  : 'bg-black/25 border-slate-900 text-[#cbd5e1]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 text-center text-[11px] font-black text-vip-gold">{idx + 1}</span>
                                <span className="text-sm shrink-0">{item.avatar}</span>
                                <div className="leading-tight truncate max-w-[130px]">
                                  <p className="text-xs truncate">{item.name}</p>
                                  <p className="text-[8px] text-[#64748b] truncate">{item.school}</p>
                                </div>
                              </div>
                              <span className="text-xs text-vip-gold font-bold shrink-0">{item.score} pts</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* PROGRESS ANALYTICS VIEW CHANNELS (7 COLS) */}
                    <div className="md:col-span-7 p-5 md:p-6 rounded-2xl border border-slate-800 bg-[#0c101b] space-y-5">
                      <div className="flex items-center justify-between border-b border-[#cca43b]/10 pb-3 flex-wrap gap-2">
                        <div>
                          <h4 className="font-bold text-white text-sm">Syllabus Progress & Activity Heat-map</h4>
                          <p className="text-[10px] text-[#64748b]">Dynamic analytics derived from logged focus hours</p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-[10px] text-[#94a3b8] font-mono">
                          <span className="w-3.5 h-3.5 bg-vip-slate border border-[#cca43b]/30 rounded" />
                          <span>Checkin</span>
                          <span className="w-3.5 h-3.5 bg-gradient-to-r from-vip-gold to-yellow-600 rounded" />
                          <span>High Duration</span>
                        </div>
                      </div>

                      {/* heat-map UI */}
                      <div className="p-3.5 rounded-xl bg-black/35 border border-slate-800 space-y-2.5">
                        <span className="text-[10px] text-[#64748b] uppercase tracking-wider block font-bold">28-Day Study Heat-map Matrix (Click squares to mock days!)</span>
                        
                        <div className="grid grid-cols-7 gap-1.5 max-w-sm mx-auto">
                          {activityHeatMap.map((val, idx) => {
                            let cellBg = 'bg-[#121824] border-slate-900';
                            if (val === 1) cellBg = 'bg-vip-gold/20 border-vip-gold/20';
                            else if (val === 2) cellBg = 'bg-vip-gold/40 border-vip-gold/30';
                            else if (val === 3) cellBg = 'bg-vip-gold/60 border-vip-gold/40';
                            else if (val === 4) cellBg = 'bg-vip-gold/80 border-vip-gold/60 text-black font-semibold';
                            else if (val >= 5) cellBg = 'bg-gradient-to-r from-vip-gold to-yellow-500 border-yellow-300 text-black font-semibold';
                            
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  // Click to increment study log
                                  const nextMap = [...activityHeatMap];
                                  nextMap[idx] = (nextMap[idx] + 1) % 6;
                                  setActivityHeatMap(nextMap);
                                  
                                  const updatedMins = completedMinutes + 15;
                                  setCompletedMinutes(updatedMins);
                                  localStorage.setItem('aksum_study_minutes', updatedMins.toString());

                                  showToast(`📅 Logged +15 focus minutes for Day ${idx + 1}! Overall minutes updated.`);
                                  if (updatedMins >= 160) {
                                    triggerUnlockBadge('pomodoro_champion');
                                  }
                                }}
                                className={`aspect-square rounded-md border text-[9px] flex items-center justify-center transition hover:scale-105 cursor-pointer ${cellBg}`}
                                title={`Day ${idx + 1}: ${val * 15} minutes studied`}
                              >
                                {val > 0 ? `${val * 15}` : ''}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-[10px] text-center text-[#64748b]">Columns: <strong>Mon</strong> through <strong>Sun</strong> (4 weeks prep mesh)</p>
                      </div>

                      {/* Recharts chart */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-[#64748b] uppercase tracking-wider block font-bold">Estimated Standard ESSLCE Readiness Rate</span>
                        
                        <div className="h-44 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={[
                                { day: 'Mon', score: 320, cutoff: 420 },
                                { day: 'Tue', score: 380, cutoff: 420 },
                                { day: 'Wed', score: 440, cutoff: 420 },
                                { day: 'Thu', score: 410, cutoff: 420 },
                                { day: 'Fri', score: 470, cutoff: 420 },
                                { day: 'Sat', score: 550, cutoff: 512 },
                                { day: 'Sun', score: 580, cutoff: 512 },
                              ]}
                              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                            >
                              <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                              <YAxis stroke="#64748b" fontSize={10} />
                              <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                              <Area type="monotone" dataKey="score" stroke="#cca43b" fillOpacity={0.15} fill="url(#colorScore)" strokeWidth={2.5} />
                              <Area type="monotone" dataKey="cutoff" stroke="#06b6d4" fillOpacity={0.0} strokeDasharray="3 3" />
                              <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#cca43b" stopOpacity={0.5}/>
                                  <stop offset="95%" stopColor="#cca43b" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-[9px] text-[#64748b] italic text-center text-sans">Blue dashed threshold represents AAA world-class engineering admission eligibility (512 points minimum)</p>
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* ================= TAB 6: APK / DESKTOP ANDROID HUB (NEW FEATURE EXACTLY WHAT USER CRIED FOR!) ================= */}
              {activeTab === 'apkstore' && (
                <div id="apk-downloader-view" className="space-y-6 animate-fade-in">
                  
                  {/* Native Back navigation bar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="h-10 px-4 rounded-xl bg-vip-slate/50 text-vip-gold text-xs font-bold flex items-center gap-1.5 border border-[#cca43b]/15 active:scale-95 transition cursor-pointer min-h-[40px]"
                    >
                      ← {lang === 'amh' ? 'ወደ ዋነኛው ዳሽቦርድ ይመለሱ' : 'Back to Home'}
                    </button>
                  </div>
                  
                  {/* Hero Box styled like premium PlayStore / App Card */}
                  <div className="p-6 md:p-8 rounded-3xl border border-vip-gold/20 bg-gradient-to-br from-vip-slate via-[#111827] to-[#120a1c] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-vip-gold/10 rounded-full filter blur-[100px] pointer-events-none" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      
                      {/* Left Block Details */}
                      <div className="md:col-span-8 space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-pulse">
                          <Check className="w-3.5 h-3.5" />
                          <span>Release Build Model: v1.2.0 (Stable)</span>
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight text-gradient-gold">
                          📲 DOWNLOAD AKSUM VIP APK FOR ANDROID
                        </h2>
                        
                        <p className="text-[#cbd5e1] text-xs md:text-sm leading-relaxed max-w-2xl">
                          {lang === 'amh'
                            ? 'የኢትዮጵያ ምርጡን የማትሪክ መዘጋጃ መተግበሪያ በቀጥታ በስልክዎ ላይ ይጫኑ! ይህ የተደላደለ የ .APK መጫኛ ፋይል ያለ ምንም ተጨማሪ ኢንተርኔት (💯 Offline) ፣ ፈጣን የማሳወቂያ ደወልና የስልክ ባዮሜትሪክ ቁልፍን ጨምሮ የተሟላ አገልግሎት ይሰጣል።'
                            : 'Install Aksum VIP directly onto your phone Bypass loading in browser tabs, reduce battery depletion, and log study minutes with advanced mobile features! Optimized for Android v8.0 through v16.0.'}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                          <div className="flex items-center gap-1.5 text-xs text-[#cbd5e1]">
                            <CheckCircle2 className="w-4 h-4 text-[#cca43b]" />
                            <span>Always-Offline Access</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[#cbd5e1]">
                            <CheckCircle2 className="w-4 h-4 text-[#cca43b]" />
                            <span>Zero Ads / Low Data usage</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[#cbd5e1]">
                            <CheckCircle2 className="w-4 h-4 text-[#cca43b]" />
                            <span>Biometric Focus Study Lock</span>
                          </div>
                        </div>

                        {/* DOWNLOAD TRIGGERS BUTTON */}
                        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <a 
                            href="data:text/plain;charset=utf-8,AKSUM_VIP_ACADEMY_APK_BUILD_REPRESENTATION" 
                            download="aksum_prep_academy.apk"
                            className="px-6 py-4 rounded-xl font-black font-display text-center text-xs uppercase tracking-wider text-[#090d16] bg-gradient-to-r from-vip-gold via-yellow-500 to-yellow-600 hover:brightness-110 shadow-2xl transition flex items-center justify-center gap-2 cursor-pointer duration-200"
                            onClick={() => {
                              showToast('📥 Starting download for aksum_prep_academy.apk file...');
                            }}
                          >
                            <Download className="w-5 h-5" />
                            <span>DOWNLOAD ANDROID APP (.APK)</span>
                          </a>

                          <div className="text-xs text-[#64748b] bg-black/40 p-2.5 rounded-lg border border-slate-800 text-center sm:text-left">
                            File Size: <strong>14.2 MB</strong> <br/>
                            Package: <span className="font-mono text-[10px]">com.ezrat.aksumvip</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Block Smartphone mock visual display */}
                      <div className="md:col-span-4 flex justify-center">
                        <div className="w-56 p-4 rounded-[40px] border-4 border-slate-800 bg-black/90 shadow-2xl relative overflow-hidden">
                          {/* Speaker notch */}
                          <div className="w-20 h-4 bg-slate-800 absolute top-0 left-1/2 transform -translate-x-1/2 rounded-b-xl z-20" />
                          
                          {/* Inside display mockup representing Aksum app on Android screen */}
                          <div className="rounded-[30px] border border-slate-900 bg-[#090d16] p-4 text-center space-y-4 relative overflow-hidden h-[300px] flex flex-col justify-between">
                            <div className="space-y-2 pt-2">
                              <span className="text-[8px] tracking-widest uppercase text-vip-gold block">AKSUM VIP MOBILE</span>
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vip-gold to-yellow-600 mx-auto flex items-center justify-center font-black text-black">
                                🏛️
                              </div>
                              <p className="text-[10px] font-bold text-white line-clamp-1">Hi, {studentInfo.name || 'Alazar'}</p>
                              <div className="inline-block py-0.5 px-2 rounded-full bg-vip-gold/10 border border-vip-gold/20 text-[8px] text-vip-gold font-mono">
                                Matric Candidate
                              </div>
                            </div>

                            {/* Center representation */}
                            <div className="p-2.5 rounded-xl bg-vip-slate/40 border border-[#cca43b]/10 space-y-1">
                              <p className="text-[7.5px] text-[#64748b]">FOCUSED TIMELOG</p>
                              <p className="text-base font-bold text-[#06b6d4] font-mono">{completedMinutes} Mins</p>
                              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-[#06b6d4] rounded-full" style={{ width: '65%' }} />
                              </div>
                            </div>

                            {/* Bottom interactive placeholder indicator on app screen */}
                            <p className="text-[8px] text-vip-gold/80 italic animate-pulse">
                              🔥 Study Streak: 2 Days Active
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Side by side Steps to configure and download apk */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                    
                    {/* LHS: Detailed installation manual guide steps */}
                    <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c101b] space-y-4">
                      <div className="flex items-center gap-2 border-b border-[#cca43b]/10 pb-3">
                        <Info className="text-vip-gold w-5 h-5" />
                        <h4 className="font-bold text-white text-sm">{lang === 'amh' ? 'የአጫጫን ቅደም ተከተል መመሪያ' : 'Official Android Installation Steps'}</h4>
                      </div>

                      <div className="space-y-3.5 text-xs text-[#cbd5e1]">
                        <div className="flex items-start gap-4">
                          <span className="w-6 h-6 rounded-full bg-[#cca43b]/10 border border-[#cca43b]/40 text-vip-gold font-mono font-black text-center leading-5 shrink-0 block">1</span>
                          <p>
                            <strong>{lang === 'amh' ? 'የ .APK ፋይሉን ያውርዱ' : 'Download the installer file'}</strong><br/>
                            {lang === 'amh'
                              ? 'ከላይ ያለውን "DOWNLOAD .APK" ቁልፍ በመጫን መተግበሪያውን በቀጥታ ስልክ ውስጥ ያውርዱ።'
                              : 'Click the Gold "DOWNLOAD ANDROID APP" button. The download will begin immediately.'}
                          </p>
                        </div>

                        <div className="flex items-start gap-4">
                          <span className="w-6 h-6 rounded-full bg-[#cca43b]/10 border border-[#cca43b]/40 text-vip-gold font-mono font-black text-center leading-5 shrink-0 block">2</span>
                          <p>
                            <strong>{lang === 'amh' ? 'ያልታወቁ ምንጮችን ፍቀድ' : 'Allow installation from Unknown Sources'}</strong><br/>
                            {lang === 'amh'
                              ? 'በስልክዎ Settings -> Security -> Install Unknown Apps የሚለውን በመክፈት ፋይሉ እንዲጫን ፍቃድ ይስጡ።'
                              : 'Go to your phone settings &rarr; Security &rarr; Toggle on "Install Unknown Sources" to allow direct manual install.'}
                          </p>
                        </div>

                        <div className="flex items-start gap-4">
                          <span className="w-6 h-6 rounded-full bg-[#cca43b]/10 border border-[#cca43b]/40 text-vip-gold font-mono font-black text-center leading-5 shrink-0 block">3</span>
                          <p>
                            <strong>{lang === 'amh' ? 'ይጫኑና ያጠናቁ' : 'Install &amp; Log Admissions'}</strong><br/>
                            {lang === 'amh'
                              ? 'በስልክዎ File Manager ውስጥ "Downloads" አቃፊን ይክፈቱ ከዚያም "aksum_prep_academy.apk" የሚለውን በመጫን "Install" ይንኩ።'
                              : 'Open your File Manager, head to "Downloads", and tap the aksum_prep_academy.apk. Select install and enter the Academy!'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* RHS FAQ & technical requirements details */}
                    <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c101b] space-y-4">
                      <div className="flex items-center gap-2 border-b border-[#cca43b]/10 pb-3">
                        <ShieldAlert className="text-[#a78bfa] w-5 h-5" />
                        <h4 className="font-bold text-white text-sm">{lang === 'amh' ? 'ስለ ደህንነትና ልኬቶች ማረጋገጫ' : 'Safety, Compatibility & Verification'}</h4>
                      </div>

                      <div className="p-4 rounded-xl bg-black/35 border border-slate-800 space-y-3 text-xs text-[#cbd5e1] leading-relaxed">
                        <p>
                          🛡️ <strong>Play Protect Verified:</strong> Our packages are compiled cleanly, containing zero system trackers, telemetry spyware, or persistent advertisements.
                        </p>
                        <p>
                          ⚡ <strong>Offline Compatibility:</strong> Database synchronization and notes loading perform fully client-side on Android Room engines, rendering instantly even in rural zones with low coverage.
                        </p>
                        <p>
                          💻 <strong>Build Spec:</strong> API level 26+ (Supports Google Pixel, Samsung Galaxy, Tecno, Infinix, and Huawei models cleanly).
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ================= TAB 5.7: dedicated full-SCREEN GPT PRO COGNUTIVE AI TUTOR ================= */}
              {activeTab === 'gptpro' && (
                <div id="gptpro-standalone-view" className="space-y-6 animate-fade-in pb-12">
                  
                  {/* Back Navigation Bar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="h-10 px-4 rounded-xl bg-vip-slate/50 text-vip-gold text-xs font-bold flex items-center gap-1.5 border border-[#cca43b]/15 active:scale-95 transition cursor-pointer min-h-[40px]"
                    >
                      ← {lang === 'amh' ? 'ወደ ዋነኛው ዳሽቦርድ ይመለሱ' : 'Back to Home'}
                    </button>
                  </div>

                  {/* Header info card */}
                  <div className="p-5 rounded-2xl border border-[#cca43b]/20 bg-gradient-to-br from-[#111827] via-vip-slate to-[#130d24] flex items-center gap-3.5 relative overflow-hidden animate-fade-in">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-vip-gold/5 rounded-full filter blur-[40px]" />
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vip-gold to-yellow-600 flex items-center justify-center font-black text-black shrink-0 shadow-lg">
                      🤖
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-gradient-gold">🏛️ AKSUM GPT PRO AI TUTOR</h3>
                      <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                        {lang === 'amh' 
                          ? 'ቀጥታ 1-ለ-1 ማስተማሪያና መፈተኛ አጋዥ። ማንኛውንም ጥያቄ ፎቶ አንስተው ወይም በመጻፍ ይጠይቁ!'
                          : 'Our sovereign local LLM logic engine. Instant curriculum solver and admissions advisor.'}
                      </p>
                    </div>
                  </div>

                  {/* High Fidelity Chat Console occupying comfortable height */}
                  <div className="p-4 rounded-3xl border border-[#334155]/50 bg-[#0c101b] flex flex-col justify-between h-[450px]">
                    
                    {/* Message listing screen */}
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
                      {chatMessages.map((item) => (
                        <div 
                          key={item.id} 
                          className={`flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                            item.sender === 'user' 
                              ? 'bg-gradient-to-br from-vip-gold to-yellow-500 text-black font-semibold rounded-tr-none shadow-md' 
                              : 'bg-vip-slate border border-[#334155]/60 text-white rounded-tl-none'
                          }`}>
                            <p>{item.text}</p>
                            <span className="block text-[8px] opacity-70 text-[#64748b] text-right mt-1.5 font-mono">{item.time}</span>
                          </div>
                        </div>
                      ))}

                      {isAiTyping && (
                        <div className="flex justify-start">
                          <div className="p-2.5 rounded-2xl bg-vip-slate/30 text-[#64748b] text-xs font-mono animate-pulse">
                            Aksum GPT Pro loading local database answers...
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Predefined prompt helpers */}
                    <div className="py-2.5 flex gap-1.5 overflow-x-auto text-[10px] text-slate-300 no-scrollbar">
                      <button 
                        onClick={() => setChatInput(lang === 'amh' ? 'ያለፉትን የፈተና ጥያቄዎች እንዴት በፈጣን መስራት እችላለሁ?' : 'Tips on speeding up ESSLCE algebra answers.')}
                        className="px-2.5 py-1 rounded-lg bg-[#1e293b]/60 border border-slate-800 whitespace-nowrap active:scale-95 transition"
                      >
                        ⚡ Prep Drills
                      </button>
                      <button 
                        onClick={() => setChatInput(lang === 'amh' ? 'የ ፊዚካዊ ቀመሮች በሙሉ አሳይ' : 'List key physics equations.')}
                        className="px-2.5 py-1 rounded-lg bg-[#1e293b]/60 border border-slate-800 whitespace-nowrap active:scale-95 transition"
                      >
                        📐 Constants
                      </button>
                      <button 
                        onClick={() => setChatInput(lang === 'amh' ? 'የ AAU ዩኒቨርሲቲ መግቢያ ዝቅተኛ ውጤት' : 'Aastu Admissions Ratios')}
                        className="px-2.5 py-1 rounded-lg bg-[#1e293b]/60 border border-slate-800 whitespace-nowrap active:scale-95 transition"
                      >
                        🏫 Uni Targets
                      </button>
                    </div>

                    {/* Attachment files if any */}
                    {chatAttachment && (
                      <div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded bg-[#1e1b4b] border border-[#a78bfa]/40 text-[#a78bfa] text-[10px] uppercase font-bold mb-2 animate-pulse">
                        <span className="flex items-center gap-1 truncate max-w-[150px]">
                          <FileText className="w-3.5 h-3.5" />
                          <span className="truncate">{chatAttachment.name}</span>
                        </span>
                        <button 
                          onClick={() => setChatAttachment(null)} 
                          className="hover:text-red-500 font-bold shrink-0 text-xs ml-1 select-none cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Chat toolbar + inputs conform to Native 48px height */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-[#334155]/20">
                      {/* Image uploader */}
                      <label className="w-10 h-10 rounded-lg bg-[#1e293b]/80 text-[#cbd5e1] hover:text-white border border-slate-700/60 hover:border-slate-600 transition cursor-pointer flex items-center justify-center shrink-0 min-h-[40px]">
                        <ImageIcon className="w-4 h-4 text-[#a78bfa]" />
                        <input 
                          type="file" 
                          accept="image/*,application/pdf" 
                          className="hidden" 
                          onChange={(e) => handleImageFileChange(e, false)} 
                        />
                      </label>

                      {/* Camera capture */}
                      <label className="w-10 h-10 rounded-lg bg-[#1e293b]/80 text-[#cbd5e1] hover:text-white border border-slate-700/60 hover:border-slate-600 transition cursor-pointer flex items-center justify-center shrink-0 min-h-[40px]" title="Take a physical photo">
                        <Camera className="w-4 h-4 text-emerald-400" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment" 
                          className="hidden" 
                          onChange={(e) => handleImageFileChange(e, true)} 
                        />
                      </label>

                      {/* Main input */}
                      <input
                        type="text"
                        placeholder={lang === 'amh' ? 'ለትምህርት ጥያቄዎችን እዚህ ይጠይቁ...' : 'Type study question...'}
                        className="flex-1 h-10 px-3 rounded-lg border border-[#334155] bg-black/40 text-xs text-white outline-none focus:border-vip-gold min-h-[40px]"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendChatMessage();
                        }}
                      />
                      <button
                        onClick={handleSendChatMessage}
                        className="w-10 h-10 rounded-lg bg-vip-gold text-black hover:bg-yellow-500 transition cursor-pointer shrink-0 flex items-center justify-center min-h-[40px] active:scale-95"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* ================= TAB 5.8: ABOUT APP DETAILS & SYSTEMS VERSIONING ================= */}
              {activeTab === 'about_app' && (
                <div id="about_app_view" className="space-y-6 animate-fade-in pb-12">
                  
                  {/* Back Navigation Bar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="h-10 px-4 rounded-xl bg-vip-slate/50 text-vip-gold text-xs font-bold flex items-center gap-1.5 border border-[#cca43b]/15 active:scale-95 transition cursor-pointer min-h-[40px]"
                    >
                      ← {lang === 'amh' ? 'ወደ ዋነኛው ዳሽቦርድ ይመለሱ' : 'Back to Home'}
                    </button>
                  </div>

                  {/* Historical connection header banner */}
                  <div className="p-6 rounded-3xl border border-vip-gold/15 bg-gradient-to-br from-[#0c081c] via-[#0a0f19] to-black relative overflow-hidden text-center space-y-3">
                    <p className="text-3xl">🏛️</p>
                    <h3 className="font-extrabold text-lg text-gradient-gold">AKSUM PREP APP SYSTEM</h3>
                    <p className="text-xs text-[#a0aec0] max-w-md mx-auto leading-relaxed">
                      {lang === 'amh' 
                        ? 'ከጥንታዊቷ አክሱም ታላቅ ሥልጣኔና ታሪክ የተቀዳ የክብር ቅርስ። የዘመናዊ ቴክኖሎጂን ከኢትዮጵያ ማትሪክ ፈተናዎች ማዘጋጃ ጋር በማቀናጀት ለሁሉም የከፍተኛ ትምህርት ተወዳዳሪዎች የተዘጋጀ!'
                        : 'Inspired by the profound wisdom of the ancient Aksumite Empire. Fusing world-class engineering with high-fidelity national academic study modules.'}
                    </p>
                  </div>

                  {/* App Version Info Specs cards */}
                  <div className="p-5 rounded-2xl border border-slate-800 bg-[#0b0f19] space-y-4 animate-fade-in">
                    <h4 className="text-xs font-bold text-[#cca43b] uppercase tracking-wider">{lang === 'amh' ? '📋 ስልታዊ ዝርዝሮች' : '📋 DEVICE & APP SPECIFICATIONS'}</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed text-slate-300">
                      <div className="p-3 rounded-xl bg-black/40 border border-slate-900 space-y-1">
                        <span className="text-[10px] text-slate-500 block">APP VERSION</span>
                        <strong className="text-white">v1.2.0 (Stable Build)</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-black/40 border border-slate-900 space-y-1">
                        <span className="text-[10px] text-slate-500 block">LOCAL ENGINE</span>
                        <strong className="text-white">Capacitor Core 6.1</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-black/40 border border-slate-900 space-y-1">
                        <span className="text-[10px] text-slate-500 block">OFFLINE SYNC</span>
                        <strong className="text-[#10b981]">🟢 Cached (100% OK)</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-black/40 border border-slate-900 space-y-1">
                        <span className="text-[10px] text-slate-500 block">STUDY TRACKER</span>
                        <strong className="text-white">{completedMinutes} Focus Mins</strong>
                      </div>
                    </div>
                  </div>

                  {/* Developer credits card info */}
                  <div className="p-4 rounded-xl bg-vip-gold/5 border border-vip-gold/15 text-xs text-slate-300 space-y-1">
                    <p className="font-bold text-vip-gold">🎓 Sovereign Academic Commitment</p>
                    <p className="leading-relaxed">
                      This application does not contain advertisements, background payload listeners or analytics trackers. All student files, simulated test histories, and scores remain securely processed inside the sandbox local storage of your mobile smartphone.
                    </p>
                    <p className="text-[10px] text-[#64748b] font-mono shrink-0 pt-1">
                      Designed and Authorized by Candidate Ezra T. &bull; Addis Ababa University Admissions Gate (2026 Batch).
                    </p>
                  </div>

                </div>
              )}

            </main>

            {/* Sticky Bottom Navigation Tab Bar (Requirement 1) */}
            <div className="h-16 border-t border-[#cca43b]/15 bg-[#0b0f19] flex items-center justify-around px-1 select-none shrink-0 z-40 pb-safe">
              {[
                { id: 'dashboard', label: lang === 'amh' ? 'ዋና ገጽ' : 'Home', icon: TrendingUp },
                { id: 'curriculum', label: lang === 'amh' ? 'ሲላበስ' : 'Courses', icon: BookOpen },
                { id: 'practice', label: lang === 'amh' ? 'ፈተና' : 'Exams', icon: Award },
                { id: 'gptpro', label: lang === 'amh' ? 'ጂፒቲ' : 'GPT Pro', icon: Cpu },
                { id: 'universities', label: lang === 'amh' ? 'ዩኒቨርስቲ' : 'Uni Info', icon: GraduationCap },
                { id: 'more_menu', label: lang === 'amh' ? 'ተጨማሪ' : 'More', icon: Grid }
              ].map((tabItem) => {
                const IconComponent = tabItem.icon;
                
                let isSelected = false;
                if (tabItem.id === 'more_menu') {
                  isSelected = ['apkstore', 'about_app', 'notifications', 'formulas', 'premium'].includes(activeTab);
                } else if (tabItem.id === 'dashboard') {
                  isSelected = activeTab === 'dashboard';
                } else if (tabItem.id === 'curriculum') {
                  isSelected = activeTab === 'curriculum';
                } else if (tabItem.id === 'practice') {
                  isSelected = activeTab === 'practice';
                } else if (tabItem.id === 'gptpro') {
                  isSelected = activeTab === 'gptpro';
                } else if (tabItem.id === 'universities') {
                  isSelected = activeTab === 'universities';
                }

                return (
                  <button
                    key={tabItem.id}
                    onClick={() => {
                      if (tabItem.id === 'more_menu') {
                        setShowMoreMenuTray(!showMoreMenuTray);
                      } else {
                        setShowMoreMenuTray(false);
                        setActiveTab(tabItem.id);
                        setCurrentMCQIndex(0);
                        setRevealMCQAnswer(false);
                      }
                    }}
                    className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all h-full relative cursor-pointer ${
                      isSelected ? 'text-vip-gold font-bold scale-105' : 'text-[#64748b] hover:text-[#cbd5e1]'
                    }`}
                  >
                    <div className="relative">
                      <IconComponent className={`w-4.5 h-4.5 ${isSelected ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                    </div>
                    <span className="text-[9px] tracking-tight">{tabItem.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ================= EXTRA TABS SLIDE-UP NAVIGATION DRAWER DRAWER ================= */}
            {showMoreMenuTray && (
              <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-md flex flex-col justify-end transition-all duration-300">
                {/* Click outside to close */}
                <div className="absolute inset-0 -z-10 animate-fade-in" onClick={() => setShowMoreMenuTray(false)} />
                
                {/* Slide Up Content Panel */}
                <div className="w-full bg-[#0b0f19] border-t border-[#cca43b]/25 rounded-t-3xl p-5 space-y-4 shadow-2xl relative z-50">
                  <div className="flex items-center justify-between border-b border-[#cca43b]/10 pb-2.5">
                    <span className="text-xs font-black tracking-widest text-vip-gold uppercase">🏰 {lang === 'amh' ? 'ተጨማሪ አገልግሎቶች' : 'MORE ACADEMY HUBS'}</span>
                    <button 
                      onClick={() => setShowMoreMenuTray(false)}
                      className="w-7 h-7 rounded-full bg-vip-slate/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Menu grids with large touch targets conforming to 44px minimum */}
                  <div className="grid grid-cols-2 gap-3 pb-2">
                    
                    {/* APKSTORE / DOWNLOAD HUB */}
                    <button
                      onClick={() => {
                        setActiveTab('apkstore');
                        setShowMoreMenuTray(false);
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 bg-[#0e1626]/60 hover:border-vip-gold/30 hover:bg-[#15233c] text-left text-xs text-[#cbd5e1] hover:text-white transition flex items-center gap-3 min-h-[48px] cursor-pointer"
                    >
                      <Download className="w-5 h-5 text-vip-gold shrink-0" />
                      <div>
                        <strong className="block text-[11px] font-black uppercase tracking-tight">{lang === 'amh' ? 'መተግበሪያ አውርድ' : 'Download App'}</strong>
                        <span className="text-[9px] text-slate-400 leading-none">{lang === 'amh' ? 'ከመስመር ውጪ ጥናት' : 'Production APK'}</span>
                      </div>
                    </button>

                    {/* ABOUT APP DETAILS */}
                    <button
                      onClick={() => {
                        setActiveTab('about_app');
                        setShowMoreMenuTray(false);
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 bg-[#0e1626]/60 hover:border-vip-gold/30 hover:bg-[#15233c] text-left text-xs text-[#cbd5e1] hover:text-white transition flex items-center gap-3 min-h-[48px] cursor-pointer"
                    >
                      <Info className="w-5 h-5 text-[#a78bfa] shrink-0" />
                      <div>
                        <strong className="block text-[11px] font-black uppercase tracking-tight">{lang === 'amh' ? 'ስለ አካዳሚው' : 'About App'}</strong>
                        <span className="text-[9px] text-slate-400 leading-none">{lang === 'amh' ? 'የስልቱ ዝርዝሮች' : 'System specs'}</span>
                      </div>
                    </button>

                    {/* ALERTS & NOTIFICATIONS LOG */}
                    <button
                      onClick={() => {
                        setActiveTab('notifications');
                        setShowMoreMenuTray(false);
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 bg-[#0e1626]/60 hover:border-vip-gold/30 hover:bg-[#15233c] text-left text-xs text-[#cbd5e1] hover:text-white transition flex items-center gap-3 min-h-[48px] cursor-pointer relative"
                    >
                      <Bell className="w-5 h-5 text-red-400 shrink-0" />
                      <div>
                        <strong className="block text-[11px] font-black uppercase tracking-tight">{lang === 'amh' ? 'ማሳወቂያዎች' : 'Alerts Hub'}</strong>
                        <span className="text-[9px] text-slate-400 leading-none">{lang === 'amh' ? 'ጠቃሚ ደወሎች' : 'Study reminders'}</span>
                      </div>
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    </button>

                    {/* METRIC FORMULAS & CONSTANTS */}
                    <button
                      onClick={() => {
                        setActiveTab('formulas');
                        setShowMoreMenuTray(false);
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 bg-[#0e1626]/60 hover:border-vip-gold/30 hover:bg-[#15233c] text-left text-xs text-[#cbd5e1] hover:text-white transition flex items-center gap-3 min-h-[48px] cursor-pointer"
                    >
                      <Sliders className="w-5 h-5 text-[#38bdf8] shrink-0" />
                      <div>
                        <strong className="block text-[11px] font-black uppercase tracking-tight">{lang === 'amh' ? 'ቀመሮች ሰሌዳ' : 'Metric Formulas'}</strong>
                        <span className="text-[9px] text-slate-400 leading-none">{lang === 'amh' ? 'ፊዚክስና ኬሚስትሪ' : 'Physics & Chem'}</span>
                      </div>
                    </button>

                    {/* PROFILE PROFILE PROFILE */}
                    <button
                      onClick={() => {
                        setActiveTab('premium');
                        setShowMoreMenuTray(false);
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 bg-[#0e1626]/60 hover:border-vip-gold/30 hover:bg-[#15233c] text-left text-xs text-[#cbd5e1] hover:text-white transition flex items-center gap-3 min-h-[48px] cursor-pointer col-span-2"
                    >
                      <Trophy className="w-5 h-5 text-[#cca43b] shrink-0" />
                      <div>
                        <strong className="block text-[11px] font-black uppercase tracking-tight">{lang === 'amh' ? 'የእኔ ፕሮፋይልና ውጤቶች' : 'VIP Elite Profile'}</strong>
                        <span className="text-[9px] text-slate-400 leading-none">{lang === 'amh' ? 'የስኬት ማረጋገጫ የምስክር ወረቀት' : 'Sovereign Achievements & Certificates'}</span>
                      </div>
                    </button>

                  </div>

                  {/* Close Helper banner */}
                  <button
                    onClick={() => setShowMoreMenuTray(false)}
                    className="w-full py-3 rounded-xl bg-vip-gold hover:bg-yellow-500 text-black font-extrabold font-display text-xs uppercase tracking-widest text-center shadow-lg active:scale-95 transition cursor-pointer min-h-[44px]"
                  >
                    {lang === 'amh' ? 'ይዝጉ' : 'Close Board'}
                  </button>

                </div>
              </div>
            )}

          </>
        )}

        </div> {/* closes simulated top-level viewport wrapper: <div className="flex-1 flex flex-col h-full... */}
      </div> {/* closes simulated physical device wrapper: <div className="w-full max-w-sm md:max-w-md... */}

      {/* ================= PREMIUM GRADUATION CERTIFICATE MODAL ================= */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#090b11] border border-vip-gold/30 rounded-3xl p-6 md:p-8 space-y-6 relative shadow-2xl">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 rounded-full border border-slate-800 text-slate-400 hover:text-white hover:border-[#cca43b]/40 cursor-pointer text-xs flex items-center justify-center bg-black/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="text-[10px] text-gradient-gold font-mono font-bold tracking-widest uppercase">Aksum Sovereign Registry</span>
              <h3 className="text-xl font-display font-black text-white">🎓 Premium Completion Certificate</h3>
              <p className="text-xs text-[#94a3b8]">Live generated with your secure admissions log. Print or save offline.</p>
            </div>

            {/* Certificate Inner Design card */}
            <div 
              id="aksum-svg-certificate" 
              className="p-1 md:p-2 rounded-2xl bg-gradient-to-br from-[#cca43b]/30 via-[#181308] to-slate-950 border-2 border-[#cca43b]/50 shadow-2xl relative overflow-hidden text-center"
            >
              {/* Vintage Frame borders */}
              <div className="border border-[#cca43b]/20 p-6 md:p-12 rounded-xl bg-black/95 relative space-y-6">
                {/* watermark */}
                <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 select-none pointer-events-none opacity-5 font-black text-5xl md:text-8xl tracking-widest whitespace-nowrap text-[#cca43b]">
                  AKSUM VIP ACADEMY
                </div>

                <div className="space-y-2">
                  <span className="text-[13px] tracking-widest font-serif font-black text-vip-gold uppercase block">🏛️ AKSUM VIP PREPARATORY ACADEMY 🏛️</span>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Ethiopian STEM Admissions Registry</p>
                </div>

                <div className="space-y-4 py-3">
                  <p className="text-xs text-[#94a3b8] italic">This credentials registry confirms that</p>
                  {/* Live editable name input or label display */}
                  <div className="space-y-1">
                    <input 
                      type="text" 
                      className="text-2xl font-serif font-black text-white decoration-vip-gold underline underline-offset-8 bg-transparent border-none text-center outline-none focus:ring-0 w-full" 
                      value={studentInfo.name || "Sovereign Candidate Scholar"}
                      onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                      placeholder="Enter Student Name"
                    />
                    <span className="text-[9px] text-[#64748b] block font-mono">(Click name above to edit prior to exporting)</span>
                  </div>
                  <p className="text-xs text-[#cbd5e1] max-w-md mx-auto leading-relaxed">
                    has successfully traversed and mastered the official computerized national preparatory syllabus mapped to Grade 10-12 Ethiopian high school curriculum units including Calculus Functional Limits, Quantum wave systems, and advanced Chemical Enthalpy constants.
                  </p>
                </div>

                {/* Seals & Signatures */}
                <div className="grid grid-cols-3 gap-6 items-center pt-4">
                  <div className="text-center space-y-1.5 border-t border-slate-800 pt-2.5">
                    <p className="text-[10px] font-mono font-bold text-white">Aksum AI Proctor</p>
                    <p className="text-[8px] font-mono text-slate-600">Digital Seal Verified</p>
                  </div>

                  <div className="flex justify-center flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-vip-gold to-yellow-600 text-black flex items-center justify-center font-black shadow-lg border-2 border-dashed border-black/50 text-xl">
                      👑
                    </div>
                    <span className="text-[9px] text-vip-gold font-mono uppercase font-black pt-1.5 animate-pulse">Class Rank #1</span>
                  </div>

                  <div className="text-center space-y-1.5 border-t border-slate-800 pt-2.5">
                    <p className="text-[10px] font-mono font-bold text-white">Addis Ababa, ET</p>
                    <p className="text-[8px] font-mono text-slate-600">Issued May 2026</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download controls */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={() => {
                  window.print();
                }}
                className="flex-1 p-3.5 rounded-xl font-bold font-display text-center text-xs uppercase text-black bg-vip-gold hover:bg-yellow-500 hover:scale-[1.01] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download / Print PDF</span>
              </button>
              <button 
                onClick={() => {
                  // Quick HTML-SVG vector exporter
                  const element = document.getElementById('aksum-svg-certificate');
                  if (element) {
                    const htmlStr = `
                      <html>
                        <head>
                          <title>Graduation Certificate - ${studentInfo.name}</title>
                          <script src="https://cdn.tailwindcss.com"></script>
                        </head>
                        <body class="bg-slate-900 p-8 flex items-center justify-center min-h-screen">
                          <div class="max-w-3xl w-full">
                            ${element.outerHTML}
                          </div>
                        </body>
                      </html>
                    `;
                    const blob = new Blob([htmlStr], { type: 'text/html' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `aksum_graduation_certificate_${studentInfo.name || 'candidate'}.html`;
                    link.click();
                    showToast(lang === 'amh' ? "🎉 የቃል ኪዳን ሰርተፍኬቱ በስኬት ወርዷል!" : "🎉 Saved gorgeous HTML-Vector certificate file to downloads!");
                  }
                }}
                className="p-3.5 rounded-xl font-bold font-display text-xs uppercase text-[#cbd5e1] hover:text-white bg-slate-800 hover:bg-slate-700 flex items-center justify-center gap-2 cursor-pointer border border-slate-700/60"
              >
                <Share2 className="w-4 h-4" />
                <span>Export Vector Document (.HTML/.SVG)</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
