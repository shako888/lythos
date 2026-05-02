import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, RefreshCw, ShieldCheck } from 'lucide-react';

type CaptchaState = 'idle' | 'verifying' | 'challenge' | 'verified' | 'failed';

interface Props {
  onVerify: (verified: boolean) => void;
}

const CHALLENGES = [
  {
    question: 'Select all tiles showing the character 你 (you)',
    tiles: ['你', '我', '他', '你', '是', '的'],
    solutionHash: "0|3|lythos_salt_99", // Hashed: [0, 3]
  },
  {
    question: 'Select all tiles showing the character 好 (good)',
    tiles: ['好', '不', '好', '是', '了', '啊'],
    solutionHash: "0|2|lythos_salt_99", // Hashed: [0, 2]
  },
  {
    question: 'Select all tiles showing the character 中 (China / middle)',
    tiles: ['大', '中', '小', '中', '学', '文'],
    solutionHash: "1|3|lythos_salt_99", // Hashed: [1, 3]
  },
  {
    question: 'Select all tiles showing the character 学 (study / learn)',
    tiles: ['学', '习', '学', '校', '生', '好'],
    solutionHash: "0|2|lythos_salt_99", // Hashed: [0, 2]
  },
  {
    question: 'Select all tiles showing the character 文 (language / culture)',
    tiles: ['语', '文', '字', '文', '言', '书'],
    solutionHash: "1|3|lythos_salt_99", // Hashed: [1, 3]
  },
];

// Helper to check if event is a genuine, untampered browser event
const isGenuineEvent = (e: any) => {
  // 1. Must be a genuine DOM Event (covers MouseEvent, PointerEvent, TouchEvent on mobile)
  // A script passing a plain object { isTrusted: true } will fail this.
  if (!e || !(e.nativeEvent instanceof Event)) return false;
  
  // 2. The browser itself must vouch for the event's authenticity.
  // nativeEvent.isTrusted is a read-only property enforced by the browser engine.
  return e.nativeEvent.isTrusted === true && e.isTrusted === true;
};

// Sub-component to render character on canvas (prevents text scraping)
function CharacterCanvas({ char }: { char: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and draw
    ctx.clearRect(0, 0, 80, 80);
    ctx.font = 'bold 42px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add some random "noise" / tilt to make OCR harder
    const tilt = (Math.random() - 0.5) * 0.2;
    ctx.save();
    ctx.translate(40, 40);
    ctx.rotate(tilt);
    
    // Draw character
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1e293b';
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }, [char]);

  return <canvas ref={canvasRef} width={80} height={80} className="w-14 h-14 pointer-events-none" />;
}

