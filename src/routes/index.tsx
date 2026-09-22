import { Button } from "@/components/ui/button";
import { themeComponents, themes, type ThemeId } from "@/components/carousel/theme-slides";
import { generateCarousel } from "@/lib/generate-carousel.functions";
import {
  slideCounts,
  toCarouselSlides,
  type CarouselCopy,
  type Platform,
  type SlideCount,
} from "@/lib/carousel-types";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDown, ArrowLeft, ArrowRight, Download, ImageDown, LoaderCircle, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Slidr — Ideas into social carousels" },
      { name: "description", content: "Turn one idea into a polished, ready-to-share social media carousel." },
      { property: "og:title", content: "Slidr — Ideas into social carousels" },
      { property: "og:description", content: "Turn one idea into a polished, ready-to-share social media carousel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const runGeneration = useServerFn(generateCarousel);
  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState<SlideCount>(7);
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [theme, setTheme] = useState<ThemeId>("brutalist");
  const [copy, setCopy] = useState<CarouselCopy | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exporting, setExporting] = useState<"png" | "pdf" | null>(null);
  const [error, setError] = useState("");
  const exportRefs = useRef<Array<HTMLDivElement | null>>([]);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const slides = useMemo(() => (copy ? toCarouselSlides(copy) : []), [copy]);
  const ActiveTheme = themeComponents[theme];

  async function handleGenerate() {
    if (topic.trim().length < 3) {
      setError("Add a little more detail to your idea first.");
      return;
    }
    setIsGenerating(true);
    setError("");
    try {
      const result = await runGeneration({ data: { topic, slideCount, platform } });
      setCopy(result);
      setActiveSlide(0);
      requestAnimationFrame(() => document.querySelector("#results")?.scrollIntoView({ behavior: "smooth" }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The carousel could not be generated. Please retry.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function captureSlide(index: number) {
    const node = exportRefs.current[index];
    if (!node) throw new Error("That slide is not ready to export yet.");
    await document.fonts.ready;
    const { toPng } = await import("html-to-image");
    return toPng(node, { width: 1080, height: 1350, canvasWidth: 1080, canvasHeight: 1350, pixelRatio: 1, cacheBust: true });
  }

  async function downloadPng() {
    setExporting("png");
    setError("");
    try {
      const dataUrl = await captureSlide(activeSlide);
      const link = document.createElement("a");
      link.download = `slidr-${theme}-${activeSlide + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The PNG could not be downloaded.");
    } finally {
      setExporting(null);
    }
  }

  async function downloadPdf() {
    setExporting("pdf");
    setError("");
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [1080, 1350], hotfixes: ["px_scaling"] });
      for (let index = 0; index < slides.length; index += 1) {
        if (index > 0) pdf.addPage([1080, 1350], "portrait");
        const image = await captureSlide(index);
        pdf.addImage(image, "PNG", 0, 0, 1080, 1350, undefined, "FAST");
      }
      pdf.save(`slidr-${theme}-${slides.length}-slides.pdf`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The PDF could not be downloaded.");
    } finally {
      setExporting(null);
    }
  }

  function trackVisibleSlide() {
    const row = carouselRef.current;
    if (!row) return;
    const center = row.scrollLeft + row.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    Array.from(row.children).forEach((child, index) => {
      const element = child as HTMLElement;
      const distance = Math.abs(element.offsetLeft + element.offsetWidth / 2 - center);
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });
    setActiveSlide(nearest);
  }

  function goToSlide(index: number) {
    const row = carouselRef.current;
    if (!row || slides.length === 0) return;
    const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
    const child = row.children.item(nextIndex) as HTMLElement | null;
    child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActiveSlide(nextIndex);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="app-header">
        <a href="#top" className="brand-lockup" aria-label="Slidr home">
          <span className="brand-mark">S</span>
          <span>Slidr</span>
        </a>
        <span className="header-note">Idea → carousel</span>
      </header>

      <section id="top" className="composer-section">
        <div className="composer-heading">
          <p className="eyebrow"><Sparkles aria-hidden="true" /> AI carousel studio</p>
          <h1>Make ideas<br /><span>worth swiping.</span></h1>
          <p>One thought in. A complete social carousel out.</p>
        </div>

        <div className="composer-panel">
          <label htmlFor="topic">What should your carousel be about?</label>
          <textarea
            id="topic"
            value={topic}
            maxLength={500}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. Why creative teams should protect their boring ideas"
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") void handleGenerate();
            }}
          />
          <div className="composer-controls">
            <fieldset>
              <legend>Slides</legend>
              <div className="segmented-control">
                {slideCounts.map((count) => (
                  <Button key={count} type="button" variant={slideCount === count ? "default" : "ghost"} size="sm" onClick={() => setSlideCount(count)}>{count}</Button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Platform</legend>
              <div className="segmented-control platform-control">
                {(["linkedin", "instagram"] as Platform[]).map((item) => (
                  <Button key={item} type="button" variant={platform === item ? "default" : "ghost"} size="sm" onClick={() => setPlatform(item)}>
                    {item === "linkedin" ? "LinkedIn" : "Instagram"}
                  </Button>
                ))}
              </div>
            </fieldset>
            <Button className="generate-button" size="lg" onClick={() => void handleGenerate()} disabled={isGenerating}>
              {isGenerating ? <><LoaderCircle className="animate-spin" /> Writing slides</> : <>Generate <ArrowRight /></>}
            </Button>
          </div>
          {error && (
            <div className="error-banner" role="alert">
              <span>{error}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => void handleGenerate()}>Retry</Button>
            </div>
          )}
        </div>
        {!copy && <a className="scroll-cue" href="#results"><ArrowDown aria-hidden="true" /> Preview below</a>}
      </section>

      <section id="results" className="results-section">
        {!copy ? (
          <div className="empty-state">
            <div className="empty-stack" aria-hidden="true"><span /><span /><span /></div>
            <p>Your carousel will appear here.</p>
          </div>
        ) : (
          <>
            <div className="results-toolbar">
              <div>
                <p className="eyebrow">Current draft</p>
                <h2>Social carousel <em>preview</em></h2>
              </div>
              <div className="export-actions">
                <Button variant="outline" onClick={() => void downloadPng()} disabled={exporting !== null}><ImageDown />{exporting === "png" ? "Exporting…" : "PNG"}</Button>
                <Button onClick={() => void downloadPdf()} disabled={exporting !== null}><Download />{exporting === "pdf" ? "Building PDF…" : "Download all as PDF"}</Button>
              </div>
            </div>

            <div className="theme-picker" role="tablist" aria-label="Carousel theme">
              {themes.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={theme === item.id}
                  variant="ghost"
                  className={`theme-chip theme-chip-${item.id}`}
                  onClick={() => setTheme(item.id)}
                >
                  <span className="theme-swatch" aria-hidden="true"><i /></span>
                  <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                </Button>
              ))}
            </div>

            <div className="preview-stage">
              <Button className="slide-nav slide-nav-prev" variant="outline" size="icon" aria-label="Previous slide" disabled={activeSlide === 0} onClick={() => goToSlide(activeSlide - 1)}>
                <ArrowLeft />
              </Button>
              <div className="carousel-row" ref={carouselRef} onScroll={trackVisibleSlide}>
                {slides.map((slide, index) => (
                  <div className={`preview-frame${activeSlide === index ? " is-active" : ""}`} key={`${theme}-${index}`} onClick={() => goToSlide(index)}>
                    <div className="slide-scaler">
                      <ActiveTheme slide={slide} index={index} total={slides.length} platform={platform} />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="slide-nav slide-nav-next" variant="outline" size="icon" aria-label="Next slide" disabled={activeSlide === slides.length - 1} onClick={() => goToSlide(activeSlide + 1)}>
                <ArrowRight />
              </Button>
            </div>
            <div className="carousel-footer">
              <p className="carousel-status">Slide {String(activeSlide + 1).padStart(2, "0")} of {String(slides.length).padStart(2, "0")}</p>
              <div className="slide-dots" aria-label="Choose slide">
                {slides.map((_, index) => (
                  <Button key={index} type="button" variant="ghost" size="icon" aria-label={`Go to slide ${index + 1}`} aria-current={activeSlide === index} onClick={() => goToSlide(index)} />
                ))}
              </div>
              <span className="canvas-size">1080 × 1350 px</span>
            </div>

            <div className="export-stage" aria-hidden="true">
              {slides.map((slide, index) => (
                <div key={`export-${theme}-${index}`} ref={(node) => { exportRefs.current[index] = node; }}>
                  <ActiveTheme slide={slide} index={index} total={slides.length} platform={platform} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}