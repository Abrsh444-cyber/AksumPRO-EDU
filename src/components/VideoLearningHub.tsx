import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Clock, 
  Heart, 
  CheckCircle, 
  ChevronRight, 
  Sparkles,
  Volume2,
  Maximize2,
  RotateCcw,
  BookMarked,
  Layers,
  GraduationCap
} from 'lucide-react';

interface Lecture {
  id: string;
  title: string;
  duration: string;
  summary: string;
  notes: string;
}

interface Course {
  id: string;
  title: string;
  subject: string;
  instructor: string;
  avatar: string;
  rating: number;
  grade: number;
  thumbnail: string;
  lectures: Lecture[];
}

interface VideoLearningHubProps {
  lang: 'amh' | 'eng';
  setActiveTab: (tab: string) => void;
  onAddStudyMinutes: (mins: number) => void;
}

const COURSES_DATA: Course[] = [
  {
    id: 'math-limits',
    title: 'Calculus Limits & Series Masterclass',
    subject: 'Mathematics',
    instructor: 'Dr. Abraham Bekele',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
    rating: 4.9,
    grade: 12,
    thumbnail: 'from-amber-600 via-yellow-700 to-amber-950',
    lectures: [
      {
        id: 'math-lim-1',
        title: 'Introduction to Infinite Sequences',
        duration: '16:45',
        summary: 'Understand the concept of convergence, upper bounds, and Cauchy limits for the ESSLCE national exam.',
        notes: '- A sequence converges to L if terms can be made arbitrarily close to L.\n- Convergent sequences are always bounded.\n- Check matching rational quotients by dividing higher-order variables in algebraic terms.'
      },
      {
        id: 'math-lim-2',
        title: 'Squeeze Theorem & Trigonometric Limits',
        duration: '22:10',
        summary: 'Deep-dive into Squeeze (Sandwich) theorem and proving that the limit of sin(x)/x is 1 as x approaches 0.',
        notes: '- Limit of sin(θ)/θ as θ → 0 is exactly 1.\n- Squeeze Theorem states if g(x) <= f(x) <= h(x) and their limits match, so does f(x).\n- Frequently appears in National College admission entrance tests.'
      },
      {
        id: 'math-lim-3',
        title: 'Evaluating Sums of Geometric Series',
        duration: '18:30',
        summary: 'How to calculate a/(1-r) under constraints and find interval of convergence.',
        notes: '- Infinite geometric series exists if and only if |r| < 1.\n- Interval of convergence holds absolute bounds.\n- Perfect tool for rapid test reviews.'
      }
    ]
  },
  {
    id: 'phys-vectors',
    title: 'Classical Kinematics & Ballistic Projectiles',
    subject: 'Physics',
    instructor: 'Instructor Elizabeth Tesfaye',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150',
    rating: 4.8,
    grade: 11,
    thumbnail: 'from-blue-600 via-indigo-700 to-vip-dark',
    lectures: [
      {
        id: 'phys-vec-1',
        title: 'Decomposing 2D Vectors',
        duration: '14:20',
        summary: 'Resolving velocity vectors into independent horizontal (cos θ) and vertical (sin θ) coordinates.',
        notes: '- Horizontal components undergo zero gravity resistance.\n- Vertical vectors accelerate downwards at constant -9.8 m/s².\n- Air friction is fully neglected in high school matrix standards.'
      },
      {
        id: 'phys-vec-2',
        title: 'Maximum Height & Horizontal Range Formula',
        duration: '25:15',
        summary: 'Deriving range = (u² * sin(2θ)) / g and understanding optimal launching angles.',
        notes: '- Range is maximum at exactly 45 degrees.\n- Complementary launching angles (e.g., 30 and 60 degrees) yield identical range levels.\n- Safe formulas are vital for physics paper scoring!'
      }
    ]
  },
  {
    id: 'chem-thermo',
    title: 'Advanced Thermodynamics & Reaction Entropy',
    subject: 'Chemistry',
    instructor: 'Dean Yared Negash',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150',
    rating: 4.9,
    grade: 12,
    thumbnail: 'from-emerald-600 via-teal-700 to-slate-900',
    lectures: [
      {
        id: 'chem-th-1',
        title: 'Enthalpy (ΔH) and Calorimeter Math',
        duration: '19:40',
        summary: 'Calculating enthalpy outputs using bond dissociation enthalpies and bomb calorimeter structures.',
        notes: '- Exothermic reactions release warmth (ΔH is negative).\n- Endothermic reactions hold positive values.\n- Hess Law states total enthalpy shift is path-independent.'
      },
      {
        id: 'chem-th-2',
        title: 'Spontaneity & Gibbs Free Energy Curve',
        duration: '21:05',
        summary: 'How ΔG = ΔH - TΔS controls reactions and equilibrium points.',
        notes: '- Spontaneous states run automatically on negative ΔG.\n- High temperatures maximize entropy coefficients.'
      }
    ]
  },
  {
    id: 'bio-genetics',
    title: 'Molecular Genetics & Mendelian Inheritance',
    subject: 'Biology',
    instructor: 'Dr. Elsabet Haile',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=150',
    rating: 4.7,
    grade: 12,
    thumbnail: 'from-purple-700 via-fuchsia-800 to-indigo-950',
    lectures: [
      {
        id: 'bio-gen-1',
        title: 'Mendel Laws of Segregation',
        duration: '15:10',
        summary: 'The basic genetic crossing grids, phenotypes, and genotypes ratios (3:1 and 9:3:3:1 patterns).',
        notes: '- Segregation dictates chromosomes part into self gametes.\n- Dominant attributes hide recessive allele variables.'
      }
    ]
  }
];

