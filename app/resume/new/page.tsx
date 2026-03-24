'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSkillSuggestions, getTopJobMatches, ALL_SKILLS } from '../../../lib/skills';

type StepId = 'intent' | 'qualification' | 'field' | 'experience' | 'job_or_skills' | 'job_details' | 'skills_assessment' | 'job_matches' | 'upload';

interface CompletedStep {
  id: StepId;
  question: string;
  answer: string;
  icon: string;
}

const STEP_ORDER: StepId[] = ['intent', 'qualification', 'field', 'experience', 'job_or_skills', 'job_details', 'skills_assessment', 'job_matches', 'upload'];

const intents = [
  { id: 'scratch', icon: '✨', title: 'Build from scratch', desc: 'Create a brand new resume with AI' },
  { id: 'improve', icon: '⚡', title: 'Improve existing resume', desc: 'Make my current resume stronger' },
  { id: 'tailor', icon: '🎯', title: 'Tailor for a specific job', desc: 'Customise resume for a role I want' },
  { id: 'fresher', icon: '🎓', title: 'My first resume ever', desc: 'I need help building from zero' },
];

const qualifications = [
  { id: '10th_12th', icon: '📚', title: '10th or 12th', desc: 'Secondary education' },
  { id: 'diploma', icon: '📜', title: 'Diploma', desc: 'Polytechnic or vocational' },
  { id: 'bachelors', icon: '🎓', title: "Bachelor's Degree", desc: 'BE, BTech, BA, BCom, BSc' },
  { id: 'masters', icon: '🏅', title: "Master's Degree", desc: 'ME, MTech, MBA, MA, MSc' },
  { id: 'phd', icon: '🔬', title: 'PhD or Doctorate', desc: 'Research degree' },
  { id: 'professional', icon: '💼', title: 'Professional Certificate', desc: 'CA, CFA, CS, ICWA' },
];

const fields = [
  { id: 'engineering', icon: '⚙️', title: 'Engineering and Tech', desc: 'CS, IT, ECE, Mechanical, Civil' },
  { id: 'business', icon: '📊', title: 'Business and Management', desc: 'MBA, BBA, Operations' },
  { id: 'commerce_finance', icon: '💰', title: 'Commerce and Finance', desc: 'CA, BCom, Banking' },
  { id: 'science', icon: '🔬', title: 'Science', desc: 'Physics, Chemistry, Biology' },
  { id: 'medicine', icon: '🏥', title: 'Medicine and Healthcare', desc: 'MBBS, BPharm, Nursing' },
  { id: 'arts', icon: '🎨', title: 'Arts, Design and Media', desc: 'Fine Arts, Journalism, Design' },
  { id: 'law', icon: '⚖️', title: 'Law', desc: 'LLB, LLM, Legal studies' },
  { id: 'other', icon: '✨', title: 'Other field', desc: 'Tell us your area' },
];

const experienceLevels = [
  { id: 'fresher', icon: '🎓', title: 'Fresher', desc: '0 to 1 year' },
  { id: 'junior', icon: '🌱', title: 'Junior', desc: '1 to 3 years' },
  { id: 'mid', icon: '💼', title: 'Mid Level', desc: '3 to 7 years' },
  { id: 'senior', icon: '🚀', title: 'Senior', desc: '7 to 15 years' },
  { id: 'lead', icon: '👑', title: 'Lead or Manager', desc: '15 plus years' },
];

// Quit confirmation modal
function QuitModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#0d0d18', border: '0.5px solid #2a2a3a', borderRadius: '20px', padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' }}>
          🚪
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '10px', fontFamily: 'Urbanist,sans-serif' }}>
          Quit creating resume?
        </h2>
        <p style={{ fontSize: '14px', color: '#a0a0b8', lineHeight: 1.6, marginBottom: '28px', fontFamily: 'Urbanist,sans-serif' }}>
          Your progress will be lost. You will have to start over next time.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancel}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'transparent', border: '0.5px solid #2a2a3a', color: '#a0a0b8', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Urbanist,sans-serif', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fb923c'; e.currentTarget.style.color = '#fb923c'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.color = '#a0a0b8'; }}>
            No, continue
          </button>
          <button onClick={onConfirm}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(239,68,68,0.12)', border: '0.5px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Urbanist,sans-serif', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}>
            Yes, quit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Completed step card - now clickable
