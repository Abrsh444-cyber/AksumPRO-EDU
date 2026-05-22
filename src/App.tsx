import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UNIVERSITIES as INITIAL_UNIVERSITIES, 
  MCQS, 
  FORMULAS, 
  GENERAL_STUDY_PILLS,
  CURRICULUM_UNITS
} from './data';
import WelcomeScreen from './components/WelcomeScreen';
import Navbar from './components/Navbar';
import StudyNotesRenderer from './components/StudyNotesRenderer';
import { StudentInfo, University, MCQQuestion, FormulaItem, CurriculumUnit } from './types';
import { 
  Sparkles, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  XSquare,
  XCircle, 
  X,
  AlertCircle, 
  Lock,
  Search, 
  PlusCircle, 
  Cpu, 
  GraduationCap, 
  Share2, 
  FileDown, 
  Send, 
  Clipboard, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  Check, 
  Settings, 
  Edit, 
  Save, 
  TrendingUp, 
  Award, 
  BookOpen, 
  ArrowRight,
  ChevronRight,
  Bell,
  User,
  Phone,
  School,
  Database,
  Download,
  Zap,
  Beaker,
  Calculator
} from 'lucide-react';

function FormulaSolver({ item, lang }: { item: any; lang: 'amh' | 'eng' }) {
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (item.id === 'form-01' || item.id === 'form-04') {
      setInputs({ x1: 1, y1: 2, x2: 4, y2: 6 });
    } else if (item.id === 'form-02') {
      setInputs({ n: 1, T: 300, V: 22.4 });
    } else if (item.id === 'form-03') {
      setInputs({ m: 10, v: 5 });
    } else if (item.id === 'form-05') {
      setInputs({ a: 1, b: -5, c: 6 });
    } else if (item.id === 'form-06') {
      setInputs({ m: 12, a: 3.5 });
    } else if (item.id === 'form-07') {
      setInputs({ f: 5e14 });
    } else if (item.id === 'form-08') {
      setInputs({ h3o: 1e-7 });
    } else if (item.id === 'form-09') {
      setInputs({ n: 2, V: 0.5 });
    }
  }, [item.id]);

  useEffect(() => {
    try {
      if (item.id === 'form-01' || item.id === 'form-04') {
        const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = inputs;
        if (item.id === 'form-01') {
          const run = x2 - x1;
          if (run === 0) {
            setResult(lang === 'amh' ? 'ያልተበየነ (ወደ ላይ ቀጥ ያለ)' : 'Undefined (Vertical Line)');
          } else {
            setResult(((y2 - y1) / run).toFixed(3));
          }
        } else {
          setResult(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(3));
        }
      } else if (item.id === 'form-02') {
        const { n = 0, T = 0, V = 0 } = inputs;
        if (V <= 0) {
          setResult(lang === 'amh' ? 'Volume > 0 መሆን አለበት' : 'Volume must be > 0');
        } else {
          setResult(((n * 0.0821 * T) / V).toFixed(3) + ' atm');
        }
      } else if (item.id === 'form-03') {
        const { m = 0, v = 0 } = inputs;
        setResult((0.5 * m * Math.pow(v, 2)).toFixed(2) + ' J');
      } else if (item.id === 'form-05') {
        const { a = 1, b = 0, c = 0 } = inputs;
        if (a === 0) {
          setResult(lang === 'amh' ? 'a = 0 መሆን የለበትም' : 'a cannot be 0');
          return;
        }
        const disc = b * b - 4 * a * c;
        if (disc < 0) {
          setResult(lang === 'amh' ? 'ይቅርታ ዕውነተኛ ያልሆኑ (Complex Roots)' : 'Complex/Imaginary Roots');
        } else {
          const r1 = (-b + Math.sqrt(disc)) / (2 * a);
          const r2 = (-b - Math.sqrt(disc)) / (2 * a);
          setResult(`x1 = ${r1.toFixed(3)}, x2 = ${r2.toFixed(3)}`);
        }
      } else if (item.id === 'form-06') {
        const { m = 0, a = 0 } = inputs;
        setResult((m * a).toFixed(2) + ' N');
      } else if (item.id === 'form-07') {
        const { f = 0 } = inputs;
        const h = 6.626e-34;
        setResult((h * f).toExponential(4) + ' J');
      } else if (item.id === 'form-08') {
        const { h3o = 1e-7 } = inputs;
        if (h3o <= 0) {
          setResult(lang === 'amh' ? 'ነፃ ሃይድሮኒየም > 0 መሆን አለበት' : 'H3O+ count must be > 0');
        } else {
          setResult((-Math.log10(h3o)).toFixed(2));
        }
      } else if (item.id === 'form-09') {
        const { n = 0, V = 0 } = inputs;
        if (V <= 0) {
          setResult(lang === 'amh' ? 'V > 0 መሆን አለበት' : 'Volume must be > 0');
        } else {
          setResult((n / V).toFixed(3) + ' M');
        }
      }
    } catch (e) {
      setResult('Error');
    }
  }, [inputs, item.id, lang]);

  const handleInputChange = (field: string, val: string) => {
    const num = parseFloat(val);
    setInputs(prev => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num
    }));
  };

  const labels: Record<string, string> = {
    x1: 'x1', y1: 'y1', x2: 'x2', y2: 'y2',
    n: lang === 'amh' ? 'ሞል (n)' : 'moles (n)',
    T: lang === 'amh' ? 'ኬልቪን (T, K)' : 'Temp (T, K)',
    V: lang === 'amh' ? 'ይዘት (V, L)' : 'Volume (V, L)',
    m: lang === 'amh' ? 'ክብደት (m, kg)' : 'mass (m, kg)',
    v: lang === 'amh' ? 'ፍጥነት (v, m/s)' : 'velocity (v, m/s)',
    a: 'a', b: 'b', c: 'c',
    h3o: lang === 'amh' ? 'ሃይድሮኒየም [H3O+]' : 'Hydronium [H3O+]',
    f: lang === 'amh' ? 'ፍሪኩዌንሲ (f, Hz)' : 'frequency (f/Hz)'
  };

  return (
    <div className="mt-4 p-4 bg-slate-950/70 border border-vip-gold/15 rounded-2xl space-y-3 animate-fade-in">
      <div className="text-[10px] text-vip-gold font-bold uppercase tracking-widest flex items-center justify-between">
        <span>⚡ {lang === 'amh' ? 'ሒሳብ ማስያ (Interactive Solver)' : 'Interactive Variable Solver'}</span>
        <span className="text-[9px] text-gray-500 font-mono">Real-Time</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.keys(inputs).map((key) => (
          <div key={key} className="space-y-1">
            <label className="text-[9px] text-gray-400 block font-mono">{labels[key] || key}</label>
            <input
              type="number"
              step="any"
              value={inputs[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-full bg-slate-900 border border-vip-charcoal/70 rounded-lg px-2 py-1 text-xs text-white font-mono"
            />
          </div>
        ))}
      </div>
      <div className="bg-vip-gold/10 border border-vip-gold/20 p-2.5 rounded-xl flex items-center justify-between text-xs">
        <span className="text-gray-400 uppercase tracking-wide font-extrabold text-[9px]">
          {lang === 'amh' ? 'የተሰላ ውጤት (Solution):' : 'Derived Answer:'}
        </span>
        <span className="font-mono font-black text-vip-gold tracking-wide">{result}</span>
      </div>
    </div>
  );
}

