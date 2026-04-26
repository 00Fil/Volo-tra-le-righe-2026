"use client";

import { X } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { Track } from "@/data/tracks";
import {
  useWarpDialogContext,
  WarpDialog,
  WarpDialogContent,
  WarpDialogTrigger,
} from "./warp-dialog";

type SongDialogProps = {
  activeTrack: Track;
};

type LyricsLine = {
  timeMs?: number;
  text: string;
};

type LyricsResponse = {
  source: "synced" | "plain" | "none";
  lines: LyricsLine[];
  instrumental: boolean;
};

type LyricsState =
  | { status: "loading" }
  | { status: "ready"; data: LyricsResponse }
  | { status: "error" };

export function SongDialog({ activeTrack }: SongDialogProps) {
  const [videoReady, setVideoReady] = useState(true);
  const [lyrics, setLyrics] = useState<LyricsState>({ status: "loading" });
  const ambientStyle = useMemo(
    () =>
      ({
        "--ambient-1": activeTrack.palette.ambient1,
        "--ambient-2": activeTrack.palette.ambient2,
        "--ambient-3": activeTrack.palette.ambient3,
        "--ambient-dark": activeTrack.palette.dark,
        "--glass-border": activeTrack.palette.ambient3,
        "--section-glow": activeTrack.palette.ambient2,
      }) as CSSProperties,
    [activeTrack],
  );

  useEffect(() => {
    setVideoReady(true);
  }, [activeTrack.canvasSrc]);

  useEffect(() => {
    setLyrics({ status: "loading" });
    const controller = new AbortController();

    async function run() {
      try {
        const params = new URLSearchParams({
          artist: activeTrack.artist,
          title: activeTrack.title,
        });

        const response = await fetch(`/api/lyrics?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("lyrics request failed");
        }

        const data = (await response.json()) as LyricsResponse;
        setLyrics({ status: "ready", data });
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }
        setLyrics({ status: "error" });
      }
    }

    run();
    return () => {
      controller.abort();
    };
  }, [activeTrack.artist, activeTrack.title]);

  return (
    <WarpDialog>
      <WarpDialogTrigger asChild>
        <button
          type="button"
          className="max-w-full text-left text-lg font-semibold text-white underline-offset-4 transition hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
          aria-label={`Apri spiegazione di ${activeTrack.title}`}
        >
          {activeTrack.title}
        </button>
      </WarpDialogTrigger>

      <WarpDialogContent style={ambientStyle}>
        <div className="fixed inset-0 overflow-hidden" style={ambientStyle}>
          <AmbientFallback visible={!videoReady} />
          <video
            key={activeTrack.canvasSrc}
            src={activeTrack.canvasSrc}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoReady(false)}
            className="absolute inset-0 h-full w-full object-cover brightness-[0.35] saturate-125"
          />

          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--ambient-1),transparent_35%),radial-gradient(circle_at_70%_80%,var(--ambient-2),transparent_35%),radial-gradient(circle_at_50%_50%,var(--ambient-3),transparent_45%)] opacity-70 mix-blend-screen" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_22%,rgba(255,255,255,0.05)_58%,transparent)] opacity-60" />

          <div
            data-lenis-prevent=""
            className="relative z-10 grid h-full place-items-center overflow-y-auto overscroll-contain px-4 py-10 [scrollbar-gutter:stable] sm:px-6 sm:py-14 lg:py-20"
            onWheelCapture={(event) => event.stopPropagation()}
            onTouchMoveCapture={(event) => event.stopPropagation()}
          >
            <div className="glass-panel relative flex max-h-[calc(100svh-5rem)] w-full max-w-3xl flex-col overflow-hidden text-white shadow-glass sm:max-h-[calc(100svh-7rem)] lg:max-h-[calc(100svh-10rem)]">
              
              {/* ── Sticky header: parte dall'angolo tondo della card, nessun pt extra ── */}
              <div className="sticky top-0 z-30 px-6 pb-4 pt-6 md:px-9 md:pb-5 md:pt-8 backdrop-blur-xl bg-white/[0.04] border-b border-white/10">
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <p className="text-sm uppercase text-white/60">
                      {activeTrack.chapters}
                    </p>
                    <h2 className="mt-3 font-display text-4xl font-semibold md:text-6xl">
                      {activeTrack.title}
                    </h2>
                    <p className="mt-2 text-xl text-white/75">
                      {activeTrack.artist}
                    </p>
                  </div>
                  <IconCloseButton />
                </div>
              </div>

              {/* ── Corpo scrollabile ── */}
              <div
                data-lenis-prevent=""
                className="warp-dialog-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-[4.75rem] pt-5 md:px-9 md:pb-20 md:pt-7"
                onWheelCapture={(event) => event.stopPropagation()}
                onTouchMoveCapture={(event) => event.stopPropagation()}
              >
                <p className="max-w-xl text-base leading-relaxed text-white/70">
                  {activeTrack.idea}
                </p>

                <div className="mt-7 space-y-6">
                  {activeTrack.explanationSections.map((section) => (
                    <section key={section.title}>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/55">
                        {section.title}
                      </h3>
                      <div className="mt-3 space-y-3">
                        {section.paragraphs.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="leading-relaxed text-white/80"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {activeTrack.situations.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80 backdrop-blur-xl"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <section className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/55">
                    Lyrics
                  </h3>
                  <LyricsBlock lyrics={lyrics} />
                </section>
              </div>

              {/* ── Footer fisso con blur ── */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-4 pt-7 md:px-9 md:pb-5 md:pt-8">
                <div
                  aria-hidden="true"
                  className="absolute -inset-x-6 bottom-36 h-24 md:-inset-x-9 bg-[linear-gradient(180deg,rgba(22,30,46,0)_0%,rgba(22,30,46,.2)_48%,rgba(18,25,40,.44)_100%)] blur-2xl"
                />
                <div
                  aria-hidden="true"
                  className="absolute -inset-x-6 bottom-0 h-44 rounded-b-[inherit] bg-[linear-gradient(180deg,rgba(18,25,40,0)_0%,rgba(18,25,40,.42)_30%,rgba(14,20,32,.74)_65%,rgba(12,18,28,.88)_100%)] shadow-[0_-20px_46px_rgba(0,0,0,.34)] backdrop-blur-[26px] backdrop-brightness-95 backdrop-saturate-145 md:-inset-x-9 [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,.16)_18%,rgba(0,0,0,.58)_52%,rgba(0,0,0,.86)_80%,black_100%)]"
                />
                <div
                  aria-hidden="true"
                  className="absolute -inset-x-6 bottom-0 h-40 rounded-b-[inherit] bg-[radial-gradient(90%_70%_at_12%_100%,color-mix(in_srgb,var(--ambient-1)_30%,transparent),transparent_72%),radial-gradient(90%_70%_at_88%_100%,color-mix(in_srgb,var(--ambient-2)_28%,transparent),transparent_74%),radial-gradient(70%_58%_at_50%_100%,color-mix(in_srgb,var(--ambient-3)_24%,transparent),transparent_76%)] opacity-90 md:-inset-x-9 [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,.3)_34%,rgba(0,0,0,.74)_70%,black_100%)]"
                />
                <div className="relative flex justify-end">
                  <CloseWarpDialogButton />
                </div>
              </div>

            </div>
          </div>
        </div>
      </WarpDialogContent>
    </WarpDialog>
  );
}

function LyricsBlock({ lyrics }: { lyrics: LyricsState }) {
  if (lyrics.status === "loading") {
    return (
      <p className="mt-3 text-sm text-white/65">Caricamento testo...</p>
    );
  }

  if (lyrics.status === "error") {
    return (
      <p className="mt-3 text-sm text-white/60">
        Testo non disponibile al momento.
      </p>
    );
  }

  if (lyrics.data.instrumental) {
    return (
      <p className="mt-3 text-sm text-white/60">
        Brano strumentale: nessun testo disponibile.
      </p>
    );
  }

  if (lyrics.data.lines.length === 0) {
    return (
      <p className="mt-3 text-sm text-white/60">
        Lyrics non trovate per questa traccia.
      </p>
    );
  }

  const visibleLines = lyrics.data.lines.slice(0, 26);

  return (
    <div className="mt-3 space-y-2">
      {visibleLines.map((line, index) => (
        <p key={`${line.timeMs ?? "plain"}-${index}`} className="text-sm leading-relaxed text-white/78">
          {lyrics.data.source === "synced" && line.timeMs !== undefined ? (
            <span className="mr-2 inline-block w-16 text-white/45">
              {formatLyricsTime(line.timeMs)}
            </span>
          ) : null}
          <span>{line.text}</span>
        </p>
      ))}
    </div>
  );
}

function formatLyricsTime(timeMs: number) {
  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function AmbientFallback({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,var(--ambient-1),transparent_32%),radial-gradient(circle_at_85%_70%,var(--ambient-2),transparent_34%),linear-gradient(140deg,var(--ambient-dark),#000)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:64px_64px]" />
    </div>
  );
}

function IconCloseButton() {
  const { setOpen } = useWarpDialogContext();

  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
      aria-label="Chiudi spiegazione"
    >
      <X className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

function CloseWarpDialogButton() {
  const { setOpen } = useWarpDialogContext();

  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className="pointer-events-auto rounded-full border border-white/20 bg-white/[0.22] px-5 py-2 text-white shadow-[0_16px_48px_rgba(0,0,0,.35)] backdrop-blur-2xl transition hover:bg-white/[0.32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
    >
      Chiudi
    </button>
  );
}
