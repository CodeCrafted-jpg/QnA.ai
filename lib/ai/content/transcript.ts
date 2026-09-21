import "server-only";
import {
  YoutubeTranscript,
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptNotAvailableLanguageError,
  YoutubeTranscriptVideoUnavailableError,
} from "youtube-transcript";

export type TranscriptSegment = {
  startSeconds: number;
  endSeconds: number;
  text: string;
};

type ProviderSegment = { start?: number; duration?: number; offset?: number; text?: string };

export function normalizeTranscript(segments: ProviderSegment[]): TranscriptSegment[] {
  return segments
    .map((segment) => {
      const startSeconds = Number(segment.start ?? segment.offset ?? 0);
      const duration = Number(segment.duration ?? 0);
      return { startSeconds, endSeconds: Math.max(startSeconds, startSeconds + duration), text: String(segment.text ?? "").replace(/\s+/g, " ").trim() };
    })
    .filter((segment) => segment.text && Number.isFinite(segment.startSeconds) && Number.isFinite(segment.endSeconds))
    .sort((left, right) => left.startSeconds - right.startSeconds);
}

function isPermanentTranscriptError(error: unknown): boolean {
  return error instanceof YoutubeTranscriptDisabledError
    || error instanceof YoutubeTranscriptNotAvailableError
    || error instanceof YoutubeTranscriptNotAvailableLanguageError
    || error instanceof YoutubeTranscriptVideoUnavailableError;
}

function retryDelay(attempt: number): number {
  return 750 * 2 ** attempt;
}

export async function getYouTubeTranscript(videoId: string): Promise<TranscriptSegment[]> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const captions = await YoutubeTranscript.fetchTranscript(videoId);
      const normalized = normalizeTranscript(captions);
      if (!normalized.length) throw new Error("TRANSCRIPT_UNAVAILABLE");
      return normalized;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("TRANSCRIPT_") && error.message !== "TRANSCRIPT_UNAVAILABLE") throw error;
      if (isPermanentTranscriptError(error)) throw new Error("TRANSCRIPT_UNAVAILABLE");
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, retryDelay(attempt)));
    }
  }
  console.warn("YouTube transcript fetch exhausted retries", { videoId, error: lastError });
  throw new Error("TRANSCRIPT_UNAVAILABLE");
}
