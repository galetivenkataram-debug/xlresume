'use client';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const s = size === 'sm' ? 1 : size === 'lg' ? 1.4 : 1;
  const tagSize = size === 'sm' ? 8.5 : 10;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: `${16 * s}px` }}>
      <svg width={52 * s} height={52 * s} viewBox="0 0 52 52" style={{ flexShrink: 0 }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '1.5px', height: `${26 * s}px`, background: '#3a1a08', marginRight: `${12 * s}px`, flexShrink: 0 }} />
          <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 800, fontSize: `${28 * s}px`, background: 'linear-gradient(90deg,#ff4500,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.5px' }}>XL</span>
          <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 300, fontSize: `${28 * s}px`, color: '#fff', letterSpacing: '-0.3px', marginLeft: '6px' }}>Resume</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '14px', whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 600, fontSize: `${tagSize}px`, color: '#fb923c', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Be Seen</span>
          <span style={{ color: '#fb923c', fontSize: `${tagSize}px`, opacity: 0.4 }}>|</span>
          <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 600, fontSize: `${tagSize}px`, color: '#fb923c', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Be Heard</span>
          <span style={{ color: '#fb923c', fontSize: `${tagSize}px`, opacity: 0.4 }}>|</span>
          <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 600, fontSize: `${tagSize}px`, color: '#fb923c', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Be Hired</span>
        </div>
      </div>
    </div>
  );
};

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
};

