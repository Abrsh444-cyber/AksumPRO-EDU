import { useMemo } from 'react';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface StudySession {
  day: string;
  minutes: number;
  questionsSolved: number;
}

interface AnalyticsDashboardProps {
  lang: 'amh' | 'eng';
  completedMinutes: number;
  dailyStreak: number;
  totalQuestionsSolved: number;
  accuracyRate: number; // e.g., 85 for 85%
  studyHistory?: StudySession[];
}

export default function AnalyticsDashboard({
  lang,
  completedMinutes,
  dailyStreak,
  totalQuestionsSolved,
  accuracyRate,
  studyHistory
}: AnalyticsDashboardProps) {

  // Dynamic localization labels
  const UI_LABELS = {
    dashboardTitle: lang === 'amh' ? '📊 የእንቅስቃሴ እና ጥናት ትንታኔ' : '📊 Advanced Learning Analytics',
    dashboardSub: lang === 'amh' ? 'የዕለት ተዕለት ጥናትዎን እና የፈተና ውጤትዎን ይከታተሉ' : 'Monitor academic activity, streak consistency, and progress metrics.',
    studyMins: lang === 'amh' ? 'የተጠናበት ደቂቃ' : 'Study Duration',
    streakTitle: lang === 'amh' ? 'የቀናት ድግግሞሽ' : 'Daily Streak',
    streakSub: lang === 'amh' ? 'ቀጣይነት ያለው ቀናት' : 'Consecutive Days',
    questionsTitle: lang === 'amh' ? 'የተመለሱ ጥያቄዎች' : 'Questions Resolved',
    accuracyTitle: lang === 'amh' ? 'የምላሽ ትክክለኛነት' : 'Average Accuracy',
    weeklyTrend: lang === 'amh' ? 'የሳምንቱ የጥናት ደቂቃዎች ድምር' : 'Weekly Engagement Curve',
    trendTip: lang === 'amh' ? 'ደቂቃ' : 'mins',
    activePulse: lang === 'amh' ? 'ቀጥታ ስርጭት አገልግሎት ንቁ' : 'Live Analytics Node Active'
  };

  // Safe fallback mock data for the weekly area chart if none provided
  const chartData = useMemo(() => {
    if (studyHistory && studyHistory.length > 0) return studyHistory;
    return [
      { day: lang === 'amh' ? 'ሰኞ' : 'Mon', minutes: 25, questionsSolved: 8 },
      { day: lang === 'amh' ? 'ማክሰኞ' : 'Tue', minutes: 45, questionsSolved: 12 },
      { day: lang === 'amh' ? 'ረቡዕ' : 'Wed', minutes: 30, questionsSolved: 5 },
      { day: lang === 'amh' ? 'ሐሙስ' : 'Thu', minutes: 60, questionsSolved: 20 },
      { day: lang === 'amh' ? 'ዓርብ' : 'Fri', minutes: 40, questionsSolved: 15 },
      { day: lang === 'amh' ? 'ቅዳሜ' : 'Sat', minutes: 75, questionsSolved: 25 },
      { day: lang === 'amh' ? 'እሁድ' : 'Sun', minutes: completedMinutes > 0 ? completedMinutes : 35, questionsSolved: 10 }
    ];
  }, [studyHistory, completedMinutes, lang]);

  return (
    <div className="space-y-6">
      
      {/* Dashboard Top Heading Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-vip-slate/40 to-transparent p-4 rounded-2xl border border-[#cca43b]/10 backdrop-blur-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-vip-gold/10 border border-[#cca43b]/25 text-[10px] text-vip-gold font-mono font-bold uppercase tracking-wider animate-pulse">
            <span className="w-1.5 h-1.5 bg-vip-gold rounded-full" />
            <span>{UI_LABELS.activePulse}</span>
          </div>
          <h2 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
            {UI_LABELS.dashboardTitle}
          </h2>
          <p className="text-xs text-slate-400">
            {UI_LABELS.dashboardSub}
          </p>
        </div>
        
        {/* Quick Streak Visualizer */}
        <div className="flex items-center gap-3 bg-[#0a0f1d] p-3 rounded-xl border border-slate-800 shrink-0">
          <Flame className="w-6 h-6 text-orange-500 fill-orange-500/20 stroke-[2px]" />
          <div>
            <div className="text-xs text-slate-400 font-mono leading-none lowercase">
              {UI_LABELS.streakTitle}
            </div>
            <div className="text-base font-black font-display text-white">
              {dailyStreak} 🔥 <span className="text-[10px] text-slate-500 font-normal">days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key SaaS Academic Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric Card 1: Study Minutes */}
        <div className="p-4 rounded-xl border border-slate-800 bg-gradient-to-b from-[#111827]/80 to-[#0e131f]/80 relative overflow-hidden group hover:border-[#cca43b]/25 transition duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-vip-gold/5 rounded-full filter blur-[35px] group-hover:bg-vip-gold/10 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">{UI_LABELS.studyMins}</span>
            <div className="p-1.5 rounded-lg bg-vip-gold/10 text-vip-gold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-display text-white">{completedMinutes}</span>
            <span className="text-[10px] text-slate-500 font-semibold">min</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+12% vs last week</span>
          </div>
        </div>

        {/* Metric Card 2: Questions Solved */}
        <div className="p-4 rounded-xl border border-slate-800 bg-gradient-to-b from-[#111827]/80 to-[#0e131f]/80 relative overflow-hidden group hover:border-cyan-500/25 transition duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full filter blur-[35px] group-hover:bg-cyan-500/10 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">{UI_LABELS.questionsTitle}</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-display text-white">{totalQuestionsSolved}</span>
            <span className="text-[10px] text-slate-500 font-semibold">items</span>
          </div>
          <div className="mt-2 text-[10px] text-cyan-400 flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3 h-3" />
            <span>Target: 100/week</span>
          </div>
        </div>

        {/* Metric Card 3: Target Accuracy */}
        <div className="p-4 rounded-xl border border-slate-800 bg-gradient-to-b from-[#111827]/80 to-[#0e131f]/80 relative overflow-hidden group hover:border-emerald-500/25 transition duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-[35px] group-hover:bg-emerald-500/10 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">{UI_LABELS.accuracyTitle}</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-display text-white">{accuracyRate}%</span>
            <span className="text-[10px] text-slate-500 font-semibold">correct</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3" />
            <span>Top 5% nationwide</span>
          </div>
        </div>

        {/* Metric Card 4: Daily Streak Indicator */}
        <div className="p-4 rounded-xl border border-slate-800 bg-gradient-to-b from-[#111827]/80 to-[#0e131f]/80 relative overflow-hidden group hover:border-orange-500/25 transition duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full filter blur-[35px] group-hover:bg-orange-500/10 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">{UI_LABELS.streakTitle}</span>
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-display text-white">{dailyStreak}</span>
            <span className="text-[10px] text-slate-500 font-semibold">{UI_LABELS.streakSub}</span>
          </div>
          <div className="mt-2 text-[10px] text-yellow-500 flex items-center gap-1 font-mono">
            <span>🔥 Streak Shield Enabled</span>
          </div>
        </div>
      </div>

      {/* Main Weekly Line / Area chart */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c111e]/90 space-y-4">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-300 flex items-center justify-between">
          <span>📉 {UI_LABELS.weeklyTrend}</span>
          <span className="text-[10px] text-slate-500 font-mono tracking-tight lowercase">units: minutes / day</span>
        </h3>
        
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b/30" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                axisLine={{ stroke: '#334155/30' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                axisLine={{ stroke: '#334155/30' }}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="p-3 bg-[#111827] border border-vip-gold/30 rounded-xl shadow-xl text-xs font-mono space-y-1">
                        <p className="text-slate-400 font-semibold">{payload[0].payload.day}</p>
                        <p className="text-vip-gold font-bold">
                          ⏱️ {payload[0].value} {UI_LABELS.trendTip}
                        </p>
                        {payload[0].payload.questionsSolved !== undefined && (
                          <p className="text-cyan-400">
                            📝 {payload[0].payload.questionsSolved} questions
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="minutes" 
                stroke="#f59e0b" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#goldGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
