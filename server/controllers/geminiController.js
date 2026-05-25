// server/controllers/geminiController.js
/**
 * Gemini powered endpoints for chatbot and voice navigation.
 * Requires a valid GEMINI_API_KEY in the environment.
 *
 * Two handlers:
 *   - chatCompletion: receives an array of messages (role/content) and returns Gemini's response.
 *   - parseVoiceCommand: receives a transcript, sends a structured prompt to Gemini and returns a route.
 *
 * Both fall back to local logic if Gemini is unavailable (e.g., quota exhausted).
 */

const FALLBACK_INTENT_MAP = require('../utils/fallbackIntent'); // will be created next

// Helper to call Gemini model (gemini-1.5-flash is free‑tier friendly)
const callGemini = async (prompt) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not set in environment');
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 128 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${err}`);
  }
  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  // Clean possible markdown fences
  return raw.replace(/```json|```/g, '').trim();
};

/**
 * POST /api/chatbot
 * Body: { messages: [{ role: 'user'|'assistant'|'system', content: string }] }
 */
const chatCompletion = async (req, res, next) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400);
    return next(new Error('messages array required'));
  }

  const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  try {
    const geminiOutput = await callGemini(prompt);
    res.json({ reply: geminiOutput });
  } catch (err) {
    // Return a minimal fallback response so UI can still continue
    res.json({ reply: 'Sorry, I could not reach the AI service at the moment.' });
    console.error('Gemini chat error:', err.message);
  }
};

/**
 * POST /api/voice/parse
 * Body: { transcript: string }
 * Returns { route: string|null, label: string }
 */
const parseVoiceCommand = async (req, res, next) => {
  const { transcript } = req.body;
  if (!transcript || typeof transcript !== 'string') {
    res.status(400);
    return next(new Error('transcript is required'));
  }

  const prompt = `You are a voice navigation assistant for KariGhar, an Indian handicraft e‑commerce platform.\n\nUser said: "${transcript}"\n\nMap this to ONE of the following routes (or null if none match):\n- "/" → home page\n- "/collections" → shop, browse products, catalog\n- "/categories" → categories, collections\n- "/seller" → seller dashboard, artisan panel, upload product, sell\n- "/profile" → my profile, account\n- "/login" → login, sign in\n- "/login?signup=true" → sign up, register, create account\n- "/artisans" → artisans, community, forum\n- "/help" → help, support, contact\n- "OPEN_CART" → cart, shopping bag, basket\n\nRespond with ONLY a JSON object, no markdown, no explanation. Example: {"route": "/collections", "label": "Shop"}`;

  try {
    const geminiOutput = await callGemini(prompt);
    const parsed = JSON.parse(geminiOutput);
    res.json({ route: parsed.route || null, label: parsed.label || transcript });
  } catch (err) {
    // On any Gemini failure, fall back to deterministic local matching
    console.error('Gemini voice error, falling back:', err.message);
    const fallback = FALLBACK_INTENT_MAP.matchIntent(transcript);
    res.json(fallback);
  }
};

module.exports = { chatCompletion, parseVoiceCommand };
