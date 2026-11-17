"use client";

import "./studio.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Armchair,
  Laptop,
  Layers3,
  Lightbulb,
  MoveLeft,
  RotateCcw,
} from "lucide-react";
import { useStudioStore, type Section } from "@/store/useStudioStore";
import ContentPanel from "@/components/ui/ContentPanel";
import SceneErrorBoundary from "@/components/scene/SceneErrorBoundary";

const StudioCanvas = dynamic(() => import("@/components/scene/StudioCanvas"), {
  ssr: false,
  loading: () => (
    <div className="canvas-fallback">
      <div className="loading-ring" />
      <p>ARRANGING THE WORKSPACE</p>
    </div>
  ),
});
const navigation: { id: Section; label: string }[] = [
  { id: "projects", label: "Selected work" },
  { id: "about", label: "About me" },
  { id: "lab", label: "AI lab" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Expertise" },
  { id: "contact", label: "Contact" },
];

export default function StudioApp() {
  const {
    section,
    navigate,
    station,
    focusStation,
    nightMode,
    toggleMood,
    quality,
    setQuality,
  } = useStudioStore();
  const [sceneError, setSceneError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [show2D, setShow2D] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);
  const panelOpen = section !== "home";
  const isFlat = show2D || sceneError;
  const heading =
    station === "laptop"
      ? "A closer look."
      : station === "chair"
        ? "Pull up a chair."
        : "Where ideas\ntake shape.";
  return (
    <div
      className={`studio-app atelier has-entered ${panelOpen ? "panel-open" : ""} ${nightMode ? "atelier-night" : ""}`}
    >
      <div className="canvas-wrap" aria-hidden="true">
        {!isFlat ? (
          <SceneErrorBoundary onError={() => setSceneError(true)}>
            <StudioCanvas
              onError={() => setSceneError(true)}
              reducedMotion={reducedMotion}
            />
          </SceneErrorBoundary>
        ) : (
          <div className="atelier-fallback">
            <Layers3 size={64} strokeWidth={0.6} />
            <p>A little space for big ideas.</p>
          </div>
        )}
      </div>
      <header className="atelier-header">
        <button
          className="atelier-brand"
          onClick={() => focusStation("overview")}
          aria-label="Reset studio view"
        >
          jude<span>.</span>
          <small>THE WORKSPACE</small>
        </button>
        <div className="atelier-edition">
          <span /> INTERACTIVE EDITION <i>/</i> 01
        </div>
        <button
          className="atelier-light"
          onClick={toggleMood}
          aria-pressed={nightMode}
        >
          <Lightbulb size={16} />
          {nightMode ? "Evening" : "Daylight"}
        </button>
      </header>
      {!panelOpen && (
        <section className="atelier-intro" aria-label="Explore the workspace">
          <p className="atelier-eyebrow">A SPACE TO THINK & BUILD</p>
          <h1>{heading}</h1>
          <p>
            {station === "laptop"
              ? "From a first idea to a product people use. Open the work behind the screen."
              : station === "chair"
                ? "A software engineer, a curious mind, and a little room for the unexpected."
                : "Make yourself at home. Open the laptop, take a seat, or change the light."}
          </p>
          <button
            className="atelier-link"
            onClick={() => navigate(station === "chair" ? "about" : "projects")}
          >
            {station === "chair"
              ? "Meet the engineer"
              : "Explore selected work"}
            <ArrowUpRight size={18} />
          </button>
          {station !== "overview" && (
            <button
              className="atelier-reset"
              onClick={() => focusStation("overview")}
            >
              <MoveLeft size={14} /> Back to the room
            </button>
          )}
        </section>
      )}
      <nav className="atelier-stations" aria-label="Workspace objects">
        <span>TAKE A CLOSER LOOK</span>
        <button
          onClick={() => focusStation("laptop")}
          aria-pressed={station === "laptop"}
        >
          <Laptop size={19} />
          <span>
            <small>01</small> Open the laptop
          </span>
          <ArrowUpRight size={15} />
        </button>
        <button
          onClick={() => focusStation("chair")}
          aria-pressed={station === "chair"}
        >
          <Armchair size={19} />
          <span>
            <small>02</small> Take a seat
          </span>
          <ArrowUpRight size={15} />
        </button>
        <button onClick={toggleMood} aria-pressed={nightMode}>
          <Lightbulb size={19} />
          <span>
            <small>03</small> Change the light
          </span>
          <ArrowUpRight size={15} />
        </button>
      </nav>
      <nav className="atelier-navigation" aria-label="Studio content">
        {navigation.map((item) => (
          <button
            key={item.id}
            aria-current={section === item.id ? "page" : undefined}
            onClick={() => navigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <ContentPanel />
      <footer className="atelier-footer">
        <span className="atelier-location">
          BUCHAREST, RO <i>·</i> AN ENGINEER&apos;S CORNER
        </span>
        <div>
          <button
            onClick={() => focusStation("overview")}
            aria-label="Reset camera"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => setQuality(quality === "high" ? "low" : "high")}
          >
            {quality === "low" ? "Eco" : "Detail"} quality
          </button>
          <button disabled={sceneError} onClick={() => setShow2D(!show2D)}>
            {sceneError ? "3D unavailable" : show2D ? "Enable 3D" : "2D view"}
          </button>
        </div>
      </footer>
      {isFlat && (
        <p className="atelier-mode" role="status">
          {sceneError
            ? "3D is unavailable on this device."
            : "Lightweight view."}{" "}
          Explore everything using the controls.
        </p>
      )}
    </div>
  );
}
