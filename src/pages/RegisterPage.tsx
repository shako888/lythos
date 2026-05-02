import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CheckSquare, Square, ChevronRight, ChevronLeft, X, AlertCircle } from 'lucide-react';
import LythosCaptcha from '../components/LythosCaptcha';

const inputClass = 'w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-300 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-400 shadow-sm';
const selectClass = 'w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-300 focus:border-transparent outline-none transition-all shadow-sm cursor-pointer';
const labelClass = 'block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2';

const WEAK_TOPICS = [
  { id: 'writing', label: '写作 Writing (作文)' },
  { id: 'comprehension', label: '阅读 Comprehension' },
  { id: 'oral', label: '口语 Oral (朗读 & 对话)' },
  { id: 'listening', label: '听力 Listening' },
  { id: 'grammar', label: '语法 Grammar & Sentence Structure' },
  { id: 'vocab', label: '词汇 Vocabulary Expansion' },
  { id: 'cloze', label: '填空 Cloze Passage' },
];

const HEAR_FROM = ['Instagram', 'Google Search', 'Friend / Referral', 'Carousell', 'School', 'Other'];

function Modal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-8 max-w-sm w-full text-center"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X className="w-5 h-5" />
        </button>
        <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-amber-500" />
        </div>
        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">Hold On!</h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Got it
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [modalMsg, setModalMsg] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '', parentName: '', age: '', email: '', phone: '',
    lessonType: '', // 'olevel' or 'hsk'
    school: '', currentGrade: '', targetGrade: 'A1',
    hskCurrentLevel: '', hskTargetLevel: '', adultGoal: '',
    preferredDay: '', preferredTime: '', hearFrom: '', message: '',
    freeTrial: false,
    website: '' // HONEY POT: This field is hidden from humans
  });

  const isHSK = formData.lessonType === 'hsk';
  const isMinor = parseInt(formData.age) < 18 && formData.age !== '';

  // Steps: Personal → Academic → (Weak Areas if olevel) → Schedule
  const totalSteps = isHSK ? 3 : 4;
  const stepLabels = isHSK
    ? ['Personal', 'HSK Profile', 'Schedule']
    : ['Personal', 'O-Level Profile', 'Weak Areas', 'Schedule'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTopic = (id: string) =>
    setWeakTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const canProceed = () => {
    if (step === 0) return formData.studentName && formData.age && formData.email && formData.phone && formData.lessonType && (!isMinor || formData.parentName);
    if (step === 1) return isHSK ? !!formData.hskCurrentLevel : !!formData.school;
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    // BOT DETECTION: Check Honey Pot (Direct DOM check for instant detection)
    const honeypotEl = document.getElementById('website') as HTMLInputElement;
    const isBot = (honeypotEl && honeypotEl.value !== '') || formData.website !== '';

    if (isBot) {
      console.warn("Honey Pot caught a bot!");
      setStatus('submitting');
      try {
        // Fetch IP
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        const ip = data.ip;
        const ipDocId = ip.replace(/\./g, '_');
        const docRef = doc(db, 'banned_ips', ipDocId);
        
        // Read current strikes
        const snap = await getDoc(docRef);
        let strikes = 1;
        if (snap.exists()) {
          strikes = (snap.data().strikes || 0) + 1;
        }

        const now = new Date();
        const penaltyData: any = { ip, strikes, lastTriggered: serverTimestamp() };

        if (strikes >= 5) {
          // 24-hour ban
          const banUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          penaltyData.bannedUntil = banUntil;
          penaltyData.timeoutUntil = null;
        } else {
          // 3-minute timeout
          const timeoutUntil = new Date(now.getTime() + 3 * 60 * 1000);
          penaltyData.timeoutUntil = timeoutUntil;
        }

        await setDoc(docRef, penaltyData, { merge: true });
        
        // The global IPBlocker will catch this and lock the screen.
      } catch (err) {
        console.error("Failed to apply IP ban", err);
      }
      return;
    }

    setStatus('submitting');
    try {
      const q = query(collection(db, 'registrations'), where('email', '==', formData.email));
      const snap = await getDocs(q);
      let hasFreeTrial = false, duplicateStudent = false, emailCount = 0;
      snap.forEach(doc => {
        const d = doc.data();
        emailCount++;
        if (d.freeTrial) hasFreeTrial = true;
        if (d.studentName === formData.studentName && d.age === formData.age) duplicateStudent = true;
      });

      if (emailCount > 0) {
        setModalMsg('You have already registered. Please wait for my reply — I will be in touch within 24 hours!');
        setStatus('idle');
        return;
      }
      if (formData.freeTrial && hasFreeTrial) {
        setModalMsg('This email has already claimed a free trial. Please uncheck the free trial option to register for regular classes.');
        setStatus('idle');
        return;
      }
      if (duplicateStudent) {
        setModalMsg('A registration for this student already exists under this email address.');
        setStatus('idle');
        return;
      }

      await addDoc(collection(db, 'registrations'), {
        ...formData, weakTopics, isAdult: !isMinor, contacted: false, createdAt: serverTimestamp(),
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setModalMsg('Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  const stepContent = () => {
    if (step === 0) return (
      <div className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">Personal Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Student's Full Name *</label>
            <input required type="text" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="e.g. Alex Tan" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Age *</label>
            <input required type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 16" min="8" max="99" className={inputClass} />
          </div>
          {isMinor && (
            <div className="sm:col-span-2">
              <label className={labelClass}>Parent / Guardian Name *</label>
              <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} placeholder="e.g. Mdm Tan" className={inputClass} />
            </div>
          )}
          <div>
            <label className={labelClass}>Email Address *</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone Number *</label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="9123 4567" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Which program are you interested in? *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            {[
              { id: 'olevel', label: 'O-Level Chinese', sub: 'Syllabus 1160 — Sec School', emoji: '📚' },
              { id: 'hsk', label: 'HSK Mastery', sub: 'HSK 1–6 — Adult Learners', emoji: '🏆' },
            ].map(opt => (
              <button key={opt.id} type="button" onClick={() => setFormData(p => ({ ...p, lessonType: opt.id }))}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${formData.lessonType === opt.id ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-700' : 'border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-400'}`}>
                <span className="text-2xl">{opt.emoji}</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{opt.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );

    if (step === 1 && !isHSK) return (
      <div className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">O-Level Academic Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>School *</label>
            <input type="text" name="school" value={formData.school} onChange={handleChange} placeholder="e.g. Raffles Institution" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Current Grade</label>
            <input type="text" name="currentGrade" value={formData.currentGrade} onChange={handleChange} placeholder="e.g. B3, C5, F9" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Target Grade</label>
            <select name="targetGrade" value={formData.targetGrade} onChange={handleChange} className={selectClass}>
              <option value="A1">A1 — Distinction (Recommended)</option>
              <option value="A2">A2 — Merit</option>
            </select>
          </div>
        </div>
      </div>
    );

    if (step === 1 && isHSK) return (
      <div className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">HSK Academic Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Current HSK Level *</label>
            <select name="hskCurrentLevel" value={formData.hskCurrentLevel} onChange={handleChange} className={selectClass}>
              <option value="">Select current level...</option>
              {['HSK 1 (Beginner)', 'HSK 2', 'HSK 3 (Elementary)', 'HSK 4 (Intermediate)', 'HSK 5 (Upper-Intermediate)', 'HSK 6 (Advanced/Mastery)', 'Not tested yet'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Target HSK Level</label>
            <select name="hskTargetLevel" value={formData.hskTargetLevel} onChange={handleChange} className={selectClass}>
              <option value="">Select target...</option>
              {['HSK 2', 'HSK 3 (Elementary)', 'HSK 4 (Intermediate)', 'HSK 5 (Upper-Intermediate)', 'HSK 6 (Advanced/Mastery)'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Primary Goal</label>
            <input type="text" name="adultGoal" value={formData.adultGoal} onChange={handleChange} placeholder="e.g. Exam certification, Business, Travel, Conversational fluency..." className={inputClass} />
          </div>
        </div>
      </div>
    );

    if (step === 2 && !isHSK) return (
      <div className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Weak Areas</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Select all that apply — helps me prepare your first lesson.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {WEAK_TOPICS.map(topic => {
            const checked = weakTopics.includes(topic.id);
            return (
              <button key={topic.id} type="button" onClick={() => toggleTopic(topic.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left text-sm font-medium transition-all ${checked ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 hover:border-slate-400'}`}>
                {checked ? <CheckSquare className="w-4 h-4 flex-shrink-0" /> : <Square className="w-4 h-4 flex-shrink-0 opacity-50" />}
                {topic.label}
              </button>
            );
          })}
        </div>
      </div>
    );

    // Final step — Schedule
    return (
      <div className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">Schedule & Preferences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Preferred Day</label>
            <select name="preferredDay" value={formData.preferredDay} onChange={handleChange} className={selectClass}>
              <option value="">Select...</option>
              {['Weekdays', 'Weekends', 'Either'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Preferred Time</label>
            <select name="preferredTime" value={formData.preferredTime} onChange={handleChange} className={selectClass}>
              <option value="">Select...</option>
              {['Morning (9am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (5pm–9pm)'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>How did you hear about Lythos?</label>
            <select name="hearFrom" value={formData.hearFrom} onChange={handleChange} className={selectClass}>
              <option value="">Select...</option>
              {HEAR_FROM.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Additional Message</label>
            <textarea rows={3} name="message" value={formData.message} onChange={handleChange} placeholder="Anything else you'd like me to know..." className={`${inputClass} resize-none`} />
          </div>
        </div>
        <button type="button" onClick={() => setFormData(p => ({ ...p, freeTrial: !p.freeTrial }))}
          className={`w-full flex items-center gap-4 px-6 py-5 rounded-xl border-2 text-left transition-all ${formData.freeTrial ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-300' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 hover:border-slate-400'}`}>
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${formData.freeTrial ? 'bg-emerald-500 border-emerald-500' : 'border-slate-400 dark:border-slate-400'}`}>
            {formData.freeTrial && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
          </div>
          <div>
            <p className="font-semibold text-sm">Yes! I'd like a FREE Trial Class 🎉</p>
            <p className="text-xs opacity-70 mt-0.5">No payment required. First class is completely free.</p>
          </div>
        </button>
        {/* CAPTCHA */}
        <div className="pt-2">
          <LythosCaptcha onVerify={verified => setCaptchaVerified(verified)} />
        </div>

        {/* HONEY POT - HIDDEN FROM HUMANS BUT NOT FROM BOTS */}
        <div style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1, overflow: 'hidden' }}>
          <label htmlFor="website">Leave this field empty</label>
          <input 
            id="website"
            type="text" 
            name="website" 
            value={formData.website} 
            onChange={e => setFormData(p => ({ ...p, website: e.target.value }))} 
            tabIndex={-1} 
            autoComplete="off"
          />
        </div>
      </div>
    );
  };

  if (status === 'success') return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-[#f8fafc] dark:bg-[#0a0f1c]">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-3">You're on the list!</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">I'll personally reach out within 24 hours to confirm your {formData.freeTrial ? 'free trial' : 'registration'}.</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] dark:bg-[#0a0f1c] transition-colors duration-300">
      <AnimatePresence>{modalMsg && <Modal message={modalMsg} onClose={() => setModalMsg(null)} />}</AnimatePresence>

      <div className="max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <span className="inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            🎉 First Class Free
          </span>
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-slate-50">Enroll with Lythos</h1>
        </motion.div>

        {/* Step Progress */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-slate-700'}`} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mb-6 -mt-4">
          <span>{stepLabels[step]}</span>
          <span>Step {step + 1} of {totalSteps}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8"
        >
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              {stepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button type="button" onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              type="button"
              onClick={step < totalSteps - 1 ? handleNext : handleSubmit}
              disabled={!canProceed() || status === 'submitting' || (step === totalSteps - 1 && !captchaVerified)}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            >
              {status === 'submitting' ? (
                <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> Submitting...</>
              ) : step < totalSteps - 1 ? (
                <>Next <ChevronRight className="w-4 h-4" /></>
              ) : (
                formData.freeTrial ? 'Book Free Trial →' : 'Submit Registration →'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
