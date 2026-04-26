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

export function SongDialog({ activeTrack }: SongDialogProps) {
  const [videoReady, setVideoReady] = useState(true);
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
            <div className="glass-panel relative flex max-h-[calc(100svh-5rem)] w-full max-w-3xl overflow-hidden text-white shadow-glass sm:max-h-[calc(100svh-7rem)] lg:max-h-[calc(100svh-10rem)]">
              <div
                data-lenis-prevent=""
                className="warp-dialog-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-28 pt-6 md:px-9 md:pb-32 md:pt-9"
                onWheelCapture={(event) => event.stopPropagation()}
                onTouchMoveCapture={(event) => event.stopPropagation()}
              >
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
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
                      {activeTrack.idea}
                    </p>
                  </div>
                  <IconCloseButton />
                </div>

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
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-end bg-gradient-to-t from-black/50 via-black/25 to-transparent px-6 pb-5 pt-14 backdrop-blur-xl md:px-9 md:pb-7 md:pt-16">
                <CloseWarpDialogButton />
              </div>
            </div>
          </div>
        </div>
      </WarpDialogContent>
    </WarpDialog>
  );
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
      className="pointer-events-auto rounded-full border border-white/15 bg-white/14 px-5 py-2 text-white shadow-[0_16px_48px_rgba(0,0,0,.35)] backdrop-blur-2xl transition hover:bg-white/24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
    >
      Chiudi
    </button>
  );
}
