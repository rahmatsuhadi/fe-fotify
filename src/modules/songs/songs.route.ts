import { Elysia, t } from "elysia";
import { searchSongs, getTrendingSongs, getSongDetail } from "./songs.service";

const SongSchema = t.Object({
  id: t.String(),
  title: t.String(),
  duration: t.Number(),
  durationText: t.Optional(t.String()),
  author: t.String(),
  thumbnail: t.String(),
  views: t.Optional(t.Number()),
});

const ArtistSchema = t.Object({
  name: t.String(),
  url: t.String(),
  thumbnail: t.String(),
  subscribers: t.Nullable(t.String()),
});

const DetailSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.String(),
  duration: t.Number(),
  durationText: t.String(),
  author: t.String(),
  thumbnail: t.String(),
  url: t.String(),
  views: t.Number(),
});

const ErrorSchema = t.Object({ error: t.String() });

export const songsRoute = new Elysia({ prefix: "/api/songs" }).get(
  "/search",
  async ({ query, set }) => {
    try {
      if (!query.q) {
        set.status = 400;
        return { error: "Query parameter 'q' is required" };
      }
      
      const data = await searchSongs(query.q);
      
      if (data.songs.length === 0 && data.artists.length === 0) {
        set.status = 404;
        return { error: "No results found" };
      }
      
      return data;
    } catch (error) {
      set.status = 500;
      return { error: "Internal server error" };
    }
  },
  {
    query: t.Object({
      q: t.String(),
    }),
    response: {
      200: t.Object({ songs: t.Array(SongSchema), artists: t.Array(ArtistSchema) }),
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    detail: {
      summary: "Search for songs and artists",
      description: "Search YouTube for songs and channels using a keyword",
    },
  }
)
.get(
  "/trending",
  async ({ set }) => {
    try {
      const trending = await getTrendingSongs();
      return { trending };
    } catch (error) {
      set.status = 500;
      return { error: "Failed to fetch trending songs" };
    }
  },
  {
    response: {
      200: t.Object({ trending: t.Array(SongSchema) }),
      500: ErrorSchema,
    },
    detail: {
      summary: "Get trending songs",
      description: "Fetch popular/trending music from YouTube",
    },
  }
)
.get(
  "/:id",
  async ({ params: { id }, set }) => {
    try {
      const song = await getSongDetail(id);
      if (!song) {
        set.status = 404;
        return { error: "Song not found" };
      }
      return song;
    } catch (error) {
      set.status = 500;
      return { error: "Failed to fetch song details" };
    }
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    response: {
      200: DetailSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    detail: {
      summary: "Get song details",
      description: "Get specific video metadata by ID",
    },
  }
);
