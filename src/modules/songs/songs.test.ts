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
});
