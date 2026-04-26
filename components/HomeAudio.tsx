"use client";

import { Pause, Play } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
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
const LYRICS_PANEL_HEIGHT  = 180;
const AUDIO_SRC            = "/audio/00-home.mp3";
const TRACK_ARTIST         = "Cecilia Krull";
const TRACK_TITLE          = "My Life Is Going On";
const ALBUM_ART            = "https://t2.genius.com/unsafe/344x344/https%3A%2F%2Fimages.genius.com%2F96b7506d263166706c454aa33fb4bd8d.1000x1000x1.jpg";

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
  drawer:  HTMLDivElement | null;
  shell:   HTMLDivElement | null;
  pill:    HTMLDivElement | null;
  btn:     HTMLDivElement | null;
}

function applyOrchestra(v: number, els: OrchestraTargets) {
  const clamped = Math.max(0, Math.min(v, 1));
  const over    = v - clamped;

  if (els.drawer) {
    const h      = Math.max(0, v * LYRICS_PANEL_HEIGHT);
    const squish = 1 - Math.abs(over) * 0.06;
    els.drawer.style.height          = `${h}px`;
    els.drawer.style.opacity         = `${Math.min(1, v * 2.5)}`;
    els.drawer.style.transform       = `scaleY(${squish})`;
    els.drawer.style.transformOrigin =
      over >= 0 ? "bottom center" : "top center";
    els.drawer.style.pointerEvents   = v > 0.08 ? "auto" : "none";
  }

  if (els.shell) {
    const lift = clamped * -4 + over * 14;
    els.shell.style.transform = `translateY(${lift}px)`;
  }

  if (els.pill) {
    const scaleX = 1 + clamped * 0.015 + over * -0.04;
    els.pill.style.transform       = `scaleX(${scaleX})`;
    els.pill.style.transformOrigin = "center top";
  }

  if (els.btn) {
    const pushY = clamped * 1 + over * -4;
    els.btn.style.transform = `translateY(${pushY}px)`;
  }
}

interface OrchestraState { pos: number; vel: number }