function CompletedStepCard({ step, index, onClick }: { step: CompletedStep; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '12px 16px',
        background: hovered ? 'rgba(255,69,0,0.06)' : 'rgba(255,255,255,0.03)',
        border: `0.5px solid ${hovered ? 'rgba(255,69,0,0.3)' : '#1e1e2e'}`,
        borderRadius: '12px',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
      }}>
      <p style={{ fontSize: '11px', color: '#444460', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
        {step.question}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{step.icon}</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: hovered ? '#ff4500' : '#fb923c' }}>{step.answer}</span>
        </div>
        {hovered && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontSize: '11px', color: '#fb923c', fontWeight: 600, fontFamily: 'Urbanist,sans-serif' }}>
            Edit
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

function QuestionPanel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'clamp(20px,3vw,30px)', fontWeight: 800, color: '#fff', marginBottom: '8px', lineHeight: 1.2, fontFamily: 'Urbanist,sans-serif' }}>
          {title}
        </h1>
        <p style={{ fontSize: '15px', color: '#a0a0b8', lineHeight: 1.6, fontFamily: 'Urbanist,sans-serif' }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function OptionCard({ item, onClick, index }: { item: { icon: string; title: string; desc: string }; onClick: () => void; index: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ scale: 1.02, borderColor: '#fb923c' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{ background: '#0d0d18', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '20px 16px', cursor: 'pointer', textAlign: 'left', fontFamily: 'Urbanist,sans-serif', display: 'flex', alignItems: 'flex-start', gap: '14px', transition: 'all 0.2s', width: '100%' }}>
      <span style={{ fontSize: '28px', flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '4px', lineHeight: 1.3 }}>{item.title}</p>
        <p style={{ fontSize: '12px', color: '#a0a0b8', lineHeight: 1.5 }}>{item.desc}</p>
      </div>
    </motion.button>
  );
}

