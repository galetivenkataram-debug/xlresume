'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

// ─── Theme System ─────────────────────────────────────────────────────────────
// Brand: #ff4500 (fire), #fb923c (orange), #facc15 (gold)
// Dark:  deep obsidian surfaces, brand fire accents — luxury / Linear feel
// Light: warm cream + rich ink + brand accents — editorial / Notion feel

const THEMES = {
  dark: {
    bg:           '#0b0b0d',
    surface:      '#111114',
    surfaceHigh:  '#18181d',
    surfaceHover: '#1e1e25',
    border:       '#1f1f27',
    borderHigh:   '#2a2a35',
    text:         '#ededea',
    textSub:      '#888899',
    textMuted:    '#44445a',
    accent:       '#ff4500',
    accentMid:    '#fb923c',
    accentGold:   '#facc15',
    accentBg:     'rgba(255,69,0,0.1)',
    accentBorder: 'rgba(255,69,0,0.28)',
    success:      '#34d399',
    successBg:    'rgba(52,211,153,0.1)',
    successBorder:'rgba(52,211,153,0.28)',
    danger:       '#f87171',
    info:         '#818cf8',
    previewBg:    '#070709',
    topbar:       '#0e0e12',
    topbarBorder: '#1a1a22',
    sidebar:      '#0d0d10',
    sidebarBorder:'#1a1a22',
    editor:       '#0f0f13',
    cardBg:       '#15151a',
    cardBorder:   '#222230',
    inputBg:      '#0d0d11',
    inputBorder:  '#222230',
    inputFocus:   '#ff4500',
    labelColor:   '#666680',
    hintColor:    '#44445a',
    tipBg:        'rgba(255,255,255,0.025)',
    tipBorder:    '#1e1e27',
    toggleTrack:  '#222230',
    scrollbar:    '#1e1e27',
  },
  light: {
    bg:           '#f7f6f2',
    surface:      '#ffffff',
    surfaceHigh:  '#f2f0eb',
    surfaceHover: '#eceae4',
    border:       '#e2dfd6',
    borderHigh:   '#ccc9be',
    text:         '#111110',
    textSub:      '#5a5850',
    textMuted:    '#a09c90',
    accent:       '#e03d00',
    accentMid:    '#ea7422',
    accentGold:   '#c9960a',
    accentBg:     'rgba(224,61,0,0.07)',
    accentBorder: 'rgba(224,61,0,0.22)',
    success:      '#059669',
    successBg:    'rgba(5,150,105,0.07)',
    successBorder:'rgba(5,150,105,0.22)',
    danger:       '#dc2626',
    info:         '#4f46e5',
    previewBg:    '#e8e6e0',
    topbar:       '#ffffff',
    topbarBorder: '#e2dfd6',
    sidebar:      '#fafaf7',
    sidebarBorder:'#e2dfd6',
    editor:       '#fafaf7',
    cardBg:       '#ffffff',
    cardBorder:   '#e2dfd6',
    inputBg:      '#ffffff',
    inputBorder:  '#d8d5cc',
    inputFocus:   '#e03d00',
    labelColor:   '#8a8880',
    hintColor:    '#a09c90',
    tipBg:        'rgba(0,0,0,0.025)',
    tipBorder:    '#e2dfd6',
    toggleTrack:  '#d8d5cc',
    scrollbar:    '#e2dfd6',
  },
};

type Theme = typeof THEMES.dark;

// ─── Types ────────────────────────────────────────────────────────────────────
interface WorkExp { id:string; company:string; role:string; duration:string; location:string; bullets:string[]; }
interface Education { id:string; institution:string; degree:string; year:string; score:string; }
interface Project { id:string; name:string; description:string; link:string; }
interface Certification { id:string; name:string; issuer:string; year:string; }
interface Language { id:string; name:string; level:string; }
interface Internship { id:string; company:string; role:string; duration:string; description:string; }
interface Award { id:string; title:string; issuer:string; year:string; description:string; }
interface Volunteer { id:string; organization:string; role:string; duration:string; description:string; }
interface Publication { id:string; title:string; publisher:string; year:string; link:string; }

interface ResumeData {
  personalInfo: { fullName:string; title:string; email:string; phone:string; location:string; linkedin:string; website:string; photo:string; signature:boolean; };
  summary:string; experience:WorkExp[]; education:Education[]; skills:string[];
  projects:Project[]; certifications:Certification[]; languages:Language[];
  internships:Internship[]; awards:Award[]; volunteer:Volunteer[]; publications:Publication[];
  customSections:{ id:string; title:string; content:string }[];
  targetRole:string; experienceLevel:string;
}

type SectionId = 'personal'|'summary'|'experience'|'education'|'skills'|'projects'|'certifications'|'languages'|'internships'|'awards'|'volunteer'|'publications'|'custom';
type TemplateId = 'clean'|'bold'|'heritage'|'minimal'|'tech'|'executive'|'modern'|'compact'|'creative'|'indian'|'classic'|'vivid';

// ─── Templates ────────────────────────────────────────────────────────────────
const TEMPLATES = [
  { id:'clean' as TemplateId,    name:'Clean Pro',   accent:'#2563eb', bg:'#fff',     headerBg:'#eff4ff', font:'Georgia'           },
  { id:'bold' as TemplateId,     name:'Bold Edge',   accent:'#ff4500', bg:'#fff',     headerBg:'#111',    font:'"Arial Black"'     },
  { id:'heritage' as TemplateId, name:'Heritage',    accent:'#7c4a1e', bg:'#fdf6e3',  headerBg:'#3b1f0a', font:'Georgia', tag:'✦ Premium' },
  { id:'minimal' as TemplateId,  name:'Minimal',     accent:'#111827', bg:'#fff',     headerBg:'#fff',    font:'"Helvetica Neue"'  },
  { id:'tech' as TemplateId,     name:'Tech Dark',   accent:'#00d4ff', bg:'#0a0a0f',  headerBg:'#111118', font:'"Courier New"'     },
  { id:'executive' as TemplateId,name:'Executive',   accent:'#1e3a5f', bg:'#fff',     headerBg:'#1e3a5f', font:'"Times New Roman"' },
  { id:'modern' as TemplateId,   name:'Modern Grad', accent:'#7c3aed', bg:'#fff',     headerBg:'#faf5ff', font:'Georgia'           },
  { id:'compact' as TemplateId,  name:'Compact',     accent:'#059669', bg:'#fff',     headerBg:'#ecfdf5', font:'"Helvetica Neue"'  },
  { id:'creative' as TemplateId, name:'Creative',    accent:'#db2777', bg:'#fff',     headerBg:'#fdf2f8', font:'Georgia'           },
  { id:'indian' as TemplateId,   name:'India Pro',   accent:'#f59e0b', bg:'#fff',     headerBg:'#fffbeb', font:'Georgia', tag:'🇮🇳' },
  { id:'classic' as TemplateId,  name:'Classic',     accent:'#374151', bg:'#fff',     headerBg:'#fff',    font:'"Times New Roman"' },
  { id:'vivid' as TemplateId,    name:'Vivid',       accent:'#ef4444', bg:'#fff',     headerBg:'#fff7f7', font:'Georgia'           },
];

const ACCENT_PRESETS = ['#2563eb','#ff4500','#7c4a1e','#10b981','#8b5cf6','#dc2626','#0891b2','#d97706','#1e3a5f','#db2777','#059669','#7c3aed','#f59e0b','#374151','#ef4444'];
const FONT_OPTIONS = [
  { label:'Georgia',        value:'Georgia'            },
  { label:'Times New Roman',value:'"Times New Roman"'  },
  { label:'Helvetica Neue', value:'"Helvetica Neue"'   },
  { label:'Palatino',       value:'Palatino'           },
  { label:'Garamond',       value:'Garamond'           },
  { label:'Courier New',    value:'"Courier New"'      },
  { label:'Trebuchet MS',   value:'"Trebuchet MS"'     },
];

const CORE_SECTIONS = [
  { id:'personal'      as SectionId, icon:'👤', label:'Personal Info'   },
  { id:'summary'       as SectionId, icon:'✍️', label:'Summary'         },
  { id:'experience'    as SectionId, icon:'💼', label:'Experience'      },
  { id:'education'     as SectionId, icon:'🎓', label:'Education'       },
  { id:'skills'        as SectionId, icon:'⚡', label:'Skills'          },
  { id:'projects'      as SectionId, icon:'🚀', label:'Projects'        },
  { id:'certifications'as SectionId, icon:'🏆', label:'Certifications'  },
  { id:'languages'     as SectionId, icon:'🌐', label:'Languages'       },
];

const OPTIONAL_SECTIONS = [
  { id:'internships' as SectionId, icon:'📋', label:'Internships'    },
  { id:'awards'      as SectionId, icon:'🥇', label:'Awards'         },
  { id:'volunteer'   as SectionId, icon:'🤝', label:'Volunteering'   },
  { id:'publications'as SectionId, icon:'📰', label:'Publications'   },
  { id:'custom'      as SectionId, icon:'➕', label:'Custom Section' },
];

const POPULAR_SKILLS: Record<string,string[]> = {
  'Product Manager':   ['Product Roadmap','Agile','Scrum','User Research','Data Analysis','Stakeholder Management','Figma','JIRA','A/B Testing','SQL','Go-to-Market','KPIs'],
  'Software Engineer': ['JavaScript','TypeScript','React','Node.js','Python','Git','REST APIs','SQL','AWS','Docker','System Design','Problem Solving'],
  'Data Analyst':      ['Python','SQL','Excel','Power BI','Tableau','Data Visualization','Statistics','Pandas','NumPy','Data Storytelling'],
  'Marketing':         ['Digital Marketing','SEO','SEM','Content Marketing','Social Media','Google Analytics','Email Marketing','Copywriting','Brand Strategy'],
  'Finance':           ['Financial Modeling','Excel Advanced','Accounting','Tally','SAP','Tax','Auditing','IFRS','Investment Analysis'],
  'Design':            ['Figma','Adobe XD','Photoshop','Illustrator','UI Design','UX Research','Prototyping','Wireframing','Design Systems'],
  'default':           ['MS Office','Communication','Teamwork','Problem Solving','Time Management','Leadership','Critical Thinking','Adaptability'],
};

const SUMMARY_EXAMPLES: Record<string,string[]> = {
  'Product Manager':[
    'MBA graduate with a passion for building user-centric products. Launched a gaming app with 40,000+ downloads during college. Experienced in Agile, user research, and cross-functional collaboration. Looking to join a product-driven team where I can create meaningful impact.',
    'Fresh product thinker with an engineering and business background. Completed a PM internship at [Company] where I defined 3 feature specs shipped to 10K users. Skilled at translating user pain points into product solutions.',
  ],
  'Software Engineer':[
    'Final-year B.Tech CS student with hands-on experience in React and Node.js. Built [Project] serving 1,000+ users. Seeking a software engineering role to apply problem-solving skills and passion for building scalable products.',
    'Fresher with strong fundamentals in Java, Python, and Data Structures. Completed internship at [Company] contributing to backend API development. Eager to join a product-driven team and grow as a full-stack developer.',
  ],
  'Data Analyst':[
    'Statistics graduate skilled in Python, SQL, and Tableau. Built dashboards during internship that improved reporting efficiency by 30%. Passionate about turning raw data into clear business insights.',
  ],
  'default':[
    'Motivated [Degree] graduate from [College] with a strong foundation in [your field]. Completed [internship/project] gaining practical exposure to [relevant skills]. Eager to contribute to a dynamic team and build a career in [target industry].',
    'Enthusiastic professional with [X] years of experience in [domain]. Proven track record of [achievement]. Skilled at [key skill 1] and [key skill 2], passionate about delivering high-quality results.',
  ],
};

