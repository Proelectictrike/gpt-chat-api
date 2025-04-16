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
