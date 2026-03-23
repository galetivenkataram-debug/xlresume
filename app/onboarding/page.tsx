'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const steps = [
  {
    id: 'persona',
    title: 'Welcome to XLResume!',
    subtitle: 'Tell us about yourself so we can personalise your experience.',
    question: 'Which best describes you?',
  },
  {
    id: 'goal',
    title: 'What do you need most?',
    subtitle: 'We will prioritise this for you right away.',
    question: 'Your main goal right now?',
  },
  {
    id: 'role',
    title: 'What role are you targeting?',
    subtitle: 'This helps XLResume AI build the perfect resume for you.',
    question: 'Select your target field',
  },
  {
    id: 'challenge',
    title: 'What is your biggest challenge?',
    subtitle: 'We will focus on solving this for you first.',
    question: 'Your biggest challenge right now?',
  },
];

const personas = [
  { id: 'fresh_graduate', icon: '🎓', title: 'Fresh Graduate', desc: '0 to 1 year experience' },
  { id: 'job_switcher', icon: '💼', title: 'Job Switcher', desc: '2 to 10 years experience' },
  { id: 'senior_pro', icon: '🚀', title: 'Senior Professional', desc: '10 plus years experience' },
  { id: 'student', icon: '📚', title: 'Still Studying', desc: 'Final year or internship' },
];

const goals = [
  { id: 'resume', icon: '📄', title: 'Build a great resume', desc: 'ATS-ready PDF resume' },
  { id: 'video', icon: '🎥', title: 'Record video resume', desc: '100-second video resume' },
  { id: 'interview', icon: '🎤', title: 'Prepare for interviews', desc: 'Mock interviews and tests' },
  { id: 'direction', icon: '🧭', title: 'Find career direction', desc: 'Guidance and roadmap' },
  { id: 'english', icon: '🗣️', title: 'Improve my English', desc: 'Communication coaching' },
  { id: 'job_match', icon: '🔍', title: 'Find matching jobs', desc: 'Job match analysis' },
];

const roles = [
  { id: 'software', icon: '💻', title: 'Software and Tech', desc: 'Engineering, Data, AI' },
  { id: 'marketing', icon: '📢', title: 'Marketing and Sales', desc: 'Digital, Growth, Brand' },
  { id: 'finance', icon: '💰', title: 'Finance and Banking', desc: 'CA, MBA, Analyst' },
  { id: 'design', icon: '🎨', title: 'Design and Creative', desc: 'UI, UX, Graphic' },
  { id: 'management', icon: '📊', title: 'Management and MBA', desc: 'Operations, Strategy' },
  { id: 'government', icon: '🏛️', title: 'Government and PSU', desc: 'UPSC, Bank, Railways' },
  { id: 'healthcare', icon: '🏥', title: 'Healthcare', desc: 'Doctor, Nurse, Pharma' },
  { id: 'other', icon: '✨', title: 'Other field', desc: 'Tell us your field' },
];

