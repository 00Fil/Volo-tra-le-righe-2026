"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { GlassPlayer } from "@/components/GlassPlayer";
import { HomeAudio } from "@/components/HomeAudio"
import { SectionDots } from "@/components/SectionDots";
import { SongSection } from "@/components/SongSection";
import { tracks } from "@/data/tracks";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [palette, setPalette] = useState(tracks[0].palette);
  const activeTrack = tracks[activeIndex];

  const setPhase = useCallback((index: number) => {
    setActiveIndex(index);
    setPalette(tracks[index].palette);
  }, []);

  const ambientStyle = useMemo(
    () =>
      ({
        "--ambient-1": palette.ambient1,
        "--ambient-2": palette.ambient2,
        "--ambient-3": palette.ambient3,
        "--ambient-dark": palette.dark,
        "--glass-border": palette.ambient3,
        "--section-glow": palette.ambient2,
      }) as CSSProperties,
    [palette],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), 4400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = showIntro ? "hidden" : "";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showIntro]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.08,
      smoothWheel: true,
    });

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    lenis.on("scroll", ScrollTrigger.update);
    frameId = requestAnimationFrame(raf);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const updatePlayerVisibility = () => {
      setShowPlayer(window.scrollY > 140);
    };

    updatePlayerVisibility();
    window.addEventListener("scroll", updatePlayerVisibility, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updatePlayerVisibility);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--ambient-1", palette.ambient1);
    root.style.setProperty("--ambient-2", palette.ambient2);
    root.style.setProperty("--ambient-3", palette.ambient3);
    root.style.setProperty("--ambient-dark", palette.dark);
    root.style.setProperty("--glass-border", palette.ambient3);
    root.style.setProperty("--section-glow", palette.ambient2);
  }, [palette]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggers = tracks
      .map((track, index) => {
        const section = document.getElementById(track.id);

        if (!section) {
          return null;
        }

        return ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setPhase(index),
          onEnterBack: () => setPhase(index),
        });
      })
      .filter((trigger): trigger is ScrollTrigger => Boolean(trigger));

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [setPhase]);

  function enterStory() {
    setHasEntered(true);
    setShowPlayer(true);
    setPhase(0);
    document
      .getElementById(tracks[0].id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main
      className="relative min-h-screen overflow-x-hidden bg-black pb-36 text-white"
      data-playing={musicPlaying ? "true" : "false"}
    >
      <AmbientShell style={ambientStyle} playing={musicPlaying} />
      <Hero
        onEnter={enterStory}
        showHomeAudio={!showPlayer}
        onHomePlayingChange={setMusicPlaying}
      />

      {tracks.map((track, index) => (
        <SongSection
          key={track.id}
          track={track}
          nextTrack={tracks[index + 1]}
          index={index}
          total={tracks.length}
        />
      ))}

      <FinalSection />
      <SectionDots tracks={tracks} activeIndex={activeIndex} />
      <GlassPlayer
        activeTrack={activeTrack}
        activeIndex={activeIndex}
        total={tracks.length}
        enabled={hasEntered || showPlayer}
        visible={showPlayer}
        onPlayingChange={setMusicPlaying}
      />
      <CuteWatermark />
    </main>
  );
}

function CuteWatermark() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed right-[calc(env(safe-area-inset-right)+1rem)] top-[calc(env(safe-area-inset-top)+1rem)] z-[70] flex items-center justify-end gap-2.5 text-white">
      {/* Tooltip bubble */}
      <div
        className={`pointer-events-none rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-indigo-500/20 px-4 py-2.5 text-xs font-medium shadow-[0_20px_60px_rgba(236,72,153,.15),0_8px_24px_rgba(0,0,0,.25)] backdrop-blur-2xl transition-all duration-500 ease-out ${
          open
            ? "translate-x-0 scale-100 opacity-100 blur-0"
            : "translate-x-4 scale-90 opacity-0 blur-sm"
        }`}
      >
        <span className="bg-gradient-to-r from-pink-200 via-white to-purple-200 bg-clip-text text-transparent">
          Developed with 💖 by FC
        </span>
        {/* Little tail/arrow */}
        <div className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-sm border-r border-t border-white/10 bg-purple-500/15 backdrop-blur-2xl" />
      </div>

      {/* Main button */}
      <button
        type="button"
        aria-label="Mostra watermark"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`group relative grid h-12 w-12 place-items-center rounded-2xl border text-sm font-semibold shadow-[0_20px_60px_rgba(236,72,153,.12),0_8px_24px_rgba(0,0,0,.2),inset_0_1px_0_rgba(255,255,255,.2)] backdrop-blur-2xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-300/70 ${
          open
            ? "border-pink-300/25 bg-gradient-to-br from-pink-500/25 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/25"
            : "border-white/15 bg-white/10 hover:border-pink-300/20 hover:bg-white/15"
        } ${hovered ? "scale-105" : "scale-100"}`}
      >
        {/* Glow ring on hover */}
        <div
          className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(circle at center, rgba(236,72,153,.15) 0%, transparent 70%)",
          }}
        />

        {/* Sparkle dots */}
        <div
          className={`absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-pink-300 transition-all duration-500 ${
            open
              ? "scale-100 opacity-80"
              : "scale-0 opacity-0"
          }`}
        />
        <div
          className={`absolute -bottom-0.5 -left-0.5 h-1 w-1 rounded-full bg-purple-300 transition-all delay-100 duration-500 ${
            open
              ? "scale-100 opacity-60"
              : "scale-0 opacity-0"
          }`}
        />

        {/* Face */}
        <span
          className={`relative z-10 select-none transition-all duration-300 ${
            hovered ? "scale-125" : "scale-100"
          } ${open ? "rotate-12" : "rotate-0"}`}
        >
          {open ? "✿" : ":3"}
        </span>
      </button>
    </div>
  );
}

