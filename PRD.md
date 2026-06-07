# Product Requirements Document (PRD): Music Player Backend API

## 1. Project Overview
**Name:** Music Player Backend API
**Objective:** Mengembangkan backend API berbasis ElysiaJS yang handal dan ringan untuk melayani data aplikasi *music player*. API ini akan menyediakan pencarian lagu, detail metadata lagu, daftar lagu trending, dan sinkronisasi lirik tanpa perlu menyimpan data di database sendiri (menggunakan *scraping* dan API pihak ketiga).

## 2. Tech Stack & Architecture
- **Runtime:** Bun
- **Framework:** ElysiaJS
- **Data Source (Music/Video):** `yt-search` (YouTube Scraper)
- **Data Source (Lyrics):** `LRCLIB` (lrclib.net)
- **API Documentation:** `@elysia/openapi` (OpenAPI Spec)

## 3. User Stories
- **Sebagai pengguna**, saya ingin mencari lagu atau nama artis agar saya dapat menemukan musik yang ingin saya dengarkan.
- **Sebagai pengguna**, saya ingin melihat daftar lagu yang sedang *trending* agar saya tidak ketinggalan musik-musik populer saat ini.
- **Sebagai pengguna**, saya ingin melihat detail lagu (durasi, *cover* album/thumbnail) sebelum saya memutarnya.
- **Sebagai pengguna**, saya ingin mencari playlist berdasarkan tema atau nama (misal "Musik Indonesia") agar saya dapat memutar lagu-lagu dengan *vibes* yang sama.
- **Sebagai pengguna**, saya ingin melihat lirik lagu yang sinkron dengan waktu putar (*synced lyrics*) agar saya bisa bernyanyi sambil mendengarkan.
- **Sebagai developer (*frontend*)**, saya ingin melihat dokumentasi API (Swagger) secara langsung agar saya bisa mengintegrasikan UI dengan mudah.

## 4. Scope & Features
### In-Scope
1. **Pencarian Terpadu:** Mengembalikan daftar lagu dan/atau *channel* artis dari *keyword*.
2. **Top / Trending Music:** Mengambil daftar lagu dari *playlist* YouTube yang populer secara global.
3. **Song Details:** Menampilkan durasi spesifik, ID, *author*, dan video terkait dari satu entitas lagu.
4. **Lyrics Retrieval:** Menyediakan lirik *plain* dan lirik *synced* menggunakan LRCLIB API.
5. **Playlist Discovery:** Mencari playlist teratas berdasarkan nama/genre dan meretrieve seluruh lagunya.
6. **OpenAPI Docs:** Dokumentasi interaktif otomatis tersedia di `/openapi`.

### Out-of-Scope (Untuk Fase Ini)
- Autentikasi user (Login/Register).
- Menyimpan *playlist* personal pengguna ke database.
- *Streaming* file audio secara langsung (hanya menyediakan metadata dan `videoId` untuk dimainkan *player* di *frontend*).

## 5. API Specifications (Endpoints)

### 5.1. Songs & Artists
- `GET /api/songs/search?q={keyword}`
  - **Function:** Mencari daftar video lagu dan channel artis.
  - **Response:** JSON berisi `{ songs: [...], artists: [...] }`
- `GET /api/songs/trending`
  - **Function:** Menampilkan daftar lagu populer menggunakan *listId* resmi YouTube.
  - **Response:** JSON berisi `{ trending: [...] }`
- `GET /api/songs/playlists?name={keyword}`
  - **Function:** Mencari playlist teratas berdasarkan nama dan meretrieve daftar lagunya.
  - **Response:** JSON berisi `{ playlistId, title, author, songs: [...] }`
- `GET /api/songs/:id`
  - **Function:** Mendapatkan detail lengkap dari sebuah lagu.
  - **Response:** JSON berisi `{ id, title, duration, author, description, related: [...] }`

### 5.2. Lyrics
- `GET /api/lyrics?q={keyword}`
  - **Function:** Mencari lirik lagu terbaik berdasarkan *keyword* pencarian (judul lagu + nama artis).
  - **Response:** JSON berisi `{ id, trackName, artistName, plainLyrics, syncedLyrics }` atau mengembalikan `404 Not Found` jika lirik tidak tersedia.

## 6. Non-Functional Requirements (NFR)
- **Modularity:** *Routing* harus dipisah secara modular di dalam direktori khusus seperti `src/routes/` (misal: `songs.ts`, `lyrics.ts`).
- **Performance/Resilience:** Request ke YouTube Search dan LRCLIB bisa jadi fluktuatif (*latency*). API harus di-desain supaya *frontend* bisa nge-fetch data lagu dan lirik secara terpisah (*asynchronous/parallel*) agar UI tidak *freeze*.
- **Error Handling:** Wajib me-return standar HTTP status code yang benar (200 OK, 400 Bad Request jika parameter kurang, 404 Not Found, 500 Internal Error).