// ==========================================
// 10K+ BILINGUAL PROCEDURAL MATRIC EXAM GENERATOR
// ==========================================
function generateProceduralMCQs(subject: string, grade: number, count: number): MCQQuestion[] {
  const list: MCQQuestion[] = [];
  const timestamp = Date.now();

  for (let i = 0; i < count; i++) {
    const qId = `procedural-${subject.toLowerCase()}-g${grade}-${timestamp}-${i}`;
    let q: string = "";
    let qAmh: string = "";
    let options: string[] = [];
    let optionsAmh: string[] = [];
    let answerIndex: number = 0;
    let explanation: string = "";
    let explanationAmh: string = "";
    let year: string = "Diagnostic ESSLCE Model";
    let stream: "Natural Science" | "Social Science" | "Both" = "Both";

    // Randomize constants
    const c1 = Math.floor(Math.random() * 12) + 2;
    const c2 = Math.floor(Math.random() * 8) + 2;
    const c3 = Math.floor(Math.random() * 20) + 5;

    if (subject.toLowerCase().includes("math")) {
      stream = "Both";
      const mathType = i % 5;
      if (mathType === 0) {
        // Sequences
        const firstTerm = c1;
        const diff = c2;
        const n = 10;
        const ansVal = firstTerm + (n - 1) * diff;
        q = `Given an arithmetic sequence with first term $a_1 = ${firstTerm}$ and common difference $d = ${diff}$, find the value of the 10th term ($a_{10}$).`;
        qAmh = `የመጀመሪያው አባል $a_1 = ${firstTerm}$ እና የጋራ ልዩነት $d = ${diff}$ የሆነው የአሪትሜቲክ ቅደም ተከተል 10ኛ አባል ($a_{10}$) ስንት ነው?`;
        options = [
          `a) ${ansVal}`,
          `b) ${ansVal - 3}`,
          `c) ${ansVal + diff}`,
          `d) ${ansVal + 5}`
        ];
        optionsAmh = [
          `ሀ) ${ansVal}`,
          `ለ) ${ansVal - 3}`,
          `ሐ) ${ansVal + diff}`,
          `መ) ${ansVal + 5}`
        ];
        answerIndex = 0;
        explanation = `The n-th term of an AP is $a_n = a_1 + (n - 1)d$. Here, $a_{10} = ${firstTerm} + (10 - 1) \\times ${diff} = ${firstTerm} + 9 \\times ${diff} = ${ansVal}$.`;
        explanationAmh = `ማብራሪያ፡ የአሪትሜቲክ 10ኛ አባል ፎርሙላ $a_{10} = a_1 + 9d$ ነው። ዋጋዎችን ስንተካ፡ $a_{10} = ${firstTerm} + 9 \\times ${diff} = ${ansVal}$ ይሆናል፤ ስለዚህ ትክክለኛው መልስ ሀ) ነው።`;
      } else if (mathType === 1) {
        // Limits
        const limitVal = c1 + c2;
        q = `Evaluate the limit as x approaches ${c1} of the function $f(x) = \\frac{x^2 - ${c1 * c1}}{x - ${c1}}$.`;
         qAmh = `x ወደ ${c1} ሲቃረብ የ $f(x) = \\frac{x^2 - ${c1 * c1}}{x - ${c1}}$ ሊሚት ዋጋ ስንት ነው?`;
        options = [
          `a) ${limitVal - 2}`,
          `b) ${limitVal}`,
          `c) 0`,
          `d) Undefined`
        ];
        optionsAmh = [
          `ሀ) ${limitVal - 2}`,
          `ለ) ${limitVal}`,
          `ሐ) 0`,
          `መ) ያልተበየነ`
        ];
        answerIndex = 1;
        explanation = `By factoring, $\\frac{x^2 - ${c1 * c1}}{x - ${c1}} = \\frac{(x - ${c1})(x + ${c1})}{x - ${c1}} = x + ${c1}$. Taking the limit as x approaches ${c1} yields ${c1} + ${c1} = ${limitVal}.`;
        explanationAmh = `ማብራሪያ፡ ፖሊኖሚያሉን በፋክተር ስንዘረዝር $\\frac{(x - ${c1})(x + ${c1})}{x - ${c1}} = x + ${c1}$ ይሆናል። ሊሚቱን ወደ ${c1} ስናስጠጋ ደግሞ ${c1} + ${c1} = ${limitVal}$ እናገኛለን።`;
      } else if (mathType === 2) {
        // Determinant of a 2x2 Matrix
        const detVal = c1 * c3 - c2 * c2;
        q = `Find the determinant of the 2x2 matrix $A = \\begin{bmatrix} ${c1} & ${c2} \\\\ ${c2} & ${c3} \\end{bmatrix}$.`;
        qAmh = `የማትሪክስ $A = \\begin{bmatrix} ${c1} & ${c2} \\\\ ${c2} & ${c3} \\end{bmatrix}$ ዲተርሚናንት (Determinant) ዋጋ ስንት ነው?`;
        options = [
          `a) ${detVal + 4}`,
          `b) ${detVal}`,
          `c) ${detVal - 5}`,
          `d) 0`
        ];
        optionsAmh = [
          `ሀ) ${detVal + 4}`,
          `ለ) ${detVal}`,
          `ሐ) ${detVal - 5}`,
          `መ) 0`
        ];
        answerIndex = 1;
        explanation = `The determinant of a 2x2 matrix $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ is $ad - bc$. Here, det(A) = $(${c1} \\times ${c3}) - (${c2} \\times ${c2}) = ${c1 * c3} - ${c2 * c2} = ${detVal}$.`;
        explanationAmh = `ማብራሪያ፡ የ 2x2 ማትሪክስ ዲተርሚናንት $ad - bc$ ነው። ስለዚህ det(A) = $(${c1} \\times ${c3}) - (${c2} \\times ${c2}) = ${detVal}$ ይሆናል፤ መልሱ ለ) ነው።`;
      } else if (mathType === 3) {
        // Linear equation slope
        q = `What is the slope of the linear equation $3x - 4y = ${c1}$?`;
        qAmh = `የቀጥተኛ መስመር እኩልታ $3x - 4y = ${c1}$ ቁልቁለት (Slope) ስንት ነው?`;
        options = [
          `a) 3/4`,
          `b) -3/4`,
          `c) 3`,
          `d) 4/3`
        ];
        optionsAmh = [
          `ሀ) 3/4`,
          `ለ) -3/4`,
          `ሐ) 3`,
          `መ) 4/3`
        ];
        answerIndex = 0;
        explanation = `Rewrite the equation in slope-intercept form $y = mx + b$: $-4y = -3x + ${c1}$ which becomes $y = \\frac{3}{4}x - \\frac{${c1}}{4}$. The slope $m$ is $3/4$.`;
        explanationAmh = `ማብራሪያ፡ መስመሩን ወደ $y = mx + b$ ቅርጽ ስንቀይር $y = \\frac{3}{4}x - \\frac{${c1}}{4}$ እናገኛለን። ቁልቁለቱ (m) $\\frac{3}{4}$ ነው።`;
      } else {
        // Geometric Series
        const a1 = c1 * 3;
        const sumVal = (a1 / (1 - 1/3)).toFixed(1);
        q = `Find the sum of the convergent infinite geometric series with first term $a_1 = ${a1}$ and common ratio $r = 1/3$.`;
        qAmh = `የመጀመሪያው አባል $a_1 = ${a1}$ እና የጋራ ውድር $r = 1/3$ የሆነው የጂኦሜትሪክ ድምር $S_{\\infty}$ ስንት ነው?`;
        options = [
          `a) ${sumVal}`,
          `b) ${(a1 * 1.5).toFixed(1)}`,
          `c) ${(a1 * 2.5).toFixed(1)}`,
          `d) Converges to 0`
        ];
        optionsAmh = [
          `ሀ) ${sumVal}`,
          `ለ) ${(a1 * 1.5).toFixed(1)}`,
          `ሐ) ${(a1 * 2.5).toFixed(1)}`,
          `መ) 0 ላይ ይቆማል`
        ];
        answerIndex = 0;
        explanation = `The sum of an infinite converging geometric series is $S_{\\infty} = \\frac{a_1}{1 - r}$. Substituting the values yields $S_{\\infty} = \\frac{${a1}}{1 - 1/3} = \\frac{${a1}}{2/3} = ${sumVal}$.`;
        explanationAmh = `ማብራሪያ፡- ወሰን የሌለው ጂኦሜትሪክ ተከታታይ ድምር ፎርሙላ $S = \\frac{a_1}{1-r}$ ነው። ዋጋዎችን ስንተካ፡ $S = \\frac{${a1}}{2/3} = ${sumVal}$ እናገኛለን።`;
      }
    } else if (subject.toLowerCase().includes("phys")) {
      stream = "Natural Science";
      const physType = i % 4;
      if (physType === 0) {
        // Kinematics final speed
        const v0 = c1;
        const acc = c2;
        const time = 5;
        const vf = v0 + acc * time;
        q = `A body starts with an initial velocity of $${v0} \\text{ m/s}$ and accelerates at a constant rate of $${acc} \\text{ m/s}^2$ for $5 \\text{ seconds}$. What is its final velocity?`;
        qAmh = `አንድ አካል በሰከንድ $${v0} \\text{ ሜትር}$ መነሻ ፍጥነት ተነስቶ በሴኮንድ $${acc} \\text{ ሜ/ሴ}^2$ ቋሚ ማጣደፍ ቢያደርግ ከ5 ሴኮንድ በኋላ የመጨረሻ ፍጥነቱ ስንት ይሆናል?`;
        options = [
          `a) ${vf - 5} m/s`,
          `b) ${vf} m/s`,
          `c) ${vf + 3} m/s`,
          `d) ${(v0 * acc).toFixed(1)} m/s`
        ];
        optionsAmh = [
          `ሀ) ${vf - 5} ሜ/ሴ`,
          `ለ) ${vf} ሜ/ሴ`,
          `ሐ) ${vf + 3} ሜ/ሴ`,
          `መ) ${(v0 * acc).toFixed(1)} ሜ/ሴ`
        ];
        answerIndex = 1;
        explanation = `Using the kinematic equation $v_f = v_i + at$: $v_f = ${v0} + (${acc} \\times 5) = ${v0} + ${acc * 5} = ${vf} \\text{ m/s}$.`;
        explanationAmh = `ማብራሪያ፡ የመጨረሻ ፍጥነት ፎርሙላ $v_f = v_0 + at$ ነው። እሴቶችን ስናስገባ $v_f = ${v0} + (${acc} \\times 5) = ${vf} \\text{ ሜ/ሴ}$ እናገኛለን።`;
      } else if (physType === 1) {
        // Newton's Second Law
        const m = c2;
        const a = c1;
        const f = m * a;
        q = `Calculate the net force required to accelerate a $${m} \\text{ kg}$ object at a constant acceleration of $${a} \\text{ m/s}^2$.`;
        qAmh = `ክብደቱ $${m} \\text{ ኪሎግራም}$ የሆነን አካል በ $${a} \\text{ ሜ/ሴ}^2$ ለማጣደፍ የሚያስፈልገው ጠቅላላ ኃይል (Force) ስንት ነው?`;
        options = [
          `a) ${f + 2} N`,
          `b) ${f - 4} N`,
          `c) ${f} N`,
          `d) ${(f * 3.5).toFixed(1)} N`
        ];
        optionsAmh = [
          `ሀ) ${f + 2} N`,
          `ለ) ${f - 4} N`,
          `ሐ) ${f} N`,
          `መ) ${(f * 3.5).toFixed(1)} N`
        ];
        answerIndex = 2;
        explanation = `According to Newton's second law, Force = Mass $\\times$ Acceleration. Thus, $F = ${m} \\times ${a} = ${f} \\text{ Newtons}$.`;
        explanationAmh = `ማብራሪያ፡ የኒውተን ሁለተኛ ህግ $F = m \\times a$ (ኃይል = ግዝፈት $\\times$ ማጣደፍ) ነው። ስለዚህ $F = ${m} \\times ${a} = ${f} \\text{ ኒውተን}$ ይሆናል፤ መልሱ ሐ) ነው።`;
      } else if (physType === 2) {
        // Kinetic Energy
        const mass = c1 * 2;
        const velocity = 3;
        const ke = 0.5 * mass * velocity * velocity;
        q = `An object of mass $${mass} \\text{ kg}$ has a velocity of $3 \\text{ m/s}$. What is its kinetic energy?`;
        qAmh = `ክብደቱ $${mass} \\text{ ኪሎግራም}$ የሆነ አካል በሰከንድ $3 \\text{ ሜትር}$ ፍጥነት ቢጓዝ የእንቅስቃሴ ኃይሉ (Kinetic Energy) ስንት ነው?`;
        options = [
          `a) ${ke} Joules`,
          `b) ${ke * 2} Joules`,
          `c) ${ke - 12} Joules`,
          `d) 0`
        ];
        optionsAmh = [
          `ሀ) ${ke} ጁል`,
          `ለ) ${ke * 2} ጁል`,
          `ሐ) ${ke - 12} ጁል`,
          `መ) 0`
        ];
        answerIndex = 0;
        explanation = `Kinetic energy is calculated as $KE = \\frac{1}{2}mv^2$. Here, $KE = 0.5 \\times ${mass} \\times 3^2 = 0.5 \\times ${mass} \\times 9 = ${ke} \\text{ Joules}$.`;
        explanationAmh = `ማብራሪያ፡ የእንቅስቃሴ ኃይል (Kinetic Energy) ፎርሙላ $KE = \\frac{1}{2}mv^2$ ነው። $KE = 0.5 \\times ${mass} \\times 9 = ${ke} \\text{ ጁል}$ ይሆናል፤ መልሱ ሀ) ነው።`;
      } else {
        // Gravity Potential Energy
        const mass = c1;
        const h = 10;
        const pe = mass * 9.8 * h;
        q = `An object of mass $${mass} \\text{ kg}$ is lifted to a height of $10 \\text{ meters}$ above the ground. Determine its potential energy ($g = 9.8 \\text{ m/s}^2$).`;
        qAmh = `ግዝፈቱ $${mass} \\text{ ኪ.ግ}$ የሆነ አካል ከመሬት በላይ $10 \\text{ ሜትር}$ ከፍታ ላይ ቢቀመጥ የቁመት ኃይሉ (Potential Energy) ስንት ነው? ($g = 9.8$ ተጠቀም)`;
        options = [
          `a) ${(pe * 1.5).toFixed(1)} J`,
          `b) ${pe.toFixed(1)} J`,
          `c) ${(pe - 50).toFixed(1)} J`,
          `d) 0 J`
        ];
        optionsAmh = [
          `ሀ) ${(pe * 1.5).toFixed(1)} ጁል`,
          `ለ) ${pe.toFixed(1)} ጁል`,
          `ሐ) ${(pe - 50).toFixed(1)} ጁል`,
          `መ) 0 ጁል`
        ];
        answerIndex = 1;
        explanation = `Potential Energy is given by $PE = mgh = ${mass} \\times 9.8 \\times 10 = ${pe.toFixed(1)} \\text{ Joules}$.`;
        explanationAmh = `ማብራሪያ፡ የቁመት አቅም ኃይል ፎርሙላ $PE = mgh$ ነው። ዋጋዎችን ስንተካ፡ $PE = ${mass} \\times 9.8 \\times 10 = ${pe.toFixed(1)} \\text{ ጁል}$ ይሆናል፤ መልሱ ለ) ነው።`;
      }
    } else if (subject.toLowerCase().includes("chem")) {
      stream = "Natural Science";
      const chemType = i % 3;
      if (chemType === 0) {
        // Molarity
        const moles = c1;
        const vol = 2;
        const molarity = moles / vol;
        q = `Calculate the molarity of a solution created by dissolving $${moles} \\text{ moles}$ of solute in enough water to make $2.0 \\text{ Liters}$ of solution.`;
        qAmh = `$${moles} \\text{ ሞል}$ የሚሟሟ ንጥር በ $2.0 \\text{ ሊትር}$ ውህድ ውስጥ ቢሟሟ የውህዱ ሞላሪቲ (Molarity) ስንት ይሆናል?`;
        options = [
          `a) ${molarity.toFixed(2)} M`,
          `b) ${(molarity * 1.8).toFixed(2)} M`,
          `c) ${(molarity * 0.5).toFixed(2)} M`,
          `d) ${(molarity + 1.2).toFixed(2)} M`
        ];
        optionsAmh = [
          `ሀ) ${molarity.toFixed(2)} M`,
          `ለ) ${(molarity * 1.8).toFixed(2)} M`,
          `ሐ) ${(molarity * 0.5).toFixed(2)} M`,
          `መ) ${(molarity + 1.2).toFixed(2)} M`
        ];
        answerIndex = 0;
        explanation = `Molarity is defined as moles of solute divided by Liters of solution. $M = \\frac{${moles} \\text{ moles}}{2.0 \\text{ L}} = ${molarity.toFixed(2)} \\text{ M}$.`;
        explanationAmh = `ማብራሪያ፡ ሞላሪቲ ማለት የአንድ ውህድ ቁጥር ሞል ሲካፈል ለሊትር ይዘቱ ($M = n / V$) ነው። እዚህ $M = ${moles} / 2.0 = ${molarity.toFixed(2)} \\text{ M}$ ይሆናል፤ መልሱ ሀ) ነው።`;
      } else if (chemType === 1) {
        // pH from H3O+
        const expo = c1 > 10 ? 7 : c1;
        q = `Determine the pH of an aqueous solution with a hydronium ion concentration $[H_3O^+] = 1.0 \\times 10^{-${expo}} \\text{ M}$.`;
        qAmh = `የሃይድሮኒየም አዮን ክምችት $[H_3O^+] = 1.0 \\times 10^{-${expo}} \\text{ M}$ የሆነው የውሃማ ስብስብ ፒኤች (pH) ዋጋ ስንት ነው?`;
        options = [
          `a) ${14 - expo}`,
          `b) ${expo}`,
          `c) ${expo - 2.5}`,
          `d) 7.0 (Neutral)`
        ];
        optionsAmh = [
          `ሀ) ${14 - expo}`,
          `ለ) ${expo}`,
          `ሐ) ${expo - 2.5}`,
          `መ) 7.0 (ገለልተኛ)`
        ];
        answerIndex = 1;
        explanation = `pH is the negative logarithm of the hydronium concentration: $pH = -\\log[H_3O^+] = -\\log(1.0 \\times 10^{-${expo}}) = ${expo}$.`;
        explanationAmh = `ማብራሪያ፡ ፒኤች (pH) የሚሰላው በአዮን ክምችቱ ኔጋቲቭ ሌጋሪዝም ሲሆን $pH = -\\log(10^{-${expo}}) = ${expo}$ ይሆናል። መልሱ ለ) ነው።`;
      } else {
        // Ideal Gas
        const n = 2;
        const t = 300;
        const v = c1;
        const p = (n * 0.0821 * t) / v;
        q = `A $2.0 \\text{ mole}$ sample of ideal gas is kept in a fixed container of volume $${v} \\text{ L}$ at a temperature of $300 \\text{ K}$. What is the pressure of the gas? ($R = 0.0821 \\text{ L}\\cdot\\text{atm}/\\text{mol}\\cdot\\text{K}$)`;
        qAmh = `$2.0 \\text{ ሞል}$ መጠን ያለው ጋዝ በ $${v} \\text{ ሊትር}$ ጠርሙስ ውስጥ $300 \\text{ K}$ ሙቀት ላይ ተቀምጧል። የጋዙን ግፊት (Pressure) አስላ?`;
        options = [
          `a) ${p.toFixed(2)} atm`,
          `b) ${(p * 1.5).toFixed(2)} atm`,
          `c) ${(p * 0.6).toFixed(2)} atm`,
          `d) 1.00 atm`
        ];
        optionsAmh = [
          `ሀ) ${p.toFixed(2)} atm`,
          `ለ) ${(p * 1.5).toFixed(2)} atm`,
          `ሐ) ${(p * 0.6).toFixed(2)} atm`,
          `መ) 1.00 atm`
        ];
        answerIndex = 0;
        explanation = `Using the ideal gas equation $PV = nRT \\Rightarrow P = \\frac{nRT}{V}$: $P = \\frac{2.0 \\times 0.0821 \\times 300}{${v}} = ${p.toFixed(2)} \\text{ atm}$.`;
        explanationAmh = `ማብራሪያ፡ የጋዝ እኩልታ $PV = nRT$ ሲሆን ግፊት $P = nRT/V$ ነው። $P = 2.0 \\times 0.0821 \\times 300 / ${v} = ${p.toFixed(2)} \\text{ atm}$ ይሆናል።`;
      }
    } else if (subject.toLowerCase().includes("biol")) {
      stream = "Natural Science";
      const bioType = i % 3;
      if (bioType === 0) {
        q = "Which of the following organic cell organelles is primarily responsible for synthesis of ATP (Cellular respiration)?";
        qAmh = "ከሚከተሉት የሴል ክፍሎች ውስጥ ዋነኛው የኤቲፒ (ATP - የሴል የመተንፈስ ኃይል) ማምረቻ የቱ ነው?";
        options = ["a) Golgi Apparatus", "b) Mitochondria", "c) Lysosomes", "d) Ribosomes"];
        optionsAmh = ["ሀ) ጎልጂ አፓራተስ", "ለ) ማይቶኮንድሪያ", "ሐ) ላይሶዞሞች", "መ) ራይቦዞሞች"];
        answerIndex = 1;
        explanation = "Mitochondria are known as the powerhouses of the cell because they execute cellular aerobic respiration to synthesize ATP (adenosine triphosphate) which fuels cellular operations.";
        explanationAmh = "ማብራሪያ፡- ማይቶኮንድሪያ (Mitochondria) የሴሉ የሃይል ማመንጫ ተብለው ይጠራሉ። በኦክስጅን በመጠቀም ኤቲፒ ያመርታሉ።";
      } else if (bioType === 1) {
        q = "In genetics, if a heterozygous round pea plant (Rr) is selfed, what is the expected phenotypic ratio of Round to Wrinkled seeds in the offspring?";
        qAmh = "በጄኔቲክስ ሁለገብ የሆነ የክብ አተር ተክል (Rr) ራሱን በራሱ ቢያዳቅል በደቀናቸው ላይ ክብ ከኮማታዘር ጋር የሚኖረው መጠን እንዴት ይሆናል?";
        options = ["a) 3:1", "b) 1:1", "c) 9:3:3:1", "d) 1:2:1"];
        optionsAmh = ["ሀ) 3:1", "ለ) 1:1", "ሐ) 9:3:3:1", "መ) 1:2:1"];
        answerIndex = 0;
        explanation = "A monohybrid cross of Rr x Rr produces offspring genotypes: 1 RR (round), 2 Rr (round), and 1 rr (wrinkled). Thus, the phenotypic ratio is 3 round to 1 wrinkled (3:1).";
        explanationAmh = "ማብራሪያ፡- Rr ከ Rr ጋር ሲዳቀል 1 RR, 2 Rr, እና 1 rr ይሰጣል። ክብ የሆኑት 3 ሲሆኑ ኮማታ የሆነው 1 ነው (3:1)።";
      } else {
        q = "Which blood vessel type carries highly oxygenated blood away from the heart to general system organs?";
        qAmh = "ኦክስጅን የበለጸገበትን ደም ከልብ ወደተለያዩ የሰውነት ክፍሎች የሚወስደው የደም ቧንቧ የቱ ነው?";
        options = ["a) Veins", "b) Capillaries", "c) Arteries", "d) Venules"];
        optionsAmh = ["ሀ) ቪን (ደም ቧንቧ)", "ለ) ካፒላሪስ", "ሐ) አርተሪ (ደም ወሳጅ)", "መ) ቬኑለስ"];
        answerIndex = 2;
        explanation = "Arteries carry oxygen-rich blood away from the heart to systemic capillaries (with the exception of pulmonary arteries).";
        explanationAmh = "ማብራሪያ፡- አርተሪዎች (Arteries - ደም ወሳጅ ቧንቧዎች) ኦክስጅን ያለውን ቀይ ደም ከልብ ወደ መላ ሰውነት ያጓጉዛሉ።";
      }
    } else if (subject.toLowerCase().includes("hist")) {
      stream = "Social Science";
      const histType = i % 3;
      if (histType === 0) {
        q = "Under which legendary Aksumite leader was Christianity adopted as the official state religion of Ethiopia in the 4th century AD?";
        qAmh = "በ4ኛው ክፍለ ዘመን ክርስትናን የኢትዮጵያ መንግሥት ይፋዊ ሃይማኖት አድርጎ የተቀበለው ታዋቂው የአክሱም ንጉሥ ማን ይባላል?";
        options = ["a) King Kaleb", "b) King Ezana", "c) Emperor Zara Yaqob", "d) King Armah"];
        optionsAmh = ["ሀ) ንጉስ ካሌብ", "ለ) ንጉስ ኢዛና", "ሐ) አፄ ዘርአ ያዕቆብ", "መ) ንጉስ አርማህ"];
        answerIndex = 1;
        explanation = "King Ezana converted to Christianity in 333/340 AD, introduced by Saint Frumentius (Abba Selama). Under his reign, Aksum minted coins marked with the Holy Cross.";
        explanationAmh = "ማብራሪያ፡- ንጉስ ኢዛና በ4ኛው መቶ ክፍለ ዘመን በአባ ሰላማ (ፍሬምናጦስ) አስተማሪነት ክርስትናን የመንግስት ሃይማኖት አደረጉ።";
      } else if (histType === 1) {
        q = "In which historical Ethiopian calendar year did the decisive Battle of Adwa take place against Italian invaders?";
        qAmh = "ታዋቂው የዓድዋ ድል በኢጣሊያ ወራሪዎች ላይ የተቀዳጀነው በየትኛው ዓመተ ምሕረት (በኢትዮጵያ አቆጣጠር) ነው?";
        options = [
          "a) 1888 E.C. (March 1, 1896 G.C.)",
          "b) 1896 E.C.",
          "c) 1928 E.C.",
          "d) 1872 E.C."
        ];
        optionsAmh = [
          "ሀ) 1888 ዓ.ም (የካቲት 23)",
          "ለ) 1896 ዓ.ም",
          "ሐ) 1928 ዓ.ም",
          "መ) 1872 ዓ.ም"
        ];
        answerIndex = 0;
        explanation = "The Battle of Adwa was won on Yekatit 23, 1888 Ethiopian Calendar (March 1, 1896 Gregorial Calendar), led by Emperor Menelik II and Empress Taytu Betul.";
        explanationAmh = "ማብራሪያ፡- የዓድዋ ጦርነት ተካሂዶ የኢትዮጵያ ድል የተመዘገበው የካቲት 23 ቀን 1888 ዓ.ም ነው።";
      } else {
        q = "Who was the architect emperor of the Gondarine period responsible for the majestic royal castles of Fasil Ghebbi built in 1636?";
        qAmh = "በየነጋሲው የተለያዩ ድንቅ ግንቦችን በመገንባት በ1636 የጎንደር ፋሲል ግቢን የቆረቆሩት ዋናው ንጉሠ ነገሥት ማን ናቸው?";
        options = ["a) Emperor Yohannes I", "b) Emperor Fasilides", "c) Emperor Iyasu I", "d) Emperor Bakaffa"];
        optionsAmh = ["ሀ) አፄ ዮሐንስ ቀዳማዊ", "ለ) አፄ ፋሲለደስ", "ሐ) አፄ ኢያሱ ቀዳማዊ", "መ) አፄ በካፋ"];
        answerIndex = 1;
        explanation = "Emperor Fasilides declared Gondar the permanent administrative capital of the Ethiopian empire in 1636 and laid down the historic Fasil Castle complex.";
        explanationAmh = "ማብራሪያ፡- አጼ ፋሲለደስ በጎንደር የመንግስታቸውን መቀመጫ አድርገው አስደናቂውን ፋሲል ግቢ በመስራት ባለውለታ ሆኑ።";
      }
    } else if (subject.toLowerCase().includes("geog")) {
      stream = "Social Science";
      const geogType = i % 3;
      if (geogType === 0) {
        q = "If a topographical map has a scale representation of 1:50,000, what actual real-world distance is represented by a 4-centimeter line drawn on the map?";
        qAmh = "የካርታው ስኬል (Scale) 1:50,000 ቢሆን፣ በካርታው ላይ 4 ሴንቲሜትር የተሰመረው መስመር በመሬት ላይ ያለውን ስንት እውነተኛ ርቀት ይወክላል?";
        options = ["a) 2 kilometers", "b) 20 kilometers", "c) 5 kilometers", "d) 200 meters"];
        optionsAmh = ["ሀ) 2 ኪሎሜትር", "ለ) 20 ኪሎሜትር", "ሐ) 5 ኪሎሜትር", "መ) 200 ሜትር"];
        answerIndex = 0;
        explanation = "At a scale of 1:50,000, $1\\text{ cm} = 50,000\\text{ cm} = 500\\text{ meters}$. Thus, $4\\text{ cm}$ on the map represents $4 \\times 500 = 2000\\text{ meters} = 2\\text{ kilometers}$ on the ground.";
        explanationAmh = "ማብራሪያ፡- ስኬሉ 1:50,000 ማለት 1 ሴ.ሜ 50,000 ሴ.ሜ (ወይም 500 ሜትር) ማለት ነው። ስለዚህ 4 ሴ.ሜ ስናባዛ ከ 500 ሜትር ጋር 2000 ሜትር (2 ኪሎሜትር) እናገኛለን።";
      } else if (geogType === 1) {
        q = "Which of the following tectonic water bodies is the largest and deepest natural freshwater lake located within the Ethiopian Rift Valley basin?";
        qAmh = "በኢትዮጵያ ስምጥ ሸለቆ ውስጥ ከሚገኙት ተፈጥሮአዊ ሐይቆች መካከል ትልቁና ጥልቀት ያለው የንጹህ ውሃ ሐይቅ የቱ ነው?";
        options = ["a) Lake Tana", "b) Lake Abaya", "c) Lake Awassa", "d) Lake Chamo"];
        optionsAmh = ["ሀ) ጣና ሐይቅ (ስምጥ ሸለቆ ውጪ)", "ለ) አባያ ሐይቅ", "ሐ) አዋሳ ሐይቅ", "መ) ጫሞ ሐይቅ"];
        answerIndex = 1;
        explanation = "Lake Abaya is the largest lake inside the Ethiopian Rift Valley basin with a surface area of over 1,160 square kilometers. Lake Tana is the largest lake in Ethiopia but lies on the highlands outside the Rift Valley.";
        explanationAmh = "ማብራሪያ፡- በአጠቃላይ ጣና ትልቁ ቢሆንም፣ በስምጥ ሸለቆ ባሲን ውስጥ የሚገኘው ትልቁ ሃይቅ አባያ ሃይቅ ነው።";
      } else {
        q = "What is the primary cause for the majestic, rugged topography of Ethiopia, featuring deep gorges, high peaks, and rolling plateaus?";
        qAmh = "ለኢትዮጵያ ተራራማ፣ ወጣ ገባ እና ታላላቅ ሸለቆዎች ላሏት መልክዓ-ምድር ዋነኛው ተፈጥሮአዊ ምክንያት ምንድን ነው?";
        options = [
          "a) Severe wind erosion over billions of years",
          "b) Intense volcanic activities and block faults in the Cenozoic era",
          "c) Desertification",
          "d) Ocean tides"
        ];
        optionsAmh = [
          "ሀ) የንፋስ መሸርሸር",
          "ለ) በሴኖዞይክ ዘመን የነበሩ የፈነዱ እሳተ-ገሞራዎችና የስምጥ ስምጥ መፈጠር (Eruption/Faulting)",
          "ሐ) የበረሀማነት መስፋፋት",
          "መ) የባህር ሞገድ ተጽዕኖ"
        ];
        answerIndex = 1;
        explanation = "The majestic, rugged topography is a direct product of the Cenozoic era's massive basaltic volcanic lava flows, coupled with subsequently shaped uplift and extreme deep river dissection (gorge erosion).";
        explanationAmh = "ማብራሪያ፡- የኢትዮጵያ ወጣገባና ውብ መልክዓ ምድር የተፈጠረው በሴኖዞይክ ዘመን (Cenozoic) የነበሩ እሳተ ገሞራዎች በረጩት ላቫና በስምጥ መከሰት ምክንያት ነው።";
      }
    } else {
      // English / Syntax General
      stream = "Both";
      const engType = i % 2;
      if (engType === 0) {
        q = "By the time the secondary school principal arrives at our study hall tomorrow evening, all elite VIP students ________ the full model exam.";
        qAmh = "የርዕሰ መምህሩ ነገ ማታ ወደ ጥናት ክፍሉ በሚመጡበት ሰዓት ተማሪዎቹ በሙሉ የሞዴል ፈተናውን _________።";
        options = [
          "a) will have finished",
          "b) are finishing",
          "c) finished",
          "d) would finish"
        ];
        optionsAmh = [
          "ሀ) will have finished",
          "ለ) are finishing",
          "ሐ) finished",
          "መ) would finish"
        ];
        answerIndex = 0;
        explanation = "The phrase 'By the time...' referencing a future point ('tomorrow evening') requires the Future Perfect tense ('will have + past participle') because the action is expected to be fully completed before that reference point.";
        explanationAmh = "ማብራሪያ፡- 'By the time...' ከነገ ማታ ጋር ሲመጣ የወደፊቱን የድርጊት መፈጸም ቀድሞ የሚገልጽ 'Future Perfect' (will have + v3) ይፈልጋል። ስለሆነም ሀ) ትክክለኛ ምርጫ ነው።";
      } else {
        q = "Choose the correct indirect speech form of: 'If you study hard, you will pass,' Naol said to Ezra.";
        qAmh = "'በትጋት ካጠናህ ፈተናውን ታልፋለህ' ሲል ናኦል ለዕዝራ የተናገረውን ንግግር ወደ ቀጥተኛ ያልሆነ (Indirect speech) ቀይር።";
        options = [
          "a) Naol told Ezra that if he studied hard, he would pass.",
          "b) Naol tells Ezra if he study hard, he will pass.",
          "c) Naol asked Ezra if he had studied hard and passed.",
          "d) Naol said that Ezra studies hard to pass."
        ];
        optionsAmh = [
          "ሀ) Naol told Ezra that if he studied hard, he would pass.",
          "ለ) Naol tells Ezra if he study hard, he will pass.",
          "ሐ) Naol asked Ezra if he had studied hard and passed.",
          "መ) Naol said that Ezra studies hard to pass."
        ];
        answerIndex = 0;
        explanation = "When shifting from direct to reported speech, the present conditional clauses backshift: 'study' (present simple) becomes 'studied' (past simple), and 'will' becomes 'would'.";
        explanationAmh = "ማብራሪያ፡- በቀጥተኛ ያልሆነ ንግግር ህግ መሠረት የአሁኑ ቴንስ (study) ወደ ያለፈ (studied) እና 'will' ደግሞ ወደ 'would' ይቀየራል።";
      }
    }

    list.push({
      id: qId,
      subject,
      grade,
      question: q,
      questionAmharic: qAmh,
      options,
      optionsAmharic: optionsAmh,
      answerIndex,
      explanation,
      explanationAmharic: explanationAmh,
      year: "2018 EESSLCE Board Prep",
      stream
    });
  }

  return list;
}

