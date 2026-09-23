import type { CSSProperties } from "react";

import type { CarouselSlide } from "@/lib/carousel-types";

export type ThemeId =
  | "brutalist"
  | "minimal"
  | "neon"
  | "pastel"
  | "editorial"
  | "glass"
  | "bauhaus"
  | "mono"
  | "y2k"
  | "nature"
  | "luxury"
  | "risograph"
  | "blueprint"
  | "memphis"
  | "cinematic";

export type ThemeCustomization = {
  accent: string;
  background: string;
  text: string;
  font: string;
};

export const fontOptions = [
  { label: "Space Grotesk", value: "Space Grotesk" },
  { label: "DM Sans", value: "DM Sans" },
  { label: "Fraunces", value: "Fraunces" },
  { label: "Cormorant", value: "Cormorant Garamond" },
  { label: "Archivo Black", value: "Archivo Black" },
  { label: "Syne", value: "Syne" },
  { label: "IBM Plex Mono", value: "IBM Plex Mono" },
  { label: "Playfair Display", value: "Playfair Display" },
  { label: "Bebas Neue", value: "Bebas Neue" },
  { label: "Manrope", value: "Manrope" },
] as const;

export const themes: Array<{
  id: ThemeId;
  label: string;
  detail: string;
  customization: ThemeCustomization;
}> = [
  { id: "brutalist", label: "Bold", detail: "Brutalist", customization: { accent: "#c7f36b", background: "#f7f5ef", text: "#171717", font: "Space Grotesk" } },
  { id: "minimal", label: "Quiet", detail: "Minimal", customization: { accent: "#a8a29e", background: "#f4f0e8", text: "#292524", font: "DM Sans" } },
  { id: "neon", label: "Pulse", detail: "Neon", customization: { accent: "#56f59a", background: "#111116", text: "#f5f5f4", font: "Space Grotesk" } },
  { id: "pastel", label: "Soft", detail: "Pastel", customization: { accent: "#c8b6ff", background: "#ff8d75", text: "#211d2a", font: "Manrope" } },
  { id: "editorial", label: "Mode", detail: "Editorial", customization: { accent: "#d44d36", background: "#f8f3e8", text: "#171717", font: "Fraunces" } },
  { id: "glass", label: "Aura", detail: "Glass", customization: { accent: "#8ef7d0", background: "#26385c", text: "#ffffff", font: "Manrope" } },
  { id: "bauhaus", label: "Form", detail: "Bauhaus", customization: { accent: "#ef3f32", background: "#f1e9d2", text: "#111111", font: "Archivo Black" } },
  { id: "mono", label: "System", detail: "Monospace", customization: { accent: "#d9ff3f", background: "#e8e8e3", text: "#101010", font: "IBM Plex Mono" } },
  { id: "y2k", label: "Chrome", detail: "Y2K", customization: { accent: "#ff5fcf", background: "#c6dbff", text: "#16172c", font: "Syne" } },
  { id: "nature", label: "Field", detail: "Organic", customization: { accent: "#d4e678", background: "#355343", text: "#f8f1dc", font: "Cormorant Garamond" } },
  { id: "luxury", label: "Noir", detail: "Luxury", customization: { accent: "#d6b56d", background: "#161412", text: "#f1e9da", font: "Playfair Display" } },
  { id: "risograph", label: "Print", detail: "Risograph", customization: { accent: "#ff4e38", background: "#f4df9a", text: "#1647a3", font: "Syne" } },
  { id: "blueprint", label: "Grid", detail: "Blueprint", customization: { accent: "#8dd7ff", background: "#173e76", text: "#f2f8ff", font: "IBM Plex Mono" } },
  { id: "memphis", label: "Pop", detail: "Memphis", customization: { accent: "#ffda31", background: "#f36f65", text: "#162e46", font: "Bebas Neue" } },
  { id: "cinematic", label: "Frame", detail: "Cinematic", customization: { accent: "#f1523f", background: "#16100e", text: "#f3e7d3", font: "Cormorant Garamond" } },
];

type ThemeProps = {
  slide: CarouselSlide;
  index: number;
  total: number;
  platform: string;
  customization: ThemeCustomization;
};

function styleFor(customization: ThemeCustomization) {
  return {
    "--slide-accent": customization.accent,
    "--slide-bg": customization.background,
    "--slide-text": customization.text,
    "--slide-font": `"${customization.font}"`,
  } as CSSProperties;
}

function Copy({ slide }: { slide: CarouselSlide }) {
  if (slide.kind === "content") {
    return <><h3 className="carousel-title">{slide.title}</h3><p className="carousel-body">{slide.body}</p></>;
  }
  return <h3 className="carousel-title">{slide.text}</h3>;
}

function Chrome({ index, total, platform }: Omit<ThemeProps, "slide" | "customization">) {
  return <><span className="slide-brand"><i aria-hidden="true" /> SLIDR®</span><span className="slide-platform">{platform}</span><span className="slide-progress">{index + 1}/{total}</span></>;
}

function Canvas({ theme, props, children }: { theme: ThemeId; props: ThemeProps; children?: React.ReactNode }) {
  return (
    <div className={`slide-canvas theme-${theme}`} style={styleFor(props.customization)}>
      <Chrome {...props} />{children}
      <div className="slide-copy"><Copy slide={props.slide} /></div>
    </div>
  );
}

