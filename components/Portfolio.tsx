"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Github,
  Globe2,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  MoveUpRight,
  Sparkles,
  X,
} from "lucide-react";
import {
  projects,
  skillGroups,
  socialLinks,
  type Project,
} from "@/data/portfolio";
import { assetPath, education, experience, resumePath } from "@/data/career";
import { useStudioStore } from "@/store/useStudioStore";

const Studio = dynamic(() => import("@/components/StudioApp"), {
  ssr: false,
  loading: () => (
    <div className="pf-studio-loading">Preparing the interactive studio…</div>
  ),
});
const NeuralDemo = dynamic(() => import("@/components/demos/NeuralDemo"), {
  loading: () => <p>Loading neural network demo…</p>,
});
const PSODemo = dynamic(() => import("@/components/demos/PSODemo"), {
  loading: () => <p>Loading swarm simulation…</p>,
});
const professional = projects.filter((p) => p.featured);
const filters = [
  "All work",
  "Payments & fintech",
  "Travel",
  "Product engineering",
  "Three.js",
] as const;
type Filter = (typeof filters)[number];

function ProjectVisual({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  if (project.image) {
    return (
      <div className={`pf-project-visual pf-project-screenshot ${compact ? "pf-visual-small" : ""}`}>
        <Image
          src={assetPath(project.image)}
          alt={`${project.title} website screenshot`}
          width="1440"
          height="1000"
          loading="lazy"
        />
      </div>
    );
  }
  const words: Record<string, [string, string, string]> = {
    flynt: ["Request", "Idempotency", "Process once"],
    tiqwa: ["Search", "Supplier APIs", "Booking"],
    beezlinq: ["Profile", "Digital card", "Share"],
    utilify: ["Payment", "Queue + webhook", "Confirmed"],
    cardplot: ["Wallet", "Transaction", "Transfer"],
    atravelikes: ["Explore", "Connect", "Discover"],
  };
  return (
    <div
      className={`pf-project-visual pf-tone-${project.theme} ${compact ? "pf-visual-small" : ""}`}
      aria-hidden="true"
    >
      <div className="pf-visual-top">
        <span>
          <i /> {project.title.toUpperCase()}
        </span>
        <span>{project.number} / SELECTED WORK</span>
      </div>
      <div className="pf-visual-name">
        {project.title}
        <span>
          <ArrowUpRight size={34} strokeWidth={1} />
        </span>
      </div>
      <div className="pf-visual-flow">
        {(words[project.id] || ["Idea", "Engineering", "Experience"]).map(
          (word, i) => (
            <span key={word}>
              {i > 0 && <ArrowRight size={14} />}
              <b>{word}</b>
            </span>
          ),
        )}
      </div>
      <div className="pf-visual-bottom">
        <span>{project.category}</span>
        <span>PROJECT OVERVIEW</span>
      </div>
    </div>
  );
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="pf-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="project-title"
    >
      <div className="pf-dialog-bar">
        <span>SELECTED WORK / {project.number}</span>
        <button autoFocus onClick={onClose} aria-label="Close project">
          <X size={21} />
        </button>
      </div>
      <div className="pf-dialog-content">
        <ProjectVisual project={project} compact />
        <p className="pf-eyebrow">{project.category}</p>
        <h2 id="project-title">{project.title}</h2>
        <p className="pf-dialog-lead">{project.summary}</p>
        <h3>The product</h3>
        <p>{project.description}</p>
        <h3>My contribution</h3>
        <p>{project.contribution}</p>
        {project.stack.length > 0 && (
          <div className="pf-tags">
            {project.stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        )}
        {project.url && (
          <>
            <div className="pf-dialog-actions">
              <a
                className="pf-button pf-button-light"
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open live website <ExternalLink size={16} />
              </a>
              {project.embeddedPreview !== false && (
                <button
                  className="pf-button pf-button-outline"
                  onClick={() => setPreview(!preview)}
                >
                  {preview ? "Hide website preview" : "Preview here"}{" "}
                  <Globe2 size={16} />
                </button>
              )}
            </div>
            {project.embeddedPreview === false && (
              <p>Explore {project.title} using “Open live website” above.</p>
            )}
            {preview && project.embeddedPreview !== false && (
              <div className="pf-site-preview">
                <p>
                  Some websites prevent embedding or require a separate sign-in.
                  If the preview is blank, use “Open live website”.
                </p>
                <iframe
                  title={`${project.title} live website`}
                  src={project.url}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
              </div>
            )}
          </>
        )}
        {!project.url && (
          <a className="pf-text-link" href={socialLinks.email}>
            Ask me about this project <ArrowUpRight size={16} />
          </a>
        )}
      </div>
    </dialog>
  );
}

export default function Portfolio() {
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState<Filter>("All work");
  const [project, setProject] = useState<Project | null>(null);
  const [studio, setStudio] = useState(false);
  const [demo, setDemo] = useState<"neural" | "swarm" | null>(null);
  const [copied, setCopied] = useState(false);
  const studioDialog = useRef<HTMLDialogElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  useEffect(() => {
    if (!studio) return;
    const previous = document.activeElement as HTMLElement | null;
    studioDialog.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [studio]);
  const openStudio = () => {
    useStudioStore.getState().setQuality("low");
    setStudio(true);
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("judeufuomao@gmail.com");
      setCopied(true);
      copyTimer.current = setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = socialLinks.email;
    }
  };
  const filtered = professional.filter(
    (p) =>
      filter === "All work" ||
      (filter === "Payments & fintech" &&
        ["flynt", "utilify", "cardplot"].includes(p.id)) ||
      (filter === "Travel" && ["tiqwa", "atravelikes"].includes(p.id)) ||
      (filter === "Product engineering" && p.id === "beezlinq") ||
      (filter === "Three.js" && p.threejs),
  );
  return (
    <div className="pf-site">
      <a className="pf-skip" href="#main">
        Skip to content
      </a>
      <header className="pf-header">
        <div className="pf-container pf-header-inner">
          <a
            className="pf-brand"
            href="#"
            aria-label="jude. Engineer & builder — home"
          >
            jude<span>.</span>
            <span className="pf-brand-note">ENGINEER & BUILDER</span>
          </a>
          <nav
            className={menu ? "pf-nav pf-nav-open" : "pf-nav"}
            aria-label="Main navigation"
            id="portfolio-nav"
          >
            {["Work", "Experience", "About"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={() => setMenu(false)}
              >
                {label}
              </a>
            ))}
            <a
              className="pf-nav-contact"
              href="#contact"
              onClick={() => setMenu(false)}
            >
              Let’s talk <ArrowUpRight size={16} />
            </a>
          </nav>
          <button
            className="pf-menu"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            aria-controls="portfolio-nav"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        <section className="pf-hero pf-container" aria-labelledby="hero-title">
          <div className="pf-hero-copy">
            <p className="pf-eyebrow">
              <span className="pf-dot" /> BASED IN BUCHAREST, ROMANIA
            </p>
            <h1 id="hero-title">
              Thoughtful code.
              <br />
              Dependable systems.
              <br />
              <em>Real-world impact.</em>
            </h1>
            <p className="pf-hero-intro">
              I’m <strong>Ufuoma Jude Onohwosafe</strong>, a senior software
              engineer turning complex problems into products people can count
              on.
            </p>
            <p className="pf-hero-description">
              8 years building across fintech, payments and travel.
              <br className="pf-desktop-break" /> Backend depth. Full-stack
              perspective. A curiosity for AI.
            </p>
            <div className="pf-hero-actions">
              <a className="pf-button pf-button-light" href="#work">
                Explore my work <ArrowDownRight size={19} />
              </a>
              <a
                className="pf-button pf-resume-link"
                href={resumePath}
                target="_blank"
                rel="noopener noreferrer"
              >
                View résumé <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="pf-hero-links">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a href={socialLinks.email} aria-label="Email Jude">
                <Mail size={18} />
              </a>
              <span className="pf-small-rule" />
              <span>LET’S BUILD SOMETHING THAT MATTERS.</span>
            </div>
          </div>
          <div className="pf-portrait-wrap">
            <div className="pf-portrait-frame">
              {/* Pre-sized responsive local image avoids layout shifts and runtime image services. */}
              <picture>
                <source
                  type="image/avif"
                  srcSet={`${assetPath("/assets/portrait/jude-480.avif")} 480w, ${assetPath("/assets/portrait/jude-800.avif")} 800w`}
                  sizes="(max-width: 700px) min(76vw, 260px), 360px"
                />
                <img
                  className="pf-portrait"
                  src={assetPath("/assets/portrait/jude-800.webp")}
                  srcSet={`${assetPath("/assets/portrait/jude-480.webp")} 480w, ${assetPath("/assets/portrait/jude-800.webp")} 800w`}
                  sizes="(max-width: 700px) min(76vw, 260px), 360px"
                  width="800"
                  height="1000"
                  alt="Ufuoma Jude Onohwosafe, senior software engineer"
                  fetchPriority="high"
                />
              </picture>
            </div>
            <div className="pf-portrait-label">
              <Code2 size={16} />
              <span>
                ENGINEER BY PRACTICE.
                <br />
                BUILDER BY NATURE.
              </span>
            </div>
            <span className="pf-portrait-coordinate">
              44.4268° N · 26.1025° E
            </span>
          </div>
        </section>
        <div className="pf-proof pf-container">
          <p>
            BUILT WITH PURPOSE.
            <br />
            <strong>SHIPPED WITH CARE.</strong>
          </p>
          <div>
            <strong>
              08<span> years</span>
            </strong>
            <span>PRODUCTION EXPERIENCE</span>
          </div>
          <div>
            <strong>
              API<span> → UI</span>
            </strong>
            <span>END-TO-END ENGINEERING</span>
          </div>
          <div>
            <strong>
              MSc<span> in progress</span>
            </strong>
            <span>ARTIFICIAL INTELLIGENCE</span>
          </div>
        </div>
        <section
          className="pf-section pf-container"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="pf-section-top">
            <p className="pf-eyebrow">01 / SELECTED WORK</p>
            <span className="pf-section-note">
              FROM INTEGRATION TO INTERFACE
            </span>
          </div>
          <div className="pf-section-heading">
            <h2 id="work-title">
              Built for the <em>real world.</em>
            </h2>
            <p>
              A selection of products I’ve helped build.
              <br />
              Explore the work, and the engineering behind it.
            </p>
          </div>
          <div className="pf-filters" role="group" aria-label="Filter projects">
            {filters.map((f) => (
              <button
                key={f}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
                {filter === f && <ArrowUpRight size={12} />}
              </button>
            ))}
          </div>
          <div className="pf-project-grid" aria-live="polite">
            {filtered.map((p) => (
              <article className="pf-project-card" key={p.id}>
                <div className="pf-project-overview">
                  <ProjectVisual project={p} />
                  <div className="pf-project-copy">
                    <div className="pf-project-title">
                      <h3 id={`project-name-${p.id}`}>{p.title}</h3>
                      <span className="pf-round-arrow">
                        <ArrowUpRight size={21} />
                      </span>
                    </div>
                    <p>{p.summary}</p>
                    <div className="pf-card-bottom">
                      <span>{p.category}</span>
                      <button
                        className="pf-project-open"
                        aria-label={`Explore project: ${p.title}`}
                        onClick={() => setProject(p)}
                      >
                        EXPLORE PROJECT <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="pf-work-footnote">
            Professional contributions and personal Three.js projects. Open a
            project to see my role or explore the live experience.
          </p>
        </section>
        <section
          className="pf-experience-section"
          id="experience"
          aria-labelledby="experience-title"
        >
          <div className="pf-container pf-experience-layout">
            <div className="pf-experience-intro">
              <p className="pf-eyebrow">02 / EXPERIENCE</p>
              <h2 id="experience-title">
                A career of
                <br />
                <em>building forward.</em>
              </h2>
              <p>
                From my first client applications to production APIs and
                financial workflows. Eight years of learning by shipping.
              </p>
              <a className="pf-text-link" href={resumePath} download>
                Download full résumé <Download size={16} />
              </a>
              <div className="pf-experience-aside">
                <span className="pf-dot" />
                <p>
                  Currently building at
                  <br />
                  <strong>Techies Africa</strong>
                </p>
              </div>
            </div>
            <div className="pf-career">
              {experience.map((job, index) => (
                <details
                  className="pf-job"
                  key={job.company}
                  open={index === 0 ? true : undefined}
                >
                  <summary>
                    <span className="pf-job-number">0{index + 1}</span>
                    <div>
                      <p className="pf-job-date">{job.period}</p>
                      <h3>{job.company}</h3>
                      <p className="pf-job-role">{job.role}</p>
                    </div>
                    <ChevronDown size={20} />
                  </summary>
                  <div className="pf-job-detail">
                    <p className="pf-job-location">{job.location}</p>
                    <h4>{job.focus}</h4>
                    <ul>
                      {job.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                    <div className="pf-tags">
                      {job.stack.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section
          className="pf-section pf-container pf-about"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="pf-about-copy">
            <p className="pf-eyebrow">03 / A LITTLE ABOUT ME</p>
            <h2 id="about-title">
              Depth in the backend.
              <br />
              <em>Curiosity everywhere.</em>
            </h2>
            <p className="pf-about-lead">
              I care about what happens after “it works.”
            </p>
            <p>
              How an API handles a retry. What happens when a supplier fails.
              Whether a database query stays efficient. The details that make a
              system dependable are the parts I enjoy most.
            </p>
            <p>
              I’m a senior software engineer based in Bucharest, with experience
              in PHP/Laravel architecture, full-stack development, third-party
              integrations and production delivery. Alongside engineering, I’m
              pursuing a master’s in Artificial Intelligence.
            </p>
            <div className="pf-education">
              {education.map((e) => (
                <div key={e.title}>
                  <span>{e.period}</span>
                  <strong>{e.title}</strong>
                  <p>{e.school}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pf-toolkit">
            <div className="pf-toolkit-heading">
              <Layers3 size={21} />
              <span>THE TOOLKIT</span>
            </div>
            {skillGroups.slice(0, 3).map((group) => (
              <div className="pf-tool-group" key={group.name}>
                <h3>{group.name}</h3>
                <div className="pf-tags">
                  {group.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
            <div className="pf-tool-group">
              <h3>Testing & reliability</h3>
              <div className="pf-tags">
                {["PHPUnit", "Pest", "Idempotency", "Caching", "CI/CD"].map(
                  (s) => (
                    <span key={s}>{s}</span>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
        <section
          className="pf-play-section pf-container"
          aria-labelledby="play-title"
        >
          <div className="pf-play-copy">
            <p className="pf-eyebrow">
              <Sparkles size={14} /> CURIOSITY, IN PRACTICE
            </p>
            <h2 id="play-title">
              A little room
              <br />
              for <em>experimentation.</em>
            </h2>
            <p>
              Engineering can be expressive, too. Explore a 3D studio or try a
              working AI demonstration.
            </p>
            <button className="pf-text-link" onClick={openStudio}>
              Enter the 3D studio <MoveUpRight size={17} />
            </button>
            <small>
              Optional interactive experience. Loads only when you enter.
            </small>
          </div>
          <div className="pf-lab-picker">
            <button
              onClick={() => setDemo(demo === "neural" ? null : "neural")}
              aria-expanded={demo === "neural"}
            >
              <span className="pf-demo-icon">⌘</span>
              <span>
                <small>01 / NEURAL NETWORKS</small>
                <strong>Look inside a prediction.</strong>
              </span>
              <ArrowUpRight size={21} />
            </button>
            <button
              onClick={() => setDemo(demo === "swarm" ? null : "swarm")}
              aria-expanded={demo === "swarm"}
            >
              <span className="pf-demo-icon">⁙</span>
              <span>
                <small>02 / SWARM INTELLIGENCE</small>
                <strong>Watch a swarm find its way.</strong>
              </span>
              <ArrowUpRight size={21} />
            </button>
            {demo && (
              <div className="pf-live-demo">
                {demo === "neural" ? <NeuralDemo /> : <PSODemo />}
              </div>
            )}
          </div>
        </section>
        <section
          className="pf-contact pf-container"
          id="contact"
          aria-labelledby="contact-title"
        >
          <p className="pf-eyebrow">04 / THE NEXT CHAPTER</p>
          <div className="pf-contact-heading">
            <h2 id="contact-title">
              Good work starts
              <br />
              with a <em>conversation.</em>
            </h2>
            <ArrowDownRight className="pf-contact-arrow" strokeWidth={1} />
          </div>
          <div className="pf-contact-bottom">
            <div>
              <p>
                Have a role, a project, or a difficult engineering problem?
                <br />
                I’d love to hear what you’re building.
              </p>
              <a className="pf-email" href={socialLinks.email}>
                judeufuomao@gmail.com <ArrowUpRight size={23} />
              </a>
              <button className="pf-copy" onClick={copyEmail}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span role="status">
                  {copied ? "Email copied" : "Copy email address"}
                </span>
              </button>
            </div>
            <div className="pf-contact-links">
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn <ArrowUpRight size={17} />
              </a>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <ArrowUpRight size={17} />
              </a>
              <a href={resumePath} target="_blank" rel="noopener noreferrer">
                Résumé <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="pf-footer pf-container">
        <a className="pf-brand" href="#">
          jude<span>.</span>
        </a>
        <p>© {new Date().getFullYear()} Ufuoma Jude Onohwosafe</p>
        <a href="#">
          BACK TO TOP{" "}
          <ArrowDown size={13} style={{ transform: "rotate(180deg)" }} />
        </a>
      </footer>
      {project && (
        <ProjectDialog
          key={project.id}
          project={project}
          onClose={() => setProject(null)}
        />
      )}
      {studio && (
        <dialog
          ref={studioDialog}
          className="pf-studio-overlay"
          aria-label="Interactive 3D portfolio studio"
          onCancel={() => setStudio(false)}
        >
          <Studio />
          <button
            className="pf-studio-back pf-button"
            onClick={() => setStudio(false)}
          >
            <X size={17} /> Back to portfolio
          </button>
        </dialog>
      )}
    </div>
  );
}