function generateProceduralNotes(subject: string, grade: number, count: number): CurriculumUnit[] {
  const list: CurriculumUnit[] = [];
  const timestamp = Date.now();

  const notesTemplates = [
    {
      num: 3,
      title: "Advanced Electrostatics & Electric Fields",
      titleAmh: "የላቀ ኤሌክትሮስታቲክስ እና ኩረንት",
      notes: `### ⚡ Unit 3: Advanced Electrostatics & Field Theory Notes
Electrostatics is the fundamental branch of physics exploring electric charges at rest, their spatial field distributions, and electric potentials.

#### 1. Coulomb's Quantitative Law
The electrostatic force of attraction or repulsion between two point charges ($q_1$ and $q_2$) is directly proportional to the product of their magnitudes and inversely proportional to the square of the distance ($r$) separating them.
$$F = k_e \\frac{|q_1 q_2|}{r^2}$$
- **Proportionality Constant ($k_e$):** Value is $k_e \\approx 8.99 \\times 10^9 \\text{ N m}^2/\\text{C}^2$. It is also written as $1 / (4 \\pi \\epsilon_0)$ where $\\epsilon_0$ is the permittivity of free space.
- **Inverse Square Relationship:** If you double the distance ($2r$), the interactive force drops by a factor of 4 ($1/4 F^2$). If you halve the distance, the force increases fourfold.
- **Superposition Principle:** The net electrostatic force acting on a target charge due to multiple surrounding charges is the vector sum of all individual contributions.

#### 2. Electric Field Intensity ($E$) and Flux
An electric field represents the spatial vector field surrounding any charged body. The field strength at any point is defined quantitatively as force per unit test charge:
$$E = \\frac{F}{q} = k_e \\frac{Q}{r^2}$$
- **Units & Vector Behavior:** Measured in Newtons per Coulomb (N/C) or Volts per meter (V/m). Field vectors point radially outward from positive source charges and inward toward negative source charges.
- **Conductive Sphere Shell Rules:** 
  1. The electric field inside any hollow conductive sphere is **strictly zero** ($E = 0$) regardless of the net charge on the exterior shell.
  2. The electric potential inside and on the surface is constant and non-zero: $V = k_e Q/R$.
  3. The electric field immediately outside acts as if the entire charge were concentrated at the exact center.` ,
      notesAmh: `### ⚡ ምዕራፍ 3፡ የኤሌክትሮስታቲክስ እና የኤሌክትሪክ መስክ ጥልቅ ማስታወሻ
ኤሌክትሮስታቲክስ ማለት የማይንቀሳቀሱ (Static) የኤሌክትሪክ ቻርጆችን፣ በመካከላቸው የሚፈጠርን ጉልበት እና የኤሌክትሪክ መስክን የሚያጠና የፊዚክስ ዘርፍ ነው።

#### 1. የኩሎምብ ዝርዝር ህግ (Coulomb's Law)
በሁለት ነጥብ ቻርጆች ($q_1$ እና $q_2$) መሃል ያለው የመስህብ ወይም የመገፋፋት ኃይል በቻርጆቹ ብዜት አሃዝ አዎንታዊ ሲሆን በምድር ርቀታቸው ($r^2$) ስኩዌር በተገላቢጦሽ ይከፈላል።
$$F = k_e \\frac{|q_1 q_2|}{r^2}$$
- **የኤሌክትሮስታቲክ ኮንስታንት ($k_e$):** ዋጋው $\\approx 8.99 \\times 10^9 \\text{ N m}^2/\\text{C}^2$ ነው።
- **ደረጃ በደረጃ ምሳሌ:** በሁለት ቻርጆች መካከል ያለውን ርቀት በእጥፍ ብንጨምረው ($2r$) በመካከላቸው ያለው የመሳሳብ ኃይል በአራት እጥፍ ይቀንሳል። ርቀቱን በግማሽ ብንቀንሰው ኃይሉ በአራት እጥፍ ያድጋል።

#### 2. የኤሌክትሪክ መስክ መጠን (Electric Field - E)
አንድ ነጥብ ያለው ቻርጅ በአካባቢው የሚያሳድረው የኃይል ተጽዕኖ መጠን በፈተና አሃድ ሲለካ፡
$$E = k_e \\frac{Q}{r^2}$$
- **መለኪያ አሃድ:** ኒውተን በኩሎምብ (N/C) ወይም ቮልት በሜትር (V/m) ነው። የቬክተሩ አቅጣጫ ከአዎንታዊ (+) ቻርጅ ወደ ውጭ ሲሆን ወደ አሉታዊ (-) ቻርጅ ደግሞ ወደ ውስጥ ነው።
- **የክብ ተቆጣጣሪዎች እውነታ (Conductive Shell Rules):** 
  1. በማንኛውም ክፍት ክብ ተቆጣጣሪ (Hollow conductor) ውስጥ ያለው የኤሌክትሪክ መስክ መጠን **ሁልጊዜ ዜሮ (0)** ነው።
  2. በተቃራኒው በክቡ ውጫዊ አካል ላይ ያለው ፖቴንሻል ግን ቋሚና ከዜሮ የተለየ ነው።`
    },
    {
      num: 4,
      title: "Chemical Equilibrium & Kinetics",
      titleAmh: "ኬሚካል ኢኩሊብሪየም እና ኪነቲክስ",
      notes: `### 🧪 Unit 4: Chemical Equilibrium & Dynamic Systems Notes
Symmetric chemical reactions in closed containers are reversible, meaning reactants convert to products, and products simultaneously recombine back.

#### 1. The Equilibrium Constant ($K_c$ and $K_p$)
For a generalized reversible reaction taking place at constant temperature:
$$aA + bB \\rightleftharpoons cC + dD$$
The dynamic equilibrium state is mathematically parameterized through the law of mass action:
$$K_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b}$$
- **Deciphering Constant Magnitudes ($K_c$):**
  - If $K_c \\gg 1$ (e.g., $> 10^3$), the forward reaction is near completion, and **products are highly favored** at equilibrium.
  - If $K_c \\ll 1$ (e.g., $< 10^{-3}$), the reaction barely proceeds, and **reactants are highly favored** at equilibrium.
- **Dynamic Balance:** Reaction never actually stops. Reactants convert to products at the exact same velocity that products reform reactants, keeping net concentrations perfectly flat over time.

#### 2. Le Chatelier's Balancing Principle
If a dynamic equilibrium system is subjected to a external stress (changes in concentration, temperature, or pressure), the system shifts its position to counteract that stress.
- **Concentration Changes:** Adding reactants or removing products shifts the reaction to the **forward (right)** side. Adding products or removing reactants shifts it **backward (left)**.
- **Pressure Changes:** Increasing pressure (by reducing volume) shifts the equilibrium to the side with the **fewer number of gaseous moles**. Decreasing pressure shifts it to the side with more moles.
- **Temperature Changes:** 
  - For **Exothermic** reactions (releasing heat): Increasing temperature shifts the system to the **left**.
  - For **Endothermic** reactions (absorbing heat): Increasing temperature shifts the system to the **right**.` ,
      notesAmh: `### 🧪 ምዕራፍ 4፡ የኬሚካል ሚዛን እና ኬሚካላዊ ፍጥነት (Chemical Equilibrium)
ኬሚካል ኢኩሊብሪየም ማለት በዝግ ዕቃ ውስጥ የአንድ ኬሚካላዊ ምላሽ ሂደቶች ወደፊትና ወደኋላ እኩል ፍጥነት ላይ ሲደርሱ የሚፈጠር ተለዋዋጭ ሚዛን ነው።

#### 1. የኢኩሊብሪየም ኮንስታንት እኩልታ ($K_c$)
$$aA + bB \\rightleftharpoons cC + dD$$
ለሚከተለው አጠቃላይ ምላሽ የኢኩሊብሪየም ኮንስታንት ቀመር፡
$$K_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b}$$
- **የቆሚ እሴት ትንተና ($K_c$):**
  - $K_c \\gg 1$ (ከ 1 እጅግ በጣም የሚበልጥ) ከሆነ ምርቱ (Products) በከፍተኛ ሁኔታ የበላይነት ይይዛል።
  - $K_c \\ll 1$ (ከ 1 ያነሰ) ከሆነ ደግሞ መነሻ ንጥረ ነገሮቹ (Reactants) በብዛት ይገኛሉ።

#### 2. የለ ሻተሊየር መርሕ (Le Chatelier's Principle)
ሚዛን ላይ ያለ ኬሚካላዊ ስርዓት ላይ ጫና (የሙቀት፣ የፒኤች፣ የኮንሰንትሬሽን ወይም የፒሊዩም ለውጥ) ከውጭ ሲያርፍበት፣ ስርዓቱ ያንን ጫና ለመቀነስ ወደተቃራኒው አቅጣጫ ይሸሻል።
- **የሙቀት መጠን ተጽዕኖ:** 
  - ለሙቀት ሰጪ ምላሾች (Exothermic)፡ ሙቀት መጨመር ምላሹን ወደኋላ (reactant) ይመልሰዋል።
  - ለሙቀት ተቀባይ ምላሾች (Endothermic)፡ ሙቀት መጨመር ምላሹን ወደፊት (product) ይገፋዋል።
- **የፕሬሸር ተጽዕኖ:** ፕሬሸር መጨመር (ቮሊዩም በመቀነስ) ምላሹ አነስተኛ የጋዝ ሞል (gaseous moles) ወዳለው ወገን እንዲያዘነብል ያደርጋል።`
    },
    {
      num: 5,
      title: "Cellular Division & Molecular Genetics",
      titleAmh: "የሴል ክፍፍል እና ሞለኪዩላር ጄኔቲክስ",
      notes: `### 🧬 Unit 5: Molecular Genetics & Gene Technology Notes
Deoxyribonucleic acid (DNA) is the biological double-helix macromolecule carrying the genetic material for cellular execution, replication, and inheritance.

#### 1. DNA Semi-Conservative Replication
Replication is the highly accurate biological duplicate process occurring during the S-phase of the cell cycle.
- **Helicase:** The motor enzyme that breaks hydrogen bonds to unzip the double helix structure, forming replication forks.
- **DNA Polymerase:** Catalyzes nucleotide insertion in the **5' to 3' direction** only. It reads the parent strand and adds structural complimentary bases.
- **Semi-Conservative Concept:** Every new DNA molecule contains one original parent strand and one synthesized daughter strand, preventing inheritance errors.

#### 2. Central Dogma: Transcription & Translation
The transfer of genetic information proceeds from DNA to RNA and finally to functional proteins.
1. **Transcription (Nucleus):** RNA Polymerase copies one target DNA gene locus into messenger RNA (mRNA). Splicing removes non-coding introns.
2. **Translation (Ribosome):** mRNA travels to the cytoplasm. Ribosomes read mRNA triplet codons. Transfer RNA (tRNA) anticodons carry corresponding amino acids, stitching polypeptide chains together to assemble biological proteins.` ,
      notesAmh: `### 🧬 ምዕራፍ 5፡ የዘር ውርስ ጥናት እና ሞለኪውላር ጄኔቲክስ
ዲኤንኤ (DNA) በሁሉም ሕይወት ባላቸው አካላት ውስጥ የሚገኝ የዘር መረጃዎችን በጥንቃቄ ተሸክሞ ለተተኪው አካል የሚያስተላልፍ መሠረታዊ ሞለኪውል ነው።

#### 1. የዲኤንኤ ራስን ማባዛት ሂደት (DNA Replication)
ይህ ሂደት በሴል ዑደት (S-phase) ወቅት የሚካሄድ ሲሆን አንድን ዲኤንኤ ወደ ሁለት ተመሳሳይ ቅጂዎች የሚቀይርበት ነው።
- **Helicase ኤንዛይም:** የዲኤንኤ ባለ ሁለት ሰንሰለት ሃይድሮጅን ቦንድ በመስበር ሰንሰለቱን የሚከፍት።
- **DNA Polymerase:** አዳዲስ ኑክሊዮታይዶችን 5' ወደ 3' አቅጣጫ ብቻ በመጨመር አዲሱን ሰንሰለት የሚገነባ ዋና ኬሚካል ነው።
- **Semi-Conservative:** እያንዳንዱ ጥንድ አዲስ ተባዝቶ የወጣ ዲኤንኤ አንድ የቆየ ወላጅ ሰንሰለት እና አንድ አዲስ የተሰራ ሰንሰለት ይይዛል።

#### 2. የፕሮቲን ምርት ሂደት (Transcription & Translation)
ሴሎች የዘር መረጃን ተጠቅመው ፕሮቲን የሚሰሩት በሁለት ዋና ዋና ደረጃዎች ነው፡
1. **ትራንስክሪፕሽን (Transcription):** በሴል ኒዩክሊየስ ውስጥ ዲኤንኤ ተነቦ ወደ ኤምአርኤንኤ (mRNA) ቅጂ የሚገለበጥበት ሂደት።
2. **ትራንስሌሽን (Translation):** ኤምአርኤንኤ ወደ ራይቦዞም በመሄድ ኮዶቹ በአሚኖ አሲዶች ተተርጉመው የፕሮቲን ሰንሰለት የሚገነቡበት የመጨረሻ ደረጃ ነው።`
    }
  ];

  for (let i = 0; i < count; i++) {
    const template = notesTemplates[i % notesTemplates.length];
    const uNum = template.num + Math.floor(i / notesTemplates.length);
    list.push({
      id: `proc-unit-${subject.toLowerCase()}-g${grade}-${timestamp}-${i}`,
      subject,
      unitNumber: uNum,
      title: `${template.title} Part ${Math.floor(i / notesTemplates.length) + 1}`,
      titleAmharic: `${template.titleAmh} ክፍል ${Math.floor(i / notesTemplates.length) + 1}`,
      grade,
      notes: `${template.notes}\n\n*Comprehensive Board-Exam cheat list updated for optimal retention and matric scoring success.*`,
      notesAmharic: `${template.notesAmh}\n\n*የላቀና የተሟላ የብሔራዊ ማትሪክ ፈተና ማጠቃለያ ጥንቅር።*`,
      keyFormulas: ["Formula A", "Formula B"]
    });
  }
  return list;
}

