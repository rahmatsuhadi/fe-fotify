import { Elysia, t } from "elysia";
import { searchSongs, getTrendingSongs, getSongDetail } from "./songs.service";

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
    detail: {
      summary: "Get song details",
      description: "Get specific video metadata by ID",
    },
  }
);
