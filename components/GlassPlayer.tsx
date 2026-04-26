"use client";

import { Pause, Play } from "lucide-react";
import dynamic from "next/dynamic";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import type { Track } from "@/data/tracks";
import { SongDialog } from "./SongDialog";
import Grainient from "@/components/Grainient";

const LyricPlayer = dynamic(
  () =>
    import("@applemusic-like-lyrics/react").then(
      (mod) => mod.LyricPlayer,
    ),
  { ssr: false },
);

const LYRICS_SYNC_DELAY_MS = 900;

// ── Hook ──────────────────────────────────────────────────────────────────────

type CoverState =
  | { status: "loading" }
  | { status: "ready"; url: string }
  | { status: "error" };

type LyricsLine = {
  timeMs?: number;
  text: string;
};

type LyricsResponse = {
  source: "synced" | "plain" | "none";
  lines: LyricsLine[];
  instrumental: boolean;
};

type AmlLyricWord = {
  startTime: number;
  endTime: number;
  word: string;
};

type AmlLyricLine = {
  words: AmlLyricWord[];
  translatedLyric: string;
  romanLyric: string;
  startTime: number;
  endTime: number;
  isBG: boolean;
  isDuet: boolean;
};

type LyricsState =
  | { status: "loading" }
  | { status: "ready"; data: LyricsResponse }
  | { status: "error" };

function useCoverArt(
  artist: string,
  title: string,
  fallbackSrc: string,
): { src: string; loading: boolean } {
  const [state, setState] = useState<CoverState>({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });
    const controller = new AbortController();

    async function run() {
      try {
        const params = new URLSearchParams({
          artist,
          title,
        });
        const response = await fetch(
          `/api/cover-art?${params.toString()}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("cover-lookup-failed");
        }

        const data = (await response.json()) as { url?: string };
        if (!data.url) {
          throw new Error("cover-url-missing");
        }

        setState({ status: "ready", url: data.url });
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }
        setState({ status: "error" });
      }
    }

    run();
    return () => {
      controller.abort();
    };
  }, [artist, title]);

  if (state.status === "ready") return { src: state.url, loading: false };
  if (state.status === "loading") return { src: fallbackSrc, loading: true };
  return { src: fallbackSrc, loading: false };
}

function useTrackLyrics(artist: string, title: string) {
  const [state, setState] = useState<LyricsState>({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });
    const controller = new AbortController();

    async function run() {
      try {
        const params = new URLSearchParams({ artist, title });
        const response = await fetch(`/api/lyrics?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("lyrics-request-failed");
        }

        const data = (await response.json()) as LyricsResponse;
        setState({ status: "ready", data });
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }
        setState({ status: "error" });
      }
    }

    run();
    return () => controller.abort();
  }, [artist, title]);

  return state;
}

// ── Component ─────────────────────────────────────────────────────────────────

type GlassPlayerProps = {
  activeTrack: Track;
  activeIndex: number;
  total: number;
  enabled: boolean;
  visible: boolean;
  onPlayingChange?: (playing: boolean) => void;
};

