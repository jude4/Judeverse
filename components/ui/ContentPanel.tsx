'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Code2, Github, Linkedin, Mail, Sparkles, X } from 'lucide-react';
import NeuralDemo from '@/components/demos/NeuralDemo';
import PSODemo from '@/components/demos/PSODemo';
import { experience, education, resumePath } from '@/data/career';
import { projects, skillGroups, socialLinks } from '@/data/portfolio';
import { useStudioStore } from '@/store/useStudioStore';

function PanelHead({ eyebrow, title, count }: { eyebrow:string; title:string; count:string }) {
  return <div className="panel-head"><div className="panel-meta"><span>{eyebrow}</span><span>{count}</span></div><h2>{title}<span className="panel-dot">.</span></h2><div className="panel-rule"/></div>;
}
function About() {
  return <>
    <PanelHead eyebrow="01 / THE PERSON BEHIND THE CODE" title="Hello, world" count="ABOUT"/>
    <p className="lead-copy">I build systems that work beautifully — in the architecture, in the interface, and in the details most people never see.</p>
    <p className="body-copy">I&apos;m Ufuoma, a software engineer based in Bucharest, Romania. Over roughly eight years, I&apos;ve worked across full-stack products, API architecture, integrations, and event-driven applications.</p>
    <p className="body-copy">I&apos;m currently pursuing an MSc in Artificial Intelligence at POLITEHNICA Bucharest, combining years of hands-on engineering experience with machine learning and intelligent systems.</p>
    <div className="stat-row"><div><strong>08<span>+</span></strong><small>YEARS ENGINEERING</small></div><div><strong>MSc</strong><small>ARTIFICIAL INTELLIGENCE</small></div><div><strong>∞</strong><small>ROOM FOR CURIOSITY</small></div></div>
    <div className="minor-heading"><span className="mini-bar"/>CURRENT FOCUS</div>
    <div className="focus-grid"><div><Code2 size={19}/><strong>Architecture</strong><p>Backend services, reliable integrations, and distributed systems.</p></div><div><Sparkles size={19}/><strong>Intelligent systems</strong><p>Applied ML, optimization and AI-focused engineering.</p></div></div>
    <a className="panel-link" href={socialLinks.github} target="_blank" rel="noopener noreferrer">EXPLORE MY GITHUB <ArrowUpRight size={16}/></a>
  </>;
}
function Projects() {
  const {activeProject,openProject}=useStudioStore();
  const selected=projects.find(p=>p.id===activeProject);
  if(selected) return <>
    <button className="back-link" onClick={()=>useStudioStore.getState().navigate('projects')}><ArrowLeft size={16}/> ALL PROJECTS</button>
    <div className={`project-art art-${selected.theme} ${selected.image ? 'has-image' : ''}`}>{selected.image ? <Image src={selected.image} alt={`${selected.title} project screenshot`} fill sizes="(max-width: 700px) 100vw, 500px" className="project-real-image"/> : <><div className="project-art-grid"/><div className="art-symbol">{selected.title.slice(0,2).toUpperCase()}</div></>}<div className="art-side">{selected.number} / SELECTED PROJECT</div><span className="art-project-title">{selected.title.toUpperCase()}</span></div>
    <div className="panel-meta" style={{marginTop:26}}><span>{selected.category}</span><span>{selected.status || 'FEATURED WORK'}</span></div>
    <h2 className="detail-title">{selected.title}<span className="panel-dot">.</span></h2>
    <p className="lead-copy">{selected.summary}</p>
    <div className="minor-heading"><span className="mini-bar"/>OVERVIEW</div><p className="body-copy">{selected.description}</p>
    <div className="minor-heading"><span className="mini-bar"/>ENGINEERING FOCUS</div><p className="body-copy">{selected.contribution}</p>
    <div className="minor-heading"><span className="mini-bar"/>TECHNOLOGY</div>
    <div className="tech-tags">{selected.stack.map(tag=><span key={tag}>{tag}</span>)}</div>
    {selected.url && <a className="primary-project-link" href={selected.url} target="_blank" rel="noopener noreferrer">VISIT LIVE PROJECT <ArrowUpRight size={17}/></a>}
    {selected.github && <a className="panel-link" href={selected.github} target="_blank" rel="noopener noreferrer">VIEW SOURCE <Github size={17}/></a>}
  </>;
  return <>
    <PanelHead eyebrow="02 / SELECTED ENGINEERING" title="The work" count={`${projects.length} PROJECTS`}/>
    <p className="lead-copy">Real products, experimental ideas, and a constant curiosity about how things work.</p>
    <div className="projects-list">{projects.map(project=><button className="project-row" key={project.id} onClick={()=>openProject(project.id)}>
      <div className={`project-icon art-${project.theme}`}>{project.image ? <Image src={project.image} alt="" fill sizes="77px" className="project-real-image"/> : <span>{project.title.slice(0,2).toUpperCase()}</span>}</div>
      <div className="project-row-content"><div className="project-row-number">{project.number} / {project.category}</div><h3>{project.title}</h3><p>{project.summary}</p></div><ArrowUpRight className="project-row-arrow" size={19}/>
    </button>)}</div>
  </>;
}
function Lab() {
  const [tab,setTab]=useState<'neural'|'pso'|'architecture'>('neural');
  return <>
    <PanelHead eyebrow="03 / WHERE IDEAS BECOME EXPERIMENTS" title="The AI lab" count="LIVE DEMOS"/>
    <p className="lead-copy">A little space to experiment. Not just animations — functioning models of computational ideas.</p>
    <div className="lab-tabs" role="tablist" aria-label="AI laboratory demonstrations"><button role="tab" aria-selected={tab==='neural'} className={tab==='neural'?'selected':''} onClick={()=>setTab('neural')}>NEURAL NET</button><button role="tab" aria-selected={tab==='pso'} className={tab==='pso'?'selected':''} onClick={()=>setTab('pso')}>SWARM</button><button role="tab" aria-selected={tab==='architecture'} className={tab==='architecture'?'selected':''} onClick={()=>setTab('architecture')}>EVENTS</button></div>
    {tab==='neural' && <NeuralDemo/>}
    {tab==='pso' && <PSODemo/>}
    {tab==='architecture' && <div className="architecture-demo"><div className="demo-topline"><span>EVENT-DRIVEN ARCHITECTURE</span><span>CONCEPT DIAGRAM</span></div><div className="arch-pipeline"><div><small>01</small><strong>Producer</strong><span>Payment event</span></div><ArrowRight/><div><small>02</small><strong>Broker</strong><span>Message queue</span></div><ArrowRight/><div><small>03</small><strong>Worker</strong><span>Processing</span></div></div><div className="arch-storage">↓<br/> DATA STORE &amp; MONITORING</div><p className="demo-disclaimer">A conceptual architecture, not a live connection to a production backend. Similar patterns underpin reliable event-driven products.</p></div>}
    <div className="minor-heading"><span className="mini-bar"/>WHY THIS MATTERS</div>
    <p className="body-copy">I&apos;m interested in the gap between an algorithm that works in a notebook and a system people can actually depend on — where research meets engineering.</p>
  </>;
}
function Experience() {
  return <>
    <PanelHead eyebrow="04 / THE JOURNEY" title="My path" count="EXPERIENCE"/>
    <p className="lead-copy">Years of shipping real software. Still learning, still building.</p>
    <div className="timeline">
      {experience.map(job => <div className="timeline-event" key={job.company}><span className="timeline-year">{job.period}</span><div><h3>{job.company}</h3><p>{job.role}</p><small>{job.location}</small><ul className="studio-role-details">{job.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div></div>)}
      {education.map(item => <div className="timeline-event" key={item.title}><span className="timeline-year">{item.period}</span><div><h3>{item.title}</h3><p>{item.school}</p></div></div>)}
    </div>
    <a className="panel-link" href={resumePath} target="_blank" rel="noopener noreferrer">VIEW FULL RÉSUMÉ <ArrowUpRight size={16}/></a>
  </>;
}
function Skills() {
  return <>
    <PanelHead eyebrow="05 / THE TOOLKIT" title="What I use" count="EXPERTISE"/>
    <p className="lead-copy">Different tools. One approach: build thoughtfully, keep learning, and make complexity feel simple.</p>
    <div className="skills-list">{skillGroups.map((group,i)=><div className="skill-group" key={group.name}><div className="skill-number">0{i+1}</div><div><h3>{group.name}</h3><p>{group.desc}</p><div className="tech-tags">{group.skills.map(s=><span key={s}>{s}</span>)}</div></div></div>)}</div>
  </>;
}
function Contact() {
  const [copied,setCopied]=useState(false);
  const copy=async()=>{try{await navigator.clipboard.writeText('judeufuomao@gmail.com');setCopied(true);window.setTimeout(()=>setCopied(false),2000);}catch{window.location.href='mailto:judeufuomao@gmail.com';}};
  return <>
    <PanelHead eyebrow="06 / START SOMETHING" title="Let's connect" count="CONTACT"/>
    <p className="lead-copy">Have an interesting challenge, a collaboration in mind, or just want to talk about building things?</p>
    <p className="body-copy">I&apos;m always interested in thoughtful engineering problems, ambitious software products, and opportunities to work with curious people.</p>
    <a className="contact-email" href={socialLinks.email}>judeufuomao<br/>@gmail.com <ArrowUpRight size={26}/></a>
    <button className="copy-email" onClick={copy}>{copied?<Check size={15}/>:<Mail size={15}/>} {copied?'EMAIL COPIED':'COPY EMAIL ADDRESS'}</button>
    <div className="minor-heading"><span className="mini-bar"/>ELSEWHERE ON THE INTERNET</div>
    <div className="social-list"><a href={socialLinks.github} target="_blank" rel="noopener noreferrer"><Github size={21}/> GITHUB <ArrowUpRight size={16}/></a><a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={21}/> LINKEDIN <ArrowUpRight size={16}/></a></div>
    <div className="contact-footer">BASED IN BUCHAREST, ROMANIA <span className="status-light"/></div>
  </>;
}
export default function ContentPanel() {
  const {entered,section,navigate,activeProject}=useStudioStore();
  const visible=entered&&section!=='home';
  const [animationKey,setAnimationKey]=useState(0);
  useEffect(()=>{setAnimationKey(k=>k+1)},[section,activeProject]);
  if(!visible)return null;
  return <section className="content-panel" aria-label={`${section} information`}>
    <div className="panel-toolbar"><span>THE ARCHITECT&apos;S STUDIO <span className="toolbar-slash">/</span> {section.toUpperCase()}</span><button onClick={()=>navigate('home')} aria-label="Close panel and return to studio"><X size={19}/></button></div>
    <div className="panel-scroll" key={animationKey}>
      {section==='about'&&<About/>}
      {section==='projects'&&<Projects/>}
      {section==='lab'&&<Lab/>}
      {section==='experience'&&<Experience/>}
      {section==='skills'&&<Skills/>}
      {section==='contact'&&<Contact/>}
      <div className="panel-end"><span>U.J.O. / PORTFOLIO 2026</span><span>✳</span></div>
    </div>
  </section>;
}
