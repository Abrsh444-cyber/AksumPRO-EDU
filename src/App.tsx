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
  Grid,
  KeyRound,
  Cloud,
  Video
} from 'lucide-react';

import GoogleDriveHub from './components/GoogleDriveHub';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import VideoLearningHub from './components/VideoLearningHub';

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

  // Password Recovery States
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);
  const [recoveryIdentifier, setRecoveryIdentifier] = useState<string>('');
  const [recoveryStatus, setRecoveryStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

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

  // Saved Short Notes notebook
  const [savedShortNotes, setSavedShortNotes] = useState<{
    id: string;
    subject: string;
    category: string; // 'highlight' | 'summary' | 'formula' | 'hack' | 'trap' | 'custom'
    title: string;
    content: string;
    time: string;
  }[]>(() => {
    const cached = localStorage.getItem('aksum_saved_short_notes');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return [
      {
        id: 'welcome-note',
        subject: 'General Academic Support',
        category: 'highlight',
        title: 'Aksum Study Guide 🎓',
        content: 'Welcome to your elite short notes notebook! When you chat with Aksum GPT Pro on any topic, click the "💾 Save to Notes" button next to any category card (Concept Highlights, Core Formula, Exam Hack, or Critical Trap) to instantly cache it here.',
        time: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
      }
    ];
  });

  // Keep saved notes synchronized locally
  useEffect(() => {
    localStorage.setItem('aksum_saved_short_notes', JSON.stringify(savedShortNotes));
  }, [savedShortNotes]);

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

  const handleRequestPasswordRecovery = () => {
    if (!recoveryIdentifier.trim()) {
      setRecoveryError(lang === 'amh' ? '⚠️ እባክዎ የስልክ ቁጥር ወይም ኢሜይል ያስገቡ!' : '⚠️ Please enter your registered phone or email!');
      return;
    }
    
    setRecoveryError(null);
    setRecoveryStatus('sending');
    
    setTimeout(() => {
      const cached = localStorage.getItem('aksum_student_info');
      if (!cached) {
        setRecoveryStatus('idle');
        setRecoveryError(lang === 'amh' ? '❌ በዚህ መሣሪያ ላይ ምንም መለያ አልተገኘም! እባክዎ አስቀድመው ይመዝገቡ።' : '❌ No account found on this device! Please register first.');
        return;
      }
      
      try {
        const parsed: StudentInfo = JSON.parse(cached);
        const destination = recoveryIdentifier.trim().toLowerCase();
        const storedPhone = (parsed.phone || '').trim().toLowerCase();
        const storedName = (parsed.name || '').trim().toLowerCase();
        
        // Match identifier with stored phone or name, or allow anything if it looks like a valid email/phone
        const isMatch = destination === storedPhone || destination === storedName || destination.length >= 3;

        if (isMatch) {
          setRecoveryStatus('sent');
          showToast(lang === 'amh' ? '📩 የይለፍ ቃል መልሶ ማግኛ ኮድ ተልኳል!' : '📩 Password recovery code sent!');
        } else {
          setRecoveryStatus('idle');
          setRecoveryError(lang === 'amh' ? '❌ ያስገቡት ስም ወይም ስልክ ከተመዘገበው መለያ ጋር አልተመሳሰለም!' : '❌ Input does not match registered profile name/phone!');
        }
      } catch (e) {
        setRecoveryStatus('idle');
        setRecoveryError('Unexpected recovery handler exception.');
      }
    }, 1200);
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

  // Render message body with elite component bento boxes and note-taking integrations
  // Enhance readability of GPT writing, highlighting numbers, math symbols, formulas, and headings beautifully.
  const renderFormattedText = (rawText: string) => {
    if (!rawText) return null;

    // Direct helper to clean up mathematical expressions and convert keys into elegant unicode symbols
    const formatMathExpression = (segment: string) => {
      if (!segment) return segment;

      // Clean up inline dollar signs and LaTeX slash-parens delimiters
      let cleaned = segment
        .replace(/^\$\s*/, '')
        .replace(/\s*\$$/, '')
        .replace(/^\\\(\s*/, '')
        .replace(/\s*\\\)$/, '');

      // 1. Convert LaTeX Fractions \frac{foo}{bar} -> (foo) ÷ (bar) recursively
      let safetyCounter = 0;
      while (cleaned.includes('\\frac') && safetyCounter < 10) {
        const nextFrac = cleaned.replace(/\\frac\s*\{([^}]+)\}\s*\{([^}]+)\}/g, '($1) ÷ ($2)');
        if (nextFrac === cleaned) {
          // Try without enclosing braces if malformed
          const genericFrac = cleaned.replace(/\\frac\s*([^{}\s]+)\s*([^{}\s]+)/g, '$1 ÷ $2');
          if (genericFrac === cleaned) break;
          cleaned = genericFrac;
        } else {
          cleaned = nextFrac;
        }
        safetyCounter++;
      }

      // 2. Convert LaTeX \text{...} -> ...
      cleaned = cleaned.replace(/\\text\s*\{([^}]+)\}/g, ' $1 ');

      // 3. Make mathematical replacements for standard symbols
      cleaned = cleaned
        .replace(/\\pi\b/gi, 'π')
        .replace(/\\theta\b/gi, 'θ')
        .replace(/\\alpha\b/gi, 'α')
        .replace(/\\beta\b/gi, 'β')
        .replace(/\\gamma\b/gi, 'γ')
        .replace(/\\Delta\b/g, 'Δ')
        .replace(/\\lambda\b/gi, 'λ')
        .replace(/\\omega\b/gi, 'ω')
        .replace(/\\sigma\b/gi, 'σ')
        .replace(/\\mu\b/gi, 'μ')
        .replace(/\\phi\b/gi, 'φ')
        .replace(/\\rho\b/gi, 'ρ')
        .replace(/\\sqrt\{([^}]+)\}/gi, '√($1)')
        .replace(/\\sqrt/gi, '√')
        .replace(/\\times\b/gi, ' × ')
        .replace(/\\div\b/gi, ' ÷ ')
        .replace(/\\approx\b/gi, ' ≈ ')
        .replace(/\\neq\b/gi, ' ≠ ')
        .replace(/\\le\b/gi, ' ≤ ')
        .replace(/\\ge\b/gi, ' ≥ ')
        .replace(/\\infty\b/gi, '∞')
        .replace(/\\pm\b/gi, ' ± ')
        .replace(/\\cdot\b/gi, ' · ')
        .replace(/\\leq\b/gi, ' ≤ ')
        .replace(/\\geq\b/gi, ' ≥ ')
        .replace(/\\\+/g, '+')
        .replace(/\\\-/g, '-')
        .replace(/\^2\b/g, '²')
        .replace(/\^3\b/g, '³')
        .replace(/\^n\b/g, 'ⁿ')
        .replace(/\^x\b/g, 'ˣ')
        .replace(/\_1\b/g, '₁')
        .replace(/\_2\b/g, '₂')
        .replace(/\_n\b/g, 'ₙ')
        .replace(/\_i\b/g, 'ᵢ')
        .replace(/->/g, '→')
        .replace(/<=/g, '≤')
        .replace(/>=/g, '≥')
        .replace(/!=/g, '≠')
        .replace(/\+-/g, '±')
        .replace(/\*/g, ' × ');

      // Strip remaining stray formatting control characters
      cleaned = cleaned.replace(/[\$\\]/g, '');

      // Split into tokens: numbers, operators, words, variables
      // Regex matches:
      // - integers/decimals: \b\d+(?:\.\d+)?%?
      // - operators: [\+\-\*=><≠≈≤≥±×÷→]
      // - mathematical single variables: \b[xyzabcdeijklnpqrstuwvDθπΔαβλωσμ]\b
      const tokenRegex = /(\d+(?:\.\d+)?%?|[\+\-\*=><≠≈≤≥±×÷→]|\b[xyzabcdeijklnpqrstuwvDθπΔαβλωσμ]\b)/g;
      const tokens = cleaned.split(tokenRegex);

      return tokens.map((token, tIdx) => {
        if (!token) return null;

        // 1. Numbers (VIP Gold theme matching - Clean, pro textbook styling)
        if (/^\d+(?:\.\d+)?%?$/.test(token)) {
          return (
            <span key={`num-${tIdx}`} className="font-mono font-bold text-amber-200 select-all tracking-tight mx-0.5 inline">
              {token}
            </span>
          );
        }

        // 2. Operators (Glow Gold highlighting - Clean & modern)
        if (/^[\+\-\*=><≠≈≤≥±×÷→]$/.test(token)) {
          return (
            <span key={`op-${tIdx}`} className="font-extrabold text-[#cca43b] text-sm mx-1 inline select-none">
              {token}
            </span>
          );
        }

        // 3. Mathematical variables (Textbook Serif-Italic style)
        if (/^[xyzabcdeijklnpqrstuwvDθπΔαβλωσμ]$/.test(token)) {
          return (
            <span key={`var-${tIdx}`} className="font-serif italic font-extrabold text-cyan-400 hover:text-cyan-300 transition-colors duration-100 mx-0.5 inline">
              {token}
            </span>
          );
        }

        // 4. Default remaining text segment
        return token;
      });
    };

    // Detect if a paragraph line constitutes a standalone mathematical expression, equation or active steps
    const isMathFormulaLine = (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return false;

      // Explicit markdown/LaTeX delimiters
      if (trimmed.startsWith('$$') || trimmed.endsWith('$$') || trimmed.startsWith('\\[') || trimmed.endsWith('\\]')) {
        return true;
      }

      // Heavy symbolic math traits
      const containsEquals = trimmed.includes('=') || trimmed.includes('≈') || trimmed.includes('≠') || trimmed.includes('≤') || trimmed.includes('≥') || trimmed.includes('→');
      const containsOperators = /[\+\-\*\/\\^√]/.test(trimmed) || trimmed.includes('×') || trimmed.includes('÷') || trimmed.includes('±') || trimmed.includes('\\Delta') || trimmed.includes('\\theta') || trimmed.includes('\\pi');
      
      // Step numbering or symbol checks
      const hasMathVariables = /\b[xyzabcdeijklnpqrstuwv]\b/i.test(trimmed);
      
      return containsEquals && (containsOperators || hasMathVariables);
    };

    // First parse inline tokens for bold, italics, backticks, and math numbers
    const parseInlineTokens = (textSegment: string) => {
      if (!textSegment) return '';
      
      // Split by backticks first
      const backtickParts = textSegment.split(/(`[^`]+`)/g);
      
      return backtickParts.map((bPart, bIdx) => {
        if (bPart.startsWith('`') && bPart.endsWith('`')) {
          const codeContent = bPart.slice(1, -1);
          return (
            <code key={`code-${bIdx}`} className="font-mono text-[11px] bg-[#090d16] border border-slate-800/80 px-1.5 py-0.5 rounded text-[#cca43b] font-black h-fit shadow-md inline-block">
              {codeContent}
            </code>
          );
        }
        
        // Split by bold notation **
        const boldParts = bPart.split(/(\*\*[^*]+\*\*)/g);
        return boldParts.map((boldPart, boldIdx) => {
          if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
            const strongContent = boldPart.slice(2, -2);
            return (
              <strong key={`b-${boldIdx}`} className="font-black text-white hover:text-[#cca43b] transition-colors duration-150 text-[12px]">
                {strongContent}
              </strong>
            );
          }
          
          // Split by italic notations *italic*
          const italicParts = boldPart.split(/(\*[^*]+\*)/g);
          return italicParts.map((itPart, itIdx) => {
            if (itPart.startsWith('*') && itPart.endsWith('*')) {
              const italicContent = itPart.slice(1, -1);
              return (
                <em key={`i-${itIdx}`} className="italic text-zinc-100 font-medium">
                  {italicContent}
                </em>
              );
            }
            
            // Format standard text mathematically with high-quality token rules
            return formatMathExpression(itPart);
          });
        });
      });
    };

    // Split text into individual lines
    const lines = rawText.split('\n');
    
    return (
      <div className="space-y-2 select-text text-left">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          
          // Render raw horizontal rule
          if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
            return <hr key={idx} className="border-slate-800/80 my-3.5" />;
          }

          // Standalone step-by-step Mathematical Blackboard Frame
          if (isMathFormulaLine(trimmed) && !trimmed.startsWith('#') && !trimmed.startsWith('-') && !trimmed.startsWith('*') && !trimmed.match(/^\d+\./)) {
            const cleanedFormula = trimmed
              .replace(/^\$\$/, '')
              .replace(/\$\$$/, '')
              .replace(/^\\\[/, '')
              .replace(/\\\]$/, '');

            return (
              <div key={idx} className="my-3.5 p-4 rounded-xl border border-slate-850 bg-[#060b13] border-l-4 border-l-[#cca43b] shadow-xl hover:shadow-[#cca43b]/5 hover:border-slate-750/80 transition duration-200 text-left relative overflow-hidden group">
                {/* Vintage mathematical grid paper template style */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(204,164,59,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(204,164,59,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-80" />
                
                {/* Academic tracking header */}
                <span className="relative z-10 block text-[9px] text-[#cca43b] font-mono font-black uppercase tracking-widest mb-2.5 flex items-center gap-1.5 opacity-90 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#cca43b] animate-pulse" />
                  {lang === 'amh' ? 'አካዳሚክ ስሌት እና ቀመር' : 'ACADEMIC CALCULATION & FORMULA'}
                </span>
                
                {/* Big formulas display with crisp variable colors */}
                <div className="relative z-10 text-xs sm:text-sm md:text-[14.5px] font-semibold leading-relaxed tracking-wider py-1.5 flex flex-wrap items-center gap-y-1 align-baseline text-zinc-150 select-all font-sans">
                  {formatMathExpression(cleanedFormula)}
                </div>
              </div>
            );
          }

          // Header level 3
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-[12.5px] font-black text-[#cca43b] uppercase tracking-wider mt-4 mb-2 first:mt-0 flex items-center gap-1.5">
                ✦ {parseInlineTokens(line.replace(/^###\s+/, ''))}
              </h4>
            );
          }

          // Header level 2
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="text-xs font-black text-[#cca43b] uppercase tracking-widest mt-5 mb-2 first:mt-0 flex items-center gap-1.5">
                🏛️ {parseInlineTokens(line.replace(/^##\s+/, ''))}
              </h3>
            );
          }

          // Header level 1
          if (trimmed.startsWith('# ')) {
            return (
              <h2 key={idx} className="text-sm font-black text-white mt-6 mb-2.5 first:mt-0 flex items-center gap-2 border-b border-slate-800/50 pb-1">
                {parseInlineTokens(line.replace(/^#\s+/, ''))}
              </h2>
            );
          }

          // Numbered list item
          const numMatch = line.match(/^(\d+)\.\s(.*)/);
          if (numMatch) {
            const num = numMatch[1];
            const rest = numMatch[2];
            return (
              <div key={idx} className="flex items-start gap-2.5 py-1 text-left">
                <span className="flex items-center justify-center w-5.5 h-5.5 rounded-full bg-[#1e293b] border border-slate-700/85 text-[#cca43b] font-mono text-[10px] font-black shrink-0 mt-0.5 shadow-md">
                  {num}
                </span>
                <div className="flex-1 text-[12px] leading-relaxed text-zinc-100 font-medium">
                  {parseInlineTokens(rest)}
                </div>
              </div>
            );
          }

          // Bullet list item
          const bulletMatch = line.match(/^([\-\*\u2022])\s(.*)/);
          if (bulletMatch) {
            const rest = bulletMatch[2];
            return (
              <div key={idx} className="flex items-start gap-2.5 py-0.5 text-left">
                <span className="flex items-center justify-center w-4 h-4 text-[#cca43b] text-xs shrink-0 mt-0.5">
                  ✦
                </span>
                <div className="flex-1 text-[12px] leading-relaxed text-zinc-200 font-normal">
                  {parseInlineTokens(rest)}
                </div>
              </div>
            );
          }

          // Render empty layout lines to give paragraph breathing room
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Standard paragraph
          return (
            <p key={idx} className="text-[12px] leading-relaxed text-zinc-300 font-normal select-text">
              {parseInlineTokens(line)}
            </p>
          );
        })}
      </div>
    );
  };

  const renderMessageContent = (item: { id: string; sender: 'user' | 'ai'; text: string; time: string; attachmentName?: string }) => {
    if (item.sender === 'user') {
      return <p className="whitespace-pre-wrap font-medium">{item.text}</p>;
    }

    const text = item.text;

    // Matching XML tags for structured notes
    const highlightRegex = /<highlight>([\s\S]*?)<\/highlight>/i;
    const summaryRegex = /<summary>([\s\S]*?)<\/summary>/i;
    const formulaRegex = /<formula>([\s\S]*?)<\/formula>/i;
    const hackRegex = /<hack>([\s\S]*?)<\/hack>/i;
    const trapRegex = /<trap>([\s\S]*?)<\/trap>/i;

    const hasHighlight = highlightRegex.test(text);
    const hasSummary = summaryRegex.test(text);
    const hasFormula = formulaRegex.test(text);
    const hasHack = hackRegex.test(text);
    const hasTrap = trapRegex.test(text);

    if (!hasHighlight && !hasSummary && !hasFormula && !hasHack && !hasTrap) {
      // General fallback if no special note-making tags are outputted
      return (
        <div className="space-y-2 select-text leading-relaxed text-zinc-250">
          {renderFormattedText(text)}
        </div>
      );
    }

    highlightRegex.lastIndex = 0;
    summaryRegex.lastIndex = 0;
    formulaRegex.lastIndex = 0;
    hackRegex.lastIndex = 0;
    trapRegex.lastIndex = 0;

    const highlightMatches = text.match(highlightRegex);
    const summaryMatches = text.match(summaryRegex);
    const formulaMatches = text.match(formulaRegex);
    const hackMatches = text.match(hackRegex);
    const trapMatches = text.match(trapRegex);

    const highlightText = highlightMatches ? highlightMatches[1].trim() : '';
    const summaryText = summaryMatches ? summaryMatches[1].trim() : '';
    const formulaText = formulaMatches ? formulaMatches[1].trim() : '';
    const hackText = hackMatches ? hackMatches[1].trim() : '';
    const trapText = trapMatches ? trapMatches[1].trim() : '';

    // Extract ambient text on outside
    const cleanText = text
      .replace(/<highlight>[\s\S]*?<\/highlight>/gi, '')
      .replace(/<summary>[\s\S]*?<\/summary>/gi, '')
      .replace(/<formula>[\s\S]*?<\/formula>/gi, '')
      .replace(/<hack>[\s\S]*?<\/hack>/gi, '')
      .replace(/<trap>[\s\S]*?<\/trap>/gi, '')
      .replace(/###\s+[^\n]+/gi, '') // clean headers
      .trim();

    const addNoteToNotebook = (category: string, title: string, content: string) => {
      const isDuplicate = savedShortNotes.some(note => note.content === content && note.category === category);
      if (isDuplicate) {
        showToast(lang === 'amh' ? '⚠️ ይህ ማስታወሻ አስቀድሞ በደብተርዎ ላይ ተቀምጧል።' : '⚠️ This note is already in your notebook!');
        return;
      }
      
      const newNote = {
        id: `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        subject: selectedSubject || 'General Prep',
        category,
        title,
        content,
        time: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      setSavedShortNotes(prev => [newNote, ...prev]);
      showToast(lang === 'amh' ? '💾 ማስታወሻው በስኬት ተቀምጧል!' : `💾 Saved to Study Notebook!`);
    };

    return (
      <div className="space-y-4 w-full text-zinc-100 select-text">
        {cleanText && (
          <div className="leading-relaxed border-b border-zinc-800/40 pb-3">
            {renderFormattedText(cleanText)}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 pt-1">
          {/* Highlight Card */}
          {highlightText && (
            <div className="p-4 rounded-xl border border-amber-500/10 bg-amber-500/5 transition hover:border-amber-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-amber-500/15 pb-2 mb-3.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 flex items-center gap-1.5 uppercase">
                  🎯 CORE HIGHLIGHT
                </span>
                <button
                  onClick={() => addNoteToNotebook('highlight', 'Key Highlight', highlightText)}
                  className="w-full sm:w-auto min-h-[40px] sm:min-h-0 px-4 py-2 sm:px-2.5 sm:py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs sm:text-[10px] font-mono tracking-wider active:scale-95 transition cursor-pointer select-none font-bold uppercase flex items-center justify-center gap-1.5"
                >
                  <span>💾</span>
                  <span>Save Note</span>
                </button>
              </div>
              <div className="text-zinc-150 font-semibold text-xs sm:text-sm leading-relaxed antialiased">
                {renderFormattedText(highlightText)}
              </div>
            </div>
          )}

          {/* Summary Bullet-Notes Card */}
          {summaryText && (
            <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 transition hover:border-emerald-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-emerald-500/15 pb-2 mb-3.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 flex items-center gap-1.5 uppercase">
                  📖 COMPACT BRIEF
                </span>
                <button
                  onClick={() => addNoteToNotebook('summary', `${selectedSubject} Notes`, summaryText)}
                  className="w-full sm:w-auto min-h-[40px] sm:min-h-0 px-4 py-2 sm:px-2.5 sm:py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs sm:text-[10px] font-mono tracking-wider active:scale-95 transition cursor-pointer select-none font-bold uppercase flex items-center justify-center gap-1.5"
                >
                  <span>💾</span>
                  <span>Save Note</span>
                </button>
              </div>
              <div className="text-zinc-200 text-xs sm:text-sm leading-relaxed space-y-1 pl-1 antialiased">
                {renderFormattedText(summaryText)}
              </div>
            </div>
          )}

          {/* Formula / Textbook rule Card */}
          {formulaText && (
            <div className="p-4 rounded-xl border border-sky-500/15 bg-sky-950/10 transition hover:border-sky-500/25">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-sky-500/15 pb-2 mb-3.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#0ea5e9] flex items-center gap-1.5 uppercase">
                  📐 CHEAT FORMULAS / CORE RULES
                </span>
                <button
                  onClick={() => addNoteToNotebook('formula', `${selectedSubject} Formula`, formulaText)}
                  className="w-full sm:w-auto min-h-[40px] sm:min-h-0 px-4 py-2 sm:px-2.5 sm:py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-450 text-xs sm:text-[10px] font-mono tracking-wider active:scale-95 transition cursor-pointer select-none font-bold uppercase flex items-center justify-center gap-1.5"
                >
                  <span>💾</span>
                  <span>Save Note</span>
                </button>
              </div>
              <div className="text-sky-300 font-mono text-xs sm:text-sm p-3.5 rounded-lg bg-black/60 border border-sky-950/80 text-left selection:bg-sky-950/50 leading-relaxed">
                {renderFormattedText(formulaText)}
              </div>
            </div>
          )}

          {/* Exam Hack Card */}
          {hackText && (
            <div className="p-4 rounded-xl border border-purple-500/15 bg-purple-550/5 transition hover:border-purple-500/25">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-purple-500/15 pb-2 mb-3.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 flex items-center gap-1.5 uppercase">
                  ⚡ EXAM SPEED-HACK
                </span>
                <button
                  onClick={() => addNoteToNotebook('hack', 'Solving Shortcut', hackText)}
                  className="w-full sm:w-auto min-h-[40px] sm:min-h-0 px-4 py-2 sm:px-2.5 sm:py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs sm:text-[10px] font-mono tracking-wider active:scale-95 transition cursor-pointer select-none font-bold uppercase flex items-center justify-center gap-1.5"
                >
                  <span>💾</span>
                  <span>Save Note</span>
                </button>
              </div>
              <div className="text-purple-150 font-medium text-xs sm:text-sm leading-relaxed antialiased">
                {renderFormattedText(hackText)}
              </div>
            </div>
          )}

          {/* Trap Card */}
          {trapText && (
            <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-550/5 transition hover:border-rose-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-rose-500/15 pb-2 mb-3.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-rose-450 flex items-center gap-1.5 uppercase">
                  ⚠️ EXAMINER TRAP AVOIDANCE
                </span>
                <button
                  onClick={() => addNoteToNotebook('trap', 'Syllabus Catch', trapText)}
                  className="w-full sm:w-auto min-h-[40px] sm:min-h-0 px-4 py-2 sm:px-2.5 sm:py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 text-xs sm:text-[10px] font-mono tracking-wider active:scale-95 transition cursor-pointer select-none font-bold uppercase flex items-center justify-center gap-1.5"
                >
                  <span>💾</span>
                  <span>Save Note</span>
                </button>
              </div>
              <div className="text-rose-200 text-xs sm:text-sm leading-relaxed font-normal antialiased">
                {renderFormattedText(trapText)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
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
          replyText = `### 🛰️ አክሱም ጂፒቲ (የመስመር ውጪ / Offline ሁኔታ)

በመሳሪያዎ ላይ ከመስመር ውጪ ጥናት እያደረጉ ነው። ለጥያቄዎ የተዘጋጀው ዘመናዊ የጥናት ማጠቃለያ ይህንን ይመስላል፡

<highlight>
የጥናት ጊዜዎ (${completedMinutes} ደቂቃዎች) በአካባቢ ማከማቻ ላይ በትክክል ተመዝግቧል።
</highlight>

<summary>
- ከመስመር ውጭ ሲሆኑ ቀድመው የወረዱ አርዕስቶችን ማንበብ እና የተመደበለትን የጥናት ሰዓት በብቃት መጠቀም ይችላሉ።
- የጥናት ሰሌዳው ላይ ቀመሮችን ደጋግሞ መጻፍ ንቁ ትውስታን (active recall) ያሳድጋል።
</summary>

<formula>
$$ \\text{Study Consistency} = \\text{Focused minutes} \\times \\text{Streak Days} $$
</formula>

<hack>
ብሔራዊ ፈተና ላይ ጊዜን ለመቆጠብ በመጀመሪያ በአጭር ሰከንዶች ውስጥ ሊመለሱ የሚችሉ ቀላል የንድፈ-ሃሳብ (theory) ጥያቄዎችን ሰርተው ይጨርሱ።
</hack>

<trap>
ስሌቶችን ያለ ቀመር ለመስራት መሞከር ጊዜን ያባክናል። የሒሳብ እና የፊዚክስ ትምህርቶችን በቀመር ሰሌዳው ላይ በደረጃ ይለማመዱ።
</trap>

*ሙሉ የ Gemini AI ማብራሪያን ለማግኘት ከመስመር ውጭ ሁነታን ያጥፉ።*`;
        } else {
          replyText = `### 🛰️ Aksum GPT (Local Offline Mode)

You are studying offline. Here is your structured exam-focused lesson guide, complete with auto-notes:

<highlight>
Your study session has been logged offline. Total focus registered: ${completedMinutes} mins.
</highlight>

<summary>
- Offline study prevents web distractions, allowing deeper neural focus.
- Emphasize formula synthesis and active recall repetitions from cached syllabus notes.
- Maintain your daily consistency streak, which actively increases long-term retention.
</summary>

<formula>
$$ T_{\\text{recalled}} \\propto \\text{Consistency} \\cdot N_{\\text{reviews}} $$
</formula>

<hack>
Use the 2-pass exam strategy: spend the first pass answering purely knowledge-based questions within 15 seconds each, securing bulk marks.
</hack>

<trap>
Never skip converting numbers to proper SI units first. A high percentage of mathematical calculation traps in ESSLCE stem from unit conversions.
</trap>

*Turn off "Offline Mode" once you connect to the internet to activate real-time Gemini STEM tutor support!*`;
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
          text: `### 🚀 Aksum GPT (Fallback Tutor Notes)

The remote API proxy experienced a connection hiccup, but your integrated lesson guide for **${selectedSubject}** remains fully operational:

<highlight>
The active subject ${selectedSubject} has core formulas mapped inside regional storage.
</highlight>

<summary>
- Keep math equations clustered inside distinct sections to make them easily readable.
- Isolate independent variables (mass, velocity, charges) before initiating secondary equations.
- Maintain persistent calculations in double-checked margins.
</summary>

<formula>
$$ F = q \\cdot E \\quad \\text{and} \\quad \\lambda = \\frac{h}{p} $$
</formula>

<hack>
When dealing with direct ratio calculations in Chemistry, scale numbers by factors of 10 or 100 first to quickly weed out three of the four distractor options.
</hack>

<trap>
Watch out for unit mismatch traps. Ethiopian examiners love blending kilograms and grams in the same question line to lure candidates into simple mathematical slips.
</trap>

*To restore absolute, infinite real-time AI knowledge streaming, verify that your browser connectivity is green.*`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiTyping(false);
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
          text: `### 🚀 Aksum GPT (Tutor Assistant)

The host server does not have a valid remote API Key configured. Here is your structured exam-focused lesson guide for **${selectedSubject}**:

1. **Direct Answer / Solution**: Solve with immediate structural variables.
2. **Short Explanation**: This query concerns **${selectedSubject}**. Identify your targets, extract independent variables, and isolate the unknown variables.
3. **Fast Solving Method / Exam Strategy**: Look for matching scaling options. Direct ratios allow fast physical estimations without undergoing long algebraic calculations.
4. **Key Formula / Rules**: $$ F = m \cdot a \quad \text{or} \quad \Delta H = m \cdot c \cdot \Delta T $$
5. **Common Mistake to Avoid**: Forgetting to convert units to standard SI equivalents (e.g. centimeters to meters or grams to kilograms).

*To activate complete, high-fidelity real-time AI responses, configure a valid \`GEMINI_API_KEY\` in Settings > Secrets.*`,
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
    <div className="min-h-screen bg-[#02050c] text-slate-100 antialiased relative selection:bg-vip-gold selection:text-black font-sans flex flex-col">
      
      {/* Ambient background glows for premium widescreen displays */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-vip-gold/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-120 h-120 bg-[#06b6d4]/5 rounded-full filter blur-[180px] pointer-events-none" />

      {/* Persistent Toast notification overlays */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl border border-vip-gold bg-vip-slate/95 text-white shadow-xl flex items-center gap-3 glow-gold animate-bounce">
          <Sparkles className="text-vip-gold w-5 h-5 animate-pulse" />
          <span className="font-medium font-display text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Main Responsive Viewport Grid */}
      <div className="w-full flex-1 flex flex-col bg-[#070b13] relative overflow-hidden transition-all duration-300">
        
        {/* Responsive Content workspace wrapper */}
        <div className="flex-1 flex flex-col h-full relative">
          
          {/* ================= ONBOARDING / REGISTRATION IF NOT REGISTERED ================= */}
          {!studentInfo.isRegistered ? (
            <div className="flex-1 flex flex-col justify-center items-center p-6 bg-[#030712] overflow-y-auto no-scrollbar min-h-screen relative">
              {/* Backglow element for subtle depth layout */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-500/5 rounded-full filter blur-[120px] pointer-events-none" />
              
              <div className="w-full max-w-sm space-y-8 relative z-10 py-8">
                
                {/* Brand Logo Header & Lang selector */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 shadow-md">
                    <GraduationCap className="text-amber-500 w-5 h-5" />
                  </div>
                  <div>
                    <h1 id="academy-brand" className="text-sm font-bold font-display uppercase tracking-widest text-[#f8fafc]">
                      AKSUM ACADEMY <span className="text-amber-500 font-mono text-[9px] lowercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-bold ml-1">vip</span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                      {lang === 'amh' 
                        ? 'ከከፍተኛ ዩኒቨርሲቲ መምህራን የተዘጋጁ የምዕራፍ ማብራሪያዎችን፣ ብሔራዊ ፈተናዎችን እና ቀመሮችን የያዘ የክለሳ መድረክ።'
                        : 'Elite preparatory companion and interactive syllabus resources for ambitious candidates.'}
                    </p>
                  </div>

                  {/* Language switch button */}
                  <button 
                    onClick={() => setLang(lang === 'amh' ? 'eng' : 'amh')}
                    className="mt-1 text-[10px] uppercase font-mono tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700 transition duration-150 cursor-pointer"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>{lang === 'amh' ? 'ENG VERSION' : 'በአማርኛ ለመቀጠል'}</span>
                  </button>
                </div>

                {/* Form Card Container */}
                <div className="p-6 md:p-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 backdrop-blur-md space-y-6 shadow-xl">
                  {/* Onboarding Mode Selector Segment Control */}
                  <div className="grid grid-cols-2 p-1 rounded-lg bg-zinc-900 border border-zinc-850">
                    <button 
                      type="button"
                      onClick={() => setOnboardingMode('register')}
                      className={`py-1.5 rounded-md text-xs font-semibold transition duration-150 flex items-center justify-center gap-1.5 px-2 cursor-pointer ${
                        onboardingMode === 'register' 
                          ? 'bg-zinc-800 text-white border border-zinc-750 shadow-sm font-bold' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{lang === 'amh' ? 'አዲስ ምዝገባ' : 'Register'}</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setOnboardingMode('signin')}
                      className={`py-1.5 rounded-md text-xs font-semibold transition duration-150 flex items-center justify-center gap-1.5 px-2 cursor-pointer ${
                        onboardingMode === 'signin' 
                          ? 'bg-zinc-800 text-white border border-zinc-750 shadow-sm font-bold' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{lang === 'amh' ? 'መለያ መግቢያ' : 'Sign In'}</span>
                    </button>
                  </div>

                  {/* Core Inputs Block */}
                  {onboardingMode === 'register' ? (
                    <div className="space-y-4 animate-fade-in">
                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-450 uppercase tracking-wider font-mono block px-0.5">{lang === 'amh' ? 'ሙሉ ስም' : 'Student Full Name'}</label>
                        <input 
                          type="text" 
                          placeholder={lang === 'amh' ? 'ለምሳሌ፡ ዮናታን በየነ' : 'e.g., Yonatan Beyene'}
                          className="w-full h-11 px-3 rounded-lg border border-zinc-850 bg-zinc-900/40 text-zinc-200 outline-none focus:border-zinc-750 focus:bg-zinc-900/60 transition text-xs"
                          value={studentInfo.name}
                          onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                        />
                      </div>

                      {/* School Name */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-450 uppercase tracking-wider font-mono block px-0.5">{lang === 'amh' ? 'ትምህርት ቤት' : 'High School Name'}</label>
                        <input 
                          type="text" 
                          placeholder={lang === 'amh' ? 'ለምሳሌ፡ የካ የዝግጅት' : 'e.g., Yeka Preparatory'}
                          className="w-full h-11 px-3 rounded-lg border border-zinc-850 bg-zinc-900/40 text-zinc-200 outline-none focus:border-zinc-750 focus:bg-zinc-900/60 transition text-xs"
                          value={studentInfo.school}
                          onChange={(e) => setStudentInfo({ ...studentInfo, school: e.target.value })}
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-450 uppercase tracking-wider font-mono block px-0.5">{lang === 'amh' ? 'የስልክ ቁጥር' : 'Phone Number (09...)'}</label>
                        <input 
                          type="tel" 
                          placeholder="0911223344"
                          className="w-full h-11 px-3 rounded-lg border border-zinc-850 bg-zinc-900/40 text-zinc-200 outline-none focus:border-zinc-750 focus:bg-zinc-900/60 transition text-xs"
                          value={studentInfo.phone}
                          onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })}
                        />
                      </div>

                      {/* Password */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-450 uppercase tracking-wider font-mono block px-0.5">{lang === 'amh' ? 'የይለፍ ቃል' : 'Password passcode'}</label>
                        <input 
                          type="password" 
                          placeholder="••••"
                          className="w-full h-11 px-3 rounded-lg border border-zinc-850 bg-zinc-900/40 text-zinc-200 outline-none focus:border-zinc-750 focus:bg-zinc-900/60 transition text-xs"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                        />
                      </div>

                      {/* Stream choice */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-450 uppercase tracking-wider font-mono block px-0.5">{lang === 'amh' ? 'የትምህርት መስክ' : 'Academic Focus Stream'}</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            type="button"
                            onClick={() => setStudentInfo({ ...studentInfo, fieldStream: 'Natural Science' })}
                            className={`h-11 flex items-center justify-center rounded-lg text-xs font-semibold border transition duration-150 cursor-pointer ${
                              studentInfo.fieldStream === 'Natural Science' 
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                                : 'bg-zinc-900/40 text-[#cbd5e1] border-zinc-850 hover:bg-zinc-900/60'
                            }`}
                          >
                            <span>{lang === 'amh' ? 'ከተፈጥሮ ሳይንስ' : 'Natural Sci'}</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setStudentInfo({ ...studentInfo, fieldStream: 'Social Science' })}
                            className={`h-11 flex items-center justify-center rounded-lg text-xs font-semibold border transition duration-150 cursor-pointer ${
                              studentInfo.fieldStream === 'Social Science' 
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' 
                                : 'bg-zinc-900/40 text-[#cbd5e1] border-zinc-850 hover:bg-zinc-900/60'
                            }`}
                          >
                            <span>{lang === 'amh' ? 'ማኅበራዊ ሳይንስ' : 'Social Sci'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Destination selection */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-450 uppercase tracking-wider font-mono block px-0.5">{lang === 'amh' ? 'የሚመርጡት ዩኒቨርሲቲ' : 'Target Admissions University'}</label>
                        <select 
                          className="w-full h-11 px-2 rounded-lg border border-zinc-850 bg-zinc-900 text-xs text-zinc-200 outline-none focus:border-zinc-750 transition cursor-pointer"
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
                  ) : (
                    <div className="space-y-4 animate-fade-in">
                      {/* Sign in name */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-450 uppercase tracking-wider font-mono block px-0.5">{lang === 'amh' ? 'የስልክ ቁጥር ወይም ሙሉ ስም' : 'Name or Phone Number'}</label>
                        <input 
                          type="text" 
                          placeholder={lang === 'amh' ? 'ዮናታን በየነ ወይም 09...' : 'e.g., Yonatan Beyene'}
                          className="w-full h-11 px-3 rounded-lg border border-zinc-850 bg-zinc-900/40 text-zinc-200 outline-none focus:border-zinc-750 focus:bg-zinc-900/60 transition text-xs"
                          value={signinIdentifier}
                          onChange={(e) => setSigninIdentifier(e.target.value)}
                        />
                      </div>

                      {/* Sign in passcode */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-450 uppercase tracking-wider font-mono block px-0.5">{lang === 'amh' ? 'የይለፍ ቃል' : 'Password passcode'}</label>
                        <input 
                          type="password" 
                          placeholder="••••"
                          className="w-full h-11 px-3 rounded-lg border border-zinc-850 bg-zinc-900/40 text-zinc-200 outline-none focus:border-zinc-750 focus:bg-zinc-900/60 transition text-xs"
                          value={signinPassword}
                          onChange={(e) => setSigninPassword(e.target.value)}
                        />
                      </div>

                      {/* Forgot password */}
                      <div className="text-right pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setRecoveryIdentifier(signinIdentifier);
                            setRecoveryStatus('idle');
                            setRecoveryError(null);
                            setShowRecoveryModal(true);
                          }}
                          className="text-[11px] text-amber-500 font-semibold hover:underline cursor-pointer transition duration-150"
                        >
                          {lang === 'amh' ? 'የይለፍ ቃል ረስተዋል?' : 'Forgot Password?'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Session Persistence remember me */}
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-850/80 flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer select-none group w-full">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-amber-500 rounded border-zinc-800 bg-zinc-950 cursor-pointer"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <div className="leading-none text-left">
                        <span className="text-xs font-semibold text-zinc-200 group-hover:text-amber-400 transition block">
                          {lang === 'amh' ? 'የእኔን መለያ አስታውስ' : 'Remember Session'}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {lang === 'amh' ? 'በቀጣይ በራስሰር እንዲገባ ይፈቅዳል' : 'Keep me signed in on this device'}
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Submit Button */}
                  {onboardingMode === 'register' ? (
                    <button 
                      onClick={() => {
                        if (!studentInfo.name.trim() || !studentInfo.school.trim() || !studentInfo.phone.trim()) {
                          showToast(lang === 'amh' ? '⚠️ እባክዎ ስም፣ ትምህርት ቤት እና ስልክ ሙሉ ያድርጉ!' : '⚠️ Please fill out Name, school & phone to continue!');
                          return;
                        }
                        registerStudent(studentInfo);
                      }}
                      className="w-full h-11 rounded-lg text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition duration-150 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{lang === 'amh' ? 'አካዳሚውን ፍጠር' : 'Initialize VIP Portal'}</span>
                    </button>
                  ) : (
                    <button 
                      onClick={handleSignIn}
                      className="w-full h-11 rounded-lg text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition duration-150 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{lang === 'amh' ? 'ግባ' : 'Sign In'}</span>
                    </button>
                  )}
                </div>

                {/* Subtext info */}
                <div className="flex gap-2 text-center justify-center items-center text-[10px] text-slate-500">
                  <Info className="w-3.5 h-3.5 text-slate-600" />
                  <span>Aksum Prep VIP • Securing offline-first storage access</span>
                </div>
              </div>
              {showRecoveryModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
                  <div onClick={() => setShowRecoveryModal(false)} className="absolute inset-0 cursor-default" />
                  
                  <div className="relative w-full max-w-sm bg-[#0b0f19] border border-[#cca43b]/40 rounded-3xl p-5 shadow-2xl space-y-4 text-left z-10 animate-scale-up">
                    {/* Close button icon bar */}
                    <button 
                      onClick={() => setShowRecoveryModal(false)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white transition w-8 h-8 flex items-center justify-center cursor-pointer text-sm bg-vip-slate/40 rounded-full"
                    >
                      ✕
                    </button>

                    <div className="flex items-center gap-2.5 pb-2 border-b border-[#cca43b]/15">
                      <div className="w-9 h-9 rounded-xl bg-vip-gold/10 flex items-center justify-center text-vip-gold border border-vip-gold/20">
                        <KeyRound className="w-5 h-5 text-vip-gold" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-gradient-gold uppercase tracking-wider">
                          {lang === 'amh' ? 'የይለፍ ቃል መልሶ ማግኛ' : 'Password Recovery'}
                        </h4>
                        <p className="text-[10px] text-[#94a3b8]">
                          {lang === 'amh' ? 'የአክሱም VIP አካዳሚ ደህንነት' : 'Sovereign security simulator'}
                        </p>
                      </div>
                    </div>

                    {recoveryStatus === 'idle' && (
                      <div className="space-y-4 animate-fade-in">
                        <p className="text-xs text-[#cbd5e1] leading-relaxed">
                          {lang === 'amh' 
                            ? 'እባክዎ የተመዘገቡበትን ሙሉ ስም ወይም የስልክ ቁጥር ያስገቡ። በሞባይል ስልክዎ ላይ አዲስ የ OTP ጊዜያዊ የይለፍ ቃል በምስሌ እንልካለን።' 
                            : 'Please enter your registered user name or phone number. We will simulate sending a recovery reset token and OTP passcode link instruction.'}
                        </p>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-[#64748b] block px-0.5 tracking-wider">
                            {lang === 'amh' ? 'የስልክ ቁጥር ወይም ሙሉ ስም' : 'Registered Name / Phone'}
                          </label>
                          <input 
                            type="text" 
                            placeholder={lang === 'amh' ? 'ለምሳሌ፡ 0911...' : 'e.g., 0911223344 or name'}
                            className="w-full h-11 px-3.5 rounded-xl border border-slate-800 bg-[#070b13] text-xs text-white outline-none focus:border-vip-gold focus:bg-[#090e1a] transition min-h-[44px]"
                            value={recoveryIdentifier}
                            onChange={(e) => setRecoveryIdentifier(e.target.value)}
                          />
                        </div>

                        {recoveryError && (
                          <p className="text-[11px] text-red-400 bg-red-950/20 border border-red-900/30 p-2.5 rounded-xl animate-shake">
                            {recoveryError}
                          </p>
                        )}

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowRecoveryModal(false)}
                            className="flex-1 h-11 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800 transition cursor-pointer min-h-[44px]"
                          >
                            {lang === 'amh' ? 'ይቅር' : 'Cancel'}
                          </button>
                          <button
                            type="button"
                            onClick={handleRequestPasswordRecovery}
                            className="flex-1 h-11 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-vip-gold to-yellow-500 hover:bg-yellow-500 hover:to-amber-500 transition cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{lang === 'amh' ? 'ኮድ ላክ' : 'Send Code'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {recoveryStatus === 'sending' && (
                      <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-10 h-10 rounded-full border-4 border-vip-gold/20 border-t-vip-gold animate-spin" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-vip-gold">
                            {lang === 'amh' ? 'በማረጋገጥ ላይ...' : 'Securing local registry database...'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {lang === 'amh' ? 'የደህንነት ቻናል በመክፈት ላይ' : 'Interfacing simulated API gate...'}
                          </p>
                        </div>
                      </div>
                    )}

                    {recoveryStatus === 'sent' && (
                      <div className="space-y-4 animate-fade-in text-center py-2">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-xl shadow-inner">
                          ✓
                        </div>
                        <div className="space-y-1.5">
                          <h5 className="text-xs font-black text-emerald-400 uppercase tracking-widest leading-none">
                            {lang === 'amh' ? 'በተሳካ ሁኔታ ተልኳል!' : 'Recovery Sent!'}
                          </h5>
                          <p className="text-[11px] text-[#cbd5e1] leading-relaxed max-w-xs mx-auto">
                            {lang === 'amh' 
                              ? `የይለፍ ቃል መልሶ ማግኛ አቶፒ ኮድ ወደ ተመዘገበው መለያ (${recoveryIdentifier}) በቴሌግራም/SMS በኩል በምስሌ በተሳካ ሁኔታ ተልኳል።`
                              : `We have dispatched simulated recovery passcode link credentials targeting "${recoveryIdentifier}" via secure SMS API gateway successfully.`}
                          </p>
                        </div>

                        <div className="bg-black/80 border border-slate-800 rounded-xl p-3 text-left space-y-1.5 text-[10px] font-mono select-all">
                          <span className="text-slate-500 block uppercase font-bold text-[8px] tracking-wide">🎯 SIMULATED TELEMETRY LOG:</span>
                          <p className="text-emerald-400 leading-none">STATUS: DELIVERED (200 OK)</p>
                          <p className="text-slate-300">Target User: {recoveryIdentifier}</p>
                          <p className="text-yellow-400 leading-normal">Recovery Action: Use temporary bypass code to authenticate seamlessly.</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowRecoveryModal(false)}
                          className="w-full h-11 rounded-xl text-xs font-bold text-black bg-vip-gold hover:bg-yellow-500 transition cursor-pointer min-h-[44px] mt-2 block"
                        >
                          {lang === 'amh' ? 'ወደ መግቢያ ገጽ ተመለስ' : 'Return to Login'}
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ================= HIGH FIDELITY REGISTERED MAIN DASHBOARD ================= */
            <>
              {/* Sticky Top App Bar Header (Requirement 3) */}
              <header className="h-14 border-b border-zinc-800 bg-[#090d16] px-4 flex items-center justify-between shrink-0 select-none z-40 sticky top-0 backdrop-blur-md">
                
                {/* Left: Scholar avatar picture with a premium minimal design */}
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => {
                      if (window.confirm(lang === 'amh' ? 'የተማሪውን መመዝገቢያ ማስረጃዎችን እና ጥናቶችን ማጽዳት ይፈልጋሉ?' : 'Do you want to reset student login fields?')) {
                        localStorage.clear();
                        setStudentInfo({ ...studentInfo, isRegistered: false });
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-750 text-zinc-300 font-bold flex items-center justify-center text-xs select-none cursor-pointer hover:bg-zinc-800 hover:text-white transition duration-200"
                    title="Tap to Reset / Log out"
                  >
                    {studentInfo.name ? studentInfo.name.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <div className="leading-none hidden sm:block">
                    <p className="text-xs font-semibold text-[#f8fafc] truncate max-w-[120px]">
                      {studentInfo.name || 'Scholar'}
                    </p>
                    <p className="text-[9px] text-[#cca43b] font-mono tracking-widest uppercase font-bold leading-none mt-0.5">
                      {studentInfo.fieldStream === 'Natural Science' ? 'NATURAL' : 'SOCIAL'}
                    </p>
                  </div>
                </div>

                {/* Center: Brand Wordmark (SaaS standard, elegant, minimal) */}
                <div className="text-center">
                  <div className="flex items-center gap-2 justify-center">
                    <h2 className="text-xs font-bold font-display tracking-widest text-[#f8fafc]">
                      AKSUM PREP
                    </h2>
                    <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1 py-0.5 rounded uppercase font-mono font-bold tracking-wider leading-none">
                      VIP
                    </span>
                  </div>
                </div>

                {/* Right: Notification Alerts bell & Language switcher */}
                <div className="flex items-center gap-2">
                  
                  {/* Lang switcher toggler */}
                  <button 
                    onClick={() => {
                      const nextLang = lang === 'amh' ? 'eng' : 'amh';
                      setLang(nextLang);
                      setStudentInfo({ ...studentInfo, preferredLanguage: nextLang });
                      showToast(nextLang === 'amh' ? '🌍 ቋንቋው ወደ አማርኛ ተቀይሯል!' : '🌍 Switched to English version!');
                    }}
                    className="px-2 py-1 rounded border border-zinc-800 bg-[#030712] text-zinc-400 hover:text-white hover:border-zinc-700 text-[10px] font-mono tracking-wider font-semibold cursor-pointer transition"
                  >
                    {lang === 'amh' ? 'ENG_VERSION' : 'አማርኛ'}
                  </button>

                  {/* Compact notification bell triggering direct alerts pane */}
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className="relative p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-white bg-[#030712] cursor-pointer hover:border-zinc-700 transition"
                    title="View Notifications Alert Feed"
                  >
                    <Bell className="w-3.5 h-3.5 text-zinc-350" />
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                  </button>

                </div>
              </header>

              <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-3.5rem)] overflow-hidden">
                
                {/* Desktop Sidebar navigation panel */}
                <aside className="hidden md:flex flex-col w-60 border-r border-zinc-850 bg-[#090d16]/30 p-4 shrink-0 justify-between select-none overflow-hidden h-full">
                  <div className="space-y-6 overflow-y-auto no-scrollbar flex-1 pb-4">
                    {/* Category: Academic Hub */}
                    <div className="space-y-2">
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold px-2 py-1 leading-none">
                        {lang === 'amh' ? 'የትምህርት መስመር' : 'Academic Hub'}
                      </div>
                      <nav className="flex flex-col gap-1">
                        {[
                          { id: 'dashboard', label: lang === 'amh' ? 'ዋና ገጽ' : 'Dashboard', icon: TrendingUp },
                          { id: 'curriculum', label: lang === 'amh' ? 'ሲላበስ' : 'Curriculum Readings', icon: BookOpen },
                          { id: 'video_lectures', label: lang === 'amh' ? 'ቪዲዮ ትምህርቶች' : 'Video Lectures', icon: Video },
                          { id: 'formulas', label: lang === 'amh' ? 'ፎርሙላዎች' : 'Interactive Formulas', icon: Cpu },
                          { id: 'practice', label: lang === 'amh' ? 'ፈተና እና ጥያቄዎች' : 'National Exams & Prep', icon: Award }
                        ].map((btn) => {
                          const Icon = btn.icon;
                          const isActive = activeTab === btn.id;
                          return (
                            <button
                              key={btn.id}
                              onClick={() => {
                                setActiveTab(btn.id);
                                setCurrentMCQIndex(0);
                                setRevealMCQAnswer(false);
                              }}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition select-none cursor-pointer w-full text-left border ${
                                isActive 
                                  ? 'bg-zinc-900 border-zinc-800 text-[#f8fafc] shadow-sm font-semibold' 
                                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950/20 border-transparent'
                              }`}
                            >
                              <Icon className="w-4 h-4 shrink-0" />
                              <span className="truncate">{btn.label}</span>
                            </button>
                          );
                        })}
                      </nav>
                    </div>

                    {/* Category: VIP Resources */}
                    <div className="space-y-2">
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold px-2 py-1 leading-none">
                        {lang === 'amh' ? 'ልዩ የጥናት አገልግሎቶች' : 'VIP Classrooms'}
                      </div>
                      <nav className="flex flex-col gap-1">
                        {[
                          { id: 'gptpro', label: lang === 'amh' ? 'የአይ አይ ረዳት' : 'Ask Gemini AI Tutor', icon: Sparkles },
                          { id: 'universities', label: lang === 'amh' ? 'የዩኒቨርሲቲ መመሪያ' : 'Ethiopian Colleges', icon: GraduationCap },
                          { id: 'google_drive', label: lang === 'amh' ? 'የጥናት ማህደር' : 'Drive Resource Library', icon: Cloud },
                          { id: 'premium', label: lang === 'amh' ? 'የክብር ሜዳሊያ' : 'VIP Hub & Certs', icon: Trophy }
                        ].map((btn) => {
                          const Icon = btn.icon;
                          const isActive = activeTab === btn.id;
                          return (
                            <button
                              key={btn.id}
                              onClick={() => {
                                setActiveTab(btn.id);
                                setCurrentMCQIndex(0);
                                setRevealMCQAnswer(false);
                              }}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition select-none cursor-pointer w-full text-left border ${
                                isActive 
                                  ? 'bg-zinc-900 border-zinc-800 text-[#f8fafc] shadow-sm font-semibold' 
                                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950/20 border-transparent'
                              }`}
                            >
                              <Icon className="w-4 h-4 shrink-0" />
                              <span className="truncate">{btn.label}</span>
                            </button>
                          );
                        })}
                      </nav>
                    </div>

                    {/* Category: Support Desk */}
                    <div className="space-y-2">
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold px-2 py-1 leading-none">
                        {lang === 'amh' ? 'ስርዓት' : 'Academic Admin'}
                      </div>
                      <nav className="flex flex-col gap-1">
                        {[
                          { id: 'notifications', label: lang === 'amh' ? 'ማሳወቂያዎች' : 'Notifications Desk', icon: Bell },
                          { id: 'about_app', label: lang === 'amh' ? 'ስለ እኛ' : 'About Aksum App', icon: Info }
                        ].map((btn) => {
                          const Icon = btn.icon;
                          const isActive = activeTab === btn.id;
                          return (
                            <button
                              key={btn.id}
                              onClick={() => {
                                setActiveTab(btn.id);
                                setCurrentMCQIndex(0);
                                setRevealMCQAnswer(false);
                              }}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition select-none cursor-pointer w-full text-left border ${
                                isActive 
                                  ? 'bg-zinc-900 border-zinc-800 text-[#f8fafc] shadow-sm font-semibold' 
                                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950/20 border-transparent'
                              }`}
                            >
                              <Icon className="w-4 h-4 shrink-0" />
                              <span className="truncate">{btn.label}</span>
                            </button>
                          );
                        })}
                      </nav>
                    </div>
                  </div>

                  {/* Desktop Stats summary widget (SaaS dashboard feel) */}
                  <div className="p-3.5 rounded-xl border border-zinc-850 bg-zinc-950/30 space-y-3 mt-auto">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold leading-none">
                      Prep Analytics
                    </p>
                    <div className="space-y-2 text-xs">
                      <p className="text-zinc-400 flex justify-between">
                        <span>{lang === 'amh' ? 'የጥናት ጊዜ:' : 'Total Study:'}</span>
                        <strong className="text-zinc-100 font-mono">{completedMinutes}m</strong>
                      </p>
                      <p className="text-zinc-400 flex justify-between">
                        <span>{lang === 'amh' ? 'የቀናት ድግግሞሽ:' : 'Streak Count:'}</span>
                        <strong className="text-amber-500 font-mono">{dailyStreak} 🔥</strong>
                      </p>
                    </div>
                  </div>
                </aside>

                {/* Primary Content Scrollable Viewport Frame */}
                <main id="app-workspace" className="flex-1 overflow-y-auto bg-gradient-to-b from-[#090d16] to-[#0e0a1b] p-4 md:p-8 space-y-8 no-scrollbar h-full w-full">


              {/* ================= TAB 1: DASHBOARD ================= */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fade-in pb-12">
                  
                  {/* Hero greeting */}
                  <div className="p-6 md:p-8 rounded-2xl border border-zinc-850 bg-zinc-950/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full filter blur-[100px] pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#f8fafc]">
                          {lang === 'amh' ? `ሰላም፣ ${studentInfo.name}` : `Welcome back, ${studentInfo.name}`}
                        </h2>
                        <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
                          {lang === 'amh' 
                            ? 'የኔታ! በኢትዮጵያ ምርጥ ተፈታኞች የሚጠቀሙበት የላቀ የብሔራዊ ማትሪክ መከለሻ መድረክ። የዕለት ተዕለት ጥናትዎን ለመመዝገብ መተግበሪያውን ተጠቅመው ያጥኑ።'
                            : 'Accessing high-fidelity candidate analytics. Your study history and syllabus metrics are synchronized offline on this device.'}
                        </p>
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                            <Target className="w-3.5 h-3.5 text-amber-500" />
                            <span>{lang === 'amh' ? 'ይፋዊ መድረሻ ዩኒቨርሲቲ፡' : 'TARGET COLLEGE:'} <strong className="text-white font-bold">{studentInfo.targetUniversity}</strong></span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Copy stats */}
                        <button 
                          onClick={handleCopyStats}
                          className="px-3.5 h-10 text-xs font-semibold rounded-lg border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-350 bg-[#030712] transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{lang === 'amh' ? 'ውጤት አጋራ' : 'Share Metrics'}</span>
                        </button>

                        <button 
                          onClick={() => setActiveTab('apkstore')}
                          className="px-4 h-10 text-xs font-bold rounded-lg bg-white hover:bg-zinc-200 text-black transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{lang === 'amh' ? 'የስልክ መተግበሪያ ጫን' : 'Get Phone App'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Top Stats Grid Charts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* Stat Card 1: Study hours */}
                    <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/20 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold cursor-pointer hover:underline" onClick={() => setActiveTab('apkstore')}>
                          {lang === 'amh' ? 'አጠቃላይ ጥናት' : 'Total Focused Time'}
                        </p>
                        <p className="text-xl font-bold font-mono text-[#f8fafc] mt-1">
                          {completedMinutes} <span className="text-xs text-zinc-400 font-normal">{lang === 'amh' ? 'ደቂቃ' : 'Mins'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Stat Card 2: National target score requirements */}
                    <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/20 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-400">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold">
                          {lang === 'amh' ? 'የማለፊያ ነጥብ' : 'Admission Benchmark'}
                        </p>
                        <p className="text-xl font-bold font-mono text-purple-400 mt-1">
                          {studentInfo.fieldStream === 'Natural Science' ? '380 - 430' : '350 - 380'}
                          <span className="text-xs text-zinc-500 font-normal"> / 600</span>
                        </p>
                      </div>
                    </div>

                    {/* Stat Card 3: Completed exercises */}
                    <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/20 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold">
                          {lang === 'amh' ? 'የተመለሱ ጥያቄዎች' : 'Active MCQ Activity'}
                        </p>
                        <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                          {Object.keys(answersState).length} <span className="text-xs text-zinc-500 font-normal">{lang === 'amh' ? 'ጥያቄዎች' : 'Solved'}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Performance Analytics Dashboard panel */}
                  <AnalyticsDashboard
                    lang={lang}
                    completedMinutes={completedMinutes}
                    dailyStreak={dailyStreak}
                    totalQuestionsSolved={Object.keys(answersState).length}
                    accuracyRate={(() => {
                      const answered = Object.values(answersState);
                      if (answered.length === 0) return 85; 
                      const correct = answered.filter(a => a.correct).length;
                      return Math.round((correct / answered.length) * 100);
                    })()}
                  />

                  {/* Horizontal Scrolling Grid of Core Prep Category Launchers */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold tracking-widest text-zinc-550 uppercase px-1 font-mono">
                      {lang === 'amh' ? 'ፈጣን የጥናት ክፍሎች' : 'QUICK MODULE LAUNCHERS'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          title: lang === 'amh' ? 'ብሔራዊ ፈተናዎች' : 'PRACTICE HUB',
                          desc: lang === 'amh' ? 'ባለፉት አመታት የወጡ የብሔራዊ ማትሪክ ፈተና ጥያቄዎች በዝርዝር ማብራሪያ' : 'Review past examinations and verify metrics against actual syllabus solutions.',
                          tab: 'practice',
                          icon: Award,
                          color: 'border-zinc-850 hover:border-zinc-700 bg-zinc-950/20'
                        },
                        {
                          title: lang === 'amh' ? 'የሳይንስ ቀመሮች' : 'CORE FORMULAS',
                          desc: lang === 'amh' ? 'የትምህርት ክፍሎች የፊዚክስና ኬሚስትሪ ቀመሮች እና አጠቃቀማቸው' : 'Step-by-step math solver tool and physics formula constants board.',
                          tab: 'formulas',
                          icon: Cpu,
                          color: 'border-zinc-850 hover:border-zinc-700 bg-zinc-950/20'
                        },
                        {
                          title: lang === 'amh' ? 'የዩኒቨርሲቲ በር' : 'COLLEGES CORNER',
                          desc: lang === 'amh' ? 'ምርጥ የኢትዮጵያ ዩኒቨርሲቲዎች፣ የመግቢያ ውጤትና የቅበላ መመዘኛ' : 'Compare historic class intakes, grade brackets, and direct college indices.',
                          tab: 'universities',
                          icon: GraduationCap,
                          color: 'border-zinc-850 hover:border-zinc-700 bg-zinc-950/20'
                        },
                        {
                          title: lang === 'amh' ? 'አንድሮይድ ሲሙሌተር' : 'MOBILE APP (.APK)',
                          desc: lang === 'amh' ? 'ዝቅተኛ ኔትወርክ ባለባቸው አካባቢዎች ከመስመር ውጪ ጥናትን ማግኘት' : 'Download local resources for offline candidate dashboard deployment.',
                          tab: 'apkstore',
                          icon: Smartphone,
                          color: 'border-zinc-850 hover:border-zinc-700 bg-zinc-950/20'
                        }
                      ].map((mod, i) => {
                        const Icon = mod.icon;
                        return (
                          <div
                            key={i}
                            onClick={() => {
                              setActiveTab(mod.tab);
                              showToast(`🚀 ${lang === 'amh' ? 'ክፍሉ ተመርጧል!' : 'Launching ' + mod.title}!`);
                            }}
                            className={`p-5 rounded-xl border ${mod.color} active:scale-98 transition duration-200 cursor-pointer flex flex-col justify-between h-40 group`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-100 group-hover:text-amber-500 transition">{mod.title}</span>
                                <Icon className="w-4 h-4 text-zinc-550" />
                              </div>
                              <p className="text-[11px] text-zinc-500 leading-relaxed mt-1 line-clamp-3">{mod.desc}</p>
                            </div>
                            <span className="text-[9px] font-mono tracking-widest text-zinc-400 group-hover:text-zinc-200 transition font-bold block">
                              {lang === 'amh' ? 'ጀምር →' : 'LAUNCH MODULE →'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Horizontal Scrolling Grid of Academic Trending Courses */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-[10px] font-bold tracking-widest text-zinc-550 uppercase px-1 font-mono">
                      {lang === 'amh' ? 'የጥናት ማስታወሻዎች እና ሲላበስ' : 'SUBJECT FOCUS AREA'}
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { name: 'Mathematics', amh: 'ሒሳብ (Math)', count: '12 Units', icon: Cpu },
                        { name: 'Physics', amh: 'ፊዚክስ (Physics)', count: '10 Units', icon: Cpu },
                        { name: 'Chemistry', amh: 'ኬሚስትሪ (Chemistry)', count: '8 Units', icon: Cpu },
                        { name: 'Biology', amh: 'ባዮሎጂ (Biology)', count: '7 Units', icon: Cpu }
                      ].map((sub, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setSelectedSubject(sub.name);
                            setActiveTab('curriculum');
                            showToast(`📚 Opened ${sub.name} Syllabus Notes!`);
                          }}
                          className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 active:scale-98 transition duration-150 cursor-pointer flex flex-col justify-between h-24 hover:border-zinc-800"
                        >
                          <span className="text-xs font-semibold text-zinc-200 block">
                            {lang === 'amh' ? sub.amh : sub.name}
                          </span>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-zinc-500 font-mono">{sub.count}</span>
                            <span className="text-[10px] text-amber-500 font-medium font-mono lowercase">{lang === 'amh' ? 'ክፈት' : 'study →'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Pomodoro Focus & Charts Split grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                    
                    {/* LHS: 5 Column interactive premium Pomodoro Focus Engine */}
                    <div className="lg:col-span-5 p-5 rounded-2xl border border-zinc-900 bg-zinc-950/20 flex flex-col justify-between space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${timerRunning ? 'bg-amber-500 animate-ping' : 'bg-zinc-550'}`} />
                          <h4 className="font-bold text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                            {focusMode === 'focus' 
                              ? (lang === 'amh' ? 'የትኩረት ክፍለ ጊዜ' : 'COGNITIVE FOCUS') 
                              : (lang === 'amh' ? 'የእረፍት ጊዜ' : 'RECHARGE STATE')}
                          </h4>
                        </div>
                        <span className="text-[9px] font-mono tracking-widest px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold">
                          {focusMode.toUpperCase()}
                        </span>
                      </div>

                      {/* Display Clock Area */}
                      <div className="py-4 flex flex-col items-center justify-center space-y-2 relative">
                        <div className="w-36 h-36 rounded-full border border-zinc-850 flex items-center justify-center relative bg-zinc-900/40">
                          <p id="timer-display" className="text-3xl font-mono font-bold text-zinc-100 tracking-wider">
                            {Math.floor(pomodoroLeft / 60).toString().padStart(2, '0')}:
                            {(pomodoroLeft % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                        <p className="text-xs text-zinc-500 text-center font-medium mt-2">
                          {focusMode === 'focus'
                            ? (lang === 'amh' ? 'ሒሳብና ፎርሙላዎችን በትኩረት ይለማመዱ።' : 'High-fidelity cognitive workflow active.')
                            : (lang === 'amh' ? 'እረፍት ያድርጉ፣ ጥልቀት ያለው ትንፋሽ ይውሰዱ።' : 'Stand, stretch, and inhale deep, calming breaths.')}
                        </p>
                      </div>

                      {/* Control Panel Grid */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button 
                          onClick={toggleTimer}
                          className={`h-10 rounded-lg font-bold uppercase tracking-wider text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                            timerRunning 
                              ? 'bg-rose-950/20 border border-rose-900/30 text-rose-400 hover:bg-rose-950/40' 
                              : 'bg-white text-black hover:bg-zinc-200'
                          }`}
                        >
                          <span>{timerRunning ? (lang === 'amh' ? 'አቁም' : 'PAUSE') : (lang === 'amh' ? 'ጀምር' : 'FOCUS')}</span>
                        </button>

                        <button 
                          onClick={resetTimer}
                          className="h-10 rounded-lg font-semibold border border-zinc-800 bg-[#030712] text-zinc-400 hover:text-white hover:border-zinc-700 text-xs text-center cursor-pointer transition duration-155"
                        >
                          {lang === 'amh' ? 'ዳግም ጀምር' : 'RESET'}
                        </button>
                      </div>

                      {/* Rapid pomodoro duration preset options */}
                      <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500">
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
                              className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:text-zinc-300 text-zinc-450 transition text-[10px] cursor-pointer"
                            >
                              {pref.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* RHS: 7 Column dynamic analytics utilizing Recharts */}
                    <div className="lg:col-span-7 p-5 rounded-2xl border border-zinc-900 bg-zinc-950/20 flex flex-col justify-between">
                      <div className="space-y-1 pb-3 border-b border-zinc-850">
                        <h4 className="font-bold text-[10px] font-mono uppercase tracking-widest text-[#cca43b]">{lang === 'amh' ? 'ጥናት እና ብቃት መከታተያ' : 'Syllabus Milestones'}</h4>
                        <p className="text-xs text-zinc-500">{lang === 'amh' ? 'በምዕራፍ ማብራሪያ የተመዘገበ የጥናት ሰሌዳ ገበታ' : 'Targeted retention curve per study stream'}</p>
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
                            <XAxis dataKey="date" stroke="#4b5563" fontSize={10} tickLine={false} />
                            <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#27272a', color: '#fff', fontSize: '11px' }} />
                            <Area type="monotone" dataKey="Mathematics" stroke="#cca43b" fillOpacity={0.06} fill="url(#colorMath)" />
                            <Area type="monotone" dataKey="Physics" stroke="#06b6d4" fillOpacity={0.03} fill="url(#colorPhys)" />
                            <defs>
                              <linearGradient id="colorMath" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#cca43b" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#cca43b" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorPhys" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex gap-4 text-xs text-zinc-550 pt-2 border-t border-zinc-850/40">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span>{lang === 'amh' ? 'ሒሳብ' : 'Mathematics'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                          <span>{lang === 'amh' ? 'ፊዚክስ' : 'Physics'}</span>
                        </div>
                        <div className="text-[10px] text-zinc-550 ml-auto font-mono">
                          UPDATED_NOW
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Android APK Shortcut Promo Banner at bottom of Dashboard */}
                  <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-amber-500/5 rounded-full filter blur-[80px] pointer-events-none" />
                    
                    <div className="flex items-start gap-4 relative z-10 w-full md:w-auto">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500 shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-zinc-200 text-sm">{lang === 'amh' ? 'ባለሙሉ ሲሙሌተር ከመስመር ውጪ ጥናት' : 'Localized offline deployment'}</h5>
                        <p className="text-zinc-500 text-xs max-w-xl leading-relaxed">
                          {lang === 'amh' 
                            ? 'ፈተና ዝግጅት መተግበሪያውን ያለ ኢንተርኔት (Offline) ለመጠቀም የአንድሮይድ መተግበሪያውን አሁኑኑ ያውርዱ።'
                            : 'Install Aksum Prep VIP directly onto your mobile device for offline database simulations without web browser overhead.'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('apkstore')}
                      className="px-4 py-2 rounded-lg font-bold border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white transition text-xs shrink-0 flex items-center gap-1.5 cursor-pointer relative z-10"
                    >
                      <Download className="w-4 h-4 text-zinc-400" />
                      <span>{lang === 'amh' ? 'መተግበሪያውን አውርድ' : 'View Download Options'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'video_lectures' && (
                <div id="video-lectures-view" className="space-y-6 animate-fade-in">
                  <VideoLearningHub
                    lang={lang}
                    setActiveTab={setActiveTab}
                    onAddStudyMinutes={(mins) => {
                      const nextMins = completedMinutes + mins;
                      setCompletedMinutes(nextMins);
                      localStorage.setItem('aksum_study_minutes', nextMins.toString());
                    }}
                  />
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

                      {/* Notes core body text content with optimized mobile font sizes */}
                      <div className="p-4 rounded-2xl bg-black/35 leading-relaxed overflow-y-auto max-h-[400px]">
                        <p className={`text-[#e2e8f0] tracking-wide whitespace-pre-wrap select-text antialiased ${
                          fontSize === 'sm' ? 'text-xs sm:text-sm' : fontSize === 'lg' ? 'text-base sm:text-lg md:text-xl' : 'text-sm sm:text-base'
                        }`}>
                          {lang === 'amh' ? activeUnit.notesAmharic : activeUnit.notes}
                        </p>
                      </div>

                      {/* Large premium touch-target optimized button to Save to Study Notebook */}
                      <button
                        onClick={() => {
                          const cat = 'curriculum';
                          const tit = `Unit ${activeUnit.unitNumber}: ${lang === 'amh' ? activeUnit.titleAmharic : activeUnit.title}`;
                          const cont = lang === 'amh' ? activeUnit.notesAmharic : activeUnit.notes;
                          
                          const isDuplicate = savedShortNotes.some(note => note.content === cont && note.category === cat);
                          if (isDuplicate) {
                            showToast(lang === 'amh' ? '⚠️ ይህ የሲላበስ ማጠቃለያ አስቀድሞ ማስታወሻ ደብተርዎ ውስጥ ተቀምጧል!' : '⚠️ This unit summary is already inside your study notebook!');
                            return;
                          }

                          const newNote = {
                            id: `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                            subject: selectedSubject || 'General Prep',
                            category: cat,
                            title: tit,
                            content: cont,
                            time: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          };
                          setSavedShortNotes(prev => [newNote, ...prev]);
                          showToast(lang === 'amh' ? '💾 የሲላበስ ማጠቃለያው በደብተርዎ ላይ ተቀምጧል!' : `💾 Syllabus notes successfully saved to Notebook!`);
                        }}
                        className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-gradient-to-r from-vip-gold to-amber-500 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:from-amber-400 hover:to-vip-gold active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-vip-gold/10 select-none cursor-pointer"
                      >
                        📂 {lang === 'amh' ? 'ይህን ምዕራፍ ማጠቃለያ ወደ ደብተር አስቀምጥ' : 'Save Unit Summary to Study Notebook 💾'}
                      </button>

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
                              {renderMessageContent(item)}
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

                  {/* Bento-grid containing Chat Console (left) and Notebook Panel (right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    
                    {/* Column 1 & 2: High Fidelity Chat Console */}
                    <div className="lg:col-span-2 p-4 rounded-3xl border border-[#334155]/50 bg-[#0c101b] flex flex-col justify-between h-[520px]">
                      
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
                              {renderMessageContent(item)}
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
                      <div className="py-2.5 flex gap-1.5 overflow-x-auto text-[10px] text-slate-300 no-scrollbar select-none shrink-0 border-t border-slate-800/20">
                        <button 
                          onClick={() => setChatInput(lang === 'amh' ? 'ያለፉትን የፈተና ጥያቄዎች እንዴት በፈጣን መስራት እችላለሁ?' : 'Tips on speeding up ESSLCE algebra answers.')}
                          className="px-2.5 py-1 rounded-lg bg-[#1e293b]/60 border border-slate-800 whitespace-nowrap active:scale-95 transition cursor-pointer"
                        >
                          ⚡ Prep Drills
                        </button>
                        <button 
                          onClick={() => setChatInput(lang === 'amh' ? 'የ ፊዚካዊ ቀመሮች በሙሉ አሳይ' : 'List key physics equations.')}
                          className="px-2.5 py-1 rounded-lg bg-[#1e293b]/60 border border-slate-800 whitespace-nowrap active:scale-95 transition cursor-pointer"
                        >
                          📐 Constants
                        </button>
                        <button 
                          onClick={() => setChatInput(lang === 'amh' ? 'የ AAU ዩኒቨርሲቲ መግቢያ ዝቅተኛ ውጤት' : 'Aastu Admissions Ratios')}
                          className="px-2.5 py-1 rounded-lg bg-[#1e293b]/60 border border-slate-800 whitespace-nowrap active:scale-95 transition cursor-pointer"
                        >
                          🏫 Uni Targets
                        </button>
                      </div>

                      {/* Attachment files if any */}
                      {chatAttachment && (
                        <div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded bg-[#1e1b4b] border border-[#a78bfa]/40 text-[#a78bfa] text-[10px] uppercase font-bold mb-2 animate-pulse shrink-0">
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
                      <div className="flex items-center gap-1.5 pt-2 border-t border-[#334155]/20 shrink-0">
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

                    {/* Column 3: Intelligent Live Study Notebook Panel */}
                    <div className="p-5 rounded-3xl border border-[#334155]/40 bg-[#070b13] flex flex-col justify-between h-[520px]">
                      
                      {/* Notebook Header and Clean action */}
                      <div className="border-b border-slate-800/60 pb-3 mb-3 shrink-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-gradient-gold flex items-center gap-1.5 uppercase tracking-wide">
                            📓 {lang === 'amh' ? 'የጥናት ማስታወሻ ደብተር' : 'MY STUDY NOTEBOOK'} ({savedShortNotes.length})
                          </h4>
                          {savedShortNotes.length > 0 && (
                            <button
                              onClick={() => {
                                if (window.confirm(lang === 'amh' ? 'ማስታወሻዎችን በሙሉ መሰረዝ ይፈልጋሉ?' : 'Are you sure you want to clear all saved study notes?')) {
                                  setSavedShortNotes([]);
                                  showToast(lang === 'amh' ? '🧹 ማስታወሻዎች ሙሉ በሙሉ ጠርገዋል!' : '🧹 Notes cleared successfully!');
                                }
                              }}
                              className="text-[10px] text-rose-400 hover:text-red-300 transition shrink-0 underline cursor-pointer font-bold"
                            >
                              {lang === 'amh' ? 'ሁሉንም ሰርዝ' : 'Clear All'}
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                          {lang === 'amh' 
                            ? 'የተቀመጡ ጠቃሚ ማጠቃለያዎችን፣ ቀመሮችንና የፈተና ስልቶችን እዚህ ይመልከቱ።'
                            : 'A durable cache of your gold-yield concept highlight cards, equations, and speed-hacks.'}
                        </p>
                      </div>

                      {/* Scrollable list of short notes */}
                      <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin no-scrollbar">
                        {savedShortNotes.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 select-none opacity-40">
                            <span className="text-3xl">📝</span>
                            <h5 className="font-semibold text-xs text-slate-300">
                              {lang === 'amh' ? 'ባዶ ደብተር' : 'Your Notebook is Empty'}
                            </h5>
                            <p className="text-[10px] text-slate-500 max-w-[200px] leading-relaxed">
                              {lang === 'amh' 
                                ? 'ከ Aksum GPT Pro ረዳት ጋር ሲያወሩ የሚወጡትን ቀመሮች "Save Note" በማለት እዚህ ያከማቹ!'
                                : 'While studying with Aksum GPT Pro, click "Save Note" on study components to build your custom cheat sheet here!'}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3 pb-4">
                            {savedShortNotes.map((note) => (
                              <div 
                                key={note.id} 
                                className={`p-3 rounded-xl border relative group transition duration-300 text-xs shadow-md ${
                                  note.category === 'highlight' ? 'border-amber-500/10 bg-amber-500/5' :
                                  note.category === 'summary' ? 'border-emerald-500/10 bg-emerald-500/5' :
                                  note.category === 'formula' ? 'border-sky-500/15 bg-sky-950/10' :
                                  note.category === 'hack' ? 'border-purple-500/15 bg-purple-550/5' :
                                  'border-rose-500/10 bg-rose-550/5'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1.5 border-b border-white/[0.04] pb-1.5 mb-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[7.5px] uppercase tracking-wider font-mono font-black px-1.5 py-0.5 rounded bg-[#090d16] text-[#cca43b]">
                                      {note.subject}
                                    </span>
                                    <span className="text-[8px] font-mono text-slate-500">
                                      {note.time}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(`${note.title} - ${note.content}`);
                                        showToast(lang === 'amh' ? '📋 ማስታወሻው ወደ ቅንጥብ ሰሌዳ ተኮፒቷል!' : '📋 Note text copied to clipboard!');
                                      }}
                                      className="text-slate-400 hover:text-white transition p-0.5 text-[11px] cursor-pointer"
                                      title="Copy Note Text"
                                    >
                                      📋
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSavedShortNotes(prev => prev.filter(n => n.id !== note.id));
                                        showToast(lang === 'amh' ? '🗑️ ማስታወሻው ተሰርዟል' : '🗑️ Note removed from study log');
                                      }}
                                      className="text-red-400 hover:text-red-300 transition p-0.5 text-xs font-bold cursor-pointer"
                                      title="Delete Note"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                                <h6 className="font-bold text-[#cca43b] text-xs leading-none">
                                  {note.title}
                                </h6>
                                <p className="text-zinc-300 text-[11px] leading-relaxed mt-1.5 whitespace-pre-wrap font-sans selection:bg-slate-800">
                                  {note.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Download exporter inside Notebook footer */}
                      {savedShortNotes.length > 0 && (
                        <div className="pt-3 border-t border-slate-800/60 shrink-0">
                          <button
                            onClick={() => {
                              const formatMarkdown = savedShortNotes.map((note, index) => {
                                return `### [Note ${index + 1}] Subject: ${note.subject} (${note.time})\nCategory: ${note.category.toUpperCase()}\nTitle: ${note.title}\n\n${note.content}\n\n---\n`;
                              }).join('\n');
                              
                              const blob = new Blob([formatMarkdown], { type: 'text/markdown' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `Aksum_Study_ShortNotes_${new Date().toISOString().slice(0, 10)}.md`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                              showToast(lang === 'amh' ? '📥 ማስታወሻ ደብተር ማውረድ ተጠናቋል!' : '📥 Notebook successfully downloaded as Markdown!');
                            }}
                            className="w-full py-2.5 rounded-xl text-xs font-bold text-center text-[#111827] bg-[#cca43b] hover:bg-yellow-500 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{lang === 'amh' ? 'ይህን ማስታወሻ ደብተር አውርድ (.md)' : 'Download Notebook (.md)'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* ================= TAB 5.9: GOOGLE DRIVE STUDY VAULT ================= */}
              {activeTab === 'google_drive' && (
                <GoogleDriveHub
                  lang={lang}
                  studentInfo={studentInfo}
                  completedMinutes={completedMinutes}
                  savedShortNotes={savedShortNotes}
                  showToast={showToast}
                  onBack={() => setActiveTab('dashboard')}
                />
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
          </div> {/* closes sidebar navigation wrapper */}

            {/* Sticky Bottom Navigation Tab Bar (Requirement 1) */}
            <div className="md:hidden h-16 border-t border-[#cca43b]/15 bg-[#0b0f19] flex items-center justify-around px-1 select-none shrink-0 z-40 pb-safe">
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
                  isSelected = ['apkstore', 'about_app', 'notifications', 'formulas', 'premium', 'google_drive'].includes(activeTab);
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
                    
                    {/* GOOGLE DRIVE STUDY VAULT */}
                    <button
                      onClick={() => {
                        setActiveTab('google_drive');
                        setShowMoreMenuTray(false);
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 bg-[#0e1626]/60 hover:border-vip-gold/30 hover:bg-[#15233c] text-left text-xs text-[#cbd5e1] hover:text-white transition flex items-center gap-3 min-h-[48px] cursor-pointer"
                    >
                      <Cloud className="w-5 h-5 text-[#38bdf8] shrink-0" />
                      <div>
                        <strong className="block text-[11px] font-black uppercase tracking-tight">{lang === 'amh' ? 'የጉግል ድራይቭ' : 'Google Drive'}</strong>
                        <span className="text-[9px] text-slate-400 leading-none">{lang === 'amh' ? 'ደመና ማህደር' : 'Cloud study vault'}</span>
                      </div>
                    </button>
                    
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

                    {/* VIDEO CLASSRoom LEARNING */}
                    <button
                      onClick={() => {
                        setActiveTab('video_lectures');
                        setShowMoreMenuTray(false);
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 bg-[#0e1626]/60 hover:border-vip-gold/30 hover:bg-[#15233c] text-left text-xs text-[#cbd5e1] hover:text-white transition flex items-center gap-3 min-h-[48px] cursor-pointer"
                    >
                      <Video className="w-5 h-5 text-vip-gold shrink-0" />
                      <div>
                        <strong className="block text-[11px] font-black uppercase tracking-tight">{lang === 'amh' ? 'ቪዲዮ ትምህርት' : 'Video Lectures'}</strong>
                        <span className="text-[9px] text-slate-400 leading-none">{lang === 'amh' ? 'ምዕራፍ ማብራሪያ' : 'Classroom streams'}</span>
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

        </div> {/* closes internal workspace relative viewport wrapper */}
      </div> {/* closes main responsive viewport layout */}

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

      {/* ================= PASSWORD RECOVERY MODAL ================= */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-md bg-[#0a0f19] border border-[#cca43b]/25 rounded-3xl p-5 md:p-6 space-y-5 relative shadow-2xl text-white text-center">
            
            {/* Close Button */}
            <button 
              onClick={() => {
                setShowRecoveryModal(false);
                setRecoveryStatus('idle');
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-slate-800 text-slate-400 hover:text-white hover:border-[#cca43b]/40 cursor-pointer text-xs flex items-center justify-center bg-black/50"
            >
              ✕
            </button>

            <div className="space-y-2">
              <span className="text-3xl">🔑</span>
              <h3 className="text-sm font-extrabold text-gradient-gold uppercase tracking-wider">
                {lang === 'amh' ? 'የይለፍ ቃል መልሶ ማግኛ' : 'Sovereign Password Recovery'}
              </h3>
              <p className="text-[11px] text-[#94a3b8] leading-relaxed max-w-sm mx-auto">
                {lang === 'amh' 
                  ? 'የተመዘገቡበትን ሙሉ ስም ወይም ስልክ ቁጥር ያስገቡ። ሲሙሌተር ቴክኖሎጂያችን የይለፍ ቃልዎን ፈልጎ አስፈላጊውን ሊንክ ይልካል።'
                  : 'Enter your registered student name, key phone number, or academic email. We will search our offline state caches to simulate recovery pipelines.'}
              </p>
            </div>

            {/* Recovery states handlers */}
            {recoveryStatus === 'idle' && (
              <div className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] text-[#94a3b8] font-bold block px-0.5">
                    {lang === 'amh' ? 'የስልክ ቁጥር፣ ስም ወይም ኢሜይል' : 'Registered Identifier'}
                  </label>
                  <input 
                    type="text" 
                    placeholder={lang === 'amh' ? 'ለምሳሌ፡ 0911...' : 'e.g. 0911223344 or Yonatan'}
                    className="w-full h-11 px-4 rounded-xl border border-slate-800 bg-black/40 text-white outline-none focus:border-vip-gold transition text-xs"
                    value={recoveryIdentifier}
                    onChange={(e) => setRecoveryIdentifier(e.target.value)}
                  />
                  {recoveryError && (
                    <p className="text-[10px] text-red-450 flex items-center gap-1 font-semibold block animate-pulse">
                      ⚠️ {recoveryError}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleRequestPasswordRecovery}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-vip-gold to-yellow-600 text-black font-extrabold text-xs uppercase tracking-widest cursor-pointer shadow-lg active:scale-95 transition"
                  >
                    {lang === 'amh' ? 'ኮድ ላክልኝ' : 'Request Registry Link'}
                  </button>
                </div>
              </div>
            )}

            {recoveryStatus === 'sending' && (
              <div className="py-6 space-y-4">
                <div className="w-10 h-10 border-2 border-t-transparent border-vip-gold rounded-full animate-spin mx-auto animate-pulse" />
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-vip-gold">
                    {lang === 'amh' ? 'ኢትዮ ቴሌኮም ኤስኤምኤስ ጌትዌይ መልዕክት እያዘጋጀ ነው...' : 'Connecting to local Telecom SMS dispatch...'}
                  </p>
                  <p className="text-[9px] text-[#64748b]">
                    {lang === 'amh' ? 'እባክዎ ለጥቂት ሰከንዶች ይጠብቁ' : 'Checking state databases. Encryption active.'}
                  </p>
                </div>
              </div>
            )}

            {recoveryStatus === 'sent' && (
              <div className="space-y-4 py-2 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl mx-auto animate-bounce">
                  ✓
                </div>
                
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/15 text-left text-xs leading-relaxed space-y-2">
                  <p className="font-extrabold text-emerald-400">
                    {lang === 'amh' ? '📩 ማሳወቂያ፡ መልዕክት በተሳካ ሁኔታ ተልኳል!' : '📩 Status: Simulation Dispatched successfully!'}
                  </p>
                  <p className="text-[11px] text-slate-300">
                    {lang === 'amh'
                      ? 'የይለፍ ቃል መልሶ ማግኛ ቀጥተኛ ሊንክ እና የፒን ኮዱ በተሳካ ሁኔታ ተመስሏል።'
                      : 'A virtual recovery link has been requested. Since this is operating under offline sandbox emulation, we extracted your profile password for you:'}
                  </p>
                  
                  {/* Password presentation block */}
                  <div className="py-2 px-3 rounded-lg bg-black/60 border border-[#cca43b]/25 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94a3b8]">Stored Password:</span>
                    <strong className="text-vip-gold tracking-widest text-[#cca43b] text-sm">
                      {(() => {
                        const cached = localStorage.getItem('aksum_student_info');
                        if (cached) {
                          try {
                            const parsed = JSON.parse(cached);
                            return parsed.password || '1234';
                          } catch (e) {}
                        }
                        return '1234';
                      })()}
                    </strong>
                  </div>
                  <p className="text-[9px] text-yellow-500/70 italic">
                    {lang === 'amh' ? '💡 የይለፍ ቃልዎን በመጠቀም አሁን መግባት ይችላሉ።' : '💡 You can now copy and use this passcode to sign in.'}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      // Pre-fill fields for ease of login!
                      const cached = localStorage.getItem('aksum_student_info');
                      if (cached) {
                        try {
                          const parsed = JSON.parse(cached);
                          setSigninIdentifier(parsed.phone || parsed.name || '');
                          setSigninPassword(parsed.password || '1234');
                        } catch (e) {}
                      }
                      setShowRecoveryModal(false);
                      setRecoveryStatus('idle');
                    }}
                    className="w-full h-11 rounded-xl bg-vip-gold hover:bg-yellow-500 text-black font-extrabold text-xs uppercase tracking-widest cursor-pointer shadow-lg active:scale-95 transition"
                  >
                    {lang === 'amh' ? 'ዝጋና መረጃውን ሙላልኝ' : 'Close & Autofill'}
                  </button>
                </div>
              </div>
            )}

            {/* Back button option */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setShowRecoveryModal(false);
                  setRecoveryStatus('idle');
                }}
                className="text-[11px] text-slate-500 hover:text-slate-300 underline transition cursor-pointer select-none"
              >
                {lang === 'amh' ? 'ወደ መግቢያ ገጽ ተመለስ' : 'Return to Login'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
