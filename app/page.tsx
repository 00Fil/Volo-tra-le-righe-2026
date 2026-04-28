"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { GlassPlayer } from "@/components/GlassPlayer";
import { HomeAudio } from "@/components/HomeAudio"
import { SectionDots } from "@/components/SectionDots";
import { SongSection } from "@/components/SongSection";
import { tracks } from "@/data/tracks";

const identityMatrix =
  "1, 0, 0, 0, " +
  "0, 1, 0, 0, " +
  "0, 0, 1, 0, " +
  "0, 0, 0, 1";

const maxRotate = 0.18;
const maxScale = 1;
const minScale = 0.985;

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
      .getElementById("scheda-presentazione")
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

      <PresentationSection />

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
    </main>
  );
}

function PresentationSection() {
  return (
    <section
      id="scheda-presentazione"
      className="relative z-10 flex min-h-screen items-center px-5 py-24 md:px-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(182,161,106,.28),transparent_30%),radial-gradient(circle_at_82%_70%,rgba(107,127,106,.26),transparent_32%),linear-gradient(180deg,#000,#050608_48%,#000)]" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black to-transparent" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-white/55">
            Scheda di presentazione
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.95] md:text-7xl">
            Playlist narrativa
          </h2>
        </div>

        <div className="glass-panel border border-white/10 p-6 md:p-8">
          <p className="text-base leading-relaxed text-white/82 md:text-lg">
L'elaborato è una playlist di canzoni ispirata al libro "Il gioco della salamandra" di Davide Longo. 
Ogni canzone è la colonna sonora di una parte del romanzo e aiuta a seguirne il filo narrativo: la paura iniziale di Olivo, l'aiuto nell'indagine sui ragazzi scomparsi, la scoperta del gruppo delle "salamandre" e il l'addio finale sul Po. Noi crediamo che le canzoni scelte permettano di far provare sensazioni nuove ma coerenti alla storia e che permettano una "immersione" più facile del lettore nella storia.
          </p>
        </div>
      </div>
    </section>
  );
}

