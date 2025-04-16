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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("OpenAI error:", error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
