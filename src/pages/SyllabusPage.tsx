import { motion } from 'framer-motion';
import { BookOpen, Edit3, Headphones, Award, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AIChatbot from '../components/AIChatbot';

const HERO_IMG = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2070&auto=format&fit=crop';

const olvlPapers = [
  { title: "Paper 1: Writing (作文)", icon: <Edit3 className="w-6 h-6" />, desc: "Master narrative and argumentative essays with examiner-approved structures and expanded vocabulary banks.", weightage: "30%" },
  { title: "Paper 2: Comprehension", icon: <BookOpen className="w-6 h-6" />, desc: "Precision techniques for MCQ, cloze passages, and open-ended questions — targeting exactly what examiners look for.", weightage: "35%" },
  { title: "Paper 3: Oral & Listening", icon: <Headphones className="w-6 h-6" />, desc: "Build spoken fluency and active listening skills to score full marks in reading aloud and conversation components.", weightage: "35%" },
];

const hskLevels = [
  {
    level: "HSK 1", label: "Absolute Beginner", vocab: "150 words",
    goals: ["Basic greetings & introductions", "Numbers, dates, and time", "Simple everyday phrases"],
    color: "from-emerald-400 to-teal-500",
  },
  {
    level: "HSK 2", label: "Elementary", vocab: "300 words",
    goals: ["Simple conversations on familiar topics", "Shopping, directions, weather", "Basic sentence structures"],
    color: "from-teal-400 to-cyan-500",
  },
  {
    level: "HSK 3", label: "Pre-Intermediate", vocab: "600 words",
    goals: ["Handle most travel situations in China", "Express opinions simply", "Read & write basic paragraphs"],
    color: "from-cyan-400 to-blue-500",
  },
  {
    level: "HSK 4", label: "Intermediate", vocab: "1200 words",
    goals: ["Fluent discussions on wide range of topics", "Understanding native speech", "Writing structured compositions"],
    color: "from-blue-400 to-indigo-500",
  },
  {
    level: "HSK 5", label: "Upper-Intermediate", vocab: "2500 words",
    goals: ["Engage with Chinese media & literature", "Professional business contexts", "Complex written & spoken output"],
    color: "from-indigo-400 to-violet-500",
  },
  {
    level: "HSK 6", label: "Advanced Mastery", vocab: "5000+ words",
    goals: ["Full professional fluency", "Native-equivalent comprehension", "Equivalent to O-Level Distinction standard"],
    color: "from-violet-500 to-purple-600",
    highlight: true,
  },
];

const card = "bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 transform hover:-translate-y-1";

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1c] transition-colors duration-300">

      {/* Hero Banner with Unsplash bg */}
      <div className="relative h-72 md:h-96 flex items-end overflow-hidden">
        <img src={HERO_IMG} alt="Library background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 border border-white/30">
              O-Level & HSK 1–6
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Our Programs</h1>
            <p className="text-slate-300 mt-2 text-lg max-w-2xl">
              Two specialized tracks — O-Level Syllabus 1160 for secondary students, and HSK 1–6 for adult learners.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">

        {/* O-Level Track */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-20">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center shadow-md">
                <Award className="w-5 h-5 text-white dark:text-slate-900" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-50">O-Level Chinese</h2>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Syllabus 1160 — For Secondary School Students</p>
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold px-3 py-1 rounded-full border border-emerald-500/20 shadow-sm">$50/hr</span>
                </div>
              </div>
            </div>
            <Link to="/register" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white hover:gap-3 transition-all">
              Enroll Now <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {olvlPapers.map((paper, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} className={`${card} p-7 flex flex-col`}>
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-5 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm">
                  {paper.icon}
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mb-2">{paper.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow">{paper.desc}</p>
                <div className="pt-4 border-t border-slate-100 dark:border-white/10 mt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Exam Weightage</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-50">{paper.weightage}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="relative my-2 mb-16">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/10" /></div>
          <div className="relative flex justify-center"><span className="px-4 bg-[#f8fafc] dark:bg-[#0a0f1c] text-slate-400 text-sm font-medium">Also Available</span></div>
        </div>

        {/* HSK Track */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-5 h-5 text-white dark:text-slate-900" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-50">HSK Mastery</h2>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <p className="text-sm text-slate-500 dark:text-slate-400">HSK 1–6 — For Adult Learners & Professionals</p>
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold px-3 py-1 rounded-full border border-emerald-500/20 shadow-sm">$45/hr</span>
                </div>
              </div>
            </div>
            <Link to="/register" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white hover:gap-3 transition-all">
              Enroll Now <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hskLevels.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl overflow-hidden border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${l.highlight ? 'border-violet-400 dark:border-violet-500 shadow-lg shadow-violet-100 dark:shadow-violet-900/20' : 'border-slate-100 dark:border-white/10 shadow-sm'}`}
              >
                {/* Gradient header strip */}
                <div className={`h-2 w-full bg-gradient-to-r ${l.color}`} />
                <div className="bg-white dark:bg-[#111827] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-50">{l.level}</p>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{l.label}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${l.color} text-white`}>
                      {l.vocab}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {l.goals.map((g, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${l.color} mt-1.5 flex-shrink-0`} />
                        {g}
                      </li>
                    ))}
                  </ul>
                  {l.highlight && (
                    <div className="mt-4 pt-4 border-t border-violet-100 dark:border-violet-900/30">
                      <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">★ O-Level Equivalent Standard</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <AIChatbot />
    </div>
  );
}