function useOrchestra(isOpen: boolean) {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const shellRef  = useRef<HTMLDivElement | null>(null);
  const pillRef   = useRef<HTMLDivElement | null>(null);
  const btnRef    = useRef<HTMLDivElement | null>(null);

  const stateRef  = useRef<OrchestraState>({ pos: 0, vel: 0 });
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    cancelRef.current?.();
    const target       = isOpen ? 1 : 0;
    const { pos, vel } = stateRef.current;
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

  const syncedTimeMs = Math.max(
    0,
    Math.floor(currentTimeMs - LYRICS_SYNC_DELAY_MS),
  );

  if (lyrics.status === "loading")
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          Loading…
        </p>
      </div>
    );

  if (
    lyrics.status === "error" ||
    (lyrics.status === "ready" && lyricLines.length === 0)
  )
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          No lyrics available
        </p>
      </div>
    );

  if (lyrics.status === "ready" && lyrics.data.instrumental)
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          Instrumental
        </p>
      </div>
    );

  return (
    <div className="relative h-full overflow-hidden">
      {/* top fade */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(14,16,21,0.95), transparent)",
        }}
      />
      <LyricPlayer
        className="h-full w-full"
        style={
          {
            "--amll-lyric-player-font-size": "13px",
            "--amll-lyric-view-color": "rgba(255,255,255,0.85)",
            "--amll-lyric-view-inactive-color": "rgba(255,255,255,0.28)",
          } as CSSProperties
        }
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
      {/* bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10"
        style={{
          background:
            "linear-gradient(to top, rgba(14,16,21,0.95), transparent)",
        }}
      />
    </div>
  );
}

// ── Progress bar ───────────────────────────────────────────────────────────────

function ProgressBar({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  onSeek: (t: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const pct    = duration > 0 ? (currentTime / duration) * 100 : 0;

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!barRef.current || duration === 0) return;
    const rect  = barRef.current.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    onSeek(ratio * duration);
  }

  function fmt(s: number) {
    if (!isFinite(s)) return "0:00";
    const m   = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  }

  return (
    <div className="flex flex-col gap-1 px-4 pb-3">
      <div
        ref={barRef}
        onClick={handleClick}
        className="group relative h-[3px] w-full cursor-pointer rounded-full"
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: "rgba(255,255,255,0.7)",
            transition: "width 0.1s linear",
          }}
        />
        <div
          className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
          style={{ left: `calc(${pct}% - 5px)` }}
        />
      </div>
      <div
        className="flex justify-between tabular-nums"
        style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}
      >
        <span>{fmt(currentTime)}</span>
        <span>{fmt(duration)}</span>
      </div>
    </div>
  );
}

// ── HomeAudio ──────────────────────────────────────────────────────────────────

type HomeAudioProps = {
  visible: boolean;
  onPlayingChange?: (playing: boolean) => void;
};

export function HomeAudio({ visible, onPlayingChange }: HomeAudioProps) {
  const audioRef      = useRef<HTMLAudioElement | null>(null);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [hasError,    setHasError]    = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);

  const lyricsOpen = isPlaying;
  const lyrics     = useTrackLyrics(TRACK_ARTIST, TRACK_TITLE);

  const { drawerRef, shellRef, pillRef, btnRef } = useOrchestra(lyricsOpen);

  useEffect(() => {
    onPlayingChange?.(isPlaying);
  }, [isPlaying, onPlayingChange]);

  useEffect(() => {
    if (visible) return;
    audioRef.current?.pause();
    setIsPlaying(false);
  }, [visible]);

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

  function handleSeek(t: number) {
    if (!audioRef.current) return;
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  }

  return (
    <>
      <style>{`
        @keyframes amll-pulse {
          0%, 100% { opacity: 1;  transform: scale(1);   }
          50%       { opacity: .4; transform: scale(.65); }
        }
        .player-pulse { animation: amll-pulse 1.8s ease-in-out infinite; }
      `}</style>

      <div
        className={`relative transition duration-500 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
        style={
          {
            ...homeAudioStyle,
            width: "100%",
            maxWidth: 400,
          } as CSSProperties
        }
        data-playing={isPlaying ? "true" : "false"}
      >
        <audio
          ref={audioRef}
          src={AUDIO_SRC}
          preload="metadata"
          loop
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onError={() => {
            setHasError(true);
            setIsPlaying(false);
          }}
        />

        <div
          ref={shellRef}
          className="relative"
          style={{ willChange: "transform" }}
        >
          {/* Card */}
          <div
            ref={pillRef}
            className="relative overflow-hidden rounded-[28px] text-white"
            style={{
              background: "rgba(14,16,21,0.96)",
              boxShadow: [
                "0 32px 64px rgba(0,0,0,.6)",
                "0 0 0 0.5px rgba(255,255,255,0.07) inset",
              ].join(", "),
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              willChange: "transform",
            }}
          >
            {/* Subtle top gloss */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.10) 50%, transparent 100%)",
              }}
            />

            {/* ── Lyrics drawer ── */}
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
                style={{ height: LYRICS_PANEL_HEIGHT }}
                className="px-5 pt-4 pb-1"
              >
                <LiveLyricsPanel
                  lyrics={lyrics}
                  currentTimeMs={currentTime * 1000}
                  playing={isPlaying}
                />
              </div>
            </div>

            {/* ── Progress bar ── */}
            <div
              style={{
                maxHeight: isPlaying ? 40 : 0,
                opacity: isPlaying ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.4s ease, opacity 0.4s ease",
              }}
            >
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
              />
            </div>

            {/* ── Main row ── */}
            <div
              ref={btnRef}
              className="flex items-center gap-3 px-4 py-4"
              style={{ willChange: "transform" }}
            >
              {/* Album art */}
              <div
                className="relative shrink-0 overflow-hidden rounded-xl"
                style={{
                  width: 48,
                  height: 48,
                  boxShadow: "0 6px 20px rgba(0,0,0,.5)",
                }}
              >
                <Image
                  src={ALBUM_ART}
                  alt={`${TRACK_TITLE} cover`}
                  fill
                  sizes="48px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Track info */}
              <div className="min-w-0 flex-1">
                {hasError ? (
                  <span
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    Audio not found
                  </span>
                ) : (
                  <>
                    <p className="truncate text-[14px] font-semibold leading-snug tracking-tight text-white">
                      {TRACK_TITLE}
                    </p>
                    <p
                      className="truncate text-[12px] leading-snug"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {TRACK_ARTIST}
                    </p>
                  </>
                )}
              </div>

              {/* Live indicator dot */}
              <span
                className={isPlaying ? "player-pulse" : ""}
                style={{
                  display: "block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--ambient-3)",
                  opacity: isPlaying ? 1 : 0.3,
                  flexShrink: 0,
                  transition: "opacity 0.3s",
                }}
                aria-hidden="true"
              />

              {/* Play / Pause */}
              <button
                type="button"
                onClick={togglePlayback}
                disabled={hasError}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="relative shrink-0 grid place-items-center rounded-full transition-transform active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none"
                style={{
                  width: 36,
                  height: 36,
                  background: "rgba(255,255,255,0.12)",
                  boxShadow: "0 0 0 0.5px rgba(255,255,255,0.08) inset",
                }}
              >
                {isPlaying ? (
                  <Pause
                    className="h-[14px] w-[14px] fill-white text-white"
                    aria-hidden
                  />
                ) : (
                  <Play
                    className="ml-[2px] h-[14px] w-[14px] fill-white text-white"
                    aria-hidden
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}