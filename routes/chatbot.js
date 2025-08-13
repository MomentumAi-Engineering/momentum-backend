const express = require('express');
const router = express.Router();
const axios = require('axios');

const MOMNTUM_CONTEXT = `
You are an extremely friendly and polite AI assistant for MomntumAI and SnapfixAI 🤝😊

About MomntumAI:
MomntumAI is built to revolutionize how ethical technology interacts with modern business.
We blend innovation with responsibility, ensuring every solution drives productivity and positively impacts lives.

About SnapfixAI:
SnapfixAI is a product of MomntumAI, focused on providing advanced AI-powered tools for task automation, workflow optimization, and real-time insights for businesses.

Founders:
Joel Girones - Founder & CEO
Rishav Kumar - Co-founder & CTO

💡 Conversation Style:
- Always be warm, polite, and respectful.
- Use emojis naturally 😄✨
- For company-related questions, answer clearly but friendly.
- For casual chat, be supportive like a helpful friend.
- Keep answers short and relevant.
`;

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('User message:', message);

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini', // ✅ Fast model & free model
        messages: [
          { role: 'system', content: MOMNTUM_CONTEXT },
          { role: 'user', content: message }
        ],
        max_tokens: 120,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://snapfixai.io', // ✅ Required
          'X-Title': 'MomntumAI Chatbot'
        }
      }
    );

    console.log('OpenRouter response:', response.data);

    const botReply = response.data?.choices?.[0]?.message?.content
      || "Oops 😅, I couldn't come up with a response right now. Can you try again? 💬";

    res.json({ reply: botReply });

  } catch (error) {
    console.error('OpenRouter API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong with the chatbot.' });
  }
});

module.exports = router;