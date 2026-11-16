import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { validateConversation } from './src/validate-conversation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

app.disable('x-powered-by');
app.use(express.json({ limit: '64kb', strict: true }));

// The frontend is same-origin by default. Add only trusted external origins when needed.
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length > 0) {
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
  }));
}

app.use(express.static(path.join(__dirname, 'public')));

// Lightweight per-process rate limit. Use a shared store (for example Redis)
// when running multiple instances or behind an autoscaling platform.
const rateLimitEntries = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;

function chatRateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  let entry = rateLimitEntries.get(key);

  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  entry.count += 1;
  rateLimitEntries.set(key, entry);

  // Bound memory in case many distinct client addresses call the endpoint.
  if (rateLimitEntries.size > 5000) {
    for (const [clientKey, clientEntry] of rateLimitEntries) {
      if (clientEntry.resetAt <= now) rateLimitEntries.delete(clientKey);
    }
  }

  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
    return res.status(429).json({ error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' });
  }

  return next();
}

app.post('/api/chat', chatRateLimit, async (req, res) => {
  const validation = validateConversation(req.body?.conversation);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  if (!ai) {
    return res.status(503).json({ error: 'Layanan AI belum dikonfigurasi.' });
  }

  try {
    const contents = validation.conversation.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: [
          'Anda adalah asisten perjalanan yang ramah.',
          'Jawab pertanyaan yang berkaitan dengan perjalanan dan wisata.',
          'Tanyakan tujuan, durasi, anggaran, dan minat wisata jika informasi tersebut belum tersedia.',
          'Susun itinerary yang realistis berdasarkan informasi pengguna.',
          'Jangan mengarang harga, jadwal, atau ketersediaan yang tidak dapat diverifikasi.',
        ].join(' '),
      },
    });

    const result = typeof response.text === 'string' ? response.text.trim() : '';
    if (!result) {
      return res.status(502).json({ error: 'Layanan AI tidak memberikan jawaban.' });
    }

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Gemini request failed:', error?.message || 'Unknown error');
    return res.status(502).json({ error: 'Layanan AI sedang tidak tersedia. Silakan coba lagi.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server ready on http://localhost:${PORT}`);
});
