export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { messages } = req.body;

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
            content: "You are the Perraro Electric Trike Help Bot. Answer only questions about Perraro electric trikes, product support, and features. Be friendly and clear."
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices?.[0]?.message?.content || "Sorry, I didn’t get that." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "⚠️ There was an error. Please try again later." });
  }
}
