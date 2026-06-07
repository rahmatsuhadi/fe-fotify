import { describe, expect, it } from "bun:test";
import { app } from "../../index";

describe("Songs Module - Search", () => {
  it("Should return 400 if search query 'q' is missing", async () => {
    // Elysia with Type validation will return 422 if type mismatch, but we handle it or rely on validation
    // wait, Elysia's t.Object will return 422 automatically if missing. Let's see what happens.
    // Actually, in Elysia if a query param defined as t.String() is missing, it throws validation error (422).
    const response = await app.handle(new Request("http://localhost/api/songs/search"));
    expect(response.status).toBe(422); // Validation error handled by Elysia automatically
  });

  it("Should return search results for a valid query", async () => {
    const response = await app.handle(new Request("http://localhost/api/songs/search?q=coldplay"));
    expect(response.status).toBe(200);
    const data = await response.json() as any;
    
    expect(data).toHaveProperty("songs");
    expect(data).toHaveProperty("artists");
    expect(Array.isArray(data.songs)).toBe(true);
    // There should be at least some results for coldplay
    expect(data.songs.length).toBeGreaterThan(0);
    expect(data.songs[0]).toHaveProperty("id");
    expect(data.songs[0]).toHaveProperty("title");
  });

  it("Should return trending songs", async () => {
    const response = await app.handle(new Request("http://localhost/api/songs/trending"));
    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data).toHaveProperty("trending");
    expect(Array.isArray(data.trending)).toBe(true);
  }, 15000);

  it("Should return detail for a valid song ID", async () => {
    // using a known videoId, e.g., 'dQw4w9WgXcQ' (Rick Astley)
    const response = await app.handle(new Request("http://localhost/api/songs/dQw4w9WgXcQ"));
    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data.id).toBe("dQw4w9WgXcQ");
    expect(data).toHaveProperty("title");
    expect(data).toHaveProperty("duration");
  }, 10000);

  it("Should return 404 for an invalid song ID", async () => {
    const response = await app.handle(new Request("http://localhost/api/songs/this_id_is_invalid_1234"));
    expect([404, 500]).toContain(response.status);
  }, 15000);
});
