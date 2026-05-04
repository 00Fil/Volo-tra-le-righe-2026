export type Track = {
  id: string;
  title: string;
  artist: string;
  chapters: string;
  idea: string;
  sectionTitle: string;
  shortLine: string;
  imageSrc: string;
  mobileImageSrc: string;
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
    idea: "Olivo vive in comunità, cerca di non attirare l'attenzione e teme Mungiu.",
    sectionTitle: "Comunità",
    shortLine:
      "Nei primi capitoli Olivo è in comunità: Mungiu lo minaccia e Sonia diventa la possibilità di andarsene.",
    imageSrc: "/images/01-heathens.jpg",
    mobileImageSrc: "/images/mobile/01-heathens-mobile.jpg",
    canvasSrc: "/canvas/01-heathens.mp4",
    audioSrc: "/audio/01-heathens.mp3",
    cueStartSeconds: 22,
    palette: {
      ambient1: "#2E3438",
      ambient2: "#6B7F6A",
      ambient3: "#B6A16A",
      dark: "#050608",
    },
    explanation:
      "Ho scelto Heathens per i capitoli 1-6 perché Olivo vive in una comunità dove non si sente al sicuro. Mungiu è convinto che sia stato lui a fare la spia e arriva a minacciarlo sul terrazzo. In questi capitoli Sonia Sperlari gli presenta anche il caso dei quattro ragazzi scomparsi a Torino. La canzone dà proprio l'idea di un posto dove non ci si può fidare di nessuno.",
    explanationSections: [
      {
        title: "Cosa succede",
        paragraphs: [
          "All'inizio Olivo si trova in una comunità per ragazzi difficili. Non vive questa situazione con tranquillità: cerca di evitare problemi, soprattutto con Mungiu, che è convinto che sia stato lui a rivelare il nascondiglio della droga agli educatori.",
          "Asa lo provoca in continuazione, ma alla fine è Ettore, un educatore, a convincerlo a uscire per il pranzo. Nel refettorio Olivo osserva tutti e cerca di capire se Mungiu lo stia ignorando davvero o stia preparando qualcosa.",
          "Nel frattempo Sonia Sperlari, commissaria di polizia, arriva in comunità perché vuole l'aiuto di Olivo. A Torino sono scomparsi quattro adolescenti e lei sa che Olivo ha capacità fuori dal comune nell'osservare dettagli e collegare informazioni.",
          "Sul terrazzo gli mettono un sacchetto in testa e Mungiu lo solleva oltre il bordo, pronto a lasciarlo cadere. Olivo si salva accusando Jessica: è stata lei a far scoprire l'erba, perché da due mesi ha una relazione segreta con Ottaviano. Mungiu va a controllare e non torna più, segno che Olivo ha detto la verità. Dopo questa scena Olivo capisce che restare in comunità è troppo rischioso e accetta di partire con Sonia.",
        ],
      },
      {
        title: "Filo dell'indagine",
        paragraphs: [
          "L'indagine comincia davvero quando Sonia spiega a Olivo il caso: quattro ragazzi sono spariti a Torino e la polizia non sa chi li abbia presi né perché. Sonia non cerca solo un testimone, ma qualcuno capace di leggere dettagli che gli altri non vedono.",
          "Questa parte serve a presentare due cose insieme: la situazione di Olivo nella comunità, dove non è al sicuro, e il motivo per cui viene portato a Torino. È la paura di Mungiu e la minaccia di Jessica a spingerlo ad accettare, anche se non sa ancora quanto sarà pericolosa la nuova situazione.",
        ],
      },
      {
        title: "Personaggi",
        paragraphs: [
          "Olivo è il protagonista: osserva molto e cerca di sopravvivere senza farsi notare. Mungiu è il ragazzo che lo minaccia e rappresenta il pericolo principale nella comunità. Asa lo provoca e lo spinge a esporsi. Jessica è importante perché il suo tradimento diventa l'informazione che salva Olivo sul terrazzo. Ettore è l'educatore che si preoccupa per lui e prova a rassicurarlo. Sonia Sperlari è la commissaria che lo porta via dalla comunità per coinvolgerlo nell'indagine.",
        ],
      },
      {
        title: "Perché la canzone funziona",
        paragraphs: [
          "Heathens è adatta perché il testo e l'atmosfera fanno pensare a un gruppo di persone difficili, chiuse e poco prevedibili. Questo rispecchia la comunità, dove Olivo non si sente protetto e deve valutare continuamente i comportamenti degli altri.",
          "La canzone non serve a descrivere un singolo fatto, ma il clima dei primi capitoli: sospetto, paura e necessità di difendersi. Per questo accompagna bene la scena del refettorio, il rapporto con Mungiu e la decisione finale di andare via.",
        ],
      },
      {
        title: "Motivazione pronta per l'elaborato",
        paragraphs: [
          "Abbiamo scelto Heathens per questa prima sezione perché Olivo vive in una comunità dove non si sente al sicuro. Mungiu è convinto che sia stato lui a fare la spia e arriva a minacciarlo sul terrazzo. In questi capitoli Sonia Sperlari gli presenta anche il caso dei quattro ragazzi scomparsi a Torino. La canzone, a nostro parere, suggerisce proprio l'idea di un posto dove non ci si può fidare di nessuno.",
        ],
      },
    ],
    situations: [
      "Olivo nella comunità",
      "Asa che lo provoca e lo costringe a uscire",
      "refettorio pieno di gruppi e tensioni",
      "paura di Mungiu",
      "sacchetto in testa e minaccia sul terrazzo",
      "Jessica smascherata per salvare Olivo",
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
    idea: "Olivo arriva a Torino e prova una vita normale, ma il suo passato lo blocca.",
    sectionTitle: "Fuori posto",
    shortLine:
      "A Torino Olivo incontra Sonia, Manon e nuovi compagni, però si sente ancora diverso dagli altri.",
    imageSrc: "/images/02-creep.jpg",
    mobileImageSrc: "/images/mobile/02-creep-mobile.jpg",
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
      "Ho scelto Creep per i capitoli 7-12 perché Olivo arriva a Torino e sembra avere una possibilità di vita normale: Sonia lo ospita, conosce Manon e a scuola incontra Serafine, Matilda e Francesco. In realtà è lì anche per capire cosa sia successo ai ragazzi scomparsi. Fa capire bene come Olivo si sente diverso e fuori posto anche quando è in mezzo agli altri.",
    explanationSections: [
      {
        title: "Cosa succede",
        paragraphs: [
          "Dopo la comunità, Olivo arriva a Torino con Sonia Sperlari. Va a vivere a casa sua, dove conosce Manon, la figlia diciassettenne: vivace, provocatoria e senza filtri. L'ambiente è diverso dalla comunità, ma non necessariamente più semplice.",
          "Sonia lo manda a scuola con una falsa identità perché la scuola è collegata al caso dei ragazzi scomparsi. In classe Olivo incontra Serafine, Matilda e Francesco: loro provano ad avvicinarlo e a farlo entrare nel gruppo.",
          "Olivo però non riesce a comportarsi come un ragazzo qualunque. Rimane attento, rigido e spesso distante. In questi capitoli racconta per la prima volta a Manon cosa gli è successo da bambino: il padre ha fatto finire l'auto nel lago e lui è rimasto chiuso nel bagagliaio per ore. Dopo quell'evento qualcosa è cambiato nel suo cervello e nel suo modo di stare con gli altri.",
        ],
      },
      {
        title: "Filo dell'indagine",
        paragraphs: [
          "A Torino Olivo non è solo ospite di Sonia: viene inserito nella scuola per osservare dall'interno l'ambiente vicino ai ragazzi scomparsi. La sua capacità di leggere persone, oggetti e comportamenti diventa lo strumento principale dell'indagine.",
          "Serafine, Matilda e Francesco non sono soltanto nuovi compagni: Serafine è l'unica persona collegata a tre dei quattro ragazzi scomparsi. Per questo la polizia ha messo Olivo nella sua classe. Questi capitoli collegano la nuova vita di Olivo alla ricerca dei ragazzi scomparsi.",
        ],
      },
      {
        title: "Personaggi",
        paragraphs: [
          "Sonia Sperlari è la commissaria che lo ospita e lo usa anche come aiuto nell'indagine. Manon è sua figlia e mostra a Olivo una vita familiare complicata ma reale: è la prima persona a cui racconta davvero il suo passato. Serafine, Matilda e Francesco sono compagni di scuola importanti: sembrano nuovi amici, ma sono anche collegati al mistero dei ragazzi scomparsi.",
        ],
      },
      {
        title: "Perché la canzone funziona",
        paragraphs: [
          "Creep è adatta perché parla di sentirsi sbagliati e fuori posto. Questo corrisponde a Olivo: gli altri non lo rifiutano, anzi provano ad accoglierlo, ma lui non riesce comunque a sentirsi davvero dentro quella normalità.",
          "La canzone quindi non descrive un'azione precisa, ma la condizione del protagonista. Olivo è in una casa, in una classe e in un possibile gruppo di amici, però dentro di sé resta separato dagli altri.",
        ],
      },
      {
        title: "Motivazione pronta per l'elaborato",
        paragraphs: [
          "Per quanto riguarda invece i capitoli 7-12 abbiamo scelto \"Creep\" perché Olivo arriva a Torino e sembra avere una possibilità di vita normale: Sonia lo ospita, conosce Manon e a scuola incontra Serafine, Matilda e Francesco. In realtà è lì anche per capire cosa sia successo ai ragazzi scomparsi. Nel pezzo sentiamo in qualche modo espresso lo stato d'animo di Olivo, che si sente diverso e fuori posto anche quando è in mezzo agli altri.",
        ],
      },
    ],
    situations: [
      "arrivo a Torino",
      "casa di Sonia e Manon",
      "nuova scuola",
      "primo contatto con Serafine",
      "Matilda e Francesco che lo accolgono",
      "racconto del trauma del bagagliaio a Manon",
    ],
    imagePrompt:
      "A lonely teenage boy sitting at the back of an art classroom in Turin, separated from the rest of the students. The classmates are blurred and distant, gathered around desks with sketchbooks and pencils. The boy looks calm but isolated, with books beside him and an unfinished animal drawing on the desk. Tall classroom windows reflect a dark lake, car headlights, and the vague shape of a car trunk, suggesting a traumatic memory without showing it directly. The room has soft cold daylight, dusty air, paper sheets floating slightly, and a feeling of silence around him. Inspired by the song Creep: feeling different, out of place, wanting to belong but staying distant. Cinematic emotional style, realistic but slightly stylized, cold blue and grey tones, no clear faces, no readable text, no logos, no explicit accident scene.",
  },
  {
    id: "way-down-we-go",
    title: "Way Down We Go",
    artist: "KALEO",
    chapters: "Capitoli 13-18",
    idea: "Olivo capisce di essere seguito, indaga da solo e finisce nella trappola.",
    sectionTitle: "Trappola",
    shortLine:
      "La Golf grigia, lo scontro con Gustavo, le mappe e il rapimento: Olivo si espone sempre di più.",
    imageSrc: "/images/03-way-down-we-go.jpg",
    mobileImageSrc: "/images/mobile/03-way-down-we-go-mobile.jpg",
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
      "Ho scelto Way Down We Go per i capitoli 13-18 perché Olivo viene seguito dalla Golf grigia, si scontra con Gustavo, nasconde informazioni a Sonia e prova a risolvere da solo il caso. Alla fine viene rapito fuori dalla biblioteca. La musica ti fa sentire che qualcosa sta andando sempre peggio.",
    explanationSections: [
      {
        title: "Cosa succede",
        paragraphs: [
          "Olivo nota che una Golf grigia lo segue. Per lui è il primo segnale chiaro che qualcuno lo sta controllando. Invece di affidarsi subito a Sonia, decide di continuare a capire da solo cosa sta succedendo.",
          "A scuola si mette volontariamente in pericolo andando nell'ala dello scientifico, dove Gustavo lo trova e lo minaccia. Gustavo lo afferra e lo solleva, ma Olivo lo mette in difficoltà smascherando che è daltonico. Serafine e la professoressa Ballot intervengono, ma è chiaro che Olivo si sta esponendo troppo.",
          "Per questo va in biblioteca e studia mappe, vie di fuga e spostamenti possibili. Questa parte mostra Olivo mentre prova a ragionare e a usare la sua capacità di osservazione per non farsi prendere.",
          "All'uscita dalla biblioteca prova a seminare chi lo segue uscendo dal retro. Per un momento sembra funzionare, ma appena si allontana viene rapito: cappuccio, nastro, movimenti rapidi. Non sono bulli improvvisati, agiscono in modo organizzato. Olivo si risveglia legato in uno spazio metallico sotterraneo. Non è nel panico: in fondo, era quello che cercava.",
        ],
      },
      {
        title: "Filo dell'indagine",
        paragraphs: [
          "In questi capitoli Olivo non ha ancora la soluzione. Sa solo che i ragazzi scomparsi sono collegati alla scuola, che Serafine e il suo gruppo sono importanti e che qualcuno lo sta seguendo. Il problema è che tiene molte informazioni per sé.",
          "La Golf grigia è importante perché Olivo non sa chi ci sia dietro. Potrebbe essere il rapitore, la polizia o qualcun altro. Questo lo porta a non fidarsi di nessuno e a muoversi da solo, il che lo rende più vulnerabile.",
        ],
      },
      {
        title: "Personaggi",
        paragraphs: [
          "Olivo porta avanti l'indagine, ma lo fa in modo rischioso perché tiene molte cose per sé. Sonia è sotto pressione perché il caso non si risolve e teme di fallire. Gustavo è un bullo violento e pericoloso, protetto dalla famiglia. Serafine resta un contatto fondamentale e cerca di proteggerlo, ma lui la ignora.",
        ],
      },
      {
        title: "Perché la canzone funziona",
        paragraphs: [
          "Way Down We Go è adatta perché il titolo e il ritmo richiamano una discesa. Nel libro la discesa è sia concreta, perché Olivo finisce in un luogo sotterraneo, sia narrativa, perché la situazione peggiora a ogni passaggio.",
          "La canzone accompagna bene la progressione: pedinamento, scontro con Gustavo, biblioteca, rapimento. Non rappresenta solo un luogo fisico, ma il modo in cui l'indagine trascina Olivo sempre più in basso.",
        ],
      },
      {
        title: "Motivazione pronta per l'elaborato",
        paragraphs: [
          "\"Way Down We Go\" ci pare una scelta adeguata perché Olivo viene seguito dalla Golf grigia, si scontra con Gustavo, nasconde informazioni a Sonia e prova a risolvere da solo il caso. Alla fine viene rapito fuori dalla biblioteca. La musica fa avvertire che qualcosa sta andando irrimediabilmente sempre peggio.",
        ],
      },
    ],
    situations: [
      "Golf grigia che segue Olivo",
      "scontro con Gustavo nell'ala dello scientifico",
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
    idea: "La pista di Gustavo si rivela sbagliata, Sonia confessa di aver usato Olivo come esca e il trauma torna fuori con Manon.",
    sectionTitle: "Trauma",
    shortLine:
      "Gustavo sembra il colpevole ma non lo è, Sonia confessa di aver usato Olivo come esca, e il trauma del bagagliaio torna fuori con Manon.",
    imageSrc: "/images/04-coraline.jpg",
    mobileImageSrc: "/images/mobile/04-coraline-mobile.jpg",
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
      "Ho scelto Coraline per i capitoli 19-24 perché tutto crolla: Gustavo sembra il colpevole ma non lo è, Sonia ammette di aver usato Olivo come esca e il trauma del bagagliaio torna fuori con Manon. Alla fine arriva anche la richiesta di riscatto, che rimette in moto l'indagine. Parte calma ma poi diventa più forte, proprio come quello che succede a Olivo.",
    explanationSections: [
      {
        title: "Cosa succede",
        paragraphs: [
          "Olivo è legato a una sedia davanti a Gustavo e ai suoi quattro complici. Gustavo si vanta di aver rapito i quattro ragazzi e descrive torture che intende fare. Ma quando gli tolgono il cappello e vedono la cicatrice che divide il cranio di Olivo in due, Gustavo resta affascinato invece di reagire con violenza. In quel momento Sonia irrompe con la polizia.",
          "In centrale Olivo racconta nel verbale che non è stato rapito davvero, che era una specie di gioco. Sonia è furiosa perché senza la sua testimonianza non può incriminare Gustavo. Poi gli rivela la verità: la Golf grigia era della polizia, nel cappello c'era un trasmettitore e anche la scena con Mungiu in comunità era stata orchestrata per spingerlo ad accettare il caso. Olivo era un'esca dall'inizio.",
          "Di notte Manon va nella stanza di Olivo. I due si avvicinano, lei lo bacia e prende l'iniziativa. Ma a un certo punto Olivo sente tornare la sensazione di essere chiuso nel bagagliaio: ha una crisi di panico, urla e si allontana. Scoppia un litigio violento tra Manon e Sonia, che arrivano a schiaffeggiarsi. Olivo si chiude in bagno. Sonia decide che alla fine della settimana lo rimanderà in comunità.",
          "Il giorno dopo a scuola Olivo è distrutto ma prende nove e mezzo in un tema su Foscolo. Fuori lo aspetta Flavio: il rapitore si è fatto vivo con una richiesta di riscatto. Duecentocinquantamila euro per ciascun ragazzo, da consegnare in un canale sotterraneo. Olivo nota subito che il messaggio è scritto da qualcuno colto — usa il congiuntivo correttamente — e dice a Sonia di pagare senza tendere trappole. Lei non lo ascolta.",
        ],
      },
      {
        title: "Filo dell'indagine",
        paragraphs: [
          "Questa sezione serve a chiarire che Gustavo non basta come risposta. Può sembrare colpevole e violento, ma Olivo capisce che la sua crudeltà è più teatrale che reale: gli strumenti di tortura erano finti, come la tosatrice senza lame.",
          "La richiesta di riscatto sposta l'indagine su un nuovo livello: non si tratta più solo di capire chi frequenta la scuola, ma di seguire un piano organizzato che porta nei sotterranei di Torino. Il fatto che il messaggio sia scritto in modo colto dice a Olivo che il vero responsabile è molto diverso da Gustavo.",
        ],
      },
      {
        title: "Personaggi",
        paragraphs: [
          "Gustavo è importante perché sembra un colpevole possibile, ma non risolve il mistero. Sonia appare più ambigua perché ha manipolato Olivo fin dall'inizio e ora lo ammette. Manon è decisiva perché il contatto con lei fa tornare fuori il trauma. Olivo è il più fragile di tutto il libro in questi capitoli: scopre di essere stato usato, ha una crisi di panico e rischia di essere rimandato in comunità.",
        ],
      },
      {
        title: "Perché la canzone funziona",
        paragraphs: [
          "CORALINE è adatta perché ha una struttura emotiva: non resta sempre uguale, ma cresce e diventa più intensa. Questo si collega alla scena in cui Olivo non riesce più a tenere nascosto il trauma.",
          "La canzone non rappresenta Gustavo come personaggio, ma il passaggio dal mistero esterno alla ferita personale di Olivo. Funziona soprattutto per la crisi con Manon e per il ricordo dell'acqua.",
        ],
      },
      {
        title: "Motivazione pronta per l'elaborato",
        paragraphs: [
          "Abbiamo scelto Coraline per i capitoli 19-24 perché tutto crolla: Gustavo sembra il colpevole ma non lo è, Sonia ammette di aver usato Olivo come esca e il trauma del bagagliaio riaffora con Manon. Alla fine arriva anche la richiesta di riscatto, che rimette in moto l'indagine. Infatti la canzone ha un avvio lento ma poi il ritmo si fa più incalzante: situazione analoga a quella in cui si è ritrovato il protagonista.",
        ],
      },
    ],
    situations: [
      "Olivo legato davanti a Gustavo",
      "la cicatrice che sconvolge il gruppo",
      "Sonia che irrompe con la polizia",
      "il verbale in cui Olivo non accusa Gustavo",
      "la rivelazione sull'esca e sul trasmettitore",
      "Manon che fa riaffiorare il trauma",
      "crisi di panico e litigio tra Manon e Sonia",
      "il tema su Foscolo e il nove e mezzo",
      "la richiesta di riscatto",
    ],
    imagePrompt:
      "A dark emotional cinematic scene split between two connected spaces. On one side, an underground room with a single chair under a hanging light, fake threatening props, cardboard silhouettes and theatrical shadows, showing that the supposed monster is only a false scene. On the other side, a small bathroom with a bathtub, still water, steam, and a cracked mirror reflecting the same teenage boy in a distorted and fragile way. A cap lies on the floor, wet papers are scattered, and the light from the crack in the mirror looks like a scar. The image must express trauma returning: the memory of the car trunk, water and the cistern. Inspired by the song CORALINE: pain hidden inside, fragility, emotional collapse. Dark blue, black, cold white light, red police reflections very subtle, no clear faces, no blood, no explicit violence, no sexual scene.",
  },
  {
    id: "uprising",
    title: "Uprising",
    artist: "Muse",
    chapters: "Capitoli 25-30",
    idea: "Olivo capisce che i ragazzi scomparsi non sono solo vittime, ma hanno preparato una fuga.",
    sectionTitle: "Il piano",
    shortLine:
      "Olivo scopre i segreti delle famiglie, i soldi del riscatto spariscono sott'acqua e la telefonata con Serafine rivela che i ragazzi scomparsi hanno organizzato tutto.",
    imageSrc: "/images/05-uprising.jpg",
    mobileImageSrc: "/images/mobile/05-uprising-mobile.jpg",
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
      "Ho scelto Uprising per i capitoli 25-30 perché Olivo scopre che i ragazzi scomparsi non sono solo vittime: hanno organizzato un piano. Indaga sulle famiglie, trova i soldi per il riscatto, vede il borsone sparire sott'acqua e poi chiama Serafine che gli rivela la verità. Trasmette energia e voglia di ribellarsi insieme agli altri.",
    explanationSections: [
      {
        title: "Cosa succede",
        paragraphs: [
          "Olivo passa un pomeriggio in un internet point a indagare sulle famiglie dei ragazzi scomparsi. Scopre cose pesanti: un padre è un usuraio, una madre nasconde reperti archeologici di valore, un'altra famiglia ha fondi nascosti all'estero. Queste informazioni diventano la chiave per trovare i soldi del riscatto.",
          "Prima dello scambio vero, la polizia aveva già provato a tendere una trappola al rapitore nel tunnel, ma l'operazione era fallita: il rapitore non si era presentato perché aveva capito l'inganno. Sonia ammette di aver sbagliato e per la prima volta chiede davvero aiuto a Olivo.",
          "Il rapitore alza la posta mandando una scatola con quattro dita mozzate e chiedendo trecentomila euro per ciascun ragazzo. Olivo usa i segreti scoperti sulle famiglie per dimostrare che i soldi si possono trovare in fretta. La polizia organizza la consegna nel canale sotterraneo.",
          "Durante lo scambio il borsone con i soldi si muove da solo e sparisce sott'acqua. Olivo vede una pinna nera. Dopo, riesce a uscire di nascosto e chiama Serafine: lei risponde come se lo aspettasse. Gli conferma che non esiste un rapitore. Sono stati Ryan, Elena, Federico e Maria a organizzare tutto, con l'aiuto di Serafine, Francesco e Matilda. Il piano nasce dalla scoperta dei segreti e dei crimini dei loro genitori.",
        ],
      },
      {
        title: "Filo dell'indagine",
        paragraphs: [
          "Il caso cambia direzione perché gli indizi non portano più a un adulto misterioso, ma ai ragazzi stessi. I mignoli, il riscatto, il canale e la pinna nera diventano pezzi di una messa in scena.",
          "Olivo capisce che le salamandre non sono solo persone da salvare: sono un gruppo organizzato. La loro fuga nasce dalla rabbia verso famiglie corrotte, bulli e adulti che non li hanno protetti.",
        ],
      },
      {
        title: "Personaggi",
        paragraphs: [
          "Olivo osserva lo scambio e nota dettagli che gli adulti non interpretano subito. Sonia cambia: ammette i suoi errori e comincia a fidarsi davvero di Olivo. Serafine è il personaggio che gli permette di capire il piano. Ryan, Elena, Federico e Maria sono i ragazzi scomparsi che hanno finto il rapimento. Le salamandre diventano il nome del gruppo che agisce insieme per scappare.",
        ],
      },
      {
        title: "Perché la canzone funziona",
        paragraphs: [
          "Uprising è adatta perché parla di ribellione e di reazione collettiva. Questo corrisponde alle salamandre: non agiscono da sole, ma come gruppo organizzato contro adulti che li hanno traditi.",
          "Il ritmo forte della canzone aiuta a far capire il cambio di prospettiva. Prima pensiamo che i ragazzi vadano solo salvati; poi scopriamo che sono loro ad aver costruito il piano per scappare.",
        ],
      },
      {
        title: "Motivazione pronta per l'elaborato",
        paragraphs: [
          "Per i capitoli seguenti invece abbiamo scelto \"Uprising\" perché Olivo scopre che i ragazzi scomparsi non sono solo vittime: hanno organizzato un piano. Indaga sulle famiglie, trova i soldi per il riscatto, vede il borsone sparire sott'acqua e poi chiama Serafine che gli rivela la verità. La canzone trasmette energia e curiosità proprio come questa sezione della storia.",
        ],
      },
    ],
    situations: [
      "Olivo all'internet point che indaga sulle famiglie",
      "Sonia che ammette il fallimento della prima operazione",
      "le dita mozzate nella scatola",
      "i segreti delle famiglie per trovare i soldi",
      "canale sotterraneo e consegna del riscatto",
      "borsone trascinato sott'acqua",
      "pinna nera vista da Olivo",
      "telefonata a Serafine che rivela il piano",
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
    idea: "Olivo raggiunge le salamandre e potrebbe fuggire con loro, ma sceglie sua madre.",
    sectionTitle: "La scelta",
    shortLine:
      "Nel finale Olivo arriva al Po con le salamandre, poi scende dalla barca e prende un'altra strada.",
    imageSrc: "/images/06-wait.jpg",
    mobileImageSrc: "/images/mobile/06-wait-mobile.jpg",
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
      "Ho scelto Wait per i capitoli 31-41 perché Olivo chiude l'indagine sulle salamandre: attraversa i sotterranei con Mungiu, trova la bomba-bluff, raggiunge la grotta e fugge in barca fino al Po. Ma la cosa più importante diventa personale: scopre che sua madre è viva e decide di cercarla da solo, lasciando Serafine e gli altri. È lenta e un po' triste, perfetta per il finale e per la separazione.",
    explanationSections: [
      {
        title: "Cosa succede",
        paragraphs: [
          "Dopo la telefonata con Serafine, Olivo capisce che le salamandre devono ancora fare qualcosa prima di sparire. Va in biblioteca a studiare le mappe dei sotterranei di Torino e scopre che sotto il covo dei neonazisti passa un antico acquedotto romano. Chiede aiuto a Mungiu, l'unico che sa muoversi sottoterra.",
          "Nei sotterranei Olivo e Mungiu trovano una carica esplosiva piazzata sotto il covo dei neonazisti. Sopra c'è una festa e mancano tredici minuti all'esplosione. Portano fuori la bomba e fanno evacuare una piazza, ma quando il timer scade la bomba non esplode: era un bluff di Serafine. Dentro c'è un messaggio: avrebbero potuto farlo davvero, ma hanno scelto di non farlo.",
          "Sonia usa un'informazione personale per ottenere la collaborazione di Olivo: gli rivela che sua madre è viva e gli mostra una foto recente. Olivo accetta di aiutarla a trovare le salamandre, ma alle sue condizioni: niente irruzione della polizia, vuole entrare da solo con Mungiu.",
          "Nella villa Olivo spegne il trasmettitore della polizia e corre con Mungiu verso lo stagno nel giardino. Dietro una cascata trovano l'ingresso ai sotterranei. Nella caverna ci sono Serafine e le altre salamandre, con il fuoco acceso e la barca pronta. Serafine propone a Olivo di unirsi a loro.",
          "Mungiu ammette di aver aiutato Olivo perché gli doveva qualcosa, anche se prima lo negava. Decide di non salire sulla barca e si ferisce da solo per coprire Olivo con la polizia. Olivo sale sulla barca, attraversa il tunnel e sbuca nel Po all'alba. Potrebbe restare con le salamandre, ma a un certo punto dice che deve scendere. Confessa a Serafine che sua madre è viva ed è una criminale, e che vuole trovarla da solo. Si salutano. Solo dopo Olivo scopre che Serafine gli ha messo in tasca cinquemila euro. Le salamandre spariscono lungo il fiume, Olivo cammina nella direzione opposta.",
        ],
      },
      {
        title: "Filo dell'indagine",
        paragraphs: [
          "L'indagine arriva alla sua conclusione: i rapimenti erano una messinscena, i soldi servivano alla fuga e le salamandre avevano preparato un percorso nei sotterranei. La bomba sotto il covo era il loro ultimo gesto: dimostrare di poter colpire senza farlo davvero.",
          "Il finale però non risolve tutto in modo semplice. Olivo scopre che sua madre è viva e capisce che il suo obiettivo non è solo chiudere il caso, ma decidere cosa fare della propria vita.",
        ],
      },
      {
        title: "Personaggi",
        paragraphs: [
          "Olivo è davanti a una scelta: seguire il gruppo o tornare alla propria storia personale. Mungiu lo aiuta ad arrivare alle salamandre e mostra un cambiamento enorme rispetto all'inizio: si sacrifica per coprirlo con la polizia. Per Olivo è il primo vero amico. Serafine propone a Olivo di unirsi a loro ed è sincera: gli lascia anche i soldi. Sonia collega il caso alla madre di Olivo, e proprio la madre diventa il motivo per cui lui sceglie di separarsi.",
        ],
      },
      {
        title: "Perché la canzone funziona",
        paragraphs: [
          "Wait è adatta perché non ha l'energia di una fuga d'azione. Ha un tono lento, sospeso e malinconico, più vicino all'arrivo sul Po all'alba e al momento in cui Olivo deve decidere.",
          "La canzone accompagna bene il contrasto del finale: Olivo è libero, ma non completamente felice. Ha trovato un gruppo, però sceglie di non restare perché vuole cercare sua madre.",
        ],
      },
      {
        title: "Motivazione pronta per l'elaborato",
        paragraphs: [
          "Per l'ultima parte, ci siamo affidati alla canzone \"Wait\" perché Olivo chiude l'indagine sulle salamandre: attraversa i sotterranei con Mungiu, trova la bomba, raggiunge la grotta e fugge in barca fino al Po. Ma la novità più importante è di natura personale: scopre che sua madre è viva e decide di cercarla da solo, lasciando Serafine e gli altri. La canzone è lenta e un po' triste, perfetta per il finale e per la separazione.",
        ],
      },
    ],
    situations: [
      "mappe sotterranee in biblioteca",
      "alleanza con Mungiu",
      "bomba sotto il covo dei neonazisti",
      "tredici minuti al timer",
      "bomba-bluff e messaggio di Serafine",
      "Sonia che rivela che la madre è viva",
      "villa, stagno e cascata",
      "la grotta con le salamandre e il fuoco",
      "Mungiu che si sacrifica per coprire Olivo",
      "Serafine che propone a Olivo di unirsi a loro",
      "barca sul Po all'alba",
      "Olivo che sceglie di scendere",
      "la confessione sulla madre",
      "i cinquemila euro in tasca",
      "Olivo che cammina nella direzione opposta",
    ],
    imagePrompt:
      "A slow cinematic finale at dawn. Ancient underground maps fade into wet stone tunnels under Turin. A teenage boy and a rough teenage silhouette move with a flashlight through dark passages, then reach a villa garden, a pond and a hidden waterfall. Behind the waterfall there is a cave where teenage silhouettes prepare a narrow boat. The boat glides through a black tunnel and emerges onto the Po river at sunrise. One lonely boy steps off onto the riverbank while the others continue into the mist. Inspired by the song Wait by M83: suspended freedom, melancholy, separation, transformation. Wide cinematic composition, soft dawn light, water reflections, mist, no clear faces, no logos, no readable text, no blood, no explicit violence.",
  },
];