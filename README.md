<!-- Banner photograph by Sebastian (@gsebastian), via Unsplash. This is not an application screenshot. -->

<p align="center">
  <img src="https://images.unsplash.com/photo-1517260468809-807bfd11d968?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600" alt="Commercial airplane in flight" width="100%">
</p>

<h1 align="center">Gemini AI Travel Chatbot</h1>

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

## Tentang proyek

**Gemini AI Travel Chatbot** adalah aplikasi chatbot sederhana yang menggunakan Google Gemini API untuk membantu pengguna merencanakan perjalanan. Instruksi sistem pada backend mengarahkan AI untuk menjawab pertanyaan seputar travelling, menanyakan tujuan dan durasi liburan, kemudian membantu menyusun itinerary.

Aplikasi terdiri dari backend Express.js dan frontend HTML, CSS, serta JavaScript biasa. Riwayat percakapan disimpan sementara di browser selama halaman masih terbuka.

## Tampilan dan gambar

Banner di bagian atas menggunakan foto **commercial airplane in flight** karya **Sebastian (@gsebastian)** dari [Unsplash](https://unsplash.com/photos/commercial-airplane-in-flight-7NmWj7F6eoA). Foto tersebut merupakan visual pendukung README, bukan tangkapan layar aplikasi.

## Fitur

- Chat interaktif dengan model Gemini melalui backend.
- Instruksi AI berbahasa Indonesia dengan fokus pada topik travelling.
- AI diarahkan untuk menanyakan tujuan dan durasi perjalanan sebelum menyusun itinerary.
- Riwayat pesan percakapan dikirim bersama setiap permintaan agar konteks chat tetap terbawa.
- Indikator “Sedang berpikir” saat menunggu jawaban.
- Tampilan pesan pengguna dan bot dibedakan.
- Layout sederhana yang menyesuaikan layar desktop dan perangkat mobile.
- API key Gemini disimpan pada environment backend, bukan di JavaScript frontend.

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

- Node.js 18 atau lebih baru.
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

## Keamanan dan catatan penggunaan

- **Jaga API key:** simpan `GEMINI_API_KEY` di file `.env` atau secret manager. Jangan pernah mengirim API key ke frontend atau melakukan commit terhadap file `.env`.
- **Batasi CORS:** source saat ini menggunakan `cors()` tanpa pembatasan origin. Untuk deployment, atur origin frontend yang benar.
- **Tambahkan rate limiting:** endpoint chat saat ini belum membatasi jumlah request. Tambahkan rate limiter untuk mencegah penyalahgunaan dan pemakaian API yang tidak terkendali.
- **Validasi input:** sebelum deployment, validasi tipe `conversation`, role dan teks setiap pesan, serta batasi ukuran riwayat dan request body.
- **Tangani error dengan aman:** endpoint saat ini mengirim `e.message` ke client. Untuk production, simpan detail teknis di server log dan kirim pesan error umum ke pengguna.
- **Perhatikan biaya dan kuota:** setiap pesan mengirim riwayat percakapan sebelumnya kembali ke API, sehingga ukuran konteks dan penggunaan token dapat meningkat seiring panjangnya percakapan.

Aplikasi ini merupakan proyek demonstrasi dan belum dilengkapi seluruh kontrol keamanan yang dibutuhkan untuk layanan publik berskala produksi.

## Pengujian

Saat ini `package.json` belum menyediakan test suite. Script `npm test` masih berupa placeholder yang mengembalikan error. Uji manual dengan menjalankan server, membuka halaman, lalu mengirim pesan travelling. Pengujian otomatis untuk endpoint dan frontend dapat ditambahkan pada pengembangan berikutnya.

## Referensi

- [Google Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Google GenAI SDK for JavaScript](https://github.com/googleapis/js-genai)
- [Google AI Studio — API Keys](https://aistudio.google.com/app/apikey)
- [Express Documentation](https://expressjs.com/)

## Kredit foto

Foto banner: **Sebastian (@gsebastian)** — [Commercial airplane in flight, Unsplash](https://unsplash.com/photos/commercial-airplane-in-flight-7NmWj7F6eoA). Digunakan sesuai [Unsplash License](https://unsplash.com/license).

---

<p align="center">
  Dibuat untuk membantu merencanakan perjalanan dengan Gemini AI.
</p>