const OrbitBadge = () => (
  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '36px' }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', width: '108%', height: '220%', borderRadius: '100px', border: '1px dashed rgba(255,69,0,0.2)', pointerEvents: 'none' }}
    />
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', width: '108%', height: '220%', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)', width: '9px', height: '9px', borderRadius: '50%', background: 'linear-gradient(135deg,#ff4500,#facc15)', boxShadow: '0 0 10px rgba(255,69,0,0.9)' }} />
    </motion.div>
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', width: '108%', height: '220%', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)', width: '7px', height: '7px', borderRadius: '50%', background: '#facc15', boxShadow: '0 0 8px rgba(250,204,21,0.9)' }} />
    </motion.div>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,69,0,0.08)', border: '1px solid rgba(255,69,0,0.25)', borderRadius: '100px', padding: '12px 28px', position: 'relative', zIndex: 1 }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4500', flexShrink: 0, boxShadow: '0 0 8px rgba(255,69,0,0.8)' }} />
      <span style={{ fontSize: '15px', color: '#fb923c', fontWeight: 600, letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
        India's best and most affordable AI resume platform
      </span>
    </div>
  </div>
);

const words = ['Resume', 'Career', 'Future', 'Story', 'Journey'];

const pricingPlans = [
  { name: 'Free', price: 'Free', period: 'forever', popular: false, color: '#555570', features: ['1 PDF resume download', 'Resume score preview', 'Basic ATS check', 'Community support'], cta: 'Start Free', href: '/auth/signup' },
  { name: 'Starter', price: '₹101', period: '/month', popular: false, color: '#fb923c', features: ['3 PDF resume downloads', 'Full ATS score and tips', '5 resume templates', 'Cover letter once a month', 'Email support'], cta: 'Get Starter', href: '/auth/signup?plan=starter' },
  { name: 'Builder', price: '₹249', period: '/month', popular: false, color: '#f97316', features: ['Unlimited PDF resumes', '2 video resumes per month', 'Resume score and improvements', 'Unlimited cover letters', 'LinkedIn headline AI', 'All templates'], cta: 'Get Builder', href: '/auth/signup?plan=builder' },
  { name: 'Pro', price: '₹449', period: '/month', popular: true, color: '#ff4500', features: ['Everything in Builder', '5 video resumes per month', 'AI career roadmap', 'Skill gap analysis', 'Unlimited mock tests', 'Job role match score', 'Priority support'], cta: 'Get Pro', href: '/auth/signup?plan=pro' },
  { name: 'Elite', price: '₹649', period: '/month', popular: false, color: '#dc2626', features: ['Everything in Pro', 'Unlimited video resumes', 'AI mock interviews', 'English coaching AI', 'Interview confidence score', 'Job match alerts', '24/7 priority support'], cta: 'Get Elite', href: '/auth/signup?plan=elite' },
  { name: 'Campus', price: '₹999', period: '/6 months', popular: false, color: '#eab308', features: ['Everything in Elite', '6 months full access', 'Best value for students', 'Campus placement prep', 'Group college license', 'Dedicated onboarding'], cta: 'Best Value', href: '/auth/signup?plan=campus' },
];

export default function Home() {
  const [wordIdx, setWordIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activePlan, setActivePlan] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily: 'Urbanist,sans-serif', background: '#09090f', minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '72px', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(9,9,15,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '0.5px solid #1e1e2e' : 'none', transition: 'all 0.35s ease' }}>
        <Logo size="sm" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Features', 'How it works', 'Pricing'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                style={{ color: '#a0a0b8', fontSize: '15px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#a0a0b8')}>
                {l}
              </a>
            ))}
          </div>
          <motion.a href="/auth/signup" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '10px 24px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', color: '#fff', background: 'linear-gradient(135deg,#ff4500,#fb923c)', display: 'inline-block' }}>
            Get Started Free
          </motion.a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '130px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,69,0,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <OrbitBadge />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          style={{ fontSize: 'clamp(44px,7vw,84px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '6px' }}>
          Build Your
        </motion.h1>

        <div style={{ fontSize: 'clamp(44px,7vw,84px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '6px', height: 'clamp(54px,8.5vw,100px)', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.span key={wordIdx} initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -70, opacity: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ display: 'block', background: 'linear-gradient(90deg,#ff4500,#fb923c,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {words[wordIdx]}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          style={{ fontSize: 'clamp(44px,7vw,84px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '30px' }}>
          With AI
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.4 }}
          style={{ fontSize: 'clamp(16px,2vw,20px)', color: '#a0a0b8', maxWidth: '580px', lineHeight: 1.75, marginBottom: '48px' }}>
          Create ATS-ready PDF resumes and 100-second video resumes powered by AI.
          Get career guidance and ace mock interviews. Built for India.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.a href="/auth/signup" whileHover={{ scale: 1.04, boxShadow: '0 10px 50px rgba(255,69,0,0.5)' }} whileTap={{ scale: 0.97 }}
            style={{ padding: '16px 40px', borderRadius: '12px', fontSize: '17px', fontWeight: 700, textDecoration: 'none', color: '#fff', background: 'linear-gradient(135deg,#ff4500,#fb923c)', boxShadow: '0 0 30px rgba(255,69,0,0.3)', display: 'inline-block' }}>
            Start Building Free
          </motion.a>
          <motion.a href="#how-it-works" whileHover={{ borderColor: '#fb923c', color: '#fff' }}
            style={{ padding: '16px 40px', borderRadius: '12px', fontSize: '17px', fontWeight: 600, textDecoration: 'none', color: '#a0a0b8', border: '0.5px solid #2a2a3a', display: 'inline-block', transition: 'all 0.2s' }}>
            See How It Works
          </motion.a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}
          style={{ display: 'flex', gap: '48px', marginTop: '64px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['10M+', 'Graduates in India'], ['3x', 'Higher callback rate'], ['100s', 'Video resume'], ['Free', 'To get started']].map(([n, l]) => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, background: 'linear-gradient(90deg,#fb923c,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{n}</div>
              <div style={{ fontSize: '13px', color: '#444460', marginTop: '5px', fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '100px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '11px', color: '#fb923c', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>How It Works</p>
            <h2 style={{ fontSize: 'clamp(30px,4vw,52px)', fontWeight: 800, marginBottom: '16px', lineHeight: 1.15 }}>
              From zero to hired<br />
              <span style={{ background: 'linear-gradient(90deg,#ff4500,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>in 10 minutes</span>
            </h2>
            <p style={{ color: '#a0a0b8', fontSize: '17px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.75 }}>
              No design skills needed. No confusing tools. Tell us about yourself and we handle everything.
            </p>
          </div>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px' }}>
          {[
            { step: '01', title: 'Tell us about yourself', desc: 'Fill in your details, experience, skills and target role. Takes under 2 minutes. XLResume AI understands everything.', color: '#ff4500' },
            { step: '02', title: 'XLResume AI builds it', desc: 'XLResume AI generates a professional ATS-ready PDF resume and a personalised 100-second video script instantly.', color: '#fb923c' },
            { step: '03', title: 'Record your video resume', desc: 'Hit record. Teleprompter guides you. Background replaces automatically. Your info badge appears. Done in seconds.', color: '#facc15' },
          ].map(({ step, title, desc, color }, i) => (
            <FadeUp key={step} delay={i * 0.15}>
              <motion.div whileHover={{ y: -6, borderColor: color }} transition={{ duration: 0.25 }}
                style={{ background: '#0d0d18', border: '0.5px solid #1e1e2e', borderRadius: '18px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '56px', fontWeight: 900, color, opacity: 0.08, position: 'absolute', top: '12px', right: '18px', lineHeight: 1 }}>{step}</div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}15`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color }}>{step}</span>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '12px' }}>{title}</h3>
                <p style={{ color: '#a0a0b8', fontSize: '15px', lineHeight: 1.75 }}>{desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '100px 24px', background: '#0a0a14' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <p style={{ fontSize: '11px', color: '#fb923c', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Features</p>
              <h2 style={{ fontSize: 'clamp(30px,4vw,52px)', fontWeight: 800, lineHeight: 1.15 }}>
                Everything you need to<br />
                <span style={{ background: 'linear-gradient(90deg,#ff4500,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>get hired faster</span>
              </h2>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '16px' }}>
            {[
              { icon: '📄', title: 'AI PDF Resume', desc: 'ATS-optimised resume generated by XLResume AI in seconds. Tailored to your exact target role and company.', tag: 'Most popular', tagColor: '#fb923c' },
              { icon: '🎥', title: '100s Video Resume', desc: 'Record with teleprompter, AI background replacement and your personal info badge overlay. Share on LinkedIn instantly.', tag: 'Unique to XLResume', tagColor: '#ff4500' },
              { icon: '📊', title: 'Resume Score + Fixes', desc: 'Get a detailed score out of 100. XLResume AI tells you exactly what to fix, what keywords to add and what to remove.', tag: 'First in India', tagColor: '#facc15' },
              { icon: '🔍', title: 'Job Match Analysis', desc: 'Paste any job description and see your match percentage instantly. AI shows missing skills and how to close the gap.', tag: 'First in India', tagColor: '#facc15' },
              { icon: '🧭', title: 'Career Guidance', desc: 'Personalised career roadmap, skill gap analysis and learning recommendations powered by XLResume AI.', tag: '', tagColor: '' },
              { icon: '🎤', title: 'Mock Interviews', desc: 'Practice HR and technical rounds with real-time AI feedback, confidence scoring and improvement tips.', tag: '', tagColor: '' },
              { icon: '📝', title: 'Mock Tests', desc: 'Aptitude, verbal, reasoning and domain-specific tests with detailed performance analytics and weak area tracking.', tag: '', tagColor: '' },
              { icon: '✉️', title: 'Cover Letter AI', desc: 'Generate compelling personalised cover letters matched to any job posting in under 10 seconds. Ready to send.', tag: '', tagColor: '' },
            ].map(({ icon, title, desc, tag, tagColor }, i) => (
              <FadeUp key={title} delay={i * 0.06}>
                <motion.div whileHover={{ y: -4, borderColor: '#fb923c', background: '#141428' }} transition={{ duration: 0.22 }}
                  style={{ background: '#111120', border: '0.5px solid #1e1e2e', borderRadius: '16px', padding: '28px', height: '100%' }}>
                  <div style={{ fontSize: '28px', marginBottom: '16px' }}>{icon}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{title}</h3>
                    {tag && <span style={{ fontSize: '10px', background: `${tagColor}18`, color: tagColor, border: `0.5px solid ${tagColor}40`, padding: '2px 9px', borderRadius: '100px', fontWeight: 700, whiteSpace: 'nowrap' }}>{tag}</span>}
                  </div>
                  <p style={{ color: '#a0a0b8', fontSize: '14px', lineHeight: 1.75 }}>{desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <p style={{ fontSize: '11px', color: '#fb923c', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Pricing</p>
              <h2 style={{ fontSize: 'clamp(30px,4vw,52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px' }}>
                India's most affordable<br />
                <span style={{ background: 'linear-gradient(90deg,#ff4500,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>career platform</span>
              </h2>
              <p style={{ color: '#a0a0b8', fontSize: '17px' }}>Start free. Upgrade when ready. No hidden charges. Cancel anytime.</p>
            </div>
          </FadeUp>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
            {pricingPlans.map((p, i) => (
              <button key={p.name} onClick={() => setActivePlan(i)}
                style={{ padding: '9px 20px', borderRadius: '100px', border: `0.5px solid ${activePlan === i ? p.color : '#2a2a3a'}`, background: activePlan === i ? `${p.color}18` : 'transparent', color: activePlan === i ? p.color : '#555570', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Urbanist,sans-serif' }}>
                {p.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '14px', alignItems: 'start' }}>
            {pricingPlans.map(({ name, price, period, popular, color, features, cta, href }, i) => (
              <FadeUp key={name} delay={i * 0.07}>
                <motion.div whileHover={{ y: -5 }} onClick={() => setActivePlan(i)}
                  style={{ background: popular ? '#111120' : '#0d0d18', border: `${activePlan === i ? '1.5px' : '0.5px'} solid ${activePlan === i ? color : '#1e1e2e'}`, borderRadius: '18px', padding: '26px', position: 'relative', cursor: 'pointer', boxShadow: activePlan === i ? `0 0 32px ${color}22` : 'none', transition: 'all 0.25s' }}>
                  {popular && (
                    <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#ff4500,#fb923c)', borderRadius: '100px', padding: '4px 16px', fontSize: '11px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>Most Popular</div>
                  )}
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: activePlan === i ? color : '#fff' }}>{name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '30px', fontWeight: 800, background: `linear-gradient(90deg,${color},#facc15)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{price}</span>
                    <span style={{ color: '#444460', fontSize: '12px' }}>{period}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {features.map(f => (
                      <div key={f} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ color, fontSize: '13px', marginTop: '1px', flexShrink: 0 }}>✓</span>
                        <span style={{ color: '#a0a0b8', fontSize: '13px', lineHeight: 1.6 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <a href={href}
                    style={{ display: 'block', width: '100%', padding: '11px', borderRadius: '10px', textAlign: 'center', fontSize: '14px', fontWeight: 700, textDecoration: 'none', background: popular || activePlan === i ? `linear-gradient(135deg,${color},#fb923c)` : 'transparent', color: popular || activePlan === i ? '#fff' : color, border: popular || activePlan === i ? 'none' : `0.5px solid ${color}`, transition: 'opacity 0.2s', boxSizing: 'border-box' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                    {cta}
                  </a>
                </motion.div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.3}>
            <p style={{ textAlign: 'center', color: '#444460', fontSize: '14px', marginTop: '32px' }}>
              Competitors charge ₹899 to ₹1,549 per month for less. XLResume starts at ₹101.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '80px 24px' }}>
        <FadeUp>
          <motion.div whileHover={{ boxShadow: '0 0 80px rgba(255,69,0,0.12)' }}
            style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg,rgba(255,69,0,0.08),rgba(250,204,21,0.04))', border: '0.5px solid rgba(251,146,60,0.2)', borderRadius: '28px', padding: '72px 40px' }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, marginBottom: '18px' }}>Ready to get hired?</h2>
            <p style={{ color: '#a0a0b8', fontSize: '18px', marginBottom: '40px', lineHeight: 1.75 }}>
              Join thousands of Indian graduates building careers with XLResume.
              Free to start. No credit card needed.
            </p>
            <motion.a href="/auth/signup" whileHover={{ scale: 1.04, boxShadow: '0 10px 60px rgba(255,69,0,0.5)' }} whileTap={{ scale: 0.97 }}
              style={{ display: 'inline-block', padding: '18px 52px', borderRadius: '14px', fontSize: '18px', fontWeight: 700, textDecoration: 'none', color: '#fff', background: 'linear-gradient(135deg,#ff4500,#fb923c)', boxShadow: '0 0 40px rgba(255,69,0,0.25)' }}>
              Start Building Free
            </motion.a>
          </motion.div>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid #1e1e2e', padding: '56px 40px 36px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '48px', marginBottom: '56px' }}>
            <div>
              <Logo size="sm" />
              <p style={{ color: '#444460', fontSize: '14px', marginTop: '18px', lineHeight: 1.75, maxWidth: '240px' }}>
                India's best AI-powered video and PDF resume platform.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Resume Builder', 'Video Resume', 'Resume Score', 'Career Guidance', 'Mock Interviews', 'Mock Tests'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Refund Policy'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '18px' }}>{title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {links.map(link => (
                    <a key={link} href="#"
                      style={{ color: '#444460', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fb923c')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#444460')}>
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '0.5px solid #1e1e2e', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ color: '#333350', fontSize: '14px' }}>2026 XLResume. Built for India. All rights reserved.</p>
            <p style={{ color: '#333350', fontSize: '14px' }}>Be Seen. Be Heard. Be Hired.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}