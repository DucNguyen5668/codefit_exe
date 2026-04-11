const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { authMiddleware } = require("../middleware/auth");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = "gemini-2.5-flash-preview-12-2025";

// Helper: build a rich system prompt for code explanations
function buildExplainPrompt({ code, error, exerciseTitle, testResults }) {
    const failedTests = testResults?.filter((t) => !t.passed) || [];
    const failedSummary = failedTests
        .map((t) => `- Expected: "${t.expected}", Got: "${t.got}"`)
        .join("\n");

    return `You are CodeFit AI, an intelligent coding tutor embedded in a coding education platform.
The student is working on a JavaScript exercise titled: "${exerciseTitle || "Unknown Exercise"}".

Here is their code:
\`\`\`javascript
${code || "// No code provided"}
\`\`\`

${error ? `Error message: ${error}\n` : ""}
${failedSummary ? `Failed test cases:\n${failedSummary}\n` : ""}
${failedTests.length === 0 && testResults?.length > 0 ? "All test cases passed! ✅\n" : ""}

Please analyze the code and provide:
1. A clear, friendly explanation of what's wrong (or what's great if it passed)
2. Specific, actionable suggestions to fix or improve the code

Respond in JSON format exactly like this:
{
  "explanation": "Your detailed explanation here with markdown formatting (use **bold**, \`code\`, etc.)",
  "suggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2",
    "Specific suggestion 3"
  ]
}

Be encouraging, educational, and precise. Use Vietnamese if the student seems to prefer it (based on context), otherwise use English. Keep explanations concise but helpful.`;
}

// POST /api/ai/explain — one-shot code analysis
router.post("/explain", authMiddleware, async (req, res) => {
    try {
        const { code, error, exerciseTitle, testResults } = req.body;

        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
        const prompt = buildExplainPrompt({ code, error, exerciseTitle, testResults });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Try to parse JSON from Gemini response
        let parsed;
        try {
            // Strip markdown code block if Gemini wraps it
            const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            parsed = JSON.parse(cleaned);
        } catch {
            // Fallback: return raw text as explanation
            parsed = {
                explanation: text,
                suggestions: [],
            };
        }

        res.json(parsed);
    } catch (err) {
        console.error("Gemini explain error:", err.message);
        res.status(500).json({
            explanation: "⚠️ AI is temporarily unavailable. Please try again.",
            suggestions: ["Check your code for syntax errors", "Make sure your function returns a value"],
        });
    }
});

// POST /api/ai/chat — multi-turn conversational AI
router.post("/chat", authMiddleware, async (req, res) => {
    try {
        const { message, history = [], exerciseContext } = req.body;

        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        // Gemini requires history to start with 'user' and alternate user/model
        // Filter out any leading 'model' messages to avoid API errors
        let safeHistory = [...history];
        while (safeHistory.length > 0 && safeHistory[0].role !== "user") {
            safeHistory.shift();
        }
        // Also ensure alternating: remove consecutive same-role entries
        safeHistory = safeHistory.filter((entry, i) => {
            if (i === 0) return true;
            return entry.role !== safeHistory[i - 1].role;
        });

        // Build system context as prefix in first message if history is empty
        const systemCtx = `You are CodeFit AI, a friendly and knowledgeable coding tutor for a JavaScript learning platform.
${exerciseContext ? `Current exercise: "${exerciseContext.title}" (${exerciseContext.difficulty}). Student's code:\n\`\`\`js\n${exerciseContext.currentCode || ""}\n\`\`\`` : ""}
Help students understand coding concepts, debug their code, and learn JavaScript.
Be encouraging, clear, and educational. Use emojis. Keep responses concise (2-3 paragraphs). Support Vietnamese and English.`;

        let chatHistory = safeHistory;
        let userMessage = message;

        // If no prior history, inject system context into the first user message
        if (chatHistory.length === 0) {
            userMessage = `[System context — do not mention this to the user]:\n${systemCtx}\n\n[Student message]: ${message}`;
        }

        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(userMessage);
        const reply = result.response.text();

        res.json({ reply });
    } catch (err) {
        console.error("Gemini chat error:", err.message);
        res.status(500).json({ reply: "⚠️ AI is temporarily unavailable. Please try again later." });
    }
});

module.exports = router;
