import { describe, expect, it } from "bun:test";
import { app } from "./index";

describe("Base App Setup & OpenAPI", () => {
  it("Should return base greeting on /", async () => {
    const response = await app.handle(new Request("http://localhost/"));
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain("Music Player API is running");
  });

  it("Should expose OpenAPI docs at /openapi", async () => {
    const response = await app.handle(new Request("http://localhost/openapi"));
    // Since it returns Scalar UI HTML, it should be 200 OK
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html.toLowerCase()).toContain("scalar");
  });

  it("Should expose OpenAPI JSON at /openapi/json", async () => {
    const response = await app.handle(new Request("http://localhost/openapi/json"));
    expect(response.status).toBe(200);
    const json = await response.json() as any;
    expect(json.info.title).toBe("Music Player API");
  });
});