const uid = () => Math.random().toString(36).slice(2,9);

const emptyResume = (): ResumeData => ({
  personalInfo:{ fullName:'',title:'',email:'',phone:'',location:'',linkedin:'',website:'',photo:'',signature:false },
  summary:'', experience:[], education:[{ id:uid(),institution:'',degree:'',year:'',score:'' }],
  skills:[], projects:[], certifications:[], languages:[],
  internships:[], awards:[], volunteer:[], publications:[],
  customSections:[], targetRole:'', experienceLevel:'fresher',
});

function hexRgb(hex:string){ const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return r?`${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}`:'37,99,235'; }

// ─── Shared primitives ────────────────────────────────────────────────────────

const inputStyle = (t:Theme, focused:boolean): React.CSSProperties => ({
  width:'100%', padding:'9px 12px', borderRadius:'7px',
  background:t.inputBg, border:`1.5px solid ${focused?t.inputFocus:t.inputBorder}`,
  color:t.text, fontSize:'13.5px', fontFamily:'Urbanist,sans-serif',
  outline:'none', boxSizing:'border-box', transition:'border-color 0.18s',
});

function Field({ label,value,onChange,placeholder='',type='text',multiline=false,rows=3,hint='',t }:
  { label:string;value:string;onChange:(v:string)=>void;placeholder?:string;type?:string;multiline?:boolean;rows?:number;hint?:string;t:Theme }) {
  const [f,setF]=useState(false);
  const s=inputStyle(t,f);
  return (
    <div style={{ display:'flex',flexDirection:'column',gap:'5px' }}>
      {label&&<label style={{ fontSize:'10.5px',fontWeight:700,color:t.labelColor,textTransform:'uppercase',letterSpacing:'0.8px' }}>{label}</label>}
      {multiline
        ?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
            onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{...s,resize:'vertical'}} />
        :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
            onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={s} />
      }
      {hint&&<span style={{ fontSize:'11px',color:t.hintColor,fontStyle:'italic',lineHeight:1.5 }}>{hint}</span>}
    </div>
  );
}

function Card({ children,title,index,onRemove,t }:
  { children:React.ReactNode;title:string;index:number;onRemove?:()=>void;t:Theme }) {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
      style={{ background:t.cardBg,border:`1px solid ${t.cardBorder}`,borderRadius:'10px',padding:'14px',marginBottom:'10px' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'11px' }}>
        <span style={{ fontSize:'11px',fontWeight:700,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.8px' }}>{title} {index+1}</span>
        {onRemove&&<button onClick={onRemove} style={{ background:'none',border:'none',color:t.danger,cursor:'pointer',fontSize:'12px',fontFamily:'Urbanist,sans-serif',fontWeight:600,padding:'2px 6px',borderRadius:'4px' }}>Remove</button>}
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:'9px' }}>{children}</div>
    </motion.div>
  );
}

function AddBtn({ label,onClick,t }:{ label:string;onClick:()=>void;t:Theme }) {
  return (
    <motion.button onClick={onClick} whileHover={{scale:1.01}} whileTap={{scale:0.99}}
      style={{ padding:'10px',borderRadius:'8px',border:`1.5px dashed ${t.accentBorder}`,background:t.accentBg,color:t.accent,cursor:'pointer',fontSize:'12.5px',fontWeight:700,fontFamily:'Urbanist,sans-serif',width:'100%',transition:'all 0.15s' }}>
      {label}
    </motion.button>
  );
}

function AIBtn({ onClick,loading,label,t }:{ onClick:()=>void;loading:boolean;label:string;t:Theme }) {
  return (
    <motion.button onClick={onClick} disabled={loading} whileHover={{scale:loading?1:1.02}} whileTap={{scale:loading?1:0.98}}
      style={{ display:'flex',alignItems:'center',gap:'5px',padding:'6px 12px',borderRadius:'7px',border:`1.5px solid ${t.accentBorder}`,background:loading?t.surface:t.accentBg,color:loading?t.textMuted:t.accent,fontSize:'12px',fontWeight:700,cursor:loading?'not-allowed':'pointer',fontFamily:'Urbanist,sans-serif',whiteSpace:'nowrap',transition:'all 0.15s' }}>
      {loading
        ?<motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}} style={{width:'11px',height:'11px',borderRadius:'50%',border:'1.5px solid transparent',borderTopColor:t.textMuted}} />
        :'✨'}
      {loading?'Writing...':label}
    </motion.button>
  );
}

function TipBox({ children,t }:{ children:React.ReactNode;t:Theme }) {
  return (
    <div style={{ padding:'10px 12px',borderRadius:'8px',background:t.tipBg,border:`1px solid ${t.tipBorder}`,fontSize:'12px',color:t.textSub,lineHeight:1.65 }}>
      {children}
    </div>
  );
}

