import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, GraduationCap, BookOpen, Users } from 'lucide-react';

const BANNER_IMG = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop';
const PROFILE_IMG = 'https://images.unsplash.com/photo-1529539795054-3c162aab037a?q=80&w=800&auto=format&fit=crop';

const credentials = [
  { icon: <GraduationCap className="w-5 h-5" />, label: 'Local University Student', sub: 'Currently enrolled, with deep academic roots in Chinese' },
  { icon: <BookOpen className="w-5 h-5" />, label: 'Distinction in O-Level Chinese', sub: 'Straight A results, first-hand knowledge of Syllabus 1160' },
  { icon: <Users className="w-5 h-5" />, label: 'HSK 6 Proficiency', sub: 'Advanced Chinese fluency equivalent to native professional standard' },
];

const reasons = [
  'First-hand experience with Syllabus 1160 — I sat the exact same exam',
  'Proven Distinction track record throughout my academic journey',
  'Customized lesson plans and targeted mock papers for every student',
  'O-Level & HSK programs tailored to your individual goals',
  'Focused on exam technique and real comprehension, not rote learning',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1c] transition-colors duration-300">

      {/* Hero Banner */}
      <div className="relative h-72 md:h-80 flex items-end overflow-hidden">
        <img src={BANNER_IMG} alt="Student studying" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">About Me</h1>
            <p className="text-slate-300 text-lg mt-2">Your Tutor — A Student Who's Been Exactly Where You Are</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — Profile Image & Credentials */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
            <div className="relative max-w-sm mx-auto lg:mx-0">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200 dark:ring-white/10">
                <img src={PROFILE_IMG} alt="Tutor" className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}
                className="absolute -bottom-5 -right-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-11 h-11 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-serif font-bold text-xl text-white dark:text-slate-900">A</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Distinction</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">O-Level Chinese</p>
                </div>
              </motion.div>
            </div>

            {/* Credential Cards */}
            <div className="mt-12 space-y-3">
              {credentials.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
                  className="flex items-center gap-4 bg-white dark:bg-[#111827] border border-slate-100 dark:border-white/10 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                    {c.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{c.label}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{c.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Story & Why Choose Me */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
            className="space-y-8 pt-4"
          >
            <div className="space-y-5 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              <p>
                Hello! I'm a local university student with a deep passion for the Chinese language. Having navigated Singapore's rigorous education system myself, I understand exactly what it takes to excel.
              </p>
              <p>
                I consistently achieved <strong className="text-slate-900 dark:text-white">Straight A's</strong> in Chinese throughout my academic journey. My approach goes beyond rote memorization — I focus on understanding the nuances of the language and mastering the specific requirements of SEAB examiners.
              </p>
              <p>
                I offer both <strong className="text-slate-900 dark:text-white">O-Level Syllabus 1160</strong> tuition for secondary students and <strong className="text-slate-900 dark:text-white">HSK 1–6</strong> mastery for adult learners. I'm proficient in Chinese to an advanced level, enabling me to guide students at every stage of their language journey.
              </p>
            </div>

            {/* Why Choose Me */}
            <div className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-5">Why Choose Me?</h3>
              <ul className="space-y-3.5">
                {reasons.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <Link to="/register"
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold px-7 py-3.5 rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-all transform hover:scale-105 shadow-lg">
              Book a Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