export default function NewResumePage() {
  const [currentStep, setCurrentStep] = useState<StepId>('intent');
  const [completedSteps, setCompletedSteps] = useState<CompletedStep[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<{ name: string; category: string }[]>([]);
  const [jobMatches, setJobMatches] = useState<any[]>([]);
  const [analyzingSkills, setAnalyzingSkills] = useState(false);
  const [selectedJobMatch, setSelectedJobMatch] = useState<any>(null);
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [customRole, setCustomRole] = useState('');
  const [hasResume, setHasResume] = useState<boolean | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);

  // Skill suggestions
  useEffect(() => {
    if (skillInput.length > 0) {
      const results = getSkillSuggestions(skillInput, 8).filter(s => !selectedSkills.includes(s.name));
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [skillInput, selectedSkills]);

  // Browser back button
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      if (currentStep === 'intent') {
        setShowQuitModal(true);
        window.history.pushState(null, '', window.location.href);
      } else {
        handleBack();
        window.history.pushState(null, '', window.location.href);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentStep, completedSteps]);

  // Navigate back to a specific step - clears everything after it
  const goToStep = (stepId: StepId) => {
    const stepIndex = STEP_ORDER.indexOf(stepId);
    setCompletedSteps(prev => prev.filter(s => STEP_ORDER.indexOf(s.id) < stepIndex));
    setCurrentStep(stepId);
  };

  // Go one step back
  const handleBack = () => {
    if (completedSteps.length === 0) {
      setShowQuitModal(true);
      return;
    }
    const prev = completedSteps[completedSteps.length - 1];
    setCompletedSteps(p => p.slice(0, -1));
    setCurrentStep(prev.id);
  };

  const completeStep = (stepId: StepId, question: string, answer: string, icon: string, nextStep: StepId) => {
    setCompletedSteps(prev => {
      const filtered = prev.filter(s => s.id !== stepId);
      return [...filtered, { id: stepId, question, answer, icon }];
    });
    setAnswers(prev => ({ ...prev, [stepId]: answer }));
    setTimeout(() => setCurrentStep(nextStep), 280);
  };

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) setSelectedSkills(prev => [...prev, skill]);
    setSkillInput('');
    setSuggestions([]);
    skillInputRef.current?.focus();
  };

  const addCustomSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills(prev => [...prev, trimmed]);
      setSkillInput('');
      setSuggestions([]);
    }
  };

  const removeSkill = (skill: string) => setSelectedSkills(prev => prev.filter(s => s !== skill));

  const handleAnalyzeSkills = () => {
    if (selectedSkills.length === 0) return;
    setAnalyzingSkills(true);
    setTimeout(() => {
      const matches = getTopJobMatches(selectedSkills, 6);
      setJobMatches(matches);
      setAnalyzingSkills(false);
      setCurrentStep('job_matches');
    }, 1400);
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setParsing(true);
    setTimeout(() => {
      setParsedData({ name: true, email: true, experience: [1], education: [1] });
      setParsing(false);
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFinish = () => {
    const params = new URLSearchParams({
      intent: answers.intent || '',
      qualification: answers.qualification || '',
      field: answers.field || '',
      experience: answers.experience || '',
      jobTitle: selectedJobMatch?.title || jobTitle || '',
      hasJD: jobDescription ? 'true' : 'false',
      skills: selectedSkills.join(','),
      hasParsed: parsedData ? 'true' : 'false',
    });
    window.location.href = `/resume/builder?${params.toString()}`;
  };

  const getScoreColor = (score: number) => score >= 70 ? '#22c55e' : score >= 40 ? '#fb923c' : '#ef4444';
  const getScoreLabel = (score: number) => score >= 70 ? 'Strong Match' : score >= 40 ? 'Good Match' : 'Partial Match';

  const renderStep = () => {
    switch (currentStep) {

      case 'intent':
        return (
          <QuestionPanel title="What brings you here today?" subtitle="This helps our AI personalise your resume experience">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {intents.map((item, i) => (
                <OptionCard key={item.id} item={item} index={i}
                  onClick={() => completeStep('intent', 'Your goal', item.title, item.icon, 'qualification')} />
              ))}
            </div>
          </QuestionPanel>
        );

      case 'qualification':
        return (
          <QuestionPanel title="What is your highest qualification?" subtitle="This helps us set the right academic tone for your resume">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {qualifications.map((item, i) => (
                <OptionCard key={item.id} item={item} index={i}
                  onClick={() => completeStep('qualification', 'Qualification', item.title, item.icon, 'field')} />
              ))}
            </div>
          </QuestionPanel>
        );

      case 'field':
        return (
          <QuestionPanel title="What is your field of study or work?" subtitle="We use this to suggest the most relevant skills and roles">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {fields.map((item, i) => (
                <OptionCard key={item.id} item={item} index={i}
                  onClick={() => completeStep('field', 'Field', item.title, item.icon, 'experience')} />
              ))}
            </div>
          </QuestionPanel>
        );

      case 'experience':
        return (
          <QuestionPanel title="How much work experience do you have?" subtitle="This shapes the format, tone and length of your resume">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {experienceLevels.map((item, i) => (
                <OptionCard key={item.id} item={item} index={i}
                  onClick={() => completeStep('experience', 'Experience', item.title, item.icon, 'job_or_skills')} />
              ))}
            </div>
          </QuestionPanel>
        );

      case 'job_or_skills':
        return (
          <QuestionPanel title="Do you have a specific job in mind?" subtitle="This shapes how we build and optimise your resume">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { id: 'yes', icon: '🎯', title: 'Yes, I have a job in mind', desc: 'Enter the role and paste the job description' },
                { id: 'no', icon: '🔍', title: 'Help me find the right role', desc: 'Add my skills and get AI powered job matches' },
              ].map((item, i) => (
                <OptionCard key={item.id} item={item} index={i}
                  onClick={() => completeStep('job_or_skills', 'Job target', item.title, item.icon,
                    item.id === 'yes' ? 'job_details' : 'skills_assessment')} />
              ))}
            </div>
          </QuestionPanel>
        );

      case 'job_details':
        return (
          <QuestionPanel title="Tell us about the job" subtitle="AI will optimise your entire resume for this specific role">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a0a0b8', marginBottom: '8px', fontFamily: 'Urbanist,sans-serif' }}>Job Title</label>
                <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer at Google"
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#111120', border: '1px solid #1e1e2e', color: '#fff', fontSize: '15px', fontFamily: 'Urbanist,sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a0a0b8', marginBottom: '8px', fontFamily: 'Urbanist,sans-serif' }}>
                  Paste Job Description
                  <span style={{ marginLeft: '8px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(251,146,60,0.12)', color: '#fb923c', fontSize: '11px', fontWeight: 600 }}>
                    Optional but powerful
                  </span>
                </label>
                <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description. Our AI will extract requirements, skills and keywords to build the perfect resume for this role..."
                  rows={6}
                  style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: '#111120', border: '1px solid #1e1e2e', color: '#fff', fontSize: '14px', fontFamily: 'Urbanist,sans-serif', outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }} />
              </div>
              <motion.button whileHover={{ scale: jobTitle ? 1.02 : 1 }} whileTap={{ scale: jobTitle ? 0.98 : 1 }}
                onClick={() => { if (!jobTitle) return; completeStep('job_details', 'Target role', jobTitle, '🎯', 'upload'); }}
                disabled={!jobTitle}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: jobTitle ? 'linear-gradient(135deg,#ff4500,#fb923c)' : '#1e1e2e', border: 'none', color: jobTitle ? '#fff' : '#333350', fontSize: '15px', fontWeight: 700, cursor: jobTitle ? 'pointer' : 'not-allowed', fontFamily: 'Urbanist,sans-serif', transition: 'all 0.2s' }}>
                Continue
              </motion.button>
            </div>
          </QuestionPanel>
        );

      case 'skills_assessment':
        return (
          <QuestionPanel title="What are your skills?" subtitle="Search from 1000 plus skills or add your own. We will find your best matching roles.">
            <div>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input ref={skillInputRef} type="text" value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addCustomSkill(); if (e.key === 'Escape') setSuggestions([]); }}
                    placeholder="Search skills e.g. Python, Marketing, Leadership..."
                    style={{ flex: 1, padding: '13px 16px', borderRadius: '10px', background: '#111120', border: '1px solid #1e1e2e', color: '#fff', fontSize: '14px', fontFamily: 'Urbanist,sans-serif', outline: 'none' }} />
                  {skillInput && (
                    <button onClick={addCustomSkill}
                      style={{ padding: '13px 18px', borderRadius: '10px', background: 'rgba(255,69,0,0.12)', border: '1px solid rgba(255,69,0,0.3)', color: '#fb923c', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Urbanist,sans-serif', whiteSpace: 'nowrap' }}>
                      Add
                    </button>
                  )}
                </div>
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: '#111120', border: '0.5px solid #2a2a3a', borderRadius: '10px', overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                      {suggestions.map((s, i) => (
                        <button key={i} onClick={() => addSkill(s.name)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: '#fff', fontSize: '14px', cursor: 'pointer', fontFamily: 'Urbanist,sans-serif', textAlign: 'left', borderBottom: i < suggestions.length - 1 ? '0.5px solid #1a1a2e' : 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                          <span>{s.name}</span>
                          <span style={{ fontSize: '11px', color: '#444460', background: '#1a1a2e', padding: '2px 8px', borderRadius: '4px' }}>{s.category}</span>
                        </button>
                      ))}
                      {skillInput && !ALL_SKILLS.find(s => s.name.toLowerCase() === skillInput.toLowerCase()) && (
                        <button onClick={addCustomSkill}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: '#fb923c', fontSize: '14px', cursor: 'pointer', fontFamily: 'Urbanist,sans-serif', borderTop: '0.5px solid #1a1a2e' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,69,0,0.06)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                          + Add "{skillInput}" as custom skill
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {selectedSkills.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '16px', background: '#111120', border: '0.5px solid #1e1e2e', borderRadius: '12px', marginBottom: '16px', minHeight: '56px' }}>
                  {selectedSkills.map(skill => (
                    <motion.span key={skill} initial={{ scale: 0 }} animate={{ scale: 1 }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(255,69,0,0.1)', border: '0.5px solid rgba(255,69,0,0.3)', color: '#fb923c', fontSize: '13px', fontWeight: 600, fontFamily: 'Urbanist,sans-serif' }}>
                      {skill}
                      <button onClick={() => removeSkill(skill)}
                        style={{ background: 'none', border: 'none', color: '#fb923c', cursor: 'pointer', fontSize: '14px', padding: '0', lineHeight: 1, opacity: 0.6 }}>
                        x
                      </button>
                    </motion.span>
                  ))}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: selectedSkills.length > 0 ? 1.02 : 1 }}
                whileTap={{ scale: selectedSkills.length > 0 ? 0.98 : 1 }}
                onClick={handleAnalyzeSkills}
                disabled={selectedSkills.length === 0 || analyzingSkills}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: selectedSkills.length > 0 ? 'linear-gradient(135deg,#ff4500,#fb923c)' : '#1e1e2e', border: 'none', color: selectedSkills.length > 0 ? '#fff' : '#333350', fontSize: '15px', fontWeight: 700, cursor: selectedSkills.length > 0 ? 'pointer' : 'not-allowed', fontFamily: 'Urbanist,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }}>
                {analyzingSkills ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#fff' }} />
                    Analysing your skills...
                  </>
                ) : selectedSkills.length === 0 ? 'Add skills to continue' : `Find my best job matches (${selectedSkills.length} skills)`}
              </motion.button>
            </div>
          </QuestionPanel>
        );

      case 'job_matches':
        return (
          <QuestionPanel title="Your best job matches" subtitle={`Based on ${selectedSkills.length} skills. Pick a role to continue.`}>
            <div>
              <p style={{ fontSize: '11px', color: '#444460', marginBottom: '16px', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '0.5px solid #1e1e2e', fontFamily: 'Urbanist,sans-serif' }}>
                Score is calculated by comparing your skills against typical requirements for each role.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {jobMatches.map((job, i) => (
                  <motion.button key={job.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    whileHover={{ scale: 1.01, borderColor: '#fb923c' }} whileTap={{ scale: 0.99 }}
                    onClick={() => { setSelectedJobMatch(job); completeStep('job_matches', 'Target role', job.title, job.icon, 'upload'); }}
                    style={{ background: '#111120', border: `1px solid ${selectedJobMatch?.id === job.id ? '#fb923c' : '#1e1e2e'}`, borderRadius: '12px', padding: '14px 16px', cursor: 'pointer', textAlign: 'left', fontFamily: 'Urbanist,sans-serif', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{job.icon}</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{job.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: getScoreColor(job.score), padding: '2px 8px', borderRadius: '20px', background: `${getScoreColor(job.score)}15` }}>
                          {getScoreLabel(job.score)}
                        </span>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: getScoreColor(job.score) }}>{job.score}%</span>
                      </div>
                    </div>
                    <div style={{ height: '3px', background: '#1e1e2e', borderRadius: '2px' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${job.score}%` }} transition={{ delay: i * 0.07 + 0.3, duration: 0.5 }}
                        style={{ height: '100%', background: getScoreColor(job.score), borderRadius: '2px' }} />
                    </div>
                    {job.missingSkills.length > 0 && (
                      <p style={{ fontSize: '11px', color: '#444460', marginTop: '6px' }}>
                        Missing: {job.missingSkills.slice(0, 3).join(', ')}{job.missingSkills.length > 3 ? ` +${job.missingSkills.length - 3} more` : ''}
                      </p>
                    )}
                  </motion.button>
                ))}
              </div>
              {!showCustomRole ? (
                <button onClick={() => setShowCustomRole(true)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'transparent', border: '1px dashed #2a2a3a', color: '#555570', fontSize: '13px', cursor: 'pointer', fontFamily: 'Urbanist,sans-serif' }}>
                  My target role is not listed here
                </button>
              ) : (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" value={customRole} onChange={e => setCustomRole(e.target.value)}
                    placeholder="Enter your target role"
                    style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', background: '#111120', border: '1px solid #1e1e2e', color: '#fff', fontSize: '14px', fontFamily: 'Urbanist,sans-serif', outline: 'none' }} />
                  <button onClick={() => { if (!customRole) return; setJobTitle(customRole); completeStep('job_matches', 'Target role', customRole, '🎯', 'upload'); }}
                    disabled={!customRole}
                    style={{ padding: '12px 18px', borderRadius: '10px', background: customRole ? 'linear-gradient(135deg,#ff4500,#fb923c)' : '#1e1e2e', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: customRole ? 'pointer' : 'not-allowed', fontFamily: 'Urbanist,sans-serif' }}>
                    Go
                  </button>
                </motion.div>
              )}
            </div>
          </QuestionPanel>
        );

      case 'upload':
        return (
          <QuestionPanel title="Do you have an existing resume?" subtitle="Upload it and AI will auto fill all your details. Saves you 10 minutes.">
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {[
                  { id: true, icon: '📤', label: 'Yes, upload my resume' },
                  { id: false, icon: '✨', label: 'No, start fresh' },
                ].map(opt => (
                  <motion.button key={String(opt.id)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setHasResume(opt.id as boolean);
                      if (!opt.id) {
                        completeStep('upload', 'Existing resume', 'Starting fresh', '✨', 'upload');
                        setTimeout(handleFinish, 500);
                      }
                    }}
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', background: hasResume === opt.id ? 'rgba(255,69,0,0.1)' : '#111120', border: `1px solid ${hasResume === opt.id ? '#fb923c' : '#1e1e2e'}`, color: hasResume === opt.id ? '#fb923c' : '#a0a0b8', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Urbanist,sans-serif', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span>{opt.icon}</span> {opt.label}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {hasResume && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {!uploadedFile ? (
                      <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        style={{ border: `2px dashed ${dragOver ? '#fb923c' : '#2a2a3a'}`, borderRadius: '16px', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'rgba(255,69,0,0.04)' : 'transparent', transition: 'all 0.2s', marginBottom: '16px' }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📄</div>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '4px', fontFamily: 'Urbanist,sans-serif' }}>Drop your resume here</p>
                        <p style={{ fontSize: '12px', color: '#555570', fontFamily: 'Urbanist,sans-serif' }}>PDF or DOC supported</p>
                        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                          onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
                      </div>
                    ) : (
                      <div style={{ background: '#111120', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '24px' }}>📄</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px', fontFamily: 'Urbanist,sans-serif' }}>{uploadedFile.name}</p>
                            <p style={{ fontSize: '11px', color: '#555570', fontFamily: 'Urbanist,sans-serif' }}>{(uploadedFile.size / 1024).toFixed(0)} KB</p>
                          </div>
                          {parsing ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#fb923c' }} />
                              <span style={{ fontSize: '12px', color: '#fb923c', fontFamily: 'Urbanist,sans-serif' }}>Parsing...</span>
                            </div>
                          ) : parsedData && <span style={{ fontSize: '20px' }}>✅</span>}
                        </div>
                      </div>
                    )}
                    {parsedData && !parsing && (
                      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { completeStep('upload', 'Existing resume', uploadedFile?.name || 'Uploaded', '📄', 'upload'); setTimeout(handleFinish, 400); }}
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg,#ff4500,#fb923c)', border: 'none', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Urbanist,sans-serif' }}>
                        Continue to Resume Builder
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </QuestionPanel>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#09090f', fontFamily: 'Urbanist,sans-serif', color: '#fff', display: 'flex', flexDirection: 'column' }}>

      {/* Quit modal */}
      <AnimatePresence>
        {showQuitModal && (
          <QuitModal
            onConfirm={() => window.location.href = '/dashboard'}
            onCancel={() => setShowQuitModal(false)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ padding: '16px 32px', borderBottom: '0.5px solid #1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#09090f', position: 'sticky', top: 0, zIndex: 20 }}>
        <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <svg width="28" height="28" viewBox="0 0 52 52">
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
          <span style={{ fontWeight: 800, fontSize: '16px', background: 'linear-gradient(90deg,#ff4500,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>XL</span>
          <span style={{ fontWeight: 300, fontSize: '16px', color: '#fff' }}>Resume</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentStep !== 'intent' && (
            <button onClick={handleBack}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '0.5px solid #2a2a3a', borderRadius: '8px', color: '#a0a0b8', fontSize: '13px', padding: '6px 14px', cursor: 'pointer', fontFamily: 'Urbanist,sans-serif', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#fb923c'; e.currentTarget.style.color = '#fb923c'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.color = '#a0a0b8'; }}>
              ← Back
            </button>
          )}
          <button onClick={() => setShowQuitModal(true)}
            style={{ fontSize: '13px', color: '#444460', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Urbanist,sans-serif', fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={e => (e.currentTarget.style.color = '#444460')}>
            Cancel
          </button>
        </div>
      </div>

      {/* Two panel layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left panel */}
        <motion.div
          animate={{ width: completedSteps.length > 0 ? '280px' : '0px', opacity: completedSteps.length > 0 ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ background: '#0a0a14', borderRight: '0.5px solid #1e1e2e', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ padding: '28px 20px' }}>
            {completedSteps.length > 0 && (
              <>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#333350', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Urbanist,sans-serif' }}>
                  Your Journey
                </p>
                {completedSteps.map((step, i) => (
                  <CompletedStepCard
                    key={step.id}
                    step={step}
                    index={i}
                    onClick={() => goToStep(step.id)}
                  />
                ))}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '0.5px solid #1e1e2e', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1.5px solid transparent', borderTopColor: '#fb923c', flexShrink: 0 }} />
                  <p style={{ fontSize: '12px', color: '#333350', fontFamily: 'Urbanist,sans-serif' }}>Building your profile...</p>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Right panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 48px', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '640px' }}>
            <AnimatePresence mode="wait">
              <motion.div key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}>
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}