export default function VideoLearningHub({
  lang,
  setActiveTab,
  onAddStudyMinutes
}: VideoLearningHubProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLectureIndex, setActiveLectureIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [videoProgress, setVideoProgress] = useState<number>(12); // Simulated timeline starter percentage
  const [volume, setVolume] = useState<number>(80);
  const [activePlayerTab, setActivePlayerTab] = useState<'details' | 'notes' | 'chapters'>('details');

  // Bookmarking collection stored in local storage
  const [bookmarkedLectures, setBookmarkedLectures] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('aksum_bookmarked_lectures') || '[]');
  });

  // Tracking study minutes when video plays
  const studyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      studyTimerRef.current = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            onAddStudyMinutes(1);
            return 100;
          }
          return prev + 1;
        });
      }, 5000); // Progress increments
    } else {
      if (studyTimerRef.current) {
        clearInterval(studyTimerRef.current);
      }
    }
    return () => {
      if (studyTimerRef.current) clearInterval(studyTimerRef.current);
    };
  }, [isPlaying, onAddStudyMinutes]);

  const toggleLectureBookmark = (lectureId: string) => {
    let updated;
    if (bookmarkedLectures.includes(lectureId)) {
      updated = bookmarkedLectures.filter(id => id !== lectureId);
    } else {
      updated = [...bookmarkedLectures, lectureId];
    }
    setBookmarkedLectures(updated);
    localStorage.setItem('aksum_bookmarked_lectures', JSON.stringify(updated));
  };

  const currentLecture = useMemo(() => {
    if (!activeCourse) return null;
    return activeCourse.lectures[activeLectureIndex] || null;
  }, [activeCourse, activeLectureIndex]);

  const filteredCourses = useMemo(() => {
    if (selectedSubject === 'All') return COURSES_DATA;
    return COURSES_DATA.filter(c => c.subject === selectedSubject);
  }, [selectedSubject]);

  return (
    <div className="space-y-6">
      
      {/* Immersive SaaS Video Player Frame if a Class is Selected */}
      {activeCourse && currentLecture ? (
        <div className="space-y-6 animate-fade-in">
          
          {/* Breadcrumb Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => {
                setActiveCourse(null);
                setIsPlaying(false);
              }}
              className="h-10 px-4 rounded-xl bg-vip-slate/50 text-vip-gold hover:text-white text-xs font-bold flex items-center gap-1.5 border border-vip-gold/15 active:scale-95 transition cursor-pointer"
            >
              ← Back to Courses Catalog
            </button>
            
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="bg-vip-gold/10 text-vip-gold font-mono px-2 py-1 rounded">
                {activeCourse.subject}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-white truncate max-w-[200px]">{activeCourse.title}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LHS (2 Columns): Premium Custom Video Workspace */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Aspect Ratio Video Container Frame */}
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-[#cca43b]/20 group shadow-2xl">
                
                {/* Visual Video Content Simulator (High-quality background with pulse overlays) */}
                <div className={`absolute inset-0 bg-gradient-to-br ${activeCourse.thumbnail} flex flex-col justify-between p-6 transition-all duration-500`}>
                  {/* Subtle Grid overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Top floating badges */}
                  <div className="flex justify-between items-center relative z-10">
                    <span className="px-2.5 py-1 rounded bg-black/60 text-white text-[10px] font-mono tracking-wider">
                      🔴 PLAYING AT {playbackSpeed}X
                    </span>
                    <span className="p-1 px-2.5 rounded bg-vip-gold/25 text-vip-gold text-[10px] font-bold border border-vip-gold/30">
                      Grade {activeCourse.grade} Syllabus Focus
                    </span>
                  </div>

                  {/* Core display text */}
                  <div className="text-center space-y-3 px-8 my-auto relative z-10 select-none">
                    <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md border border-vip-gold/30 flex items-center justify-center mx-auto shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-vip-gold fill-vip-gold" />
                      ) : (
                        <Play className="w-6 h-6 text-vip-gold fill-vip-gold ml-1" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-vip-gold">Lecture {activeLectureIndex + 1}</span>
                      <h4 className="text-lg md:text-xl font-black font-display text-white mt-1 leading-snug">
                        {currentLecture.title}
                      </h4>
                      <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                        Presented by {activeCourse.instructor} • Addis Ababa
                      </p>
                    </div>
                  </div>

                  {/* Bottom Video HUD progress bar */}
                  <div className="w-full relative z-10 pt-2 border-t border-white/5 space-y-2">
                    <div className="relative h-1 w-full bg-white/20 rounded cursor-pointer" onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const percentage = Math.round((clickX / rect.width) * 100);
                      setVideoProgress(percentage);
                    }}>
                      <div 
                        className="absolute h-full left-0 top-0 bg-vip-gold rounded transition-all duration-300"
                        style={{ width: `${videoProgress}%` }}
                      />
                      <div 
                        className="absolute w-2.5 h-2.5 rounded-full bg-white border border-vip-gold -top-0.5 -mt-0.5 transition-all duration-300 shadow-md"
                        style={{ left: `calc(${videoProgress}% - 5px)` }}
                      />
                    </div>
                    
                    {/* Controls alignment */}
                    <div className="flex items-center justify-between text-white text-xs select-none">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-vip-gold transition cursor-pointer">
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setVideoProgress(0)} className="hover:text-vip-gold transition flex items-center gap-1 cursor-pointer">
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-mono font-medium text-slate-300">
                          {Math.round((videoProgress / 100) * 15)}:00 / {currentLecture.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
                          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={volume} 
                            onChange={(e) => setVolume(Number(e.target.value))} 
                            className="w-12 h-0.5 bg-white/30 rounded accent-vip-gold cursor-pointer"
                          />
                        </div>

                        {/* Speech speed increments */}
                        <button 
                          className="px-1.5 py-0.5 bg-black/40 text-[10px] font-mono border border-white/10 rounded-md hover:border-vip-gold transition hover:text-vip-gold cursor-pointer"
                          onClick={() => {
                            if (playbackSpeed === 1) setPlaybackSpeed(1.5);
                            else if (playbackSpeed === 1.5) setPlaybackSpeed(2);
                            else setPlaybackSpeed(1);
                          }}
                        >
                          {playbackSpeed}x
                        </button>
                        <button className="hover:text-vip-gold transition cursor-pointer">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Title and Actions panel underneath */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-[#0c101d] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">{currentLecture.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Lesson {activeLectureIndex + 1} of {activeCourse.lectures.length} • {activeCourse.instructor}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleLectureBookmark(currentLecture.id)}
                    className={`h-9 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                      bookmarkedLectures.includes(currentLecture.id)
                        ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-black/30'
                        : 'bg-black/35 text-slate-300 border-slate-800 hover:border-vip-gold/30'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${bookmarkedLectures.includes(currentLecture.id) ? 'fill-red-400' : ''}`} />
                    <span>{bookmarkedLectures.includes(currentLecture.id) ? 'Favorited' : 'Bookmark Lecture'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('gptpro')}
                    className="h-9 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-vip-gold/15 to-yellow-600/5 text-vip-gold border border-vip-gold/30 flex items-center gap-1.5 hover:from-vip-gold/25 transition cursor-pointer animate-pulse"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Tutor</span>
                  </button>
                </div>
              </div>

              {/* Tabbed interface under video player */}
              <div className="border-b border-slate-800 flex gap-2">
                {[
                  { id: 'details', label: 'Synopsis Details' },
                  { id: 'notes', label: 'Scholastic Notes' },
                  { id: 'chapters', label: 'Lecture Chapters' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActivePlayerTab(t.id as any)}
                    className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition relative cursor-pointer ${
                      activePlayerTab === t.id 
                        ? 'border-vip-gold text-vip-gold' 
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Panel Content Box */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-[#080d19]/60 min-h-[150px]">
                {activePlayerTab === 'details' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentLecture.summary}
                    </p>
                    <div className="flex gap-6 pt-2 text-[11px] text-[#cca43b] border-t border-slate-800/60 font-mono">
                      <span>👤 Expert Dean: {activeCourse.instructor}</span>
                      <span>💡 Level: Grade {activeCourse.grade} Matric Standard</span>
                    </div>
                  </div>
                )}

                {activePlayerTab === 'notes' && (
                  <div className="space-y-3 text-xs text-slate-300 font-sans leading-relaxed">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                      ✓ Active Revision Summary
                    </div>
                    <pre className="whitespace-pre-wrap font-sans font-medium text-slate-200">
                      {currentLecture.notes}
                    </pre>
                  </div>
                )}

                {activePlayerTab === 'chapters' && (
                  <div className="space-y-2">
                    {activeCourse.lectures.map((lec, idx) => (
                      <button
                        key={lec.id}
                        onClick={() => {
                          setActiveLectureIndex(idx);
                          setVideoProgress(idx * 8 + 5);
                          setIsPlaying(true);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs transition border cursor-pointer ${
                          idx === activeLectureIndex
                            ? 'bg-vip-gold/10 border-vip-gold/30 text-vip-gold'
                            : 'bg-black/20 border-slate-800 text-slate-300 hover:bg-black/40'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Play className={`w-3 h-3 ${idx === activeLectureIndex ? 'text-vip-gold fill-vip-gold' : 'text-slate-400'}`} />
                          <span className="font-semibold">{idx + 1}. {lec.title}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{lec.duration}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* RHS Sidebar (1 Column): Chapter Navigation & Playlists */}
            <div className="lg:col-span-1 space-y-4">
              
              <div className="p-4 rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0b101c] to-black space-y-4">
                <div className="PB-2 border-b border-slate-800">
                  <h4 className="text-xs font-black uppercase text-vip-gold tracking-wider flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Lec Core Chapters</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1">Select lessons sequentially in curriculum</p>
                </div>

                <div className="space-y-2 max-h-[350px] overflow-y-auto no-scrollbar">
                  {activeCourse.lectures.map((lec, idx) => {
                    const isSelected = idx === activeLectureIndex;
                    const isPassed = idx < activeLectureIndex;
                    return (
                      <div 
                        key={lec.id}
                        onClick={() => {
                          setActiveLectureIndex(idx);
                          setVideoProgress(idx * 7 + 10);
                          setIsPlaying(true);
                        }}
                        className={`p-3 rounded-2xl border transition duration-200 cursor-pointer text-left relative flex items-start gap-3 ${
                          isSelected 
                            ? 'bg-vip-gold/15 border-vip-gold/40 text-vip-gold' 
                            : 'bg-vip-slate/30 border-[#334155]/30 text-slate-350 hover:border-slate-700'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isPassed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                              isSelected ? 'bg-vip-gold text-black font-bold' : 'bg-black/50 text-[#64748b]'
                            }`}>
                              {idx + 1}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {lec.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {lec.duration}
                            </span>
                            {bookmarkedLectures.includes(lec.id) && (
                              <span className="text-red-400 font-bold">&#9829; Favorited</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Embedded AI Study Companion sandbox wrapper */}
              <div className="p-4 rounded-3xl border border-[#cca43b]/15 bg-gradient-to-br from-vip-slate/40 to-slate-950 space-y-3">
                <span className="text-[9px] bg-vip-gold/10 text-vip-gold font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">
                  ⚡ INTEGRATED AI ASSISTANT
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">
                  Confused with derivatives or stoichiometric coefficients? Prompt the Aksum AI Companion directly.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('gptpro');
                  }}
                  className="w-full h-8.5 text-xs font-bold rounded-xl bg-vip-gold text-black flex items-center justify-center gap-1.5 shadow-md hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>Launch AI Tutor Dialog</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      ) : (
        <div id="courses-catalog-view" className="space-y-6">
          
          {/* Catalog Heading */}
          <div className="bg-gradient-to-r from-[#0c111d] to-[#040710] p-6 rounded-3xl border border-vip-gold/15 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-vip-gold/5 rounded-full filter blur-[80px] pointer-events-none" />
            <div className="space-y-1.5 relative z-10">
              <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-white flex items-center gap-2">
                <GraduationCap className="text-vip-gold w-6 h-6 animate-pulse" />
                <span>{lang === 'amh' ? 'ቪዲዮ ትምህርቶች (Video Lectures)' : 'Elite Video Classrooms'}</span>
              </h2>
              <p className="text-xs text-slate-400 max-w-xl">
                {lang === 'amh' 
                  ? 'በከፍተኛ ዩኒቨርሲቲ መምህራን የተዘጋጁ የምዕራፍ ማብራሪያ ቪዲዮዎችን ይመልከቱ።' 
                  : 'Syllabus masterclasses, exam derivations, and dynamic interactive tutorials recorded by elite educators.'}
              </p>
            </div>

            {/* Quick Favorites Counters */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-slate-800 text-xs shrink-0 relative z-10 font-mono">
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <span className="text-slate-300">Favorited Lectures:</span>
              <strong className="text-white">{bookmarkedLectures.length}</strong>
            </div>
          </div>

          {/* Horizontal category filters */}
          <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-slate-800">
            {['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold select-none transition cursor-pointer ${
                  selectedSubject === sub 
                    ? 'bg-vip-gold text-black font-bold' 
                    : 'text-slate-400 hover:text-white bg-[#0e1321]/50 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Grid distribution of courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              // Calculate aggregate video minutes of the course package
              const totalMins = course.lectures.reduce((acc, l) => {
                const parts = l.duration.split(':');
                return acc + (Number(parts[0]) || 0);
              }, 0);

              return (
                <div 
                  key={course.id}
                  className="rounded-3xl border border-slate-800 bg-[#0a0e1a]/85 overflow-hidden flex flex-col justify-between group hover:border-[#cca43b]/20 hover:shadow-xl hover:shadow-vip-gold/5 transition duration-300"
                >
                  <div className={`p-4 bg-gradient-to-br ${course.thumbnail} aspect-video relative flex flex-col justify-between`}>
                    {/* Floating subject badge */}
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-black/60 backdrop-blur-md text-white font-mono font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {course.subject}
                      </span>
                      <span className="text-[10px] bg-vip-gold text-black px-2 py-0.5 rounded font-bold">
                        Grade {course.grade}
                      </span>
                    </div>

                    {/* Launch overlay on hover */}
                    <div 
                      onClick={() => {
                        setActiveCourse(course);
                        setActiveLectureIndex(0);
                        setVideoProgress(15);
                        setIsPlaying(true);
                      }}
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-vip-gold flex items-center justify-center shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                        <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                      </div>
                    </div>

                    {/* Meta stats overlay in bottom */}
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-1 text-[10px] bg-black/70 px-2 py-1 rounded text-white font-mono">
                        <Clock className="w-3.5 h-3.5 text-vip-gold" />
                        <span>{totalMins} mins total</span>
                      </div>
                      <span className="text-[10px] bg-slate-900/80 px-2 py-1 rounded text-[#ffd700] font-bold">
                        ★ {course.rating}
                      </span>
                    </div>
                  </div>

                  {/* Course Details Block */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-bold text-sm text-white group-hover:text-vip-gold transition">
                        {course.title}
                      </h3>
                      
                      {/* Teacher specs */}
                      <div className="flex items-center gap-2">
                        <img 
                          src={course.avatar} 
                          alt={course.instructor}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover border border-vip-gold/30"
                        />
                        <span className="text-[11px] text-slate-400 font-medium">
                          {course.instructor}
                        </span>
                      </div>
                    </div>

                    {/* Lower details button */}
                    <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold">{course.lectures.length} high-def lectures</span>
                      
                      <button
                        onClick={() => {
                          setActiveCourse(course);
                          setActiveLectureIndex(0);
                          setVideoProgress(15);
                          setIsPlaying(true);
                        }}
                        className="text-xs font-bold text-vip-gold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Start Learning</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Bookmarks Quick Sandbox Shelf */}
          {bookmarkedLectures.length > 0 && (
            <div className="p-5 rounded-3xl border border-slate-800 bg-[#070b13] space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <BookMarked className="w-4 h-4 text-[#cca43b]" />
                <h4 className="text-xs font-black uppercase text-white tracking-widest">Saved Classroom Video Lessons</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {COURSES_DATA.flatMap(c => c.lectures.map(l => ({ ...l, course: c })))
                  .filter(item => bookmarkedLectures.includes(item.id))
                  .map(item => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-800/80 bg-black/25 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <strong className="block text-white truncate text-[11px] font-bold">{item.title}</strong>
                        <span className="text-[10px] text-slate-500 font-semibold">{item.course.subject} • {item.duration}</span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveCourse(item.course);
                          const idx = item.course.lectures.findIndex(l => l.id === item.id);
                          setActiveLectureIndex(idx >= 0 ? idx : 0);
                          setIsPlaying(true);
                        }}
                        className="p-1 px-2.5 rounded bg-vip-gold/10 text-vip-gold text-[10px] hover:bg-vip-gold/20 font-bold border border-vip-gold/20 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Play className="w-2.5 h-2.5 fill-vip-gold text-vip-gold" />
                        <span>Watch</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
