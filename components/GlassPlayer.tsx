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
    import("@applemusic-like-lyrics/react").then((mod) => mod.LyricPlayer),
  { ssr: false },
);

const LYRICS_SYNC_DELAY_MS = 900;
const LYRICS_PANEL_HEIGHT = 176;

// ── Spring engine ──────────────────────────────────────────────────────────────

interface SpringOpts {
  stiffness: number;
  damping: number;
  mass: number;
  precision?: number;
}

function runSpring(
  from: number,
  to: number,
  initialVelocity: number,
  onFrame: (value: number, velocity: number) => void,
  onDone: () => void,
  opts: SpringOpts,
): () => void {
  const { stiffness, damping, mass, precision = 0.0006 } = opts;
  let pos = from;
  let vel = initialVelocity;
  let raf = 0;
  let lastTime: number | null = null;

  function tick(now: number) {
    if (lastTime === null) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.064);
    lastTime = now;

    const force = -stiffness * (pos - to) - damping * vel;
    vel += (force / mass) * dt;
    pos += vel * dt;

    const settled =
      Math.abs(pos - to) < precision && Math.abs(vel) < precision;

    onFrame(settled ? to : pos, vel);

    if (settled) {
      onDone();
    } else {
      raf = requestAnimationFrame(tick);
    }
  }

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

// ── Orchestra ──────────────────────────────────────────────────────────────────

interface OrchestraState {
  pos: number;
  vel: number;
}

interface OrchestraTargets {
  drawer:   HTMLDivElement | null;
  shell:    HTMLDivElement | null;
  content:  HTMLDivElement | null;
  cover:    HTMLDivElement | null;
  scrubber: HTMLButtonElement | null;
  glow:     HTMLDivElement | null;
}

// Transfer functions — each layer reads the same spring scalar
// through its own physical metaphor.
// v can exceed [0,1] in both directions:
//   v > 1  → open overshoot  (upward rinculo)
//   v < 0  → close undershoot (downward rinculo)
function applyOrchestra(v: number, els: OrchestraTargets) {
  const clamped = Math.max(0, Math.min(v, 1));
  const over    = v - clamped; // signed: >0 open-bounce, <0 close-bounce

  // ── 1. DRAWER ───────────────────────────────────────────────────────────────
  // Height follows spring. scaleY squishes in both overshoot directions.
  // transformOrigin flips so the squish always radiates from the correct edge:
  //   open-overshoot  → squish from bottom (fluid resistance above)
  //   close-undershoot → squish from top   (spring pull below zero)
  if (els.drawer) {
    const h      = Math.max(0, v * LYRICS_PANEL_HEIGHT);
    const squish = 1 - Math.abs(over) * 0.07;

    els.drawer.style.height          = `${h}px`;
    els.drawer.style.opacity         = `${Math.min(1, v * 2.8)}`;
    els.drawer.style.transform       = `scaleY(${squish})`;
    els.drawer.style.transformOrigin = over >= 0 ? "bottom center" : "top center";
    els.drawer.style.pointerEvents   = v > 0.08 ? "auto" : "none";
  }

  // ── 2. SHELL ────────────────────────────────────────────────────────────────
  // Opens  → lifts upward   (−Y). Overshoot bounces back down.
  // Closes → sinks downward (+Y). Undershoot bounces back up.
  // The pill "breathes" toward whichever edge content appears/disappears from.
  if (els.shell) {
    // open:  lift = −6px at v=1, extra dip when over > 0
    // close: sink = 0 at v=0, extra rise when over < 0 (over is negative → −over is positive)
    const lift = clamped * -6 + over * 16;
    els.shell.style.transform = `translateY(${lift}px)`;
  }

  // ── 3. CONTENT ROW ──────────────────────────────────────────────────────────
  // Pushed down as drawer grows; nudged up on close undershoot.
  if (els.content) {
    const pushY = clamped * 2.5 + over * -8;
    els.content.style.transform = `translateY(${pushY}px)`;
  }

  // ── 4. COVER ART ────────────────────────────────────────────────────────────
  // Opens  → tilts toward viewer (rotateX negative).
  // Closes → tilts away, then bounces back.
  if (els.cover) {
    const tiltX  = clamped * -4 + over * 10;
    const scaleC = 1 + clamped * 0.025 + over * -0.045;
    els.cover.style.transform =
      `perspective(400px) rotateX(${tiltX}deg) scale(${scaleC})`;
  }

  // ── 5. SCRUBBER ─────────────────────────────────────────────────────────────
  // Compresses on open; briefly stretches (rubber-band) on close undershoot.
  if (els.scrubber) {
    const scaleX = 1 - clamped * 0.018 + over * -0.03;
    els.scrubber.style.transform       = `scaleX(${scaleX})`;
    els.scrubber.style.transformOrigin = "left center";
  }

  // ── 6. GLOW ─────────────────────────────────────────────────────────────────
  // Pulses with kinetic energy. On close undershoot the centroid
  // migrates downward — the "exhale" of the closing breath.
  if (els.glow) {
    const energy = Math.min(Math.abs(over) * 9, 1);
    const glowY  = over < 0
      ? `${60 + Math.abs(over) * 120}%`
      : "100%";
    els.glow.style.background =
      `radial-gradient(ellipse at 50% ${glowY}, var(--ambient-2), transparent 68%)`;
    els.glow.style.opacity   = `${clamped * 0.35 + energy * 0.3}`;
    els.glow.style.transform = `scale(${1 + clamped * 0.12 + energy * 0.1})`;
  }
}

