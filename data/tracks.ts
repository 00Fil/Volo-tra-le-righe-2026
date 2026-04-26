export type Track = {
  id: string;
  title: string;
  artist: string;
  chapters: string;
  idea: string;
  sectionTitle: string;
  shortLine: string;
  imageSrc: string;
  canvasSrc: string;
  audioSrc: string;
  cueStartSeconds: number;
  palette: {
    ambient1: string;
    ambient2: string;
    ambient3: string;
    dark: string;
  };
  explanation: string;
  explanationSections: {
    title: string;
    paragraphs: string[];
  }[];
  situations: string[];
  imagePrompt: string;
};

export const tracks: Track[] = [
  {
    id: "heathens",
    title: "Heathens",
    artist: "Twenty One Pilots",
    chapters: "Capitoli 1-6",
    idea: "Olivo è in un posto dove deve stare attento a tutti.",
    sectionTitle: "Sopravvivere",
    shortLine: "La comunità non è un rifugio: è il primo luogo da cui scappare.",
    imageSrc: "/images/01-heathens.jpg",
    canvasSrc: "/canvas/01-heathens.mp4",
    audioSrc: "/audio/01-heathens.mp3",
    cueStartSeconds: 52,
    palette: {
      ambient1: "#2E3438",
      ambient2: "#6B7F6A",
      ambient3: "#B6A16A",
      dark: "#050608",
    },
    explanation:
      "Ho scelto Heathens per i capitoli 1-6 perché rappresenta bene la comunità in cui vive Olivo. Questo luogo dovrebbe proteggerlo, ma in realtà è pieno di tensione e paura. Olivo deve stare attento a Mungiu e al suo gruppo, perché sa che possono fargli del male. La scena del terrazzo dimostra che il pericolo è concreto. La canzone è adatta perché trasmette diffidenza e minaccia: sembra dire che, in un gruppo di persone fragili e violente, bisogna muoversi con cautela per sopravvivere.",
    explanationSections: [
      {
        title: "Cosa succede nei capitoli",
        paragraphs: [
          "Olivo vive in una comunità per ragazzi difficili. Lui non si sente al sicuro, perché ha paura di Mungiu. Mungiu pensa che Olivo lo abbia denunciato per il nascondiglio della droga.",
          "All’inizio Olivo cerca di evitare il refettorio perché teme di incontrarlo. Poi la paura diventa reale: Mungiu e il suo gruppo lo rapiscono di notte, gli mettono un sacchetto in testa e lo portano sul terrazzo. Lì lo minacciano e lo sollevano oltre il bordo. Olivo riesce a salvarsi solo usando la sua capacità di osservazione: capisce che Jessica ha tradito Mungiu e lo rivela.",
          "Dopo quell’episodio, Olivo capisce che restare in comunità è troppo pericoloso. Per questo accetta di partire con Sonia Sperlari.",
        ],
      },
      {
        title: "Cosa deve far sentire questa parte",
        paragraphs: [
          "Questa parte deve far sentire paura, diffidenza e pericolo.",
          "Olivo non è in mezzo a mostri o criminali professionisti. È in mezzo a ragazzi feriti, arrabbiati, imprevedibili. Alcuni sono fragili, altri violenti. Il problema è che non sai mai chi può diventare una minaccia.",
        ],
      },
      {
        title: "Perché la canzone funziona",
        paragraphs: [
          "“Heathens” funziona perché sembra parlare proprio di un gruppo di persone difficili, pericolose, da cui bisogna guardarsi. Non è una canzone triste: è una canzone sospettosa, chiusa, tesa.",
          "Per Olivo la comunità è così: un posto dove deve controllare ogni dettaglio, scegliere le parole giuste e non fidarsi troppo. Il titolo stesso, “Heathens”, richiama persone ai margini, fuori dalle regole, potenzialmente pericolose. Il brano è dei Twenty One Pilots ed è legato alla colonna sonora di Suicide Squad, quindi anche ufficialmente ha un immaginario di personaggi problematici e fuori controllo.",
        ],
      },
      {
        title: "Motivazione pronta per l’elaborato",
        paragraphs: [
          "Ho scelto “Heathens” per i capitoli 1-6 perché rappresenta bene la comunità in cui vive Olivo. Questo luogo dovrebbe proteggerlo, ma in realtà è pieno di tensione e paura. Olivo deve stare attento a Mungiu e al suo gruppo, perché sa che possono fargli del male. La scena del terrazzo dimostra che il pericolo è concreto. La canzone è adatta perché trasmette diffidenza e minaccia: sembra dire che, in un gruppo di persone fragili e violente, bisogna muoversi con cautela per sopravvivere.",
        ],
      },
    ],
    situations: [
      "Olivo nella comunità",
      "Asa che lo provoca e lo costringe a uscire",
      "refettorio pieno di gruppi e tensioni",
      "paura di Mungiu",
      "sacchetto in testa e minaccia sul terrazzo",
      "decisione di partire con Sonia",
    ],
    imagePrompt:
      "A dark cinematic scene inside a youth community for troubled teenagers. A narrow cold corridor with fluorescent lights, grey concrete walls, metal doors, and a lonely teenage boy standing near the entrance of his room, holding a few worn books close to his chest. At the end of the corridor there is a threatening group of blurred teenage silhouettes, one taller figure standing in the center, suggesting danger without showing violence. In the foreground: a metal bed, a chupa chups, a key, scattered books, and a rooftop railing seen through a distant window. The mood must feel tense, suspicious and unsafe, as if everyone is watching everyone. Inspired by the song Heathens: outsiders, mistrust, danger inside a closed group. Cinematic dark young adult thriller, realistic but slightly stylized, cold green fluorescent light, deep shadows, film grain, no clear faces, no readable text, no logos, no blood, no explicit violence.",
  },
  {
    id: "creep",
    title: "Creep",
    artist: "Radiohead",
    chapters: "Capitoli 7-12",
    idea: "Olivo entra in una nuova vita, ma si sente diverso.",
    sectionTitle: "Fuori posto",
    shortLine: "Olivo entra in una nuova vita, ma non riesce ancora ad abitarla.",
    imageSrc: "/images/02-creep.jpg",
    canvasSrc: "/canvas/02-creep.mp4",
    audioSrc: "/audio/02-creep.mp3",
    cueStartSeconds: 58,
    palette: {
      ambient1: "#5E718A",
      ambient2: "#4B3F63",
      ambient3: "#D8CDB8",
      dark: "#0B1020",
    },
    explanation:
      "Ho scelto Creep per i capitoli 7-12 perché Olivo entra in una nuova vita, ma non riesce a sentirsi parte di essa. Arriva a Torino, vive a casa di Sonia, conosce Manon e inizia la scuola con Serafine, Matilda e Francesco. Anche se alcuni compagni lo accolgono, lui resta distante, perché il suo passato e il trauma del lago lo separano dagli altri. La canzone è adatta perché fa capire la sensazione di essere in mezzo alle persone, ma sentirsi comunque diverso, fuori posto e difficile da capire.",
    explanationSections: [
      {
        title: "Cosa succede nei capitoli",
        paragraphs: [
          "Olivo lascia la comunità e arriva a Torino con Sonia Sperlari. Va a vivere temporaneamente a casa sua, conosce Manon e poi viene mandato in una scuola nuova con una falsa identità.",
          "A scuola incontra Serafine, Matilda e Francesco. Loro iniziano ad accoglierlo, ma Olivo non riesce comunque a sentirsi come gli altri. È intelligente, osserva tutto, capisce dettagli che agli altri sfuggono, ma nei rapporti normali è impacciato e distante.",
          "In questi capitoli si scopre anche il suo trauma: da bambino è rimasto chiuso nel bagagliaio dell’auto finita nel lago. Quindi Olivo non è solo strano: è un ragazzo segnato da qualcosa di enorme.",
        ],
      },
      {
        title: "Cosa deve far sentire questa parte",
        paragraphs: [
          "Questa parte deve far sentire estraneità.",
          "Olivo è dentro una casa, dentro una classe, dentro un possibile gruppo di amici. Però non si sente davvero dentro. È presente fisicamente, ma emotivamente resta fuori.",
        ],
      },
      {
        title: "Perché la canzone funziona",
        paragraphs: [
          "“Creep” funziona perché racconta esattamente questa sensazione: essere in mezzo agli altri e sentirsi sbagliati. Non è la canzone della scuola in generale: è la canzone di Olivo mentre guarda gli altri vivere una normalità che lui non riesce ad avere.",
          "Nei capitoli 7-12 lui vorrebbe forse essere accettato, ma non sa come comportarsi. Serafine, Matilda e Francesco gli danno spazio, però lui resta chiuso. “Creep” rende credibile questo contrasto: desiderare un posto, ma sentirsi inadatto. Il brano è una traccia di Pablo Honey dei Radiohead, pubblicato da XL Recordings.",
        ],
      },
      {
        title: "Motivazione pronta per l’elaborato",
        paragraphs: [
          "Ho scelto “Creep” per i capitoli 7-12 perché Olivo entra in una nuova vita, ma non riesce a sentirsi parte di essa. Arriva a Torino, vive a casa di Sonia, conosce Manon e inizia la scuola con Serafine, Matilda e Francesco. Anche se alcuni compagni lo accolgono, lui resta distante, perché il suo passato e il trauma del lago lo separano dagli altri. La canzone è adatta perché fa capire la sensazione di essere in mezzo alle persone, ma sentirsi comunque diverso, fuori posto e difficile da capire.",
        ],
      },
    ],
    situations: [
      "arrivo a Torino",
      "casa di Sonia e Manon",
      "nuova scuola",
      "primo contatto con Serafine",
      "Matilda e Francesco che lo accolgono",
      "trauma del bagagliaio nel lago",
    ],
    imagePrompt:
      "A lonely teenage boy sitting at the back of an art classroom in Turin, separated from the rest of the students. The classmates are blurred and distant, gathered around desks with sketchbooks and pencils. The boy looks calm but isolated, with books beside him and an unfinished animal drawing on the desk. Tall classroom windows reflect a dark lake, car headlights, and the vague shape of a car trunk, suggesting a traumatic memory without showing it directly. The room has soft cold daylight, dusty air, paper sheets floating slightly, and a feeling of silence around him. Inspired by the song Creep: feeling different, out of place, wanting to belong but staying distant. Cinematic emotional style, realistic but slightly stylized, cold blue and grey tones, no clear faces, no readable text, no logos, no explicit accident scene.",
  },
  {
    id: "way-down-we-go",
    title: "Way Down We Go",
    artist: "KALEO",
    chapters: "Capitoli 13-18",
    idea: "Olivo scende passo dopo passo nella trappola.",
    sectionTitle: "Discesa",
    shortLine: "Dalla strada alla cisterna, ogni passo porta Olivo più in basso.",
    imageSrc: "/images/03-way-down-we-go.jpg",
    canvasSrc: "/canvas/03-way-down-we-go.mp4",
    audioSrc: "/audio/03-way-down-we-go.mp3",
    cueStartSeconds: 49,
    palette: {
      ambient1: "#102A43",
      ambient2: "#020A12",
      ambient3: "#8A4B2F",
      dark: "#030712",
    },
    explanation:
      "Ho scelto Way Down We Go per i capitoli 13-18 perché questa parte del romanzo è una vera discesa nel pericolo. Olivo viene seguito dalla Golf grigia, indaga da solo, studia le mappe in biblioteca e alla fine viene rapito e portato in una cisterna. La canzone ha un ritmo lento e pesante, che fa sentire la trappola chiudersi passo dopo passo. È adatta perché la discesa è sia fisica, verso il sottosuolo, sia narrativa, dentro il cuore del mistero.",
    explanationSections: [
      {
        title: "Cosa succede nei capitoli",
        paragraphs: [
          "In questi capitoli Olivo capisce di essere seguito da una Golf grigia. Invece di avvisare subito Sonia, continua a muoversi da solo. Si mette anche volontariamente in situazioni rischiose, perché vuole capire chi c’è dietro le sparizioni.",
          "Poi va in biblioteca, studia mappe e vie di fuga, cerca di seminare chi lo segue. Alla fine però viene rapito. Gli mettono un cappuccio, lo legano, lo portano su un furgone e poi in uno spazio buio, freddo, metallico, simile a una cisterna.",
        ],
      },
      {
        title: "Cosa deve far sentire questa parte",
        paragraphs: [
          "Questa parte deve far sentire una trappola che si chiude.",
          "Non succede tutto all’improvviso. Il pericolo cresce poco alla volta: prima l’auto, poi la biblioteca, poi il furgone, poi la cisterna.",
        ],
      },
      {
        title: "Perché la canzone funziona",
        paragraphs: [
          "“Way Down We Go” funziona perché la storia va davvero verso il basso. Olivo passa dalla superficie della città al sottosuolo. La canzone ha un ritmo lento, pesante, quasi inevitabile. Sembra accompagnare ogni passo verso la trappola.",
          "Non rappresenta solo il rapimento. Rappresenta tutto il percorso: Olivo decide di rischiare, segue gli indizi, entra nel pericolo e finisce fisicamente sotto terra. Il brano è dei KALEO ed è incluso nell’album A/B.",
        ],
      },
      {
        title: "Motivazione pronta per l’elaborato",
        paragraphs: [
          "Ho scelto “Way Down We Go” per i capitoli 13-18 perché questa parte del romanzo è una vera discesa nel pericolo. Olivo viene seguito dalla Golf grigia, indaga da solo, studia le mappe in biblioteca e alla fine viene rapito e portato in una cisterna. La canzone ha un ritmo lento e pesante, che fa sentire la trappola chiudersi passo dopo passo. È adatta perché la discesa è sia fisica, verso il sottosuolo, sia narrativa, dentro il cuore del mistero.",
        ],
      },
    ],
    situations: [
      "Golf grigia che segue Olivo",
      "Olivo che sceglie di non avvisare subito Sonia",
      "biblioteca e mappe",
      "cappuccio, furgone e rapimento",
      "spazio buio, freddo e metallico",
    ],
    imagePrompt:
      "A cinematic vertical composition showing a teenage boy walking alone on a rainy street outside a school. Behind him, reflected in a puddle, a grey car with dark windows follows from a distance. The puddle reflection transforms into an underground metallic cistern: rusty pipes, black water, condensation, cold vapor, industrial lights and wet metal walls. In the middle of the image, faint layers of library shelves, maps and escape plans blend into the scene, showing the path from investigation to trap. The boy is small compared to the environment, as if he is being pulled downward. Inspired by the song Way Down We Go: a slow descent into danger, from the surface to the underground. Dark blues, wet asphalt, rust, cinematic thriller mood, no clear faces, no readable plates, no logos, no gore, no explicit kidnapping.",
  },
  {
    id: "coraline",
    title: "CORALINE",
    artist: "Måneskin",
    chapters: "Capitoli 19-24",
    idea: "Il vero problema non è Gustavo, ma il trauma di Olivo.",
    sectionTitle: "Ferita",
    shortLine: "Il falso mostro cade. Il trauma resta.",
    imageSrc: "/images/04-coraline.jpg",
    canvasSrc: "/canvas/04-coraline.mp4",
    audioSrc: "/audio/04-coraline.mp3",
    cueStartSeconds: 44,
    palette: {
      ambient1: "#111827",
      ambient2: "#7F1D1D",
      ambient3: "#E5E7EB",
      dark: "#08060A",
    },
    explanation:
      "Ho scelto CORALINE per i capitoli 19-24 perché questa parte mostra il trauma di Olivo. All'inizio sembra che Gustavo sia il vero mostro, ma poi Olivo capisce che lui e il suo gruppo non sono i veri rapitori. Dopo questa falsa pista, il romanzo porta al centro la ferita del protagonista: il ricordo del bagagliaio, dell'acqua e della cisterna ritorna durante il momento con Manon. La canzone è adatta perché cresce lentamente e poi diventa intensa, proprio come un dolore che Olivo non riesce più a trattenere.",
    explanationSections: [
      {
        title: "Cosa succede nei capitoli",
        paragraphs: [
          "Dopo il rapimento, Olivo si ritrova davanti Gustavo e il suo gruppo. Per un momento sembra che siano loro i veri colpevoli. Gustavo fa paura, parla di violenza e vuole dominare la scena.",
          "Poi però Olivo capisce che non sono loro i veri rapitori. Gustavo e i suoi sono pericolosi, ma non sono il centro del caso. La loro minaccia è in parte una messa in scena.",
          "Dopo questa falsa pista, la storia si sposta su Olivo. Il momento con Manon fa riemergere il trauma del passato: il bagagliaio, l’acqua, la sensazione di soffocare. Olivo ha una crisi, urla, si chiude in bagno e si rifugia nella vasca.",
        ],
      },
      {
        title: "Cosa deve far sentire questa parte",
        paragraphs: [
          "Questa parte deve far sentire dolore che torna fuori.",
          "Prima sembra una scena da thriller, con Gustavo come mostro. Poi si capisce che il vero punto è un altro: Olivo porta dentro una ferita che non ha mai superato.",
        ],
      },
      {
        title: "Perché la canzone funziona",
        paragraphs: [
          "“CORALINE” funziona perché non è solo aggressiva: è emotiva, dolorosa e cresce lentamente. Questo è importante, perché il trauma di Olivo non esplode subito. Prima resta nascosto. Poi, quando Manon si avvicina, torna fuori tutto insieme.",
          "La canzone segue bene questo movimento: parte più intima, poi diventa più intensa. Per questo rappresenta non tanto Gustavo, ma Olivo che crolla. Il brano è dei Måneskin ed è contenuto nell’album Teatro d’ira - Vol. I.",
        ],
      },
      {
        title: "Motivazione pronta per l’elaborato",
        paragraphs: [
          "Ho scelto “CORALINE” per i capitoli 19-24 perché questa parte mostra il trauma di Olivo. All’inizio sembra che Gustavo sia il vero mostro, ma poi Olivo capisce che lui e il suo gruppo non sono i veri rapitori. Dopo questa falsa pista, il romanzo porta al centro la ferita del protagonista: il ricordo del bagagliaio, dell’acqua e della cisterna ritorna durante il momento con Manon. La canzone è adatta perché cresce lentamente e poi diventa intensa, proprio come un dolore che Olivo non riesce più a trattenere.",
        ],
      },
    ],
    situations: [
      "stanza sotterranea",
      "Gustavo come falso colpevole",
      "minaccia che sembra una messa in scena",
      "Manon che fa riaffiorare il passato",
      "crisi di Olivo",
      "bagno, vasca e trauma",
    ],
    imagePrompt:
      "A dark emotional cinematic scene split between two connected spaces. On one side, an underground room with a single chair under a hanging light, fake threatening props, cardboard silhouettes and theatrical shadows, showing that the supposed monster is only a false scene. On the other side, a small bathroom with a bathtub, still water, steam, and a cracked mirror reflecting the same teenage boy in a distorted and fragile way. A cap lies on the floor, wet papers are scattered, and the light from the crack in the mirror looks like a scar. The image must express trauma returning: the memory of the car trunk, water and the cistern. Inspired by the song CORALINE: pain hidden inside, fragility, emotional collapse. Dark blue, black, cold white light, red police reflections very subtle, no clear faces, no blood, no explicit violence, no sexual scene.",
  },
  {
    id: "uprising",
    title: "Uprising",
    artist: "Muse",
    chapters: "Capitoli 25-30",
    idea: "I ragazzi scomparsi non sono vittime: si ribellano.",
    sectionTitle: "Rivolta",
    shortLine: "Le vittime non erano ferme: stavano preparando la loro fuga.",
    imageSrc: "/images/05-uprising.jpg",
    canvasSrc: "/canvas/05-uprising.mp4",
    audioSrc: "/audio/05-uprising.mp3",
    cueStartSeconds: 37,
    palette: {
      ambient1: "#030712",
      ambient2: "#5D8C54",
      ambient3: "#E36A2C",
      dark: "#020617",
    },
    explanation:
      "Ho scelto Uprising per i capitoli 25-30 perché qui la storia si ribalta. I ragazzi scomparsi non sono vittime passive: hanno organizzato il finto rapimento, il riscatto e la fuga. Il borsone che sparisce sott'acqua e la pinna nera mostrano che le salamandre avevano previsto tutto. La canzone è adatta perché trasmette forza collettiva e ribellione: rappresenta il momento in cui i ragazzi riprendono il controllo contro gli adulti che li hanno feriti o ignorati.",
    explanationSections: [
      {
        title: "Cosa succede nei capitoli",
        paragraphs: [
          "Il rapitore chiede un riscatto. La polizia organizza lo scambio nel canale sotterraneo. Sembra che gli adulti abbiano tutto sotto controllo.",
          "In realtà succede il contrario. Il borsone con i soldi sparisce sott’acqua e Olivo vede una pinna nera. Poi, parlando con Serafine, capisce la verità: non esiste un rapitore unico. I ragazzi scomparsi hanno organizzato tutto. Le salamandre hanno finto i rapimenti, usato le debolezze delle famiglie e preparato la fuga.",
        ],
      },
      {
        title: "Cosa deve far sentire questa parte",
        paragraphs: [
          "Questa parte deve far sentire ribaltamento.",
          "Prima pensiamo che i ragazzi siano vittime. Poi scopriamo che sono loro ad aver preso il controllo. Non stanno solo scappando: stanno reagendo contro adulti corrotti, famiglie ipocrite e bulli.",
        ],
      },
      {
        title: "Perché la canzone funziona",
        paragraphs: [
          "“Uprising” funziona perché non è una canzone di paura: è una canzone di ribellione. Ha un ritmo forte, regolare, quasi da marcia. Questo si collega bene alle salamandre, perché non agiscono da sole e in modo casuale: sono un gruppo organizzato.",
          "La canzone dà energia al momento in cui la storia cambia: i ragazzi non sono più quelli da salvare, ma quelli che hanno costruito il piano. “Uprising” è il singolo principale dell’album The Resistance dei Muse, e anche il titolo dell’album rafforza l’idea di opposizione e resistenza.",
        ],
      },
      {
        title: "Motivazione pronta per l’elaborato",
        paragraphs: [
          "Ho scelto “Uprising” per i capitoli 25-30 perché qui la storia si ribalta. I ragazzi scomparsi non sono vittime passive: hanno organizzato il finto rapimento, il riscatto e la fuga. Il borsone che sparisce sott’acqua e la pinna nera mostrano che le salamandre avevano previsto tutto. La canzone è adatta perché trasmette forza collettiva e ribellione: rappresenta il momento in cui i ragazzi riprendono il controllo contro gli adulti che li hanno feriti o ignorati.",
        ],
      },
    ],
    situations: [
      "richiesta di riscatto",
      "canale sotterraneo",
      "borsone trascinato sott'acqua",
      "pinna nera vista da Olivo",
      "Serafine che rivela il piano",
      "scoperta delle salamandre",
    ],
    imagePrompt:
      "A dramatic underground water canal beneath a city at night. Police flashlight beams cut through the darkness from above, but they fail to reach the real action. In the center, a waterproof money bag floats on black water and is being pulled silently under the surface by an unseen swimmer. A black diving fin appears for one second near the water. Around the canal, wet ransom letters dissolve into ripples, and a faint salamander symbol glows on a piece of soaked paper. In the background, blurred teenage silhouettes move through the tunnel with purpose, organized and calm. The image must show that the missing teenagers are not helpless victims, but a secret rebellious group. Inspired by the song Uprising: rebellion, collective strength, taking control. Dark metallic tones, water reflections, emergency lights, cinematic thriller style, no gore, no clear faces, no readable text, no weapons.",
  },
  {
    id: "wait",
    title: "Wait",
    artist: "M83",
    chapters: "Capitoli 31-41",
    idea: "Olivo può fuggire con gli altri, ma sceglie un'altra strada.",
    sectionTitle: "Scegliere",
    shortLine: "La libertà arriva in silenzio: Olivo sale sulla barca, poi scende da solo.",
    imageSrc: "/images/06-wait.jpg",
    canvasSrc: "/canvas/06-wait.mp4",
    audioSrc: "/audio/06-wait.mp3",
    cueStartSeconds: 51,
    palette: {
      ambient1: "#C7D2FE",
      ambient2: "#1E3A5F",
      ambient3: "#F2B880",
      dark: "#040713",
    },
    explanation:
      "Ho scelto Wait per i capitoli 31-41 perché il finale del romanzo non è solo una fuga, ma una scelta. Olivo attraversa i sotterranei con Mungiu, trova la grotta delle salamandre, sale sulla barca e arriva sul Po all'alba. A quel punto potrebbe restare con il gruppo, ma decide di scendere e continuare da solo verso sua madre. La canzone è adatta perché ha un'atmosfera lenta e malinconica: accompagna bene la libertà della fuga, ma anche la solitudine del distacco finale.",
    explanationSections: [
      {
        title: "Cosa succede nei capitoli",
        paragraphs: [
          "Nel finale Olivo capisce che le salamandre non hanno finito. Studia le mappe del sottosuolo di Torino e chiede aiuto a Mungiu. Insieme attraversano i cunicoli, trovano la finta bomba e poi arrivano alla villa dove si nasconde il gruppo.",
          "Olivo e Mungiu entrano nel giardino, trovano lo stagno e passano dietro la cascata. Lì scoprono la grotta delle salamandre. I ragazzi sono pronti a scappare in barca attraverso i sotterranei.",
          "Olivo sale con loro. La barca attraversa il tunnel buio e poi sbuca nel Po all’alba. Per un attimo sembra che Olivo abbia trovato un gruppo. Però poi decide di scendere. Non resta con Serafine e gli altri: vuole cercare sua madre da solo.",
        ],
      },
      {
        title: "Cosa deve far sentire questa parte",
        paragraphs: [
          "Questa parte deve far sentire libertà e separazione insieme.",
          "Non è una corsa frenetica. È una fuga lenta, silenziosa, quasi sospesa. Il punto importante non è solo che Olivo scappa: è che sceglie di non andare con gli altri.",
        ],
      },
      {
        title: "Perché la canzone funziona",
        paragraphs: [
          "“Wait” funziona perché ha un’atmosfera lenta, ampia, malinconica. Non rende il finale un inseguimento, ma un momento di passaggio. Va bene per la barca nel tunnel, per l’alba sul Po e per il distacco finale.",
          "La canzone rappresenta bene l’idea che Olivo sia libero, ma non completamente felice. Ha trovato le salamandre, ha trovato un possibile gruppo, ma sceglie una strada più solitaria. Il video ufficiale di “Wait” viene presentato come il capitolo finale di una trilogia visiva di M83, quindi è già legato a un’idea di chiusura e trasformazione.",
        ],
      },
      {
        title: "Motivazione pronta per l’elaborato",
        paragraphs: [
          "Ho scelto “Wait” per i capitoli 31-41 perché il finale del romanzo non è solo una fuga, ma una scelta. Olivo attraversa i sotterranei con Mungiu, trova la grotta delle salamandre, sale sulla barca e arriva sul Po all’alba. A quel punto potrebbe restare con il gruppo, ma decide di scendere e continuare da solo verso sua madre. La canzone è adatta perché ha un’atmosfera lenta e malinconica: accompagna bene la libertà della fuga, ma anche la solitudine del distacco finale.",
        ],
      },
    ],
    situations: [
      "mappe sotterranee",
      "alleanza con Mungiu",
      "finta bomba",
      "villa e stagno",
      "cascata e grotta",
      "salamandre pronte a fuggire",
      "barca sul Po",
      "Olivo che sceglie di andare da solo",
    ],
    imagePrompt:
      "A slow cinematic finale at dawn. Ancient underground maps fade into wet stone tunnels under Turin. A teenage boy and a rough teenage silhouette move with a flashlight through dark passages, then reach a villa garden, a pond and a hidden waterfall. Behind the waterfall there is a cave where teenage silhouettes prepare a narrow boat. The boat glides through a black tunnel and emerges onto the Po river at sunrise. One lonely boy steps off onto the riverbank while the others continue into the mist. Inspired by the song Wait by M83: suspended freedom, melancholy, separation, transformation. Wide cinematic composition, soft dawn light, water reflections, mist, no clear faces, no logos, no readable text, no blood, no explicit violence.",
  },
];
