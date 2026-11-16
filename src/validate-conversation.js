const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 3000;
const MAX_TOTAL_CHARACTERS = 12000;

/**
 * Validate the untrusted conversation payload received from the browser.
 * The accepted format mirrors the Gemini chat roles used by the frontend.
 */
export function validateConversation(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return { valid: false, error: 'Percakapan harus berupa daftar pesan yang tidak kosong.' };
  }

  if (value.length > MAX_MESSAGES) {
    return { valid: false, error: `Percakapan dibatasi maksimal ${MAX_MESSAGES} pesan.` };
  }

  let totalCharacters = 0;
  const conversation = [];

  for (let index = 0; index < value.length; index += 1) {
    const message = value[index];

    if (!message || typeof message !== 'object' || Array.isArray(message)) {
      return { valid: false, error: 'Format pesan tidak valid.' };
    }

    const expectedRole = index % 2 === 0 ? 'user' : 'model';
    if (message.role !== expectedRole) {
      return { valid: false, error: 'Urutan peran pesan tidak valid.' };
    }

    if (typeof message.text !== 'string') {
      return { valid: false, error: 'Isi pesan harus berupa teks.' };
    }

    const text = message.text.trim();
    if (!text || text.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Setiap pesan harus berisi 1 sampai ${MAX_MESSAGE_LENGTH} karakter.` };
    }

    totalCharacters += text.length;
    conversation.push({ role: expectedRole, text });
  }

  if (conversation[conversation.length - 1].role !== 'user') {
    return { valid: false, error: 'Pesan terakhir harus berasal dari pengguna.' };
  }

  if (totalCharacters > MAX_TOTAL_CHARACTERS) {
    return { valid: false, error: `Total percakapan melebihi ${MAX_TOTAL_CHARACTERS} karakter.` };
  }

  return { valid: true, conversation };
}