function useOrchestra(isOpen: boolean) {
  const drawerRef   = useRef<HTMLDivElement | null>(null);
  const shellRef    = useRef<HTMLDivElement | null>(null);
  const contentRef  = useRef<HTMLDivElement | null>(null);
  const coverRef    = useRef<HTMLDivElement | null>(null);
  const scrubberRef = useRef<HTMLButtonElement | null>(null);
  const glowRef     = useRef<HTMLDivElement | null>(null);

  const stateRef  = useRef<OrchestraState>({ pos: 0, vel: 0 });
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    cancelRef.current?.();

    const target          = isOpen ? 1 : 0;
    const { pos, vel }    = stateRef.current;

    // Both directions are underdamped → both bounce.
    // Opening  : bounces past 1 (upward rinculo)
    // Closing  : bounces past 0 (downward rinculo)
    // Close damping is slightly higher so the downward dip is a
    // single clean oscillation rather than a multi-wobble.
    const opts: SpringOpts = isOpen
      ? { stiffness: 280, damping: 18, mass: 1, precision: 0.0005 }
      : { stiffness: 260, damping: 20, mass: 1, precision: 0.0005 };

    // Seed the closing spring with a small negative kick so the first
    // frame immediately dips below 0, giving the downward bounce
    // a crisp onset even when the mouse leaves at low velocity.
    const seedVel = isOpen ? vel : Math.min(vel, -0.35);

    const targets: OrchestraTargets = {
      drawer:   drawerRef.current,
      shell:    shellRef.current,
      content:  contentRef.current,
      cover:    coverRef.current,
      scrubber: scrubberRef.current,
      glow:     glowRef.current,
    };

    cancelRef.current = runSpring(
      pos,
      target,
      seedVel,
      (value, velocity) => {
        stateRef.current = { pos: value, vel: velocity };
        applyOrchestra(value, targets);
      },
      () => {
        cancelRef.current = null;
        applyOrchestra(target, targets);
      },
      opts,
    );

    return () => cancelRef.current?.();
  }, [isOpen]);

  return { drawerRef, shellRef, contentRef, coverRef, scrubberRef, glowRef };
}

// ── Types ──────────────────────────────────────────────────────────────────────

type CoverState =
  | { status: "loading" }
  | { status: "ready"; url: string }
  | { status: "error" };

