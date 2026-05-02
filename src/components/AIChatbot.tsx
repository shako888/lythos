import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are Lythos AI — the friendly academic assistant for Lythos Chinese Tuition.

ABOUT LYTHOS:
- Run by a local Singapore university student with Distinction in O-Level Chinese (Syllabus 1160).
- Proficient to an advanced Chinese level (HSK 6 equivalent).
- Offers two programs: O-Level Syllabus 1160 (for secondary students) and HSK 1–6 Mastery (for adult learners).
- First trial class is FREE, no commitment.
- Flexible scheduling — weekdays or weekends, morning/afternoon/evening.
- Small-group or 1-on-1 lessons tailored to each student's weak areas.
- Students reach out via the Register page; tutor replies within 24 hours.

O-LEVEL SYLLABUS 1160 PROGRAM:
- Paper 1: Writing 作文 (30%) — narrative and argumentative essays, vocabulary, structure.
- Paper 2: Comprehension 阅读 (35%) — MCQ, cloze, open-ended answering techniques.
- Paper 3: Oral & Listening 口语/听力 (35%) — reading aloud, conversation, listening comprehension.
- Target grades: A1 (Distinction) or A2 (Merit).
- Weak areas covered: Writing, Comprehension, Oral, Listening, Grammar, Vocabulary, Cloze.

HSK 1–6 PROGRAM:
- HSK 1: 150 words — basic greetings, numbers, everyday phrases.
- HSK 2: 300 words — simple conversations, shopping, directions.
- HSK 3: 600 words — travel situations, simple opinions, basic paragraphs.
- HSK 4: 1200 words — wide topic discussions, native speech comprehension.
- HSK 5: 2500 words — media, literature, professional contexts.
- HSK 6: 5000+ words — full professional fluency, O-Level Distinction equivalent.

WHY CHOOSE LYTHOS:
- Tutor sat the exact Syllabus 1160 exam — first-hand experience.
- Proven Distinction track record.
- Customized lesson plans and targeted mock papers.
- Not just language drilling — focuses on exam technique and genuine comprehension.
- Free first trial class with zero commitment.

PRICING:
- HSK Level 1-6 lessons: $45 per hour.
- O-Level lessons: $50 per hour.

SAFETY:
- Run by a local university student. We prioritize the safety and well-being of all our students.

STRICT RULES:
1. ONLY answer questions related to the topics above. DO NOT HALLUCINATE. If you don't know the answer based on the provided information, say you don't know.
2. Do NOT make up prices, exact schedules, the tutor's personal name, or specific school names.
3. If asked about pricing, state the prices clearly and say: "Please register via the Register page and the tutor will get in touch within 24 hours to discuss."
4. If asked if it's safe, mention that the tutor is a local uni student and we prioritize safety.
5. If asked about anything unrelated to Chinese tuition or Lythos, say: "I can only help with questions about Lythos Chinese tuition. Want to know about our O-Level or HSK programs?"
6. Keep responses warm, concise (2–4 sentences), and encouraging.
7. Never claim to know something you have not been told above. NO HALLUCINATIONS.`;

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Lythos AI 👋 I can answer questions about our O-Level Chinese (Syllabus 1160) and HSK 1–6 programs. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages,
          ],
          max_tokens: 250,
          temperature: 0.4,
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't get a response. Please try again!";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again in a moment!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/60 dark:border-white/10 overflow-hidden flex flex-col"
            style={{ maxHeight: '70vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-slate-900 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="font-serif font-bold text-white text-lg">文</span>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Lythos AI</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <p className="text-slate-300 text-xs">Online</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/50">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-slate-900 dark:bg-slate-700 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                      <span className="font-serif text-white text-xs font-bold">文</span>
                    </div>
                  )}
                  <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-br-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-100 dark:border-slate-700 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-slate-900 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-serif text-white text-xs font-bold">文</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm">
                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-2 border border-slate-200 dark:border-slate-700">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Ask about programs..."
                  className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400"
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center disabled:opacity-40 hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-white dark:text-slate-900" />
                </button>
              </div>
              <p className="text-center text-xs text-slate-400 mt-2">Only answers questions about Lythos programs</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Button & Chat Bubble */}
      <div className="flex items-center gap-4">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl rounded-br-sm shadow-xl font-semibold text-sm relative"
            >
              Chat with me! 👋
              {/* Optional tiny tail for bubble effect */}
              <div className="absolute right-[-4px] bottom-0 w-4 h-4 bg-slate-900 dark:bg-white [clip-path:polygon(0_0,0_100%,100%_100%)]" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen(o => !o)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 bg-slate-900 dark:bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-slate-900"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="close" initial={{ scale: 0.5, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.5 }} transition={{ duration: 0.2 }}>
                <X className="w-6 h-6 text-white dark:text-slate-900" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }} transition={{ duration: 0.2 }}>
                <span className="font-serif font-bold text-2xl text-white dark:text-slate-900">文</span>
              </motion.div>
            )}
          </AnimatePresence>
          {!open && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