export default function LythosCaptcha({ onVerify }: Props) {
  const [state, setState] = useState<CaptchaState>('idle');
  const [challenge] = useState(() => CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]);
  const [selected, setSelected] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState(false);
  const mouseTrajectory = useRef<{x: number, y: number, t: number}[]>([]);
  const lastEventTime = useRef<number>(0);
  const challengeStartTime = useRef<number>(0);

  // Auto-run verification simulation on checkbox click
  useEffect(() => {
    if (state !== 'verifying') return;
    const t = setTimeout(() => {
      // Behavioral analysis: Check if movement looks human
      const traj = mouseTrajectory.current;
      const isHuman = analyzeTrajectory(traj);
      
      if (!isHuman) {
        setAttempts(a => a + 1);
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setState('failed');
      } else {
        setState('challenge');
        challengeStartTime.current = Date.now(); // Record start time
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [state]);

  const analyzeTrajectory = (traj: {x: number, y: number, t: number}[]) => {
    // If very few data points, likely a bot directly clicking
    if (traj.length < 5) return false;
    
    // Check for perfect linearity (robots often move in straight lines)
    let xVar = 0, yVar = 0;
    const xMean = traj.reduce((sum, p) => sum + p.x, 0) / traj.length;
    const yMean = traj.reduce((sum, p) => sum + p.y, 0) / traj.length;
    
    traj.forEach(p => {
      xVar += Math.pow(p.x - xMean, 2);
      yVar += Math.pow(p.y - yMean, 2);
    });
    
    xVar /= traj.length;
    yVar /= traj.length;
    
    // A real human mouse movement has jitter in both X and Y.
    // If variance is extremely low, it's suspiciously perfect.
    if (xVar < 1 || yVar < 1) return false;
    
    return true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (state === 'idle') {
      if (!isGenuineEvent(e)) return;
      const now = Date.now();
      // Throttle collection to avoid huge arrays
      if (now - lastEventTime.current > 50) {
        mouseTrajectory.current.push({ x: e.clientX, y: e.clientY, t: now });
        lastEventTime.current = now;
      }
    }
  };

  const toggleTile = (i: number) => {
    if (state !== 'challenge') return;
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const verify = () => {
    const elapsed = Date.now() - challengeStartTime.current;
    
    // BOT DETECTION: If solved too fast (under 2 seconds), it's likely a script
    if (elapsed < 2000) {
      console.warn("Verification failed: Completion time too fast (potential bot).");
      setAttempts(a => a + 1);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setSelected([]);
      if (attempts >= 2) {
        setState('failed');
        onVerify(false);
      }
      return;
    }

    const userHash = [...selected].sort().join('|') + "lythos_salt_99";
    if (userHash === challenge.solutionHash) {
      setState('verified');
      onVerify(true);
    } else {
      setAttempts(a => a + 1);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setSelected([]);
      if (attempts >= 2) {
        setState('failed');
        onVerify(false);
      }
    }
  };

  const reset = () => {
    setState('idle');
    setSelected([]);
    setAttempts(0);
    onVerify(false);
  };

  return (
    <div className="select-none">
      {/* Main reCAPTCHA-style Widget */}
      <motion.div
        onMouseMove={handleMouseMove}
        animate={shake ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden shadow-sm"
      >
        {/* Top Row — Checkbox + Label + Branding */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-4">
            {/* Checkbox */}
            <button
              type="button"
              onClick={(e) => {
                if (!isGenuineEvent(e)) {
                  setState('failed');
                  return;
                }
                state === 'idle' && setState('verifying');
              }}
              disabled={state === 'verifying' || state === 'verified'}
              className="relative w-7 h-7 flex-shrink-0"
            >
              <div className={`w-7 h-7 rounded border-2 transition-all flex items-center justify-center ${
                state === 'verified'
                  ? 'bg-emerald-500 border-emerald-500'
                  : state === 'failed'
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                  : 'border-slate-300 dark:border-slate-500 hover:border-slate-500 dark:hover:border-slate-300 cursor-pointer bg-white dark:bg-slate-700'
              }`}>
                {state === 'verifying' && (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                    <RefreshCw className="w-4 h-4 text-slate-500 dark:text-slate-300" />
                  </motion.div>
                )}
                {state === 'verified' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </div>
            </button>

            {/* Label */}
            <div>
              <p className={`font-medium text-sm ${state === 'verified' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                {state === 'idle' && "I'm not a robot"}
                {state === 'verifying' && 'Verifying...'}
                {state === 'challenge' && 'Please complete the challenge'}
                {state === 'verified' && 'Verified!'}
                {state === 'failed' && 'Verification failed'}
              </p>
              {state === 'failed' && (
                <button onClick={reset} className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline mt-0.5">
                  Try again
                </button>
              )}
            </div>
          </div>

          {/* Branding */}
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 mb-0.5">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span className="font-serif font-bold text-slate-700 dark:text-slate-200 text-sm tracking-wide">LYTHOS</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Protected</p>
          </div>
        </div>

        {/* Challenge Panel */}
        <AnimatePresence>
          {state === 'challenge' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="overflow-hidden border-t border-slate-100 dark:border-slate-700"
            >
              <div className="px-5 pt-4 pb-5">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">{challenge.question}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                  Click all matching tiles, then press Verify. {attempts > 0 && <span className="text-amber-500">{3 - attempts} attempt{3 - attempts !== 1 ? 's' : ''} remaining.</span>}
                </p>

                {/* 2×3 Tile Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {challenge.tiles.map((char, i) => (
                    <motion.button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        if (!isGenuineEvent(e)) return; 
                        toggleTile(i);
                      }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all duration-150 ${
                        selected.includes(i)
                          ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white shadow-lg'
                          : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 hover:border-slate-400 dark:hover:border-slate-400'
                      }`}
                    >
                      <CharacterCanvas char={char} />
                    </motion.button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    if (!isGenuineEvent(e)) return;
                    verify();
                  }}
                  disabled={selected.length === 0}
                  className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Verify →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
