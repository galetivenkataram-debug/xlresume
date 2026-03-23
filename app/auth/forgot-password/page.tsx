'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#09090f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Urbanist,sans-serif', padding: '24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <svg width="40" height="40" viewBox="0 0 52 52">
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
            <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 800, fontSize: '22px', background: 'linear-gradient(90deg,#ff4500,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>XL</span>
            <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 300, fontSize: '22px', color: '#fff' }}>Resume</span>
          </a>

          {!sent ? (
            <>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '28px' }}>
                🔑
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Forgot your password?</h1>
              <p style={{ color: '#a0a0b8', fontSize: '15px', lineHeight: 1.7 }}>
                No worries. Enter your email and we will send you a reset link.
              </p>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '28px' }}>
                ✉️
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Check your email</h1>
              <p style={{ color: '#a0a0b8', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
                We sent a password reset link to <strong style={{ color: '#fb923c' }}>{email}</strong>
              </p>
              <a href="/auth/login" style={{ display: 'inline-block', padding: '12px 32px', borderRadius: '10px', background: 'linear-gradient(135deg,#ff4500,#fb923c)', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}>
                Back to Login
              </a>
            </motion.div>
          )}
        </div>

        {!sent && (
          <div style={{ background: '#0d0d18', border: '0.5px solid #1e1e2e', borderRadius: '20px', padding: '32px' }}>
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a0a0b8', marginBottom: '8px' }}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  placeholder="you@example.com" required
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#09090f', border: `1px solid ${focused ? '#fb923c' : '#1e1e2e'}`, color: '#fff', fontSize: '15px', fontFamily: 'Urbanist,sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} />
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '13px' }}>
                  {error}
                </motion.div>
              )}

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: loading ? '#2a2a3a' : 'linear-gradient(135deg,#ff4500,#fb923c)', border: 'none', color: '#fff', fontSize: '16px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Urbanist,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#fff' }} />
                    Sending...
                  </>
                ) : 'Send Reset Link'}
              </motion.button>

              <a href="/auth/login" style={{ textAlign: 'center', color: '#555570', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fb923c')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555570')}>
                Back to login
              </a>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}