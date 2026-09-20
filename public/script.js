
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const submitButton = form.querySelector('button[type="submit"]');

const conversation = [];

// Submit chat
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const userMessage = input.value.trim();

  if (!userMessage) {
    return;
  }

  // Tampilkan pesan user
  appendMessage('user', userMessage);

  // Simpan ke history
  conversation.push({
    role: 'user',
    text: userMessage
  });

  // Bersihkan input
  input.value = '';

  // Tampilkan animasi
  const thinkingMessage = createThinkingMessage();

  // Nonaktifkan input sementara
  input.disabled = true;
  submitButton.disabled = true;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversation
      })
    });

    if (!response.ok) {
      throw new Error('Server error');
    }

    const data = await response.json();

    // Hentikan animasi
    stopThinkingAnimation(thinkingMessage);

    // Validasi response
    if (!data?.result?.trim()) {
      replaceMessage(
        thinkingMessage,
        'Maaf, saya belum mendapatkan jawabannya.'
      );
      return;
    }

    // Bersihkan format Markdown
    const botReply = markdownToPlainText(data.result);

    // Tampilkan jawaban
    replaceMessage(thinkingMessage, botReply);

    // Simpan jawaban model
    conversation.push({
      role: 'model',
      text: botReply
    });

  } catch (error) {
    console.error('Chat error:', error);

    stopThinkingAnimation(thinkingMessage);

    replaceMessage(
      thinkingMessage,
      'Maaf, terjadi gangguan. Silakan coba lagi.'
    );

  } finally {
    input.disabled = false;
    submitButton.disabled = false;
    input.focus();
  }
});


// ===============================
// Tambahkan pesan
// ===============================
function appendMessage(sender, text) {
  const message = document.createElement('div');

  message.classList.add('message', sender);
  message.textContent = text;

  chatBox.appendChild(message);
  scrollToBottom();

  return message;
}


// ===============================
// Animasi "Sedang berpikir"
// ===============================
function createThinkingMessage() {
  const message = document.createElement('div');

  message.classList.add(
    'message',
    'bot',
    'thinking-message'
  );

  chatBox.appendChild(message);

  let dots = 0;

  const animate = () => {
    dots = (dots + 1) % 4;

    message.textContent =
      `Sedang berpikir${'.'.repeat(dots)}`;

    scrollToBottom();
  };

  animate();

  message._thinkingInterval =
    setInterval(animate, 500);

  return message;
}


// ===============================
// Hentikan animasi
// ===============================
function stopThinkingAnimation(message) {
  if (message?._thinkingInterval) {
    clearInterval(message._thinkingInterval);
    message._thinkingInterval = null;
  }
}


// ===============================
// Ganti isi pesan
// ===============================
function replaceMessage(element, text) {
  element.textContent = text;
  scrollToBottom();
}


// ===============================
// Auto scroll
// ===============================
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}


// ===============================
// Markdown → Plain Text
// ===============================
function markdownToPlainText(markdown) {
  if (!markdown) {
    return '';
  }

  let text = markdown;

  // Code block
  text = text.replace(/```[\w-]*\n?/g, '');

  // Inline code
  text = text.replace(/`([^`]+)`/g, '$1');

  // Link
  text = text.replace(
    /\[([^\]]+)\]\([^)]+\)/g,
    '$1'
  );

  // Heading
  text = text.replace(
    /^\s*#{1,6}\s+/gm,
    ''
  );

  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  text = text.replace(/__(.*?)__/g, '$1');

  // Italic
  text = text.replace(/\*(.*?)\*/g, '$1');
  text = text.replace(/_(.*?)_/g, '$1');

  // Strikethrough
  text = text.replace(/~~(.*?)~~/g, '$1');

  // Bullet
  text = text.replace(
    /^\s*[-*+]\s+/gm,
    '• '
  );

  // Blockquote
  text = text.replace(
    /^\s*>\s?/gm,
    ''
  );

  // Horizontal line
  text = text.replace(
    /^\s*([-*_]){3,}\s*$/gm,
    ''
  );

  // Rapikan baris kosong
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}
````
