import { create } from "zustand";

export type Section =
  | "home"
  | "about"
  | "projects"
  | "lab"
  | "experience"
  | "skills"
  | "contact";
export type Station = "overview" | "laptop" | "chair";

type StudioState = {
  entered: boolean;
  section: Section;
  activeProject: string | null;
  hovered: string | null;
  nightMode: boolean;
  quality: "high" | "low";
  station: Station;
  focusStation: (station: Station) => void;
  enter: (section?: Section) => void;
  navigate: (section: Section) => void;
  openProject: (id: string) => void;
  setHovered: (id: string | null) => void;
  toggleMood: () => void;
  setQuality: (quality: "high" | "low") => void;
};

export const useStudioStore = create<StudioState>((set) => ({
  entered: false,
  section: "home",
  activeProject: null,
  hovered: null,
  nightMode: false,
  quality: "low",
  station: "overview",
  focusStation: (station) => set({ station, section: "home", hovered: null }),
  enter: (section = "home") =>
    set({ entered: true, section, activeProject: null }),
  navigate: (section) => set({ section, activeProject: null }),
  openProject: (id) => set({ section: "projects", activeProject: id }),
  setHovered: (hovered) => set({ hovered }),
  toggleMood: () => set((s) => ({ nightMode: !s.nightMode })),
  setQuality: (quality) => set({ quality }),
}));