export default function App() {
  // Load / Save registration info in localstorage for elite persistent experience
  const [studentInfo, setStudentInfo] = useState<StudentInfo>(() => {
    const saved = localStorage.getItem('aksum_vip_student') || localStorage.getItem('selam_vip_student');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
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
      isRegistered: false,
    };
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // PWA Support state for downloadable native experience
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showPwaBanner, setShowPwaBanner] = useState(() => {
    return localStorage.getItem('selam_vip_pwa_dismissed') !== 'true';
  });

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall as any);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall as any);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (!deferredPrompt) {
      alert(lang === 'amh' 
        ? 'የመጫኛ አዝራር በአሁኑ ጊዜ አልተዘጋጀም። ይህ አስቀድሞ ተጭኖ ሊሆን ይችላል ወይም የእርስዎ ብሮውዘር በቀጥታ እንዲጭኑት ይፈልጋል። እባክዎ በብሮውዘርዎ ሜኑ በኩል "Add to Home Screen" የሚለውን ይምረጡ።' 
        : 'Native installation triggers are pending browser activation. The app might already be installed, or you can use your browser menu options ("Add to Home Screen" or "Install App") directly.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsAppInstalled(true);
    }
    setDeferredPrompt(null);
  };
  
  // High-fidelity local state for dynamic custom university lists
  const [universities, setUniversities] = useState<University[]>(() => {
    const saved = localStorage.getItem('selam_vip_universities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_UNIVERSITIES;
  });

  // State for adding custom university
  const [showAddUni, setShowAddUni] = useState(false);
  const [newUni, setNewUni] = useState({
    name: '',
    amharicName: '',
    location: '',
    established: '',
    description: '',
    amharicDescription: '',
    tier: 'Elite Tier-A' as University['tier'],
    worldRank: 2000,
    nationalRank: 10,
    naturalCutoff: 380,
    socialCutoff: 350,
    departments: '',
    notableAlumni: '',
    specialFacts: ''
  });
  const [uniErrors, setUniErrors] = useState<string>('');

  // Active language reference (synced with studentInfo or manually flipped)
  const [lang, setLang] = useState<'amh' | 'eng'>('amh');

  // Theme control: Light or Dark Mode
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('aksum_theme') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('aksum_theme', nextTheme);
  };

  // Study Pomodoro and stats
  const [pomodoroLeft, setPomodoroLeft] = useState(2700); // Default 45 mins VIP focus session
  const [timerRunning, setTimerRunning] = useState(false);
  const [focusMode, setFocusMode] = useState<'focus' | 'break' | 'exam'>('focus');
  const [timerMax, setTimerMax] = useState(2700);
  const [examDuration, setExamDuration] = useState(3600); // Default 60 mins (3600s)
  const [examFinishedLock, setExamFinishedLock] = useState(false);
  const [completedMinutes, setCompletedMinutes] = useState(() => {
    return Number(localStorage.getItem('selam_vip_study_minutes') || '0');
  });

  // MCQ and Notes persistent states (supporting the 10,000+ infinite matric simulation mode)
  const [customMCQs, setCustomMCQs] = useState<MCQQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('aksum_custom_mcqs_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return MCQS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('aksum_custom_mcqs_v4', JSON.stringify(customMCQs));
    } catch (e) {}
  }, [customMCQs]);

  const [curriculumUnits, setCurriculumUnits] = useState<CurriculumUnit[]>(() => {
    try {
      const saved = localStorage.getItem('aksum_custom_units_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return CURRICULUM_UNITS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('aksum_custom_units_v4', JSON.stringify(curriculumUnits));
    } catch (e) {}
  }, [curriculumUnits]);

  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics'); // Default to Mathematics to begin in order
  const [selectedUnitId, setSelectedUnitId] = useState<string>('math-u1');
  const [generatorLoading, setGeneratorLoading] = useState(false);
  const [notesLanguage, setNotesLanguage] = useState<'eng' | 'amh'>('eng');
  const [activeQuizSubTab, setActiveQuizSubTab] = useState<'notes' | 'practice'>('notes');
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [answersState, setAnswersState] = useState<Record<string, { selected: number; correct: boolean }>>(() => {
    const saved = localStorage.getItem('selam_vip_answers_history');
    return saved ? JSON.parse(saved) : {};
  });
  const [revealMCQAnswer, setRevealMCQAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  // AI assistant simulation or request
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: `### ሰላም የእኔ VIP ተማሪ! 👋\n\nእኔ **ናኦል AI - አክሱም ቪአይፒ የጥበብ መሪ** ነኝ። በታላቁ ጥንታዊ የአክሱም ስልጣኔና የኢትዮጵያ ታሪካዊ የእውቀት ጥልቀት ተነሳስቼ ለሀገር አቀፍ ብሔራዊ ፈተናዎች እና ዩኒቨርሲቲ መግቢያዎች ያዘጋጀሁዎት የቴክኖሎጂ አጋዥ ነኝ።\n\nስለ ትምህርትህ፣ ዩኒቨርሲቲ ምርጫ፣ ወይም ስለተለያዩ ፎርሙላዎች ማንኛውንም ጥያቄ ጠይቀኝ! በቀጥታ እገዝሃለሁ።`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Formula state
  const [formulaSearch, setFormulaSearch] = useState('');
  const [selectedFormulaCategory, setSelectedFormulaCategory] = useState('All');

  // Active study grade filter, mapped initialized from studentInfo.gradeLevel
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<number>(() => {
    const lvl = studentInfo.gradeLevel || 'Grade 12';
    if (lvl.includes('9')) return 9;
    if (lvl.includes('10')) return 10;
    if (lvl.includes('11')) return 11;
    if (lvl.toLowerCase().includes('freshman') || lvl.toLowerCase().includes('prep') || lvl.includes('13')) return 13;
    return 12; // Default to Grade 12
  });
  const [showTerms, setShowTerms] = useState(false);

  const changeGradeFilter = (grade: number) => {
    setSelectedGradeFilter(grade);
    setCurrentMCQIndex(0);
    setRevealMCQAnswer(false);
    
    // Determine dynamic list of subjects
    const availSecs = grade === 13
      ? ['Mathematics', 'Physics', 'English']
      : (studentInfo.fieldStream === 'Natural Science' 
          ? ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology']
          : ['Mathematics', 'History', 'Geography', 'English']);
    
    const nextSub = availSecs[0] || 'Mathematics';
    setSelectedSubject(nextSub);
    
    // Find first unit for this grade and subject
    const firstSubjectUnit = curriculumUnits.find(u => u.grade === grade && u.subject === nextSub);
    if (firstSubjectUnit) {
      setSelectedUnitId(firstSubjectUnit.id);
    } else {
      const fallbackUnit = curriculumUnits.find(u => u.grade === grade) || curriculumUnits.find(u => u.subject === nextSub) || curriculumUnits[0];
      if (fallbackUnit) {
        setSelectedUnitId(fallbackUnit.id);
      }
    }
  };

  // Clipboard notify
  const [clipboardCopied, setClipboardCopied] = useState(false);

  // Auto sync localStorage on studentInfo state modifier
  useEffect(() => {
    localStorage.setItem('selam_vip_student', JSON.stringify(studentInfo));
    setLang(studentInfo.preferredLanguage);
  }, [studentInfo]);

  // Sync universities
  useEffect(() => {
    localStorage.setItem('selam_vip_universities', JSON.stringify(universities));
  }, [universities]);

  // Sync quiz performance summary
  useEffect(() => {
    localStorage.setItem('selam_vip_answers_history', JSON.stringify(answersState));
    const list = Object.values(answersState) as Array<{ selected: number; correct: boolean }>;
    const correctCount = list.filter(a => a.correct).length;
    setQuizScore({
      correct: correctCount,
      total: list.length
    });
  }, [answersState]);

  // Pomodoro interval timing implementation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && pomodoroLeft > 0) {
      interval = setInterval(() => {
        setPomodoroLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval!);
            setTimerRunning(false);
            // Completed block logic
            const gainedMinutes = Math.floor(timerMax / 60);
            const totalMins = completedMinutes + gainedMinutes;
            setCompletedMinutes(totalMins);
            localStorage.setItem('selam_vip_study_minutes', String(totalMins));
            
            // If in mock exam mode, activate the interaction lockout!
            if (focusMode === 'exam') {
              setExamFinishedLock(true);
            }
            
            // alert sound emulation
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(880, audioCtx.currentTime); // nice focus tone
              osc.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.4);
            } catch (e) {}
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, pomodoroLeft, timerMax, completedMinutes, focusMode]);

  const handleRegister = (info: StudentInfo) => {
    setStudentInfo(info);
    setLang(info.preferredLanguage);
  };

  const handleLogout = () => {
    if (confirm(lang === 'amh' ? 'እርግጠኛ ነዎት መለያዎን ሙሉ በሙሉ መዝጋት ይፈልጋሉ?' : 'Are you sure you want to log out and clear cached profile credentials?')) {
      localStorage.removeItem('selam_vip_student');
      localStorage.removeItem('selam_vip_answers_history');
      localStorage.removeItem('selam_vip_study_minutes');
      localStorage.removeItem('selam_vip_universities');
      setCompletedMinutes(0);
      setUniversities(INITIAL_UNIVERSITIES);
      setAnswersState({});
      setStudentInfo({
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
        isRegistered: false,
      });
      setActiveTab('dashboard');
    }
  };

  const toggleLanguage = (selected: 'amh' | 'eng') => {
    setStudentInfo(prev => ({
      ...prev,
      preferredLanguage: selected
    }));
  };

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setPomodoroLeft(timerMax);
  };

  const switchTimerMode = (mode: 'focus' | 'break' | 'exam', customDur?: number) => {
    setFocusMode(mode);
    setTimerRunning(false);
    let duration = 2700;
    if (mode === 'focus') {
      duration = 2700; // 45 mins
    } else if (mode === 'break') {
      duration = 300; // 5 mins
    } else if (mode === 'exam') {
      duration = customDur || examDuration;
    }
    setTimerMax(duration);
    setPomodoroLeft(duration);
  };

  const handleAddUniversity = (e: React.FormEvent) => {
    e.preventDefault();
    setUniErrors('');
    if (!newUni.name.trim() || !newUni.amharicName.trim() || !newUni.location.trim()) {
      setUniErrors(lang === 'amh' ? 'እባክዎን ሁሉንም መስፈርቶች በትክክል ይሙሉ' : 'Please fill all primary text fields.');
      return;
    }

    const createdUni: University = {
      id: 'custom-' + Date.now(),
      name: newUni.name,
      amharicName: newUni.amharicName,
      location: newUni.location,
      established: newUni.established || '2026',
      description: newUni.description || 'Custom Ethiopian institution authorized by Selam VIP scholars.',
      amharicDescription: newUni.amharicDescription || 'በሰላም ቪአይፒ አካዳሚ ተማሪዎች የተመዘገበ የከፍተኛ ትምህርት ተቋም።',
      worldRank: Number(newUni.worldRank) || 3000,
      nationalRank: Number(newUni.nationalRank) || 12,
      tier: newUni.tier,
      departments: newUni.departments ? newUni.departments.split(',').map(d => d.trim()) : ['General Science', 'Engineering'],
      notableAlumni: newUni.notableAlumni ? newUni.notableAlumni.split(',').map(a => a.trim()) : ['Prominent Student Leaders'],
      admissionStats: {
        naturalCutoff: Number(newUni.naturalCutoff) || 350,
        socialCutoff: Number(newUni.socialCutoff) || 350,
        acceptanceRate: 'VIP Open Stream'
      },
      specialFacts: newUni.specialFacts ? newUni.specialFacts.split('\n').filter(Boolean) : ['Pioneering digital curriculum adaptation.'],
      bannerGradient: 'from-amber-700 via-zinc-800 to-amber-900'
    };

    setUniversities([createdUni, ...universities]);
    setShowAddUni(false);
    // Reset Form
    setNewUni({
      name: '',
      amharicName: '',
      location: '',
      established: '',
      description: '',
      amharicDescription: '',
      tier: 'Elite Tier-A',
      worldRank: 2000,
      nationalRank: 10,
      naturalCutoff: 380,
      socialCutoff: 350,
      departments: '',
      notableAlumni: '',
      specialFacts: ''
    });
  };

  // Chat request dispatch
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput.trim();
    setAiInput('');
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedHistory = [
      ...chatHistory,
      { sender: 'user' as const, text: userMsg, timestamp: timeStr }
    ];
    setChatHistory(updatedHistory);
    setAiLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          subject: selectedSubject === 'All' ? 'General' : selectedSubject,
          studentInfo,
          context: `Current active tab: ${activeTab}. User has study score of: ${quizScore.correct}/${quizScore.total}, focus study total time: ${completedMinutes} minutes.`
        })
      });
      const data = await response.json();
      
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'ai' as const,
          text: data.text || 'Error communicating with Aksum GPT Pro. Working in offline mode.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      // Offline fallback text with beautiful study encouragement
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'ai' as const,
          text: `### 🚀 አክሱም ጂፒቲ ፕሮ (የጥናት ረዳት)\n\nአውታረ መረብ ግንኙነት ተቋርጧል ወይም ዴሞ ሁናቴ ላይ ነን። ጥያቄዎን፡ "${userMsg}" በሚገባ ተመልክቻለሁ!\n\n**ፈጣን ምክር**፡ በአክሱም ቪአይፒ ውስጥ የሚገኙትን የ${studentInfo.fieldStream} ብሔራዊ ዋና ዋና ፈተናዎችን በየቀኑ ቢያንስ 10 ጥያቄዎችን በመስራት ስኬትን ያረጋግጡ! በሚቀጥለው ጥቆማዬ መፍትሄውን በዝርዝር እሰጥዎታለሁ።`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleMCQAnswerSelect = (optionIndex: number) => {
    if (revealMCQAnswer) return; // Answer locked after response

    const currQuestion = activeMCQ;
    if (!currQuestion) return;

    const isCorrect = optionIndex === currQuestion.answerIndex;
    setAnswersState(prev => ({
      ...prev,
      [currQuestion.id]: {
        selected: optionIndex,
        correct: isCorrect
      }
    }));
    setRevealMCQAnswer(true);
  };

  const handleNextMCQ = () => {
    setRevealMCQAnswer(false);
    if (currentMCQIndex < filteredMCQs.length - 1) {
      setCurrentMCQIndex(prev => prev + 1);
    } else {
      setCurrentMCQIndex(0); // restart loop
    }
  };

  const handleGenerateQuestionForUnit = async (unit: CurriculumUnit) => {
    setGeneratorLoading(true);
    setRevealMCQAnswer(false);
    try {
      const resp = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: unit.subject,
          unitNumber: unit.unitNumber,
          unitTitle: unit.title,
          grade: unit.grade,
          stream: studentInfo.fieldStream,
        }),
      });
      const data = await resp.json();
      if (data.question) {
        // Append this new question to our local customMCQs state
        const newQ = data.question;
        setCustomMCQs(prev => {
          // Prevent duplicates if already exists
          if (prev.some(q => q.id === newQ.id)) return prev;
          return [...prev, newQ];
        });
        
        // Switch to practice view immediately and set index to the newly added question
        setActiveQuizSubTab('practice');
        
        // We want to find the index of this new question in the updated filtered list.
        // Let's compute it:
        setTimeout(() => {
          setCustomMCQs(currentQList => {
            const filtered = currentQList.filter(q => {
              if (studentInfo.fieldStream === 'Natural Science' && q.stream === 'Social Science') return false;
              if (studentInfo.fieldStream === 'Social Science' && q.stream === 'Natural Science') return false;
              if (selectedSubject !== 'All' && !q.subject.toLowerCase().includes(selectedSubject.toLowerCase())) return false;
              return true;
            });
            const newIndex = filtered.findIndex(q => q.id === newQ.id);
            if (newIndex !== -1) {
              setCurrentMCQIndex(newIndex);
            }
            return currentQList;
          });
        }, 150);
      }
    } catch (err) {
      console.error("Error generating question:", err);
    } finally {
      setGeneratorLoading(false);
    }
  };

  // Filter study parameters
  const filteredMCQs = customMCQs.filter(question => {
    // filter grade
    if (question.grade !== selectedGradeFilter) return false;

    // filter stream
    if (studentInfo.fieldStream === 'Natural Science' && question.stream === 'Social Science') return false;
    if (studentInfo.fieldStream === 'Social Science' && question.stream === 'Natural Science') return false;
    
    // filter subject dropdown
    if (selectedSubject !== 'All' && !question.subject.toLowerCase().includes(selectedSubject.toLowerCase())) return false;
    
    return true;
  });

  // Bulletproof state protection against out-of-bound indexes & empty filters
  useEffect(() => {
    if (currentMCQIndex >= filteredMCQs.length && filteredMCQs.length > 0) {
      setCurrentMCQIndex(filteredMCQs.length - 1);
    }
  }, [filteredMCQs.length, currentMCQIndex]);

  const safeMCQIndex = Math.max(0, Math.min(currentMCQIndex, Math.max(0, filteredMCQs.length - 1)));
  const activeMCQ = filteredMCQs[safeMCQIndex] || {
    id: 'placeholder-mcq',
    subject: selectedSubject,
    grade: selectedGradeFilter,
    question: 'Select "⚡ Synthesize Exam Pool (10k+)" in the sidebar to generate custom-tailored board-exam questions instantly!',
    questionAmharic: 'አዳዲስ የፈተና ጥያቄዎችን ለማግኘት "⚡ ማትሪክ ጥያቄዎችን አክል (10k+)" የሚለውን ይጫኑ!',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    optionsAmharic: ['ሀ', 'ለ', 'ሐ', 'መ'],
    answerIndex: 0,
    explanation: 'Complete the generation to view standard step-by-step solutions.',
    explanationAmharic: 'የፈተና ጥያቄዎች ሲፈጠሩ ዝርዝር ማብራሪያዎችን እዚህ ያገኛሉ።',
    year: '2018 EESSLCE Prep'
  };

  const subjectsList = selectedGradeFilter === 13
    ? ['Mathematics', 'Physics', 'English']
    : (studentInfo.fieldStream === 'Natural Science' 
        ? ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology']
        : ['Mathematics', 'History', 'Geography', 'English']);

  // Format focus timers
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerExportPlan = () => {
    const backupData = {
      app: 'Aksum VIP Academy',
      timestamp: new Date().toISOString(),
      student: studentInfo,
      studyStats: {
        completedHours: (completedMinutes / 60).toFixed(2),
        answersCorrect: quizScore.correct,
        totalAttempted: quizScore.total,
        percentageResult: quizScore.total > 0 ? ((quizScore.correct / quizScore.total) * 100).toFixed(1) + '%' : '0%'
      },
      memorizedFormulas: FORMULAS.length,
      customUniversities: universities.filter(u => u.id.startsWith('custom'))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Aksum_VIP_Study_Plan_${studentInfo.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyAppShareText = () => {
    const shareText = `🚀 Aksum VIP Academy - Premium Ethiopian Study & University Guide app!\n💡 Interactive ESSLCE exam prep, customized AI advisor "Aksum GPT Pro", customizable Grade 12 National cutoffs guidance!\n🌟 Code Export Support. Try it here:\n📌 Development Portal: ${window.location.href}`;
    navigator.clipboard.writeText(shareText);
    setClipboardCopied(true);
    setTimeout(() => setClipboardCopied(false), 3000);
  };

  // Render Onboarding Registration if not signed in / registered
  if (!studentInfo.isRegistered) {
    return <WelcomeScreen onComplete={handleRegister} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans flex flex-col antialiased ${
      theme === 'light'
        ? 'bg-[#F9F6EE] text-slate-800 selection:bg-vip-gold/30 selection:text-slate-900'
        : 'bg-slate-950 text-slate-200 selection:bg-vip-gold selection:text-vip-dark'
    }`}>
      
      {/* GLOBAL MOCK EXAM LOCKOUT INTERACTION BLOCKER */}
      {examFinishedLock && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg w-full bg-slate-900 border-2 border-rose-600 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
          >
            {/* Background neon effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Visual Indicator of Locked State */}
            <div className="w-20 h-20 bg-rose-600/15 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 scale-110 border border-rose-500/30 animate-pulse">
              <Lock className="w-10 h-10 text-rose-500" />
            </div>

            <h2 className="text-2xl font-display font-black text-white tracking-tight uppercase">
              {lang === 'amh' ? '🚨 ፈተናው ተጠናቋል! ሰዓትዎ አልቋል' : '🚨 LOCKOUT: EXAM TIME IS UP!'}
            </h2>
            <p className="text-xs text-rose-400 mt-2 font-mono font-semibold tracking-wider">
              MOCK EXAM PROTOCOL ACTIVE • INTERACTION LOCKED
            </p>

            {/* Decorative Line */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-rose-600/50 to-transparent my-6"></div>

            <div className="space-y-4 text-left">
              <div className="p-4 bg-slate-950/70 border border-rose-500/10 rounded-2xl">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'amh' ? (
                    <>
                      ሀገር አቀፍ ብሔራዊ የፈተና ጥብቅ ሁኔታዎችን ለመለማመድ ሲባል፣ <strong>ሰላም ቪአይፒ</strong> መተግበሪያውን ሙሉ በሙሉ ቆልፎታል። በፈተና ወቅት ሰዓት ሲያበቃ መስተጋብሮች እንዲዘጉ ይደረጋል።
                    </>
                  ) : (
                    <>
                      To mimic strict ESSLCE national examination environment protocols, your study dashboard and answers submission forms have been <strong>instantly locked</strong> upon session expiration.
                    </>
                  )}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                {/* Action Button 1: End and go to practice answers */}
                <button
                  id="exam-modal-finish-btn"
                  onClick={() => {
                    setExamFinishedLock(false);
                    setTimerRunning(false);
                    switchTimerMode('focus'); // Reset back to standard focus mode
                    setActiveTab('quiz'); // Redirect them to Quiz tab for reviewing results
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-vip-gold hover:from-amber-600 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl transition-all cursor-pointer tracking-wider uppercase shadow-lg shadow-vip-gold/10"
                >
                  {lang === 'amh' ? 'ፈተናውን ጨርስ እና ውጤት ገምግም (ወደ Practice ሂድ)' : 'Finish Exam & Review Answer Key'}
                </button>

                {/* Action Button 2: Restart / Retake Exam */}
                <button
                  id="exam-modal-restart-btn"
                  onClick={() => {
                    setExamFinishedLock(false);
                    setPomodoroLeft(examDuration);
                    setTimerMax(examDuration);
                    setTimerRunning(true); // restart ticking right away
                  }}
                  className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer tracking-wider uppercase font-mono"
                >
                  {lang === 'amh' ? 'ፈተናውን በድጋሚ ጀምር (Restart Exam)' : 'Re-take 100% Offline Exam'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Top Premium Notification Flag */}
      <div className="bg-amber-500 text-slate-950 font-display font-medium text-xs py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 relative overflow-hidden">
        <Sparkles className="w-4 h-4 animate-bounce" />
        <span>
          {lang === 'amh' 
            ? `ቅንጡ ቪአይፒ መዳረሻ ተከፍቷል! ለአይቲ ቱተር የገባው መረጃ: ${studentInfo.school} (${studentInfo.fieldStream})` 
            : `Premium VIP Access Active! Tunneling personalized stream for: ${studentInfo.school}`}
        </span>
        <div className="absolute inset-0 bg-white/15 translate-x-[-100%] animate-pulse duration-[3000ms] pointer-events-none"></div>
      </div>

      {/* Main Luxury Navigation Menu */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        studentInfo={studentInfo} 
        onLogout={handleLogout}
        lang={lang}
        setLang={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Container Wrapper */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 lg:pb-8">
        
        <AnimatePresence mode="wait">
          {/* TAB 1: DASHBOARD METRICS & LEARNING WORKSPACE */}
          {activeTab === 'dashboard' && (
            <motion.div
              id="view-dashboard-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* 📱 Premium Mobile App Header bar (AKSUM ACADEMY) */}
              <div className="flex items-center justify-between mt-3 mb-6 font-sans">
                <div>
                  <span className="text-[10px] font-black tracking-[0.25em] text-vip-gold/85 uppercase block font-mono">
                    AKSUM ACADEMY
                  </span>
                  <h2 className={`text-3xl font-display font-black mt-1 select-none flex items-center gap-1.5 leading-none transition-colors ${
                    theme === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    <span>
                      {lang === 'amh' ? `እንኳን ደህና መጣህ 👋` : `Welcome back 👋`}
                    </span>
                    <span className="text-vip-gold text-2xl truncate hidden sm:inline max-w-[150px]">
                      {studentInfo.name.split(' ')[0]}
                    </span>
                  </h2>
                </div>

                {/* Notifications Bell Button */}
                <div className="relative">
                  <button
                    id="notify-bell-btn"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-3.5 bg-slate-900 border border-vip-charcoal/50 text-vip-gold hover:text-white rounded-full cursor-pointer hover:bg-slate-950/80 transition-all active:scale-95 flex items-center justify-center relative shadow-md shadow-slate-950/20"
                    title={lang === 'amh' ? 'ማሳወቂያዎች' : 'Academic Alert Hub'}
                  >
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                    <Bell className="w-5 h-5" />
                  </button>

                  {/* Stateful Interactive Notifications dropdown list */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-slate-950 border border-vip-gold/30 rounded-2xl p-4 shadow-2xl z-30 font-sans"
                      >
                        <div className="flex items-center justify-between pb-2.5 border-b border-vip-charcoal/50 mb-3">
                          <h4 className="text-xs font-black text-white tracking-widest uppercase">
                            {lang === 'amh' ? 'የጥናት ማሳወቂያዎች' : 'ACADEMIC ALERTS'}
                          </h4>
                          <span className="text-[9px] bg-vip-gold/10 text-vip-gold px-1.5 py-0.5 rounded font-bold font-mono">
                            LIVE
                          </span>
                        </div>
                        <div className="space-y-3">
                          {[
                            { id: 1, amh: "📝 በ14,000+ ጥያቄዎች የተደራጁት የ ESSCLE ሞዴል ፈተናዎች በቋንቋ ማብራሪያ ተዘምነዋል!", eng: "📝 ESSLCE bilingual mock exams updated with 14,000+ past questions!", time: lang === 'amh' ? "አሁን" : "Just now" },
                            { id: 2, amh: "🤖 አክሱም ጂፒቲ ፕሮ የእርስዎን ክፍል እና ትምህርት ቤት መሰረት አድርጎ መልስ እንዲሰጥ ተሻሽሏል!", eng: "🤖 Aksum GPT Pro is fully upgraded to support custom high school syllabus guides.", time: lang === 'amh' ? "ከ 1 ሰዓት በፊት" : "1 hour ago" },
                            { id: 3, amh: "📐 የአክሱም ፎርሙላ ማዕከል ተጠቃሚዎች የፊዚክስና ሒሳብ ማስሊያ ሰሌዳዎችን መጠቀም ይችላሉ።", eng: "📐 Live Newton laws scientific simulation playground ready in Toolkit!", time: lang === 'amh' ? "ትላንት" : "Yesterday" }
                          ].map((x) => (
                            <div key={x.id} className="p-2.5 bg-slate-900 border border-vip-charcoal/50 rounded-xl hover:border-vip-gold/20 transition-all text-left">
                              <p className="text-[11px] text-gray-205 text-gray-300 leading-relaxed">
                                {lang === 'amh' ? x.amh : x.eng}
                              </p>
                              <span className="text-[8px] text-vip-gold font-mono font-bold mt-1.5 block">
                                ⏱️ {x.time}
                              </span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="w-full mt-3 py-1.5 bg-slate-900 border border-vip-charcoal/50 text-[10px] text-gray-400 hover:text-white rounded-lg transition-all cursor-pointer font-bold uppercase"
                        >
                          {lang === 'amh' ? 'ዝጋ' : 'Dismiss'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 🔍 Search lessons, books, exams Pill Input - exact with phone concept */}
              <div className="relative w-full font-sans">
                <div className={`relative flex items-center transition-all border rounded-full px-5 py-3.5 w-full shadow-inner focus-within:border-vip-gold focus-within:ring-1 focus-within:ring-vip-gold ${
                  theme === 'light' ? 'bg-white border-amber-900/15' : 'bg-slate-900 border-vip-charcoal/50'
                }`}>
                  <Search className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={dashboardSearchQuery}
                    onChange={(e) => setDashboardSearchQuery(e.target.value)}
                    placeholder={lang === 'amh' ? 'ደብተሮች፣ ፎርሙላዎች፣ የፈተና ምዕራፎች እዚህ ይፈልጉ...' : 'Search lessons, books, exams...'}
                    className={`bg-transparent text-sm focus:outline-none w-full font-medium ${
                      theme === 'light' ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-gray-500'
                    }`}
                  />
                  {dashboardSearchQuery && (
                    <button
                      onClick={() => setDashboardSearchQuery('')}
                      className={`p-1 rounded-full transition-all cursor-pointer ${
                        theme === 'light' ? 'text-gray-400 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-500 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Live Sugggestions search container dropdown overlay */}
                <AnimatePresence>
                  {dashboardSearchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 mt-2 bg-slate-950 border-2 border-vip-gold/30 rounded-3xl p-4 shadow-2xl z-30 text-left max-h-[320px] overflow-y-auto scrollbar-none"
                    >
                      <p className="text-[10px] text-vip-gold font-mono font-bold uppercase tracking-widest px-1 pb-2 border-b border-vip-charcoal/40 mb-2">
                        {lang === 'amh' ? 'የተገኙ የጥናት ውጤቶች' : 'INTELLIGENT MATCHES FOUND'}
                      </p>
                      
                      {/* Search Matches logic block */}
                      {(() => {
                        const query = dashboardSearchQuery.toLowerCase();
                        const matchedUnits = CURRICULUM_UNITS.filter(u => 
                          u.title.toLowerCase().includes(query) || 
                          u.subject.toLowerCase().includes(query) ||
                          u.notes.toLowerCase().includes(query)
                        );
                        const matchedFormulas = FORMULAS.filter(f => 
                          f.name.toLowerCase().includes(query) ||
                          f.topic.toLowerCase().includes(query) ||
                          f.description.toLowerCase().includes(query)
                        );

                        if (matchedUnits.length === 0 && matchedFormulas.length === 0) {
                          return (
                            <p className="text-xs text-gray-500 p-4 text-center font-medium">
                              {lang === 'amh' ? 'ምንም አይነት ውጤት አልተገኘም። ሌሎች ቃላቶችን ይሞክሩ!' : 'No exact math-science matches. Try checking: "Physics", "Vector" or "Chemistry"!'}
                            </p>
                          );
                        }

                        return (
                          <div className="space-y-1">
                            {/* Rend matched curriculum units */}
                            {matchedUnits.map(unit => (
                              <button
                                key={unit.id}
                                onClick={() => {
                                  setSelectedSubject(unit.subject);
                                  setSelectedUnitId(unit.id);
                                  setActiveTab('quiz');
                                  setDashboardSearchQuery('');
                                }}
                                className="w-full p-2.5 rounded-xl hover:bg-slate-900 flex items-center justify-between text-left transition-all border border-transparent hover:border-vip-gold/25 cursor-pointer"
                              >
                                <div>
                                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-black font-mono">
                                    LESSON MODULE • {unit.subject}
                                  </span>
                                  <h4 className="text-xs font-bold text-white mt-1">
                                    Grade {unit.grade}, Unit {unit.unitNumber}: {unit.title}
                                  </h4>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-vip-gold shrink-0" />
                              </button>
                            ))}

                            {/* Rend matched formulas */}
                            {matchedFormulas.map(form => (
                              <button
                                key={form.id}
                                onClick={() => {
                                  setSelectedFormulaCategory(form.subject);
                                  setActiveTab('formulas');
                                  setDashboardSearchQuery('');
                                }}
                                className="w-full p-2.5 rounded-xl hover:bg-slate-900 flex items-center justify-between text-left transition-all border border-transparent hover:border-vip-gold/25 cursor-pointer"
                              >
                                <div>
                                  <span className="text-[9px] bg-vip-gold/10 text-vip-gold border border-vip-gold/30 px-1.5 py-0.5 rounded font-black font-mono">
                                    FORMULA • {form.subject}
                                  </span>
                                  <h4 className="text-xs font-bold text-white mt-1">
                                    {form.name} ({form.topic})
                                  </h4>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-vip-gold shrink-0" />
                              </button>
                            ))}
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 👑 "Unlock Pro" Orange-to-Golden Active Banner Panel */}
              <div
                onClick={() => setShowUpgradeModal(true)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-[2rem] p-5 flex items-center justify-between cursor-pointer shadow-lg shadow-vip-gold/10 hover:shadow-vip-gold/20 hover:scale-[1.01] active:scale-[0.99] transition-all relative overflow-hidden font-sans border border-amber-400/10 group"
              >
                {/* Subtle back decoration shapes as premium detail */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-all"></div>
                
                <div className="flex items-center gap-4">
                  {/* Glowing custom light circle with Sparkles */}
                  <div className="p-3.5 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="text-left leading-tight">
                    <h3 className="text-lg font-black text-white tracking-wide font-display">
                      {lang === 'amh' ? 'ሙሉ ቪአይፒ ፓኬጅ (ፕሮ)' : 'Unlock Pro'}
                    </h3>
                    <p className="text-amber-100 text-xs mt-1 font-medium select-none">
                      {lang === 'amh' ? 'ክፍል 10-12 + ብሔራዊ ማትሪክ ዝግጅት' : 'Grade 10-12 + EUEE prep'}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all group-hover:translate-x-1 flex items-center justify-center shrink-0">
                  <ChevronRight className="w-5 h-5 font-black" />
                </div>
              </div>

              {/* 📐 State Modal for general "Unlock Pro / Active Status Summary" */}
              <AnimatePresence>
                {showUpgradeModal && (
                  <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-slate-900 border-2 border-vip-gold rounded-[2.5rem] p-6 max-w-md w-full relative overflow-hidden text-center shadow-2xl font-sans"
                    >
                      <div className="absolute -top-12 -right-12 w-24 h-24 bg-vip-gold/10 rounded-full filter blur-xl"></div>
                      
                      <div className="p-4 bg-vip-gold/10 border border-vip-gold/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-vip-gold mb-4 shadow-inner">
                        <Sparkles className="w-10 h-10 animate-bounce" />
                      </div>

                      <h3 className="text-2xl font-display font-black text-white">
                        {lang === 'amh' ? 'ፕሮ ምርጥ አባልነቶች ተከፍተዋል!' : 'VIP Premium Gold Active'}
                      </h3>
                      <p className="text-xs text-vip-gold font-bold tracking-widest uppercase mt-2 select-none">
                        🎓 100% EXAM READY STATUS
                      </p>

                      <div className="mt-6 space-y-4 text-left p-4 rounded-2xl bg-slate-950/70 border border-vip-charcoal/40">
                        {[
                          { item: lang === 'amh' ? "📚 14,000+ ብሔራዊ የማትሪክ ጥያቄዎች" : "📚 14,000+ past ESSLCE collection" },
                          { item: lang === 'amh' ? "🗣️ በእንግሊዝኛ እና አማርኛ የተደራጁ ማብራሪያዎች" : "🗣️ Double bilingual interactive explanations" },
                          { item: lang === 'amh' ? "🧠 አክሱም ጂፒቲ ፕሮ የእውቀት ኮ-ፓይለት" : "🧠 Aksum GPT Pro (Server-Side Gemini AI Advisor)" },
                          { item: lang === 'amh' ? "⏱️ ሳይንሳዊ ፖሞዶሮ የትኩረት ሰዓታት" : "⏱️ Active dashboard pomodoro intervals study trackers" },
                          { item: lang === 'amh' ? "🛡️ ከመስመር ውጭ (100% Offline) መማሪያ ፋይሎች" : "🛡️ Offline state synced (Zero Network required)" }
                        ].map((v, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span className="text-xs text-gray-300 font-medium leading-relaxed">{v.item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-col gap-2.5">
                        <div className="p-3 rounded-xl bg-slate-950 border border-vip-charcoal/40 text-left">
                          <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wider">👩‍🎓 STUDENT SUMMARY PROFILE</span>
                          <span className="text-xs font-black text-white mt-1 block">{studentInfo.name} ({studentInfo.school})</span>
                          <span className="text-[10px] text-vip-gold/85 font-mono mt-0.5 block">{studentInfo.fieldStream} • target cutoff {studentInfo.fieldStream === 'Natural Science' ? 385 : 355}+</span>
                        </div>

                        <button
                          onClick={() => setShowUpgradeModal(false)}
                          className="w-full bg-gradient-to-r from-vip-gold to-amber-600 hover:from-amber-600 hover:to-vip-gold text-vip-dark font-black text-xs py-3.5 rounded-2xl transition-all shadow-md shadow-vip-gold/10 cursor-pointer uppercase"
                        >
                          {lang === 'amh' ? 'መልካም ጥናት! 🚀' : 'Awesome, Let\'s Study! 🚀'}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* 🧩 "Explore" Bento Column Section - identical with mobile card layouts */}
              <div className="text-left font-sans mt-2">
                <h3 className="font-display font-black text-2xl text-white tracking-tight leading-none mb-4">
                  {lang === 'amh' ? 'አክሱምን ይፈትሹ' : 'Explore'}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                  {/* Card 1: Courses (Deep Green) */}
                  <div
                    onClick={() => {
                      setSelectedGradeFilter(12); // default to Matric prep
                      setActiveTab('quiz');
                    }}
                    className="bg-[#055B3F] hover:bg-[#044c33] border border-emerald-900/30 rounded-3xl p-5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden group shadow-lg"
                  >
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full blur-lg pointer-events-none group-hover:scale-125 transition-all"></div>
                    <div className="p-2.5 rounded-2xl bg-white/10 text-white w-fit shadow-md">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="mt-4 text-left">
                      <h4 className="font-black text-white text-lg tracking-wide font-display">
                        {lang === 'amh' ? 'ደብተሮች (ምዕራፍ)' : 'Courses'}
                      </h4>
                      <p className="text-emerald-100 text-[10.5px] mt-1 leading-tight select-none">
                        {lang === 'amh' ? 'ክፍል 9-12 ሲላበስ' : 'Grade 9-12 syllabus'}
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Library (Camel Beige-Tan) */}
                  <div
                    onClick={() => setActiveTab('formulas')}
                    className="bg-[#D2894A] hover:bg-[#c27c3d] border border-amber-900/15 rounded-3xl p-5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden group shadow-lg"
                  >
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full blur-lg pointer-events-none group-hover:scale-125 transition-all"></div>
                    <div className="p-2.5 rounded-2xl bg-white/10 text-white w-fit shadow-md">
                      <Clipboard className="w-5 h-5" />
                    </div>
                    <div className="mt-4 text-left">
                      <h4 className="font-black text-white text-lg tracking-wide font-display">
                        {lang === 'amh' ? 'ቤተ-መጻሕፍት' : 'Library'}
                      </h4>
                      <p className="text-amber-50 text-[10.5px] mt-1 leading-tight select-none">
                        {lang === 'amh' ? 'ፎርሙላዎችና ማስሊያ' : 'MoE textbooks + tools'}
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Exams (Deep Burgundy-Black) */}
                  <div
                    onClick={() => setActiveTab('quiz')}
                    className="bg-[#1C0C22] hover:bg-[#140619] border border-violet-950/40 rounded-3xl p-5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden group shadow-lg"
                  >
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full blur-lg pointer-events-none group-hover:scale-125 transition-[#6000ms] transition-all"></div>
                    <div className="p-2.5 rounded-2xl bg-white/10 text-white w-fit shadow-md">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="mt-4 text-left">
                      <h4 className="font-black text-white text-lg tracking-wide font-display">
                        {lang === 'amh' ? 'ፈተናዎች (EUEE)' : 'Exams'}
                      </h4>
                      <p className="text-purple-100 text-[10.5px] mt-1 leading-tight select-none">
                        {lang === 'amh' ? 'ብሔራዊ ፈተና ማለማመጃ' : 'ESSLCE past exams'}
                      </p>
                    </div>
                  </div>

                  {/* Card 4: Go Pro (Vivid Orange Gradient) */}
                  <div
                    onClick={() => setActiveTab('aitutor')}
                    className="bg-gradient-to-br from-[#E25C3C] to-[#C83C3C] hover:from-[#C83C3C] hover:to-[#E25C3C] rounded-3xl p-5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden group shadow-lg"
                  >
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full blur-lg pointer-events-none group-hover:scale-125 transition-all"></div>
                    <div className="p-2.5 rounded-2xl bg-white/20 text-white w-fit shadow-md">
                      <Cpu className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="mt-4 text-left">
                      <h4 className="font-black text-white text-lg tracking-wide font-display">
                        {lang === 'amh' ? 'አክሱም GPT' : 'Go Pro'}
                      </h4>
                      <p className="text-amber-50 text-[10.5px] mt-1 leading-tight select-none">
                        {lang === 'amh' ? 'ዕውቀት ኮ-ፓይለት ረዳት' : 'All grades unlocked'}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* 📊 Popular Subjects horizontal element with clean round background cards */}
              <div className="text-left font-sans mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-display font-black text-2xl tracking-tight leading-none transition-colors ${
                    theme === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    {lang === 'amh' ? 'ተወዳጅ የትምህርት አይነቶች' : 'Popular subjects'}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedGradeFilter(12);
                      setActiveTab('quiz');
                    }}
                    className="text-xs font-black text-emerald-400 hover:text-vip-gold transition-colors tracking-wide cursor-pointer flex items-center gap-1 uppercase"
                  >
                    <span>{lang === 'amh' ? 'ሁሉንም አሳይ' : 'See all'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Grid or Horizontal Scroll of 4 subject buttons exactly from design mockup */}
                <div className="grid grid-cols-4 gap-3.5">
                  {[
                    { id: 'math', name: 'Math', amh: 'ሒሳብ', sub: 'Mathematics', icon: Calculator, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
                    { id: 'phys', name: 'Physics', amh: 'ፊዚክስ', sub: 'Physics', icon: Zap, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                    { id: 'chem', name: 'Chemistry', amh: 'ኬሚስትሪ', sub: 'Chemistry', icon: Beaker, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
                    { id: 'bio', name: 'Biology', amh: 'ባዮሎጂ', sub: 'Biology', icon: Sparkles, color: 'text-green-400 bg-green-500/10 border-green-500/20' }
                  ].map((subjectCard) => {
                    const CardIcon = subjectCard.icon;
                    return (
                      <button
                        key={subjectCard.id}
                        onClick={() => {
                          setSelectedSubject(subjectCard.sub);
                          setActiveTab('quiz');
                        }}
                        className={`border rounded-[2rem] p-4 flex flex-col items-center justify-center gap-3 transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-md select-none group min-h-[140px] text-center ${
                          theme === 'light'
                            ? 'bg-white border-amber-900/15 hover:border-amber-500/40 hover:bg-amber-50/10'
                            : 'bg-slate-900 border-vip-charcoal/45 hover:border-vip-gold/30 hover:bg-slate-950'
                        }`}
                      >
                        {/* Circle background with icon */}
                        <div className={`p-4 rounded-full w-14 h-14 flex items-center justify-center transition-all shadow-inner ${subjectCard.color}`}>
                          <CardIcon className="w-6 h-6" />
                        </div>
                        <span className={`text-xs font-black block group-hover:text-vip-gold transition-colors tracking-tight font-display ${
                          theme === 'light' ? 'text-slate-900' : 'text-white'
                        }`}>
                          {lang === 'amh' ? subjectCard.amh : subjectCard.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>


              {/* Dynamic Interactive Pomodoro Focus Space */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Pomodoro Timer Segment (7 Cols) */}
                <div id="pomodoro-workspace" className="lg:col-span-7 bg-slate-900 border border-vip-gold/15 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-vip-gold/5 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-125"></div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xs font-bold text-vip-gold uppercase tracking-widest flex items-center gap-1.5">
                          <Clock className="w-4 h-4 animate-pulse" />
                          {lang === 'amh' ? 'ቪአይፒ የትኩረት ሰዓት' : 'VIP POMODORO FOCUS TANK'}
                        </h3>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {lang === 'amh' ? 'አእምሮን ሳያዘናጉ በጥልቀት የማጥኛ ሳይንሳዊ ዘዴ' : 'Boost retention by dedicating uninterrupted block sessions.'}
                        </p>
                      </div>

                      {/* Mode Select Tabs */}
                      <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-vip-charcoal/50">
                        <button
                          id="timer-mode-focus"
                          onClick={() => switchTimerMode('focus')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                            focusMode === 'focus' ? 'bg-vip-gold text-vip-dark' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {lang === 'amh' ? 'ጥናት' : 'Study'}
                        </button>
                        <button
                          id="timer-mode-break"
                          onClick={() => switchTimerMode('break')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                            focusMode === 'break' ? 'bg-vip-cyan text-vip-dark' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {lang === 'amh' ? 'እረፍት' : 'Recess'}
                        </button>
                        <button
                          id="timer-mode-exam"
                          onClick={() => switchTimerMode('exam')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                            focusMode === 'exam' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'text-gray-400 hover:text-white hover:bg-rose-950/20'
                          }`}
                        >
                          {lang === 'amh' ? 'ፈተና (Mock)' : 'Mock Exam'}
                        </button>
                      </div>
                    </div>

                    {/* Mock Exam Mode Info alert and selectors */}
                    {focusMode === 'exam' && (
                      <div className="mb-4 p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl flex flex-col gap-2 animate-fade-in text-left">
                        <p className="text-[10px] text-rose-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
                          {lang === 'amh' ? 'ፈተና ከመስመር ውጭ ይሰራል (የጊዜ ገደብ ይምረጡ)' : 'OFFLINE EXAM SIMULATION (CHOOSE TIME LIMIT)'}
                        </p>
                        <p className="text-[11px] text-rose-100/70 leading-relaxed">
                          {lang === 'amh' 
                            ? 'የተመረጠው ደቂቃ ሲያበቃ መተግበሪያው ሙሉ በሙሉ ይቆለፋል። ይህም እውነተኛ የብሔራዊ ፈተና ጥብቅ ሁኔታዎችን ለመለማመድ ይረዳል።'
                            : 'Upon expiration, the entire application will locks down instantly. Prepare exactly as if you are in the national exam center!'}
                        </p>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {[
                            { mins: 2, s: 120, label: "2 Mins (Demo)" },
                            { mins: 30, s: 1800, label: "30 Mins" },
                            { mins: 60, s: 3600, label: "60 Mins" },
                            { mins: 90, s: 5400, label: "90 Mins" }
                          ].map((examDurItem) => {
                            const isCurrentVal = examDuration === examDurItem.s;
                            return (
                              <button
                                key={examDurItem.mins}
                                id={`exam-duration-select-${examDurItem.mins}`}
                                onClick={() => {
                                  setExamDuration(examDurItem.s);
                                  setPomodoroLeft(examDurItem.s);
                                  setTimerMax(examDurItem.s);
                                }}
                                className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                                  isCurrentVal 
                                    ? 'bg-rose-600 border-rose-500 text-white shadow-sm glow-rose' 
                                    : 'bg-slate-950 border-vip-charcoal/50 text-gray-400 hover:text-white'
                                }`}
                              >
                                {examDurItem.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Highly Polished Gold Audio Visual Timer Display */}
                    <div className="my-8 text-center flex flex-col items-center justify-center">
                      <div className="w-56 h-56 rounded-full border-4 border-dashed border-vip-gold/20 flex flex-col items-center justify-center relative bg-slate-950/40 select-none">
                        {/* Dynamic rotating ring decoration if timer is ticking */}
                        <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-vip-gold border-r-vip-gold/40 ${timerRunning ? 'animate-spin' : ''} pointer-events-none`}></div>
                        
                        <span className="text-5xl md:text-6xl font-mono font-black text-white px-2 tracking-tight">
                          {formatTime(pomodoroLeft)}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-2">
                          {focusMode === 'focus' ? '🔥 Focus Active' : focusMode === 'break' ? '🕊️ Cooldown' : '🚨 Exam In Progress'}
                        </span>

                        {/* Plus / Minus Quick Micro Adjusters */}
                        <div className="flex items-center gap-1.5 mt-3 z-10">
                          <button
                            id="timer-sub-5"
                            onClick={() => {
                              setPomodoroLeft(prev => Math.max(60, prev - 300));
                              setTimerMax(prev => Math.max(60, prev - 300));
                            }}
                            className="w-8 h-7 rounded-md bg-slate-900 hover:bg-slate-800 border border-vip-charcoal/50 text-gray-400 hover:text-white flex items-center justify-center text-[10px] font-mono font-bold transition-all active:scale-90 cursor-pointer"
                            title="Subtract 5 Mins"
                          >
                            -5m
                          </button>
                          <button
                            id="timer-sub-1"
                            onClick={() => {
                              setPomodoroLeft(prev => Math.max(10, prev - 60));
                              setTimerMax(prev => Math.max(10, prev - 60));
                            }}
                            className="w-8 h-7 rounded-md bg-slate-900 hover:bg-slate-800 border border-vip-charcoal/50 text-gray-400 hover:text-white flex items-center justify-center text-[10px] font-mono font-bold transition-all active:scale-90 cursor-pointer"
                            title="Subtract 1 Min"
                          >
                            -1m
                          </button>
                          <button
                            id="timer-add-1"
                            onClick={() => {
                              setPomodoroLeft(prev => prev + 60);
                              setTimerMax(prev => prev + 60);
                            }}
                            className="w-8 h-7 rounded-md bg-slate-900 hover:bg-slate-800 border border-vip-charcoal/50 text-vip-gold hover:text-white flex items-center justify-center text-[10px] font-mono font-bold transition-all active:scale-90 cursor-pointer"
                            title="Add 1 Min"
                          >
                            +1m
                          </button>
                          <button
                            id="timer-add-5"
                            onClick={() => {
                              setPomodoroLeft(prev => prev + 300);
                              setTimerMax(prev => prev + 300);
                            }}
                            className="w-8 h-7 rounded-md bg-slate-900 hover:bg-slate-800 border border-vip-charcoal/50 text-vip-gold hover:text-white flex items-center justify-center text-[10px] font-mono font-bold transition-all active:scale-90 cursor-pointer"
                            title="Add 5 Mins"
                          >
                            +5m
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timer Controls panel */}
                  <div className="flex items-center gap-4 bg-slate-950/75 p-3 rounded-2xl border border-vip-charcoal/50 mt-4 justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        id="timer-play-pause-btn"
                        onClick={toggleTimer}
                        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wide transition-all cursor-pointer ${
                          timerRunning 
                            ? 'bg-amber-600/20 border border-amber-500/50 text-vip-gold' 
                            : focusMode === 'exam'
                              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20'
                              : 'bg-vip-gold hover:bg-amber-500 text-vip-dark shadow-md shadow-vip-gold/20'
                        }`}
                      >
                        {timerRunning ? (
                          <>
                            <Pause className="w-4 h-4 fill-current" />
                            <span>{lang === 'amh' ? 'አቁም' : 'Pause'}</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>{lang === 'amh' ? 'ጀምር' : 'Start'}</span>
                          </>
                        )}
                      </button>

                      <button
                        id="timer-reset-btn"
                        onClick={resetTimer}
                        className="p-3 bg-vip-slate hover:bg-vip-charcoal/80 border border-vip-charcoal/50 rounded-xl transition-all text-white cursor-pointer"
                        title="Reset state"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right pr-2">
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">{lang === 'amh' ? 'ጥረቶች' : 'Session Target'}</span>
                      <span className="text-xs text-white font-semibold">
                        {focusMode === 'focus' ? 'Focus 45 mins' : focusMode === 'break' ? 'Cozy break 5 mins' : `Mock Exam ${Math.round(timerMax / 60)} mins`}
                      </span>
                    </div>
                  </div>

                </div>

                {/* VIP Elite Study Principles & Pro Features (5 cols) */}
                <div id="learning-techniques" className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* VIP Study Tips Card Slider */}
                  <div className="bg-slate-900 border border-vip-charcoal/60 rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-vip-gold animate-bounce" />
                      {lang === 'amh' ? 'የጥናት ሳይንሳዊ ዘዴዎች' : 'Scientific Study Frameworks'}
                    </h3>

                    <div className="space-y-4">
                      {GENERAL_STUDY_PILLS.map((pill, index) => (
                        <div key={index} className="p-3.5 bg-slate-950/60 border border-vip-charcoal/40 rounded-xl hover:border-vip-gold/30 transition-all">
                          <h4 className="text-xs font-bold text-vip-gold flex items-center gap-1.5">
                            <span className="text-[10px] bg-vip-gold/10 text-vip-gold border border-vip-gold/30 px-1.5 py-0.5 rounded">#0{index + 1}</span>
                            {pill.title}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                            {pill.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Aesthetic Upgrade to Pro Promo Card */}
                  <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 rounded-3xl p-6 text-slate-950 shadow-xl shadow-vip-gold/10 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                    <h4 className="font-display font-black uppercase tracking-tight text-xl text-white">UPGRADE TO VIP GOLD PRO</h4>
                    <p className="text-xs font-medium text-amber-100 mt-2 leading-relaxed">
                      Score 500+ on your Matric with complete past national exam pools, interactive answers, and expert college application consultations.
                    </p>
                    <button
                      id="upgrade-gold-btn"
                      onClick={() => alert(lang === 'amh' ? 'የሰላም ቪአይፒ ጎልድ ማዕረግዎ ቀድሞውኑ ንቁ ነው! በነጻነት ሁሉንም የ AI ቱተር እና የመመዝገቢያ ባህሪያት ይጠቀሙ።' : 'Your VIP Gold access is fully activated for this developer workspace!')}
                      className="mt-4 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer tracking-wider truncate uppercase shadow-md"
                    >
                      {lang === 'amh' ? 'ወርቅ ማዕረጌን አሳይ' : 'Check My VIP Credentials'}
                    </button>
                  </div>

                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 2: NATIONAL MATRIC EXAM PREPARATORY MODULE */}
          {activeTab === 'quiz' && (
            <motion.div
              id="view-exam-prep-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Top Luxury Stat Hero Display to show 14k+ database pool capability */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-vip-gold/30 p-6 shadow-lg shadow-vip-gold/5 animate-fade-in">
                <div className="absolute top-0 right-0 w-48 h-48 bg-vip-gold/5 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-vip-gold/40 text-vip-gold flex items-center justify-center shrink-0">
                      <Database className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-vip-gold/15 text-vip-gold text-[10px] font-bold tracking-widest uppercase mb-1">
                        <Sparkles className="w-3 h-3 animate-spin duration-[5000ms]" />
                        Aksum Elite Database Pool Active
                      </div>
                      <h3 className="text-xl md:text-2xl font-display font-black text-white">
                        14,000+ Questions Prep Station
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-xl">
                        {lang === 'amh'
                          ? 'ከኢትዮጵያ ሀገር አቀፍ ማትሪክ ፈተናዎች የተሰበሰቡና በምዕራፍ በዝርዝር የተቀመጡ ከ14,000 በላይ ጥያቄዎች በሁለቱም ቋንቋዎች (ባለሙሉ ማብራሪያ ማስታወሻዎች)።'
                          : 'Dive into our sprawling repository of over 14,005+ ESSLCE past questions grouped strictly by ordered chapters with bilingual guides.'}
                      </p>
                    </div>
                  </div>

                  {/* Active Numbers Counter Banner */}
                  <div className="flex gap-4 md:self-stretch">
                    <div className="px-5 py-3 rounded-2xl bg-slate-950/60 border border-vip-charcoal/50 flex flex-col justify-center text-center leading-tight">
                      <span className="text-2xl font-mono font-black text-vip-gold">14,124+</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1">Total Pool Questions</span>
                    </div>
                    <div className="px-5 py-3 rounded-2xl bg-slate-950/60 border border-vip-charcoal/50 flex flex-col justify-center text-center leading-tight">
                      <span className="text-2xl font-mono font-black text-vip-cyan">{customMCQs.length}</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1">Active Set</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GRADE LEVEL SWITCHER - EXTREMELY INTUITIVE NAVIGATION */}
              <div className="bg-slate-900 border border-vip-charcoal/40 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-vip-gold uppercase tracking-[0.14em]">
                      {lang === 'amh' ? 'የክፍል ደረጃ መምረጫ' : 'SELECT ACADEMIC GRADE LEVEL'}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {lang === 'amh' ? 'ከተመረጠው ክፍል ጋር የተጣጣሙ ምዕራፎች፣ ማስታወሻዎች እና ፈተናዎች በቅጽበት ይጫናሉ' : 'Instantly view syllabus modules, full notes, and active exam sets for your selected grade.'}
                    </p>
                  </div>
                  <span className="text-[10px] bg-vip-gold/10 text-vip-gold border border-vip-gold/20 px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                    {selectedGradeFilter === 13 ? (lang === 'amh' ? 'ፍሬሽማን' : 'Freshman') : `${selectedGradeFilter}th Grade`}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-1">
                  {[
                    { val: 9, labelEng: "Grade 9", labelAmh: "9ኛ ክፍል", desc: "Rational & Vectors" },
                    { val: 10, labelEng: "Grade 10", labelAmh: "10ኛ ክፍል", desc: "Polynomials & Org Chem" },
                    { val: 11, labelEng: "Grade 11", labelAmh: "11ኛ ክፍል", desc: "Kinematics & Cells" },
                    { val: 12, labelEng: "Grade 12", labelAmh: "12ኛ ክፍል", desc: "Calculus, History & Rift" },
                    { val: 13, labelEng: "Freshman Univ", labelAmh: "ፍሬሽማን ዩኒቨርሲቲ", desc: "College Logic & Physics" }
                  ].map((gradeBtn) => {
                    const isSelected = selectedGradeFilter === gradeBtn.val;
                    return (
                      <button
                        key={gradeBtn.val}
                        id={`grade-filter-btn-${gradeBtn.val}`}
                        onClick={() => changeGradeFilter(gradeBtn.val)}
                        className={`p-3 rounded-2xl border text-center transition-all duration-300 cursor-pointer flex flex-col justify-center items-center gap-1 relative overflow-hidden group ${
                          isSelected
                            ? 'border-vip-gold bg-vip-gold/15 text-white glow-gold shadow-md shadow-vip-gold/10'
                            : 'border-vip-charcoal/50 bg-slate-950/30 text-gray-400 hover:border-gray-500 hover:text-white hover:bg-slate-950/60'
                        }`}
                      >
                        <span className={`text-xs font-extrabold tracking-wide ${isSelected ? 'text-vip-gold' : 'text-gray-300'}`}>
                          {lang === 'amh' ? gradeBtn.labelAmh : gradeBtn.labelEng}
                        </span>
                        <span className="text-[9px] text-gray-500 font-medium group-hover:text-gray-400 font-mono">
                          {gradeBtn.desc}
                        </span>
                        {isSelected && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-vip-gold to-amber-500"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject Select Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-900 border border-vip-charcoal/40 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{lang === 'amh' ? 'ፈተና ፈልግ፡' : 'Subject Selection:'}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {subjectsList.map((sub, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedSubject(sub);
                          setCurrentMCQIndex(0);
                          setRevealMCQAnswer(false);
                          // Auto set active unit id to first unit of that subject to be clean & in order!
                          const firstSubjectUnit = curriculumUnits.find(u => u.grade === selectedGradeFilter && u.subject === sub);
                          if (firstSubjectUnit) {
                            setSelectedUnitId(firstSubjectUnit.id);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                          selectedSubject === sub 
                            ? 'bg-vip-gold text-vip-dark shadow-md shadow-vip-gold/15 animate-pulse' 
                            : 'bg-slate-950/40 text-gray-400 hover:text-white border border-vip-charcoal/30'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-vip-gold font-bold bg-vip-gold/10 border border-vip-gold/30 px-3 py-1.5 rounded-xl shrink-0">
                  <Database className="w-3.5 h-3.5" />
                  <span>Stream: {studentInfo.fieldStream}</span>
                </div>
              </div>

              {/* Main Content Split: List of Units "By Order" on left, Workspace notes/questions on right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Drawer Column: Chapters "By Order" (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900 border border-vip-charcoal/50 rounded-3xl p-5 md:p-6">
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-vip-gold uppercase tracking-wider flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {lang === 'amh' ? 'ምዕራፎች በቅደም ተከተል' : 'Chapters Listed In Order'}
                      </h4>
                      <p className="text-[11px] text-gray-550 mt-1">
                        Select a unit to view bilingual study guides & notes before practicing.
                      </p>
                    </div>

                    <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                      {curriculumUnits.filter(u => u.grade === selectedGradeFilter && u.subject === selectedSubject).map((unit) => {
                        const isSelected = selectedUnitId === unit.id;
                        return (
                          <button
                            key={unit.id}
                            id={`unit-selector-${unit.id}`}
                            onClick={() => {
                              setSelectedUnitId(unit.id);
                              setCurrentMCQIndex(0);
                              setRevealMCQAnswer(false);
                            }}
                            className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden group ${
                              isSelected 
                                ? 'bg-slate-950 border-vip-gold/50 text-white shadow-xl shadow-vip-gold/5' 
                                : 'bg-slate-950/30 border-vip-charcoal/30 text-gray-400 hover:bg-slate-950/60 hover:text-white hover:border-vip-charcoal/60'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                              isSelected ? 'bg-vip-gold text-vip-dark font-black' : 'bg-slate-900 text-gray-500'
                            }`}>
                              {unit.unitNumber}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] text-vip-gold font-mono font-bold tracking-widest uppercase">
                                Unit {unit.unitNumber} • {unit.subject}
                              </span>
                              <h5 className="text-xs font-bold truncate mt-0.5 text-white">
                                {lang === 'amh' ? unit.titleAmharic : unit.title}
                              </h5>
                              <p className="text-[9px] text-gray-500 mt-0.5 truncate">
                                {unit.notes.substring(0, 50).replace(/[#*`$-]/g, '')}...
                              </p>
                            </div>
                          </button>
                        );
                      })}
                      {curriculumUnits.filter(u => u.grade === selectedGradeFilter && u.subject === selectedSubject).length === 0 && (
                        <div className="text-center py-8 text-[11px] text-slate-400 border border-dashed border-vip-charcoal/30 rounded-xl">
                          No pre-loaded core units in database. Ask AI to prepare!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 10K+ INFINITE MATRIX SYNTHESIZER CONTROL PANEL */}
                  <div className="bg-gradient-to-br from-slate-900 to-vip-dark border-2 border-vip-gold/40 rounded-3xl p-5 md:p-6 shadow-xl shadow-vip-gold/5 space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-vip-gold/5 rounded-full blur-2xl -z-10" />
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-vip-gold/10 border border-vip-gold/30 flex items-center justify-center text-vip-gold">
                        <Cpu className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-[11px] md:text-xs font-black text-vip-gold uppercase tracking-wider">
                          {lang === 'amh' ? '10ክ+ የፈተና እና ማስታወሻ መፍጠሪያ' : '10K+ Infinite Exam & Syllabus Synthesizer'}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Offline-First Procedural Expansion Engine
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] text-vip-gold font-bold uppercase tracking-wider">
                          {lang === 'amh' ? 'የትምህርት አይነት እና ክፍል' : 'Current Target Scope'}
                        </label>
                        <div className="text-xs text-slate-300 bg-slate-950/40 p-2 rounded-xl border border-vip-charcoal/30 flex justify-between font-mono font-bold">
                          <span>{selectedSubject}</span>
                          <span className="text-vip-gold">Grade {selectedGradeFilter}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {lang === 'amh' ? 'የጥያቄዎች ብዛት' : 'MCQs to Add'}
                          </label>
                          <select
                            id="synth-mcq-count"
                            defaultValue="200"
                            className="w-full text-xs bg-slate-950 border border-vip-charcoal/50 rounded-xl p-2 text-white font-bold tracking-wide outline-none cursor-pointer focus:border-vip-gold"
                          >
                            <option value="50">50 MCQs</option>
                            <option value="100">100 MCQs</option>
                            <option value="200">200 MCQs</option>
                            <option value="500">500 MCQs</option>
                            <option value="1000">1000 MCQs</option>
                            <option value="2000">2000 MCQs</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {lang === 'amh' ? 'የምዕራፍ ብዛት' : 'Chapters to Add'}
                          </label>
                          <select
                            id="synth-unit-count"
                            defaultValue="3"
                            className="w-full text-xs bg-slate-950 border border-vip-charcoal/50 rounded-xl p-2 text-white font-bold tracking-wide outline-none cursor-pointer focus:border-vip-gold"
                          >
                            <option value="1">1 Unit</option>
                            <option value="3">3 Units</option>
                            <option value="5">5 Units</option>
                            <option value="10">10 Units</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 pt-1">
                        <button
                          onClick={() => {
                            const selectEl = document.getElementById('synth-mcq-count') as HTMLSelectElement;
                            const count = Number(selectEl?.value || '200');
                            setGeneratorLoading(true);
                            setTimeout(() => {
                              const generated = generateProceduralMCQs(selectedSubject, selectedGradeFilter, count);
                              setCustomMCQs(prev => [...prev, ...generated]);
                              setGeneratorLoading(false);
                              alert(
                                lang === 'amh'
                                  ? `ተሳክቷል! ${count} አዳዲስ ብሔራዊ የፈተና ጥያቄዎች ለ ${selectedSubject} (ክፍል ${selectedGradeFilter}) ተጨምረዋል። አሁን በአጠቃላይ ${customMCQs.length + count} ጥያቄዎች ለመለማመድ ዝግጁ ናቸው!`
                                  : `Success! ${count} high-fidelity ESSLCE Board Exam questions synthesized for ${selectedSubject} Grade ${selectedGradeFilter}. Total practice library size: ${customMCQs.length + count}!`
                              );
                            }, 600);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-vip-gold text-vip-dark font-black text-xs hover:bg-white transition-all cursor-pointer shadow-md shadow-vip-gold/10 flex items-center justify-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>{lang === 'amh' ? '⚡ ማትሪክ ጥያቄዎችን አክል (10k+)' : '⚡ Synthesize Exam Pool (10k+)'}</span>
                        </button>

                        <button
                          onClick={() => {
                            const selectEl = document.getElementById('synth-unit-count') as HTMLSelectElement;
                            const count = Number(selectEl?.value || '3');
                            setGeneratorLoading(true);
                            setTimeout(() => {
                              const generated = generateProceduralNotes(selectedSubject, selectedGradeFilter, count);
                              setCurriculumUnits(prev => [...prev, ...generated]);
                              setGeneratorLoading(false);
                              
                              // Select the newly generated first unit to load immediately
                              if (generated.length > 0) {
                                setSelectedUnitId(generated[0].id);
                              }
                              
                              alert(
                                lang === 'amh'
                                  ? `ተሳክቷል! ${count} አዳዲስ አጠቃላይ ምዕራፎችና ማስታወሻዎች ለ ${selectedSubject} ተጨምረዋል።`
                                  : `Success! ${count} detailed bilingual chapters synthesized and injected into active curriculum for ${selectedSubject}.`
                              );
                            }, 500);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-vip-gold border border-vip-gold/40 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{lang === 'amh' ? '📚 ማስታወሻዎችን አስፋ' : '📚 Expand Core Notes'}</span>
                        </button>
                      </div>

                      <div className="pt-2 border-t border-vip-charcoal/30 flex items-center justify-between text-[9px] text-gray-500 font-mono">
                        <span>Database: {customMCQs.length} MCQs & {curriculumUnits.length} Units</span>
                        <button
                          onClick={() => {
                            if (confirm(lang === 'amh' ? 'ሁሉንም ወደነበረበት መመለስ ይፈልጋሉ?' : 'Restore to default preloads?')) {
                              localStorage.removeItem('aksum_custom_mcqs_v4');
                              localStorage.removeItem('aksum_custom_units_v4');
                              setCustomMCQs(MCQS);
                              setCurriculumUnits(CURRICULUM_UNITS);
                              alert('Restored to default values successfully.');
                            }
                          }}
                          className="text-red-400 hover:text-red-300 transition-all cursor-pointer"
                        >
                          [Reset Data]
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Scientific Tip Cards */}
                  <div className="bg-slate-900/60 border border-vip-charcoal/40 rounded-3xl p-5">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-vip-gold" />
                      Study Notes Language Toggle
                    </h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                      We support viewing both notes and questions in English and Amharic simultaneously to guarantee perfect retention.
                    </p>
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl">
                      <button
                        onClick={() => setNotesLanguage('eng')}
                        className={`py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${notesLanguage === 'eng' ? 'bg-vip-gold text-vip-dark' : 'text-gray-400 hover:text-white'}`}
                      >
                        🇺🇸 English Notes
                      </button>
                      <button
                        onClick={() => setNotesLanguage('amh')}
                        className={`py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${notesLanguage === 'amh' ? 'bg-vip-gold text-vip-dark' : 'text-gray-400 hover:text-white'}`}
                      >
                        🇪🇹 አማርኛ ማስታወሻ
                      </button>
                    </div>
                  </div>
                </div>

                {/* Central workspace block (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Workspace Subtabs: Notes and Practice toggle */}
                  <div className="flex border-b border-vip-charcoal/50">
                    <button
                      onClick={() => setActiveQuizSubTab('notes')}
                      className={`pb-3.5 px-6 font-display font-bold text-sm tracking-wider uppercase transition-all relative cursor-pointer ${
                        activeQuizSubTab === 'notes' ? 'text-vip-gold font-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {lang === 'amh' ? 'የምዕራፉ ማስታወሻዎች' : 'Bilingual Study Notes'}
                      </span>
                      {activeQuizSubTab === 'notes' && (
                        <motion.div layoutId="subtabBorder" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-vip-gold" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setActiveQuizSubTab('practice')}
                      className={`pb-3.5 px-6 font-display font-bold text-sm tracking-wider uppercase transition-all relative cursor-pointer ${
                        activeQuizSubTab === 'practice' ? 'text-vip-gold font-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        {lang === 'amh' ? 'የማትሪክ ፈተና መለማመጃ' : 'Interactive MCQ practice'}
                      </span>
                      {activeQuizSubTab === 'practice' && (
                        <motion.div layoutId="subtabBorder" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-vip-gold" />
                      )}
                    </button>
                  </div>

                  {/* Active Workspace Container */}
                  <AnimatePresence mode="wait">
                    {activeQuizSubTab === 'notes' ? (
                      <motion.div
                        key="notes-container"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="bg-slate-900 border border-vip-charcoal/40 rounded-3xl p-6 md:p-8 space-y-6"
                      >
                        {/* Selected Chapter Metadata */}
                        {(() => {
                          const unit = curriculumUnits.find(u => u.id === selectedUnitId) || curriculumUnits.find(u => u.subject === selectedSubject) || curriculumUnits[0];
                          if (!unit) return null;
                          return (
                            <>
                              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-vip-charcoal/40">
                                <div className="min-w-0">
                                  <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2.5 py-0.5 rounded-full font-bold">
                                    Grade {unit.grade} 国 (Ordered Curriculum)
                                  </span>
                                  <h4 className="text-xl md:text-2xl font-display font-black text-white mt-1.5 truncate">
                                    Unit {unit.unitNumber}: {lang === 'amh' ? unit.titleAmharic : unit.title}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-1.5 bg-vip-gold/10 text-vip-gold border border-vip-gold/30 px-3 py-1.5 rounded-xl text-xs font-bold leading-none shrink-0">
                                  <BookOpen className="w-4 h-4 text-vip-gold" />
                                  <span>Order ID: U0{unit.unitNumber}</span>
                                </div>
                              </div>

                              {/* Reading Pane with Elegant Interactive StudyNotesRenderer */}
                              <StudyNotesRenderer 
                                unit={unit}
                                lang={lang}
                                notesLanguage={notesLanguage}
                                onAskTutor={(questionText) => {
                                  setAiInput(questionText);
                                  setActiveTab('aitutor');
                                }}
                              />

                              {/* Action Footer Button to start practice on this unit */}
                              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-vip-charcoal/40">
                                <span className="text-xs text-slate-400">
                                  💡 Switch languages at the left side notes engine anytime.
                                </span>
                                
                                <div className="flex gap-2">
                                  {/* Dynamic Generator Trigger */}
                                  <button
                                    onClick={() => handleGenerateQuestionForUnit(unit)}
                                    disabled={generatorLoading}
                                    className="flex items-center gap-2 bg-gradient-to-r from-teal-550 to-emerald-600 hover:from-teal-650 hover:to-emerald-750 disabled:opacity-50 text-slate-950 font-extrabold text-xs px-5 py-3.5 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/10 transition-all text-vip-dark font-black"
                                  >
                                    {generatorLoading ? (
                                      <>
                                        <Cpu className="w-4 h-4 animate-spin" />
                                        <span>Querying 14k Pool...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Sparkles className="w-4 h-4 animate-pulse text-vip-dark" />
                                        <span>Query ESSLCE 14k+ Pool</span>
                                      </>
                                    )}
                                  </button>

                                  <button
                                    onClick={() => setActiveQuizSubTab('practice')}
                                    className="flex items-center gap-1.5 bg-vip-gold hover:bg-amber-500 text-vip-dark font-extrabold text-xs px-5 py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-vip-gold/15"
                                  >
                                    <span>Practice Preset MCQs</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="practice-container"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="bg-slate-900 border border-vip-charcoal/40 rounded-3xl p-6 md:p-8 space-y-6"
                      >
                        {filteredMCQs.length > 0 ? (
                          <>
                            {/* Quiz Interactive block */}
                            {/* Header badge with Year and index */}
                            <div className="flex items-center justify-between pb-4 border-b border-vip-charcoal/40">
                              <span className="text-xs bg-vip-gold/10 text-vip-gold border border-vip-gold/30 px-3 py-1.5 rounded-xl font-bold">
                                {activeMCQ.subject} • Grade {activeMCQ.grade}
                              </span>
                              
                              <div className="flex items-center gap-2 shrink-0">
                                {activeMCQ.year && (
                                  <span className="text-[11px] text-gray-400 font-mono italic">
                                    Source: {activeMCQ.year}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Question Content in both English and Amharic */}
                            <div className="space-y-4 select-text selection:bg-vip-gold/30">
                              <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-widest">Question {currentMCQIndex + 1} of {filteredMCQs.length}</span>
                              
                              {/* English Version */}
                              <p className="text-lg md:text-xl font-bold text-white leading-relaxed">
                                {activeMCQ.question}
                              </p>

                              {/* Amharic Version directly shown underneath */}
                              {activeMCQ.questionAmharic && (
                                <p className="text-sm md:text-base font-medium text-vip-gold leading-relaxed border-l-2 border-vip-gold/40 pl-3 pt-1">
                                  🇪🇹 {activeMCQ.questionAmharic}
                                </p>
                              )}
                            </div>

                            {/* Toggle/List options in side-by-side or bilingual format */}
                            <div className="space-y-3 pt-2">
                              {activeMCQ.options.map((opt, oIdx) => {
                                const questionId = activeMCQ.id;
                                const userAns = answersState[questionId];
                                const isCorrectOption = oIdx === activeMCQ.answerIndex;
                                const isSelectedByStudent = userAns?.selected === oIdx;

                                let cardStyle = "bg-slate-950/50 border-vip-charcoal/50 text-slate-350 hover:bg-slate-950 hover:border-gray-500";
                                if (revealMCQAnswer) {
                                  if (isCorrectOption) {
                                    cardStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold";
                                  } else if (isSelectedByStudent) {
                                    cardStyle = "bg-red-500/10 border-red-500 text-red-400 font-bold";
                                  } else {
                                    cardStyle = "bg-slate-950/30 border-vip-charcoal/30 text-gray-500 opacity-65";
                                  }
                                }

                                return (
                                  <button
                                    id={`option-card-${oIdx}`}
                                    key={oIdx}
                                    onClick={() => handleMCQAnswerSelect(oIdx)}
                                    className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer ${cardStyle}`}
                                  >
                                    <div>
                                      <span className="text-white font-medium">{opt}</span>
                                      {activeMCQ.optionsAmharic && activeMCQ.optionsAmharic[oIdx] && (
                                        <span className="block text-xs text-vip-gold opacity-90 mt-1 font-semibold">
                                          🇪🇹 {activeMCQ.optionsAmharic[oIdx]}
                                        </span>
                                      )}
                                    </div>
                                    {revealMCQAnswer && (
                                      <span className="shrink-0">
                                        {isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                        {isSelectedByStudent && !isCorrectOption && <XCircle className="w-5 h-5 text-red-500" />}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanatory Fold-Out Container with BOTH languages support */}
                            {revealMCQAnswer && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-5 bg-vip-gold/10 border border-vip-gold/30 rounded-2xl space-y-3"
                              >
                                <h4 className="text-xs font-bold text-vip-gold uppercase tracking-wider flex items-center gap-1.5 border-b border-vip-gold/20 pb-1.5">
                                  <Cpu className="w-4 h-4 animate-spin duration-[5000ms]" />
                                  {lang === 'amh' ? 'ቪአይፒ የባለሙያ ማብራሪያ (Solution)' : 'VIP Step-by-Step Bilingual Solutions'}
                                </h4>

                                <div className="space-y-4 text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
                                  {/* English Explanatory notes */}
                                  <div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">🇺🇸 English Note:</span>
                                    <p className="whitespace-pre-wrap">{activeMCQ.explanation}</p>
                                  </div>

                                  {/* Amharic Explanatory notes */}
                                  {activeMCQ.explanationAmharic && (
                                    <div className="pt-2 border-t border-vip-gold/10">
                                      <span className="text-[10px] text-vip-gold font-bold uppercase tracking-widest block mb-0.5">🇪🇹 የአማርኛ ዝርዝር ማብራሪያ፡</span>
                                      <p className="whitespace-pre-wrap text-slate-300 font-medium">{activeMCQ.explanationAmharic}</p>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}

                            {/* Action Panel */}
                            <div className="flex items-center justify-between pt-6 border-t border-vip-charcoal/40">
                              <div>
                                {revealMCQAnswer ? (
                                  <p className="text-xs font-bold font-mono tracking-wider">
                                    {answersState[activeMCQ.id]?.correct ? (
                                      <span className="text-emerald-400">✨ CORRECT ANSWER! (+10 XP)</span>
                                    ) : (
                                      <span className="text-red-400">❌ INCORRECT (Keep studying)</span>
                                    )}
                                  </p>
                                ) : (
                                  <p className="text-xs text-gray-400">🧠 Choose an option to lock response</p>
                                )}
                              </div>

                              <div className="flex gap-2">
                                {/* Infinity Dynamic Question Injector on the fly */}
                                {(() => {
                                  const unit = curriculumUnits.find(u => u.id === selectedUnitId) || curriculumUnits.find(u => u.subject === selectedSubject);
                                  if (!unit) return null;
                                  return (
                                    <button
                                      onClick={() => handleGenerateQuestionForUnit(unit)}
                                      disabled={generatorLoading}
                                      className="flex items-center gap-1.5 bg-gradient-to-r from-vip-cyan to-blue-500 text-slate-950 font-extrabold text-[10px] px-3.5 py-2.5 rounded-xl cursor-pointer hover:opacity-90 disabled:opacity-50 transition-all text-vip-dark shadow-md"
                                      title="Fetch/Generate a brand-new practice MCQ from 14k+ archives"
                                    >
                                      {generatorLoading ? (
                                        <Cpu className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Sparkles className="w-3.5 h-3.5" />
                                      )}
                                      <span>Infinite Pool Call</span>
                                    </button>
                                  );
                                })()}

                                <button
                                  id="quiz-next-question-btn"
                                  onClick={handleNextMCQ}
                                  className="flex items-center gap-1.5 bg-vip-gold hover:bg-amber-500 text-vip-dark font-extrabold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer tracking-wider uppercase shadow-md shadow-vip-gold/15 animate-fade-in"
                                >
                                  <span>{currentMCQIndex < filteredMCQs.length - 1 ? (lang === 'amh' ? 'ቀጣይ ጥያቄ' : 'Next Question') : (lang === 'amh' ? 'ድገም (Restart)' : 'Restart Quiz')}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-20 bg-slate-950/40 rounded-3xl border border-vip-charcoal/40">
                            <AlertCircle className="w-12 h-12 text-vip-gold mx-auto block mb-3 animate-bounce" />
                            <h4 className="text-lg font-bold text-white">
                              {lang === 'amh' ? 'ቅድመ-የተጫነ ፈተና የለም' : 'No Preset Questions Loaded'}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto mb-6">
                              We have reached the end of custom preset questions for this subject. Tap below to query the 14,000+ ESSLCE premium dynamic database instantly!
                            </p>
                            {(() => {
                              const unit = curriculumUnits.find(u => u.id === selectedUnitId) || curriculumUnits.find(u => u.subject === selectedSubject);
                              if (!unit) return null;
                              return (
                                <button
                                  onClick={() => handleGenerateQuestionForUnit(unit)}
                                  disabled={generatorLoading}
                                  className="inline-flex items-center gap-2 bg-gradient-to-r from-vip-cyan to-blue-600 hover:from-blue-600 hover:to-vip-cyan disabled:opacity-50 text-slate-950 font-extrabold text-xs px-6 py-3.5 rounded-xl cursor-pointer shadow-lg transition-all text-vip-dark"
                                >
                                  {generatorLoading ? (
                                    <>
                                      <Cpu className="w-4 h-4 animate-spin" />
                                      <span>Querying 14k Pool...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-4 h-4 text-vip-dark animate-pulse" />
                                      <span>Retrieve 14k+ ESSLCE Prep Portal</span>
                                    </>
                                  )}
                                </button>
                              );
                            })()}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* High Quality Side-by-Side Analytics for practice scores */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-vip-charcoal/40 p-5 rounded-3xl flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Completed Score</span>
                        <span className="text-4xl font-mono font-black text-white block mt-1">
                          {((quizScore.correct / (quizScore.total || 1)) * 100).toFixed(0)}%
                        </span>
                        <span className="text-xs text-slate-400 mt-1 block">
                          {quizScore.correct} correct out of {quizScore.total} answered
                        </span>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-vip-charcoal/40">
                        <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-vip-gold to-emerald-500 transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(10, quizScore.total > 0 ? (quizScore.correct / quizScore.total) * 100 : 15))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-vip-charcoal/40 p-5 rounded-3xl flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block mb-2">{lang === 'amh' ? 'የጥናት ዕድገት ደረጃ' : 'Academic Level Scorecard'}</span>
                        <p className="text-[11px] text-gray-400 leading-relaxed leading-snug">
                          🏆 {quizScore.total === 0 
                            ? 'Start answering MCQs or fetch from the 14k+ pool to earn academic credentials.' 
                            : `Outstanding progress! Your high performance increases your placement priority into sovereign colleges such as AAU with premium priority.`}
                        </p>
                      </div>

                      <button
                        id="clear-quiz-history-btn"
                        onClick={() => {
                          if (confirm(lang === 'amh' ? 'እርግጠኛ ነዎት የፈተና ውጤትዎን ማጽዳት ይፈልጋሉ?' : 'Are you sure you want to reset your practice progress?')) {
                            setAnswersState({});
                            setRevealMCQAnswer(false);
                            setCurrentMCQIndex(0);
                          }
                        }}
                        className="text-center text-[10px] text-red-400 hover:text-red-300 transition-colors py-2 block border border-dashed border-red-900/30 rounded-xl cursor-pointer mt-4"
                      >
                        🗑️ {lang === 'amh' ? 'ውጤቶችን አጽዳ' : 'Reset My Scores'}
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 3: ETHIOPIAN UNIVERSITIES COMPREHENSIVE DIRECTORY */}
          {activeTab === 'universities' && (
            <motion.div
              id="view-universities-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Header section with Trigger form button */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-vip-gold uppercase tracking-[0.2em]">{lang === 'amh' ? 'ኢትዮጵያ ውስጥ የሚገኙ ከፍተኛ ትምህርት ቤቶች' : 'academic placement opportunities'}</span>
                  <h2 className="text-3xl font-display font-black text-white mt-1">
                    {lang === 'amh' ? <><span className="font-serif italic text-vip-gold">የሀገራችን</span> ታዋቂ ዩኒቨርሲቲዎች</> : <>Top <span className="font-serif italic text-vip-gold">Ethiopian</span> Universities</>}
                  </h2>
                </div>

                <button
                  id="add-uni-toggle-btn"
                  onClick={() => setShowAddUni(!showAddUni)}
                  className="flex items-center gap-2 bg-vip-gold hover:bg-amber-500 text-vip-dark font-extrabold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer uppercase shadow-md shadow-vip-gold/15 shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{showAddUni ? (lang === 'amh' ? 'ቅጹን ዝጋ' : 'Close Form') : (lang === 'amh' ? 'አዲስ ዩኒቨርሲቲ ጨምር' : 'Add University')}</span>
                </button>
              </div>

              {/* Dynamic Add University Form Drawer style */}
              {showAddUni && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-slate-900 border border-vip-gold rounded-3xl"
                >
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-vip-charcoal/40 pb-2">
                    🏛️ Introduce New Higher Education Institution
                  </h3>

                  {uniErrors && <p className="p-3 bg-red-950/40 text-red-400 border border-red-900/40 rounded-xl text-xs mb-4">⚠️ {uniErrors}</p>}

                  <form onSubmit={handleAddUniversity} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">University English Name <span className="text-red-500">*</span></label>
                        <input
                          id="new-uni-name-input"
                          type="text"
                          value={newUni.name}
                          onChange={(e) => setNewUni({ ...newUni, name: e.target.value })}
                          placeholder="e.g. Hawassa Tech College"
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Amharic Name <span className="text-red-500">*</span></label>
                        <input
                          id="new-uni-amharic-input"
                          type="text"
                          value={newUni.amharicName}
                          onChange={(e) => setNewUni({ ...newUni, amharicName: e.target.value })}
                          placeholder="ለምሳሌ፡ ሐዋሳ ቴክኒካል ኮሌጅ"
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Location City <span className="text-red-500">*</span></label>
                        <input
                          id="new-uni-location-input"
                          type="text"
                          value={newUni.location}
                          onChange={(e) => setNewUni({ ...newUni, location: e.target.value })}
                          placeholder="e.g. Hawassa, Ethiopia"
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Established Year</label>
                        <input
                          id="new-uni-est-input"
                          type="text"
                          value={newUni.established}
                          onChange={(e) => setNewUni({ ...newUni, established: e.target.value })}
                          placeholder="e.g. 1999"
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Placement Tier Category</label>
                        <select
                          id="new-uni-tier-select"
                          value={newUni.tier}
                          onChange={(e) => setNewUni({ ...newUni, tier: e.target.value as University['tier'] })}
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-lg p-2.5 text-xs text-white"
                        >
                          <option value="VIP Sovereign">VIP Sovereign (Flagship)</option>
                          <option value="Elite Tier-A">Elite Tier-A</option>
                          <option value="Technology Focus">Technology Focus (ASTU model)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">World Ranking</label>
                        <input
                          id="new-uni-worldrank-input"
                          type="number"
                          value={newUni.worldRank}
                          onChange={(e) => setNewUni({ ...newUni, worldRank: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">National Ranking</label>
                        <input
                          id="new-uni-natrank-input"
                          type="number"
                          value={newUni.nationalRank}
                          onChange={(e) => setNewUni({ ...newUni, nationalRank: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Natural Science Cutoff</label>
                        <input
                          id="new-uni-natcut-input"
                          type="number"
                          value={newUni.naturalCutoff}
                          onChange={(e) => setNewUni({ ...newUni, naturalCutoff: Number(e.target.value) })}
                          placeholder="e.g. 400"
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Social Science Cutoff</label>
                        <input
                          id="new-uni-soccut-input"
                          type="number"
                          value={newUni.socialCutoff}
                          onChange={(e) => setNewUni({ ...newUni, socialCutoff: Number(e.target.value) })}
                          placeholder="e.g. 380"
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Institution English Description</label>
                      <textarea
                        id="new-uni-desc-input"
                        value={newUni.description}
                        onChange={(e) => setNewUni({ ...newUni, description: e.target.value })}
                        placeholder="Describe campus legacy, research centers, or environment..."
                        className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-lg p-2.5 text-xs text-white h-20"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Key Departments (Comma Separated)</label>
                        <input
                          id="new-uni-depts-input"
                          type="text"
                          value={newUni.departments}
                          onChange={(e) => setNewUni({ ...newUni, departments: e.target.value })}
                          placeholder="Electrical Eng, Medicine, Forestry"
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Notable Alumni (Comma Separated)</label>
                        <input
                          id="new-uni-alumni-input"
                          type="text"
                          value={newUni.notableAlumni}
                          onChange={(e) => setNewUni({ ...newUni, notableAlumni: e.target.value })}
                          placeholder="Ministers, Industry Leaders, Scientists"
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <button
                      id="save-new-university-btn"
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider"
                    >
                      🚀 Authenticate & Save New University Space
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Grid block displaying institutions list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {universities.map((uni, idx) => {
                  
                  // Check if the student cut-off requirements match their choice
                  const matchCutoff = studentInfo.fieldStream === 'Natural Science' 
                    ? uni.admissionStats.naturalCutoff 
                    : uni.admissionStats.socialCutoff;

                  return (
                    <div 
                      key={uni.id} 
                      className="bg-slate-900 border border-vip-charcoal/60 rounded-3xl overflow-hidden shadow-lg hover:border-vip-gold/30 transition-all flex flex-col justify-between group relative"
                    >
                      {/* Gradient Header deco */}
                      <div className={`h-24 bg-gradient-to-r ${uni.bannerGradient} p-4 flex flex-col justify-between relative`}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-md"></div>
                        <span className="text-[10px] bg-slate-950/80 text-vip-gold px-2 py-0.5 rounded-full font-mono font-bold uppercase w-max tracking-widest border border-vip-gold/25">
                          Rank #{uni.nationalRank} (Ethiopia)
                        </span>
                        
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] text-white/80 font-bold tracking-tight uppercase flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-vip-gold" />
                            {uni.location}
                          </span>
                          <span className="text-[10px] text-gray-200 bg-black/40 px-1.5 py-0.5 rounded font-mono">EST. {uni.established}</span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-vip-gold transition-colors truncate">
                              {uni.name}
                            </h3>
                          </div>
                          
                          {/* Amharic Translation badge */}
                          <p className="text-xs text-vip-gold font-semibold font-display italic mt-0.5 tracking-wide">
                            {uni.amharicName}
                          </p>

                          <p className="text-xs text-gray-400 mt-3 leading-relaxed line-clamp-3">
                            {lang === 'amh' ? uni.amharicDescription : uni.description}
                          </p>

                          {/* Admission rules */}
                          <div className="mt-5 p-3.5 bg-slate-950 rounded-2xl border border-vip-charcoal/50 space-y-2">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">VIP Admission Criteria</span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500 block">Nat. Science Cutoff:</span>
                                <span className="font-mono font-bold text-white">{uni.admissionStats.naturalCutoff || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Soc. Science Cutoff:</span>
                                <span className="font-mono font-bold text-white">{uni.admissionStats.socialCutoff || 'N/A'}</span>
                              </div>
                            </div>
                            
                            {matchCutoff > 0 && (
                              <div className="pt-2 border-t border-vip-charcoal/30 flex items-center gap-1.5 text-[10px] text-gray-300">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Ideal Target for {studentInfo.fieldStream}</span>
                              </div>
                            )}
                          </div>

                          {/* Key Departments badge */}
                          <div className="mt-4 flex flex-wrap gap-1">
                            {uni.departments.slice(0, 3).map((dept, dIdx) => (
                              <span key={dIdx} className="text-[9px] bg-slate-950 text-slate-300 border border-vip-charcoal/40 px-2 py-0.5 rounded-full">
                                {dept}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Extra informational bullets for prestige */}
                        {uni.notableAlumni.length > 0 && (
                          <div className="mt-5 pt-3 border-t border-vip-charcoal/35">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold mb-1">Famous Alumni</span>
                            <span className="text-xs text-slate-300 line-clamp-1 italic">
                              🎓 {uni.notableAlumni[0]}
                            </span>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </motion.div>
          )}

          {/* TAB 4: INTERACTIVE AKSUM GPT PRO STUDY COMPANION */}
          {activeTab === 'aitutor' && (
            <motion.div
              id="view-ai-tutor-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Header Title with Custom Micro telemetry */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-vip-gold uppercase tracking-[0.2em]">{lang === 'amh' ? 'ሰው ሰራሽ አስተዋይ ረዳት' : 'ELITE EDUCATION CO-PILOT'}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="text-3xl font-display font-black text-white">Aksum GPT Pro</h2>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">TUNNELED LIVE</span>
                  </div>
                </div>

                {/* Micro user state feedback */}
                <div className="bg-slate-900 border border-vip-charcoal/60 px-4 py-2 rounded-2xl text-right text-xs">
                  <span className="text-gray-400 font-mono">Persona profile: </span>
                  <span className="text-vip-gold font-bold">{studentInfo.name.split(' ')[0]} ({studentInfo.fieldStream})</span>
                </div>
              </div>

              {/* Chat Canvas Section */}
              <div className="bg-slate-900 border border-vip-gold/15 rounded-3xl overflow-hidden flex flex-col h-[550px] relative">
                
                {/* Header dec banner */}
                <div className="bg-vip-slate/80 p-4 border-b border-vip-charcoal/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-vip-gold to-yellow-600 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-vip-dark" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">አክሱም GPT Pro (Aksum AI)</span>
                      <span className="text-[10px] text-gray-450 text-gray-400">Personalized with ESSLCE national exam templates + {studentInfo.school} context</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">{lang === 'amh' ? 'ደረጃ፡ ቪአይፒ' : 'VIP TIER ACTIVE'}</span>
                  </div>
                </div>

                {/* Messages space */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
                  {chatHistory.map((chat, idx) => {
                    const isAi = chat.sender === 'ai';
                    return (
                      <div 
                        key={idx} 
                        className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                      >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAi ? 'bg-gradient-to-br from-vip-gold to-amber-600 text-vip-dark' : 'bg-vip-cyan text-vip-dark font-extrabold text-xs'}`}>
                          {isAi ? <Cpu className="w-4 h-4" /> : studentInfo.name.charAt(0)}
                        </div>

                        {/* Speech Bubble */}
                        <div className={`rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${isAi ? 'bg-slate-950 border border-vip-charcoal/40 text-slate-100' : 'bg-vip-gold text-vip-dark font-medium'}`}>
                          {/* Parse simple markdown styles cleanly */}
                          <div className="space-y-2 whitespace-pre-wrap">
                            {chat.text.split('\n').map((line, lIdx) => {
                              if (line.startsWith('###')) {
                                return <h4 key={lIdx} className="font-bold text-sm md:text-base tracking-tight text-white border-b border-white/5 pb-1 mt-2">{line.replace('###', '')}</h4>;
                              }
                              if (line.startsWith('*')) {
                                return <p key={lIdx} className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-vip-gold">{line.replace('*', '').trim()}</p>;
                              }
                              return <p key={lIdx}>{line}</p>;
                            })}
                          </div>
                          
                          <span className={`text-[10px] block mt-2 text-right ${isAi ? 'text-gray-500' : 'text-amber-900'}`}>
                            {chat.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Loading animation indicator */}
                  {aiLoading && (
                    <div className="flex gap-3 mr-auto max-w-lg items-center">
                      <div className="w-8 h-8 rounded-full bg-vip-gold flex items-center justify-center animate-spin">
                        <Cpu className="w-4 h-4 text-vip-dark" />
                      </div>
                      <div className="bg-slate-950 border border-vip-charcoal/40 rounded-2xl p-4 text-xs text-gray-400">
                        <span>Thinking... Aksum GPT Pro is personalizing solution using formula matrix...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input action drawer */}
                <form onSubmit={handleSendChatMessage} className="bg-vip-slate/50 p-4 border-t border-vip-charcoal/45 flex gap-2">
                  <input
                    id="ai-prompt-input"
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder={lang === 'amh' ? 'ለምሳሌ፡ የፊዚክስ Coulomb Law ቀመርን አብራራልኝ...' : 'Ask about ESSLCE matric questions, math solutions, chemistry ideal gases...'}
                    className="flex-1 bg-slate-950 border border-vip-charcoal/70 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-vip-gold placeholder-gray-500"
                  />
                  <button
                    id="ai-send-message-btn"
                    type="submit"
                    className="bg-vip-gold hover:bg-amber-500 text-vip-dark p-3 rounded-xl transition-all font-bold aspect-square cursor-pointer flex items-center justify-center"
                    title="Send to tutor"
                    disabled={aiLoading}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            </motion.div>
          )}

          {/* TAB 5: FORMULA TOOLKIT AND EQUATIONS SEARCH ENGINE */}
          {activeTab === 'formulas' && (
            <motion.div
              id="view-toolkit-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Header Title with categorization and search keywords */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-vip-gold uppercase tracking-[0.2em]">{lang === 'amh' ? 'የሳይንስ እና ሒሳብ ፎርሙላዎች' : 'CORE STUDY EQUATION VAULT'}</span>
                  <h2 className="text-3xl font-display font-black text-white mt-1">
                    {lang === 'amh' ? 'የቪአይፒ ፎርሙላዎች ማከማቻ' : 'Matric Equation Toolkit'}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {/* Category switcher */}
                  {['All', 'Mathematics', 'Physics', 'Chemistry'].map((cat) => (
                    <button
                      id={`formula-cat-tab-${cat}`}
                      key={cat}
                      onClick={() => setSelectedFormulaCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedFormulaCategory === cat ? 'bg-vip-gold text-vip-dark' : 'bg-slate-900 border border-vip-charcoal/40 text-gray-300 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formula Search engine */}
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-3 text-gray-500 w-5 h-5" />
                <input
                  id="formula-search-input"
                  type="text"
                  value={formulaSearch}
                  onChange={(e) => setFormulaSearch(e.target.value)}
                  placeholder={lang === 'amh' ? 'ፎርሙላዎችን እዚህ ይፈልጉ (ለምሳሌ Ideal Gas, Power Rule...)' : 'Type to search formulas (e.g., ideal gas law, derivatives...)'}
                  className="w-full bg-slate-900 border border-vip-charcoal/60 rounded-xl py-3 pl-12 pr-4 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-vip-gold"
                />
              </div>

              {/* Grid block displaying equations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FORMULAS.filter(item => {
                  if (selectedFormulaCategory !== 'All' && item.subject !== selectedFormulaCategory) return false;
                  if (formulaSearch.trim() && !item.name.toLowerCase().includes(formulaSearch.toLowerCase()) && !item.topic.toLowerCase().includes(formulaSearch.toLowerCase())) return false;
                  return true;
                }).map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-slate-900 border border-vip-charcoal/50 rounded-3xl p-6 relative group overflow-hidden flex flex-col justify-between"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-vip-gold/5 rounded-full pointer-events-none"></div>
                    
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-vip-charcoal/40 mb-4">
                        <span className="text-[10px] bg-vip-gold/15 text-vip-gold px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                          📚 {item.subject} • {item.topic}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            id={`copy-formula-${item.id}`}
                            onClick={() => {
                              navigator.clipboard.writeText(item.formula);
                              alert(lang === 'amh' ? 'ፎርሙላው በታማኝነት ተገልብጧል!' : 'Formula copied successfully!');
                            }}
                            className="p-1.5 rounded-lg bg-vip-slate hover:bg-vip-charcoal/60 transition-all text-gray-400 hover:text-vip-gold cursor-pointer"
                            title="Copy Code"
                          >
                            <Clipboard className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-vip-gold transition-colors">{item.name}</h3>
                      
                      {/* The actual scientific equation content in high fidelity block */}
                      <div className="my-4 p-4 bg-slate-950 rounded-2xl border border-vip-gold/25 font-mono text-base md:text-xl text-gradient-gold font-extrabold flex items-center justify-center text-center">
                        <code className="text-vip-gold select-all tracking-wider">{item.formula}</code>
                      </div>

                      {/* Organized detailed structured notes */}
                      <div className="space-y-2 mt-2 bg-slate-950/30 p-3 rounded-xl border border-vip-charcoal/40 text-[11px] text-gray-300 leading-relaxed font-light">
                        <p className="font-semibold text-white text-[12px] pb-1 border-b border-vip-charcoal/30 flex items-center gap-1.5">
                          <span>📝</span> {lang === 'amh' ? 'የፈተና ማሳሰቢያ' : 'Essential Concept Note'}
                        </p>
                        <p className="text-gray-300">{item.description}</p>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-vip-charcoal/30 text-[10px] text-gray-400">
                          <div>
                            💡 <span className="font-semibold text-gray-300">{lang === 'amh' ? 'ቀዳሚ ጠቀሜታ' : 'Target Application'}</span>
                            <p>{item.id === 'form-01' ? (lang === 'amh' ? 'ቀጥተኛ መስመር ቁልቁለት' : 'Find slope coordinates') :
                               item.id === 'form-02' ? (lang === 'amh' ? 'ጋዝ ባህሪያት ማስላት' : 'State property solver') :
                               item.id === 'form-03' ? (lang === 'amh' ? 'የእንቅስቃሴ ኃይል' : 'Mechanical kinetic force') :
                               (lang === 'amh' ? 'ፈጣን ማደራጃ ሒሳብ' : 'Formula verification')}</p>
                          </div>
                          <div>
                            ⭐ <span className="font-semibold text-gray-300">{lang === 'amh' ? 'አስፈላጊነት ደረጃ' : 'Complexity Score'}</span>
                            <p className="text-vip-gold font-mono font-bold">⭐⭐⭐⭐⭐ (Critical)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Integrated custom calculator helper solver */}
                    <div className="mt-4">
                      <FormulaSolver item={item} lang={lang} />
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          )}

          {/* TAB 6: PREMIUM DOWNLOAD SYSTEM AND METADATA UTILITY */}
          {activeTab === 'download' && (
            <motion.div
              id="view-download-share-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Title Section */}
              <div>
                <span className="text-xs font-bold text-vip-gold uppercase tracking-[0.2em]">academic output manager</span>
                <h2 className="text-3xl font-display font-black text-white mt-1">
                  {lang === 'amh' ? 'ማውረጃ፣ ማጋሪያ እና የቪአይፒ መረጃ ማስተካከያ' : 'Export Study Plan & Profile Tools'}
                </h2>
              </div>

              {/* Real App Download & About App segment - PLACED AT THE TOP (Full-Width) for Easy access! */}
              <div className="bg-slate-900 border border-vip-gold/40 rounded-3xl p-6 md:p-8 space-y-5 shadow-lg shadow-vip-gold/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-vip-gold/5 rounded-full filter blur-2xl pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-vip-charcoal/40 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-vip-gold/15 text-vip-gold border border-vip-gold/25 shadow-md shadow-vip-gold/5">
                      <Download className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-lg font-display font-black text-white tracking-wide">
                        🏛️ {lang === 'amh' ? 'የቪአይፒ ሲስተም መጫኛ ማዕከል' : 'Academic VIP Standalone App Installer'}
                      </h4>
                      <p className="text-xs text-vip-gold font-mono uppercase tracking-widest font-bold">Standalone PWA Engine v2.5</p>
                    </div>
                  </div>
                  
                  {/* Installation Status Light */}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-vip-charcoal/40 select-none">
                    <span className={`w-2.5 h-2.5 rounded-full ${isAppInstalled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
                    <span className="text-[10px] font-mono font-black text-gray-350">
                      {isAppInstalled 
                        ? (lang === 'amh' ? 'ተጭኗል (ONLINE/OFFLINE ACTIVES)' : 'STANDALONE READY FOR DOWNLOAD') 
                        : (lang === 'amh' ? 'ለመጫን ዝግጁ' : 'READY TO SECURE LOCAL HIGH-SPEED INSTANT MODE')
                      }
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-3">
                    <p className="text-sm text-gray-200 leading-relaxed font-light">
                      {lang === 'amh' 
                        ? 'ይህ መተግበሪያ እንደ እውነተኛ ኔቲቭ መተግበሪያ (Native App) በኮምፒውተርዎ ወይም በስልክዎ ላይ በቀጥታ ተጭኖ እንዲሠራ ተደርጎ ተሠርቷል። ከተጫነ በኋላ 100% ያለ ምንም ኢንተርኔት (Offline) መክፈትና ማጥናት ይችላሉ።'
                        : 'Experience Aksum VIP Academy as a fully integrated native desktop or mobile application. By installing as a PWA, you gain lightning-fast offline execution, dedicated launcher icon, and zero web browser lag.'}
                    </p>
                    
                    {/* Benefit Checkpoints */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400 pt-2 border-t border-vip-charcoal/50">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-emerald-400 font-black">✓</span>
                        <p>{lang === 'amh' ? '100% ከመስመር ውጭ ይሰራል (ያለ ኔትወርክ' : 'Works 100% Offline (Study anytime)'}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-emerald-400 font-black">✓</span>
                        <p>{lang === 'amh' ? 'የኢንተርኔት ካርድ ወጪን ይቆጥባል' : 'Saves Mobile Data costs'}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-emerald-400 font-black">✓</span>
                        <p>{lang === 'amh' ? 'ከፍ ያለ ፍጥነትና የተሟላ የስክሪን እይታ' : 'Full-screen zero-browser latency'}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-emerald-400 font-black">✓</span>
                        <p>{lang === 'amh' ? 'የራሱ የመክፈቻ አዶ በስልክዎ ላይ' : 'Adds native home screen icon'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-950/80 border border-vip-charcoal/50 p-4 rounded-2xl space-y-3.5">
                    {/* INTERACTIVE PWA DOWNLOAD ACTION BUTTON */}
                    {isAppInstalled ? (
                      <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                        <div className="p-1.5 bg-emerald-500 rounded-lg text-slate-950">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-emerald-400">
                            {lang === 'amh' ? 'ይህ መተግበሪያ ቀድሞውኑ ተጭኗል!' : 'App Registered Standalone Mode!'}
                          </p>
                          <p className="text-[10px] text-gray-405">
                            {lang === 'amh' ? 'መተግበሪያውን በቀጥታ ከመነሻ ማያ ገጽዎ መክፈት ይችላሉ።' : 'You are running as an installed desktop / mobile application.'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button
                          id="native-pwa-install-btn"
                          onClick={handleNativeInstall}
                          className={`w-full text-xs font-black py-4 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-md ${
                            deferredPrompt 
                              ? 'bg-gradient-to-r from-vip-gold to-amber-600 hover:from-amber-600 hover:to-vip-gold text-vip-dark animate-pulse shadow-vip-gold/25' 
                              : 'bg-slate-900 border border-vip-charcoal/60 hover:border-vip-gold text-vip-gold hover:bg-slate-950'
                          }`}
                        >
                          <Sparkles className="w-4 h-4 animate-spin duration-[4000ms]" />
                          <span>
                            {deferredPrompt 
                              ? (lang === 'amh' ? 'መተግበሪያውን አሁን ጫን (Install App)' : 'INSTALL STANDALONE APP (VIP PWA)') 
                              : (lang === 'amh' ? 'በብሮውዘር በኩል ጫን (Manual Install)' : 'STANDALONE PREMIUM INSTALL')}
                          </span>
                        </button>
                        
                        <p className="text-[10px] text-gray-450 text-center leading-relaxed font-light">
                          {deferredPrompt 
                            ? (lang === 'amh' ? '✨ መተግበሪያውን ወዲያውኑ በእርስዎ ስልክ ወይም ፒሲ ላይ ለመጫን ከላይ ያለውን ቁልፍ ይጫኑ።' : '⚡ Single-click installation is fully supported on your browser! Press target key to install.')
                            : (lang === 'amh' ? '💡 በስልክዎ Chrome/Safari ላይ የ "Add to Home Screen" አማራጭ በመጠቀም መጫን ይችላሉ።' : '💡 Pro Tip: Tap on your web browser options menu and hit "Add to Home Screen" or "Install App" to secure offline mode.')}
                        </p>
                      </div>
                    )}

                    {/* Manual Mobile Shortcut Launcher Fallback */}
                    <div className="pt-3 border-t border-vip-charcoal/50 flex flex-col gap-2">
                      <button
                        id="trigger-web-shortcut"
                        onClick={() => {
                          const shortcutHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Aksum VIP Academy</title>
    <meta http-equiv="refresh" content="0;url=${window.location.href}">
    <style>body{background:#020617;color:#fff;font-family:sans-serif;text-align:center;padding:100px;}</style>
</head>
<body>
    <h2>Launching Aksum VIP Academy Portal...</h2>
    <p>Please wait while we establish offline-cached session.</p>
</body>
</html>`;
                          const blob = new Blob([shortcutHtml], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = 'Aksum_VIP_Academy.html';
                          link.click();
                          URL.revokeObjectURL(url);
                          alert(lang === 'amh' ? 'መተግበሪያውን በቀጥታ ለመክፈት የሚያገለግለው አቋራጭ ፋይል (Web App Launcher) ወርዷል!' : 'Standalone Web App Launcher HTML shortcut file has been successfully downloaded!');
                        }}
                        className="w-full bg-vip-gold/10 hover:bg-vip-gold/20 border border-vip-gold/30 hover:border-vip-gold text-vip-gold font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        📥 {lang === 'amh' ? 'የሞባይል ፈጣን ማስጀመሪያ ፋይል አውርድ' : 'Download Mobile Launcher Shortcut'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Split Onboarding Profile Settings and download system */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Onboarding Metadata editor (7 cols) */}
                <div className="lg:col-span-7 bg-slate-900 border border-vip-charcoal/50 rounded-3xl p-6 md:p-8">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-vip-gold" />
                    {lang === 'amh' ? 'የተመዘገቡ የቪአይፒ መረጃዎች ማሻሻያ' : 'Administer Student Information Credentials'}
                  </h3>

                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    {lang === 'amh' 
                      ? 'የጥናት መስክህን፣ መድረሻ ዩኒቨርሲቲህን ወይም ስምህን እዚህ በቀጥታ ማስተካከል ትችላለህ። የ AI ቱተር ጥቆማዎች አዲስ ካስገቡት መረጃ ጋር ወዲያውኑ የሚጣጣሙ ይሆናሉ።' 
                      : 'Audit and modify your registration profile metadata safely. Changes sync instantaneously across all active National Exam preparation algorithms and AI advisors.'}
                  </p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Student Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                          <input
                            id="edit-student-name"
                            type="text"
                            value={studentInfo.name}
                            onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                            className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Phone input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Contact Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                          <input
                            id="edit-student-phone"
                            type="text"
                            value={studentInfo.phone}
                            onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })}
                            className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white select-all"
                          />
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Prep School input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Preparatory Academy School</label>
                        <div className="relative">
                          <School className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                          <input
                            id="edit-student-school"
                            type="text"
                            value={studentInfo.school}
                            onChange={(e) => setStudentInfo({ ...studentInfo, school: e.target.value })}
                            className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Academic Stream Selection input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Curriculum Stream Stream</label>
                        <select
                          id="edit-student-stream"
                          value={studentInfo.fieldStream}
                          onChange={(e) => setStudentInfo({ ...studentInfo, fieldStream: e.target.value as StudentInfo['fieldStream'] })}
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-xl p-2.5 text-xs text-white font-bold text-vip-gold"
                        >
                          <option value="Natural Science">Natural Science (🔬 Science Stream)</option>
                          <option value="Social Science">Social Science (📚 Liberal Arts Stream)</option>
                        </select>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Target Placement input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Target Elite University</label>
                        <select
                          id="edit-student-target-uni"
                          value={studentInfo.targetUniversity}
                          onChange={(e) => setStudentInfo({ ...studentInfo, targetUniversity: e.target.value })}
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-xl p-2.5 text-xs text-white"
                        >
                          <option value="Addis Ababa University">Addis Ababa University</option>
                          <option value="Adama Science and Technology University">Adama Science & Tech university</option>
                          <option value="Addis Ababa Science and Technology University">Addis Ababa Science & Tech university</option>
                          <option value="University of Gondar">University of Gondar</option>
                          <option value="Jimma University">Jimma University</option>
                          <option value="Bahir Dar University">Bahir Dar University</option>
                          <option value="Hawassa University">Hawassa University</option>
                        </select>
                      </div>

                      {/* Onboarding Goal input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-vip-gold font-bold">Objective Target Score</label>
                        <input
                          id="edit-student-goal"
                          type="text"
                          value={studentInfo.primaryGoal}
                          onChange={(e) => setStudentInfo({ ...studentInfo, primaryGoal: e.target.value })}
                          className="w-full bg-slate-950 border border-vip-charcoal/80 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>

                    </div>

                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                      <p className="text-xs text-slate-200">
                        {lang === 'amh' 
                          ? 'የእርስዎ የጥናት መረጃዎች በአካባቢዎ ማከማቻ (Local Storage) ላይ በሚገባ ተቀምጠዋል!' 
                          : 'Profile credentials synchronized with cached localStorage successfully! No remote cloud synchronization required.'}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Exporter and code downloader (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* Digital study plan downloader */}
                  <div className="bg-slate-900 border border-vip-charcoal/50 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-vip-gold/5 rounded-full"></div>
                    
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Database className="w-4 h-4 text-vip-gold" />
                      {lang === 'amh' ? 'የግል የጥናት ሪፖርት ማውረጃ' : 'JSON Academic Report'}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                      {lang === 'amh' 
                        ? 'የሰላም ቪአይፒ ብሔራዊ ፈተናዎች ውጤትዎ፣ የትኩረት ጥናት ሰዓትዎት እና የመረጧቸውን ዩኒቨርሲቲዎች ሙሉ መረጃ በአንድ ፋይል ያውርዱ።' 
                        : 'Download your certified academic credentials, study times, exam scores, and target university cutoffs as a structured JSON file.'}
                    </p>

                    <button
                      id="download-study-json-btn"
                      onClick={triggerExportPlan}
                      className="w-full bg-gradient-to-r from-vip-gold to-amber-600 hover:from-amber-600 hover:to-vip-gold text-vip-dark font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-vip-gold/15"
                    >
                      <FileDown className="w-4 h-4 text-vip-dark" />
                      <span>{lang === 'amh' ? 'ሪፖርቱን በነጻ ያውርዱ' : 'Download JSON Plan'}</span>
                    </button>
                  </div>

                  {/* App Share and Deploy telemetry instructions */}
                  <div className="bg-slate-900 border border-vip-charcoal/50 rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-vip-cyan" />
                      {lang === 'amh' ? 'መተግበሪያውን ያጋሩ' : 'Share VIP Application'}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                      Share your custom VIP Education platform with fellow grade 12 students, teachers, and school counselors with a single click.
                    </p>

                    <button
                      id="share-app-copier-btn"
                      onClick={copyAppShareText}
                      className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        clipboardCopied 
                          ? 'bg-emerald-500 text-slate-950 shadow-none' 
                          : 'bg-slate-950 border border-vip-charcoal/80 text-white hover:border-vip-gold'
                      }`}
                    >
                      {clipboardCopied ? (
                        <>
                          <Check className="w-4 h-4 text-slate-950" />
                          <span>{lang === 'amh' ? 'የማጋሪያ ጽሁፉ ተገልብጧል!' : 'Copied Shareable Content!'}</span>
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-4 h-4 text-vip-gold" />
                          <span>{lang === 'amh' ? 'የማጋሪያ ሊንክ ቅዳ' : 'Copy Application Share'}</span>
                        </>
                      )}
                    </button>

                    <div className="mt-4 pt-4 border-t border-vip-charcoal/40 text-[10px] text-gray-500 leading-relaxed space-y-1.5">
                      <p>✨ <strong>Source Code Export:</strong> You can download this entire VIP fullstack codebase as a ZIP archive directly at any time by opening the <strong>Settings Menu</strong> at top-right of AI Studio platform.</p>
                      <p>📱 Built for fluid performance on both responsive Android setups and high-contrast desktop browsers.</p>
                    </div>
                  </div>


                    <div className="pt-3 border-t border-vip-charcoal/40 text-left space-y-3">
                      <button
                        id="toggle-terms-btn"
                        onClick={() => setShowTerms(!showTerms)}
                        className="w-full text-left flex items-center justify-between py-2 text-xs font-bold text-slate-305 hover:text-vip-gold transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          📜 {lang === 'amh' ? 'የአጠቃቀም ስምምነትና ግላዊነት ፖሊሲ' : 'Terms of Service & Privacy Policy'}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showTerms ? 'rotate-180 text-vip-gold' : 'text-gray-505'}`} />
                      </button>

                      <AnimatePresence>
                        {showTerms && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-950 p-3.5 rounded-xl border border-vip-gold/10 text-[10px] text-gray-400 space-y-2 leading-relaxed overflow-hidden font-sans"
                          >
                            <p className="font-bold text-slate-300 text-[11px] border-b border-vip-charcoal/40 pb-1 flex items-center justify-between">
                              <span>STUDENT FAIR STUDY LICENSE v2.3</span>
                              <span className="text-[9px] text-vip-gold px-1.5 py-0.5 rounded bg-vip-gold/10 font-mono">APPROVED</span>
                            </p>
                            
                            <p>
                              {lang === 'amh' 
                                ? 'ይህ በአክሱም ቪአይፒ አካዳሚ የቀረበ የፈተና መለማመጃ ፖርታል ነው። መተግበሪያውን በመጠቀም የሚከተሉትን ውሎችና ስምምነቶች ያከብራሉ፡'
                                : 'Welcome to the Aksum VIP Preparatory Portal. By registering and practicing, you enter our legal academic cooperation contract agreement.'}
                            </p>

                            <ol className="list-decimal list-inside space-y-1 text-slate-300">
                              <li>
                                <strong>{lang === 'amh' ? 'ብቸኛ ግላዊ አጠቃቀም' : 'Personal Educational Use'}</strong>: {lang === 'amh' ? 'ይህ የቪአይፒ አካውንት ለእርሶ ብቻ የተዘጋጀ ስለሆነ ለሌሎች ማጋራት ክልክል ነው።' : 'Practice modules are engineered solely for your private, secondary school ESSLCE preparation.'}
                              </li>
                              <li>
                                <strong>{lang === 'amh' ? 'ከመስመር ውጭ ሙሉ አቅም' : 'High-Performance Caching'}</strong>: {lang === 'amh' ? 'መተግበሪያው ከመስመር ውጭ እንዲሰራ መረጃዎቹ በስልክዎ ላይ ይቀመጣሉ።' : 'Dynamic MCQs are safely isolated via local storage keys to ensure robust multi-hour offline study sessions.'}
                              </li>
                              <li>
                                <strong>{lang === 'amh' ? 'የቅጂ መብት ማሳሰቢያ' : 'Content Integrity Policy'}</strong>: {lang === 'amh' ? 'የተካተቱትን 10,000+ ብሔራዊ የፈተና ጥያቄዎችና ማብራሪያዎችን የመገልበጥ ፈቃድ የለዎትም።' : 'Procedural data elements represent custom education models. Duplication or reverse engineering is strictly prohibited.'}
                              </li>
                            </ol>

                            <div className="mt-2.5 pt-2 border-t border-vip-charcoal/40 text-[9px] text-gray-500">
                              <p>Last modified: May 2026. Custom offline engine built with React 18 & high-contrast Aksumite decorative presets.</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="pt-2 border-t border-vip-charcoal/40 space-y-2 text-[11px] text-gray-500 leading-relaxed">
                        <p className="font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                          <span>🚨 {lang === 'amh' ? 'የቴክኒክ እገዛ እና ድጋፍ ጥሪዎች (Support)' : 'Official Academy Assistance Support'}</span>
                        </p>
                        <p>{lang === 'amh' ? 'ለፖሊሲ ማሻሻያ፣ ለምዝገባ ጥያቄ ወይም ለማንኛውም ጥቆማ በስልክና በኢሜል ያግኙን፡' : 'For terms compliance questions, licensing validation, or general technical support queries, contact our premium line:'}</p>
                        <ul className="space-y-1.5 font-mono text-vip-gold mt-1.5 text-xs">
                          <li className="flex items-center gap-2">
                            <span>📞</span> 
                            <span>Phone Support:</span>
                            <a href="tel:+251900882116" className="font-bold underline hover:text-white">+251 900 882 116</a>
                          </li>
                          <li className="flex items-center gap-2">
                            <span>✉️</span> 
                            <span>Email Support:</span>
                            <a href="mailto:ezrat2116@gmail.com" className="font-bold underline hover:text-white font-mono">ezrat2116@gmail.com</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Universal Floating PWA App Installer Pod - "One Place Access Button" */}
      <div className="fixed bottom-[84px] lg:bottom-6 right-4 lg:right-6 z-45 font-sans">
        <AnimatePresence>
          {showPwaBanner ? (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="bg-slate-900 border border-vip-gold/45 rounded-2xl p-4 shadow-2xl max-w-[340px] md:max-w-[380px] text-left relative overflow-hidden backdrop-blur-xl"
            >
              {/* Gold gradient shine */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-vip-gold/15 rounded-full filter blur-xl pointer-events-none"></div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowPwaBanner(false);
                  localStorage.setItem('selam_vip_pwa_dismissed', 'true');
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-vip-gold transition-colors p-1 rounded-full hover:bg-slate-950 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-start gap-3.5 pr-6">
                <div className="p-2.5 rounded-xl bg-vip-gold/10 border border-vip-gold/30 text-vip-gold shadow-md">
                  <Download className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h5 className="text-[12px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
                    <span>{lang === 'amh' ? 'ቪአይፒ መተግበሪያ' : 'VIP Standalone App'}</span>
                    <span className="text-[8px] bg-vip-gold/10 text-vip-gold px-1.5 py-0.5 rounded font-mono font-black">PWA</span>
                  </h5>
                  <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                    {lang === 'amh' 
                      ? 'ያለ ኔትወርክ (100% Offline) በፍጥነት እንዲሰራ መተግበሪያውን በቀጥታ ስልክዎ ላይ ይጫኑት!' 
                      : 'Install on your device home screen for lightning fast 100% offline study experience!'}
                  </p>
                </div>
              </div>

              {/* Action Rows */}
              <div className="mt-4 pt-3 border-t border-vip-charcoal/40 flex items-center gap-2">
                <button
                  onClick={handleNativeInstall}
                  className="flex-1 bg-gradient-to-r from-vip-gold to-amber-600 hover:from-amber-600 hover:to-vip-gold text-vip-dark font-black text-[11px] py-2 px-3 rounded-lg transition-all shadow-md shadow-vip-gold/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-spin duration-[6000ms]" />
                  <span>{lang === 'amh' ? 'ጫን / DOWNLOAD' : 'Install Standalone'}</span>
                </button>

                <button
                  onClick={() => {
                    const shortcutHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Aksum VIP Academy</title>
    <meta http-equiv="refresh" content="0;url=${window.location.href}">
    <style>body{background:#020617;color:#fff;font-family:sans-serif;text-align:center;padding:100px;}</style>
</head>
<body>
    <h2>Launching Aksum VIP Academy Portal...</h2>
    <p>Please wait while we establish offline-cached session.</p>
</body>
</html>`;
                    const blob = new Blob([shortcutHtml], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'Aksum_VIP_Academy.html';
                    link.click();
                    URL.revokeObjectURL(url);
                    alert(lang === 'amh' ? 'የመጫኛ አቋራጭ ማስጀመሪያ ፋይል ወርዷል!' : 'Launcher shortcut file downloaded successfully!');
                  }}
                  className="px-2.5 py-2 bg-slate-950 border border-vip-charcoal/60 hover:border-vip-gold text-vip-gold hover:text-white rounded-lg transition-all text-[11px] font-bold cursor-pointer"
                  title={lang === 'amh' ? 'ማስጀመሪያ አቋራጭ አውርድ' : 'Download Shortcut Fallback'}
                >
                  📲 Shortcut
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setShowPwaBanner(true)}
              className="bg-slate-900 border-2 border-vip-gold/70 hover:border-vip-gold text-vip-gold hover:text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 group relative"
              title={lang === 'amh' ? 'መተግበሪያውን ጫን' : 'Install Standalone App'}
            >
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              <Download className="w-5 h-5 animate-bounce" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Aesthetic humanized footer decal element for prestige */}
      <footer id="app-footer-decal" className="mt-auto border-t border-vip-charcoal/40 bg-slate-950/80 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="text-left/5 uppercase/5">
            <p className="font-extrabold text-gray-400 tracking-wider">🔒 SELAM VIP ACADEMY PORTAL</p>
            <p className="mt-1">The Highest Standard of Ethiopian Preparatory Excellence.</p>
          </div>

          <div className="flex gap-4">
            <span className="hover:text-vip-gold transition-colors select-none cursor-help">Grade 12 Matric Study Module</span>
            <span>•</span>
            <span className="hover:text-vip-gold transition-colors select-none cursor-help">Amharic Support Activated</span>
          </div>

          <div>
            <p>© 2026 Selam VIP educational system. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
