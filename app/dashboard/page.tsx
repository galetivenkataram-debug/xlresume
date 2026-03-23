'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Profile {
  id: string;
  email: string;
  full_name: string;
  persona: string;
  goal: string;
  target_role: string;
  challenge: string;
  onboarding_completed: boolean;
}

// ─── Logo ────────────────────────────────────────────────────────────────────
const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg width="36" height="36" viewBox="0 0 52 52">
      <defs>
        <linearGradient id="logo-lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff4500" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
      </defs>
      <circle cx="26" cy="26" r="23" fill="none" stroke="url(#logo-lg)" strokeWidth="2.2" />
      <circle cx="26" cy="14" r="5" fill="none" stroke="url(#logo-lg)" strokeWidth="2.2" />
      <path d="M15,24 L26,38 M37,24 L26,38" stroke="url(#logo-lg)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M19,48 L19,38 L34,38" stroke="url(#logo-lg)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
    <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 800, fontSize: '20px', background: 'linear-gradient(90deg,#ff4500,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>XL</span>
    <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 300, fontSize: '20px', color: '#fff' }}>Resume</span>
  </div>
);

// ─── Nav items ───────────────────────────────────────────────────────────────
const navItems = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'resume', icon: '📄', label: 'My Resumes' },
  { id: 'video', icon: '🎥', label: 'Video Resume' },
  { id: 'score', icon: '📊', label: 'Resume Score' },
  { id: 'roadmap', icon: '🧭', label: 'Career Roadmap' },
  { id: 'interview', icon: '🎤', label: 'Interview Prep' },
  { id: 'jobs', icon: '🔍', label: 'Job Matches' },
];

