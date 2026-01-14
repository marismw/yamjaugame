
// This file represents a serverless function that could be deployed
// to platforms like Vercel, Netlify, or Cloudflare Workers.
// It acts as a backend endpoint for the Truth or Dare AI question generation.

module.exports = async (req, res) => {
    // Enable CORS for development purposes (you might want to restrict this in production)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle pre-flight CORS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are accepted.' });
        return;
    }

    try {
        const { ageGroup, relationship, occasion } = req.body;

        if (!ageGroup || !relationship || !occasion) {
            res.status(400).json({ error: 'Bad Request', message: 'Missing ageGroup, relationship, or occasion parameters.' });
            return;
        }

        // --- Integrate with AI API (DeepSeek example) ---
        const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; // Store API key securely as environment variable
        if (!DEEPSEEK_API_KEY) {
            console.error('DEEPSEEK_API_KEY is not set.');
            res.status(500).json({ error: 'Internal Server Error', message: 'AI API key not configured. Please set DEEPSEEK_API_KEY environment variable.' });
            return;
        }

        const prompt = `請你用繁體中文、偏廣東話，為一班玩家設計 50 條『真心話大冒險』題目。
玩家資料：
年齡層：${ageGroup}
群組特徵：${relationship}
活動場合：${occasion}
要求：
題目要適合以上年齡層和場合，避免太成人、過份尷尬或難以收科。
不可包含色情、仇恨、歧視、自殘、自殺、暴力、霸凌或任何違法內容。
type 為 \'truth\' 時，題目偏向聊天、了解彼此、分享經歷。
type 為 \'dare\' 時，題目偏向安全、無危險行為、唔涉及財物破壞。
請以純 JSON 陣列回傳，格式如下：
[
  {"text": "題目一內容", "type": "truth"},
  {"text": "題目二內容", "type": "dare"}
]
不要加任何多餘文字或註解，只輸出 JSON。`;

        const aiResponse = await fetch('https://api.deepseek.com/chat/completions', { // DeepSeek Chat API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat', // Use an appropriate model
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 2000, // Adjust based on expected output length
                temperature: 0.7 // Adjust for creativity vs. consistency
            })
        });

        if (!aiResponse.ok) {
            const errorText = await aiResponse.text();
            console.error(`AI API HTTP Error: ${aiResponse.status} - ${errorText}`);
            throw new Error(`AI API request failed: ${aiResponse.status} - ${errorText.substring(0, 200)}...`);
        }

        const aiData = await aiResponse.json();
        const rawContent = aiData.choices[0]?.message?.content;

        if (!rawContent) {
            throw new Error('AI response contained no content.');
        }

        // Process AI raw text response (extract JSON)
        let generatedQuestions = [];
        try {
            // Attempt to extract JSON from potentially wrapped AI response (AI might add ```json wrappers)
            const jsonMatch = rawContent.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch && jsonMatch[1]) {
                generatedQuestions = JSON.parse(jsonMatch[1]);
            } else {
                // Fallback if no ```json``` wrapper, assume the whole content is JSON
                generatedQuestions = JSON.parse(rawContent);
            }
        } catch (jsonError) {
            console.error('Failed to parse AI response JSON:', jsonError);
            throw new Error('AI returned malformed JSON.');
        }

        // Validate generated questions and filter to max 50
        const validatedQuestions = generatedQuestions.filter(q =>
            typeof q.text === 'string' && q.text.length > 0 &&
            (q.type === 'truth' || q.type === 'dare')
        ).slice(0, 50); // Ensure no more than 50 questions

        if (validatedQuestions.length === 0) {
            throw new Error('AI 生成的題目無效或數量不足導致沒有有效題目。');
        }

        res.status(200).json({ questions: validatedQuestions });

    } catch (error) {
        console.error('Backend API Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};