export function BoldBrutalist(props: ThemeProps) {
  return <Canvas theme="brutalist" props={props}><div className="brutal-mark">S/{String(props.index + 1).padStart(2, "0")}</div>{props.slide.kind === "content" && <span className="slide-number">0{props.slide.number}</span>}<div className="brutal-rule" /></Canvas>;
}
export function CleanMinimal(props: ThemeProps) {
  return <Canvas theme="minimal" props={props}><div className="minimal-rule" /><span className="minimal-edition">STUDIO NOTES · VOL 01</span>{props.slide.kind === "content" && <span className="slide-number">{String(props.slide.number).padStart(2, "0")}</span>}<span className="minimal-note">Thoughts worth saving.</span></Canvas>;
}
export function DarkNeon(props: ThemeProps) {
  return <Canvas theme="neon" props={props}><div className="neon-frame" /><div className="neon-grid" />{props.slide.kind === "content" && <span className="slide-number">{String(props.slide.number).padStart(2, "0")}</span>}<span className="neon-signal">● LIVE SIGNAL</span></Canvas>;
}
export function SoftPastel(props: ThemeProps) {
  return <Canvas theme="pastel" props={props}><div className="pastel-label">FIELD NOTE / {String(props.index + 1).padStart(2, "0")}</div><div className="pastel-card" />{props.slide.kind === "content" && <span className="slide-number">{props.slide.number}</span>}</Canvas>;
}
export function Editorial(props: ThemeProps) {
  return <Canvas theme="editorial" props={props}><div className="editorial-header"><span>THE SLIDR REVIEW</span><span>IDEAS / CULTURE / WORK</span></div>{props.slide.kind === "content" && <span className="slide-number">{String(props.slide.number).padStart(2, "0")}</span>}<div className="editorial-rule" /></Canvas>;
}
export function GlassAura(props: ThemeProps) {
  return <Canvas theme="glass" props={props}><div className="glass-orbit glass-orbit-one" /><div className="glass-orbit glass-orbit-two" /><div className="glass-panel" /><span className="glass-kicker">A NEW PERSPECTIVE</span>{props.slide.kind === "content" && <span className="slide-number">0{props.slide.number}</span>}</Canvas>;
}
export function Bauhaus(props: ThemeProps) {
  return <Canvas theme="bauhaus" props={props}><div className="bauhaus-circle" /><div className="bauhaus-square" /><div className="bauhaus-line" />{props.slide.kind === "content" && <span className="slide-number">{props.slide.number}</span>}</Canvas>;
}
export function MonoSystem(props: ThemeProps) {
  return <Canvas theme="mono" props={props}><div className="mono-window"><span>SLIDR_OUTPUT.TXT</span><i /><i /><i /></div><div className="mono-scan" />{props.slide.kind === "content" && <span className="slide-number">[{String(props.slide.number).padStart(2, "0")}]</span>}<span className="mono-command">READY_FOR_INPUT ›</span></Canvas>;
}
export function ChromeY2K(props: ThemeProps) {
  return <Canvas theme="y2k" props={props}><div className="y2k-star">✦</div><div className="y2k-disc" /><div className="y2k-pill">FUTURE FILE™</div>{props.slide.kind === "content" && <span className="slide-number">#{props.slide.number}</span>}</Canvas>;
}
export function OrganicField(props: ThemeProps) {
  return <Canvas theme="nature" props={props}><div className="nature-sun" /><div className="nature-leaf nature-leaf-one" /><div className="nature-leaf nature-leaf-two" />{props.slide.kind === "content" && <span className="slide-number">Chapter {props.slide.number}</span>}<span className="nature-note">Notes from the field</span></Canvas>;
}
export function NoirLuxury(props: ThemeProps) {
  return <Canvas theme="luxury" props={props}><div className="luxury-frame" /><span className="luxury-monogram">S</span>{props.slide.kind === "content" && <span className="slide-number">No. {String(props.slide.number).padStart(2, "0")}</span>}<span className="luxury-note">PRIVATE EDITION</span></Canvas>;
}
export function Risograph(props: ThemeProps) {
  return <Canvas theme="risograph" props={props}><div className="riso-disc" /><div className="riso-block" /><div className="riso-noise" />{props.slide.kind === "content" && <span className="slide-number">{props.slide.number}</span>}<span className="riso-note">PRINT / SHARE / REPEAT</span></Canvas>;
}
export function Blueprint(props: ThemeProps) {
  return <Canvas theme="blueprint" props={props}><div className="blueprint-grid" /><div className="blueprint-corner" />{props.slide.kind === "content" && <span className="slide-number">FIG. {String(props.slide.number).padStart(2, "0")}</span>}<span className="blueprint-note">IDEA CONSTRUCTION PLAN</span></Canvas>;
}
export function Memphis(props: ThemeProps) {
  return <Canvas theme="memphis" props={props}><div className="memphis-squiggle">∿∿</div><div className="memphis-triangle" /><div className="memphis-dots" />{props.slide.kind === "content" && <span className="slide-number">{props.slide.number}!</span>}<span className="memphis-note">GOOD IDEAS ONLY</span></Canvas>;
}
export function Cinematic(props: ThemeProps) {
  return <Canvas theme="cinematic" props={props}><div className="cinema-bars" /><span className="cinema-timecode">00:{String(props.index + 1).padStart(2, "0")}:24</span>{props.slide.kind === "content" && <span className="slide-number">SCENE {String(props.slide.number).padStart(2, "0")}</span>}<span className="cinema-note">A SLIDR ORIGINAL</span></Canvas>;
}

export const themeComponents: Record<ThemeId, (props: ThemeProps) => React.JSX.Element> = {
  brutalist: BoldBrutalist, minimal: CleanMinimal, neon: DarkNeon, pastel: SoftPastel, editorial: Editorial,
  glass: GlassAura, bauhaus: Bauhaus, mono: MonoSystem, y2k: ChromeY2K, nature: OrganicField,
  luxury: NoirLuxury, risograph: Risograph, blueprint: Blueprint, memphis: Memphis, cinematic: Cinematic,
};