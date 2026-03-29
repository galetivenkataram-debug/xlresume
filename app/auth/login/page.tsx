'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
    <svg width="48" height="48" viewBox="0 0 52 52">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff4500" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
      </defs>
      <circle cx="26" cy="26" r="23" fill="none" stroke="url(#lg)" strokeWidth="2.2" />
      <circle cx="26" cy="14" r="5" fill="none" stroke="url(#lg)" strokeWidth="2.2" />
      <path d="M15,24 L26,38 M37,24 L26,38" stroke="url(#lg)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M19,48 L19,38 L34,38" stroke="url(#lg)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '1.5px', height: '24px', background: '#3a1a08', marginRight: '10px' }} />
        <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 800, fontSize: '24px', background: 'linear-gradient(90deg,#ff4500,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>XL</span>
        <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 300, fontSize: '24px', color: '#fff', marginLeft: '5px' }}>Resume</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '12px' }}>
        {['Be Seen', 'Be Heard', 'Be Hired'].map((t, i) => (
          <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 600, fontSize: '8px', color: '#fb923c', letterSpacing: '1.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{t}</span>
            {i < 2 && <span style={{ color: '#fb923c', fontSize: '8px', opacity: 0.4 }}>|</span>}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

 const [signupSuccess, setSignupSuccess] = useState(false);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  setSignupSuccess(params.get('signup') === 'success');
}, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
        try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('onboarding_completed').eq('id', user?.id).single();
      if (profile?.onboarding_completed) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/onboarding';
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      redirectTo: `${window.location.origin}/auth/callback`
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#09090f', display: 'flex', fontFamily: 'Urbanist,sans-serif' }}>

      {/* Left Panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg,#0d0d18 0%,#120a04 100%)', borderRight: '0.5px solid #1e1e2e', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', left: '20%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,69,0,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <Logo />

        <div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ fontSize: 'clamp(28px,3vw,42px)', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px', color: '#fff' }}>
            Welcome back.<br />
            <span style={{ background: 'linear-gradient(90deg,#ff4500,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Keep rising.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ color: '#a0a0b8', fontSize: '16px', lineHeight: 1.75, maxWidth: '380px', marginBottom: '40px' }}>
            Your resume, your video, your career roadmap — all waiting for you inside.
          </motion.p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '📄', text: 'Your AI resumes are saved and ready' },
              { icon: '🎥', text: 'Your video resumes are waiting' },
              { icon: '📊', text: 'Your resume score and improvements' },
              { icon: '🧭', text: 'Your career roadmap continues' },
            ].map(({ icon, text }, i) => (
              <motion.div key={text} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid #1e1e2e', borderRadius: '10px' }}>
                <span style={{ fontSize: '18px' }}>{icon}</span>
                <span style={{ fontSize: '14px', color: '#a0a0b8' }}>{text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <p style={{ color: '#333350', fontSize: '13px' }}>2026 XLResume. Built for India.</p>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '400px' }}>

          <div style={{ marginBottom: '36px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Sign in</h1>
            <p style={{ color: '#a0a0b8', fontSize: '15px' }}>
              New to XLResume?{' '}
              <a href="/auth/signup" style={{ color: '#fb923c', textDecoration: 'none', fontWeight: 600 }}>Create free account</a>
            </p>
          </div>

          {/* Google */}
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleGoogle}
            style={{ width: '100%', padding: '13px', borderRadius: '12px', background: '#111120', border: '0.5px solid #2a2a3a', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px', fontFamily: 'Urbanist,sans-serif', transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#fb923c')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a3a')}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </motion.button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '0.5px', background: '#1e1e2e' }} />
            <span style={{ color: '#444460', fontSize: '13px' }}>or continue with email</span>
            <div style={{ flex: 1, height: '0.5px', background: '#1e1e2e' }} />
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Success message after signup */}
            {signupSuccess && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: '13px' }}>
                Account created successfully! Sign in below.
              </motion.div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a0a0b8', marginBottom: '8px' }}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')}
                placeholder="you@example.com" required
                style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#0d0d18', border: `1px solid ${focusedField === 'email' ? '#fb923c' : '#1e1e2e'}`, color: '#fff', fontSize: '15px', fontFamily: 'Urbanist,sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#a0a0b8' }}>Password</label>
                <a href="/auth/forgot-password" style={{ fontSize: '13px', color: '#fb923c', textDecoration: 'none', fontWeight: 600 }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('')}
                  placeholder="Your password" required
                  style={{ width: '100%', padding: '13px 48px 13px 16px', borderRadius: '10px', background: '#0d0d18', border: `1px solid ${focusedField === 'password' ? '#fb923c' : '#1e1e2e'}`, color: '#fff', fontSize: '15px', fontFamily: 'Urbanist,sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555570', cursor: 'pointer', fontSize: '13px', fontFamily: 'Urbanist,sans-serif' }}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '13px' }}>
                {error}
              </motion.div>
            )}

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', background: loading ? '#2a2a3a' : 'linear-gradient(135deg,#ff4500,#fb923c)', border: 'none', color: '#fff', fontSize: '16px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Urbanist,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.3s' }}>
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#fff' }} />
                  Signing in...
                </>
              ) : 'Sign In'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}