const challenges = [
  { id: 'no_callbacks', icon: '📵', title: 'Not getting callbacks', desc: 'Resume not getting noticed' },
  { id: 'weak_resume', icon: '📝', title: 'Weak resume', desc: 'Do not know how to write it' },
  { id: 'no_interview_prep', icon: '😰', title: 'Interview fear', desc: 'Not prepared for interviews' },
  { id: 'career_confusion', icon: '🤔', title: 'Career confusion', desc: 'Not sure what path to take' },
  { id: 'english', icon: '🗣️', title: 'English communication', desc: 'Need to improve spoken English' },
  { id: 'job_change', icon: '🔄', title: 'Switching careers', desc: 'Changing industry or role' },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [userName, setUserName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth/login';
        return;
      }
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'there';
      setUserName(name.split(' ')[0]);
    };
    getUser();
  }, []);

  const handleSelect = async (stepId: string, value: string) => {
    const newAnswers = { ...answers, [stepId]: value };
    setAnswers(newAnswers);

    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setSaving(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name,
            persona: newAnswers.persona,
            goal: newAnswers.goal,
            target_role: newAnswers.role,
            challenge: newAnswers.challenge,
            onboarding_completed: true,
            created_at: new Date().toISOString(),
          });
        }
        window.location.href = '/dashboard';
      } catch (err) {
        window.location.href = '/dashboard';
      }
    }
  };

  const getOptions = () => {
    switch (steps[currentStep].id) {
      case 'persona': return personas;
      case 'goal': return goals;
      case 'role': return roles;
      case 'challenge': return challenges;
      default: return [];
    }
  };

  const progress = ((currentStep) / steps.length) * 100;

  if (saving) {
    return (
      <div style={{ minHeight: '100vh', background: '#09090f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Urbanist,sans-serif' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#ff4500', borderRightColor: '#fb923c', margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Setting up your experience</h2>
          <p style={{ color: '#a0a0b8', fontSize: '15px' }}>XLResume AI is personalising everything for you</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090f', fontFamily: 'Urbanist,sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="36" height="36" viewBox="0 0 52 52">
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
          <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 800, fontSize: '20px', background: 'linear-gradient(90deg,#ff4500,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>XL</span>
          <span style={{ fontFamily: 'Urbanist,sans-serif', fontWeight: 300, fontSize: '20px', color: '#fff' }}>Resume</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#555570' }}>Step {currentStep + 1} of {steps.length}</span>
          {currentStep > 0 && (
            <button onClick={() => setCurrentStep(currentStep - 1)}
              style={{ background: 'none', border: '0.5px solid #2a2a3a', borderRadius: '8px', color: '#a0a0b8', fontSize: '13px', padding: '6px 14px', cursor: 'pointer', fontFamily: 'Urbanist,sans-serif' }}>
              Back
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '2px', background: '#1e1e2e', margin: '0 32px' }}>
        <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
          style={{ height: '100%', background: 'linear-gradient(90deg,#ff4500,#fb923c)', borderRadius: '1px' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '680px' }}>

          <AnimatePresence mode="wait">
            <motion.div key={currentStep}
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}>

              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                {currentStep === 0 && userName && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '16px', color: '#fb923c', fontWeight: 600, marginBottom: '8px' }}>
                    Hey {userName}!
                  </motion.p>
                )}
                <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#fff', marginBottom: '10px', lineHeight: 1.2 }}>
                  {steps[currentStep].title}
                </h1>
                <p style={{ fontSize: '16px', color: '#a0a0b8', lineHeight: 1.6 }}>
                  {steps[currentStep].subtitle}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '12px' }}>
                {getOptions().map((option, i) => (
                  <motion.button key={option.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ scale: 1.03, borderColor: '#fb923c' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelect(steps[currentStep].id, option.id)}
                    style={{
                      background: answers[steps[currentStep].id] === option.id ? 'rgba(255,69,0,0.12)' : '#0d0d18',
                      border: `1px solid ${answers[steps[currentStep].id] === option.id ? '#fb923c' : '#1e1e2e'}`,
                      borderRadius: '14px', padding: '20px 16px', cursor: 'pointer',
                      textAlign: 'left', transition: 'all 0.2s', fontFamily: 'Urbanist,sans-serif',
                      display: 'flex', alignItems: 'flex-start', gap: '12px'
                    }}>
                    <span style={{ fontSize: '28px', flexShrink: 0 }}>{option.icon}</span>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>{option.title}</p>
                      <p style={{ fontSize: '12px', color: '#a0a0b8', lineHeight: 1.5 }}>{option.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '20px 32px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {steps.map((_, i) => (
          <div key={i} style={{ width: i === currentStep ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === currentStep ? '#fb923c' : i < currentStep ? '#ff4500' : '#1e1e2e', transition: 'all 0.3s' }} />
        ))}
      </div>

    </div>
  );
}