// ─── Quick actions ────────────────────────────────────────────────────────────
const quickActions = [
  {
    id: 'resume',
    icon: '📄',
    title: 'Build AI Resume',
    desc: 'Create an ATS-ready resume in minutes',
    badge: 'Most Popular',
    badgeColor: '#fb923c',
    gradient: 'linear-gradient(135deg,#ff4500 0%,#fb923c 100%)',
    glow: 'rgba(255,69,0,0.15)',
  },
  {
    id: 'video',
    icon: '🎥',
    title: 'Record Video Resume',
    desc: '100-second video that gets you noticed',
    badge: 'New',
    badgeColor: '#22c55e',
    gradient: 'linear-gradient(135deg,#0f4c2a 0%,#166534 100%)',
    glow: 'rgba(34,197,94,0.1)',
  },
  {
    id: 'score',
    icon: '📊',
    title: 'Score My Resume',
    desc: 'Upload and get AI feedback instantly',
    badge: 'Free',
    badgeColor: '#60a5fa',
    gradient: 'linear-gradient(135deg,#0f1f4c 0%,#1e3a8a 100%)',
    glow: 'rgba(96,165,250,0.1)',
  },
  {
    id: 'roadmap',
    icon: '🧭',
    title: 'Career Roadmap',
    desc: 'Get your personalised career plan',
    badge: 'AI-Powered',
    badgeColor: '#a78bfa',
    gradient: 'linear-gradient(135deg,#1a0f4c 0%,#2d1b8a 100%)',
    glow: 'rgba(167,139,250,0.1)',
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
const statCards = [
  { icon: '📄', label: 'Resumes Created', value: '0', unit: '', color: '#fb923c' },
  { icon: '🎥', label: 'Video Resumes', value: '0', unit: '', color: '#22c55e' },
  { icon: '📊', label: 'Resume Score', value: '—', unit: '/100', color: '#60a5fa' },
  { icon: '🔍', label: 'Job Matches', value: '0', unit: '', color: '#a78bfa' },
];

// ─── Persona label map ────────────────────────────────────────────────────────
const personaLabels: Record<string, string> = {
  fresh_graduate: 'Fresh Graduate',
  job_switcher: 'Job Switcher',
  senior_pro: 'Senior Professional',
  student: 'Still Studying',
};

const roleLabels: Record<string, string> = {
  software: 'Software & Tech',
  marketing: 'Marketing & Sales',
  finance: 'Finance & Banking',
  design: 'Design & Creative',
  management: 'Management & MBA',
  government: 'Government & PSU',
  healthcare: 'Healthcare',
  other: 'Other',
};

const goalLabels: Record<string, string> = {
  resume: 'Build a great resume',
  video: 'Record video resume',
  interview: 'Interview preparation',
  direction: 'Find career direction',
  english: 'Improve English',
  job_match: 'Find matching jobs',
};

// ─── Tips ─────────────────────────────────────────────────────────────────────
const tips = [
  { icon: '💡', text: 'ATS systems reject 75% of resumes before a human reads them. Use our AI to pass every filter.' },
  { icon: '🎯', text: 'Recruiters spend just 6 seconds scanning a resume. Make every word count.' },
  { icon: '📈', text: 'Adding a video resume increases your callback rate by up to 3x.' },
  { icon: '🔑', text: 'Tailor your resume for each job — generic resumes have a 40% lower chance of getting hired.' },
];

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/auth/login'; return; }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data || { id: user.id, email: user.email || '', full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'there' } as Profile);
      setLoading(false);
    };
    init();

    // Rotate tips every 6s
    const interval = setInterval(() => setTipIndex(i => (i + 1) % tips.length), 6000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  };

  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const timeOfDay = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#09090f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Urbanist,sans-serif' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#ff4500', borderRightColor: '#fb923c' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090f', display: 'flex', fontFamily: 'Urbanist,sans-serif', color: '#fff' }}>

      {/* ── Sidebar ── */}
      <motion.div
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ background: '#0a0a14', borderRight: '0.5px solid #1e1e2e', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>

        {/* Sidebar header */}
        <div style={{ padding: '20px 16px', borderBottom: '0.5px solid #1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '72px' }}>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Logo />
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: '#555570', cursor: 'pointer', fontSize: '18px', padding: '4px', flexShrink: 0, marginLeft: sidebarOpen ? '0' : 'auto', marginRight: sidebarOpen ? '0' : 'auto' }}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <motion.button key={item.id}
              whileHover={{ x: 2 }}
              onClick={() => setActiveNav(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '10px',
                background: activeNav === item.id ? 'rgba(255,69,0,0.12)' : 'transparent',
                border: `0.5px solid ${activeNav === item.id ? 'rgba(255,69,0,0.3)' : 'transparent'}`,
                color: activeNav === item.id ? '#fb923c' : '#555570',
                cursor: 'pointer', fontFamily: 'Urbanist,sans-serif',
                fontSize: '14px', fontWeight: activeNav === item.id ? 600 : 400,
                transition: 'all 0.2s', whiteSpace: 'nowrap', overflow: 'hidden',
                textAlign: 'left', width: '100%',
              }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                    style={{ overflow: 'hidden' }}>
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </nav>

        {/* Sidebar footer — upgrade */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ margin: '12px', padding: '16px', background: 'linear-gradient(135deg,rgba(255,69,0,0.1),rgba(251,146,60,0.06))', border: '0.5px solid rgba(255,69,0,0.2)', borderRadius: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#fb923c', marginBottom: '6px' }}>✨ Upgrade to Pro</p>
              <p style={{ fontSize: '11px', color: '#555570', lineHeight: 1.5, marginBottom: '10px' }}>Unlock unlimited resumes, video, and AI coach.</p>
              <button style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'linear-gradient(135deg,#ff4500,#fb923c)', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Urbanist,sans-serif' }}>
                Starting ₹101/mo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>

        {/* Top bar */}
        <div style={{ padding: '0 32px', height: '72px', borderBottom: '0.5px solid #1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#09090f', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', margin: 0 }}>Dashboard</h2>
            <p style={{ fontSize: '12px', color: '#333350', margin: 0 }}>Your career command centre</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Notifications */}
            <button style={{ background: 'none', border: '0.5px solid #1e1e2e', borderRadius: '10px', padding: '8px 10px', color: '#555570', cursor: 'pointer', fontSize: '16px' }}>🔔</button>

            {/* User avatar */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#111120', border: '0.5px solid #1e1e2e', borderRadius: '10px', padding: '6px 12px 6px 6px', cursor: 'pointer' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#ff4500,#fb923c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                  {firstName[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', fontFamily: 'Urbanist,sans-serif' }}>{firstName}</span>
                <span style={{ fontSize: '10px', color: '#555570' }}>▼</span>
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    style={{ position: 'absolute', right: 0, top: '48px', background: '#111120', border: '0.5px solid #1e1e2e', borderRadius: '12px', padding: '8px', minWidth: '180px', zIndex: 100 }}>
                    <p style={{ fontSize: '12px', color: '#555570', padding: '6px 10px', margin: 0 }}>{profile?.email}</p>
                    <hr style={{ border: 'none', borderTop: '0.5px solid #1e1e2e', margin: '6px 0' }} />
                    {[
                      { icon: '👤', label: 'My Profile' },
                      { icon: '⚙️', label: 'Settings' },
                      { icon: '💳', label: 'Billing' },
                    ].map(item => (
                      <button key={item.label}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', background: 'none', border: 'none', color: '#a0a0b8', fontSize: '13px', cursor: 'pointer', borderRadius: '8px', fontFamily: 'Urbanist,sans-serif', textAlign: 'left' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                        {item.icon} {item.label}
                      </button>
                    ))}
                    <hr style={{ border: 'none', borderTop: '0.5px solid #1e1e2e', margin: '6px 0' }} />
                    <button onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', borderRadius: '8px', fontFamily: 'Urbanist,sans-serif', textAlign: 'left' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                      🚪 Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '32px', maxWidth: '1100px', width: '100%', margin: '0 auto' }}>

          {/* ── Welcome hero ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'linear-gradient(135deg,#120a04 0%,#0d0d18 60%,#09090f 100%)', border: '0.5px solid #1e1e2e', borderRadius: '20px', padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>

            {/* Glow blob */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,69,0,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#fb923c', fontWeight: 600, marginBottom: '6px' }}>
                  {timeOfDay} 👋
                </p>
                <h1 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, color: '#fff', marginBottom: '8px', lineHeight: 1.2 }}>
                  {firstName}, let's land<br />
                  <span style={{ background: 'linear-gradient(90deg,#ff4500,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>your dream job.</span>
                </h1>
                <p style={{ color: '#a0a0b8', fontSize: '15px', lineHeight: 1.6, maxWidth: '500px' }}>
                  Your XLResume AI workspace is ready. Start with a quick action below — it takes less than 5 minutes.
                </p>
              </div>

              {/* Profile tags */}
              {profile?.persona && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  {[
                    { label: personaLabels[profile.persona] || profile.persona, color: '#fb923c' },
                    { label: roleLabels[profile.target_role] || profile.target_role, color: '#60a5fa' },
                  ].filter(t => t.label).map(tag => (
                    <span key={tag.label} style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: `0.5px solid ${tag.color}33`, color: tag.color, fontSize: '12px', fontWeight: 600 }}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Stats row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px', marginBottom: '24px' }}>
            {statCards.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                style={{ background: '#0d0d18', border: '0.5px solid #1e1e2e', borderRadius: '14px', padding: '20px 18px' }}>
                <span style={{ fontSize: '22px', display: 'block', marginBottom: '10px' }}>{s.icon}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</span>
                  {s.unit && <span style={{ fontSize: '13px', color: '#333350' }}>{s.unit}</span>}
                </div>
                <p style={{ fontSize: '12px', color: '#555570', margin: 0 }}>{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Quick actions ── */}
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '14px', marginBottom: '32px' }}>
            {quickActions.map((action, i) => (
              <motion.button key={action.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
                whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                style={{ background: action.gradient, border: `0.5px solid ${action.glow.replace('0.1', '0.3').replace('0.15', '0.3')}`, borderRadius: '16px', padding: '24px 20px', cursor: 'pointer', textAlign: 'left', fontFamily: 'Urbanist,sans-serif', boxShadow: `0 4px 32px ${action.glow}`, position: 'relative', overflow: 'hidden' }}>
                <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', color: action.badgeColor, fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px' }}>
                  {action.badge}
                </span>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>{action.icon}</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{action.title}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>{action.desc}</p>
              </motion.button>
            ))}
          </div>

          {/* ── Bottom row: Tip + Profile summary ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            {/* Daily tip */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ background: '#0d0d18', border: '0.5px solid #1e1e2e', borderRadius: '16px', padding: '24px', overflow: 'hidden', position: 'relative' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#fb923c', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>💡 Career Tip</p>
              <AnimatePresence mode="wait">
                <motion.p key={tipIndex}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  style={{ fontSize: '14px', color: '#a0a0b8', lineHeight: 1.75, margin: '0 0 16px' }}>
                  {tips[tipIndex].text}
                </motion.p>
              </AnimatePresence>
              <div style={{ display: 'flex', gap: '6px' }}>
                {tips.map((_, i) => (
                  <button key={i} onClick={() => setTipIndex(i)}
                    style={{ width: i === tipIndex ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === tipIndex ? '#fb923c' : '#1e1e2e', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
                ))}
              </div>
            </motion.div>

            {/* Profile summary */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              style={{ background: '#0d0d18', border: '0.5px solid #1e1e2e', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#555570', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>Your Profile</p>
                <a href="/onboarding" style={{ fontSize: '11px', color: '#fb923c', textDecoration: 'none', fontWeight: 600 }}>Edit →</a>
              </div>
              {profile && [
                { label: 'Name', value: profile.full_name },
                { label: 'Type', value: personaLabels[profile.persona] || '—' },
                { label: 'Target', value: roleLabels[profile.target_role] || '—' },
                { label: 'Goal', value: goalLabels[profile.goal] || '—' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '0.5px solid #1e1e2e' }}>
                  <span style={{ fontSize: '12px', color: '#555570' }}>{row.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#a0a0b8' }}>{row.value || '—'}</span>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}