function AmbientShell({
  style,
  playing,
}: {
  style: CSSProperties;
  playing: boolean;
}) {
  return (
    <div
      className={`ambient-shell pointer-events-none fixed inset-0 z-0 ${
        playing ? "is-playing" : ""
      }`}
      style={style}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,var(--ambient-1),transparent_30%),radial-gradient(circle_at_82%_18%,var(--ambient-2),transparent_28%),radial-gradient(circle_at_50%_84%,var(--ambient-3),transparent_32%)] opacity-35 blur-2xl transition-colors duration-700" />
      <div className="absolute inset-0 bg-noise opacity-[0.08]" />
    </div>
  );
}

function Hero({
  onEnter,
  showHomeAudio,
  onHomePlayingChange,
}: {
  onEnter: () => void;
  showHomeAudio: boolean;
  onHomePlayingChange: (playing: boolean) => void;
}) {
  return (
    <section className="relative z-10 flex min-h-[100svh] overflow-hidden px-5 py-6 md:px-10 md:py-8">
      <picture className="absolute inset-0 h-full w-full">
        <source
          media="(max-width: 767px)"
          srcSet="/images/mobile/00-copertina-mobile.jpg"
        />
        <img
          src="/images/00-copertina.jpg"
          alt=""
          fetchPriority="high"
          className="hero-drift h-full w-full object-cover opacity-95"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </picture>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(107,127,106,.18),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(216,205,184,.16),transparent_30%),radial-gradient(circle_at_58%_88%,rgba(227,106,44,.20),transparent_30%),linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.42)_50%,#000)]" />
      <div className="absolute inset-0 bg-noise opacity-[0.08]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-7xl flex-col justify-between py-8 md:py-10">
        <div className="flex items-center justify-between gap-5 text-xs uppercase text-white/60">

        </div>

        <div className="max-w-5xl">
          <p className="text-sm uppercase text-white/60">
          </p>
          <h1 className="mt-5 max-w-5xl font-display text-7xl font-semibold leading-[0.82] md:text-[9.5rem]">
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-snug text-white/75 md:text-3xl">
          </p>
        </div>

        <div className="flex items-end justify-between gap-6">
          <HomeAudio
            visible={showHomeAudio}
            onPlayingChange={onHomePlayingChange}
          />
          <button
            type="button"
            onClick={onEnter}
            className="group inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-3 font-medium text-white shadow-[0_18px_60px_rgba(0,0,0,.32)] backdrop-blur-2xl transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
          >
            Inizia
            <ArrowDown
              className="h-4 w-4 transition group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  );
}

function FinalSection() {
  return (
    <section
      className="relative z-10 flex min-h-screen items-center px-5 py-24 md:px-16"
      style={
        {
          "--ambient-1": "#F2B880",
          "--ambient-2": "#1E3A5F",
          "--ambient-3": "#3A5A40",
          "--ambient-dark": "#050816",
          "--glass-border": "#F2B880",
          "--section-glow": "#F2B880",
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(242,184,128,.34),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(58,90,64,.30),transparent_32%),linear-gradient(180deg,#050816,#02030a)]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <div>
          <p className="text-sm uppercase text-white/60">Finale</p>
          <h2 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-tight md:text-7xl">
            Olivo non fugge soltanto: sceglie dove andare.
          </h2>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/80">
            Attraversa il buio, scopre la verità, sale sulla barca e poi
            scende. La libertà non cancella la solitudine, ma gli restituisce
            una direzione.
          </p>
          <p className="mt-10 text-white/60">
            Elaborato per Volo tra le righe — Edizione 2025/2026
          </p>
        </div>

        <div className="p-0">
          <p className="text-sm uppercase text-white/60">Playlist completa</p>
          <ol className="mt-5 space-y-4">
            {tracks.map((track) => (
              <li
                key={track.id}
                className="flex gap-3 text-lg text-white/80"
              >
                <span className="text-white/40">
                  {tracks.indexOf(track) + 1}.
                </span>
                <span>
                  {track.artist} — {track.title}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
