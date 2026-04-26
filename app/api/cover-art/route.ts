import { NextRequest, NextResponse } from "next/server";

type MBRecording = {
  releases?: Array<{
    "release-group"?: {
      id?: string;
    };
  }>;
};

type MusicBrainzResponse = {
  recordings?: MBRecording[];
};

type CoverArtImage = {
  front?: boolean;
  image?: string;
  thumbnails?: {
    "500"?: string;
    large?: string;
  };
};

type CoverArtResponse = {
  images?: CoverArtImage[];
};

const CACHE_SECONDS = 60 * 60 * 24;
const USER_AGENT =
  process.env.COVER_ART_USER_AGENT ??
  "volo-tra-le-righe-playlist/1.0 (cover art proxy)";

function ensureHttps(url: string) {
  return url.startsWith("http://")
    ? `https://${url.slice("http://".length)}`
    : url;
}

function extractReleaseGroupId(recordings: MBRecording[]) {
  for (const recording of recordings) {
    for (const release of recording.releases ?? []) {
      const id = release["release-group"]?.id;
      if (id) {
        return id;
      }
    }
  }

  return null;
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

  const query = encodeURIComponent(`recording:"${title}" AND artist:"${artist}"`);
  const mbUrl = `https://musicbrainz.org/ws/2/recording?query=${query}&limit=5&fmt=json`;

  try {
    const mbResponse = await fetch(mbUrl, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: CACHE_SECONDS },
    });
    if (!mbResponse.ok) {
      return NextResponse.json(
        { error: "musicbrainz lookup failed" },
        { status: 502 },
      );
    }

    const mbData = (await mbResponse.json()) as MusicBrainzResponse;
    const releaseGroupId = extractReleaseGroupId(mbData.recordings ?? []);

    if (!releaseGroupId) {
      return NextResponse.json({ error: "release-group not found" }, { status: 404 });
    }

    const caResponse = await fetch(
      `https://coverartarchive.org/release-group/${releaseGroupId}`,
      {
        headers: { "User-Agent": USER_AGENT },
        next: { revalidate: CACHE_SECONDS },
      },
    );

    if (!caResponse.ok) {
      return NextResponse.json(
        { error: "cover archive lookup failed" },
        { status: 404 },
      );
    }

    const caData = (await caResponse.json()) as CoverArtResponse;
    const front = (caData.images ?? []).find((item) => item.front);
    const url = front?.thumbnails?.["500"] ?? front?.thumbnails?.large ?? front?.image;

    if (!url) {
      return NextResponse.json({ error: "cover not found" }, { status: 404 });
    }

    return NextResponse.json(
      { url: ensureHttps(url) },
      {
        status: 200,
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=3600`,
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "cover art lookup failed" },
      { status: 500 },
    );
  }
}
