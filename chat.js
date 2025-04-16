export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.proelectrictrike.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // <-- API Key artık dışarıda
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("OpenAI API response error:", errorDetails);
      return res.status(500).json({ error: "OpenAI API error", details: errorDetails });
    }

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    console.error("OpenAI error:", error);
    return res.status(500).json({
      error: 'Something went wrong',
      details: error.message
    });
  }
}
