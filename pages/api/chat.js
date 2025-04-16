export default async function handler(req, res) {
  // Allow requests from your Shopify domain
  res.setHeader('Access-Control-Allow-Origin', 'https://www.proelectrictrike.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight CORS request
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message format" });
    }

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
            content: "You are Perraro AI Assistant. Help customers with electric trike orders, warranties, assembly, and general support. Be friendly, helpful, and clear."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !Array.isArray(data.choices)) {
      console.error("Unexpected GPT response:", data);
      return res.status(500).json({ error: "Invalid response from OpenAI" });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("OpenAI error:", error);
    return res.status(500).json({ error: "Something went wrong", detail: error.message });
  }
}
