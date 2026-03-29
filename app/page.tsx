'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { useTheme, DARK_THEME, LIGHT_THEME, ThemeTokens } from '../lib/theme-context';

// ─── Reusable animated section wrapper ───────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ─── Logo component with tagline ─────────────────────────────────────────────
function Logo({ t }: { t: ThemeTokens }) {
  return (
    <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg width="36" height="36" viewBox="0 0 52 52">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff4500" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
        </defs>
        <circle cx="26" cy="26" r="23" fill="none" stroke="url(#logoGrad)" strokeWidth="2.2" />
        <circle cx="26" cy="14" r="5" fill="none" stroke="url(#logoGrad)" strokeWidth="2.2" />
        <path d="M15,24 L26,38 M37,24 L26,38" stroke="url(#logoGrad)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M19,48 L19,38 L34,38" stroke="url(#logoGrad)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 800, fontSize: '20px', background: 'linear-gradient(90deg,#ff4500,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>XL</span>
          <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 700, fontSize: '20px', color: t.text, lineHeight: 1 }}>Resume</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {['Be Seen', 'Be Heard', 'Be Hired'].map((tag, i) => (
            <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '7.5px', fontWeight: 700, color: t.accentB, letterSpacing: '0.8px', textTransform: 'uppercase', whiteSpace: 'nowrap', opacity: 0.85 }}>{tag}</span>
              {i < 2 && <span style={{ color: t.accentB, fontSize: '7px', opacity: 0.4 }}>|</span>}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

// ─── Theme Toggle Button ──────────────────────────────────────────────────────
function ThemeToggle({ t, isDark, onToggle }: { t: ThemeTokens; isDark: boolean; onToggle: () => void }) {
  return (
    <motion.button onClick={onToggle} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ width: '38px', height: '38px', borderRadius: '10px', border: `1.5px solid ${t.border2}`, background: t.glass, color: t.textSub, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', transition: 'all 0.2s', flexShrink: 0 }}>
      <motion.span key={isDark ? 'sun' : 'moon'} initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
        {isDark ? '☀️' : '🌙'}
      </motion.span>
    </motion.button>
  );
}

// ─── Floating particle ───────────────────────────────────────────────────────
function Particle({ x, y, color, size, delay }: { x: string; y: string; color: string; size: number; delay: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', background: color, pointerEvents: 'none', filter: 'blur(1px)' }}
      animate={{ y: [0, -20, 0], opacity: [0.4, 0.9, 0.4], scale: [1, 1.3, 1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

// ─── Story cycle data ─────────────────────────────────────────────────────────
const STORY_STEPS = [
  {
    icon: '📄',
    prefix: 'Build your resume.',
    line: 'ATS-ready PDF in 2 minutes.',
    sub: 'AI writes every line. 12 premium templates. Beat the screening bots.',
    gradient: 'linear-gradient(135deg,#ff4500 0%,#fb923c 100%)',
  },
  {
    icon: '🎥',
    prefix: 'Record your video.',
    line: '100 seconds. Stand out forever.',
    sub: 'India\'s first AI video resume. Teleprompter, captions, filters included.',
    gradient: 'linear-gradient(135deg,#fb923c 0%,#facc15 100%)',
  },
  {
    icon: '📊',
    prefix: 'Check your ATS score.',
    line: 'Know your chances before you apply.',
    sub: 'Paste any job description. See missing keywords. Fix it in one click.',
    gradient: 'linear-gradient(135deg,#facc15 0%,#10b981 100%)',
  },
  {
    icon: '🎤',
    prefix: 'Prepare for interviews.',
    line: 'Practice until you are unshakeable.',
    sub: 'Real questions from Indian companies. AI feedback on every answer.',
    gradient: 'linear-gradient(135deg,#10b981 0%,#c084fc 100%)',
  },
  {
    icon: '🧭',
    prefix: 'Find your direction.',
    line: 'Your roadmap to the right career.',
    sub: 'Know exactly which skills to learn, roles to target, companies to approach.',
    gradient: 'linear-gradient(135deg,#c084fc 0%,#f472b6 100%)',
  },
  {
    icon: '🏆',
    prefix: 'You\'ve got this.',
    line: 'We will see you on the other side.',
    sub: 'Every great career started with one brave step. Yours starts here with XL Resume.',
    gradient: 'linear-gradient(135deg,#ff4500 0%,#fb923c 40%,#facc15 100%)',
    isFinal: true,
  },
];

// ─── Hero Story Cycle Component ───────────────────────────────────────────────
function HeroStoryCycle({ t }: { t: ThemeTokens }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setStep(s => (s + 1) % STORY_STEPS.length);
        setVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const current = STORY_STEPS[step];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginBottom: '36px', overflow: 'visible' }}
    >
      {/* XLResume brand label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '18px' }}>
        <div style={{ height: '1px', width: '40px', background: 'linear-gradient(90deg,transparent,#ff450044)' }} />
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#ff4500', letterSpacing: '2.5px', textTransform: 'uppercase' }}>XL Resume</span>
        <div style={{ height: '1px', width: '40px', background: 'linear-gradient(90deg,#ff450044,transparent)' }} />
      </div>

      {/* Step icon + prefix line (static feel, fades) */}
      <motion.div
        key={`prefix-${step}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}
      >
        <span style={{ fontSize: 'clamp(22px,3vw,32px)', lineHeight: 1 }}>{current.icon}</span>
        <span style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 'clamp(16px,2.2vw,22px)',
          fontWeight: 600,
          color: t.textSub,
          letterSpacing: '-0.3px',
        }}>
          {current.prefix}
        </span>
      </motion.div>

      {/* Main headline — the gradient cycling line */}
      <motion.div
        key={`line-${step}`}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: 'visible', paddingBottom: '14px' }}
      >
        <span style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(38px,7vw,82px)',
          fontWeight: 900,
          lineHeight: 1.14,
          letterSpacing: '-1.5px',
          display: 'block',
          overflow: 'visible',
          background: current.gradient,
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradientShift 4s ease infinite',
        }}>
          {current.line}
        </span>
      </motion.div>

      {/* Supporting line beneath */}
      <motion.p
        key={`sub-${step}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -6 }}
        transition={{ duration: 0.35, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontSize: 'clamp(14px,1.8vw,17px)',
          color: current.isFinal ? t.accentB : t.textSub,
          lineHeight: 1.75,
          maxWidth: '560px',
          margin: '0 auto 24px',
          fontWeight: current.isFinal ? 600 : 400,
        }}
      >
        {current.sub}
      </motion.p>

      {/* Step progress dots */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
        {STORY_STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => { setVisible(false); setTimeout(() => { setStep(i); setVisible(true); }, 300); }}
            style={{
              width: i === step ? '28px' : '7px',
              height: '7px',
              borderRadius: '4px',
              border: 'none',
              background: i === step ? current.gradient : t.border2,
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
              padding: 0,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { isDark, toggle } = useTheme();
  const t: ThemeTokens = isDark ? DARK_THEME : LIGHT_THEME;
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const mockupY = useTransform(scrollY, [0, 600], [0, 60]);
  const mockupOpacity = useTransform(scrollY, [0, 500], [1, 0.7]);

  const features = [
    { icon: '📄', title: 'AI Resume Builder', sub: 'ATS-ready in minutes', desc: 'Tell us your story in plain words. Our AI turns it into a perfectly formatted, ATS-optimised resume that gets past screening bots and impresses real humans. 12 premium templates built for Indian companies.', tags: ['ATS Optimised', '12 Templates', 'PDF Export', 'AI Writing'], color: '#ff4500' },
    { icon: '🎥', title: 'Video Resume', sub: '100 seconds to stand out', desc: 'India\'s first AI-guided video resume builder. Record a 100-second video introduction with teleprompter support, auto-captions, and professional background filters. Make recruiters remember you.', tags: ['Teleprompter', 'Auto-captions', 'Filters', 'Share Link'], color: '#fb923c' },
    { icon: '📊', title: 'ATS Score', sub: 'Know before you apply', desc: 'Paste any job description and see exactly how well your resume matches it. Get a detailed score, missing keywords, and specific suggestions to improve your shortlisting chances.', tags: ['Job Matching', 'Keyword Gap', 'Score Report', 'Instant'], color: '#facc15' },
    { icon: '🧭', title: 'Career Roadmap', sub: 'Clarity on your next move', desc: 'Not sure which role to target or how to get there? Our AI analyses your background and builds a personalised 90-day career plan with skills to learn, roles to target, and companies to approach.', tags: ['90-Day Plan', 'Skill Gaps', 'Role Match', 'Personalised'], color: '#10b981' },
    { icon: '🎤', title: 'Interview Prep', sub: 'Practice until confident', desc: 'Role-specific mock interviews powered by AI. Get asked real questions that companies in India ask, receive feedback on your answers, and track your improvement over time.', tags: ['Mock Interviews', 'AI Feedback', 'Role-specific', 'Progress Track'], color: isDark ? '#c084fc' : '#7c3aed' },
    { icon: '🗣️', title: 'English Coaching', sub: 'Communication that opens doors', desc: 'Many talented graduates lose opportunities because of spoken English. Our AI coach helps you improve pronunciation, vocabulary, and professional communication through daily 10-minute sessions.', tags: ['Daily Practice', 'Pronunciation', 'Vocabulary', 'Workplace English'], color: isDark ? '#f472b6' : '#db2777' },
  ];

  const stats = [
    { num: '10M+', label: 'Graduates enter India\'s workforce every year' },
    { num: '3x', label: 'Higher interview callback with an ATS-optimised resume' },
    { num: '101', prefix: '₹', label: 'Starting price, most affordable in India' },
    { num: '48h', label: 'Average time from signup to first interview call' },
  ];

  const testimonials = [
    { text: 'I had been applying for 3 months with zero response. After using XLResume, I got 4 interview calls in the first week. The ATS score feature showed me exactly what was wrong.', name: 'Priya Sharma', role: 'Software Engineer, Bangalore', avatar: 'PS', college: 'NIT Trichy', color: '#ff4500' },
    { text: 'The video resume feature is unlike anything else in India. A recruiter from Flipkart messaged me on LinkedIn saying my video stood out from 200+ applications.', name: 'Rahul Mehta', role: 'Product Manager, Mumbai', avatar: 'RM', college: 'IIM Ahmedabad', color: '#fb923c' },
    { text: 'As a tier-3 college student I always felt at a disadvantage. XLResume helped me build a resume that competed with IIT graduates. Got into Infosys BPM in my first attempt.', name: 'Ananya Krishnan', role: 'Business Analyst, Hyderabad', avatar: 'AK', college: 'Osmania University', color: '#10b981' },
    { text: 'The career roadmap told me exactly which skills to learn and in what order. I followed it for 90 days and landed my first data science role without any referral.', name: 'Vikram Nair', role: 'Data Analyst, Pune', avatar: 'VN', college: 'BITS Pilani', color: isDark ? '#c084fc' : '#7c3aed' },
  ];

  const pricing = [
    { name: 'Starter', price: '0', period: 'forever', desc: 'Start building and see the difference', features: ['1 AI Resume', 'ATS Score (3 per month)', 'Basic templates (3)', 'PDF Download'], cta: 'Start Free', highlight: false },
    { name: 'Pro', price: '299', period: 'per month', desc: 'Everything you need to get hired', features: ['Unlimited AI Resumes', 'Unlimited ATS Score', 'All 50 templates', 'Video Resume (3)', 'Interview Prep', 'Career Roadmap', 'Priority support'], cta: 'Start Pro', highlight: true, badge: 'Most Popular' },
    { name: 'Elite', price: '799', period: 'per month', desc: 'For serious career movers', features: ['Everything in Pro', 'Unlimited Video Resumes', 'English coaching daily', 'Job application tracking', '1-on-1 expert review', 'LinkedIn optimisation', 'Placement guarantee*'], cta: 'Go Elite', highlight: false },
  ];

  const faqs = [
    { q: 'Is XLResume only for freshers?', a: 'Not at all. We serve freshers, mid-level professionals, and senior leaders switching roles. The AI adapts its suggestions based on your experience level and target role.' },
    { q: 'How is XLResume different from Naukri or Shine?', a: 'Job boards help you apply. XLResume helps you get shortlisted. We focus entirely on making your profile irresistible to recruiters, with AI that understands the Indian job market specifically.' },
    { q: 'Will my resume pass ATS systems used by Indian companies?', a: 'Yes. We have tested our templates and AI output against ATS systems used by TCS, Infosys, Wipro, Flipkart, Swiggy, and 50+ other Indian companies. Our ATS score reflects real-world compatibility.' },
    { q: 'Can I download my resume as a PDF?', a: 'Yes, every plan includes PDF download. The PDF is pixel-perfect and safe to email, upload, or print. We use professional typesetting, not browser screenshots.' },
    { q: 'Is my data private?', a: 'Absolutely. Your resume data is encrypted, never sold, and never used to train models without your permission. You can delete your account and all data at any time.' },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: t.nav, borderBottom: `1px solid ${t.border}`,
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    transition: 'background 0.3s',
  };

  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: '"DM Sans", sans-serif', overflowX: 'hidden', transition: 'background 0.4s, color 0.4s' }}>

      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:${t.bg}; }
        ::-webkit-scrollbar-thumb { background:${t.border2}; border-radius:3px; }
        ::selection { background:rgba(255,69,0,0.25); }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,69,0,0.3); }
          50%       { box-shadow: 0 0 40px rgba(255,69,0,0.6); }
        }

        /* ── Mobile responsive ── */
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-actions { display: flex; align-items: center; gap: 8px; }
        .nav-signin { display: flex; }
        .hamburger { display: none; }
        .mobile-menu { display: none; }

        .features-layout { display: flex; gap: 28px; align-items: flex-start; }
        .features-tabs { width: 270px; flex-shrink: 0; display: flex; flex-direction: column; gap: 5px; }
        .features-panel { flex: 1; }

        .how-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 20px; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(270px,1fr)); gap: 18px; }
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 20px; align-items: start; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 48px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 56px; }

        .cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .trust-row { display: flex; align-items: center; justify-content: center; gap: 28px; flex-wrap: wrap; }

        .hero-mockup-max { max-width: 740px; }
        .hero-padding { padding: 60px 24px; }
        .section-pad { padding: 120px 24px; }
        .section-pad-sm { padding: 80px 24px; }
        .section-pad-md { padding: 100px 24px; }

        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-signin { display: none !important; }
          .hamburger { display: flex !important; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 9px; border: 1.5px solid ${t.border2}; background: ${t.glass}; color: ${t.text}; cursor: pointer; font-size: 18px; flex-shrink: 0; }
          .mobile-menu { display: flex !important; flex-direction: column; position: fixed; top: 62px; left: 0; right: 0; background: ${t.bg2}; border-bottom: 1px solid ${t.border}; padding: 20px 24px; gap: 14px; z-index: 99; backdrop-filter: blur(20px); }
          .mobile-menu.closed { display: none !important; }
          .mobile-menu a { font-size: 16px; font-weight: 600; color: ${t.textSub}; text-decoration: none; padding: 10px 0; border-bottom: 1px solid ${t.border}; }

          .features-layout { flex-direction: column !important; gap: 16px !important; }
          .features-tabs { width: 100% !important; flex-direction: row !important; overflow-x: auto; flex-wrap: nowrap; gap: 8px !important; padding-bottom: 4px; }
          .features-tabs button { flex-shrink: 0; min-width: 140px; }
          .features-panel { width: 100% !important; }

          .how-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }

          .hero-padding { padding: 40px 20px !important; }
          .section-pad { padding: 72px 20px !important; }
          .section-pad-sm { padding: 56px 20px !important; }
          .section-pad-md { padding: 64px 20px !important; }
          .hero-mockup-max { max-width: 100% !important; }

          .trust-row { gap: 14px !important; }
          .cta-btns { flex-direction: column !important; align-items: center; }
          .cta-btns a { width: 100% !important; max-width: 320px; justify-content: center !important; text-align: center; }

          .footer-social { display: none; }
          .pricing-highlight { transform: scale(1) !important; }
        }

        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={navStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <Logo t={t} />

          {/* Desktop links */}
          <div className="nav-links">
            {['Features', 'Pricing', 'Testimonials', 'FAQ'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                style={{ color: t.textSub, fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = t.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = t.textSub)}>
                {link}
              </a>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="nav-actions">
            <ThemeToggle t={t} isDark={isDark} onToggle={toggle} />
            <a href="/auth/login" className="nav-signin"
              style={{ padding: '8px 16px', borderRadius: '8px', border: `1.5px solid ${t.border2}`, background: 'none', color: t.text, fontSize: '14px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.border2; e.currentTarget.style.color = t.text; }}>
              Sign In
            </a>
            <motion.a href="/auth/signup" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '8px 18px', borderRadius: '8px', background: 'linear-gradient(135deg,#ff4500,#fb923c)', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 3px 14px rgba(255,69,0,0.3)', whiteSpace: 'nowrap' }}>
              Get Started Free
            </motion.a>
            {/* Mobile hamburger */}
            <button className="hamburger" onClick={() => setMobileMenuOpen(o => !o)} aria-label="Menu">
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div className={`mobile-menu${mobileMenuOpen ? '' : ' closed'}`}>
          {['Features', 'Pricing', 'Testimonials', 'FAQ'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '16px', fontWeight: 600, color: t.textSub, textDecoration: 'none', padding: '12px 0', borderBottom: `1px solid ${t.border}`, display: 'block' }}>
              {link}
            </a>
          ))}
          <a href="/auth/login" style={{ fontSize: '16px', fontWeight: 600, color: t.text, textDecoration: 'none', padding: '12px 0', display: 'block', borderBottom: `1px solid ${t.border}` }}>Sign In</a>
          <a href="/auth/signup" style={{ display: 'block', marginTop: '4px', padding: '13px', borderRadius: '10px', background: 'linear-gradient(135deg,#ff4500,#fb923c)', color: '#fff', fontSize: '15px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', boxShadow: '0 4px 16px rgba(255,69,0,0.35)' }}>
            Get Started Free
          </a>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <ThemeToggle t={t} isDark={isDark} onToggle={toggle} />
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: '62px' }}>

        {/* Ambient background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {/* Primary glow */}
          <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '700px', borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(255,69,0,0.12) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(124,58,237,0.09) 0%,transparent 65%)' }} />
          {/* Secondary glows */}
          <motion.div animate={{ x: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '25%', right: '12%', width: '320px', height: '320px', borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(251,146,60,0.08) 0%,transparent 70%)' : 'radial-gradient(circle,rgba(219,39,119,0.07) 0%,transparent 70%)' }} />
          <motion.div animate={{ x: [0, -20, 0], y: [0, 20, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{ position: 'absolute', bottom: '20%', left: '10%', width: '260px', height: '260px', borderRadius: '50%', background: isDark ? 'radial-gradient(circle,rgba(192,132,252,0.06) 0%,transparent 70%)' : 'radial-gradient(circle,rgba(16,185,129,0.06) 0%,transparent 70%)' }} />
          {/* Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.border} 1px,transparent 1px),linear-gradient(90deg,${t.border} 1px,transparent 1px)`, backgroundSize: '64px 64px', opacity: isDark ? 0.45 : 0.55, maskImage: 'radial-gradient(ellipse 85% 70% at 50% 50%,black 0%,transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 85% 70% at 50% 50%,black 0%,transparent 100%)' }} />
          {/* Floating particles */}
          {isDark ? (
            <>
              <Particle x="15%" y="30%" color="#ff4500" size={5} delay={0} />
              <Particle x="80%" y="20%" color="#fb923c" size={4} delay={1.5} />
              <Particle x="72%" y="65%" color="#facc15" size={6} delay={3} />
              <Particle x="25%" y="72%" color="#c084fc" size={4} delay={2} />
              <Particle x="55%" y="15%" color="#f472b6" size={3} delay={4} />
            </>
          ) : (
            <>
              <Particle x="15%" y="30%" color="#7c3aed" size={5} delay={0} />
              <Particle x="80%" y="20%" color="#db2777" size={4} delay={1.5} />
              <Particle x="72%" y="65%" color="#ff4500" size={6} delay={3} />
              <Particle x="25%" y="72%" color="#7c3aed" size={4} delay={2} />
              <Particle x="55%" y="15%" color="#db2777" size={3} delay={4} />
            </>
          )}
        </div>

        {/* Hero content */}
        <div className="hero-padding" style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto', textAlign: 'center', width: '100%' }}>

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease: [0.22,1,0.36,1] }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', border: `1px solid ${t.border2}`, background: t.glass, marginBottom: '36px', backdropFilter: 'blur(8px)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e55', display: 'inline-block', animation: 'pulseGlow 2s infinite' }} />
            <span style={{ fontSize: '13px', fontWeight: 500, color: t.textSub }}>Built for India's 10 million annual graduates</span>
          </motion.div>

          {/* Headline — Story Cycle */}
          <HeroStoryCycle t={t} />

          {/* CTAs */}
          <motion.div className="cta-btns" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            style={{ marginBottom: '44px' }}>
            <motion.a href="/auth/signup" whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(255,69,0,0.5)' }} whileTap={{ scale: 0.97 }}
              style={{ padding: '15px 36px', borderRadius: '12px', background: 'linear-gradient(135deg,#ff4500,#fb923c)', color: '#fff', fontSize: '16px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 22px rgba(255,69,0,0.38)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              Build Your Resume Free <span style={{ fontSize: '18px' }}>→</span>
            </motion.a>
            <motion.a href="#features" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '15px 30px', borderRadius: '12px', border: `1.5px solid ${t.border2}`, background: t.glass, color: t.text, fontSize: '16px', fontWeight: 600, textDecoration: 'none', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              See Features
            </motion.a>
          </motion.div>

          {/* Trust signals */}
          <motion.div className="trust-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            style={{ marginBottom: '72px' }}>
            {['No credit card required', 'Free forever plan', 'Built for Indian market'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: t.textMuted, fontWeight: 500 }}>
                <span style={{ color: '#22c55e' }}>✓</span> {s}
              </div>
            ))}
          </motion.div>

          {/* Resume mockup */}
          <motion.div className="hero-mockup-max" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.9, ease: [0.22,1,0.36,1] }}
            style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <motion.div style={{ y: mockupY, opacity: mockupOpacity }}>
              {/* Glow ring */}
              <div style={{ position: 'absolute', inset: '-3px', borderRadius: '20px', background: isDark ? 'linear-gradient(135deg,rgba(255,69,0,0.5),rgba(251,146,60,0.25),rgba(192,132,252,0.2))' : 'linear-gradient(135deg,rgba(124,58,237,0.35),rgba(219,39,119,0.2),rgba(255,69,0,0.2))', filter: 'blur(18px)', zIndex: 0 }} />
              {/* Card */}
              <div style={{ position: 'relative', zIndex: 1, background: isDark ? '#13131c' : '#ffffff', border: `1px solid ${t.border2}`, borderRadius: '18px', padding: '30px', textAlign: 'left', boxShadow: t.shadow, overflow: 'hidden' }}>
                {/* Subtle inner glow */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,#ff4500,#fb923c,#facc15)', borderRadius: '18px 18px 0 0' }} />

                {/* Resume header mock */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', paddingBottom: '18px', borderBottom: '2px solid #ff4500' }}>
                  <div>
                    <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '22px', fontWeight: 800, color: isDark ? '#f0efec' : '#0f0e18', marginBottom: '3px' }}>Priya Sharma</div>
                    <div style={{ fontSize: '11px', color: '#ff4500', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.5px' }}>Product Manager</div>
                    <div style={{ display: 'flex', gap: '14px', fontSize: '9.5px', color: isDark ? '#64748b' : '#888' }}>
                      <span>priya@gmail.com</span>
                      <span>Bangalore</span>
                      <span>linkedin.com/in/priya</span>
                    </div>
                  </div>
                  <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
                    style={{ padding: '5px 12px', borderRadius: '100px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', fontSize: '11px', fontWeight: 800, color: '#22c55e', whiteSpace: 'nowrap' }}>
                    ATS Score: 94
                  </motion.div>
                </div>

                {/* Content skeleton */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 155px', gap: '22px' }}>
                  <div>
                    {[{ label: 'PROFILE SUMMARY', h: 38 }, { label: 'WORK EXPERIENCE', h: 60 }, { label: 'PROJECTS', h: 44 }].map(({ label, h }, i) => (
                      <div key={i} style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '7px', letterSpacing: '2px', color: '#ff4500', fontWeight: 800, textTransform: 'uppercase', marginBottom: '7px' }}>{label}</div>
                        <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                          style={{ height: h, background: isDark ? 'rgba(255,255,255,0.045)' : 'rgba(124,58,237,0.05)', borderRadius: '6px', border: isDark ? 'none' : '1px solid rgba(124,58,237,0.08)' }} />
                      </div>
                    ))}
                  </div>
                  <div>
                    {[{ label: 'SKILLS', h: 54 }, { label: 'EDUCATION', h: 42 }, { label: 'CERTIFICATIONS', h: 34 }].map(({ label, h }, i) => (
                      <div key={i} style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '7px', letterSpacing: '2px', color: '#ff4500', fontWeight: 800, textTransform: 'uppercase', marginBottom: '7px' }}>{label}</div>
                        <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 + 0.3 }}
                          style={{ height: h, background: isDark ? 'rgba(255,255,255,0.045)' : 'rgba(124,58,237,0.05)', borderRadius: '6px', border: isDark ? 'none' : '1px solid rgba(124,58,237,0.08)' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating AI badge */}
              <div style={{ position: 'absolute', top: '-18px', right: '28px', background: 'linear-gradient(135deg,#ff4500,#fb923c)', borderRadius: '12px', padding: '9px 16px', boxShadow: '0 8px 28px rgba(255,69,0,0.45)', display: 'flex', alignItems: 'center', gap: '7px', animation: 'floatBadge 3s ease-in-out infinite', zIndex: 10 }}>
                <span style={{ fontSize: '14px' }}>✨</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>AI-generated in 2 minutes</span>
              </div>

              {/* Floating video badge */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1.5, ease: 'easeInOut' }}
                style={{ position: 'absolute', bottom: '-16px', left: '28px', background: isDark ? '#1a1a24' : '#fff', border: `1px solid ${t.border2}`, borderRadius: '12px', padding: '10px 16px', boxShadow: t.shadow, display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
                <span style={{ fontSize: '18px' }}>🎥</span>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: t.text }}>Video Resume</div>
                  <div style={{ fontSize: '10px', color: t.textMuted }}>100 seconds. Stand out.</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: t.bg2, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div className="stats-grid" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '1px', marginBottom: '12px' }}>
                  {s.prefix && (
                    <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 'clamp(20px,2.2vw,28px)', fontWeight: 700, background: 'linear-gradient(135deg,#ff4500,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, position: 'relative', top: '-10px', marginRight: '2px' }}>{s.prefix}</span>
                  )}
                  <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 'clamp(48px,6vw,72px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1, background: 'linear-gradient(135deg,#ff4500,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.num}</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: t.textSub, lineHeight: 1.6, maxWidth: '180px', margin: '0 auto' }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section id="features" className="section-pad">
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '72px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: t.accent, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '14px' }}>Everything you need</div>
              <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(32px,5vw,54px)', fontWeight: 800, color: t.text, marginBottom: '16px', lineHeight: 1.12 }}>
                One platform. Every career tool.
              </h2>
              <p style={{ fontSize: '17px', color: t.textSub, maxWidth: '500px', margin: '0 auto', lineHeight: 1.75 }}>
                Stop juggling 10 different tools. XLResume gives you everything from resume to interview prep, built for how India hires.
              </p>
            </div>
          </Reveal>

          <div className="features-layout">
            {/* Tabs */}
            <div className="features-tabs">
              {features.map((f, i) => (
                <motion.button key={i} onClick={() => setActiveFeature(i)} whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 15px', borderRadius: '11px', border: `1px solid ${activeFeature === i ? f.color + '44' : t.border}`, background: activeFeature === i ? `${f.color}14` : t.glass, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: '"DM Sans",sans-serif' }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: activeFeature === i ? t.text : t.textSub, marginBottom: '1px' }}>{f.title}</div>
                    <div style={{ fontSize: '11.5px', color: activeFeature === i ? f.color : t.textMuted }}>{f.sub}</div>
                  </div>
                  {activeFeature === i && <motion.div layoutId="featureIndicator" style={{ width: '3px', height: '28px', borderRadius: '2px', background: f.color, marginLeft: 'auto', flexShrink: 0 }} />}
                </motion.button>
              ))}
            </div>

            {/* Detail panel */}
            <div className="features-panel">
              <AnimatePresence mode="wait">
                <motion.div key={activeFeature} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
                  style={{ background: t.bg2, border: `1px solid ${t.border}`, borderRadius: '20px', padding: '40px', minHeight: '360px', position: 'relative', overflow: 'hidden' }}>
                  {/* Accent glow */}
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '260px', height: '260px', borderRadius: '50%', background: `radial-gradient(circle,${features[activeFeature].color}1a 0%,transparent 70%)`, pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,${features[activeFeature].color}88,transparent)` }} />
                  <div style={{ fontSize: '52px', marginBottom: '22px' }}>{features[activeFeature].icon}</div>
                  <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: '30px', fontWeight: 800, color: t.text, marginBottom: '7px' }}>{features[activeFeature].title}</h3>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: features[activeFeature].color, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1.2px' }}>{features[activeFeature].sub}</div>
                  <p style={{ fontSize: '15.5px', color: t.textSub, lineHeight: 1.82, marginBottom: '28px', maxWidth: '540px' }}>{features[activeFeature].desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                    {features[activeFeature].tags.map((tag, i) => (
                      <span key={i} style={{ padding: '5px 13px', borderRadius: '100px', background: `${features[activeFeature].color}14`, border: `1px solid ${features[activeFeature].color}30`, fontSize: '12px', fontWeight: 600, color: features[activeFeature].color }}>{tag}</span>
                    ))}
                  </div>
                  <motion.a href="/auth/signup" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 22px', borderRadius: '9px', background: 'linear-gradient(135deg,#ff4500,#fb923c)', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(255,69,0,0.3)' }}>
                    Try this feature free →
                  </motion.a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="section-pad-md" style={{ background: t.bg2, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '72px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: t.accent, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '14px' }}>How it works</div>
              <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(30px,4.5vw,50px)', fontWeight: 800, color: t.text, lineHeight: 1.15 }}>Resume ready in 10 minutes.</h2>
            </div>
          </Reveal>
          <div className="how-grid">
            {[
              { step: '01', icon: '📝', title: 'Tell us about yourself', desc: 'Answer a few simple questions about your background, skills, and the role you want. No formatting skills needed.' },
              { step: '02', icon: '✨', title: 'AI builds your resume', desc: 'Our AI writes your summary, bullet points, and arranges everything in an ATS-friendly format automatically.' },
              { step: '03', icon: '🎯', title: 'Score and optimise', desc: 'Paste any job description and get an instant ATS score. Add missing keywords with one click.' },
              { step: '04', icon: '📥', title: 'Download and apply', desc: 'Export pixel-perfect PDF. Apply with confidence. Track callbacks right inside XLResume.' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4, borderColor: t.accent + '44' }} transition={{ type: 'spring', stiffness: 300 }}
                  style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s', cursor: 'default' }}>
                  <div style={{ position: 'absolute', top: '-8px', right: '-2px', fontFamily: '"Playfair Display",serif', fontSize: '90px', fontWeight: 900, color: isDark ? 'rgba(255,255,255,0.028)' : 'rgba(124,58,237,0.06)', lineHeight: 1, userSelect: 'none' }}>{item.step}</div>
                  <div style={{ fontSize: '34px', marginBottom: '14px' }}>{item.icon}</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: t.accent, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Step {item.step}</div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: t.text, marginBottom: '10px', lineHeight: 1.3 }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: t.textSub, lineHeight: 1.75 }}>{item.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section id="testimonials" className="section-pad">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: t.accent, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '14px' }}>Real stories</div>
              <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(30px,4.5vw,50px)', fontWeight: 800, color: t.text, lineHeight: 1.15 }}>
                They got hired. You are next.
              </h2>
            </div>
          </Reveal>
          <div className="testimonials-grid">
            {testimonials.map((tm, i) => (
              <Reveal key={i} delay={i * 0.09}>
                <motion.div whileHover={{ y: -5, boxShadow: `0 16px 48px ${tm.color}22` }} transition={{ type: 'spring', stiffness: 300 }}
                  style={{ background: t.bg2, border: `1px solid ${t.border}`, borderRadius: '18px', padding: '28px', transition: 'box-shadow 0.25s', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,${tm.color},transparent)`, borderRadius: '18px 18px 0 0' }} />
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
                    {[...Array(5)].map((_, j) => <span key={j} style={{ color: '#facc15', fontSize: '14px' }}>★</span>)}
                  </div>
                  <p style={{ fontSize: '15px', color: t.textSub, lineHeight: 1.82, marginBottom: '24px', fontStyle: 'italic' }}>"{tm.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: `linear-gradient(135deg,${tm.color},${tm.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{tm.avatar}</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: t.text }}>{tm.name}</div>
                      <div style={{ fontSize: '12px', color: t.textSub }}>{tm.role}</div>
                      <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '1px' }}>{tm.college}</div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────────── */}
      <section id="pricing" className="section-pad" style={{ background: t.bg2, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: t.accent, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '14px' }}>Pricing</div>
              <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(30px,4.5vw,50px)', fontWeight: 800, color: t.text, marginBottom: '14px', lineHeight: 1.15 }}>Investment in your career.</h2>
              <p style={{ fontSize: '16px', color: t.textSub, maxWidth: '380px', margin: '0 auto', lineHeight: 1.75 }}>Start free. Upgrade when you are ready. Cancel anytime.</p>
            </div>
          </Reveal>
          <div className="pricing-grid">
            {pricing.map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={plan.highlight ? 'pricing-highlight' : ''} style={{ background: plan.highlight ? (isDark ? '#14141e' : '#fff') : t.bg, border: `1.5px solid ${plan.highlight ? t.accentAlt : t.border}`, borderRadius: '20px', padding: '32px', position: 'relative', boxShadow: plan.highlight ? `0 16px 52px ${isDark ? 'rgba(192,132,252,0.2)' : 'rgba(124,58,237,0.16)'}` : 'none', transform: plan.highlight ? 'scale(1.04)' : 'scale(1)' }}>
                  {plan.badge && (
                    <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg,${t.accentAlt},${t.accentAlt2})`, borderRadius: '100px', padding: '4px 16px', fontSize: '11.5px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{plan.badge}</div>
                  )}
                  <div style={{ fontSize: '13px', fontWeight: 700, color: t.textSub, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 600, color: t.textSub }}>₹</span>
                    <span style={{ fontFamily: '"Playfair Display",serif', fontSize: '52px', fontWeight: 900, color: t.text, lineHeight: 1 }}>{plan.price}</span>
                    <span style={{ fontSize: '13px', color: t.textMuted, marginLeft: '4px' }}>/{plan.period}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: t.textSub, marginBottom: '24px', lineHeight: 1.5 }}>{plan.desc}</div>
                  <motion.a href="/auth/signup" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: '10px', background: plan.highlight ? `linear-gradient(135deg,${t.accentAlt},${t.accentAlt2})` : 'none', border: plan.highlight ? 'none' : `1.5px solid ${t.border2}`, color: plan.highlight ? '#fff' : t.text, fontSize: '15px', fontWeight: 700, textDecoration: 'none', marginBottom: '24px', boxShadow: plan.highlight ? `0 4px 18px ${t.accentAlt}44` : 'none', fontFamily: '"DM Sans",sans-serif' }}>
                    {plan.cta}
                  </motion.a>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {plan.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: t.textSub }}>
                        <span style={{ color: t.success, fontSize: '14px', flexShrink: 0 }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '12px', color: t.textMuted, marginTop: '32px' }}>*Placement guarantee terms apply. See full terms.</p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section id="faq" className="section-pad">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: t.accent, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '14px' }}>FAQ</div>
              <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(30px,4.5vw,50px)', fontWeight: 800, color: t.text, lineHeight: 1.15 }}>Questions answered.</h2>
            </div>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div>
                  <motion.button onClick={() => setActiveFaq(activeFaq === i ? null : i)} whileHover={{ borderColor: t.accent + '55' }}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderRadius: '12px', border: `1px solid ${activeFaq === i ? t.accent + '44' : t.border}`, background: activeFaq === i ? t.bg2 : t.glass, cursor: 'pointer', textAlign: 'left', gap: '16px', transition: 'all 0.2s', fontFamily: '"DM Sans",sans-serif', backdropFilter: 'blur(8px)' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: t.text, lineHeight: 1.4 }}>{faq.q}</span>
                    <motion.span animate={{ rotate: activeFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                      style={{ fontSize: '24px', color: t.accent, flexShrink: 0, lineHeight: 1, fontWeight: 300 }}>+</motion.span>
                  </motion.button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.22,1,0.36,1] }} style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px 20px', fontSize: '15px', color: t.textSub, lineHeight: 1.82 }}>{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: t.bg2, borderTop: `1px solid ${t.border}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '400px', background: isDark ? 'radial-gradient(ellipse,rgba(255,69,0,0.12) 0%,transparent 65%)' : 'radial-gradient(ellipse,rgba(124,58,237,0.1) 0%,transparent 65%)' }} />
        </div>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(36px,6vw,70px)', fontWeight: 900, color: t.text, lineHeight: 1.08, marginBottom: '22px' }}>
              Your dream job starts<br />
              <span style={{ background: 'linear-gradient(135deg,#ff4500,#fb923c,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradientShift 5s ease infinite', backgroundSize: '200% 200%' }}>
                with a great resume.
              </span>
            </h2>
            <p style={{ fontSize: '18px', color: t.textSub, lineHeight: 1.75, marginBottom: '44px', maxWidth: '500px', margin: '0 auto 44px' }}>
              Join thousands of Indian graduates who built their career with XLResume. Free to start. No credit card needed.
            </p>
            <div className="cta-btns" style={{ marginTop: '0' }}>
              <motion.a href="/auth/signup" whileHover={{ scale: 1.05, boxShadow: '0 14px 44px rgba(255,69,0,0.55)' }} whileTap={{ scale: 0.97 }}
                style={{ padding: '17px 44px', borderRadius: '12px', background: 'linear-gradient(135deg,#ff4500,#fb923c)', color: '#fff', fontSize: '17px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 6px 26px rgba(255,69,0,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Start Building Free
              </motion.a>
              <motion.a href="/auth/login" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ padding: '17px 34px', borderRadius: '12px', border: `1.5px solid ${t.border2}`, background: t.glass, color: t.text, fontSize: '17px', fontWeight: 600, textDecoration: 'none', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Sign In
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: '60px 24px 36px', background: t.bg }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="footer-grid">
            <div>
              <Logo t={t} />
              <p style={{ fontSize: '14px', color: t.textSub, lineHeight: 1.8, maxWidth: '260px', marginTop: '16px', marginBottom: '20px' }}>
                India's most intelligent resume platform. Built to help every graduate, from tier-1 to tier-3, compete and win.
              </p>
              <div className="footer-social" style={{ display: 'flex', gap: '8px' }}>
                {['📧', '🐦', '💼', '📸'].map((icon, i) => (
                  <div key={i} style={{ width: '34px', height: '34px', borderRadius: '8px', border: `1px solid ${t.border}`, background: t.glass, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', cursor: 'pointer' }}>{icon}</div>
                ))}
              </div>
            </div>
            {[
              { heading: 'Product', links: ['Resume Builder', 'Video Resume', 'ATS Score', 'Career Roadmap', 'Interview Prep'] },
              { heading: 'Company', links: ['About Us', 'Blog', 'Careers', 'Press', 'Contact'] },
              { heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookie Policy'] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: t.text, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>{col.heading}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.links.map(link => (
                    <a key={link} href="#" style={{ fontSize: '14px', color: t.textSub, textDecoration: 'none', transition: 'color 0.18s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = t.accent)}
                      onMouseLeave={e => (e.currentTarget.style.color = t.textSub)}>
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '13px', color: t.textMuted }}>2026 XLResume. Built with love for India.</div>
            <ThemeToggle t={t} isDark={isDark} onToggle={toggle} />
          </div>
        </div>
      </footer>
    </div>
  );
}