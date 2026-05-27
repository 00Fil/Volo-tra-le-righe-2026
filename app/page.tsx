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
import { PlusIcon, Code2, PenTool } from "lucide-react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { Intro } from "@/components/Intro";


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

	// Blocca lo scroll mentre l'intro è visibile
	useEffect(() => {
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = showIntro ? "hidden" : "";
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [showIntro]);

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
		<>
			{showIntro && <Intro onFinish={() => setShowIntro(false)} />}

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
		</>
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
L'elaborato è una playlist ispirata al libro "Il gioco della salamandra" di Davide Longo. Ogni canzone è la colonna sonora di una parte del romanzo: la paura e l'isolamento iniziale di Olivo (Heathens – Twenty One Pilots), il senso di disagio e diversità (Creep – Radiohead), l'inizio dell'indagine sui ragazzi scomparsi (Way Down We Go – KALEO), le vite complicate e la ribellione dei protagonisti (Coraline – Maneskin), il forte legame del gruppo (Uprising – Muse) e l'addio finale sul Po (Wait – M83).
          </p>
        </div>
      </div>
    </section>
  );
}

function CreditsBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const isExpanded = isOpen || isHover;

  const credits = [
    { role: "Developed by", name: "Filippo Corsini", icon: Code2 },
    { role: "Written by", name: "Davide De Lellis", icon: PenTool },
    { role: "Written by", name: "Filippo Corsini", icon: PenTool },
    { role: "Written by", name: "Adam Ezauiui", icon: PenTool },
    { role: "Written by", name: "Stefano Borghi", icon: PenTool },
  ];

  return (
    <MotionConfig transition={ { type: "spring", stiffness: 280, damping: 30 } }>
      <motion.div
        layout
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0a0a] text-white shadow-[0_18px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {!isExpanded ? (
            <motion.button
              layout
              key="closed"
              type="button"
              aria-label="Mostra crediti"
              aria-expanded={false}
              onClick={() => setIsOpen(true)}
              className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/30"
              initial={ { opacity: 0, filter: "blur(4px)" } }
              animate={ { opacity: 1, filter: "blur(0px)" } }
              exit={ { opacity: 0, filter: "blur(4px)" } }
              transition={ { duration: 0.2, ease: "easeOut" } }
            >
              <span className="font-display text-3xl leading-none text-white/90">
                <i>D</i>
              </span>
            </motion.button>
          ) : (
            <motion.div
              layout
              key="open"
              className="flex w-[min(22rem,calc(100vw-2.5rem))] shrink-0 flex-col gap-1 p-2"
            >
              <div className="flex items-center justify-between px-2 pt-1 pb-2">
                <span className="text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">
                  Credits
                </span>
                <button
                  type="button"
                  aria-label="Nascondi crediti"
                  aria-expanded
                  onClick={() => {
                    setIsOpen(false);
                    setIsHover(false);
                  }}
                  className="grid h-6 w-6 cursor-pointer place-items-center rounded-md text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
                >
                  <PlusIcon className="h-4 w-4 rotate-45 transition-transform duration-300" />
                </button>
              </div>

              {credits.map((item, index) => (
                <motion.div
                  key={`${item.role}-${item.name}-${index}`}
                  className="flex shrink-0 items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/[0.04]"
                  initial={ { opacity: 0, filter: "blur(4px)", y: 12 } }
                  animate={ { opacity: 1, filter: "blur(0px)", y: 0 } }
                  exit={ {
                    opacity: 0,
                    filter: "blur(4px)",
                    transition: { duration: 0.15, ease: "easeOut" },
                  } }
                  transition={ {
                    delay: 0.06 + index * 0.04,
                    type: "spring",
                    stiffness: 220,
                    damping: 22,
                  } }
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.04]">
                    <item.icon className="h-4 w-4 text-white/80" />
                  </div>

                  <div className="flex min-w-0 flex-col leading-tight">
                    <span className="text-[10px] font-bold tracking-[0.16em] text-white/40 uppercase">
                      {item.role}
                    </span>
                    <span className="truncate text-sm font-semibold text-white/90">
                      {item.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
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
