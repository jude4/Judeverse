'use client';

import './studio.css';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Github, Linkedin, Mail, Menu, Moon, MoveUpRight, Sun, X, Zap } from 'lucide-react';
import { useStudioStore, type Section } from '@/store/useStudioStore';
import ContentPanel from '@/components/ui/ContentPanel';
import SceneErrorBoundary from '@/components/scene/SceneErrorBoundary';

const StudioCanvas = dynamic(() => import('@/components/scene/StudioCanvas'), {
  ssr: false,
  loading: () => <div className="canvas-fallback"><div className="loading-ring"/><p>PREPARING THE STUDIO</p></div>
});

const nav: { id: Section; label: string; index: string }[] = [
  { id: 'home', label: 'Studio', index: '01' },
  { id: 'about', label: 'About', index: '02' },
  { id: 'projects', label: 'Projects', index: '03' },
  { id: 'lab', label: 'AI lab', index: '04' },
  { id: 'experience', label: 'Experience', index: '05' },
  { id: 'skills', label: 'Expertise', index: '06' },
  { id: 'contact', label: 'Contact', index: '07' }
];

export default function StudioApp() {
  const { entered, enter, section, navigate, hovered, nightMode, toggleMood, quality, setQuality } = useStudioStore();
  const [mobileNav, setMobileNav] = useState(false);
  const [sceneError, setSceneError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [show2D, setShow2D] = useState(false);

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(m.matches);
    apply(); m.addEventListener('change', apply);
    return () => m.removeEventListener('change', apply);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { navigate('home'); setMobileNav(false); } };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const go = (destination: Section) => { if (!entered) enter(destination); else navigate(destination); setMobileNav(false); };

  return (
    <main className={`studio-app ${entered ? 'has-entered' : ''} ${section !== 'home' ? 'panel-open' : ''} ${show2D ? 'flat-mode' : ''}`}>
      <div className="canvas-wrap" aria-hidden="true">
        {!show2D && !sceneError ? <SceneErrorBoundary onError={() => setSceneError(true)}><StudioCanvas onError={() => setSceneError(true)} reducedMotion={reducedMotion} /></SceneErrorBoundary> :
          <div className="fallback-art"><div className="fallback-glow"/><div className="fallback-grid"/><span>THE ARCHITECT&apos;S STUDIO</span></div>}
      </div>
      <div className="vignette" aria-hidden="true" />
      <header className="topbar">
        <button className="brand" onClick={() => go('home')} aria-label="Go to studio home">
          <span className="brand-mark">UJ<span className="brand-point">.</span></span>
          <span className="brand-copy">THE ARCHITECT&apos;S<br/>STUDIO</span>
        </button>
        <span className="topbar-center"><span className="status-light"/> OPEN TO EXPLORATION <span className="topbar-divider">/</span> BUCHAREST, RO</span>
        <div className="topbar-right">
          <button className="icon-button quality-toggle" title="Toggle studio light" onClick={toggleMood} aria-label={nightMode ? 'Switch to warm studio lighting' : 'Switch to cool night lighting'}>{nightMode ? <Moon size={17}/> : <Sun size={17}/>}</button>
          <button className="menu-toggle" onClick={() => setMobileNav(s => !s)} aria-label="Toggle navigation">{mobileNav ? <X size={19}/> : <Menu size={19}/>}</button>
          <span className="build-label">PORTFOLIO / 2026</span>
        </div>
      </header>

      {!entered && <section className="intro" aria-label="Welcome to the studio">
        <div className="intro-eyebrow"><span className="eyebrow-line"/> A DIFFERENT WAY TO EXPLORE MY WORK <span className="intro-star">✦</span></div>
        <p className="intro-outline">ENGINEER <span className="intro-outline-amp">&</span> CREATOR</p>
        <h1 className="intro-title">Designing<br/><em>what&apos;s next.</em></h1>
        <p className="intro-description">Hi, I&apos;m <strong>Ufuoma Jude Onohwosafe.</strong><br/>Senior software engineer exploring the intersection of intelligent systems, digital craftsmanship, and creative technology.</p>
        <div className="intro-actions">
          <button className="primary-cta" onClick={() => enter('home')}>ENTER THE STUDIO <ArrowUpRight size={18}/></button>
          <button className="text-cta" onClick={() => enter('projects')}>SKIP TO WORK <ArrowRight size={17}/></button>
        </div>
        <div className="intro-foot"><span>EST. IN CURIOSITY</span><span>SCROLL LESS. EXPLORE MORE.</span><ArrowDownRight size={19}/></div>
      </section>}

      {entered && <>
        <nav className={`side-nav ${mobileNav ? 'is-open' : ''}`} aria-label="Main portfolio navigation">
          <div className="nav-heading">EXPLORE / 07</div>
          {nav.map(item => <button key={item.id} className={`nav-item ${section === item.id ? 'active' : ''}`} onClick={() => go(item.id)}>
            <span className="nav-index">{item.index}</span><span className="nav-name">{item.label}</span>{section === item.id && <span className="nav-dot"/>}
          </button>)}
        </nav>
        <div className="scene-caption"><span className="caption-cross">✳</span> INTERACTIVE SPACE <span className="caption-sep">—</span> {section === 'home' ? 'SELECT AN OBJECT OR USE THE MENU' : section.toUpperCase()}</div>
        {section === 'home' && <div className="home-prompt"><div className="home-prompt-line"/><span>01 / THE WORKSPACE</span><h2>Beyond<br/>the code<span>.</span></h2><p>An engineer&apos;s space. A collection of ideas.<br/>Find something interesting and take a closer look.</p><button onClick={() => go('projects')}>DISCOVER MY WORK <ArrowUpRight size={17}/></button></div>}
        <ContentPanel />
        <div className="bottom-bar"><span className="bottom-coordinates">51° 24&apos; N &nbsp; / &nbsp; 3D PORTFOLIO</span>
          <div className="bottom-controls"><button onClick={() => setShow2D(s=>!s)}>{show2D ? 'ENABLE 3D' : '2D MODE'}</button><span className="bottom-sep"/><button onClick={() => setQuality(quality === 'high' ? 'low' : 'high')}>QUALITY: {quality.toUpperCase()}</button></div>
          <span className="bottom-hint"><span className="sparkle-dot">✦</span> {hovered ? `EXPLORE ${hovered.toUpperCase()}` : 'CLICK GLOWING OBJECTS TO EXPLORE'}</span>
        </div>
      </>}
      <div className="side-watermark" aria-hidden="true">BUILT WITH CURIOSITY · THREE.JS · REACT</div>
      {!entered && <div className="intro-socials"><a href="https://github.com/jude4" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={17}/></a><a href="https://www.linkedin.com/in/jude-onohwosafe" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={17}/></a><a href="mailto:judeufuomao@gmail.com" aria-label="Email"><Mail size={17}/></a></div>}
      {(sceneError || show2D) && <div className="mode-note"><Zap size={15}/>{sceneError ? '3D is not available on this device. Portfolio navigation is still available.' : 'Lightweight view enabled.'}{!entered && <button onClick={() => enter('projects')}>Explore work <MoveUpRight size={13}/></button>}</div>}
      {!entered && <span className="intro-side-note">A DIGITAL SPACE BY U.J.O.</span>}
      {mobileNav && <button aria-label="Close navigation overlay" className="mobile-backdrop" onClick={() => setMobileNav(false)}/>}
    </main>
  );
}
