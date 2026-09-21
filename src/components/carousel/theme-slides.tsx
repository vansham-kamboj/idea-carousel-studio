import type { CarouselSlide } from "@/lib/carousel-types";

export type ThemeId = "brutalist" | "minimal" | "neon" | "pastel" | "editorial";

export const themes: Array<{ id: ThemeId; label: string; detail: string }> = [
  { id: "brutalist", label: "Bold", detail: "Brutalist" },
  { id: "minimal", label: "Clean", detail: "Minimal" },
  { id: "neon", label: "Dark", detail: "Neon" },
  { id: "pastel", label: "Soft", detail: "Pastel" },
  { id: "editorial", label: "High", detail: "Editorial" },
];

type ThemeProps = { slide: CarouselSlide; index: number; total: number; platform: string };

function Copy({ slide }: { slide: CarouselSlide }) {
  if (slide.kind === "content") {
    return (
      <>
        <h3 className="carousel-title">{slide.title}</h3>
        <p className="carousel-body">{slide.body}</p>
      </>
    );
  }
  return <h3 className="carousel-title">{slide.text}</h3>;
}

function Chrome({ index, total, platform }: Omit<ThemeProps, "slide">) {
  return (
    <>
      <span className="slide-brand">SLIDR®</span>
      <span className="slide-platform">{platform}</span>
      <span className="slide-progress">{index + 1}/{total}</span>
    </>
  );
}

export function BoldBrutalist(props: ThemeProps) {
  return (
    <div className="slide-canvas theme-brutalist">
      <Chrome {...props} />
      <div className="brutal-mark" aria-hidden="true">✦</div>
      {props.slide.kind === "content" && <span className="slide-number">0{props.slide.number}</span>}
      <div className="slide-copy"><Copy slide={props.slide} /></div>
      <div className="brutal-rule" />
    </div>
  );
}

export function CleanMinimal(props: ThemeProps) {
  return (
    <div className="slide-canvas theme-minimal">
      <Chrome {...props} />
      <div className="minimal-rule" />
      {props.slide.kind === "content" && <span className="slide-number">{String(props.slide.number).padStart(2, "0")}</span>}
      <div className="slide-copy"><Copy slide={props.slide} /></div>
      <span className="minimal-note">Thoughts worth saving.</span>
    </div>
  );
}

export function DarkNeon(props: ThemeProps) {
  return (
    <div className="slide-canvas theme-neon">
      <Chrome {...props} />
      <div className="neon-frame" />
      <div className="neon-disc" />
      {props.slide.kind === "content" && <span className="slide-number">{String(props.slide.number).padStart(2, "0")}</span>}
      <div className="slide-copy"><Copy slide={props.slide} /></div>
      <span className="neon-signal">● LIVE SIGNAL</span>
    </div>
  );
}

export function SoftPastel(props: ThemeProps) {
  return (
    <div className="slide-canvas theme-pastel">
      <Chrome {...props} />
      <div className="pastel-shape pastel-shape-one" />
      <div className="pastel-shape pastel-shape-two" />
      <div className="pastel-card">
        {props.slide.kind === "content" && <span className="slide-number">{props.slide.number}</span>}
        <div className="slide-copy"><Copy slide={props.slide} /></div>
      </div>
    </div>
  );
}

export function Editorial(props: ThemeProps) {
  return (
    <div className="slide-canvas theme-editorial">
      <Chrome {...props} />
      <div className="editorial-header">IDEAS / CULTURE / WORK</div>
      {props.slide.kind === "content" && <span className="slide-number">{String(props.slide.number).padStart(2, "0")}</span>}
      <div className="slide-copy"><Copy slide={props.slide} /></div>
      <div className="editorial-rule" />
    </div>
  );
}

export const themeComponents: Record<ThemeId, (props: ThemeProps) => React.JSX.Element> = {
  brutalist: BoldBrutalist,
  minimal: CleanMinimal,
  neon: DarkNeon,
  pastel: SoftPastel,
  editorial: Editorial,
};