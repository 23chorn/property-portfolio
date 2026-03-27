export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { pin } = req.body || {}
  const correctPin = process.env.APP_PIN

  if (!correctPin) {
    // No PIN configured — allow access
    return res.json({ ok: true })
  }

  if (pin === correctPin) {
    return res.json({ ok: true })
  }

  return res.status(401).json({ ok: false, error: 'Invalid PIN' })
}