// ─── Resume Preview ───────────────────────────────────────────────────────────
function ResumePreview({ data,templateId,accentColor,fontFamily,zoom }:
  { data:ResumeData;templateId:TemplateId;accentColor:string;fontFamily:string;zoom:number }) {
  const tpl=TEMPLATES.find(x=>x.id===templateId)||TEMPLATES[0];
  const acc=accentColor;
  const isTech=templateId==='tech';
  const isHeritage=templateId==='heritage';
  const isDark=isTech;
  const tc=isDark?'#e2e8f0':'#111';
  const mc=isDark?'#64748b':'#666';
  const font=fontFamily||tpl.font;
  const name=data.personalInfo.fullName||'Your Name';
  const role=data.personalInfo.title||'Your Professional Title';

  const ST=({ c }:{ c:string })=>(
    <div style={{ marginBottom:'8px' }}>
      {isHeritage?(
        <div style={{ display:'flex',alignItems:'center',gap:'7px' }}>
          <div style={{ flex:1,height:'0.5px',background:acc,opacity:0.35 }} />
          <span style={{ fontSize:'7px',letterSpacing:'2.5px',color:acc,textTransform:'uppercase',fontWeight:700 }}>{c}</span>
          <div style={{ flex:1,height:'0.5px',background:acc,opacity:0.35 }} />
        </div>
      ):isTech?(
        <div>
          <span style={{ fontFamily:'"Courier New"',fontSize:'7px',color:acc,marginRight:'4px' }}>{'//'}</span>
          <span style={{ fontSize:'7px',letterSpacing:'2px',color:'#475569',textTransform:'uppercase',fontWeight:700 }}>{c}</span>
          <div style={{ height:'0.5px',background:acc,opacity:0.2,marginTop:'3px' }} />
        </div>
      ):(
        <div>
          <div style={{ fontSize:'8px',letterSpacing:'1.8px',color:acc,textTransform:'uppercase',fontWeight:800,marginBottom:'2px' }}>{c}</div>
          <div style={{ height:'1.5px',background:`linear-gradient(90deg,${acc},transparent)`,width:'28px',borderRadius:'1px' }} />
        </div>
      )}
    </div>
  );

  return (
    <div style={{ fontFamily:font,background:tpl.bg,color:tc,width:'210mm',minHeight:'297mm',transform:`scale(${zoom})`,transformOrigin:'top left' }}>
      {/* Header */}
      {isHeritage?(
        <div style={{ background:tpl.headerBg,padding:'32px 40px',textAlign:'center',backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 22px,rgba(124,74,30,0.06) 22px,rgba(124,74,30,0.06) 23px)' }}>
          <div style={{ fontSize:'7px',letterSpacing:'4px',color:'#c9956a',textTransform:'uppercase',marginBottom:'6px' }}>Curriculum Vitae</div>
          <div style={{ fontSize:'27px',fontWeight:700,color:'#fdf6e3',fontStyle:'italic',marginBottom:'3px' }}>{name}</div>
          <div style={{ fontSize:'9.5px',color:'#c9956a',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'9px' }}>{role}</div>
          <div style={{ display:'flex',justifyContent:'center',gap:'14px',fontSize:'7.5px',color:'#d4a882',flexWrap:'wrap' }}>
            {data.personalInfo.email&&<span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone&&<span>{data.personalInfo.phone}</span>}
            {data.personalInfo.location&&<span>{data.personalInfo.location}</span>}
          </div>
        </div>
      ):isTech?(
        <div style={{ background:tpl.headerBg,padding:'32px 40px',borderBottom:`2px solid ${acc}` }}>
          <div style={{ fontFamily:'"Courier New"',fontSize:'7px',color:acc,marginBottom:'3px' }}>{'>> identity.init()'}</div>
          <div style={{ fontSize:'25px',fontWeight:900,color:'#fff',letterSpacing:'-0.5px' }}>{name}</div>
          <div style={{ fontSize:'9.5px',color:acc,fontFamily:'"Courier New"',margin:'3px 0 7px' }}>{role}</div>
          <div style={{ display:'flex',gap:'12px',fontSize:'7.5px',color:'#64748b',flexWrap:'wrap' }}>
            {data.personalInfo.email&&<span style={{color:'#94a3b8'}}>{data.personalInfo.email}</span>}
            {data.personalInfo.phone&&<span style={{color:'#94a3b8'}}>{data.personalInfo.phone}</span>}
            {data.personalInfo.location&&<span style={{color:'#94a3b8'}}>{data.personalInfo.location}</span>}
          </div>
        </div>
      ):templateId==='executive'?(
        <div style={{ background:tpl.headerBg,padding:'28px 40px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
            <div>
              <div style={{ fontSize:'25px',fontWeight:700,color:'#fff',marginBottom:'2px' }}>{name}</div>
              <div style={{ fontSize:'9.5px',color:'#93b8e0',letterSpacing:'2px',textTransform:'uppercase' }}>{role}</div>
            </div>
            <div style={{ textAlign:'right',fontSize:'8px',color:'#93b8e0',lineHeight:1.9 }}>
              {data.personalInfo.email&&<div>{data.personalInfo.email}</div>}
              {data.personalInfo.phone&&<div>{data.personalInfo.phone}</div>}
              {data.personalInfo.location&&<div>{data.personalInfo.location}</div>}
            </div>
          </div>
        </div>
      ):templateId==='minimal'?(
        <div style={{ padding:'40px 40px 16px',borderBottom:`3px solid ${acc}` }}>
          <div style={{ fontSize:'27px',fontWeight:900,letterSpacing:'-0.5px',marginBottom:'2px' }}>{name}</div>
          <div style={{ fontSize:'11px',color:acc,fontWeight:600,marginBottom:'8px' }}>{role}</div>
          <div style={{ display:'flex',gap:'16px',fontSize:'8px',color:'#777',flexWrap:'wrap' }}>
            {data.personalInfo.email&&<span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone&&<span>{data.personalInfo.phone}</span>}
            {data.personalInfo.location&&<span>{data.personalInfo.location}</span>}
            {data.personalInfo.linkedin&&<span>{data.personalInfo.linkedin}</span>}
          </div>
        </div>
      ):(
        <div style={{ background:tpl.headerBg,padding:'28px 40px',borderBottom:`3px solid ${acc}` }}>
          <div style={{ display:'flex',alignItems:'center',gap:'14px' }}>
            {data.personalInfo.photo&&<img src={data.personalInfo.photo} alt="" style={{ width:'58px',height:'58px',borderRadius:'50%',objectFit:'cover',border:`2px solid ${acc}` }} />}
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'23px',fontWeight:800,color:isDark?'#fff':'#111',marginBottom:'2px' }}>{name}</div>
              <div style={{ fontSize:'10.5px',color:acc,fontWeight:600,marginBottom:'6px' }}>{role}</div>
              <div style={{ display:'flex',gap:'11px',fontSize:'8px',color:isDark?'#94a3b8':'#555',flexWrap:'wrap' }}>
                {data.personalInfo.email&&<span>✉ {data.personalInfo.email}</span>}
                {data.personalInfo.phone&&<span>📱 {data.personalInfo.phone}</span>}
                {data.personalInfo.location&&<span>📍 {data.personalInfo.location}</span>}
                {data.personalInfo.linkedin&&<span>🔗 {data.personalInfo.linkedin}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ display:'flex',gap:'22px',padding:'20px 40px' }}>
        <div style={{ flex:1,minWidth:0 }}>
          {data.summary&&<div style={{ marginBottom:'15px' }}><ST c="Profile Summary" /><p style={{ fontSize:'9px',lineHeight:1.75,color:isDark?'#94a3b8':'#444',margin:0 }}>{data.summary}</p></div>}
          {data.experience.filter(e=>e.company||e.role).length>0&&(
            <div style={{ marginBottom:'15px' }}>
              <ST c="Work Experience" />
              {data.experience.filter(e=>e.company||e.role).map(exp=>(
                <div key={exp.id} style={{ marginBottom:'11px' }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
                    <div><div style={{ fontSize:'10px',fontWeight:700,color:isDark?'#e2e8f0':'#111' }}>{exp.role||'Role'}</div><div style={{ fontSize:'9px',color:acc,fontWeight:600 }}>{exp.company}</div></div>
                    <div style={{ fontSize:'7.5px',color:mc,textAlign:'right' }}><div>{exp.duration}</div><div>{exp.location}</div></div>
                  </div>
                  <ul style={{ margin:'4px 0 0',paddingLeft:'12px' }}>
                    {exp.bullets.filter(b=>b.trim()).map((b,i)=><li key={i} style={{ fontSize:'8.5px',color:isDark?'#94a3b8':'#555',marginBottom:'2px',lineHeight:1.6 }}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {data.internships.filter(i=>i.company).length>0&&(
            <div style={{ marginBottom:'15px' }}>
              <ST c="Internships" />
              {data.internships.filter(i=>i.company).map(intern=>(
                <div key={intern.id} style={{ marginBottom:'9px' }}>
                  <div style={{ display:'flex',justifyContent:'space-between' }}>
                    <div><div style={{ fontSize:'10px',fontWeight:700,color:isDark?'#e2e8f0':'#111' }}>{intern.role}</div><div style={{ fontSize:'9px',color:acc,fontWeight:600 }}>{intern.company}</div></div>
                    <div style={{ fontSize:'7.5px',color:mc }}>{intern.duration}</div>
                  </div>
                  {intern.description&&<p style={{ fontSize:'8.5px',color:isDark?'#94a3b8':'#555',margin:'3px 0 0',lineHeight:1.6 }}>{intern.description}</p>}
                </div>
              ))}
            </div>
          )}
          {data.projects.filter(p=>p.name).length>0&&(
            <div style={{ marginBottom:'15px' }}>
              <ST c="Projects" />
              {data.projects.filter(p=>p.name).map(proj=>(
                <div key={proj.id} style={{ marginBottom:'9px' }}>
                  <div style={{ fontSize:'10px',fontWeight:700,color:isDark?'#e2e8f0':'#111' }}>{proj.name}</div>
                  {proj.description&&<p style={{ fontSize:'8.5px',color:isDark?'#94a3b8':'#555',margin:'3px 0 0',lineHeight:1.6 }}>{proj.description}</p>}
                  {proj.link&&<div style={{ fontSize:'7.5px',color:acc,marginTop:'2px' }}>{proj.link}</div>}
                </div>
              ))}
            </div>
          )}
          {data.volunteer.filter(v=>v.organization).length>0&&(
            <div style={{ marginBottom:'15px' }}>
              <ST c="Volunteering" />
              {data.volunteer.filter(v=>v.organization).map(v=>(
                <div key={v.id} style={{ marginBottom:'8px' }}>
                  <div style={{ fontSize:'10px',fontWeight:700,color:isDark?'#e2e8f0':'#111' }}>{v.role} — {v.organization}</div>
                  <div style={{ fontSize:'7.5px',color:mc }}>{v.duration}</div>
                  {v.description&&<p style={{ fontSize:'8.5px',color:isDark?'#94a3b8':'#555',margin:'2px 0 0' }}>{v.description}</p>}
                </div>
              ))}
            </div>
          )}
          {data.publications.filter(p=>p.title).length>0&&(
            <div style={{ marginBottom:'15px' }}>
              <ST c="Publications" />
              {data.publications.filter(p=>p.title).map(pub=>(
                <div key={pub.id} style={{ marginBottom:'7px' }}>
                  <div style={{ fontSize:'9px',fontWeight:700,color:isDark?'#e2e8f0':'#111' }}>{pub.title}</div>
                  <div style={{ fontSize:'7.5px',color:mc }}>{pub.publisher}{pub.year?` · ${pub.year}`:''}</div>
                </div>
              ))}
            </div>
          )}
          {data.customSections.filter(s=>s.title).map(sec=>(
            <div key={sec.id} style={{ marginBottom:'15px' }}>
              <ST c={sec.title} />
              <p style={{ fontSize:'8.5px',color:isDark?'#94a3b8':'#555',lineHeight:1.7,margin:0 }}>{sec.content}</p>
            </div>
          ))}
          {data.personalInfo.signature&&data.personalInfo.fullName&&(
            <div style={{ marginTop:'18px',paddingTop:'12px',borderTop:`1px solid ${isDark?'#1e293b':'#e5e7eb'}` }}>
              <div style={{ fontFamily:'cursive',fontSize:'19px',color:acc,marginBottom:'3px' }}>{data.personalInfo.fullName}</div>
              <div style={{ fontSize:'7.5px',color:mc,lineHeight:1.6 }}>I hereby declare that all the information furnished above is true and correct to the best of my knowledge.</div>
            </div>
          )}
        </div>
        {/* Sidebar */}
        <div style={{ width:'150px',flexShrink:0 }}>
          {data.education.filter(e=>e.institution||e.degree).length>0&&(
            <div style={{ marginBottom:'14px' }}>
              <ST c="Education" />
              {data.education.filter(e=>e.institution||e.degree).map(edu=>(
                <div key={edu.id} style={{ marginBottom:'8px' }}>
                  <div style={{ fontSize:'9px',fontWeight:700,color:isDark?'#e2e8f0':'#111' }}>{edu.degree||'Degree'}</div>
                  <div style={{ fontSize:'8px',color:acc }}>{edu.institution}</div>
                  <div style={{ fontSize:'7px',color:mc }}>{edu.year}{edu.score?` · ${edu.score}`:''}</div>
                </div>
              ))}
            </div>
          )}
          {data.skills.filter(s=>s.trim()).length>0&&(
            <div style={{ marginBottom:'14px' }}>
              <ST c="Skills" />
              <div style={{ display:'flex',flexWrap:'wrap',gap:'3px' }}>
                {data.skills.filter(s=>s.trim()).map((sk,i)=>(
                  <span key={i} style={{ fontSize:'7px',padding:'2px 5px',borderRadius:'3px',background:`rgba(${hexRgb(acc)},0.12)`,color:isTech?'#00d4ff':acc,fontWeight:700,border:`1px solid rgba(${hexRgb(acc)},0.25)` }}>{sk}</span>
                ))}
              </div>
            </div>
          )}
          {data.certifications.filter(c=>c.name).length>0&&(
            <div style={{ marginBottom:'14px' }}>
              <ST c="Certifications" />
              {data.certifications.filter(c=>c.name).map(cert=>(
                <div key={cert.id} style={{ marginBottom:'6px' }}>
                  <div style={{ fontSize:'8px',fontWeight:700,color:isDark?'#e2e8f0':'#111' }}>{cert.name}</div>
                  <div style={{ fontSize:'7px',color:mc }}>{cert.issuer}{cert.year?` · ${cert.year}`:''}</div>
                </div>
              ))}
            </div>
          )}
          {data.languages.filter(l=>l.name).length>0&&(
            <div style={{ marginBottom:'14px' }}>
              <ST c="Languages" />
              {data.languages.filter(l=>l.name).map(lang=>(
                <div key={lang.id} style={{ display:'flex',justifyContent:'space-between',marginBottom:'3px',fontSize:'8px' }}>
                  <span style={{ color:isDark?'#e2e8f0':'#333' }}>{lang.name}</span>
                  <span style={{ color:acc,fontWeight:600 }}>{lang.level}</span>
                </div>
              ))}
            </div>
          )}
          {data.awards.filter(a=>a.title).length>0&&(
            <div style={{ marginBottom:'14px' }}>
              <ST c="Awards" />
              {data.awards.filter(a=>a.title).map(aw=>(
                <div key={aw.id} style={{ marginBottom:'7px' }}>
                  <div style={{ fontSize:'8px',fontWeight:700,color:isDark?'#e2e8f0':'#111' }}>{aw.title}</div>
                  <div style={{ fontSize:'7px',color:mc }}>{aw.issuer}{aw.year?` · ${aw.year}`:''}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResumeBuilderPage() {
  const [isDark,setIsDark]=useState(true);
  const t:typeof THEMES.dark = isDark ? THEMES.dark : THEMES.light as any;

  const [activeSection,setActiveSection]=useState<SectionId>('personal');
  const [resume,setResume]=useState<ResumeData>(emptyResume());
  const [templateId,setTemplateId]=useState<TemplateId>('clean');
  const [accentColor,setAccentColor]=useState('#2563eb');
  const [fontFamily,setFontFamily]=useState('Georgia');
  const [genAI,setGenAI]=useState<string|null>(null);
  const [showQuit,setShowQuit]=useState(false);
  const [showTemplates,setShowTemplates]=useState(false);
  const [showATS,setShowATS]=useState(false);
  const [saving,setSaving]=useState(false);
  const [saveOk,setSaveOk]=useState(false);
  const [skillInput,setSkillInput]=useState('');
  const [optionals,setOptionals]=useState<Set<SectionId>>(new Set());
  const [zoom,setZoom]=useState(0.5);
  const [showExamples,setShowExamples]=useState(false);
  const [atsLoading,setAtsLoading]=useState(false);
  const [atsData,setAtsData]=useState<any>(null);
  const [uploading,setUploading]=useState(false);

  useEffect(()=>{
    (async()=>{
      const { data:{ user } }=await supabase.auth.getUser();
      if(!user){ window.location.href='/auth/login'; return; }
      const m=user.user_metadata||{};
      setResume(r=>({ ...r, personalInfo:{...r.personalInfo,fullName:m.full_name||'',email:user.email||''}, targetRole:m.target_role||'', experienceLevel:m.persona||'fresher' }));
    })();
  },[]);

  useEffect(()=>{
    const fit=()=>{
      const p=document.getElementById('preview-panel');
      if(!p) return;
      setZoom(Math.min(Math.max((p.clientWidth-48)/(210*3.7795),0.32),0.9));
    };
    fit();
    window.addEventListener('resize',fit);
    return ()=>window.removeEventListener('resize',fit);
  },[]);

  const up=useCallback((f:keyof ResumeData['personalInfo'],v:string|boolean)=>{
    setResume(r=>({ ...r,personalInfo:{...r.personalInfo,[f]:v} }));
  },[]);

  const isFresher=resume.experienceLevel==='fresher'||resume.experienceLevel==='student';

  const callAI=async(prompt:string)=>{
    const res=await fetch('/api/ai',{ method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt}) });
    if(!res.ok) throw new Error('AI failed');
    const d=await res.json();
    return d.text||'';
  };

  const genSummary=async()=>{
    setGenAI('summary');
    try{
      const role=resume.personalInfo.title||resume.targetRole;
      if(!role){ alert('Please enter your Target Job Role first'); setGenAI(null); return; }
      const text=await callAI(`You are an expert Indian resume writer. Write a compelling 3-sentence professional summary. Name:${resume.personalInfo.fullName}, Role:${role}, Level:${resume.experienceLevel}, Skills:${resume.skills.join(',')}, Education:${resume.education.map(e=>`${e.degree} ${e.institution}`).join(';')}. Rules: ATS-friendly, active voice, no em dashes, specific, for Indian job market. Return ONLY the summary text.`);
      setResume(r=>({ ...r,summary:text.trim() }));
    }catch(e){ console.error(e); }
    setGenAI(null);
  };

  const genBullets=async(idx:number)=>{
    const exp=resume.experience[idx];
    setGenAI(`bullet-${idx}`);
    try{
      const text=await callAI(`Write 3 strong resume bullet points. Role:${exp.role}, Company:${exp.company}, Duration:${exp.duration}. Start each with an action verb. Be specific, quantified where possible, ATS-friendly. No em dashes. Return ONLY 3 lines, no numbering or bullet symbols.`);
      const bullets=text.split('\n').map((b:string)=>b.replace(/^[-•*]\s*/,'').trim()).filter(Boolean).slice(0,4);
      setResume(r=>{ const e=[...r.experience];e[idx]={...e[idx],bullets};return {...r,experience:e}; });
    }catch{}
    setGenAI(null);
  };

  const genInternDesc=async(idx:number)=>{
    const intern=resume.internships[idx];
    setGenAI(`intern-${idx}`);
    try{
      const text=await callAI(`Write a 2-sentence internship description. Role:${intern.role} at ${intern.company}, Duration:${intern.duration}. Be specific and professional. Return ONLY the description.`);
      setResume(r=>{ const a=[...r.internships];a[idx]={...a[idx],description:text.trim()};return {...r,internships:a}; });
    }catch{}
    setGenAI(null);
  };

  const suggestSkills=async()=>{
    setGenAI('skills');
    try{
      const role=resume.personalInfo.title||resume.targetRole||'professional';
      const text=await callAI(`List 14 relevant skills for a ${role} in India. Mix technical and soft skills, ATS-friendly. Return ONLY comma-separated values.`);
      const ns=text.split(',').map((s:string)=>s.trim()).filter(Boolean);
      setResume(r=>({ ...r,skills:[...new Set([...r.skills,...ns])] }));
    }catch{}
    setGenAI(null);
  };

  const runATS=async()=>{
    setAtsLoading(true); setShowATS(true); setAtsData(null);
    try{
      const rt=`Name:${resume.personalInfo.fullName},Title:${resume.personalInfo.title},Summary:${resume.summary},Skills:${resume.skills.join(',')},Experience:${resume.experience.map(e=>`${e.role} at ${e.company}: ${e.bullets.join(';')}`).join('\n')},Education:${resume.education.map(e=>`${e.degree} ${e.institution} ${e.year}`).join(';')},Target:${resume.targetRole}`;
      const text=await callAI(`Analyze this resume for ATS compatibility. ${rt}. Return ONLY JSON: {"score":72,"grade":"B","strengths":["..."],"improvements":["..."],"keywords_missing":["..."]}. No markdown.`);
      setAtsData(JSON.parse(text.replace(/```json|```/g,'').trim()));
    }catch{
      setAtsData({ score:55,grade:'C',strengths:['Resume structure is clear'],improvements:['Add more quantified achievements','Include target role keywords'],keywords_missing:['leadership','communication','collaboration'] });
    }
    setAtsLoading(false);
  };

  const handleUpload=async(file:File)=>{
    setUploading(true);
    const reader=new FileReader();
    reader.onload=async(e)=>{
      try{
        const text=await callAI(`Parse this resume and extract info. Return ONLY JSON: {"fullName":"","title":"","email":"","phone":"","location":"","linkedin":"","summary":"","skills":[],"education":[{"institution":"","degree":"","year":"","score":""}],"experience":[{"company":"","role":"","duration":"","location":"","bullets":[]}]}. Resume:\n${(e.target?.result as string).slice(0,3000)}`);
        const d=JSON.parse(text.replace(/```json|```/g,'').trim());
        setResume(r=>({
          ...r,
          personalInfo:{...r.personalInfo,fullName:d.fullName||r.personalInfo.fullName,title:d.title||r.personalInfo.title,email:d.email||r.personalInfo.email,phone:d.phone||r.personalInfo.phone,location:d.location||r.personalInfo.location,linkedin:d.linkedin||r.personalInfo.linkedin},
          summary:d.summary||r.summary,
          skills:d.skills?.length?d.skills:r.skills,
          education:d.education?.length?d.education.map((x:any)=>({...x,id:uid()})):r.education,
          experience:d.experience?.length?d.experience.map((x:any)=>({...x,id:uid(),bullets:x.bullets||['']})):r.experience,
        }));
      }catch(e){ console.error(e); }
      setUploading(false);
    };
    reader.readAsText(file);
  };

  const save=async()=>{
    setSaving(true);
    try{
      const { data:{ user } }=await supabase.auth.getUser();
      if(user) await supabase.from('resumes').upsert({ user_id:user.id,resume_data:resume,template:templateId,accent_color:accentColor,updated_at:new Date().toISOString() });
      setSaveOk(true); setTimeout(()=>setSaveOk(false),2500);
    }catch{}
    setSaving(false);
  };

  const allSectionList=[...CORE_SECTIONS,...OPTIONAL_SECTIONS];
  const curLabel=allSectionList.find(s=>s.id===activeSection);
  const examples=SUMMARY_EXAMPLES[resume.personalInfo.title]||SUMMARY_EXAMPLES[resume.targetRole]||SUMMARY_EXAMPLES['default'];
  const quickSkills=POPULAR_SKILLS[resume.personalInfo.title]||POPULAR_SKILLS[resume.targetRole]||POPULAR_SKILLS['default'];

  // ── Gradient text helper ──
  const gradText: React.CSSProperties = {
    background:'linear-gradient(90deg,#ff4500,#fb923c)',
    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
  };

  return (
    <div style={{ height:'100vh',background:t.bg,display:'flex',flexDirection:'column',fontFamily:'Urbanist,sans-serif',overflow:'hidden',transition:'background 0.3s,color 0.3s' }}>

      {/* ── TOPBAR ─────────────────────────────────────────────────────────── */}
      <div style={{ height:'52px',background:t.topbar,borderBottom:`1px solid ${t.topbarBorder}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 16px',flexShrink:0,zIndex:50,transition:'background 0.3s' }}>

        {/* Left */}
        <div style={{ display:'flex',alignItems:'center',gap:'12px' }}>
          <button onClick={()=>setShowQuit(true)} style={{ background:'none',border:`1px solid ${t.border}`,borderRadius:'7px',color:t.textSub,cursor:'pointer',fontSize:'13px',padding:'5px 10px',fontFamily:'Urbanist,sans-serif',transition:'all 0.15s' }}>← Back</button>
          <div style={{ width:'1px',height:'20px',background:t.border }} />
          <div style={{ display:'flex',alignItems:'center',gap:'6px' }}>
            <svg width="22" height="22" viewBox="0 0 52 52">
              <defs><linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ff4500"/><stop offset="100%" stopColor="#facc15"/></linearGradient></defs>
              <circle cx="26" cy="26" r="23" fill="none" stroke="url(#lg2)" strokeWidth="2.2"/>
              <circle cx="26" cy="14" r="5" fill="none" stroke="url(#lg2)" strokeWidth="2.2"/>
              <path d="M15,24 L26,38 M37,24 L26,38" stroke="url(#lg2)" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
              <path d="M19,48 L19,38 L34,38" stroke="url(#lg2)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span style={{ fontWeight:800,fontSize:'14px',...gradText }}>XL</span>
            <span style={{ fontWeight:300,fontSize:'14px',color:t.text }}>Resume Builder</span>
          </div>
        </div>

        {/* Center — template picker */}
        <motion.button onClick={()=>setShowTemplates(!showTemplates)} whileHover={{scale:1.02}} whileTap={{scale:0.98}}
          style={{ display:'flex',alignItems:'center',gap:'8px',padding:'7px 14px',borderRadius:'8px',background:showTemplates?t.accentBg:t.surfaceHigh,border:`1px solid ${showTemplates?t.accentBorder:t.border}`,color:showTemplates?t.accent:t.text,cursor:'pointer',fontSize:'13px',fontWeight:700,fontFamily:'Urbanist,sans-serif',transition:'all 0.2s' }}>
          🎨 <span>{TEMPLATES.find(x=>x.id===templateId)?.name}</span>
          <span style={{ color:t.textMuted,fontSize:'10px' }}>▾</span>
        </motion.button>

        {/* Right */}
        <div style={{ display:'flex',alignItems:'center',gap:'7px' }}>
          {/* Theme toggle */}
          <button onClick={()=>setIsDark(!isDark)}
            style={{ display:'flex',alignItems:'center',gap:'6px',padding:'6px 11px',borderRadius:'8px',background:t.surfaceHigh,border:`1px solid ${t.border}`,color:t.textSub,cursor:'pointer',fontSize:'12px',fontWeight:600,fontFamily:'Urbanist,sans-serif',transition:'all 0.2s' }}>
            {isDark?'☀️ Light':'🌙 Dark'}
          </button>
          {/* Import */}
          <label style={{ display:'flex',alignItems:'center',gap:'5px',padding:'6px 11px',borderRadius:'8px',background:t.surfaceHigh,border:`1px solid ${t.border}`,color:t.textSub,cursor:'pointer',fontSize:'12px',fontWeight:600,fontFamily:'Urbanist,sans-serif',transition:'all 0.2s',whiteSpace:'nowrap' }}>
            {uploading?'⏳ Parsing...':'📄 Import Resume'}
            <input type="file" accept=".txt,.pdf" style={{ display:'none' }} onChange={e=>{ const f=e.target.files?.[0]; if(f) handleUpload(f); }} />
          </label>
          {/* ATS */}
          <motion.button onClick={runATS} whileHover={{scale:1.02}} whileTap={{scale:0.98}}
            style={{ display:'flex',alignItems:'center',gap:'5px',padding:'6px 11px',borderRadius:'8px',background:t.successBg,border:`1px solid ${t.successBorder}`,color:t.success,cursor:'pointer',fontSize:'12px',fontWeight:700,fontFamily:'Urbanist,sans-serif',whiteSpace:'nowrap' }}>
            📊 ATS Score
          </motion.button>
          {/* Save */}
          <motion.button onClick={save} disabled={saving} whileHover={{scale:1.02}} whileTap={{scale:0.98}}
            style={{ padding:'6px 13px',borderRadius:'8px',background:saveOk?t.successBg:t.surfaceHigh,border:`1px solid ${saveOk?t.successBorder:t.border}`,color:saveOk?t.success:t.textSub,cursor:saving?'not-allowed':'pointer',fontSize:'13px',fontWeight:600,fontFamily:'Urbanist,sans-serif',transition:'all 0.2s' }}>
            {saving?'⏳':saveOk?'✓ Saved':'💾 Save'}
          </motion.button>
          {/* Download */}
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
            onClick={()=>alert('PDF export with Puppeteer coming soon!')}
            style={{ padding:'6px 16px',borderRadius:'8px',background:'linear-gradient(135deg,#ff4500,#fb923c)',border:'none',color:'#fff',fontSize:'13px',fontWeight:800,cursor:'pointer',fontFamily:'Urbanist,sans-serif',boxShadow:'0 2px 12px rgba(255,69,0,0.35)',whiteSpace:'nowrap' }}>
            ⬇ Download PDF
          </motion.button>
        </div>
      </div>

      {/* ── TEMPLATE PANEL ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTemplates&&(
          <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.16}}
            style={{ position:'absolute',top:'52px',left:'50%',transform:'translateX(-50%)',background:t.surface,border:`1px solid ${t.borderHigh}`,borderRadius:'16px',padding:'20px',zIndex:200,width:'780px',boxShadow:isDark?'0 24px 64px rgba(0,0,0,0.8)':'0 24px 64px rgba(0,0,0,0.14)' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px' }}>
              <span style={{ fontSize:'14px',fontWeight:800,color:t.text }}>Choose Template</span>
              <button onClick={()=>setShowTemplates(false)} style={{ background:'none',border:'none',color:t.textMuted,cursor:'pointer',fontSize:'20px' }}>×</button>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'8px',marginBottom:'18px' }}>
              {TEMPLATES.map(tpl=>(
                <button key={tpl.id} onClick={()=>{ setTemplateId(tpl.id);setAccentColor(tpl.accent);setShowTemplates(false); }}
                  style={{ padding:'9px 5px',borderRadius:'9px',cursor:'pointer',textAlign:'center',border:`2px solid ${templateId===tpl.id?t.accent:t.border}`,background:templateId===tpl.id?t.accentBg:t.surfaceHigh,transition:'all 0.18s',fontFamily:'Urbanist,sans-serif',position:'relative' }}>
                  <div style={{ width:'44px',height:'56px',margin:'0 auto 5px',borderRadius:'3px',background:tpl.bg,border:`1px solid ${t.border}`,overflow:'hidden' }}>
                    <div style={{ height:'14px',background:tpl.headerBg }} />
                    <div style={{ padding:'3px 4px' }}>
                      <div style={{ height:'1.5px',background:tpl.accent,borderRadius:'1px',marginBottom:'2px',width:'65%' }} />
                      {[90,80,75,70].map((w,i)=><div key={i} style={{ height:'1px',background:'#ccc',marginBottom:'1.5px',width:`${w}%` }} />)}
                    </div>
                  </div>
                  <div style={{ fontSize:'9.5px',fontWeight:700,color:templateId===tpl.id?t.accent:t.textSub }}>{tpl.name}</div>
                  {tpl.tag&&<span style={{ position:'absolute',top:'3px',right:'3px',fontSize:'7px',background:'linear-gradient(135deg,#ff4500,#facc15)',color:'#fff',padding:'1px 4px',borderRadius:'3px',fontWeight:800 }}>{tpl.tag}</span>}
                </button>
              ))}
            </div>
            <div style={{ display:'flex',gap:'28px',flexWrap:'wrap' }}>
              <div>
                <div style={{ fontSize:'10.5px',fontWeight:700,color:t.labelColor,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'9px' }}>Accent Color</div>
                <div style={{ display:'flex',gap:'6px',flexWrap:'wrap',alignItems:'center' }}>
                  {ACCENT_PRESETS.map(c=>(
                    <button key={c} onClick={()=>setAccentColor(c)} style={{ width:'21px',height:'21px',borderRadius:'50%',background:c,border:accentColor===c?'2.5px solid #fff':'2px solid transparent',cursor:'pointer',outline:accentColor===c?`2px solid ${c}`:'none',outlineOffset:'1px' }} />
                  ))}
                  <label style={{ cursor:'pointer' }}><input type="color" value={accentColor} onChange={e=>setAccentColor(e.target.value)} style={{ width:'21px',height:'21px',borderRadius:'50%',border:'none',cursor:'pointer',padding:0 }} /></label>
                </div>
              </div>
              <div>
                <div style={{ fontSize:'10.5px',fontWeight:700,color:t.labelColor,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'9px' }}>Font Style</div>
                <div style={{ display:'flex',gap:'5px',flexWrap:'wrap' }}>
                  {FONT_OPTIONS.map(f=>(
                    <button key={f.value} onClick={()=>setFontFamily(f.value)}
                      style={{ padding:'5px 9px',borderRadius:'6px',border:`1px solid ${fontFamily===f.value?t.accent:t.border}`,background:fontFamily===f.value?t.accentBg:t.surfaceHigh,color:fontFamily===f.value?t.accent:t.textSub,cursor:'pointer',fontSize:'11px',fontFamily:f.value,fontWeight:600 }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN LAYOUT ─────────────────────────────────────────────────────── */}
      <div style={{ flex:1,display:'flex',overflow:'hidden' }}>

        {/* Section nav strip */}
        <div style={{ width:'54px',background:t.sidebar,borderRight:`1px solid ${t.sidebarBorder}`,display:'flex',flexDirection:'column',padding:'8px 0',gap:'2px',alignItems:'center',overflowY:'auto',flexShrink:0,transition:'background 0.3s' }}>
          <div style={{ fontSize:'7px',color:t.textMuted,textTransform:'uppercase',letterSpacing:'1px',padding:'4px 0',fontWeight:700 }}>CORE</div>
          {CORE_SECTIONS.filter(s=>!(s.id==='experience'&&isFresher)).map(s=>{
            const active=activeSection===s.id;
            return (
              <button key={s.id} onClick={()=>setActiveSection(s.id)} title={s.label}
                style={{ width:'40px',height:'40px',borderRadius:'8px',border:'none',cursor:'pointer',background:active?t.accentBg:'none',fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s',outline:active?`1.5px solid ${t.accentBorder}`:'none',position:'relative' }}>
                {s.icon}
              </button>
            );
          })}
          <div style={{ height:'1px',background:t.border,width:'32px',margin:'4px 0' }} />
          <div style={{ fontSize:'7px',color:t.textMuted,textTransform:'uppercase',letterSpacing:'1px',padding:'2px 0',fontWeight:700 }}>MORE</div>
          {OPTIONAL_SECTIONS.map(s=>{
            const on=optionals.has(s.id);
            const active=activeSection===s.id&&on;
            return (
              <button key={s.id} onClick={()=>on?setActiveSection(s.id):(setOptionals(p=>new Set([...p,s.id])),setActiveSection(s.id))} title={on?s.label:`Add ${s.label}`}
                style={{ width:'40px',height:'40px',borderRadius:'8px',border:'none',cursor:'pointer',background:active?t.accentBg:'none',fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s',opacity:on?1:0.38,position:'relative',outline:active?`1.5px solid ${t.accentBorder}`:'none' }}>
                {s.icon}
                {!on&&<span style={{ position:'absolute',bottom:'2px',right:'2px',fontSize:'8px',color:t.accent,fontWeight:900,lineHeight:1 }}>+</span>}
              </button>
            );
          })}
        </div>

        {/* Editor panel */}
        <div style={{ width:'332px',background:t.editor,borderRight:`1px solid ${t.sidebarBorder}`,overflowY:'auto',flexShrink:0,transition:'background 0.3s' }}>
          {/* Section header */}
          <div style={{ padding:'12px 16px',borderBottom:`1px solid ${t.border}`,position:'sticky',top:0,background:t.editor,zIndex:5,display:'flex',alignItems:'center',gap:'9px',backdropFilter:'blur(8px)' }}>
            <span style={{ fontSize:'18px' }}>{curLabel?.icon}</span>
            <div>
              <div style={{ fontSize:'14px',fontWeight:800,color:t.text,lineHeight:1.2 }}>{curLabel?.label}</div>
            </div>
          </div>

          <div style={{ padding:'16px',display:'flex',flexDirection:'column',gap:'14px' }}>

            {/* ── PERSONAL ── */}
            {activeSection==='personal'&&<>
              <Field t={t} label="Full Name" value={resume.personalInfo.fullName} onChange={v=>up('fullName',v)} placeholder="Venkat Galeti" />
              <Field t={t} label="Professional Title / Headline" value={resume.personalInfo.title} onChange={v=>up('title',v)} placeholder="Product Manager, Software Engineer..." hint="Use the exact job title you are targeting. This is your headline." />
              <div style={{ height:'1px',background:t.border }} />
              <Field t={t} label="Email" value={resume.personalInfo.email} onChange={v=>up('email',v)} placeholder="you@gmail.com" type="email" />
              <Field t={t} label="Phone" value={resume.personalInfo.phone} onChange={v=>up('phone',v)} placeholder="+91 98765 43210" />
              <Field t={t} label="Location" value={resume.personalInfo.location} onChange={v=>up('location',v)} placeholder="Bangalore, Karnataka" />
              <Field t={t} label="LinkedIn URL" value={resume.personalInfo.linkedin} onChange={v=>up('linkedin',v)} placeholder="linkedin.com/in/yourname" />
              <Field t={t} label="Portfolio / Website" value={resume.personalInfo.website} onChange={v=>up('website',v)} placeholder="yourportfolio.in" />
              <div style={{ height:'1px',background:t.border }} />
              {/* Experience level */}
              <div>
                <div style={{ fontSize:'10.5px',fontWeight:700,color:t.labelColor,textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'8px' }}>Experience Level</div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px' }}>
                  {[['fresher','🎓 Fresher (0-1yr)'],['junior','💼 Junior (1-3yr)'],['mid','🚀 Mid (3-7yr)'],['senior','⭐ Senior (7yr+)']].map(([val,lbl])=>(
                    <button key={val} onClick={()=>setResume(r=>({...r,experienceLevel:val}))}
                      style={{ padding:'9px 8px',borderRadius:'8px',border:`1.5px solid ${resume.experienceLevel===val?t.accent:t.border}`,background:resume.experienceLevel===val?t.accentBg:t.surfaceHigh,color:resume.experienceLevel===val?t.accent:t.textSub,cursor:'pointer',fontSize:'12px',fontWeight:700,fontFamily:'Urbanist,sans-serif',textAlign:'left',transition:'all 0.15s' }}>
                      {lbl}
                    </button>
                  ))}
                </div>
                {isFresher&&<div style={{ marginTop:'8px',padding:'9px 11px',borderRadius:'8px',background:t.accentBg,border:`1px solid ${t.accentBorder}`,fontSize:'12px',color:t.accentMid,lineHeight:1.5 }}>Fresher mode: Experience section hidden. Use Internships instead.</div>}
              </div>
              <div style={{ height:'1px',background:t.border }} />
              {/* Photo */}
              <div>
                <div style={{ fontSize:'10.5px',fontWeight:700,color:t.labelColor,textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'8px' }}>Photo (optional)</div>
                {resume.personalInfo.photo?(
                  <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
                    <img src={resume.personalInfo.photo} alt="" style={{ width:'44px',height:'44px',borderRadius:'50%',objectFit:'cover',border:`2px solid ${t.accent}` }} />
                    <button onClick={()=>up('photo','')} style={{ background:'none',border:`1px solid ${t.danger}33`,borderRadius:'6px',color:t.danger,cursor:'pointer',fontSize:'12px',padding:'5px 10px',fontFamily:'Urbanist,sans-serif' }}>Remove</button>
                  </div>
                ):(
                  <label style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',padding:'12px',borderRadius:'8px',border:`1.5px dashed ${t.border}`,cursor:'pointer',background:t.surfaceHigh,color:t.textSub,fontSize:'12px',fontWeight:600 }}>
                    📷 Upload Photo
                    <input type="file" accept="image/*" style={{ display:'none' }} onChange={e=>{ const f=e.target.files?.[0];if(f){const r2=new FileReader();r2.onload=ev=>up('photo',ev.target?.result as string);r2.readAsDataURL(f);}}} />
                  </label>
                )}
              </div>
              {/* Signature */}
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 13px',borderRadius:'10px',background:t.cardBg,border:`1px solid ${t.cardBorder}` }}>
                <div>
                  <div style={{ fontSize:'13px',fontWeight:700,color:t.text,marginBottom:'2px' }}>Digital Signature</div>
                  <div style={{ fontSize:'11px',color:t.textSub,lineHeight:1.5 }}>Auto-generated cursive signature at resume bottom</div>
                </div>
                <button onClick={()=>up('signature',!resume.personalInfo.signature)}
                  style={{ width:'40px',height:'22px',borderRadius:'11px',border:'none',cursor:'pointer',background:resume.personalInfo.signature?t.accent:t.toggleTrack,position:'relative',transition:'background 0.2s',flexShrink:0 }}>
                  <div style={{ width:'16px',height:'16px',borderRadius:'50%',background:'#fff',position:'absolute',top:'3px',transition:'left 0.2s',left:resume.personalInfo.signature?'21px':'3px',boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }} />
                </button>
              </div>
              {resume.personalInfo.signature&&resume.personalInfo.fullName&&(
                <div style={{ padding:'12px',borderRadius:'8px',background:t.accentBg,border:`1px solid ${t.accentBorder}`,textAlign:'center' }}>
                  <div style={{ fontFamily:'cursive',fontSize:'22px',color:t.accent }}>{resume.personalInfo.fullName}</div>
                  <div style={{ fontSize:'10px',color:t.textMuted,marginTop:'3px' }}>Signature preview</div>
                </div>
              )}
            </>}

            {/* ── SUMMARY ── */}
            {activeSection==='summary'&&<>
              <Field t={t} label="Your Target Job Role" value={resume.personalInfo.title} onChange={v=>up('title',v)} placeholder="Product Manager, Software Engineer..." hint="Enter your target role here first. AI uses this to write your summary." />
              <div style={{ padding:'11px 13px',borderRadius:'9px',background:t.accentBg,border:`1px solid ${t.accentBorder}`,fontSize:'12.5px',color:t.accentMid,lineHeight:1.65 }}>
                <strong style={{ color:t.accent }}>What is a Professional Summary?</strong><br/>
                It is 3-4 lines at the very top of your resume that tell a recruiter who you are, what you are good at, and what role you want. Think of it as your 30-second pitch. Most freshers skip this — it is your biggest advantage if done right.
              </div>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                <span style={{ fontSize:'13px',fontWeight:700,color:t.text }}>Professional Summary</span>
                <AIBtn t={t} onClick={genSummary} loading={genAI==='summary'} label="AI Write for me" />
              </div>
              <Field t={t} label="" value={resume.summary} onChange={v=>setResume(r=>({...r,summary:v}))} multiline rows={6} placeholder="Write about yourself, your skills, and what role you are targeting..." />
              <div style={{ fontSize:'11px',color:t.textMuted,textAlign:'right' }}>{resume.summary.length}/600 characters</div>
              <button onClick={()=>setShowExamples(!showExamples)}
                style={{ display:'flex',alignItems:'center',justifyContent:'space-between',background:t.surfaceHigh,border:`1px solid ${t.border}`,borderRadius:'8px',color:t.textSub,cursor:'pointer',fontSize:'12px',fontWeight:600,padding:'9px 12px',fontFamily:'Urbanist,sans-serif',width:'100%',transition:'all 0.15s' }}>
                <span>📖 See example summaries for {resume.personalInfo.title||'your role'}</span>
                <span>{showExamples?'▲':'▼'}</span>
              </button>
              <AnimatePresence>
                {showExamples&&(
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{ overflow:'hidden' }}>
                    <div style={{ display:'flex',flexDirection:'column',gap:'7px' }}>
                      {examples.map((ex,i)=>(
                        <motion.div key={i} whileHover={{scale:1.01}} onClick={()=>{ setResume(r=>({...r,summary:ex})); setShowExamples(false); }}
                          style={{ padding:'11px',borderRadius:'8px',background:t.cardBg,border:`1px solid ${t.cardBorder}`,cursor:'pointer',transition:'border-color 0.15s' }}>
                          <div style={{ fontSize:'10px',color:t.accent,marginBottom:'4px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.8px' }}>Example {i+1} — tap to use</div>
                          <div style={{ fontSize:'12px',color:t.text,lineHeight:1.7 }}>{ex}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>}

            {/* ── EXPERIENCE ── */}
            {activeSection==='experience'&&!isFresher&&<>
              {resume.experience.length===0&&<TipBox t={t}>Start with your most recent job. Use the AI button to auto-generate strong bullet points.</TipBox>}
              {resume.experience.map((exp,idx)=>(
                <Card key={exp.id} t={t} title="Position" index={idx} onRemove={()=>setResume(r=>({...r,experience:r.experience.filter((_,i)=>i!==idx)}))}>
                  <Field t={t} label="Job Title" value={exp.role} onChange={v=>setResume(r=>{ const e=[...r.experience];e[idx]={...e[idx],role:v};return {...r,experience:e}; })} placeholder="Software Engineer, Product Manager..." hint="Use the exact title for ATS matching" />
                  <Field t={t} label="Company" value={exp.company} onChange={v=>setResume(r=>{ const e=[...r.experience];e[idx]={...e[idx],company:v};return {...r,experience:e}; })} placeholder="Infosys, TCS, Startup Name..." />
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px' }}>
                    <Field t={t} label="Duration" value={exp.duration} onChange={v=>setResume(r=>{ const e=[...r.experience];e[idx]={...e[idx],duration:v};return {...r,experience:e}; })} placeholder="Jan 2022 - Present" />
                    <Field t={t} label="Location" value={exp.location} onChange={v=>setResume(r=>{ const e=[...r.experience];e[idx]={...e[idx],location:v};return {...r,experience:e}; })} placeholder="Bangalore" />
                  </div>
                  <div>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'7px' }}>
                      <label style={{ fontSize:'10.5px',fontWeight:700,color:t.labelColor,textTransform:'uppercase',letterSpacing:'0.8px' }}>What you did</label>
                      <AIBtn t={t} onClick={()=>genBullets(idx)} loading={genAI===`bullet-${idx}`} label="AI Write" />
                    </div>
                    <TipBox t={t}>Start each bullet with a verb: Built, Led, Increased, Reduced. Add numbers where possible.</TipBox>
                    <div style={{ marginTop:'8px' }}>
                      {exp.bullets.map((b,bi)=>(
                        <div key={bi} style={{ display:'flex',gap:'6px',marginBottom:'6px',alignItems:'center' }}>
                          <span style={{ color:t.textMuted,fontSize:'14px',flexShrink:0 }}>•</span>
                          <input value={b} onChange={e=>setResume(r=>{ const ex=[...r.experience];const bl=[...ex[idx].bullets];bl[bi]=e.target.value;ex[idx]={...ex[idx],bullets:bl};return {...r,experience:ex}; })}
                            placeholder="Built X feature which increased Y by Z%..." style={{ ...inputStyle(t,false),flex:1,padding:'8px 10px' }} />
                          {exp.bullets.length>1&&<button onClick={()=>setResume(r=>{ const ex=[...r.experience];ex[idx]={...ex[idx],bullets:ex[idx].bullets.filter((_,i)=>i!==bi)};return {...r,experience:ex}; })} style={{ background:'none',border:'none',color:t.textMuted,cursor:'pointer',fontSize:'16px',flexShrink:0 }}>×</button>}
                        </div>
                      ))}
                      <button onClick={()=>setResume(r=>{ const ex=[...r.experience];ex[idx]={...ex[idx],bullets:[...ex[idx].bullets,'']};return {...r,experience:ex}; })} style={{ background:'none',border:`1px dashed ${t.border}`,borderRadius:'6px',color:t.textSub,cursor:'pointer',fontSize:'12px',padding:'6px 12px',fontFamily:'Urbanist,sans-serif',width:'100%',marginTop:'4px' }}>+ Add bullet point</button>
                    </div>
                  </div>
                </Card>
              ))}
              <AddBtn t={t} label="+ Add Work Experience" onClick={()=>setResume(r=>({...r,experience:[...r.experience,{id:uid(),company:'',role:'',duration:'',location:'',bullets:['']}]}))} />
            </>}
            {activeSection==='experience'&&isFresher&&(
              <div style={{ textAlign:'center',padding:'24px 16px' }}>
                <div style={{ fontSize:'36px',marginBottom:'12px' }}>🎓</div>
                <div style={{ fontSize:'15px',fontWeight:800,color:t.text,marginBottom:'8px' }}>You are in Fresher mode</div>
                <div style={{ fontSize:'13px',color:t.textSub,lineHeight:1.75,marginBottom:'18px' }}>Work experience is not required. Focus on Internships, Projects, and Skills — those matter most for freshers!</div>
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={()=>{ setOptionals(p=>new Set([...p,'internships']));setActiveSection('internships'); }}
                  style={{ padding:'10px 20px',borderRadius:'10px',border:`1.5px solid ${t.accentBorder}`,background:t.accentBg,color:t.accent,cursor:'pointer',fontSize:'13px',fontWeight:700,fontFamily:'Urbanist,sans-serif' }}>
                  Go to Internships →
                </motion.button>
              </div>
            )}

            {/* ── EDUCATION ── */}
            {activeSection==='education'&&<>
              {resume.education.map((edu,idx)=>(
                <Card key={edu.id} t={t} title="Qualification" index={idx} onRemove={resume.education.length>1?()=>setResume(r=>({...r,education:r.education.filter((_,i)=>i!==idx)})):undefined}>
                  <Field t={t} label="Degree / Course" value={edu.degree} onChange={v=>setResume(r=>{ const e=[...r.education];e[idx]={...e[idx],degree:v};return {...r,education:e}; })} placeholder="B.Tech CS, MBA, BCA, 12th Science..." hint="Include 12th and 10th if fresher" />
                  <Field t={t} label="Institution Name" value={edu.institution} onChange={v=>setResume(r=>{ const e=[...r.education];e[idx]={...e[idx],institution:v};return {...r,education:e}; })} placeholder="IIT Bombay, Your College Name..." />
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px' }}>
                    <Field t={t} label="Year" value={edu.year} onChange={v=>setResume(r=>{ const e=[...r.education];e[idx]={...e[idx],year:v};return {...r,education:e}; })} placeholder="2020 - 2024" />
                    <Field t={t} label="CGPA / %" value={edu.score} onChange={v=>setResume(r=>{ const e=[...r.education];e[idx]={...e[idx],score:v};return {...r,education:e}; })} placeholder="8.5 CGPA / 78%" />
                  </div>
                </Card>
              ))}
              <AddBtn t={t} label="+ Add Qualification" onClick={()=>setResume(r=>({...r,education:[...r.education,{id:uid(),institution:'',degree:'',year:'',score:''}]}))} />
            </>}

            {/* ── SKILLS ── */}
            {activeSection==='skills'&&<>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                <span style={{ fontSize:'13px',fontWeight:700,color:t.text }}>Your Skills</span>
                <AIBtn t={t} onClick={suggestSkills} loading={genAI==='skills'} label="AI Suggest" />
              </div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:'7px',padding:'12px',background:t.cardBg,borderRadius:'10px',border:`1px solid ${t.cardBorder}`,minHeight:'52px' }}>
                {resume.skills.filter(s=>s.trim()).length===0&&<span style={{ fontSize:'12px',color:t.textMuted,fontStyle:'italic' }}>No skills yet. Type below or pick from suggestions.</span>}
                {resume.skills.filter(s=>s.trim()).map((sk,i)=>(
                  <motion.span key={i} initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
                    style={{ display:'flex',alignItems:'center',gap:'4px',padding:'4px 10px',borderRadius:'20px',background:t.accentBg,border:`1px solid ${t.accentBorder}`,color:t.accent,fontSize:'12.5px',fontWeight:700 }}>
                    {sk}
                    <button onClick={()=>setResume(r=>({...r,skills:r.skills.filter((_,j)=>j!==i)}))} style={{ background:'none',border:'none',color:t.accent,cursor:'pointer',fontSize:'13px',padding:'0',lineHeight:1,opacity:0.7 }}>×</button>
                  </motion.span>
                ))}
              </div>
              <div style={{ display:'flex',gap:'7px' }}>
                <input value={skillInput} onChange={e=>setSkillInput(e.target.value)}
                  onKeyDown={e=>{ if((e.key==='Enter'||e.key===',')&&skillInput.trim()){ e.preventDefault();setResume(r=>({...r,skills:[...r.skills.filter(s=>s.trim()),skillInput.trim()]}));setSkillInput(''); }}}
                  placeholder="Type a skill and press Enter..."
                  style={{ ...inputStyle(t,false),flex:1 }} />
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={()=>{ if(skillInput.trim()){ setResume(r=>({...r,skills:[...r.skills.filter(s=>s.trim()),skillInput.trim()]}));setSkillInput(''); }}}
                  style={{ padding:'9px 14px',borderRadius:'8px',border:'none',background:'linear-gradient(135deg,#ff4500,#fb923c)',color:'#fff',cursor:'pointer',fontSize:'13px',fontWeight:700,fontFamily:'Urbanist,sans-serif',whiteSpace:'nowrap' }}>Add</motion.button>
              </div>
              <div>
                <div style={{ fontSize:'10.5px',fontWeight:700,color:t.labelColor,textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'8px' }}>Quick add for {resume.personalInfo.title||'your role'}</div>
                <div style={{ display:'flex',flexWrap:'wrap',gap:'5px' }}>
                  {quickSkills.map((sk,i)=>{
                    const added=resume.skills.includes(sk);
                    return (
                      <button key={i} onClick={()=>added?setResume(r=>({...r,skills:r.skills.filter(s=>s!==sk)})):setResume(r=>({...r,skills:[...r.skills.filter(s=>s.trim()),sk]}))}
                        style={{ padding:'5px 10px',borderRadius:'20px',border:`1px solid ${added?t.accent:t.border}`,background:added?t.accentBg:t.surfaceHigh,color:added?t.accent:t.textSub,cursor:'pointer',fontSize:'12px',fontWeight:600,fontFamily:'Urbanist,sans-serif',transition:'all 0.15s' }}>
                        {added?'✓ ':''}{sk}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>}

            {/* ── PROJECTS ── */}
            {activeSection==='projects'&&<>
              <TipBox t={t}>Add college projects, personal builds, hackathon entries, anything you built. Projects are the most important section for freshers.</TipBox>
              {resume.projects.map((proj,idx)=>(
                <Card key={proj.id} t={t} title="Project" index={idx} onRemove={()=>setResume(r=>({...r,projects:r.projects.filter((_,i)=>i!==idx)}))}>
                  <Field t={t} label="Project Name" value={proj.name} onChange={v=>setResume(r=>{ const p=[...r.projects];p[idx]={...p[idx],name:v};return {...r,projects:p}; })} placeholder="Resume Builder App, E-Commerce Site..." />
                  <Field t={t} label="What did you build?" value={proj.description} onChange={v=>setResume(r=>{ const p=[...r.projects];p[idx]={...p[idx],description:v};return {...r,projects:p}; })} multiline rows={3} placeholder="Built using React and Node.js. Served 1000+ users. Features include..." hint="Tech stack + what it does + your role + impact" />
                  <Field t={t} label="GitHub / Live Link" value={proj.link} onChange={v=>setResume(r=>{ const p=[...r.projects];p[idx]={...p[idx],link:v};return {...r,projects:p}; })} placeholder="github.com/yourname/project" />
                </Card>
              ))}
              <AddBtn t={t} label="+ Add Project" onClick={()=>setResume(r=>({...r,projects:[...r.projects,{id:uid(),name:'',description:'',link:''}]}))} />
            </>}

            {/* ── CERTIFICATIONS ── */}
            {activeSection==='certifications'&&<>
              <TipBox t={t}>Add Coursera, Udemy, NPTEL, LinkedIn Learning, Google, AWS, or any certificate you have completed.</TipBox>
              {resume.certifications.map((cert,idx)=>(
                <Card key={cert.id} t={t} title="Certification" index={idx} onRemove={()=>setResume(r=>({...r,certifications:r.certifications.filter((_,i)=>i!==idx)}))}>
                  <Field t={t} label="Certification Name" value={cert.name} onChange={v=>setResume(r=>{ const c=[...r.certifications];c[idx]={...c[idx],name:v};return {...r,certifications:c}; })} placeholder="AWS Cloud Practitioner, Python for Data Science..." />
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px' }}>
                    <Field t={t} label="Issuing Org" value={cert.issuer} onChange={v=>setResume(r=>{ const c=[...r.certifications];c[idx]={...c[idx],issuer:v};return {...r,certifications:c}; })} placeholder="Coursera, AWS, Google" />
                    <Field t={t} label="Year" value={cert.year} onChange={v=>setResume(r=>{ const c=[...r.certifications];c[idx]={...c[idx],year:v};return {...r,certifications:c}; })} placeholder="2024" />
                  </div>
                </Card>
              ))}
              <AddBtn t={t} label="+ Add Certification" onClick={()=>setResume(r=>({...r,certifications:[...r.certifications,{id:uid(),name:'',issuer:'',year:''}]}))} />
            </>}

            {/* ── LANGUAGES ── */}
            {activeSection==='languages'&&<>
              <TipBox t={t}>Add Hindi, English, and your regional language at minimum. Proficiency in English is a strong signal for corporate roles.</TipBox>
              {resume.languages.map((lang,idx)=>(
                <div key={lang.id} style={{ display:'flex',gap:'7px',alignItems:'center' }}>
                  <input value={lang.name} onChange={e=>setResume(r=>{ const l=[...r.languages];l[idx]={...l[idx],name:e.target.value};return {...r,languages:l}; })}
                    placeholder="Hindi, English, Telugu..." style={{ ...inputStyle(t,false),flex:1 }} />
                  <select value={lang.level} onChange={e=>setResume(r=>{ const l=[...r.languages];l[idx]={...l[idx],level:e.target.value};return {...r,languages:l}; })}
                    style={{ ...inputStyle(t,false),width:'130px',flex:'none' }}>
                    {['Native','Fluent','Professional','Conversational','Basic'].map(l=><option key={l}>{l}</option>)}
                  </select>
                  <button onClick={()=>setResume(r=>({...r,languages:r.languages.filter((_,i)=>i!==idx)}))} style={{ background:'none',border:'none',color:t.textMuted,cursor:'pointer',fontSize:'18px',flexShrink:0 }}>×</button>
                </div>
              ))}
              <AddBtn t={t} label="+ Add Language" onClick={()=>setResume(r=>({...r,languages:[...r.languages,{id:uid(),name:'',level:'Fluent'}]}))} />
            </>}

            {/* ── INTERNSHIPS ── */}
            {activeSection==='internships'&&<>
              <TipBox t={t}>Internships are your biggest asset as a fresher. Include college-arranged, self-found, virtual, and NGO internships. Even a 4-week internship counts.</TipBox>
              {resume.internships.map((intern,idx)=>(
                <Card key={intern.id} t={t} title="Internship" index={idx} onRemove={()=>setResume(r=>({...r,internships:r.internships.filter((_,i)=>i!==idx)}))}>
                  <Field t={t} label="Role" value={intern.role} onChange={v=>setResume(r=>{ const a=[...r.internships];a[idx]={...a[idx],role:v};return {...r,internships:a}; })} placeholder="Frontend Intern, Marketing Intern..." />
                  <Field t={t} label="Company" value={intern.company} onChange={v=>setResume(r=>{ const a=[...r.internships];a[idx]={...a[idx],company:v};return {...r,internships:a}; })} placeholder="Company name" />
                  <Field t={t} label="Duration" value={intern.duration} onChange={v=>setResume(r=>{ const a=[...r.internships];a[idx]={...a[idx],duration:v};return {...r,internships:a}; })} placeholder="May 2023 - Jul 2023" />
                  <div>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px' }}>
                      <label style={{ fontSize:'10.5px',fontWeight:700,color:t.labelColor,textTransform:'uppercase',letterSpacing:'0.8px' }}>What you did</label>
                      <AIBtn t={t} onClick={()=>genInternDesc(idx)} loading={genAI===`intern-${idx}`} label="AI Write" />
                    </div>
                    <Field t={t} label="" value={intern.description} onChange={v=>setResume(r=>{ const a=[...r.internships];a[idx]={...a[idx],description:v};return {...r,internships:a}; })} multiline rows={3} placeholder="Developed X... Assisted with Y... Learned Z..." />
                  </div>
                </Card>
              ))}
              <AddBtn t={t} label="+ Add Internship" onClick={()=>setResume(r=>({...r,internships:[...r.internships,{id:uid(),company:'',role:'',duration:'',description:''}]}))} />
            </>}

            {/* ── AWARDS ── */}
            {activeSection==='awards'&&<>
              {resume.awards.map((aw,idx)=>(
                <Card key={aw.id} t={t} title="Award" index={idx} onRemove={()=>setResume(r=>({...r,awards:r.awards.filter((_,i)=>i!==idx)}))}>
                  <Field t={t} label="Award / Achievement" value={aw.title} onChange={v=>setResume(r=>{ const a=[...r.awards];a[idx]={...a[idx],title:v};return {...r,awards:a}; })} placeholder="Best Paper Award, Hackathon Winner..." />
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px' }}>
                    <Field t={t} label="Issuer" value={aw.issuer} onChange={v=>setResume(r=>{ const a=[...r.awards];a[idx]={...a[idx],issuer:v};return {...r,awards:a}; })} placeholder="IIT Delhi, Infosys" />
                    <Field t={t} label="Year" value={aw.year} onChange={v=>setResume(r=>{ const a=[...r.awards];a[idx]={...a[idx],year:v};return {...r,awards:a}; })} placeholder="2023" />
                  </div>
                  <Field t={t} label="Description (optional)" value={aw.description} onChange={v=>setResume(r=>{ const a=[...r.awards];a[idx]={...a[idx],description:v};return {...r,awards:a}; })} placeholder="Brief context..." />
                </Card>
              ))}
              <AddBtn t={t} label="+ Add Award / Achievement" onClick={()=>setResume(r=>({...r,awards:[...r.awards,{id:uid(),title:'',issuer:'',year:'',description:''}]}))} />
            </>}

            {/* ── VOLUNTEER ── */}
            {activeSection==='volunteer'&&<>
              {resume.volunteer.map((v,idx)=>(
                <Card key={v.id} t={t} title="Activity" index={idx} onRemove={()=>setResume(r=>({...r,volunteer:r.volunteer.filter((_,i)=>i!==idx)}))}>
                  <Field t={t} label="Role" value={v.role} onChange={val=>setResume(r=>{ const a=[...r.volunteer];a[idx]={...a[idx],role:val};return {...r,volunteer:a}; })} placeholder="Campus Ambassador, NSS Volunteer..." />
                  <Field t={t} label="Organization" value={v.organization} onChange={val=>setResume(r=>{ const a=[...r.volunteer];a[idx]={...a[idx],organization:val};return {...r,volunteer:a}; })} placeholder="Teach for India, College Council..." />
                  <Field t={t} label="Duration" value={v.duration} onChange={val=>setResume(r=>{ const a=[...r.volunteer];a[idx]={...a[idx],duration:val};return {...r,volunteer:a}; })} placeholder="2022 - 2024" />
                  <Field t={t} label="What you did" value={v.description} onChange={val=>setResume(r=>{ const a=[...r.volunteer];a[idx]={...a[idx],description:val};return {...r,volunteer:a}; })} multiline rows={2} placeholder="Organized events, led team of X people..." />
                </Card>
              ))}
              <AddBtn t={t} label="+ Add Volunteer / Activity" onClick={()=>setResume(r=>({...r,volunteer:[...r.volunteer,{id:uid(),organization:'',role:'',duration:'',description:''}]}))} />
            </>}

            {/* ── PUBLICATIONS ── */}
            {activeSection==='publications'&&<>
              {resume.publications.map((pub,idx)=>(
                <Card key={pub.id} t={t} title="Publication" index={idx} onRemove={()=>setResume(r=>({...r,publications:r.publications.filter((_,i)=>i!==idx)}))}>
                  <Field t={t} label="Title" value={pub.title} onChange={v=>setResume(r=>{ const a=[...r.publications];a[idx]={...a[idx],title:v};return {...r,publications:a}; })} placeholder="Research paper or article title" />
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px' }}>
                    <Field t={t} label="Publisher" value={pub.publisher} onChange={v=>setResume(r=>{ const a=[...r.publications];a[idx]={...a[idx],publisher:v};return {...r,publications:a}; })} placeholder="IEEE, Springer" />
                    <Field t={t} label="Year" value={pub.year} onChange={v=>setResume(r=>{ const a=[...r.publications];a[idx]={...a[idx],year:v};return {...r,publications:a}; })} placeholder="2024" />
                  </div>
                  <Field t={t} label="Link" value={pub.link} onChange={v=>setResume(r=>{ const a=[...r.publications];a[idx]={...a[idx],link:v};return {...r,publications:a}; })} placeholder="doi.org/..." />
                </Card>
              ))}
              <AddBtn t={t} label="+ Add Publication" onClick={()=>setResume(r=>({...r,publications:[...r.publications,{id:uid(),title:'',publisher:'',year:'',link:''}]}))} />
            </>}

            {/* ── CUSTOM ── */}
            {activeSection==='custom'&&<>
              <TipBox t={t}>Add anything else: Extra-curriculars, Hobbies, Competitive Exams, Sports, Open Source contributions, etc.</TipBox>
              {resume.customSections.map((sec,idx)=>(
                <Card key={sec.id} t={t} title="Section" index={idx} onRemove={()=>setResume(r=>({...r,customSections:r.customSections.filter((_,i)=>i!==idx)}))}>
                  <Field t={t} label="Section Title" value={sec.title} onChange={v=>setResume(r=>{ const a=[...r.customSections];a[idx]={...a[idx],title:v};return {...r,customSections:a}; })} placeholder="Extra-Curriculars, Hobbies, Competitive Exams..." />
                  <Field t={t} label="Content" value={sec.content} onChange={v=>setResume(r=>{ const a=[...r.customSections];a[idx]={...a[idx],content:v};return {...r,customSections:a}; })} multiline rows={4} placeholder="Describe your activities and achievements..." />
                </Card>
              ))}
              <AddBtn t={t} label="+ Add Custom Section" onClick={()=>setResume(r=>({...r,customSections:[...r.customSections,{id:uid(),title:'',content:''}]}))} />
            </>}

          </div>
        </div>

        {/* ── LIVE PREVIEW ── */}
        <div id="preview-panel" style={{ flex:1,background:t.previewBg,display:'flex',flexDirection:'column',alignItems:'center',overflow:'auto',padding:'22px 20px',transition:'background 0.3s' }}>
          <div style={{ fontSize:'9.5px',color:t.textMuted,fontWeight:700,letterSpacing:'1.8px',textTransform:'uppercase',marginBottom:'14px' }}>Live Preview — A4</div>
          <div style={{ width:`${210*zoom*3.7795}px`,height:`${297*zoom*3.7795}px`,overflow:'hidden',borderRadius:'3px',boxShadow:isDark?'0 16px 64px rgba(0,0,0,0.9)':'0 8px 40px rgba(0,0,0,0.18)',flexShrink:0 }}>
            <ResumePreview data={resume} templateId={templateId} accentColor={accentColor} fontFamily={fontFamily} zoom={zoom} />
          </div>
          <div style={{ marginTop:'10px',fontSize:'10.5px',color:t.textMuted }}>210 × 297 mm · {Math.round(zoom*100)}% zoom</div>
          {(resume.summary||resume.skills.length>0)&&(
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.6}}
              style={{ marginTop:'14px',padding:'11px 14px',borderRadius:'12px',background:t.successBg,border:`1px solid ${t.successBorder}`,display:'flex',alignItems:'center',gap:'10px',maxWidth:`${Math.min(210*zoom*3.7795,380)}px`,width:'100%' }}>
              <span style={{ fontSize:'18px' }}>📊</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'12.5px',fontWeight:700,color:t.success,marginBottom:'1px' }}>Check your ATS Score</div>
                <div style={{ fontSize:'11px',color:t.textSub }}>See how your resume performs against recruiter systems.</div>
              </div>
              <button onClick={runATS} style={{ padding:'6px 11px',borderRadius:'7px',border:`1px solid ${t.successBorder}`,background:t.successBg,color:t.success,cursor:'pointer',fontSize:'11.5px',fontWeight:700,fontFamily:'Urbanist,sans-serif',whiteSpace:'nowrap' }}>Check</button>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── ATS MODAL ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showATS&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.72)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(6px)' }}
            onClick={e=>{ if(e.target===e.currentTarget) setShowATS(false); }}>
            <motion.div initial={{scale:0.94,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.94,opacity:0}}
              style={{ background:t.surface,border:`1px solid ${t.borderHigh}`,borderRadius:'20px',padding:'28px',maxWidth:'460px',width:'92%',maxHeight:'80vh',overflowY:'auto',boxShadow:isDark?'0 32px 80px rgba(0,0,0,0.8)':'0 24px 60px rgba(0,0,0,0.15)' }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px' }}>
                <div>
                  <div style={{ fontSize:'15px',fontWeight:800,color:t.text }}>ATS Score Analysis</div>
                  <div style={{ fontSize:'11px',color:t.textSub,marginTop:'2px' }}>AI analysis of your resume</div>
                </div>
                <button onClick={()=>setShowATS(false)} style={{ background:'none',border:'none',color:t.textMuted,cursor:'pointer',fontSize:'22px',lineHeight:1 }}>×</button>
              </div>
              {atsLoading?(
                <div style={{ textAlign:'center',padding:'32px' }}>
                  <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}}
                    style={{ width:'48px',height:'48px',borderRadius:'50%',border:`3px solid ${t.border}`,borderTopColor:t.success,borderRightColor:t.success,margin:'0 auto 16px' }} />
                  <div style={{ color:t.textSub,fontSize:'14px' }}>Analyzing your resume...</div>
                </div>
              ):atsData?(
                <div>
                  <div style={{ display:'flex',alignItems:'center',gap:'20px',marginBottom:'20px',padding:'16px',background:t.surfaceHigh,borderRadius:'12px' }}>
                    <div style={{ width:'68px',height:'68px',borderRadius:'50%',background:`conic-gradient(${atsData.score>=70?t.success:atsData.score>=50?t.accentMid:t.danger} ${atsData.score*3.6}deg,${t.border} 0deg)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <div style={{ width:'52px',height:'52px',borderRadius:'50%',background:t.surfaceHigh,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
                        <span style={{ fontSize:'17px',fontWeight:900,color:t.text }}>{atsData.score}</span>
                        <span style={{ fontSize:'8.5px',color:t.textMuted }}>/100</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize:'20px',fontWeight:900,color:t.text }}>Grade: {atsData.grade}</div>
                      <div style={{ fontSize:'12px',color:t.textSub,marginTop:'3px' }}>{atsData.score>=70?'Good ATS compatibility':atsData.score>=50?'Needs some improvements':'Needs major improvements'}</div>
                    </div>
                  </div>
                  {atsData.strengths?.length>0&&(
                    <div style={{ marginBottom:'14px' }}>
                      <div style={{ fontSize:'10.5px',fontWeight:700,color:t.success,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'7px' }}>Strengths</div>
                      {atsData.strengths.map((s:string,i:number)=><div key={i} style={{ fontSize:'13px',color:t.text,padding:'5px 0',borderBottom:`1px solid ${t.border}` }}>{s}</div>)}
                    </div>
                  )}
                  {atsData.improvements?.length>0&&(
                    <div style={{ marginBottom:'14px' }}>
                      <div style={{ fontSize:'10.5px',fontWeight:700,color:t.accentMid,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'7px' }}>Improvements Needed</div>
                      {atsData.improvements.map((s:string,i:number)=><div key={i} style={{ fontSize:'13px',color:t.text,padding:'5px 0',borderBottom:`1px solid ${t.border}` }}>{s}</div>)}
                    </div>
                  )}
                  {atsData.keywords_missing?.length>0&&(
                    <div>
                      <div style={{ fontSize:'10.5px',fontWeight:700,color:t.info,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'7px' }}>Missing Keywords — click to add</div>
                      <div style={{ display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'8px' }}>
                        {atsData.keywords_missing.map((k:string,i:number)=>(
                          <motion.button key={i} whileHover={{scale:1.04}} whileTap={{scale:0.96}} onClick={()=>{ setResume(r=>({...r,skills:[...r.skills.filter(s=>s.trim()),k]}));setShowATS(false);setActiveSection('skills'); }}
                            style={{ padding:'5px 10px',borderRadius:'6px',border:`1px solid ${t.info}44`,background:`${t.info}14`,color:t.info,cursor:'pointer',fontSize:'12px',fontWeight:700,fontFamily:'Urbanist,sans-serif' }}>
                            + {k}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ):null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── QUIT MODAL ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showQuit&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.72)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(6px)' }}
            onClick={e=>{ if(e.target===e.currentTarget) setShowQuit(false); }}>
            <motion.div initial={{scale:0.94,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.94,opacity:0}}
              style={{ background:t.surface,border:`1px solid ${t.borderHigh}`,borderRadius:'18px',padding:'28px',maxWidth:'360px',width:'92%',textAlign:'center' }}>
              <div style={{ fontSize:'38px',marginBottom:'12px' }}>⚠️</div>
              <h2 style={{ fontSize:'18px',fontWeight:800,color:t.text,marginBottom:'8px' }}>Exit Resume Builder?</h2>
              <p style={{ color:t.textSub,fontSize:'13.5px',lineHeight:1.75,marginBottom:'20px' }}>Your unsaved changes will be lost. Save your work first.</p>
              <div style={{ display:'flex',gap:'9px',marginBottom:'8px' }}>
                <button onClick={()=>setShowQuit(false)} style={{ flex:1,padding:'11px',borderRadius:'9px',border:`1px solid ${t.border}`,background:t.surfaceHigh,color:t.textSub,cursor:'pointer',fontSize:'13.5px',fontWeight:600,fontFamily:'Urbanist,sans-serif' }}>Keep Editing</button>
                <button onClick={async()=>{ await save();window.location.href='/dashboard'; }} style={{ flex:1,padding:'11px',borderRadius:'9px',border:`1px solid ${t.accentBorder}`,background:t.accentBg,color:t.accent,cursor:'pointer',fontSize:'13.5px',fontWeight:700,fontFamily:'Urbanist,sans-serif' }}>Save and Exit</button>
              </div>
              <button onClick={()=>window.location.href='/dashboard'} style={{ width:'100%',padding:'9px',borderRadius:'9px',border:'none',background:'none',color:t.textMuted,cursor:'pointer',fontSize:'12.5px',fontFamily:'Urbanist,sans-serif' }}>Exit without saving</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}