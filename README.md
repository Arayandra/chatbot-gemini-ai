# Gemini AI Travel Chatbot

![CI](https://github.com/Arayandra/chatbot-gemini-ai/actions/workflows/ci.yml/badge.svg?branch=main)

<p align="center">
  Chatbot perencana perjalanan berbasis Gemini AI.
  <br>
  Tanyakan ide liburan, tentukan destinasi dan durasi, lalu dapatkan rekomendasi itinerary dalam percakapan.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express 5">
  <img src="https://img.shields.io/badge/Google%20Gemini-AI-4285F4?logo=google&logoColor=white" alt="Google Gemini AI">
  <img src="https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?logo=javascript&logoColor=222" alt="Vanilla JavaScript">
</p>

<p align="center">
  <a href="https://github.com/Arayandra/chatbot-gemini-ai">Repository</a> ·
  <a href="https://ai.google.dev/gemini-api/docs">Gemini API Docs</a> ·
  <a href="https://aistudio.google.com/app/apikey">Get an API Key</a>
</p>

---

## Test

This repository does not yet include `package-lock.json`. Run `npm install`, commit the generated lockfile, and then use `npm ci` in CI for reproducible dependency installation.

Repository ini belum menyimpan `package-lock.json`. Setelah menjalankan `npm install`, simpan file lock tersebut ke Git agar versi dependency dapat direproduksi; workflow CI kemudian dapat menggunakan `npm ci`.


Run the request-validation unit tests with:

```bash
npm test
```

The repository does not include a captured screenshot of a running application. The previous SVG interface mockup has been removed so the README does not present an illustration as a real application screenshot.

## Tentang proyek

**Gemini AI Travel Chatbot** adalah aplikasi chatbot sederhana yang menggunakan Google Gemini API untuk membantu pengguna merencanakan perjalanan. Instruksi sistem pada backend mengarahkan AI untuk menjawab pertanyaan seputar travelling, menanyakan tujuan dan durasi liburan, kemudian membantu menyusun itinerary.

Aplikasi terdiri dari backend Express.js dan frontend HTML, CSS, serta JavaScript biasa. Riwayat percakapan disimpan sementara di browser selama halaman masih terbuka.

## Fitur

- Chat interaktif dengan model Gemini melalui backend.
- Instruksi AI berbahasa Indonesia dengan fokus pada topik travelling.
- AI diarahkan untuk menanyakan tujuan dan durasi perjalanan sebelum menyusun itinerary.
- Riwayat pesan percakapan dikirim bersama setiap permintaan agar konteks chat tetap terbawa.
- Indikator “Sedang berpikir” saat menunggu jawaban.
- Tampilan pesan pengguna dan bot dibedakan.
- Layout sederhana yang menyesuaikan layar desktop dan perangkat mobile.
- API key Gemini disimpan pada environment backend, bukan di JavaScript frontend.
- Request payload dibatasi ukuran, jumlah pesan, panjang teks, dan urutan role.
- Endpoint chat memiliki batas 10 permintaan per IP setiap 10 menit per proses; gunakan shared rate-limit storage saat menjalankan banyak instance.
- CORS eksternal dinonaktifkan secara default dan hanya dibuka untuk origin yang ditentukan melalui `CORS_ORIGINS`.

> **Batasan saat ini:** percakapan hanya tersimpan di memori halaman. Refresh atau menutup halaman akan menghapus riwayat chat. Aplikasi belum memiliki login, penyimpanan database, maupun dashboard pengguna.

## Teknologi

| Komponen | Teknologi |
| --- | --- |
| Runtime | Node.js |
| Backend | Express 5 |
| AI SDK | `@google/genai` |
| Model yang ditulis di source | `gemini-3.5-flash` |
| Environment variables | dotenv |
| Middleware | CORS, Express JSON |
| Frontend | HTML, CSS, Vanilla JavaScript |

Model ditentukan melalui konstanta `GEMINI_MODEL` di `index.js`. Ketersediaan nama model bergantung pada model yang didukung oleh Gemini API dan project API key Anda. Bila API mengembalikan error model tidak ditemukan/tidak didukung, sesuaikan konstanta tersebut dengan model yang tersedia pada dokumentasi Gemini API.

## Persyaratan

- Node.js 22 atau lebih baru (sesuai batas minimum pada `package.json`).
- npm.
- Gemini API key dari [Google AI Studio](https://aistudio.google.com/app/apikey).
- Koneksi internet untuk mengakses Gemini API.

SDK resmi Google untuk JavaScript tersedia sebagai paket `@google/genai`. Lihat [dokumentasi SDK Gemini](https://ai.google.dev/gemini-api/docs/libraries).

## Instalasi dan menjalankan aplikasi

### 1. Clone repository

```bash
git clone https://github.com/Arayandra/chatbot-gemini-ai.git
cd chatbot-gemini-ai
```

### 2. Instal dependency

```bash
npm install
```

### 3. Buat file environment

Buat file bernama `.env` di folder utama proyek.

**Windows CMD:**

```cmd
notepad .env
```

**Linux/macOS/Git Bash:**

```bash
touch .env
```

Isi file `.env`:

```dotenv
GEMINI_API_KEY=masukkan_api_key_gemini_di_sini
PORT=3000
# Optional: comma-separated trusted origins; same-origin works without this
CORS_ORIGINS=
```

Ganti nilai `GEMINI_API_KEY` dengan API key milik Anda. Jangan menuliskan API key di `public/script.js`, HTML, atau file yang akan dipublikasikan. File `.env` sudah dikecualikan melalui `.gitignore`.

### 4. Jalankan server

```bash
node index.js
```

Jika server berhasil dijalankan, terminal akan menampilkan:

```text
Server ready on http://localhost:3000
```

### 5. Buka aplikasi

Buka alamat berikut di browser:

<http://localhost:3000>

Untuk menghentikan server, tekan `Ctrl + C` pada terminal.

## API

Backend menyediakan endpoint berikut:

### `POST /api/chat`

Mengirim seluruh riwayat percakapan ke Gemini.

**Header**

```http
Content-Type: application/json
```

**Request body**

```json
{
  "conversation": [
    {
      "role": "user",
      "text": "Saya ingin liburan ke Bali selama 3 hari."
    },
    {
      "role": "model",
      "text": "Menarik! Apakah Anda lebih suka wisata alam, budaya, atau kuliner?"
    },
    {
      "role": "user",
      "text": "Saya suka wisata alam dan kuliner."
    }
  ]
}
```

**Respons berhasil — HTTP 200**

```json
{
  "result": "Berikut beberapa ide itinerary untuk perjalanan Anda..."
}
```

**Respons error — HTTP 500**

```json
{
  "error": "Pesan error dari server atau Gemini API"
}
```

Nilai `role` yang digunakan frontend adalah `user` dan `model`. Setiap item percakapan memiliki properti `text`.

## Struktur proyek

```text
chatbot-gemini-ai/
├── index.js             # Express server dan integrasi Gemini API
├── package.json         # Dependency dan metadata npm
├── .gitignore           # Mengecualikan .env dan node_modules
└── public/
    ├── index.html       # Struktur halaman chatbot
    ├── script.js        # Interaksi chat dan request ke backend
    └── style.css        # Tampilan dan responsive layout
```

## Konfigurasi perilaku AI

Instruksi sistem saat ini berada di dalam route `POST /api/chat` pada file `index.js`. Prompt mengarahkan chatbot agar:

1. Berperan sebagai asisten travel.
2. Fokus pada pertanyaan terkait travelling.
3. Menggunakan nada yang ramah.
4. Menanyakan tujuan dan durasi liburan.
5. Membantu menyusun itinerary berdasarkan informasi pengguna.

Untuk mengubah gaya bahasa atau cakupan bantuan, sesuaikan nilai `systemInstruction` di file tersebut.

## Security and operational notes

- Store `GEMINI_API_KEY` only in `.env` or a secret manager. Never expose it to frontend code or commit it.
- Same-origin requests work by default. Set `CORS_ORIGINS` only when a separate trusted frontend origin is required.
- The chat endpoint limits each IP to 10 requests per 10 minutes per Node process. This in-memory limiter is suitable for a single-process demo; use shared storage such as Redis for multi-instance deployments.
- Request validation enforces the conversation shape, alternating `user`/`model` roles, the final user message, a maximum of 20 messages, and text-size limits.
- The JSON request body is capped at 64 KB. Server-side provider errors are logged and returned to clients as generic messages.
- Conversation history is still stored only in the browser page memory and is lost on refresh.
- Every request sends the accumulated conversation history to Gemini. Monitor token usage and API quota before public deployment.

The project is a demonstration app. Before exposing it publicly, add persistent conversation storage (if required), shared rate limiting, monitoring, abuse controls, and tests against a configured staging API key.

## Tests

This repository does not yet include `package-lock.json`. Run `npm install`, commit the generated lockfile, and then use `npm ci` in CI for reproducible dependency installation.

Run the request validation unit tests:

```bash
npm test
```

The tests do not call Gemini and do not require an API key.

## Referensi

- [Google Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Google GenAI SDK for JavaScript](https://github.com/googleapis/js-genai)
- [Google AI Studio — API Keys](https://aistudio.google.com/app/apikey)
- [Express Documentation](https://expressjs.com/)

<p align="center">
  Dibuat untuk membantu merencanakan perjalanan dengan Gemini AI.
</p>