type LyricsLine     = { timeMs?: number; text: string };
type LyricsResponse = {
  source: "synced" | "plain" | "none";
  lines: LyricsLine[];
  instrumental: boolean;
};
type AmlLyricWord   = { startTime: number; endTime: number; word: string };
type AmlLyricLine   = {
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

// ── Data hooks ─────────────────────────────────────────────────────────────────

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
        const params = new URLSearchParams({ artist, title });
        const res    = await fetch(`/api/cover-art?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("cover-lookup-failed");
        const data = (await res.json()) as { url?: string };
        if (!data.url) throw new Error("cover-url-missing");
        setState({ status: "ready", url: data.url });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ status: "error" });
      }
    }

    run();
    return () => controller.abort();
  }, [artist, title]);

  if (state.status === "ready")   return { src: state.url,    loading: false };
  if (state.status === "loading") return { src: fallbackSrc,  loading: true  };
  return                                  { src: fallbackSrc,  loading: false };
}

function useTrackLyrics(artist: string, title: string): LyricsState {
  const [state, setState] = useState<LyricsState>({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });
    const controller = new AbortController();

    async function run() {
      try {
        const params = new URLSearchParams({ artist, title });
        const res    = await fetch(`/api/lyrics?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("lyrics-request-failed");
        const data = (await res.json()) as LyricsResponse;
        setState({ status: "ready", data });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ status: "error" });
      }
    }

    run();
    return () => controller.abort();
  }, [artist, title]);

  return state;
}

// ── GlassPlayer ───────────────────────────────────────────────────────────────

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
  const audioRef           = useRef<HTMLAudioElement | null>(null);
  const wantsPlaybackRef   = useRef(false);
  const pendingCueSeekRef  = useRef(true);
  const pendingAutoplayRef = useRef(false);
  const hoverTimerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying,     setIsPlaying]     = useState(false);
  const [currentTime,   setCurrentTime]   = useState(0);
  const [duration,      setDuration]      = useState(0);
  const [audioError,    setAudioError]    = useState(false);
  const [phaseChanging, setPhaseChanging] = useState(false);
  const [lyricsOpen,    setLyricsOpen]    = useState(false);

  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  const { src: coverSrc, loading: coverLoading } = useCoverArt(
    activeTrack.artist,
    activeTrack.title,
    activeTrack.imageSrc,
  );
  const lyrics = useTrackLyrics(activeTrack.artist, activeTrack.title);

  const {
    drawerRef, shellRef, contentRef, coverRef, scrubberRef, glowRef,
  } = useOrchestra(lyricsOpen);

  const cssVars = useMemo(
    () => ({
      "--ambient-1":      activeTrack.palette.ambient1,
      "--ambient-2":      activeTrack.palette.ambient2,
      "--ambient-3":      activeTrack.palette.ambient3,
      "--track-progress": `${progress * 100}%`,
    }) as CSSProperties,
    [activeTrack, progress],
  );

  function handleMouseEnter() {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setLyricsOpen(true), 60);
  }

  function handleMouseLeave() {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setLyricsOpen(false), 100);
  }

  useEffect(
    () => () => { if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current); },
    [],
  );

  useEffect(() => { onPlayingChange?.(isPlaying); }, [isPlaying, onPlayingChange]);

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
    pendingCueSeekRef.current  = true;
    pendingAutoplayRef.current = enabled && wantsPlaybackRef.current;
    audio.pause();
    audio.load();
    if (!pendingAutoplayRef.current) setIsPlaying(false);
  }, [activeTrack.audioSrc, enabled]);

  function getCueStart(dur?: number) {
    const cue = Math.max(0, activeTrack.cueStartSeconds || 0);
    if (dur && Number.isFinite(dur) && dur > 1)
      return Math.min(cue, Math.max(dur - 1, 0));
    return cue;
  }

  function applyCuePoint(audio: HTMLAudioElement, dur?: number) {
    const cue = getCueStart(dur);
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
    if (duration > 0 && audio.currentTime >= Math.max(duration - 0.2, 0))
      applyCuePoint(audio, duration);
    else if (duration > 0 && audio.currentTime <= 0.2)
      applyCuePoint(audio, duration);
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
    const rect  = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1,
    );
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  }

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-4xl -translate-x-1/2 transition duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-10 opacity-0"
      }`}
      style={cssVars}
      data-track={activeTrack.id}
      data-playing={isPlaying ? "true" : "false"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <audio
        ref={audioRef}
        src={activeTrack.audioSrc}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const audio = e.currentTarget;
          const dur   = audio.duration;
          setDuration(dur);
          if (pendingCueSeekRef.current) {
            applyCuePoint(audio, dur);
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

      {/* ── Outer shell — receives the lift/sink transform ── */}
      <div
        ref={shellRef}
        className="relative"
        style={{ willChange: "transform" }}
      >
        {/* Ambient glow — behind the pill, migrates on close */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-x-0 -bottom-3 -top-3 rounded-3xl opacity-0"
          style={{
            filter: "blur(18px)",
            willChange: "opacity, transform",
          }}
        />

        {/* Pill */}
        <div className="relative overflow-hidden rounded-2xl text-white shadow-[0_24px_64px_rgba(0,0,0,.5),0_0_0_1px_rgba(255,255,255,.08)]">
          {/* Grainient */}
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

          <div className="absolute inset-0 bg-black/40" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* ── Spring-animated lyrics drawer ── */}
          <div
            ref={drawerRef}
            style={{
              height: 0,
              opacity: 0,
              overflow: "hidden",
              pointerEvents: "none",
              willChange: "height, opacity, transform",
            }}
          >
            <div className="px-3 pb-2 pt-2 sm:px-4 sm:pb-3 sm:pt-3">
              <LiveLyricsPanel
                lyrics={lyrics}
                currentTimeMs={currentTime * 1000}
                playing={isPlaying}
              />
            </div>
          </div>

          {/* ── Content row ── */}
          <div
            ref={contentRef}
            className="relative flex items-center gap-3 p-3 sm:gap-4 sm:p-4"
            style={{ willChange: "transform" }}
          >
            {/* Cover art */}
            <div
              ref={coverRef}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.15rem] bg-white/10 shadow-[0_18px_45px_rgba(0,0,0,.34)] sm:h-20 sm:w-20"
              style={{ willChange: "transform", transformOrigin: "center bottom" }}
            >
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  coverLoading ? "opacity-100" : "opacity-0"
                } bg-[radial-gradient(circle_at_35%_25%,var(--ambient-3),transparent_42%),linear-gradient(145deg,var(--ambient-1),var(--ambient-2))]`}
              />
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
                    if (img.src !== activeTrack.imageSrc)
                      img.src = activeTrack.imageSrc;
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
                  ref={scrubberRef}
                  type="button"
                  onClick={seek}
                  className="group relative h-4 flex-1 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
                  aria-label="Sposta ascolto"
                  style={{ willChange: "transform" }}
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
    </div>
  );
}

