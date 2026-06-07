import { describe, expect, it } from "bun:test";
import { app } from "../../index";

describe("Lyrics Module", () => {
  it("Should return 422 if search query 'q' is missing", async () => {
    const response = await app.handle(new Request("http://localhost/api/lyrics"));
    expect(response.status).toBe(422); // Elysia validation error
  });

  it("Should return lyrics for a known song", async () => {
    const response = await app.handle(new Request("http://localhost/api/lyrics?q=coldplay+yellow"));
    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data).toHaveProperty("plainLyrics");
    expect(data).toHaveProperty("syncedLyrics");
  }, 10000);

  it("Should return 404 for an unknown song", async () => {
    const response = await app.handle(new Request("http://localhost/api/lyrics?q=this_song_definitely_does_not_exist_123456789"));
    expect(response.status).toBe(404);
  }, 10000);
});
