"use client";

import { Pause, Play } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

type HomeAudioProps = {
  visible: boolean;
  onPlayingChange?: (playing: boolean) => void;
};

const homeAudioStyle = {
  "--ambient-1": "#111827",
  "--ambient-2": "#6B7F6A",
  "--ambient-3": "#F2B880",
  "--ambient-dark": "#050608",
} as CSSProperties;

export function HomeAudio({ visible, onPlayingChange }: HomeAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    onPlayingChange?.(isPlaying);
  }, [isPlaying, onPlayingChange]);

  useEffect(() => {
    if (visible) {
      return;
    }

    const audio = audioRef.current;
    audio?.pause();
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

    if (!audio || hasError) {
      return;
    }

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
      className={`home-audio relative overflow-hidden rounded-full px-2 py-2 text-white shadow-[0_18px_60px_rgba(0,0,0,.34)] backdrop-blur-2xl transition duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={homeAudioStyle}
      data-playing={isPlaying ? "true" : "false"}
    >
      <audio
        ref={audioRef}
        src="/audio/00-home.mp3"
        preload="metadata"
        loop
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
      />
      <button
        type="button"
        onClick={togglePlayback}
        disabled={hasError}
        className="relative z-10 inline-flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
        aria-label={isPlaying ? "Ferma musica home" : "Avvia musica home"}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 shadow-[0_0_34px_color-mix(in_srgb,var(--ambient-3)_48%,transparent)]">
          {isPlaying ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="ml-0.5 h-4 w-4" aria-hidden="true" />
          )}
        </span>
        <span className="hidden sm:inline">
          {hasError ? "Audio non trovato" : "Tema"}
        </span>
        <span
          className={`h-2 w-2 rounded-full ${
            isPlaying ? "player-pulse" : "opacity-55"
          }`}
          style={{ backgroundColor: "var(--ambient-3)" }}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
