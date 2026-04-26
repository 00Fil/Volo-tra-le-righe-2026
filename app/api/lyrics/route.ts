import { NextRequest, NextResponse } from "next/server";

type LyricsProviderResponse = {
  plainLyrics?: string;
  syncedLyrics?: string;
  instrumental?: boolean;
};

type LyricsSearchItem = LyricsProviderResponse & {
  trackName?: string;
  artistName?: string;
};

type LyricsLine = {
  timeMs?: number;
  text: string;
};

const CACHE_SECONDS = 60 * 60 * 24;
const LRCLIB_BASE = "https://lrclib.net/api";
const USER_AGENT =
  process.env.LYRICS_USER_AGENT ??
  "volo-tra-le-righe-playlist/1.0 (lyrics proxy)";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function scoreMatch(
  item: LyricsSearchItem,
  artist: string,
  title: string,
) {
  const artistNorm = normalize(artist);
  const titleNorm = normalize(title);
  const itemArtist = normalize(item.artistName ?? "");
  const itemTitle = normalize(item.trackName ?? "");

  let score = 0;
  if (itemArtist === artistNorm) score += 3;
  if (itemTitle === titleNorm) score += 3;
  if (itemArtist.includes(artistNorm) || artistNorm.includes(itemArtist)) score += 1;
  if (itemTitle.includes(titleNorm) || titleNorm.includes(itemTitle)) score += 1;
  return score;
}

function parseSyncedLyrics(input: string) {
  const lines: LyricsLine[] = [];
  const entries = input.split("\n");
  const pattern = /^\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)$/;

  for (const raw of entries) {
    const line = raw.trim();
    if (!line) continue;

    const match = pattern.exec(line);
    if (!match) continue;

    const minutes = Number(match[1]);
    const seconds = Number(match[2]);
    const fractionRaw = match[3] ?? "0";
    const fraction =
      fractionRaw.length === 3
        ? Number(fractionRaw)
        : Number(fractionRaw) * 10;
    const text = match[4].trim();
    if (!text) continue;

    lines.push({
      timeMs: minutes * 60_000 + seconds * 1_000 + fraction,
      text,
    });
  }

  return lines;
}

function parsePlainLyrics(input: string) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((text) => ({ text }));
}

function normalizeLyricsPayload(payload: LyricsProviderResponse) {
  const hasSynced = Boolean(payload.syncedLyrics?.trim());
  const hasPlain = Boolean(payload.plainLyrics?.trim());
  const source = hasSynced ? "synced" : hasPlain ? "plain" : "none";

  const lines =
    source === "synced"
      ? parseSyncedLyrics(payload.syncedLyrics ?? "")
      : source === "plain"
        ? parsePlainLyrics(payload.plainLyrics ?? "")
        : [];

  return {
    source,
    lines,
    instrumental: Boolean(payload.instrumental),
  };
}

async function fetchLyricsWithGet(artist: string, title: string) {
  const params = new URLSearchParams({
    track_name: title,
    artist_name: artist,
  });

  const response = await fetch(`${LRCLIB_BASE}/get?${params.toString()}`, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: CACHE_SECONDS },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as LyricsProviderResponse;
}

async function fetchLyricsWithSearch(artist: string, title: string) {
  const params = new URLSearchParams({
    track_name: title,
    artist_name: artist,
  });

  const response = await fetch(`${LRCLIB_BASE}/search?${params.toString()}`, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: CACHE_SECONDS },
  });

  if (!response.ok) {
    return null;
  }

  const results = (await response.json()) as LyricsSearchItem[];
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const sorted = [...results].sort(
    (a, b) => scoreMatch(b, artist, title) - scoreMatch(a, artist, title),
  );

  return sorted[0];
}

export async function GET(request: NextRequest) {
  const artist = request.nextUrl.searchParams.get("artist")?.trim();
  const title = request.nextUrl.searchParams.get("title")?.trim();

  if (!artist || !title) {
    return NextResponse.json(
      { error: "missing artist/title" },
      { status: 400 },
    );
  }

  try {
    const direct = await fetchLyricsWithGet(artist, title);
    const lyrics = direct ?? (await fetchLyricsWithSearch(artist, title));

    if (!lyrics) {
      return NextResponse.json(
        { source: "none", lines: [], instrumental: false },
        { status: 200 },
      );
    }

    const payload = normalizeLyricsPayload(lyrics);
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=3600`,
      },
    });
  } catch {
    return NextResponse.json(
      { source: "none", lines: [], instrumental: false },
      { status: 200 },
    );
  }
}
