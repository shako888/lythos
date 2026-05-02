import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';

const HERO_IMG = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2070&auto=format&fit=crop';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-screen Unsplash background */}
      <div className="absolute inset-0 -z-10">
        <img src={HERO_IMG} alt="Study background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/80 dark:bg-[#0a0f1c]/85 backdrop-blur-[2px]" />
        {/* Radial glow accents */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-slate-300/30 dark:bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-200/40 dark:bg-emerald-900/15 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text Content */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <Award className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Proficient in Syllabus 1160</span>
            </motion.div>

            {/* Staggered Chinese Title */}
            <div className="mb-4 overflow-hidden flex flex-wrap">
              {['精', '通', '中', '文', '，', '成', '就', '未', '来'].map((char, index) => (
                <motion.span
                  key={index}
                  className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mr-1"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.07, ease: 'easeOut' }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <motion.h1 variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-800 dark:text-slate-100 leading-tight mb-6">
              Master Chinese with Confidence.
            </motion.h1>

            <motion.p variants={itemVariants}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-lg leading-relaxed font-light">
              Expert tuition for O-Level Syllabus 1160 &amp; HSK 1–6, by a local University student with a proven Distinction track record.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link to="/register"
                className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-all transform hover:scale-105 active:scale-95 shadow-xl">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/syllabus"
                className="inline-flex justify-center items-center px-8 py-4 text-base font-medium text-slate-900 dark:text-white bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-600 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm">
                View Programs
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image Card */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.5, ease: 'easeOut' }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200/50 dark:ring-white/10">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"
                alt="Student studying"
                className="object-cover w-full h-full scale-105 hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

              {/* Floating badge */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="absolute bottom-6 left-5 right-5 bg-white/20 dark:bg-black/30 backdrop-blur-xl border border-white/30 p-4 rounded-2xl flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="font-serif font-bold text-2xl text-slate-900">A</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Proven Results</p>
                  <p className="text-slate-200 text-sm">Straight Distinctions in Chinese</p>
                </div>
              </motion.div>
            </div>

            {/* Spinning ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-dashed border-slate-300/40 dark:border-white/10 rounded-full -z-10"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
