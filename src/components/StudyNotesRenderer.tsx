import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  HelpCircle, 
  Check, 
  Copy, 
  Sliders, 
  Calculator, 
  BookOpen, 
  ListRestart, 
  Award, 
  ChevronRight,
  BookmarkCheck,
  Languages
} from 'lucide-react';
import { CurriculumUnit } from '../types';

interface StudyNotesRendererProps {
  unit: CurriculumUnit;
  lang: 'amh' | 'eng';
  notesLanguage: 'amh' | 'eng';
  onAskTutor?: (question: string) => void;
}

// Clean math notation dynamically for beautiful representation without heavy LaTeX engines
const cleanMathNotation = (formula: string): string => {
  let cleaned = formula;
  
  // Replace typical LaTeX commands with unicode characters
  cleaned = cleaned.replace(/\\frac\{([^\}]+)\}\{([^\}]+)\}/g, '($1) / ($2)');
  cleaned = cleaned.replace(/\\cdot/g, ' · ');
  cleaned = cleaned.replace(/\\theta/g, 'θ');
  cleaned = cleaned.replace(/\\cos/g, 'cos');
  cleaned = cleaned.replace(/\\sin/g, 'sin');
  cleaned = cleaned.replace(/\\approx/g, '≈');
  cleaned = cleaned.replace(/\\neq/g, '≠');
  cleaned = cleaned.replace(/\\gg/g, '»');
  cleaned = cleaned.replace(/\\ll/g, '«');
  cleaned = cleaned.replace(/\\infty/g, '∞');
  cleaned = cleaned.replace(/\\rightleftharpoons/g, ' ⇌ ');
  cleaned = cleaned.replace(/\\lim_\{([^\\\}]+ \\to [^\}]+)\}/g, 'lim ($1)');
  cleaned = cleaned.replace(/\\lim/g, 'lim');
  cleaned = cleaned.replace(/\\arrow/g, '→');
  cleaned = cleaned.replace(/\\to/g, '→');
  cleaned = cleaned.replace(/\\text\{([^\}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\times/g, '×');
  
  // Superscripts
  cleaned = cleaned.replace(/\^2/g, '²');
  cleaned = cleaned.replace(/\^3/g, '³');
  cleaned = cleaned.replace(/\^n/g, 'ⁿ');
  cleaned = cleaned.replace(/\^\{([^\}]+)\}/g, '⁺$1');

  // Subscripts
  cleaned = cleaned.replace(/_1/g, '₁');
  cleaned = cleaned.replace(/_2/g, '₂');
  cleaned = cleaned.replace(/_3/g, '₃');
  cleaned = cleaned.replace(/_n/g, 'ₙ');
  cleaned = cleaned.replace(/_i/g, 'ᵢ');
  cleaned = cleaned.replace(/_f/g, '𝒻');
  cleaned = cleaned.replace(/_c/g, '꜀');
  cleaned = cleaned.replace(/_eq/g, 'ₑ_q');
  cleaned = cleaned.replace(/_e/g, 'ₑ');
  cleaned = cleaned.replace(/_t/g, 'ₜ');
  cleaned = cleaned.replace(/_x/g, 'ₓ');
  cleaned = cleaned.replace(/_y/g, 'y');
  cleaned = cleaned.replace(/_s_n/g, 'ₛₙ');
  cleaned = cleaned.replace(/_\\infty/g, '__∞');
  cleaned = cleaned.replace(/_\{([^\}]+)\}/g, '₍$1₎');

  return cleaned;
};

// Main formula parser for block math
const parseInlineContent = (text: string) => {
  // First, extract math tokens between $ and $
  const mathTokens: string[] = [];
  let parsedText = text.replace(/\$([^\$]+)\$/g, (match, formula) => {
    const placeholder = `___MATH_TOKEN_${mathTokens.length}___`;
    mathTokens.push(formula);
    return placeholder;
  });

  // Extract bold tokens between ** and **
  const boldTokens: string[] = [];
  parsedText = parsedText.replace(/\*\*([^\*]+)\*\*/g, (match, content) => {
    const placeholder = `___BOLD_TOKEN_${boldTokens.length}___`;
    boldTokens.push(content);
    return placeholder;
  });

  // Split remainder by tokens
  const parts = parsedText.split(/(___MATH_TOKEN_\d+___|___BOLD_TOKEN_\d+___)/);

  return parts.map((part, index) => {
    if (part.startsWith('___MATH_TOKEN_')) {
      const tokenIdx = parseInt(part.replace('___MATH_TOKEN_', '').replace('___', ''), 10);
      const formula = mathTokens[tokenIdx] || '';
      return (
        <code 
          key={`math-${index}`} 
          title="Unicode clean render"
          className="mx-1 px-1.5 py-0.5 rounded-md font-mono text-xs font-semibold text-vip-gold bg-vip-gold/10 border border-vip-gold/20 tracking-wide inline-block select-all"
        >
          {cleanMathNotation(formula)}
        </code>
      );
    }
    if (part.startsWith('___BOLD_TOKEN_')) {
      const tokenIdx = parseInt(part.replace('___BOLD_TOKEN_', '').replace('___', ''), 10);
      const content = boldTokens[tokenIdx] || '';
      return (
        <strong 
          key={`bold-${index}`} 
          className="text-white font-bold bg-slate-800/60 px-1 py-0.5 rounded shadow-sm border border-slate-700/40 text-xs italic"
        >
          {content}
        </strong>
      );
    }
    return <span key={`text-${index}`}>{part}</span>;
  });
};

