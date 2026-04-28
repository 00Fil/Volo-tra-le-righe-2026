"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { Track } from "@/data/tracks";

type SongSectionProps = {
  track: Track;
  nextTrack?: Track;
  index: number;
  total: number;
};

export function SongSection({ track, nextTrack, index, total }: SongSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageLayerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const nextImageRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const detailRefs = useRef<HTMLDivElement[]>([]);
  const [imageMissing, setImageMissing] = useState(false);

  const ambientStyle = useMemo(
    () =>
      ({
        "--ambient-1": track.palette.ambient1,
        "--ambient-2": track.palette.ambient2,
        "--ambient-3": track.palette.ambient3,
        "--ambient-dark": track.palette.dark,
        "--glass-border": track.palette.ambient3,
        "--section-glow": track.palette.ambient2,
        "--scene-accent": track.palette.ambient3,
        "--next-ambient-1": nextTrack?.palette.ambient1 ?? track.palette.ambient1,
        "--next-ambient-2": nextTrack?.palette.ambient2 ?? track.palette.ambient2,
        "--next-ambient-3": nextTrack?.palette.ambient3 ?? track.palette.ambient3,
        "--next-ambient-dark": nextTrack?.palette.dark ?? track.palette.dark,
      }) as CSSProperties,
    [track, nextTrack],
  );

  const storyBeats = useMemo(() => getStoryBeats(track), [track]);

  useEffect(() => {
    setImageMissing(false);
  }, [track.imageSrc, track.mobileImageSrc]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const imageLayer = imageLayerRef.current;
    const image = imageRef.current;
    const nextImage = nextImageRef.current;
    const pinnedScene = section?.querySelector(".story-pin");

    if (!section) {
      return;
    }

    const context = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLDivElement>(".story-panel");

      if (image) {
        gsap.to(image, {
          scale: 1.08,
          xPercent: index % 2 === 0 ? 1.6 : -1.6,
          yPercent: -1.2,
          duration: 9,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        gsap.fromTo(
          image,
          { filter: "saturate(1.05) contrast(1.02)" },
          {
            filter: "saturate(1.22) contrast(1.12)",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      }

      if (imageLayer) {
        gsap.fromTo(
          imageLayer,
          { autoAlpha: 0.34 },
          {
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              end: "top 45%",
              scrub: 0.65,
            },
          },
        );

        gsap.to(imageLayer, {
          autoAlpha: nextImage ? 0.18 : 0.32,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "bottom 82%",
            end: "bottom 26%",
            scrub: 0.7,
          },
        });
      }

      if (nextImage) {
        gsap.fromTo(
          nextImage,
          {
            autoAlpha: 0,
            scale: 1.09,
            filter: "blur(16px) saturate(0.9) brightness(0.72)",
          },
          {
            autoAlpha: 0.72,
            scale: 1.025,
            filter: "blur(2px) saturate(1.08) brightness(0.9)",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "bottom 92%",
              end: "bottom 18%",
              scrub: 0.9,
            },
          },
        );
      }

      gsap.set(panels, { autoAlpha: 0, y: 42, filter: "blur(10px)" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
          pin: pinnedScene,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      panels.forEach((panel, panelIndex) => {
        const hold = panelIndex === 0 ? 1.15 : 1.65;
        const enterDuration = panelIndex === 0 ? 0.62 : 0.78;
        const exitDuration = panelIndex === 0 ? 0.5 : 0.68;

        timeline
          .to(
            panel,
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: enterDuration,
              ease: "power3.out",
            },
            panelIndex === 0 ? 0.16 : "+=0.38",
          )
          .to(
            panel,
            {
              autoAlpha: 0,
              y: -48,
              filter: "blur(10px)",
              duration: exitDuration,
              ease: "power2.inOut",
            },
            `+=${hold}`,
          );
      });
    }, section);

    return () => context.revert();
  }, [index, nextTrack]);

  return (
    <section
      ref={sectionRef}
      id={track.id}
      className={`story-section scene-${track.id} relative h-[720vh]`}
      style={ambientStyle}
    >
      <div className="story-pin relative h-[100svh] overflow-hidden bg-[linear-gradient(140deg,var(--ambient-dark),#000)]">
        <div ref={imageLayerRef} className="absolute inset-0 will-change-opacity">
          <StaticImageFallback visible={imageMissing} />

          {!imageMissing ? (
            <picture className="absolute inset-0 h-full w-full">
              <source
                media="(max-width: 767px)"
                srcSet={track.mobileImageSrc}
              />
              <img
                ref={imageRef}
                src={track.imageSrc}
                alt={`Immagine ispirata a ${track.title}, ${track.chapters}`}
                loading={index === 0 ? "eager" : "lazy"}
                onError={() => setImageMissing(true)}
                className="h-full w-full scale-[1.035] object-cover"
              />
            </picture>
          ) : null}
        </div>

        <div className="absolute inset-0 bg-black/25" />
        {nextTrack ? (
          <div ref={nextImageRef} className="scene-next-preview absolute inset-0 opacity-0">
            <picture className="absolute inset-0 h-full w-full">
              <source
                media="(max-width: 767px)"
                srcSet={nextTrack.mobileImageSrc}
              />
              <img
                src={nextTrack.imageSrc}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </picture>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,var(--next-ambient-1),transparent_32%),radial-gradient(circle_at_75%_76%,var(--next-ambient-2),transparent_34%),linear-gradient(180deg,transparent_10%,var(--next-ambient-dark)_100%)] opacity-50 mix-blend-screen" />
          </div>
        ) : null}
        <div className={`scene-atmosphere scene-atmosphere-${track.id}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,var(--ambient-1),transparent_34%),radial-gradient(circle_at_76%_80%,var(--ambient-2),transparent_35%),radial-gradient(circle_at_50%_55%,var(--ambient-3),transparent_50%)] opacity-45 mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.38),transparent_26%,rgba(0,0,0,.70)),linear-gradient(90deg,rgba(0,0,0,.54),transparent_38%,rgba(0,0,0,.36))]" />
        <div className="scene-flow-shadow absolute inset-x-0 bottom-0 h-[36svh]" />
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.07]" />

        <div className="pointer-events-none absolute inset-0 z-10 mx-auto w-full max-w-6xl px-6 md:px-10">
          <div className="absolute inset-0 flex items-center px-6 md:px-10">
            <div ref={titleRef} className="story-panel max-w-3xl">
              <p className="text-xs uppercase text-white/60 md:text-sm">
                {String(index + 1).padStart(2, "0")} / {total} ·{" "}
                {track.chapters}
              </p>
              <h2 className="mt-3 font-display text-5xl font-semibold leading-none md:text-7xl">
                {track.sectionTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-xl leading-relaxed text-white/80 md:text-2xl">
                {track.shortLine}
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
                {track.idea}
              </p>
            </div>
          </div>

          {storyBeats.map((beat, beatIndex) => (
            <StoryBeat
              key={`${beat.eyebrow}-${beatIndex}`}
              refCallback={(element) => {
                if (element) detailRefs.current[beatIndex] = element;
              }}
              eyebrow={beat.eyebrow}
              text={beat.text}
              align={beat.align}
              primary={beat.primary}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryBeat({
  eyebrow,
  text,
  refCallback,
  align = "left",
  primary = false,
}: {
  eyebrow: string;
  text: string;
  refCallback: (element: HTMLDivElement | null) => void;
  align?: "left" | "right";
  primary?: boolean;
}) {
  return (
    <div
      ref={refCallback}
      className={`story-beat story-panel absolute inset-y-0 flex w-[calc(100%-3rem)] items-center md:w-[calc(100%-5rem)] ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <div className={primary ? "max-w-3xl" : "max-w-xl"}>
        <p className="text-xs uppercase text-white/50">{eyebrow}</p>
        <p
          className={
            primary
              ? "mt-3 text-xl font-medium leading-snug text-white/90 md:text-3xl"
              : "mt-3 text-2xl font-medium leading-tight text-white md:text-4xl"
          }
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function getStoryBeats(track: Track) {
  const beats: Record<
    string,
    Array<{
      eyebrow: string;
      text: string;
      align?: "left" | "right";
      primary?: boolean;
    }>
  > = {
    heathens: [
      {
        eyebrow: "Perché questa canzone",
        text: "Heathens apre la playlist perché Olivo parte da un luogo insicuro: teme Mungiu, ma proprio da lì Sonia lo porta verso il caso dei ragazzi scomparsi.",
        primary: true,
      },
      {
        eyebrow: "Asa e il refettorio",
        text: "Asa lo provoca e lo porta fuori dalla stanza. Nel refettorio Olivo incontra gli altri ragazzi e prova a evitare situazioni che possano metterlo in pericolo.",
        align: "right",
      },
      {
        eyebrow: "Mungiu",
        text: "Mungiu pensa che Olivo abbia denunciato il nascondiglio della droga. Da qui nasce la paura di Olivo: sa che Mungiu potrebbe vendicarsi.",
      },
      {
        eyebrow: "Il terrazzo",
        text: "La minaccia diventa reale quando Mungiu e il suo gruppo portano Olivo sul terrazzo. Olivo si salva usando un'informazione su Jessica.",
        align: "right",
      },
      {
        eyebrow: "Partire",
        text: "Sonia gli presenta il caso di quattro adolescenti spariti a Torino. Dopo il terrazzo, Olivo accetta di partire: la fuga dalla comunità diventa l'inizio dell'indagine.",
      },
    ],
    creep: [
      {
        eyebrow: "Perché questa canzone",
        text: "Creep accompagna l'arrivo a Torino: Olivo entra in casa di Sonia e in una nuova scuola, ma è lì anche per osservare il caso dall'interno.",
        primary: true,
      },
      {
        eyebrow: "Casa di Sonia",
        text: "Sonia ospita Olivo e gli offre un ambiente più stabile. In casa conosce Manon, ma non riesce subito a vivere tutto con naturalezza.",
        align: "right",
      },
      {
        eyebrow: "La scuola",
        text: "A scuola Olivo usa una falsa identità. Serafine, Matilda e Francesco lo avvicinano: sembrano compagni, ma sono anche il primo collegamento con il mistero.",
      },
      {
        eyebrow: "Il lago",
        text: "La sua distanza dagli altri non è solo timidezza: dipende anche dal trauma dell'auto finita nel lago e del bagagliaio.",
        align: "right",
      },
      {
        eyebrow: "Fuori posto",
        text: "La canzone si collega a questo doppio ruolo: Olivo prova a inserirsi, ma resta fuori posto perché sta anche indagando.",
      },
    ],
    "way-down-we-go": [
      {
        eyebrow: "Perché questa canzone",
        text: "Way Down We Go è adatta perché l'indagine comincia a scendere nel pericolo: Olivo nasconde indizi, segue mappe e perde controllo.",
        primary: true,
      },
      {
        eyebrow: "Pedinamento",
        text: "Olivo nota una Golf grigia che lo segue. Per lui sembra un segnale del rapitore, anche se la verità sarà più complicata.",
        align: "right",
      },
      {
        eyebrow: "Biblioteca",
        text: "In biblioteca studia mappe e vie di fuga. Usa la sua capacità di osservazione, ma il rischio cresce invece di diminuire.",
      },
      {
        eyebrow: "Gustavo",
        text: "Gustavo e il suo gruppo diventano una pista minacciosa. Olivo pensa di avvicinarsi alla verità, ma rischia di diventare solo un'esca.",
        align: "right",
      },
      {
        eyebrow: "Collegamento",
        text: "Il ritmo lento e pesante accompagna il passaggio dal controllo apparente alla confusione: Olivo non sa più di chi fidarsi.",
      },
    ],
    coraline: [
      {
        eyebrow: "Perché questa canzone",
        text: "CORALINE entra quando Gustavo non basta più a spiegare il caso e la storia si sposta anche sul trauma di Olivo.",
        primary: true,
      },
      {
        eyebrow: "Falsa pista",
        text: "Gustavo sembra una risposta possibile, ma non chiude l'indagine. Sonia stessa ha usato Olivo per arrivare a lui.",
        align: "right",
      },
      {
        eyebrow: "Manon",
        text: "Con Manon riemerge il ricordo dell'auto nel lago: il bagagliaio, l'acqua e la paura di soffocare.",
      },
      {
        eyebrow: "Crollo",
        text: "Olivo non riesce a controllare la reazione: si chiude in bagno e si rifugia nella vasca. Il trauma diventa evidente.",
        align: "right",
      },
      {
        eyebrow: "Collegamento",
        text: "La canzone cresce come questa parte: prima la falsa pista, poi la crisi personale, infine la richiesta di riscatto che riapre il caso.",
      },
    ],
    uprising: [
      {
        eyebrow: "Perché questa canzone",
        text: "Uprising accompagna il ribaltamento: il rapitore non è quello che sembra e i ragazzi scomparsi hanno costruito una messinscena.",
        primary: true,
      },
      {
        eyebrow: "Riscatto",
        text: "La polizia organizza lo scambio del riscatto nel canale sotterraneo. Sembra una normale operazione, ma qualcosa non torna.",
        align: "right",
      },
      {
        eyebrow: "Pinna nera",
        text: "Il borsone sparisce sott'acqua e Olivo vede una pinna nera. Il canale rivela che il piano è stato preparato da chi conosce i sotterranei.",
      },
      {
        eyebrow: "Salamandre",
        text: "Serafine spiega che Ryan, Elena, Federico e Maria hanno simulato i rapimenti. Il riscatto serve alla fuga delle salamandre.",
        align: "right",
      },
      {
        eyebrow: "Collegamento",
        text: "La canzone funziona perché parla di ribellione: i ragazzi reagiscono insieme alle famiglie e agli adulti.",
      },
    ],
    wait: [
      {
        eyebrow: "Perché questa canzone",
        text: "Wait chiude la playlist perché l'indagine finisce nei sotterranei, ma la scelta finale riguarda Olivo e sua madre.",
        primary: true,
      },
      {
        eyebrow: "Sottosuolo",
        text: "Olivo studia le mappe e chiede aiuto a Mungiu. Il vecchio nemico diventa l'alleato che gli permette di muoversi sottoterra.",
        align: "right",
      },
      {
        eyebrow: "La grotta",
        text: "Dietro la cascata trovano la grotta delle salamandre. Lì il piano è chiaro: i ragazzi non aspettano soccorso, vogliono partire.",
      },
      {
        eyebrow: "La barca",
        text: "Olivo sale sulla barca con Serafine e gli altri. Attraversano il tunnel e arrivano sul Po all'alba.",
        align: "right",
      },
      {
        eyebrow: "La scelta",
        text: "Sonia gli ha rivelato che sua madre è viva. Per questo Olivo scende dalla barca: chiude il caso, ma apre la propria ricerca.",
      },
    ],
  };

  return beats[track.id] ?? [
    {
      eyebrow: "Collegamento",
      text: track.explanation,
      primary: true,
    },
    ...track.situations.map((situation, index) => ({
      eyebrow: `Dettaglio ${index + 1}`,
      text: situation,
      align: index % 2 === 0 ? ("right" as const) : ("left" as const),
    })),
  ];
}

function StaticImageFallback({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--ambient-1),transparent_34%),radial-gradient(circle_at_76%_72%,var(--ambient-2),transparent_35%),linear-gradient(145deg,var(--ambient-dark),#000)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--ambient-3),transparent_64%)] opacity-20 blur-3xl" />
    </div>
  );
}
