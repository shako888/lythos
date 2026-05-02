import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ShieldAlert, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
}

export default function IPBlocker({ children }: Props) {
  const [ip, setIp] = useState<string | null>(null);
  const [blockState, setBlockState] = useState<{
    isBlocked: boolean;
    type: 'timeout' | 'ban' | null;
    until: Date | null;
  }>({ isBlocked: false, type: null, until: null });

  // 1. Fetch IP Address
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(err => console.error("Could not fetch IP:", err));
  }, []);

  // 2. Listen to Firestore for this IP
  useEffect(() => {
    if (!ip) return;

    // We replace dots with underscores to use IP as a valid Firestore Document ID
    const ipDocId = ip.replace(/\./g, '_');
    const docRef = doc(db, 'banned_ips', ipDocId);

    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (!snap.exists()) {
        setBlockState({ isBlocked: false, type: null, until: null });
        return;
      }

      const data = snap.data();
      const now = new Date();
      
      let isBlocked = false;
      let type: 'timeout' | 'ban' | null = null;
      let until: Date | null = null;

      // Check Ban (24h) first
      if (data.bannedUntil && data.bannedUntil.toDate() > now) {
        isBlocked = true;
        type = 'ban';
        until = data.bannedUntil.toDate();
      } 
      // Then check Timeout (3m)
      else if (data.timeoutUntil && data.timeoutUntil.toDate() > now) {
        isBlocked = true;
        type = 'timeout';
        until = data.timeoutUntil.toDate();
      }

      setBlockState({ isBlocked, type, until });
    });

    return () => unsubscribe();
  }, [ip]);

  // 3. Render Lockdown Screen or Children
  if (blockState.isBlocked && blockState.until) {
    const isBan = blockState.type === 'ban';
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-slate-800 rounded-3xl p-8 text-center shadow-2xl border border-red-500/20"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Access Restricted</h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Suspicious automated activity has been detected from your network ({ip}). 
            To protect our systems, your access has been temporarily restricted.
          </p>
          
          <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-700/50">
            <div className="flex items-center justify-center gap-2 text-red-400 font-semibold mb-1">
              <Clock className="w-4 h-4" />
              <span>{isBan ? '24-Hour Network Ban' : 'Security Timeout'}</span>
            </div>
            <p className="text-slate-300 text-sm">
              Restriction lifts at: <br/>
              <span className="font-mono text-white text-base mt-1 block">
                {blockState.until.toLocaleString()}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
