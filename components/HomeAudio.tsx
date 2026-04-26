"use client";

import { Pause, Play } from "lucide-react";
import dynamic from "next/dynamic";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const LyricPlayer = dynamic(
  () =>
    import("@applemusic-like-lyrics/react").then((mod) => mod.LyricPlayer),
  { ssr: false },
);

// ── Constants ──────────────────────────────────────────────────────────────────

const LYRICS_SYNC_DELAY_MS = 900;
const LYRICS_PANEL_HEIGHT  = 160;
const AUDIO_SRC            = "/audio/00-home.mp3";
const TRACK_ARTIST         = "Artist";   // ← sostituisci
const TRACK_TITLE          = "Tema";     // ← sostituisci

const homeAudioStyle = {
  "--ambient-1": "#111827",
  "--ambient-2": "#6B7F6A",
  "--ambient-3": "#F2B880",
  "--ambient-dark": "#050608",
} as CSSProperties;

// ── Spring engine ──────────────────────────────────────────────────────────────

interface SpringOpts {
  stiffness: number;
  damping:   number;
  mass:      number;
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
  let pos      = from;
  let vel      = initialVelocity;
  let raf      = 0;
  let lastTime: number | null = null;

  function tick(now: number) {
    if (lastTime === null) lastTime = now;
    const dt    = Math.min((now - lastTime) / 1000, 0.064);
    lastTime    = now;
    const force = -stiffness * (pos - to) - damping * vel;
    vel        += (force / mass) * dt;
    pos        += vel * dt;
    const settled =
      Math.abs(pos - to) < precision && Math.abs(vel) < precision;
    onFrame(settled ? to : pos, vel);
    if (settled) { onDone(); } else { raf = requestAnimationFrame(tick); }
  }

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

// ── Orchestra ──────────────────────────────────────────────────────────────────

interface OrchestraTargets {
  drawer:  HTMLDivElement    | null;
  shell:   HTMLDivElement    | null;
  pill:    HTMLDivElement    | null;
  btn:     HTMLButtonElement | null;
}

function applyOrchestra(v: number, els: OrchestraTargets) {
  const clamped = Math.max(0, Math.min(v, 1));
  const over    = v - clamped;

  // ── Drawer height + opacity ──────────────────────────────────────────────
  if (els.drawer) {
    const h      = Math.max(0, v * LYRICS_PANEL_HEIGHT);
    const squish = 1 - Math.abs(over) * 0.08;
    els.drawer.style.height          = `${h}px`;
    els.drawer.style.opacity         = `${Math.min(1, v * 3)}`;
    els.drawer.style.transform       = `scaleY(${squish})`;
    els.drawer.style.transformOrigin =
      over >= 0 ? "bottom center" : "top center";
    els.drawer.style.pointerEvents   = v > 0.08 ? "auto" : "none";
  }

  // ── Shell lift ────────────────────────────────────────────────────────────
  if (els.shell) {
    const lift = clamped * -4 + over * 14;
    els.shell.style.transform = `translateY(${lift}px)`;
  }

  // ── Pill width stretch: si allarga un po' sull'apertura ───────────────────
  if (els.pill) {
    const scaleX = 1 + clamped * 0.04 + over * -0.06;
    els.pill.style.transform       = `scaleX(${scaleX})`;
    els.pill.style.transformOrigin = "center top";
  }

  // ── Button nudge: leggero push-down ───────────────────────────────────────
  if (els.btn) {
    const pushY = clamped * 1.5 + over * -6;
    els.btn.style.transform = `translateY(${pushY}px)`;
  }
}

interface OrchestraState { pos: number; vel: number }

function useOrchestra(isOpen: boolean) {
  const drawerRef = useRef<HTMLDivElement    | null>(null);
  const shellRef  = useRef<HTMLDivElement    | null>(null);
  const pillRef   = useRef<HTMLDivElement    | null>(null);
  const btnRef    = useRef<HTMLButtonElement | null>(null);

  const stateRef  = useRef<OrchestraState>({ pos: 0, vel: 0 });
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    cancelRef.current?.();
    const target        = isOpen ? 1 : 0;
    const { pos, vel }  = stateRef.current;
    const opts: SpringOpts = isOpen
      ? { stiffness: 280, damping: 18, mass: 1, precision: 0.0005 }
      : { stiffness: 260, damping: 20, mass: 1, precision: 0.0005 };
    const seedVel = isOpen ? vel : Math.min(vel, -0.35);
    const targets: OrchestraTargets = {
      drawer: drawerRef.current,
      shell:  shellRef.current,
      pill:   pillRef.current,
      btn:    btnRef.current,
    };
    cancelRef.current = runSpring(
      pos, target, seedVel,
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

  return { drawerRef, shellRef, pillRef, btnRef };
}

// ── Lyrics types & fetch ───────────────────────────────────────────────────────

type LyricsLine     = { timeMs?: number; text: string };
type LyricsResponse = {
  source: "synced" | "plain" | "none";
  lines: LyricsLine[];
  instrumental: boolean;
};
type LyricsState =
  | { status: "loading" }
  | { status: "ready"; data: LyricsResponse }
  | { status: "error" };
type AmlLyricWord = { startTime: number; endTime: number; word: string };
type AmlLyricLine = {
  words: AmlLyricWord[];
  translatedLyric: string;
  romanLyric: string;
  startTime: number;
  endTime: number;
  isBG: boolean;
  isDuet: boolean;
};

function useTrackLyrics(artist: string, title: string): LyricsState {
  const [state, setState] = useState<LyricsState>({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });
    const controller = new AbortController();

    async function run() {
      try {
        const params = new URLSearchParams({ artist, title });
        const res = await fetch(`/api/lyrics?${params.toString()}`, {
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
      <p className="px-2 py-1 text-xs text-white/55">
        Caricamento lyrics…
      </p>
    );
  if (lyrics.status === "error")
    return (
      <p className="px-2 py-1 text-xs text-white/50">
        Lyrics non disponibili.
      </p>
    );
  if (lyrics.data.instrumental)
    return (
      <p className="px-2 py-1 text-xs text-white/50">Brano strumentale.</p>
    );
  if (lyricLines.length === 0)
    return (
      <p className="px-2 py-1 text-xs text-white/60">Lyrics non trovate.</p>
    );

  const syncedTimeMs = Math.max(0, Math.floor(currentTimeMs - LYRICS_SYNC_DELAY_MS));

  return (
    <div className="relative h-full overflow-hidden">
      <LyricPlayer
        className="h-full w-full"
        lyricLines={lyricLines}
        currentTime={syncedTimeMs}
        playing={playing}
        alignAnchor="center"
        alignPosition={0.5}
        enableSpring
        enableBlur
        enableScale
        wordFadeWidth={0.5}
      />
    </div>
  );
}

// ── HomeAudio ──────────────────────────────────────────────────────────────────

type HomeAudioProps = {
  visible: boolean;
  onPlayingChange?: (playing: boolean) => void;
};

export function HomeAudio({ visible, onPlayingChange }: HomeAudioProps) {
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError,  setHasError]  = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Lyrics panel opens when playing
  const lyricsOpen = isPlaying;
  const lyrics     = useTrackLyrics(TRACK_ARTIST, TRACK_TITLE);

  const { drawerRef, shellRef, pillRef, btnRef } = useOrchestra(lyricsOpen);

  // Notify parent
  useEffect(() => { onPlayingChange?.(isPlaying); }, [isPlaying, onPlayingChange]);

  // Pause when hidden
  useEffect(() => {
    if (visible) return;
    audioRef.current?.pause();
    setIsPlaying(false);
  }, [visible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      onPlayingChange?.(false);
    };
  }, [onPlayingChange]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  return (
    <div
      className={`relative transition duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={homeAudioStyle}
      data-playing={isPlaying ? "true" : "false"}
    >
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="metadata"
        loop
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onError={() => { setHasError(true); setIsPlaying(false); }}
      />

      {/* Shell — riceve il lift transform */}
      <div
        ref={shellRef}
        className="relative"
        style={{ willChange: "transform" }}
      >
        {/* Pill */}
        <div
          ref={pillRef}
          className="relative overflow-hidden rounded-2xl text-white shadow-[0_18px_60px_rgba(0,0,0,.34)] backdrop-blur-2xl"
          style={{
            background:
              "linear-gradient(145deg, var(--ambient-1) 0%, color-mix(in srgb, var(--ambient-2) 40%, var(--ambient-dark)) 100%)",
            willChange: "transform",
          }}
        >
          {/* Subtle top-edge highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* ── Spring lyrics drawer ── */}
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
            <div
              className="px-4 pb-2 pt-3"
              style={{ height: LYRICS_PANEL_HEIGHT }}
            >
              <LiveLyricsPanel
                lyrics={lyrics}
                currentTimeMs={currentTime * 1000}
                playing={isPlaying}
              />
            </div>
          </div>

          {/* ── Button row ── */}
          <div className="px-2 py-2">
            <button
              ref={btnRef}
              type="button"
              onClick={togglePlayback}
              disabled={hasError}
              className="relative z-10 inline-flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
              aria-label={isPlaying ? "Ferma musica home" : "Avvia musica home"}
              style={{ willChange: "transform" }}
            >
              {/* Icon circle */}
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 shadow-[0_0_34px_color-mix(in_srgb,var(--ambient-3)_48%,transparent)]">
                {isPlaying ? (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4" aria-hidden="true" />
                )}
              </span>

              {/* Label */}
              <span className="hidden sm:inline">
                {hasError ? "Audio non trovato" : isPlaying ? "In ascolto" : "Tema"}
              </span>

              {/* Pulse dot */}
              <span
                className={`h-2 w-2 rounded-full transition-opacity ${
                  isPlaying ? "player-pulse" : "opacity-55"
                }`}
                style={{ backgroundColor: "var(--ambient-3)" }}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}