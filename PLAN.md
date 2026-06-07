# Execution Plan: Music Player Backend API

Dokumen ini berisi *step-by-step* eksekusi project yang dibagi menjadi beberapa fase (Phase). Tujuannya agar pengerjaan dilakukan secara bertahap, terstruktur, dan mudah di-review (tidak langsung *massive change*).

---

## Phase 1: Project Setup & Core Configuration
**Objective:** Menyiapkan *environment* awal dan struktur modul.
- [ ] Install package yang dibutuhkan (`yt-search`, `@types/yt-search`, `@elysia/openapi`).
- [ ] Buat *skeleton* folder *Module Structure* (`src/modules/songs` dan `src/modules/lyrics`).
- [ ] Setup `Elysia` dan integrasi *plugin* Swagger (`@elysia/openapi`) di `src/index.ts`.
- [ ] Pastikan *server* berjalan dan *UI Swagger* bisa diakses di `/openapi`.

## Phase 2: Songs Module - Search Feature
**Objective:** Mengintegrasikan fitur pencarian video & artis dari YouTube.
- [ ] Buat file `src/modules/songs/songs.service.ts` untuk melayani *logic* pemanggilan API `yt-search`.
- [ ] Buat `src/modules/songs/songs.route.ts` dan implementasikan endpoint `GET /api/songs/search?q={keyword}`.
- [ ] Daftarkan `songs.route.ts` ke `index.ts`.
- [ ] Test endpoint via Swagger.

## Phase 3: Songs Module - Detail & Trending
**Objective:** Melengkapi fungsionalitas detail lagu dan daftar trending.
- [ ] Implementasikan endpoint `GET /api/songs/:id` di `songs.service` dan `songs.route` untuk ambil detail video spesifik.
- [ ] Implementasikan endpoint `GET /api/songs/trending` di `songs.service` dan `songs.route` (menggunakan *hardcoded* Global Top Playlist ID dari YouTube).
- [ ] Test kedua endpoint dan pastikan data respon sesuai ekspektasi.

## Phase 4: Lyrics Module
**Objective:** Mengintegrasikan `LRCLIB` untuk fitur lirik tersinkronisasi.
- [ ] Buat `src/modules/lyrics/lyrics.service.ts` untuk nge-*fetch* data dari `https://lrclib.net/api/search`.
- [ ] Buat `src/modules/lyrics/lyrics.route.ts` dan implementasikan endpoint `GET /api/lyrics?q={keyword}`.
- [ ] Daftarkan *route* lirik ke `index.ts`.
- [ ] Test endpoint lirik.

## Phase 5: Refinement & Error Handling
**Objective:** *Polishing* *codebase* untuk standar *production-ready*.
- [ ] Tambahkan TypeScript *Interfaces/Types* di respon masing-masing *route* agar ter-*generate* rapi di dokumentasi Swagger.
- [ ] Pastikan setiap *service* me-return status code yang sesuai (misal balikin `404 Not Found` kalau array *yt-search* kosong, atau lirik tidak ketemu).
- [ ] Review dan finalisasi kodingan keseluruhan.

## Phase 6: Playlist Discovery Feature
**Objective:** Mengimplementasikan endpoint untuk mencari playlist berdasarkan nama/genre dan mengambil lagu-lagunya.
- [ ] Implementasikan fungsi `getPlaylistSongs` di `songs.service.ts` yang mencari playlist (`yts({ query })`) dan me-resolve `listId`-nya.
- [ ] Buat endpoint `GET /api/songs/playlists` (atau sejenisnya) di `songs.route.ts` dan integrasikan Swagger schemanya.
- [ ] Uji fungsionalitas melalui `songs.test.ts`.
- [ ] Update `SUMMARY.md` dan commit secara atomic.
