import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

import type { CarouselCopy } from "@/lib/carousel-types";

const InputSchema = z.object({
  topic: z.string().trim().min(3).max(500),
  slideCount: z.union([z.literal(5), z.literal(7), z.literal(10)]),
  platform: z.enum(["linkedin", "instagram"]),
});

const CopySchema = z.object({
  hook: z.string().trim().min(1),
  slides: z.array(
    z.object({
      title: z.string().trim().min(1),
      body: z.string().trim().min(1),
    }),
  ),
  cta: z.string().trim().min(1),
});

const SYSTEM_PROMPT =
  'You are a carousel copywriter. Return ONLY valid JSON: { hook, slides: [{ title, body }], cta }. Hook under 10 words. Titles under 6 words. Body under 20 words. Punchy, no filler, no generic advice, no dashes.';

function cleanJson(text: string) {
  return text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}

function safeMessage(status: number, fallback: string) {
  if (status === 401) return "Slidr’s AI connection needs to be configured.";
  if (status === 402) return "AI credits are unavailable right now. Add credits, then retry.";
  if (status === 403) return fallback || "This AI request is not available for this workspace.";
  if (status === 429) return "Slidr is receiving lots of requests. Wait a moment, then retry.";
  return fallback || "The carousel could not be generated. Please retry.";
}

export const generateCarousel = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<CarouselCopy> => {
    const key = process.env['LOVABLE_API_KEY'];
    if (!key) throw new Error("Slidr’s AI connection needs to be configured.");

    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    try {
      const expectedContentSlides = data.slideCount - 2;
      const result = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system: SYSTEM_PROMPT,
        prompt: `Create a ${data.slideCount}-slide ${data.platform} carousel about: ${data.topic}. Return exactly ${expectedContentSlides} objects in the slides array so the hook and CTA make ${data.slideCount} total slides.`,
      });

      let parsed: unknown;
      try {
        parsed = JSON.parse(cleanJson(result.text));
      } catch {
        throw new Error("The copy came back in an unexpected format. Retry to generate a fresh version.");
      }

      const copy = CopySchema.safeParse(parsed);
      if (!copy.success || copy.data.slides.length !== expectedContentSlides) {
        throw new Error("The copy came back in an unexpected format. Retry to generate a fresh version.");
      }
      return copy.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes("unexpected format")) throw error;
      const maybeStatus = error as { statusCode?: number; status?: number; responseBody?: string; message?: string };
      const status = maybeStatus.statusCode ?? maybeStatus.status ?? 500;
      let upstreamMessage = "";
      try {
        const body = maybeStatus.responseBody ? JSON.parse(maybeStatus.responseBody) : null;
        upstreamMessage = body?.error?.message ?? body?.message ?? "";
      } catch {
        upstreamMessage = "";
      }
      throw new Error(safeMessage(status, upstreamMessage || maybeStatus.message || ""));
    }
  });