// ── LiveLyricsPanel ────────────────────────────────────────────────────────────

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
    () =>
      lyrics.status === "ready" ? mapToAmlLyricLines(lyrics.data) : [],
    [lyrics],
  );

  if (lyrics.status === "loading")
    return (
      <div className="px-2 py-1 text-sm text-white/65">
        Caricamento lyrics...
      </div>
    );
  if (lyrics.status === "error")
    return (
      <div className="px-2 py-1 text-sm text-white/60">
        Lyrics non disponibili al momento.
      </div>
    );
  if (lyrics.data.instrumental)
    return (
      <div className="px-2 py-1 text-sm text-white/60">
        Brano strumentale.
      </div>
    );
  if (lyricLines.length === 0)
    return (
      <div className="px-2 py-1 text-sm text-white/75">
        Lyrics non trovate.
      </div>
    );

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

// ── Helpers ────────────────────────────────────────────────────────────────────

function mapToAmlLyricLines(data: LyricsResponse): AmlLyricLine[] {
  if (!data.lines.length) return [];

  if (data.source === "synced") {
    const timed = data.lines
      .filter(
        (l): l is { timeMs: number; text: string } =>
          typeof l.timeMs === "number" && l.text.trim().length > 0,
      )
      .sort((a, b) => a.timeMs - b.timeMs);

    return timed.map((line, i) => {
      const startTime = Math.max(0, Math.floor(line.timeMs));
      const nextStart = timed[i + 1]?.timeMs;
      const endTime   = Math.max(
        startTime + 900,
        Math.floor(nextStart ?? startTime + 5200),
      );
      return createAmlLine(line.text, startTime, endTime);
    });
  }

  return data.lines
    .map((l) => l.text.trim())
    .filter(Boolean)
    .map((text, i) => {
      const startTime = i * 4200;
      return createAmlLine(text, startTime, startTime + 4200);
    });
}

function createAmlLine(
  text: string,
  startTime: number,
  endTime: number,
): AmlLyricLine {
  return {
    words: [{ startTime, endTime, word: text.trim() }],
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