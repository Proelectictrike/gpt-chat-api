export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.proelectrictrike.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST requests allowed' });

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY"  // Replace with your real key
      },
      body: JSON.stringify({
        model: "gpt-4", // or "gpt-3.5-turbo"
        messages: [
          { role: "system", content: "You are a helpful support assistant for Perraro Electric Bikes. Answer questions clearly, provide warranty help, and give product advice." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("OpenAI error:", error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
