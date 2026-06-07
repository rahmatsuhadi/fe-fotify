import { Elysia, t, status as error } from "elysia";
import { searchSongs, getTrendingSongs, getSongDetail, getPlaylistSongs, getSongSuggestions } from "./songs.service";

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

const PlaylistSchema = t.Object({
  playlistId: t.String(),
  title: t.String(),
  author: t.String(),
  songs: t.Array(SongSchema),
});

export const songsRoute = new Elysia({ prefix: "/api/songs" }).get(
  "/search",
  async ({ query, set }) => {
    try {
      if (!query.q) {
        return error(400, { error: "Query parameter 'q' is required" });
      }
      
      const data = await searchSongs(query.q);
      
      if (data.songs.length === 0 && data.artists.length === 0) {
        return error(404, { error: "No results found" });
      }
      
      return data;
    } catch (err) {
      return error(500, { error: "Internal server error" });
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
  "/suggestions",
  async ({ query, set }) => {
    try {
      if (!query.q) {
        return error(400, { error: "Query parameter 'q' is required" });
      }
      
      const suggestions = await getSongSuggestions(query.q);
      return { suggestions };
    } catch (err) {
      return error(500, { error: "Internal server error fetching suggestions" });
    }
  },
  {
    query: t.Object({
      q: t.String(),
    }),
    response: {
      200: t.Object({ suggestions: t.Array(t.String()) }),
      400: ErrorSchema,
      500: ErrorSchema,
    },
    detail: {
      summary: "Get search suggestions",
      description: "Get autocomplete search suggestions based on keyword",
    },
  }
)
.get(
  "/trending",
  async ({ set }) => {
    try {
      const trending = await getTrendingSongs();
      return { trending };
    } catch (err) {
      return error(500, { error: "Failed to fetch trending songs" });
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
        return error(404, { error: "Song not found" });
      }
      return song;
    } catch (err) {
      return error(500, { error: "Failed to fetch song details" });
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
)
.get(
  "/playlists",
  async ({ query, set }) => {
    try {
      if (!query.name) {
        return error(400, { error: "Query parameter 'name' is required" });
      }
      const data = await getPlaylistSongs(query.name);
      if (!data) {
        return error(404, { error: "Playlist not found" });
      }
      return data;
    } catch (err) {
      return error(500, { error: "Internal server error fetching playlist" });
    }
  },
  {
    query: t.Object({
      name: t.String(),
    }),
    response: {
      200: PlaylistSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    detail: {
      summary: "Discover Playlist",
      description: "Search for a playlist by name and fetch its songs",
    },
  }
);
