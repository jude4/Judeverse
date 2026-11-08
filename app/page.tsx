import StudioApp from '@/components/StudioApp';
import { projects } from '@/data/portfolio';

// This HTML remains crawlable even though the immersive studio is client-rendered.
export default function Page() {
  return <>
    <StudioApp />
    <section className="sr-only" aria-label="Portfolio information for search engines">
      <h1>Ufuoma Jude Onohwosafe — Senior Software Engineer and AI Developer</h1>
      <p>Based in Bucharest, Romania. Eight years of software engineering experience in full-stack systems, backend architecture, financial technology and intelligent software.</p>
      <h2>Featured projects</h2>
      {projects.map(p => <article key={p.id}><h3>{p.title}</h3><p>{p.summary}</p>{p.url && <a href={p.url}>{p.title} website</a>}</article>)}
      <h2>Education</h2><p>MSc Artificial Intelligence — POLITEHNICA Bucharest, 2025–Present. BSc Computer Science — University of Benin, 2015–2019.</p>
      <p>Contact: <a href="mailto:judeufuomao@gmail.com">judeufuomao@gmail.com</a></p>
    </section>
  </>;
}
