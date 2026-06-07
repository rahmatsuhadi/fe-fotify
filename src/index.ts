import { Elysia } from "elysia";
import { openapi } from "@elysia/openapi";
import { songsRoute } from "./modules/songs/songs.route";

export const app = new Elysia()
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
  .get("/", () => "Hello Elysia! Music Player API is running. Check /openapi for docs.")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