export default function StudyNotesRenderer({ unit, lang, notesLanguage, onAskTutor }: StudyNotesRendererProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMode, setActiveMode] = useState<'study' | 'formulas' | 'cheat'>('study');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');

  const getSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-xs md:text-sm leading-relaxed';
      case 'lg': return 'text-base md:text-lg leading-relaxed';
      case 'xl': return 'text-lg md:text-xl leading-relaxed';
      case 'base':
      default:
        return 'text-sm md:text-base leading-relaxed';
    }
  };

  // States for formula simulators (Physics/Math interactive models)
  const [simCharge1, setSimCharge1] = useState(5); // in nanoCoulombs
  const [simCharge2, setSimCharge2] = useState(-5); 
  const [simDistance, setSimDistance] = useState(2); // in meters
  
  const [simProgressionTermA1, setSimProgressionTermA1] = useState(2);
  const [simProgressionDiffD, setSimProgressionDiffD] = useState(3);
  const [simProgressionTermsN, setSimProgressionTermsN] = useState(8);

  const [simProjVelocity, setSimProjVelocity] = useState(20);
  const [simProjAngle, setSimProjAngle] = useState(45);

  const notesRawText = notesLanguage === 'eng' ? unit.notes : unit.notesAmharic;

  // Split notes by block elements
  const processedBlocks = useMemo(() => {
    if (!notesRawText) return [];
    
    // We clean up carriage returns and split into sequential lines or paragraph chunks
    const lines = notesRawText.split('\n');
    const bBlocks: Array<{
      id: string;
      type: 'header-3' | 'header-4' | 'block-math' | 'list-unordered' | 'list-ordered' | 'paragraph';
      content: string;
      raw: string;
    }> = [];

    let insideBlockMath = false;
    let currentMathLines: string[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      const uniqueId = `block-${idx}`;

      // Check block math syntax `$$`
      if (trimmed.startsWith('$$')) {
        if (insideBlockMath) {
          // Closing block math
          insideBlockMath = false;
          bBlocks.push({
            id: uniqueId,
            type: 'block-math',
            content: currentMathLines.join('\n'),
            raw: trimmed
          });
          currentMathLines = [];
        } else {
          // Opening block math
          // Check if it's single line $$formula$$
          if (trimmed.endsWith('$$') && trimmed.length > 2) {
            const inner = trimmed.slice(2, -2).trim();
            bBlocks.push({
              id: uniqueId,
              type: 'block-math',
              content: inner,
              raw: trimmed
            });
          } else {
            insideBlockMath = true;
          }
        }
        return;
      }

      if (insideBlockMath) {
        currentMathLines.push(trimmed);
        return;
      }

      // Check header-3
      if (trimmed.startsWith('### ')) {
        bBlocks.push({
          id: uniqueId,
          type: 'header-3',
          content: trimmed.substring(4),
          raw: trimmed
        });
        return;
      }

      // Check header-4
      if (trimmed.startsWith('#### ')) {
        bBlocks.push({
          id: uniqueId,
          type: 'header-4',
          content: trimmed.substring(5),
          raw: trimmed
        });
        return;
      }

      // Check unordered lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        bBlocks.push({
          id: uniqueId,
          type: 'list-unordered',
          content: trimmed.substring(2),
          raw: trimmed
        });
        return;
      }

      // Check ordered lists
      const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (orderedMatch) {
        bBlocks.push({
          id: uniqueId,
          type: 'list-ordered',
          content: orderedMatch[2],
          raw: trimmed // original line
        });
        return;
      }

      // Normal paragraph
      if (trimmed.length > 0) {
        bBlocks.push({
          id: uniqueId,
          type: 'paragraph',
          content: trimmed,
          raw: trimmed
        });
      }
    });

    return bBlocks;
  }, [notesRawText]);

  // Apply search query filter
  const filteredBlocks = useMemo(() => {
    if (!searchQuery.trim()) return processedBlocks;
    const lowerQuery = searchQuery.toLowerCase();
    return processedBlocks.filter(block => 
      block.content.toLowerCase().includes(lowerQuery) || 
      block.raw.toLowerCase().includes(lowerQuery)
    );
  }, [processedBlocks, searchQuery]);

  const handleCopyFormula = (rawFormula: string) => {
    const cleaned = cleanMathNotation(rawFormula);
    navigator.clipboard.writeText(cleaned);
    setCopiedFormula(rawFormula);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  // Interactive Simulators logic
  const isPhysicsElectrostatics = unit.id.includes('phys') && (unit.title.toLowerCase().includes('electrostatics') || unit.notes.toLowerCase().includes('coulomb'));
  const isPhysicsMotion = unit.id.includes('phys') && (unit.title.toLowerCase().includes('motion') || unit.notes.toLowerCase().includes('projectile'));
  const isMathSequences = unit.id.includes('math') && (unit.title.toLowerCase().includes('sequences') || unit.notes.toLowerCase().includes('arithmetic'));

  // Calculate Electrostatic Sim
  const electroForce = useMemo(() => {
    const k = 8.99 * 1e9; // Coulomb's constant
    const q1 = simCharge1 * 1e-9;
    const q2 = simCharge2 * 1e-9;
    const r = simDistance;
    return (k * Math.abs(q1 * q2)) / Math.pow(r, 2);
  }, [simCharge1, simCharge2, simDistance]);

  // Calculate Sequences Sim
  const arithmeticTerm = useMemo(() => {
    return simProgressionTermA1 + (simProgressionTermsN - 1) * simProgressionDiffD;
  }, [simProgressionTermA1, simProgressionDiffD, simProgressionTermsN]);

  const arithmeticSum = useMemo(() => {
    const an = arithmeticTerm;
    return (simProgressionTermsN / 2) * (simProgressionTermA1 + an);
  }, [simProgressionTermA1, arithmeticTerm, simProgressionTermsN]);

  // Calculate Projectile Motion Sim
  const projectileStats = useMemo(() => {
    const g = 9.81;
    const u = simProjVelocity;
    const rad = (simProjAngle * Math.PI) / 180;
    const maxHeight = (Math.pow(u, 2) * Math.pow(Math.sin(rad), 2)) / (2 * g);
    const range = (Math.pow(u, 2) * Math.sin(2 * rad)) / g;
    return { maxHeight, range };
  }, [simProjVelocity, simProjAngle]);

  return (
    <div className="space-y-6">
      {/* Search and Tab Toggles Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-950/60 p-4 border border-vip-charcoal/30 rounded-2xl">
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1 w-full md:w-auto">
          <button
            onClick={() => setActiveMode('study')}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
              activeMode === 'study' 
                ? 'bg-vip-gold/15 text-vip-gold border border-vip-gold/30' 
                : 'text-gray-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'amh' ? 'ሙሉ ማስታወሻ' : 'Detailed Guide'}</span>
          </button>

          <button
            onClick={() => setActiveMode('formulas')}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
              activeMode === 'formulas' 
                ? 'bg-vip-gold/15 text-vip-gold border border-vip-gold/30' 
                : 'text-gray-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{lang === 'amh' ? 'ፎርሙላ ሲሙሌተር' : 'Formula Simulation'}</span>
          </button>

          <button
            onClick={() => setActiveMode('cheat')}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
              activeMode === 'cheat' 
                ? 'bg-vip-gold/15 text-vip-gold border border-vip-gold/30' 
                : 'text-gray-400 hover:text-slate-200'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>{lang === 'amh' ? 'ፈጣን ማጠቃለያ' : 'Quick Cram'}</span>
          </button>
        </div>

        {activeMode === 'study' && (
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder={lang === 'amh' ? 'ማስታወሻዎችን ፈልግ...' : 'Search study guides...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-vip-charcoal/40 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-505 focus:outline-none focus:border-vip-gold/60 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-[10px] text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* MODE 1: STUDY COMPREHENSIVE VIEW */}
        {activeMode === 'study' && (
          <motion.div
            key="detailed-study"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-950/70 rounded-2xl border border-vip-charcoal/40 overflow-hidden flex flex-col"
          >
            {/* Reading View Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3 border-b border-vip-charcoal/40 bg-slate-950/45 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-vip-gold animate-ping" />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">
                  {lang === 'amh' ? 'ንባብ እይታ' : 'READING VIEW'} • {unit.subject} - {unit.title}
                </span>
              </div>
              
              {/* Interactive Font Sizing Toggles */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider">{lang === 'amh' ? 'የፊደል መጠን' : 'Font Size'}:</span>
                <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px] font-bold">
                  {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                        fontSize === sz 
                          ? 'bg-vip-gold text-vip-dark font-black shadow-sm' 
                          : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      {sz.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main scrollable body */}
            <div className="reading-pane p-6 max-h-[500px] overflow-y-auto font-sans leading-relaxed text-slate-200 scrollbar-thin scrollbar-thumb-vip-charcoal/60 space-y-6">
              {filteredBlocks.length === 0 ? (
                <div className="py-12 text-center text-gray-500 space-y-2">
                  <p className="text-sm font-semibold">
                    {lang === 'amh' ? 'ምንም የሚዛመድ መረጃ አልተገኘም' : 'No matching sections found.'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {lang === 'amh' ? 'እባክዎ የተለየ የፍለጋ ቃል በመጠቀም ይሞክሩ' : 'Try refining your search keyword or clear the search input.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredBlocks.map((block) => {
                    switch (block.type) {
                      case 'header-3':
                        return (
                          <div key={block.id} className="pt-4 pb-2 first:pt-0 border-b border-vip-gold/15 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-vip-gold animate-pulse shrink-0" />
                            <h4 className="text-lg md:text-xl font-display font-black text-vip-gold tracking-tight select-text">
                              {block.content}
                            </h4>
                          </div>
                        );
                      case 'header-4':
                        return (
                          <div key={block.id} className="pt-2 pb-1 pl-3 border-l-2 border-sky-400/50 flex items-center gap-1.5">
                            <h5 className="text-sm md:text-base font-display font-extrabold text-sky-400 tracking-wide select-text">
                              {block.content}
                            </h5>
                          </div>
                        );
                      case 'block-math':
                        return (
                          <div 
                            key={block.id} 
                            className="my-5 bg-gradient-to-r from-vip-dark to-slate-950/95 border border-vip-gold/20 hover:border-vip-gold/50 rounded-2xl p-5 relative overflow-hidden group/math transition-all"
                          >
                            <div className="absolute right-3 top-3 flex items-center gap-2 opacity-0 group-hover/math:opacity-100 transition-opacity">
                              {onAskTutor && (
                                <button
                                  onClick={() => onAskTutor(`Please explain this formula from ${unit.subject} (Grade ${unit.grade}), Unit ${unit.unitNumber}: ${unit.title}. Formula: "${block.content}". Please provide its physical/mathematical meaning, definitions of all variables, real-life examples, and common traps in national matric exams.`)}
                                  className="text-vip-gold hover:text-vip-dark p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-vip-gold transition-all cursor-pointer text-[10px] font-bold flex items-center gap-1 shadow-md"
                                  title="Analyze & explain this formula in depth"
                                >
                                  <Sparkles className="w-3 h-3 text-vip-gold group-hover/math:text-vip-dark" />
                                  <span>{lang === 'amh' ? 'በ AI አስረዳ' : 'Explain Formula'}</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleCopyFormula(block.content)}
                                className="text-gray-400 hover:text-vip-gold p-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
                                title="Copy sanitized formula text"
                              >
                                {copiedFormula === block.content ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            
                            <div className="text-center font-mono text-base md:text-lg font-black tracking-widest text-vip-gold/90 selection:bg-vip-gold/25 select-all py-1">
                              {cleanMathNotation(block.content)}
                            </div>
                            <div className="text-[9px] text-gray-500 font-mono text-center mt-1">
                              {lang === 'amh' ? 'የተስተካከለ ማትሪክ ፎርሙላ - ለመገልበጥ ተጫን' : 'Board-Exam Clean LaTeX Math • Double-tap to select'}
                            </div>
                          </div>
                        );
                      case 'list-unordered':
                        return (
                          <div key={block.id} className="group/item relative flex gap-3 items-start pl-3 text-slate-350 hover:bg-slate-900/40 rounded-xl p-1.5 transition-all">
                            <span className="text-vip-gold font-bold text-xs mt-1 shrink-0">✦</span>
                            <p className={`text-slate-300 select-text text-justify pr-16 ${getSizeClass()}`}>
                              {parseInlineContent(block.content)}
                            </p>
                            {onAskTutor && (
                              <button
                                onClick={() => onAskTutor(`For the unit ${unit.subject}, Unit ${unit.unitNumber} (${unit.title}), please explain this key concept or fact in details with matric exam context: "${block.content}"`)}
                                className="absolute right-2 top-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity bg-slate-900 hover:bg-sky-400 hover:text-slate-950 text-sky-400 border border-sky-500/20 text-[9px] px-2 py-0.5 rounded font-mono font-bold cursor-pointer"
                                title="Explain this specific concept"
                              >
                                {lang === 'amh' ? 'በሙሉ ዘርዝር' : 'Details'}
                              </button>
                            )}
                          </div>
                        );
                      case 'list-ordered':
                        // Match prefix number and body
                        const prefixMatch = block.raw.match(/^(\d+)\.\s+(.*)/);
                        const number = prefixMatch ? prefixMatch[1] : '•';
                        const body = prefixMatch ? prefixMatch[2] : block.content;
                        return (
                          <div key={block.id} className="group/item relative flex gap-3 items-start pl-3 text-slate-350 hover:bg-slate-900/40 rounded-xl p-1.5 transition-all">
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono text-[10px] font-bold mt-0.5 shrink-0">
                              {number}
                            </span>
                            <p className={`text-slate-300 select-text text-justify pr-16 ${getSizeClass()}`}>
                              {parseInlineContent(body)}
                            </p>
                            {onAskTutor && (
                              <button
                                onClick={() => onAskTutor(`For the unit ${unit.subject}, Unit ${unit.unitNumber} (${unit.title}), please explain step ${number} of this sequence/method: "${body}"`)}
                                className="absolute right-2 top-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity bg-slate-900 hover:bg-sky-400 hover:text-slate-950 text-sky-400 border border-sky-500/20 text-[9px] px-2 py-0.5 rounded font-mono font-bold cursor-pointer"
                                title="Explain this specific step"
                              >
                                {lang === 'amh' ? 'በሙሉ ዘርዝር' : 'Details'}
                              </button>
                            )}
                          </div>
                        );
                      case 'paragraph':
                      default:
                        return (
                          <div key={block.id} className="group/para relative py-1.5 hover:bg-slate-900/40 rounded-xl p-1.5 transition-all">
                            <p className={`text-slate-300 select-text text-justify pl-1 pr-16 ${getSizeClass()}`}>
                              {parseInlineContent(block.content)}
                            </p>
                            {onAskTutor && (
                              <button
                                onClick={() => onAskTutor(`In the context of ${unit.subject} (Grade ${unit.grade}), Unit ${unit.unitNumber}: ${unit.title}, can you explain this concept in simple terms with board-exam examples: "${block.content}"?`)}
                                className="absolute right-2 top-2 opacity-0 group-hover/para:opacity-100 transition-opacity bg-slate-900/90 hover:bg-vip-gold hover:text-vip-dark text-vip-gold border border-vip-gold/30 text-[9px] px-2 py-0.5 rounded font-mono font-bold cursor-pointer shadow-md flex items-center gap-1 z-10"
                                title="Send this concept to Aksum GPT Pro for a personalized deep-dive"
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>{lang === 'amh' ? 'አስረዳኝ' : 'Explain'}</span>
                              </button>
                            )}
                          </div>
                        );
                    }
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* MODE 2: FORMULA INTERACTIVE SIMULATION DECK */}
        {activeMode === 'formulas' && (
          <motion.div
            key="interactive-formulas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Top Interactive Banner */}
            <div className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-emerald-950/40 p-5 rounded-2xl border border-vip-gold/10">
              <span className="text-[10px] bg-vip-gold/15 text-vip-gold font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                ⚡ {lang === 'amh' ? 'በይነተገናኝ የቀመር አስመሳይ' : 'Interactive Mathematical Toy'}
              </span>
              <h4 className="text-base font-bold text-white mt-2">
                {lang === 'amh' ? 'ተለዋዋጭ ፎርሙላ ባህሪያትን ይፈትሹ' : 'Deconstruct Board Formulas through Virtual Proportionality'}
              </h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {lang === 'amh' 
                  ? 'ተለዋዋጭ እሴቶችን በስላይደሩ በመለዋወጥ የቀመሮች ውጤት እንዴት እንደሚለዋወጥ እና ለብሔራዊ ፈተና እንዴት እንደሚጠቅምዎ ይረዱ።'
                  : 'Slide variables to instantly re-calculate results. Master inverse-square dependencies, linear factors, and mathematical progressions with absolute ease.'}
              </p>
            </div>

            {/* Simulators selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Simulator Card 1: Electrostatics (Inverse Square) */}
              {isPhysicsElectrostatics && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-vip-charcoal/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-vip-gold font-mono">COULOMB'S INVERSE LAW</span>
                      <Calculator className="w-4 h-4 text-vip-gold" />
                    </div>
                    
                    <div className="bg-slate-900 p-4 rounded-xl text-center py-5 border border-slate-800">
                      <p className="font-mono text-lg font-black text-white select-all">
                        F = kₑ · (|q₁ · q₂|) / r²
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase font-mono tracking-wider">Electrostatic Repulsion/Attraction Force</p>
                    </div>

                    <div className="space-y-3.5 mt-5">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-400">Charge 1 (q₁):</span>
                          <span className={`${simCharge1 >= 0 ? 'text-sky-400' : 'text-rose-400'} font-bold`}>{simCharge1} nC</span>
                        </div>
                        <input 
                          type="range" 
                          min="-15" 
                          max="15" 
                          value={simCharge1}
                          onChange={(e) => setSimCharge1(parseInt(e.target.value, 10))}
                          className="w-full accent-vip-gold" 
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-400">Charge 2 (q₂):</span>
                          <span className={`${simCharge2 >= 0 ? 'text-sky-400' : 'text-rose-400'} font-bold`}>{simCharge2} nC</span>
                        </div>
                        <input 
                          type="range" 
                          min="-15" 
                          max="15" 
                          value={simCharge2}
                          onChange={(e) => setSimCharge2(parseInt(e.target.value, 10))}
                          className="w-full accent-vip-gold" 
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-400">Distance (r):</span>
                          <span className="text-vip-gold font-bold">{simDistance} m</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          step="0.5"
                          value={simDistance}
                          onChange={(e) => setSimDistance(parseFloat(e.target.value))}
                          className="w-full accent-sky-400" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-vip-gold/10 p-4 rounded-xl border border-vip-gold/25 text-center mt-5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block font-mono">Resulting Vector Force (F)</span>
                    <span className="text-2xl font-black text-vip-gold font-mono">{electroForce.toFixed(3)} N</span>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono italic">
                      {simCharge1 * simCharge2 < 0 ? '✨ Attraction force (Opposite charges)' : '✨ Repulsion force (Like charges)'}
                    </p>
                  </div>
                </div>
              )}

              {/* Simulator Card 2: Two-dimensional Projectile Motion */}
              {isPhysicsMotion && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-vip-charcoal/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-sky-400 font-mono">PROJECTILE TRAJECTORY</span>
                      <Calculator className="w-4 h-4 text-sky-400" />
                    </div>
                    
                    <div className="bg-slate-900 p-3 rounded-xl text-center py-4 border border-slate-800 space-y-1.5">
                      <p className="font-mono text-sm font-black text-sky-400 select-all">
                        Range (R) = [u² · sin(2θ)] / g
                      </p>
                      <p className="font-mono text-sm font-black text-teal-400 select-all">
                        Max Height (H) = [u² · sin²(θ)] / 2g
                      </p>
                    </div>

                    <div className="space-y-3.5 mt-5">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-400">Launch Velocity (u):</span>
                          <span className="text-sky-400 font-bold">{simProjVelocity} m/s</span>
                        </div>
                        <input 
                          type="range" 
                          min="5" 
                          max="45" 
                          value={simProjVelocity}
                          onChange={(e) => setSimProjVelocity(parseInt(e.target.value, 10))}
                          className="w-full accent-sky-400" 
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-400">Launch Angle (θ):</span>
                          <span className="text-teal-400 font-bold">{simProjAngle}° degree</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" 
                          max="89" 
                          value={simProjAngle}
                          onChange={(e) => setSimProjAngle(parseInt(e.target.value, 10))}
                          className="w-full accent-teal-400" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="bg-sky-500/10 p-3.5 rounded-xl border border-sky-500/20 text-center">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block font-mono">Max Height (H)</span>
                      <span className="text-lg font-black text-sky-400 font-mono">{projectileStats.maxHeight.toFixed(2)} m</span>
                    </div>

                    <div className="bg-teal-500/10 p-3.5 rounded-xl border border-teal-500/20 text-center">
                      <span className="text-[9px] text-gray-550 font-bold uppercase tracking-wider block font-mono">Total Range (R)</span>
                      <span className="text-lg font-black text-teal-400 font-mono">{projectileStats.range.toFixed(2)} m</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Simulator Card 3: Sequences Progression Solver */}
              {isMathSequences && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-vip-charcoal/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-emerald-400 font-mono">ARITHMETIC AP PROGRESSION</span>
                      <Calculator className="w-4 h-4 text-emerald-400" />
                    </div>
                    
                    <div className="bg-slate-900 p-3.5 rounded-xl text-center py-4 border border-slate-800 space-y-1">
                      <p className="font-mono text-sm font-black text-emerald-400">
                        aₙ = a₁ + (n - 1)d
                      </p>
                      <p className="font-mono text-sm font-black text-teal-400">
                        Sₙ = (n / 2) · [a₁ + aₙ]
                      </p>
                    </div>

                    <div className="space-y-3.5 mt-5">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-400">First Term (a₁):</span>
                          <span className="text-emerald-400 font-bold">{simProgressionTermA1}</span>
                        </div>
                        <input 
                          type="range" 
                          min="-20" 
                          max="20" 
                          value={simProgressionTermA1}
                          onChange={(e) => setSimProgressionTermA1(parseInt(e.target.value, 10))}
                          className="w-full accent-emerald-400" 
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-400">Common Diff (d):</span>
                          <span className="text-teal-400 font-bold">{simProgressionDiffD}</span>
                        </div>
                        <input 
                          type="range" 
                          min="-10" 
                          max="15" 
                          value={simProgressionDiffD}
                          onChange={(e) => setSimProgressionDiffD(parseInt(e.target.value, 10))}
                          className="w-full accent-teal-400" 
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-400">Number of terms (n):</span>
                          <span className="text-vip-gold font-bold">{simProgressionTermsN} Terms</span>
                        </div>
                        <input 
                          type="range" 
                          min="2" 
                          max="25" 
                          value={simProgressionTermsN}
                          onChange={(e) => setSimProgressionTermsN(parseInt(e.target.value, 10))}
                          className="w-full accent-vip-gold" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 text-center">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block font-mono">an Term (Term {simProgressionTermsN})</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">{arithmeticTerm}</span>
                    </div>

                    <div className="bg-teal-500/10 p-3.5 rounded-xl border border-teal-500/20 text-center">
                      <span className="text-[9px] text-gray-550 font-bold uppercase tracking-wider block font-mono">Sum (Sn total)</span>
                      <span className="text-lg font-black text-teal-400 font-mono">{arithmeticSum}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* General Cheat Sheet deck fallback if no simulator match matches */}
              {(!isPhysicsElectrostatics && !isPhysicsMotion && !isMathSequences) && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-vip-charcoal/50 md:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 text-vip-gold font-bold text-xs font-mono uppercase">
                    <Sparkles className="w-4 h-4 animate-spin text-vip-gold" />
                    <span>Structured Academic Formulas Defined</span>
                  </div>

                  {unit.keyFormulas && unit.keyFormulas.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {unit.keyFormulas.map((f, fIdx) => (
                        <div key={fIdx} className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex flex-col justify-between hover:border-vip-gold/30 hover:bg-slate-950 transition-all">
                          <span className="text-[9px] text-gray-500 font-mono block mb-1">FORMULA {fIdx + 1}</span>
                          <span className="font-mono text-sm font-bold text-vip-gold select-all select-text leading-tight block py-1.5 my-1 bg-slate-950 border border-slate-800 rounded px-2">
                            {cleanMathNotation(f)}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-1 leading-snug">
                            {lang === 'amh' ? 'በብሔራዊ ፈተና ላይ በብዛት የሚጠየቅ ቀመር።' : 'High probability formula for Board-exam computations.'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-550 space-y-1">
                      <p className="text-sm font-semibold">No direct simulation triggers active</p>
                      <p className="text-xs">Select a physics or math unit in the sidebar to activate the sandbox toy simulators!</p>
                    </div>
                  )}
                </div>
              )}

              {/* General Cheat Sheet Quick Explainer Sidebar Box */}
              {(isPhysicsElectrostatics || isPhysicsMotion || isMathSequences) && (
                <div className="bg-slate-950/40 p-5 rounded-2xl border border-vip-charcoal/30 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold font-mono tracking-wider text-slate-100 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>BOARD-EXAM EXTRA CREDIT HINT</span>
                    </h5>
                    
                    <p className="text-xs text-slate-300 leading-relaxed text-justify">
                      {isPhysicsElectrostatics && (
                        lang === 'amh' 
                          ? 'የኤሌክትሮስታቲክስ ኃይል ከርቀት ስኩዌር (r²) ጋር በግልባጭ እንደሚመጣጠን ያስታውሱ። ርቀቱን በ2 እጥፍ ሲያሳድጉ ኃይሉ በ4 እጥፍ ይቀንሳል። ይህንን ህግ በመጠቀም ማትሪክ ላይ የሚመጡ የሒሳብ ጥያቄዎችን በቅጽበት መመለስ ይችላሉ።'
                          : 'As a prime board-exam secret, remember that the Coulomb force varies inversely with the square of the distance (r²). Doubling the distance drops the force to 1/4th. Check how the sliding graph adjusts above.'
                      )}
                      {isPhysicsMotion && (
                        lang === 'amh' 
                          ? 'ከፍተኛው ርቀት (Range) የሚገኘው በ45 ዲግሪ መወርወሪያ አንግል ላይ ነው። አንግሉን ከ45 በታች ወይም በላይ ሲያደርጉ አግድም ርቀቱ ይቀንሳል። ይህ በተደጋገሚ ብሔራዊ ማትሪክ ላይ የሚጠየቅ ወሳኝ ጽንሰ-ሀሳብ ነው።'
                          : 'Max range for any fired projectile is theoretically achieved at 45 degrees. Adjusting launch angles lower/higher reduces mathematical displacement. Test this behavior in the simulator immediately.'
                      )}
                      {isMathSequences && (
                        lang === 'amh' 
                          ? 'የአሪትሜቲክ ድምር (Sn) ለመፈለግ የመጀመሪያውን እና የመጨረሻውን አባላት ደምረው በ n/2 ማባዛት ቀላሉ መንገድ ነው። ይህ ፎርሙላ ለፈጣን የፈተና አሰራር እጅግ ጠቃሚ ነው።'
                          : 'Sₙ Arithmetic Series sum calculation can be done in 1 second by finding average of first and nth term, and multiplying by total count n. Perfect shortcut tip used by top-scoring ESSLCE students.'
                      )}
                    </p>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs leading-normal">
                      <span className="font-semibold block text-slate-200 mb-1">⚡ Board Shortcut Formulas:</span>
                      {isPhysicsElectrostatics && (
                        <ul className="list-disc list-inside space-y-1 font-mono text-[10px] text-vip-gold">
                          <li>F_new = F_old / k (in dielectrics)</li>
                          <li>E = F / q = k_e * q / r²</li>
                        </ul>
                      )}
                      {isPhysicsMotion && (
                        <ul className="list-disc list-inside space-y-1 font-mono text-[10px] text-sky-400">
                          <li>T_flight = 2 * u * sin(θ) / g</li>
                          <li>Equation of trajectory: quadratic parabola</li>
                        </ul>
                      )}
                      {isMathSequences && (
                        <ul className="list-disc list-inside space-y-1 font-mono text-[10px] text-emerald-400">
                          <li>d = (a_y - a_x) / (y - x) (Slope/Diff)</li>
                          <li>Arithmetic Mean = (a + b) / 2</li>
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <p className="text-[10px] text-gray-400 font-medium">
                      🛠️ Complete simulator settings reset?
                    </p>
                    <button
                      onClick={() => {
                        setSimCharge1(5);
                        setSimCharge2(-5);
                        setSimDistance(2);
                        setSimProgressionTermA1(2);
                        setSimProgressionDiffD(3);
                        setSimProgressionTermsN(8);
                        setSimProjVelocity(20);
                        setSimProjAngle(45);
                      }}
                      className="text-vip-gold hover:text-white underline font-mono text-[11px] font-bold tracking-tight bg-transparent border-0 cursor-pointer mt-1"
                    >
                      Reset Physics & Math Simulator
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* MODE 3: QUICK CHEAT SUMMARY BOOK */}
        {activeMode === 'cheat' && (
          <motion.div
            key="cheat-deck"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* Top Quick Intro */}
            <div className="bg-slate-950 p-4 border border-teal-500/20 rounded-2xl flex items-center justify-between text-left">
              <div>
                <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest font-mono">
                  📚 {lang === 'amh' ? 'ፈጣን የማትሪክ ቃላትና እውነታዎች' : 'Core High-Yield Knowledge Deck'}
                </h4>
                <p className="text-xs text-gray-450 mt-1">
                  {lang === 'amh' 
                    ? 'ወሳኝ ትርጓሜዎችና ብሔራዊ ፈተና ላይ የሚደጋገሙ ታዋቂ ቃላት ማጠቃለያ።'
                    : 'A beautifully condensed compilation of bold vocabulary terms, laws, and facts. Perfect for elite last-minute reviews.'}
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-teal-400 shrink-0 select-none animate-pulse" />
            </div>

            {/* Render Bento-grids of Bold lines extracted from the text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {processedBlocks
                .filter(b => b.raw.includes('**'))
                .map((b, idx) => (
                  <div 
                    key={idx} 
                    className="bg-slate-950 p-4 rounded-xl border border-vip-charcoal/40 hover:border-sky-400/30 hover:bg-slate-900 transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-mono font-bold text-gray-500">
                        <span>CORE KEYPOINT #{idx + 1}</span>
                        <span className="group-hover:text-sky-400 transition-colors uppercase">Fact</span>
                      </div>
                      <p className="text-xs text-slate-350 leading-relaxed text-left select-text">
                        {parseInlineContent(b.content)}
                      </p>
                    </div>
                  </div>
                ))
              }

              {processedBlocks.filter(b => b.raw.includes('**')).length === 0 && (
                <div className="col-span-2 py-10 bg-slate-950 border border-dashed border-slate-800 rounded-xl text-center text-gray-500">
                  <p className="text-xs font-semibold">Standard notes are fully loaded</p>
                  <p className="text-[10px] text-gray-500">Select another chapter to compile dynamic cheatcheet decks on the fly.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
