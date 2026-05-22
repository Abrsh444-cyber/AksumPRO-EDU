import { motion } from 'motion/react';
import { StudentInfo } from '../types';
import { 
  GraduationCap, 
  BookOpen, 
  Cpu, 
  Download, 
  Calculator, 
  MapPin, 
  Languages, 
  LogOut,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import aksumLogo from '../assets/images/aksum_badge_logo_1779394617188.png';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  studentInfo: StudentInfo;
  onLogout: () => void;
  lang: 'amh' | 'eng';
  setLang: (lang: 'amh' | 'eng') => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  studentInfo, 
  onLogout, 
  lang, 
  setLang,
  theme,
  toggleTheme
}: NavbarProps) {
  
  const navItems = [
    { id: 'dashboard', label: lang === 'amh' ? '🏠 ቪአይፒ መነሻ' : '🏠 Dashboard', icon: BookOpen },
    { id: 'quiz', label: lang === 'amh' ? '⚡ ብሔራዊ ፈተና' : '⚡ Exam Prep', icon: GraduationCap },
    { id: 'universities', label: lang === 'amh' ? '🏛️ ዩኒቨርሲቲዎች' : '🏛️ Universities', icon: MapPin },
    { id: 'aitutor', label: lang === 'amh' ? '🤖 ናኦል AI' : '🤖 AI VIP Tutor', icon: Cpu },
    { id: 'formulas', label: lang === 'amh' ? '📐 ፎርሙላዎች' : '📐 Toolkit', icon: Calculator },
    { id: 'download', label: lang === 'amh' ? '💾 አውርድ / Share' : '💾 Save App', icon: Download },
  ];

  return (
    <nav id="app-main-navbar" className={`sticky top-0 z-50 w-full backdrop-blur-xl transition-all duration-300 ${
      theme === 'light' 
        ? 'bg-amber-50/90 border-b border-amber-900/20 shadow-sm' 
        : 'bg-slate-950/90 border-b border-vip-gold/15'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* VIP Premium Logo Brand */}
          <div className="flex items-center gap-3">
            <div className={`relative p-1 rounded-xl flex items-center justify-center transition-all ${
              theme === 'light' 
                ? 'bg-amber-100 border border-amber-500/30' 
                : 'bg-slate-900 border border-vip-gold/35 shadow-md shadow-vip-gold/10'
            }`}>
              <img 
                src={aksumLogo} 
                alt="Aksum VIP logo" 
                className="w-10 h-10 object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className={`text-lg font-display font-extrabold tracking-tight flex items-center gap-1.5 transition-colors ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                AKSUM <span className="text-vip-gold tracking-wide font-black">VIP</span>
              </span>
              <p className="text-[10px] text-vip-gold font-semibold tracking-widest uppercase">
                {lang === 'amh' ? 'የጥናት ማዕከል' : 'Academic Hub'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  id={`nav-tab-${item.id}`}
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-305 cursor-pointer flex items-center gap-2 ${
                    isActive 
                      ? 'text-vip-gold' 
                      : theme === 'light'
                        ? 'text-slate-700 hover:text-amber-950 hover:bg-amber-950/5'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-vip-gold' : theme === 'light' ? 'text-slate-600' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-vip-gold to-amber-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* User Profile Summary + Global Controls */}
          <div className="flex items-center gap-4">
            
            {/* Student micro-badge */}
            <div className={`hidden sm:flex flex-col items-end text-right border-r pr-4 ${
              theme === 'light' ? 'border-amber-900/15' : 'border-vip-charcoal/40'
            }`}>
              <span className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                <Sparkles className="w-3 h-3 text-vip-gold animate-bounce" />
                {studentInfo.name.split(' ')[0]}
              </span>
              <span className={`text-[10px] font-mono tracking-tighter/5 select-none px-1.5 py-0.5 rounded border transition-colors ${
                theme === 'light'
                  ? 'bg-amber-100/40 border-amber-900/10 text-slate-700'
                  : 'bg-vip-slate border-vip-charcoal/30 text-gray-400 mt-0.5'
              }`}>
                {studentInfo.fieldStream} • {studentInfo.gradeLevel}
              </span>
            </div>

            {/* Dark/Light Theme Quick Switcher */}
            <button
              id="nav-theme-toggle"
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                theme === 'light'
                  ? 'bg-amber-100/50 border-amber-900/15 text-amber-900 hover:bg-amber-100/80'
                  : 'bg-slate-900 border-vip-charcoal/60 text-vip-gold hover:text-white'
              }`}
              title={theme === 'light' ? 'Switch to Dark Theme' : 'ወደ ብሩህ ገጽታ ቀይር (Switch to Light)'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-amber-800" /> : <Sun className="w-4 h-4 text-vip-gold" />}
            </button>

            {/* Language Quick-Toggle helper */}
            <button
              id="nav-lang-toggle"
              onClick={() => setLang(lang === 'amh' ? 'eng' : 'amh')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                theme === 'light'
                  ? 'bg-amber-100/50 border-amber-900/15 text-slate-700 hover:bg-amber-100/85'
                  : 'bg-slate-900 border-vip-charcoal/60 text-gray-300 hover:text-vip-gold'
              }`}
              title={lang === 'amh' ? 'Change to English' : 'ወደ አማርኛ ቀይር'}
            >
              <Languages className={`w-4 h-4 ${theme === 'light' ? 'text-amber-800' : 'text-vip-gold'}`} />
            </button>

            {/* Logout/Reset Onboarding */}
            <button
              id="nav-logout-btn"
              onClick={onLogout}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                theme === 'light'
                  ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100/50'
                  : 'bg-slate-900/50 border-transparent hover:border-red-900/40 text-gray-400 hover:text-red-400'
              }`}
              title={lang === 'amh' ? 'ውጣ / መረጃ ቀይር' : 'Reset Profile / Change Credentials'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 📱 Native Mobile Bottom Navigation Dock (Ergonomic App-Store Interface layout) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-vip-gold/15 backdrop-blur-xl py-2 px-3 flex items-center justify-between shadow-2xl gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            // Dynamic circle aesthetics based on active subject/tab matching phone screen palette
            const activeCircleStyle = 
              item.id === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/35' :
              item.id === 'quiz' ? 'bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/35' :
              item.id === 'aitutor' ? 'bg-amber-500/15 text-vip-gold ring-1 ring-vip-gold/35 animate-glow-subtle' :
              'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/35';

            return (
              <button
                id={`mobile-nav-tab-${item.id}`}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1.5 py-1 px-1.5 rounded-2xl transition-all cursor-pointer select-none shrink-0 flex-1 ${
                  isActive 
                    ? 'scale-105 active:scale-95 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {/* Micro circle highlight container */}
                <div className={`p-2.5 rounded-full transition-all duration-300 ${
                  isActive ? activeCircleStyle : 'text-gray-400 bg-transparent'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Optimized bottom app tab labels with mini-PRO badge for StudyGPT */}
                <div className="flex items-center gap-0.5 justify-center">
                  <span className={`text-[9px] font-black uppercase tracking-tight ${isActive ? 'text-white font-black' : 'text-gray-400'}`}>
                    {item.id === 'dashboard' ? (lang === 'amh' ? 'መነሻ' : 'Home') :
                     item.id === 'quiz' ? (lang === 'amh' ? 'ማትሪክ' : 'Courses') :
                     item.id === 'universities' ? (lang === 'amh' ? 'ዩኒቨርስ' : 'Varsity') :
                     item.id === 'aitutor' ? (lang === 'amh' ? 'StudyGPT' : 'StudyGPT') :
                     item.id === 'formulas' ? (lang === 'amh' ? 'ፎርሙላ' : 'Toolkit') :
                     (lang === 'amh' ? 'ማውረጃ' : 'Export')}
                  </span>
                  
                  {item.id === 'aitutor' && (
                    <span className="bg-vip-gold text-slate-950 px-1 py-0.2 rounded font-black text-[7px] tracking-tighter">
                      PRO
                    </span>
                  )}
                </div>

                {isActive && (
                  <motion.div
                    layoutId="mobileNavDot"
                    className={`w-1 h-1 rounded-full ${
                      item.id === 'dashboard' ? 'bg-emerald-400' :
                      item.id === 'aitutor' ? 'bg-vip-gold' : 'bg-purple-400'
                    }`}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </nav>
  );
}
