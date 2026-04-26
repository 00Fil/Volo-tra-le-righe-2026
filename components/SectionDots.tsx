"use client";

import type { Track } from "@/data/tracks";

type SectionDotsProps = {
  tracks: Track[];
  activeIndex: number;
};

export function SectionDots({ tracks, activeIndex }: SectionDotsProps) {
  return (
    <nav
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex"
      aria-label="Sezioni della playlist"
    >
      {tracks.map((track, index) => {
        const active = index === activeIndex;

        return (
          <button
            key={track.id}
            type="button"
            onClick={() =>
              document
                .getElementById(track.id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="group grid h-8 w-8 place-items-center rounded-full bg-white/10 backdrop-blur-xl transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
            title={`${track.artist} — ${track.title}`}
            aria-current={active ? "step" : undefined}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full transition ${
                active ? "scale-125 opacity-100" : "opacity-45 group-hover:opacity-90"
              }`}
              style={{
                backgroundColor: active
                  ? track.palette.ambient3
                  : "rgba(255,255,255,0.7)",
                boxShadow: active
                  ? `0 0 24px ${track.palette.ambient3}`
                  : "none",
              }}
            />
            <span className="sr-only">
              Vai a {track.artist} — {track.title}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
