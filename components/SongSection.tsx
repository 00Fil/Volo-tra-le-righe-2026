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
  index: number;
  total: number;
};

export function SongSection({ track, index, total }: SongSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageLayerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
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
      }) as CSSProperties,
    [track],
  );

  const storyBeats = useMemo(() => getStoryBeats(track), [track]);

  useEffect(() => {
    setImageMissing(false);
  }, [track.imageSrc]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const imageLayer = imageLayerRef.current;
    const image = imageRef.current;
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
          autoAlpha: 0.32,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "bottom 62%",
            end: "bottom 20%",
            scrub: 0.7,
          },
        });
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
  }, [index]);

  return (
    <section
      ref={sectionRef}
      id={track.id}
      className={`story-section scene-${track.id} relative h-[720vh]`}
      style={ambientStyle}
    >
      <div className="story-pin relative h-screen overflow-hidden bg-[linear-gradient(140deg,var(--ambient-dark),#000)]">
        <div ref={imageLayerRef} className="absolute inset-0 will-change-opacity">
          <StaticImageFallback visible={imageMissing} />

          {!imageMissing ? (
            // GSAP needs a direct image element reference for the perpetual drift.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imageRef}
              src={track.imageSrc}
              alt={`Immagine ispirata a ${track.title}, ${track.chapters}`}
              loading={index === 0 ? "eager" : "lazy"}
              onError={() => setImageMissing(true)}
              className="absolute inset-0 h-full w-full scale-[1.035] object-cover"
            />
          ) : null}
        </div>

        <div className="absolute inset-0 bg-black/25" />
        <div className={`scene-atmosphere scene-atmosphere-${track.id}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,var(--ambient-1),transparent_34%),radial-gradient(circle_at_76%_80%,var(--ambient-2),transparent_35%),radial-gradient(circle_at_50%_55%,var(--ambient-3),transparent_50%)] opacity-45 mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.38),transparent_26%,rgba(0,0,0,.70)),linear-gradient(90deg,rgba(0,0,0,.54),transparent_38%,rgba(0,0,0,.36))]" />
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
        text: "Heathens apre la playlist perché Olivo vive in un luogo che dovrebbe proteggerlo, ma che invece gli insegna a diffidare di tutti. Ogni parola può diventare una prova, ogni debolezza un bersaglio.",
        primary: true,
      },
      {
        eyebrow: "Asa e il refettorio",
        text: "Asa lo provoca e lo spinge a uscire dalla stanza. Nel refettorio Olivo osserva i gruppi, classifica le persone, misura il pericolo: per lui mangiare significa esporsi.",
        align: "right",
      },
      {
        eyebrow: "Mungiu",
        text: "Mungiu crede che Olivo lo abbia denunciato per il nascondiglio della droga. Anche quando sembra ignorarlo, basta uno sguardo per riaccendere l'ansia.",
      },
      {
        eyebrow: "Il terrazzo",
        text: "Di notte il gruppo lo prende, gli mette un sacchetto in testa e lo porta sul terrazzo. Olivo si salva solo leggendo i dettagli: capisce che Jessica ha tradito Mungiu e usa quella verità per sopravvivere.",
        align: "right",
      },
      {
        eyebrow: "Partire",
        text: "Dopo quella scena, restare in comunità non è più una possibilità. Sonia Sperlari diventa l'uscita da un luogo che non è mai stato davvero sicuro.",
      },
    ],
    creep: [
      {
        eyebrow: "Perché questa canzone",
        text: "Creep accompagna l'arrivo a Torino perché Olivo entra in una vita più normale, ma la guarda come se appartenesse a qualcun altro.",
        primary: true,
      },
      {
        eyebrow: "Casa di Sonia",
        text: "A casa di Sonia conosce Manon e prova a stare dentro una quotidianità nuova. Ma la calma degli altri non coincide con quello che lui sente dentro.",
        align: "right",
      },
      {
        eyebrow: "La scuola",
        text: "Con una falsa identità entra in una classe nuova. Serafine, Matilda e Francesco iniziano ad accoglierlo, ma Olivo resta impacciato, lucido, sempre un passo fuori.",
      },
      {
        eyebrow: "Il lago",
        text: "La sua diversità non è solo carattere: dietro c'è il trauma del bagagliaio, dell'auto finita nel lago, di un passato che lo separa dagli altri anche quando gli altri lo invitano a entrare.",
        align: "right",
      },
      {
        eyebrow: "Fuori posto",
        text: "La canzone non racconta la scuola: racconta Olivo mentre osserva una normalità che desidera, ma che non sa abitare.",
      },
    ],
    "way-down-we-go": [
      {
        eyebrow: "Perché questa canzone",
        text: "Way Down We Go è la discesa lenta dentro la trappola. Il pericolo non esplode subito: si stringe intorno a Olivo un passo alla volta.",
        primary: true,
      },
      {
        eyebrow: "Pedinamento",
        text: "La Golf grigia lo segue. Olivo potrebbe avvisare subito Sonia, invece decide di muoversi da solo: vuole capire, e questa scelta lo avvicina al buio.",
        align: "right",
      },
      {
        eyebrow: "Biblioteca",
        text: "In biblioteca studia mappe, vie di fuga e passaggi. Il romanzo trasforma la città in un labirinto: ogni linea sulla carta sembra portare più giù.",
      },
      {
        eyebrow: "Il rapimento",
        text: "Alla fine la trappola si chiude: cappuccio, legacci, furgone, freddo. La discesa diventa fisica quando Olivo si ritrova in uno spazio metallico, buio, simile a una cisterna.",
        align: "right",
      },
      {
        eyebrow: "Verso il basso",
        text: "La canzone funziona perché il ritmo pesa come un corpo che scende: dalla superficie della strada al cuore sotterraneo del mistero.",
      },
    ],
    coraline: [
      {
        eyebrow: "Perché questa canzone",
        text: "CORALINE entra quando il romanzo cambia centro: prima sembra una scena di minaccia, poi diventa il racconto di una ferita che torna fuori.",
        primary: true,
      },
      {
        eyebrow: "Falsa pista",
        text: "Gustavo e il suo gruppo fanno paura. Parlano di violenza, dominano la scena, sembrano i colpevoli perfetti. Ma Olivo capisce che quella minaccia non è il cuore del caso.",
        align: "right",
      },
      {
        eyebrow: "Manon",
        text: "Quando Manon si avvicina, non emerge una risposta investigativa ma un ricordo: il bagagliaio, l'acqua, il soffocamento. Il corpo di Olivo ricorda prima della mente.",
      },
      {
        eyebrow: "Crollo",
        text: "Olivo urla, si chiude in bagno e si rifugia nella vasca. La canzone cresce come quel dolore: prima nascosto e intimo, poi impossibile da trattenere.",
        align: "right",
      },
      {
        eyebrow: "Il vero mostro",
        text: "Il punto non è Gustavo. Il vero mostro è il trauma che Olivo porta dentro e che il caso costringe finalmente a guardare.",
      },
    ],
    uprising: [
      {
        eyebrow: "Perché questa canzone",
        text: "Uprising accompagna il ribaltamento: i ragazzi scomparsi non sono più soltanto persone da salvare, ma un gruppo che ha ripreso il controllo.",
        primary: true,
      },
      {
        eyebrow: "Riscatto",
        text: "La polizia prepara lo scambio nel canale sotterraneo. Sembra che gli adulti controllino tutto, ma il borsone sparisce sott'acqua e la scena cambia padrone.",
        align: "right",
      },
      {
        eyebrow: "Pinna nera",
        text: "Olivo vede una pinna nera. È un dettaglio minimo, ma basta a mostrare che qualcuno nel buio sa muoversi meglio degli adulti.",
      },
      {
        eyebrow: "Salamandre",
        text: "Parlando con Serafine, Olivo capisce la verità: non esiste un rapitore unico. Le salamandre hanno finto i rapimenti, usato le debolezze delle famiglie e preparato la fuga.",
        align: "right",
      },
      {
        eyebrow: "Ribellione",
        text: "La canzone ha un passo da marcia: non racconta paura, ma resistenza. I ragazzi non scappano soltanto: reagiscono a famiglie ipocrite, adulti corrotti e bulli.",
      },
    ],
    wait: [
      {
        eyebrow: "Perché questa canzone",
        text: "Wait chiude la playlist perché il finale non è una corsa frenetica, ma una fuga sospesa: lenta, luminosa, malinconica.",
        primary: true,
      },
      {
        eyebrow: "Sottosuolo",
        text: "Olivo studia le mappe e chiede aiuto proprio a Mungiu. Insieme attraversano i cunicoli, trovano la finta bomba e arrivano alla villa.",
        align: "right",
      },
      {
        eyebrow: "La grotta",
        text: "Nel giardino trovano lo stagno e passano dietro la cascata. Lì si apre la grotta delle salamandre: non un nascondiglio qualsiasi, ma una soglia verso un'altra vita.",
      },
      {
        eyebrow: "La barca",
        text: "Olivo sale con loro. La barca attraversa il tunnel buio e sbuca nel Po all'alba: per un attimo sembra che abbia trovato finalmente un gruppo.",
        align: "right",
      },
      {
        eyebrow: "La scelta",
        text: "Poi scende. Non resta con Serafine e gli altri: sceglie una strada più solitaria, verso sua madre. La libertà arriva insieme alla separazione.",
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