function CreditsBadge() {
  const ref = useRef<HTMLButtonElement>(null);
  const [firstOverlayPosition, setFirstOverlayPosition] = useState(0);
  const [matrix, setMatrix] = useState(identityMatrix);
  const [currentMatrix, setCurrentMatrix] = useState(identityMatrix);
  const [disableInOutOverlayAnimation, setDisableInOutOverlayAnimation] =
    useState(true);
  const [disableOverlayAnimation, setDisableOverlayAnimation] =
    useState(false);
  const [isTimeoutFinished, setIsTimeoutFinished] = useState(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout3 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isExpanded = isPinnedOpen || isHoverOpen;

  const getDimensions = () => {
    const rect = ref.current?.getBoundingClientRect();
    return {
      left: rect?.left ?? 0,
      right: rect?.right ?? 1,
      top: rect?.top ?? 0,
      bottom: rect?.bottom ?? 1,
    };
  };

  const getMatrix = (clientX: number, clientY: number) => {
    const { left, right, top, bottom } = getDimensions();
    const width = Math.max(right - left, 1);
    const height = Math.max(bottom - top, 1);
    const xCenter = left + width / 2;
    const yCenter = top + height / 2;
    const x = (clientX - xCenter) / (width / 2);
    const y = (clientY - yCenter) / (height / 2);
    const distance = Math.min(Math.sqrt(x * x + y * y), 1);
    const scale = maxScale - (maxScale - minScale) * distance;
    const rotateX = -y * maxRotate;
    const rotateY = x * maxRotate;
    const rotateZ = x * 0.06;
    return `${scale}, 0, ${-rotateY}, 0, ${rotateX}, ${scale}, ${rotateZ}, 0, ${rotateY}, ${-rotateX}, ${scale}, 0, 0, 0, 0, 1`;
  };

  const getOppositeMatrix = (sourceMatrix: string, weakening: number) =>
    sourceMatrix
      .split(", ")
      .map((item, index) => {
        if (index === 2 || index === 4 || index === 6 || index === 8 || index === 9) {
          return `${-parseFloat(item) / weakening}`;
        }
        if (index === 0 || index === 5 || index === 10 || index === 15) {
          return "1";
        }
        return item;
      })
      .join(", ");

  const clearHoverTimeouts = () => {
    [enterTimeout, leaveTimeout1, leaveTimeout2, leaveTimeout3].forEach(
      (timeout) => {
        if (timeout.current) clearTimeout(timeout.current);
      },
    );
  };

  const onMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
    clearHoverTimeouts();
    setIsHoverOpen(true);
    setDisableOverlayAnimation(true);
    setDisableInOutOverlayAnimation(false);
    enterTimeout.current = setTimeout(
      () => setDisableInOutOverlayAnimation(true),
      350,
    );
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;
    const nextMatrix = getMatrix(event.clientX, event.clientY);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFirstOverlayPosition(
          (Math.abs(xCenter - event.clientX) +
            Math.abs(yCenter - event.clientY)) /
            1.5,
        );
      });
    });
    setMatrix(getOppositeMatrix(nextMatrix, -0.7));
    setIsTimeoutFinished(false);
    setTimeout(() => setIsTimeoutFinished(true), 200);
  };

  const onMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;
    setTimeout(
      () =>
        setFirstOverlayPosition(
          (Math.abs(xCenter - event.clientX) +
            Math.abs(yCenter - event.clientY)) /
            1.5,
        ),
      150,
    );
    if (isTimeoutFinished) {
      setCurrentMatrix(getMatrix(event.clientX, event.clientY));
    }
  };

  const onMouseLeave = () => {
    clearHoverTimeouts();
    setIsHoverOpen(false);
    setCurrentMatrix(getOppositeMatrix(matrix, 4));
    setTimeout(() => setCurrentMatrix(identityMatrix), 200);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisableInOutOverlayAnimation(false);
        leaveTimeout1.current = setTimeout(
          () => setFirstOverlayPosition(-firstOverlayPosition / 4),
          150,
        );
        leaveTimeout2.current = setTimeout(
          () => setFirstOverlayPosition(0),
          300,
        );
        leaveTimeout3.current = setTimeout(() => {
          setDisableOverlayAnimation(false);
          setDisableInOutOverlayAnimation(true);
        }, 500);
      });
    });
  };

  useEffect(() => {
    if (isTimeoutFinished) setMatrix(currentMatrix);
  }, [currentMatrix, isTimeoutFinished]);

  useEffect(() => clearHoverTimeouts, []);

  const overlayAnimations = [...Array(6).keys()]
    .map(
      (index) => `
        @keyframes creditsOverlayAnimation${index + 1} {
          0% { transform: rotate(${index * 14}deg); }
          50% { transform: rotate(${(index + 1) * 14}deg); }
          100% { transform: rotate(${index * 14}deg); }
        }
      `,
    )
    .join(" ");

  return (
    <button
      ref={ref}
      type="button"
      aria-label={isExpanded ? "Nascondi crediti" : "Mostra crediti"}
      aria-expanded={isExpanded}
      onClick={() => setIsPinnedOpen((open) => !open)}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`block h-14 overflow-hidden rounded-xl text-left shadow-[0_18px_60px_rgba(0,0,0,.5)] transition-[width,filter] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/30 ${
        isExpanded
          ? "w-[min(22rem,calc(100vw-2.5rem))]"
          : "w-14 hover:w-[min(22rem,calc(100vw-2.5rem))]"
      }`}
    >
      <style>{overlayAnimations}</style>
      <div
        style={{
          transform: `perspective(700px) matrix3d(${matrix})`,
          transformOrigin: "center center",
          transition: "transform 200ms ease-out",
        }}
      >
        {/* ── Sfondo black minimal opaco ── */}
        <div className="relative h-14 overflow-hidden rounded-xl border border-white/[0.07] bg-[#0a0a0a] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 260 54"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <filter id="creditsBlur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
              </filter>
              <mask id="creditsBadgeMask">
                <rect width="260" height="54" fill="white" rx="10" />
              </mask>
            </defs>
            {/* Base nera opaca */}
            <rect width="260" height="54" rx="10" fill="#0a0a0a" />
            {/* Overlay sottilissimo per texture minima */}
            <g
              style={{ mixBlendMode: "overlay", opacity: 0.08 }}
              mask="url(#creditsBadgeMask)"
            >
              {[
                "hsl(0, 0%, 100%)",
                "hsl(0, 0%, 80%)",
                "hsl(0, 0%, 60%)",
                "hsl(0, 0%, 40%)",
                "hsl(0, 0%, 20%)",
                "white",
              ].map((color, index) => (
                <g
                  key={color}
                  style={{
                    transform: `rotate(${firstOverlayPosition + index * 16}deg)`,
                    transformOrigin: "center center",
                    transition: !disableInOutOverlayAnimation
                      ? "transform 200ms ease-out"
                      : "none",
                    animation: disableOverlayAnimation
                      ? "none"
                      : `creditsOverlayAnimation${index + 1} 5s infinite`,
                    willChange: "transform",
                  }}
                >
                  <polygon
                    points="0,0 260,54 260,0 0,54"
                    fill={color}
                    filter="url(#creditsBlur)"
                    opacity="0.3"
                  />
                </g>
              ))}
            </g>
          </svg>

          <div className="relative z-10 flex h-full items-center">
            {/* ── Icona: D corsiva al posto di FC ── */}
            <span className="grid h-14 w-14 shrink-0 place-items-center border-r border-white/[0.08] bg-white/[0.04] font-display text-3xl leading-none text-white/90">
              <i>D</i>
            </span>

            <span
              className={`min-w-0 px-3 transition duration-300 ${
                isExpanded
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-2 opacity-0"
              }`}
            >
              <span className="block whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.16em] text-white/90">
                Developed by Filippo Corsini
              </span>
              <span className="mt-0.5 block truncate text-[11px] font-semibold normal-case tracking-[-0.01em] text-white/40">
                written by Davide De Lellis, Filippo Corsini, Adam Ezauiui,
                Stefano Borghi
              </span>
            </span>
          </div>
        </div>
      </div>
    </button>
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
        <header className="flex items-start justify-between gap-5 text-xs font-medium uppercase tracking-[0.22em] text-white/62">
          <CreditsBadge />
          <span className="hidden text-right text-white/48 sm:block">
            Il gioco della salamandra
          </span>
        </header>

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
