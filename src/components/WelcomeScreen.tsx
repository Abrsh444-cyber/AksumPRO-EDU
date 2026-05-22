import React, { useState } from 'react';
import { motion } from 'motion/react';
import { StudentInfo } from '../types';
import { Sparkles, BookOpen, GraduationCap, Phone, School, User, Calendar, Languages } from 'lucide-react';
import aksumLogo from '../assets/images/aksum_badge_logo_1779394617188.png';

interface WelcomeScreenProps {
  onComplete: (info: StudentInfo) => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [lang, setLang] = useState<'amh' | 'eng'>('amh');
  const [formData, setFormData] = useState({
    name: '',
    age: '' as number | '',
    phone: '',
    email: '',
    school: '',
    gradeLevel: 'Grade 12' as StudentInfo['gradeLevel'],
    fieldStream: 'Natural Science' as StudentInfo['fieldStream'],
    targetUniversity: 'Addis Ababa University',
    primaryGoal: 'Scoring 500+ in national ESSLCE Matric Exam',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = lang === 'amh' ? 'እባክዎን ስምዎን ያስገቡ' : 'Please enter your full name';
    }
    if (!formData.age || Number(formData.age) < 13 || Number(formData.age) > 99) {
      newErrors.age = lang === 'amh' ? 'ትክክለኛ ዕድሜ ያስገቡ (13+)' : 'Please enter a valid age (13+)';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = lang === 'amh' ? 'እባክዎን ስልክ ቁጥር ያስገቡ' : 'Please enter your phone number';
    } else if (!/^(?:\+251|0)[97]\d{8}$/.test(formData.phone.trim())) {
      newErrors.phone = lang === 'amh' ? 'ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ (ለምሳሌ 0912345678)' : 'Enter a valid Ethiopian phone number (e.g. 0912345678)';
    }
    if (!formData.school.trim()) {
      newErrors.school = lang === 'amh' ? 'የትምህርት ቤትዎን ስም ያስገቡ' : 'Please enter your school name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete({
        ...formData,
        preferredLanguage: lang,
        isRegistered: true,
      } as StudentInfo);
    }
  };

  return (
    <div id="welcome-container" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Premium Ambient Background Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vip-gold/10 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vip-cyan/10 rounded-full blur-3xl -z-10 animate-pulse duration-[6000ms]"></div>

      {/* Language Selector Float */}
      <div className="absolute top-6 right-6 z-50">
        <button
          id="lang-toggle-btn"
          onClick={() => setLang(lang === 'amh' ? 'eng' : 'amh')}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-vip-gold/30 bg-vip-slate/80 hover:bg-vip-slate hover:border-vip-gold hover:scale-105 active:scale-95 transition-all text-xs font-semibold cursor-pointer text-vip-gold"
        >
          <Languages className="w-4 h-4" />
          <span>{lang === 'amh' ? '🌍 English Version' : '🌍 በአማርኛ ለመቀጠል'}</span>
        </button>
      </div>

      <div className="w-full max-w-2xl z-10 flex flex-col items-center">
        {/* Elite Branding Logo Display */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-4 relative p-1.5 rounded-2xl bg-slate-905 border border-vip-gold/40 shadow-xl shadow-vip-gold/15 flex items-center justify-center bg-slate-950"
        >
          <img 
            src={aksumLogo} 
            alt="Aksum VIP Academy logo" 
            className="w-24 h-24 object-contain rounded-xl"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Elite Branding Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vip-gold/10 border border-vip-gold/30 text-vip-gold text-xs font-bold tracking-wider uppercase mb-3 glow-gold">
            <Sparkles className="w-3.5 h-3.5 animate-spin duration-[4000ms]" />
            Aksumite Civilization Inspired Education Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-2">
            🏛️ {lang === 'amh' ? <span className="text-gradient-gold">አክሱም VIP አካዳሚ</span> : <span className="text-gradient-gold">Aksum VIP Academy</span>}
          </h1>
          <p className="text-gray-400 text-sm md:text-base px-4 max-w-lg mx-auto leading-relaxed">
            {lang === 'amh' 
              ? 'ከታላቁ ጥንታዊ የአክሱም ሥልጣኔ ሥነ-ጥበብ እና ጥበብ የተነሳሳ፣ ለብሔራዊ ማትሪክ ፈተና አሸናፊነት የተዘጋጀ ቅንጡ የቪአይፒ ማዕከል!' 
              : 'Inspired by the historic greatness and wisdom of the ancient Aksumite Civilization, the ultimate prep-hub for your national ESSLCE exams!'}
          </p>
        </motion.div>

        {/* glass Onboarding Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl relative border-vip-gold/25"
        >
          {/* Subtle gold crown corner decal */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-vip-gold/20 via-transparent to-transparent rounded-tr-2xl pointer-events-none"></div>

          <div className="mb-6 pb-4 border-b border-vip-charcoal/40">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-vip-gold" />
              <span>{lang === 'amh' ? 'አስፈላጊ የመግቢያ ቅጽ' : 'Student Enrollment Registration'}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {lang === 'amh' 
                ? 'ለመጀመር እባክዎን መጀመሪያ እነዚህን የቪአይፒ መረጃዎች በሙሉ ይሙሉ' 
                : 'Please fulfill all requested credentials to initialize your VIP study profile.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-vip-gold" />
                {lang === 'amh' ? 'ሙሉ ስም' : 'Full Name'} <span className="text-red-500">*</span>
              </label>
              <input
                id="student-name-input"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={lang === 'amh' ? 'ለምሳሌ፡ የኔታ አበበ' : 'e.g., Alazar Tesfaye'}
                className="w-full bg-vip-dark/80 border border-vip-charcoal/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-vip-gold focus:ring-1 focus:ring-vip-gold placeholder-gray-500 text-white transition-all"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">❌ {errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Age Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-vip-gold" />
                  {lang === 'amh' ? 'ዕድሜ' : 'Age'} <span className="text-red-500">*</span>
                </label>
                <input
                  id="student-age-input"
                  type="number"
                  min="13"
                  max="99"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value ? Number(e.target.value) : '' })}
                  placeholder="e.g., 18"
                  className="w-full bg-vip-dark/80 border border-vip-charcoal/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-vip-gold focus:ring-1 focus:ring-vip-gold placeholder-gray-500 text-white transition-all"
                />
                {errors.age && <p className="text-xs text-red-500 mt-1">❌ {errors.age}</p>}
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-vip-gold" />
                  {lang === 'amh' ? 'ስልክ ቁጥር' : 'Phone Number'} <span className="text-red-500">*</span>
                </label>
                <input
                  id="student-phone-input"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., 0912345678"
                  className="w-full bg-vip-dark/80 border border-vip-charcoal/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-vip-gold focus:ring-1 focus:ring-vip-gold placeholder-gray-500 text-white transition-all"
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">❌ {errors.phone}</p>}
              </div>
            </div>

            {/* School Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-vip-gold" />
                {lang === 'amh' ? 'ትምህርት ቤት' : 'School / Preparatory'} <span className="text-red-500">*</span>
              </label>
              <input
                id="student-school-input"
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder={lang === 'amh' ? 'ለምሳሌ፡ ቦሌ ዝግጅት ት/ቤት' : 'e.g., Bole Preparatory School'}
                className="w-full bg-vip-dark/80 border border-vip-charcoal/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-vip-gold focus:ring-1 focus:ring-vip-gold placeholder-gray-500 text-white transition-all"
              />
              {errors.school && <p className="text-xs text-red-500 mt-1">❌ {errors.school}</p>}
            </div>

            {/* Academic Stream Selection (Beautiful custom radio buttons) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-3 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-vip-gold" />
                {lang === 'amh' ? 'የጥናት መስክ (Stream)' : 'Academic stream / Path'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  id="stream-natural-btn"
                  type="button"
                  onClick={() => setFormData({ ...formData, fieldStream: 'Natural Science' })}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    formData.fieldStream === 'Natural Science'
                      ? 'border-vip-gold bg-vip-gold/10'
                      : 'border-vip-charcoal/50 bg-vip-dark/40 hover:border-gray-500'
                  }`}
                >
                  <span className="font-bold text-sm text-white">{lang === 'amh' ? '🔬 የተፈጥሮ ሳይንስ' : '🔬 Natural Science'}</span>
                  <span className="text-[10px] text-gray-400 mt-1 mt-0.5">Maths, Physics, Chem, Bio, English...</span>
                </button>
                <button
                  id="stream-social-btn"
                  type="button"
                  onClick={() => setFormData({ ...formData, fieldStream: 'Social Science' })}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    formData.fieldStream === 'Social Science'
                      ? 'border-vip-gold bg-vip-gold/10'
                      : 'border-vip-charcoal/50 bg-vip-dark/40 hover:border-gray-500'
                  }`}
                >
                  <span className="font-bold text-sm text-white">{lang === 'amh' ? '📚 ማኅበራዊ ሳይንስ' : '📚 Social Science'}</span>
                  <span className="text-[10px] text-gray-400 mt-1 mt-0.5">Maths, History, Geog, Civics, English...</span>
                </button>
              </div>
            </div>

            {/* Target University Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                🎯 {lang === 'amh' ? 'የሚመርጡት ቀዳሚ ዩኒቨርሲቲ' : 'Target University Preference'}
              </label>
              <select
                id="student-university-select"
                value={formData.targetUniversity}
                onChange={(e) => setFormData({ ...formData, targetUniversity: e.target.value })}
                className="w-full bg-vip-dark/80 border border-vip-charcoal/70 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-vip-gold focus:ring-1 focus:ring-vip-gold text-white cursor-pointer"
              >
                <option value="Addis Ababa University">Addis Ababa University (AAU)</option>
                <option value="Adama Science & Technology University">Adama Science & Technology University (ASTU)</option>
                <option value="Addis Ababa Science & Technology University">Addis Ababa Science & Technology University (AASTU)</option>
                <option value="University of Gondar">University of Gondar (UoG)</option>
                <option value="Jimma University">Jimma University (JU)</option>
                <option value="Bahir Dar University">Bahir Dar University (BDU)</option>
                <option value="Hawassa University">Hawassa University (HU)</option>
              </select>
            </div>

            {/* Terms and Conditions Accordion & Customer Support Details */}
            <div className="p-4 bg-slate-950/60 rounded-xl border border-vip-gold/15 space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  id="welcome-terms-checkbox"
                  type="checkbox"
                  required
                  defaultChecked
                  className="mt-0.5 rounded border-vip-gold/45 bg-vip-dark text-vip-gold focus:ring-vip-gold cursor-pointer"
                />
                <span className="text-[11px] text-gray-400 leading-tight">
                  {lang === 'amh' ? (
                    <>
                      በአክሱም ቪአይፒ አካዳሚ <strong>የአጠቃቀም መመሪያዎች እና ሁኔታዎች</strong> እስማማለሁ። የአካዳሚክ ሥነ-ምግባር ደንቦችን ለማክበር ቃል እገባለሁ።
                    </>
                  ) : (
                    <>
                      I fully agree to the <strong>Terms & Conditions</strong> of Aksum VIP Academy and academic integrity code of conduct.
                    </>
                  )}
                </span>
              </label>
              
              <div className="text-[10px] text-gray-500 pt-2 border-t border-vip-charcoal/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>💬 {lang === 'amh' ? 'የቴክኒክ ድጋፍ ለማግኘት፡' : 'Direct Support Hotline:'}</span>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-vip-gold font-mono">
                  <a href="tel:+251900882116" className="hover:underline">📞 +251 900 882 116</a>
                  <a href="mailto:ezrat2116@gmail.com" className="hover:underline">✉️ ezrat2116@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              id="onboarding-submit-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-vip-gold via-amber-500 to-amber-600 hover:from-amber-500 hover:to-vip-gold text-vip-dark font-extrabold text-sm py-4 rounded-xl shadow-lg shadow-vip-gold/20 cursor-pointer mt-4 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-vip-dark animate-pulse" />
              <span>{lang === 'amh' ? 'ወደ አክሱም ቪአይፒ አካዳሚ ግባ' : 'Enter Aksum VIP Academy'}</span>
            </motion.button>
          </form>
        </motion.div>

        {/* Footer info labels */}
        <p className="text-center text-xs text-gray-500 mt-6 tracking-wide leading-relaxed">
          🔒 {lang === 'amh' ? 'የእርስዎ የግል መረጃዎች ለጥናት እና ለአይቲ ቲውተር ግላዊ አገልግሎት ብቻ ይውላሉ።' : 'Your credentials are strictly cached locally for AI personalized tutoring filters.'}
        </p>
      </div>
    </div>
  );
}