export function GlassPlayer({
  activeTrack,
  activeIndex,
  total,
  enabled,
  visible,
  onPlayingChange,
}: GlassPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wantsPlaybackRef = useRef(false);
  const pendingCueSeekRef = useRef(true);
  const pendingAutoplayRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [phaseChanging, setPhaseChanging] = useState(false);
  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  const { src: coverSrc, loading: coverLoading } = useCoverArt(
    activeTrack.artist,
    activeTrack.title,
    activeTrack.imageSrc,
  );
  const lyrics = useTrackLyrics(activeTrack.artist, activeTrack.title);

  const cssVars = useMemo(
    () =>
      ({
        "--ambient-1": activeTrack.palette.ambient1,
        "--ambient-2": activeTrack.palette.ambient2,
        "--ambient-3": activeTrack.palette.ambient3,
        "--track-progress": `${progress * 100}%`,
      }) as CSSProperties,
    [activeTrack, progress],
  );

  useEffect(() => {
    onPlayingChange?.(isPlaying);
  }, [isPlaying, onPlayingChange]);

  useEffect(() => {
    setPhaseChanging(true);
    const t = window.setTimeout(() => setPhaseChanging(false), 680);
    return () => window.clearTimeout(t);
  }, [activeTrack.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setAudioError(false);
    setCurrentTime(0);
    setDuration(0);
    pendingCueSeekRef.current = true;
    pendingAutoplayRef.current = enabled && wantsPlaybackRef.current;
    audio.pause();
    audio.load();

    if (!pendingAutoplayRef.current) {
      setIsPlaying(false);
    }
  }, [activeTrack.audioSrc, enabled]);

  function getCueStart(durationValue?: number) {
    const cue = Math.max(0, activeTrack.cueStartSeconds || 0);
    if (
      durationValue &&
      Number.isFinite(durationValue) &&
      durationValue > 1
    ) {
      return Math.min(cue, Math.max(durationValue - 1, 0));
    }
    return cue;
  }

  function applyCuePoint(audio: HTMLAudioElement, durationValue?: number) {
    const cue = getCueStart(durationValue);
    audio.currentTime = cue;
    setCurrentTime(cue);
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !enabled) return;

    if (isPlaying) {
      audio.pause();
      wantsPlaybackRef.current = false;
      setIsPlaying(false);
      return;
    }

    setAudioError(false);
    wantsPlaybackRef.current = true;

    if (
      duration > 0 &&
      audio.currentTime >= Math.max(duration - 0.2, 0)
    ) {
      applyCuePoint(audio, duration);
    } else if (duration > 0 && audio.currentTime <= 0.2) {
      applyCuePoint(audio, duration);
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      wantsPlaybackRef.current = false;
      setIsPlaying(false);
    }
  }

  function seek(event: MouseEvent<HTMLButtonElement>) {
    const audio = audioRef.current;
    if (!audio || duration <= 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1,
    );

    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  }

  return (
    <div
      className={`group/player fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-4xl -translate-x-1/2 transition duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-10 opacity-0"
      }`}
      style={cssVars}
      data-track={activeTrack.id}
      data-playing={isPlaying ? "true" : "false"}
    >
      <audio
        ref={audioRef}
        src={activeTrack.audioSrc}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const audio = e.currentTarget;
          const audioDuration = audio.duration;
          setDuration(audioDuration);

          if (pendingCueSeekRef.current) {
            applyCuePoint(audio, audioDuration);
            pendingCueSeekRef.current = false;
          }

          if (pendingAutoplayRef.current) {
            pendingAutoplayRef.current = false;
            audio
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                wantsPlaybackRef.current = false;
                setIsPlaying(false);
              });
          }
        }}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => {
          wantsPlaybackRef.current = false;
          setIsPlaying(false);
        }}
        onError={() => {
          wantsPlaybackRef.current = false;
          setAudioError(true);
          setIsPlaying(false);
        }}
      />

      {/* Shell */}
      <div className="relative overflow-hidden rounded-2xl text-white shadow-[0_24px_64px_rgba(0,0,0,.5),0_0_0_1px_rgba(255,255,255,.08)]">
        {/* Grainient background */}
        <div
          key={activeTrack.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            phaseChanging ? "opacity-0" : "opacity-100"
          }`}
        >
          <Grainient
            color1={activeTrack.palette.ambient1}
            color2={activeTrack.palette.ambient2}
            color3={activeTrack.palette.ambient3}
            timeSpeed={4.45}
            warpStrength={0.2}
            warpFrequency={4.0}
            warpSpeed={28}
            warpAmplitude={60.0}
            rotationAmount={360.0}
            noiseScale={1.8}
            grainAmount={0.03}
            grainScale={2.5}
            grainAnimated={false}
            contrast={1.35}
            gamma={1.0}
            saturation={0.9}
            colorBalance={0.0}
            blendAngle={0.0}
            blendSoftness={0.4}
            zoom={0.95}
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Top highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="relative z-10 max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity] duration-300 ease-out pointer-events-none group-hover/player:max-h-56 group-hover/player:opacity-100 group-hover/player:pointer-events-auto group-focus-within/player:max-h-56 group-focus-within/player:opacity-100 group-focus-within/player:pointer-events-auto">
          <div className="px-3 pb-2 pt-2 sm:px-4 sm:pb-3 sm:pt-3">
            <LiveLyricsPanel
              lyrics={lyrics}
              currentTimeMs={currentTime * 1000}
              playing={isPlaying}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
          {/* Album art + play button */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.15rem] bg-white/10 shadow-[0_18px_45px_rgba(0,0,0,.34)] sm:h-20 sm:w-20">
            {/* Palette gradient — visible while cover is loading */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                coverLoading ? "opacity-100" : "opacity-0"
              } bg-[radial-gradient(circle_at_35%_25%,var(--ambient-3),transparent_42%),linear-gradient(145deg,var(--ambient-1),var(--ambient-2))]`}
            />

            {/* Remote cover (fades in once loaded) */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                coverLoading ? "opacity-0" : "opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={coverSrc}
                src={coverSrc}
                alt={`Copertina di ${activeTrack.title}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== activeTrack.imageSrc) {
                    img.src = activeTrack.imageSrc;
                  }
                }}
              />
            </div>

            <div className="absolute inset-0 bg-black/10" />

            <button
              type="button"
              onClick={togglePlayback}
              disabled={!enabled}
              className="absolute inset-0 grid place-items-center bg-black/15 text-white backdrop-blur-[1px] transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              aria-label={
                enabled
                  ? isPlaying
                    ? "Metti in pausa"
                    : "Avvia canzone"
                  : "Entra nel sito per abilitare il player"
              }
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 shadow-[0_0_34px_color-mix(in_srgb,var(--ambient-3)_55%,transparent)] backdrop-blur-xl">
                {isPlaying ? (
                  <Pause className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5" aria-hidden="true" />
                )}
              </span>
            </button>
          </div>

          {/* Track info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-xs uppercase text-white/50">
                  Fase {String(activeIndex + 1).padStart(2, "0")} ·{" "}
                  {activeTrack.chapters}
                </p>
                <div className="truncate">
                  <SongDialog activeTrack={activeTrack} />
                </div>
                <p className="truncate text-sm text-white/60">
                  {activeTrack.artist}
                </p>
              </div>

              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-xs uppercase text-white/45">Ambiente</p>
                <p className="mt-1 max-w-44 truncate text-sm text-white/75">
                  {audioError ? "audio in attesa" : activeTrack.sectionTitle}
                </p>
              </div>
            </div>

            {/* Scrubber */}
            <div className="mt-3 flex items-center gap-3 sm:mt-4">
              <button
                type="button"
                onClick={seek}
                className="group relative h-4 flex-1 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
                aria-label="Sposta ascolto"
              >
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 rounded-full bg-white/20" />
                <span
                  className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,var(--ambient-3),var(--ambient-2))] transition-[width]"
                  style={{ width: `${progress * 100}%` }}
                />
                <span
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_22px_var(--ambient-3)] opacity-70 transition group-hover:scale-125 group-hover:opacity-100"
                  style={{ left: `calc(${progress * 100}% - 6px)` }}
                />
              </button>

              <span className="shrink-0">
                <span
                  className={`block h-2.5 w-2.5 rounded-full ${
                    isPlaying ? "player-pulse" : ""
                  }`}
                  style={{ backgroundColor: "var(--ambient-3)" }}
                  aria-hidden="true"
                />
              </span>
            </div>

            {/* Time row */}
            <div className="mt-1 flex items-center justify-between gap-3 text-xs text-white/45">
              <span className="truncate sm:hidden">
                {activeTrack.sectionTitle}
              </span>
              <span className="shrink-0">
                {audioError
                  ? "audio in attesa"
                  : `${formatTime(currentTime)} / ${formatTime(duration)}`}
              </span>
              <span className="hidden shrink-0 sm:inline">
                {activeIndex + 1} / {total}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveLyricsPanel({
  lyrics,
  currentTimeMs,
  playing,
}: {
  lyrics: LyricsState;
  currentTimeMs: number;
  playing: boolean;
}) {
  const lyricLines = useMemo(
    () => (lyrics.status === "ready" ? mapToAmlLyricLines(lyrics.data) : []),
    [lyrics],
  );

  if (lyrics.status === "loading") {
    return (
      <div className="px-2 py-1 text-sm text-white/65">
        Caricamento lyrics...
      </div>
    );
  }

  if (lyrics.status === "error") {
    return (
      <div className="px-2 py-1 text-sm text-white/60">
        Lyrics non disponibili al momento.
      </div>
    );
  }

  if (lyrics.data.instrumental) {
    return (
      <div className="px-2 py-1 text-sm text-white/60">
        Brano strumentale.
      </div>
    );
  }

  if (lyricLines.length === 0) {
    return (
      <div className="px-2 py-1 text-sm text-white/75">
        Lyrics non trovate.
      </div>
    );
  }

  const syncedTimeMs = Math.max(
    0,
    Math.floor(currentTimeMs - LYRICS_SYNC_DELAY_MS),
  );

  return (
    <div className="amll-live-shell relative h-[152px] overflow-hidden">
      <div className="relative h-full px-1">
        <LyricPlayer
          className="h-full w-full"
          lyricLines={lyricLines}
          currentTime={syncedTimeMs}
          playing={playing}
          alignAnchor="center"
          alignPosition={0.52}
          enableSpring
          enableBlur
          enableScale
          wordFadeWidth={0.5}
        />
      </div>
    </div>
  );
}

function mapToAmlLyricLines(data: LyricsResponse): AmlLyricLine[] {
  if (!data.lines.length) {
    return [];
  }

  if (data.source === "synced") {
    const timed = data.lines
      .filter((line): line is { timeMs: number; text: string } =>
        typeof line.timeMs === "number" && line.text.trim().length > 0,
      )
      .sort((a, b) => a.timeMs - b.timeMs);

    return timed.map((line, index) => {
      const startTime = Math.max(0, Math.floor(line.timeMs));
      const nextStart = timed[index + 1]?.timeMs;
      const fallbackEnd = startTime + 5200;
      const endTime = Math.max(
        startTime + 900,
        Math.floor(nextStart ?? fallbackEnd),
      );

      return createAmlLine(line.text, startTime, endTime);
    });
  }

  return data.lines
    .map((line) => line.text.trim())
    .filter(Boolean)
    .map((text, index) => {
      const startTime = index * 4200;
      return createAmlLine(text, startTime, startTime + 4200);
    });
}

function createAmlLine(
  text: string,
  startTime: number,
  endTime: number,
): AmlLyricLine {
  const safeText = text.trim();

  return {
    words: [
      {
        startTime,
        endTime,
        word: safeText,
      },
    ],
    translatedLyric: "",
    romanLyric: "",
    startTime,
    endTime,
    isBG: false,
    isDuet: false,
  };
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
