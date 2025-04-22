export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method is allowed" });
  }

  try {
    const { message } = req.body;

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant for electric trike customers." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await completion.json();

    if (data.error) {
      return res.status(500).json({ message: "OpenAI API error: " + data.error.message });
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ message: reply });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
}
