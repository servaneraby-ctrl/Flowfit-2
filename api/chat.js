export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { messages, system } = req.body;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system,
        messages
      })
    });
    const data = await r.json();
    const reply = data?.content?.[0]?.text || JSON.stringify(data);
    res.status(200).json({ reply });
  } catch (e) {
    res.status(200).json({ reply: 'ERREUR: ' + e.message });
  }
}
