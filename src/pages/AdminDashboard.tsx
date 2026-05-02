import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle, Circle, Users, MailCheck, Clock, Trash2, Gift, ChevronDown, ChevronUp, ShieldAlert, ShieldCheck } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

interface Registration {
  id: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  school: string;
  currentGrade: string;
  targetGrade: string;
  weakTopics: string[];
  preferredDay: string;
  preferredTime: string;
  hearFrom: string;
  message: string;
  contacted: boolean;
  freeTrial: boolean;

  createdAt: { toDate: () => Date } | null;
}

interface BannedIP {
  id: string;
  ip: string;
  strikes: number;
  timeoutUntil: { toDate: () => Date } | null;
  bannedUntil: { toDate: () => Date } | null;
  lastTriggered: { toDate: () => Date } | null;
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [bannedIps, setBannedIps] = useState<BannedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'trial' | 'banned'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) { navigate('/admin'); return; }

      const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
      const unsubscribeDb = onSnapshot(q, (snapshot) => {
        const regs: Registration[] = [];
        snapshot.forEach((d) => regs.push({ id: d.id, ...d.data() } as Registration));
        setRegistrations(regs);
        setLoading(false);
      });

      const bq = query(collection(db, 'banned_ips'), orderBy('lastTriggered', 'desc'));
      const unsubscribeBanned = onSnapshot(bq, (snapshot) => {
        const ips: BannedIP[] = [];
        snapshot.forEach((d) => ips.push({ id: d.id, ...d.data() } as BannedIP));
        setBannedIps(ips);
      });

      return () => {
        unsubscribeDb();
        unsubscribeBanned();
      };
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  const toggleContacted = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'registrations', id), { contacted: !current });
  };

  const deleteReg = async (id: string) => {
    if (window.confirm('Delete this registration permanently?')) {
      await deleteDoc(doc(db, 'registrations', id));
    }
  };

  const unbanIp = async (id: string) => {
    if (window.confirm('Are you sure you want to unban this IP?')) {
      await deleteDoc(doc(db, 'banned_ips', id));
    }
  };

  const filtered = registrations.filter((r) => {
    if (filter === 'new') return !r.contacted;
    if (filter === 'contacted') return r.contacted;
    if (filter === 'trial') return r.freeTrial;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Leads', value: registrations.length, icon: <Users className="w-5 h-5" />, color: 'bg-slate-900 text-white' },
    { label: 'New / Pending', value: registrations.filter(r => !r.contacted).length, icon: <Clock className="w-5 h-5" />, color: 'bg-amber-50 text-amber-800 border border-amber-200' },
    { label: 'Contacted', value: registrations.filter(r => r.contacted).length, icon: <MailCheck className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-800 border border-emerald-200' },
    { label: 'Security Blocks', value: bannedIps.length, icon: <ShieldAlert className="w-5 h-5" />, color: 'bg-red-50 text-red-800 border border-red-200' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">LYTHOS Admin</p>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Registration Dashboard</h1>
          </div>
          <button
            onClick={async () => { await signOut(auth); navigate('/admin'); }}
            className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-2xl p-5 flex items-center justify-between shadow-sm ${s.color}`}>
              <div>
                <p className="text-xs font-semibold opacity-60 uppercase tracking-wide">{s.label}</p>
                <p className="text-3xl font-bold mt-1">{s.value}</p>
              </div>
              <div className="opacity-40">{s.icon}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {([
            { key: 'all', label: 'All' },
            { key: 'new', label: '🔔 New' },
            { key: 'trial', label: '🎁 Free Trial' },
            { key: 'contacted', label: '✅ Contacted' },
            { key: 'banned', label: '⛔ Banned IPs' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === key ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {filter === 'banned' ? (
              bannedIps.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-16 text-center text-slate-400">
                  No banned IPs found.
                </div>
              ) : (
                bannedIps.map(bip => {
                  const now = new Date();
                  const isBanned = bip.bannedUntil && bip.bannedUntil.toDate() > now;
                  const isTimedOut = bip.timeoutUntil && bip.timeoutUntil.toDate() > now;
                  const status = isBanned ? '24h Ban' : isTimedOut ? 'Timeout' : 'Cleared';

                  return (
                    <motion.div key={bip.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden p-5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-slate-900 text-lg font-mono">{bip.ip}</h3>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isBanned ? 'bg-red-100 text-red-700' : isTimedOut ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {status}
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                            {bip.strikes} Strikes
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">Last triggered: {bip.lastTriggered?.toDate().toLocaleString() || 'Unknown'}</p>
                      </div>
                      <button onClick={() => unbanIp(bip.id)} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors font-medium text-sm">
                        <ShieldCheck className="w-4 h-4" /> Unban IP
                      </button>
                    </motion.div>
                  );
                })
              )
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-16 text-center text-slate-400">
                No registrations match this filter.
              </div>
            ) : (
              filtered.map((reg) => (
                <motion.div
                  key={reg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${reg.contacted ? 'border-slate-100 opacity-80' : 'border-slate-200'}`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleContacted(reg.id, reg.contacted)} className="flex-shrink-0 hover:scale-110 transition-transform">
                        {reg.contacted
                          ? <CheckCircle className="w-6 h-6 text-emerald-500" />
                          : <Circle className="w-6 h-6 text-slate-300" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900">{reg.studentName}</span>
                          {reg.freeTrial && (
                            <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Gift className="w-3 h-3" /> Free Trial
                            </span>
                          )}
                          {!reg.contacted && (
                            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">New</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-0.5">Parent: {reg.parentName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteReg(reg.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExpanded(expanded === reg.id ? null : reg.id)}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                      >
                        {expanded === reg.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Card Summary Row (always visible) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-5 py-3 bg-slate-50/50 text-sm">
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Phone</p>
                      <p className="text-slate-800 font-semibold mt-0.5">{reg.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Email</p>
                      <p className="text-slate-800 truncate mt-0.5">{reg.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Current → Target</p>
                      <p className="text-slate-800 font-semibold mt-0.5">{reg.currentGrade || '—'} → {reg.targetGrade || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Schedule</p>
                      <p className="text-slate-800 mt-0.5">{reg.preferredDay || '—'}, {reg.preferredTime || '—'}</p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expanded === reg.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 py-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">School</p>
                            <p className="text-slate-800">{reg.school || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">Heard From</p>
                            <p className="text-slate-800">{reg.hearFrom || 'Not provided'}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">Weak Topics</p>
                            {reg.weakTopics && reg.weakTopics.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {reg.weakTopics.map((t) => (
                                  <span key={t} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">{t}</span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-400 text-sm">None selected</p>
                            )}
                          </div>
                          {reg.message && (
                            <div className="sm:col-span-2">
                              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">Message / Goals</p>
                              <p className="text-slate-700 bg-slate-50 rounded-xl p-4 text-sm leading-relaxed">{reg.message}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
