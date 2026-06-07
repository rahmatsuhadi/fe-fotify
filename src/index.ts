import { Elysia } from "elysia";
import { openapi } from "@elysia/openapi";
import { cors } from "@elysiajs/cors";
import { songsRoute } from "./modules/songs/songs.route";
import { lyricsRoute } from "./modules/lyrics/lyrics.route";

export const app = new Elysia()
  .use(cors())
  .use(
    openapi({
      documentation: {
        info: {
          title: "Music Player API",
          version: "1.0.0",
          description: "Backend API for Music Player using yt-search and LRCLIB",
        },
      },
    })
  )
  .use(songsRoute)
  .use(lyricsRoute)
  .get("/", () => "Hello Elysia! Music Player API is running. Check /openapi for docs.")
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
