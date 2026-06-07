import { Elysia, t } from "elysia";
import { searchLyrics } from "./lyrics.service";

export const lyricsRoute = new Elysia({ prefix: "/api/lyrics" }).get(
  "/",
  async ({ query, set }) => {
    try {
      if (!query.q) {
        set.status = 400;
        return { error: "Query parameter 'q' is required" };
      }

      const lyrics = await searchLyrics(query.q);

      if (!lyrics) {
        set.status = 404;
        return { error: "Lyrics not found" };
      }

      return lyrics;
    } catch (error) {
      set.status = 500;
      return { error: "Internal server error fetching lyrics" };
    }
  },
  {
    query: t.Object({
      q: t.String(),
    }),
    detail: {
      summary: "Search lyrics",
      description: "Search for synced and plain lyrics using LRCLIB API",
    },
  }
);
