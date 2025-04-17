const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "https://proelectrictrike.com" // or use "*" for testing
}));
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const messages = req.body.messages || [];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are the Perraro Electric Trike Help Bot. Be helpful and answer only questions about Perraro trikes."
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "Sorry, I didn’t get that." });
  } catch (error) {
    console.error("GPT ERROR:", error);
    res.status(500).json({ reply: "⚠️ GPT error. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`GPT Chatbot server running on port ${PORT}`);
});
