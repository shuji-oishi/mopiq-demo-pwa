export default function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;
    res.status(200).json({ reply: `あなたのメッセージ: ${message}` });
  } else {
    res.status(405).end();
  }
}
