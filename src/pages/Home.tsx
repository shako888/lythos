import Hero from '../components/Hero';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Zap, Award, Clock, ArrowRight } from 'lucide-react';

const reasons = [
  {
    icon: <Award className="w-7 h-7" />,
    title: "HSK 6 Mastery Standard",
    desc: "I achieved Distinction in O-Level Chinese. My curriculum is built upon the rigorous HSK 6 standard, ensuring you have the profound vocabulary and comprehension needed to conquer the O-Levels easily.",
  },
  {
    icon: <BookOpen className="w-7 h-7" />,
    title: 'Laser-Focused on Syllabus 1160',
    desc: "I don't teach generic Chinese. Every lesson, every exercise, every mock paper is built around the exact 1160 exam format.",
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: 'Rapid Progress, Proven Method',
    desc: 'My students see grade improvements within weeks because I identify weak points early and target them with precision.',
  },
  {
    icon: <Clock className="w-7 h-7" />,
    title: 'Flexible & Personal',
    desc: 'Small-group or 1-on-1 sessions that fit your schedule. No cookie-cutter lessons — everything is tailored to you.',
  },
];

export default function Home() {
  return (
    <main className="bg-[#f8fafc] dark:bg-[#0a0f1c] transition-colors duration-500">
      <Hero />

      {/* Why Choose Lythos */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-transparent relative border-t border-slate-200/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Why Lythos</span>
            <h2 className="text-4xl font-serif font-bold text-slate-900 dark:text-slate-50 mt-2 mb-4">
              The Lythos Advantage
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Not every tutor is the same. Here's what makes Lythos different.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="flex gap-5 p-6 bg-white dark:bg-[#111827]/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all transform hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 flex-shrink-0 text-slate-700 dark:text-slate-200">
                  {r.icon}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">{r.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Trial CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-[#111827] relative overflow-hidden border-t border-b border-slate-800 dark:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-emerald-600/10 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="inline-block bg-white/10 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Limited Spots Available
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Your First Class is<br />
            <span className="italic">Completely Free.</span>
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
            No pressure, no commitment. Come for one class, see my teaching style, and decide if Lythos is right for you.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-4 rounded-full text-base hover:bg-slate-100 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
          >
            Claim Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

    </main>
  );
}
