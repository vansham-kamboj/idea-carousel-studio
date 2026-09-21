export const slideCounts = [5, 7, 10] as const;

export type SlideCount = (typeof slideCounts)[number];
export type Platform = "linkedin" | "instagram";

export type CarouselCopy = {
  hook: string;
  slides: Array<{ title: string; body: string }>;
  cta: string;
};

export type CarouselSlide =
  | { kind: "hook"; text: string }
  | { kind: "content"; title: string; body: string; number: number }
  | { kind: "cta"; text: string };

export function toCarouselSlides(copy: CarouselCopy): CarouselSlide[] {
  return [
    { kind: "hook", text: copy.hook },
    ...copy.slides.map((slide, index) => ({
      kind: "content" as const,
      title: slide.title,
      body: slide.body,
      number: index + 1,
    })),
    { kind: "cta", text: copy.cta },
  ];
}