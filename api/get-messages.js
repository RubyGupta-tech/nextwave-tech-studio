import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { leadId } = req.query;
  const authHeader = req.headers['x-nextwave-auth']?.trim();
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();

  // 1. Authorization Check
  if (!authHeader || authHeader !== correctPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!leadId) {
    return res.status(400).json({ error: 'Missing leadId' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Database configuration missing' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const messages = await sql`
      SELECT * FROM messages 
      WHERE lead_id = ${parseInt(leadId)} 
      ORDER BY created_at ASC
    `;

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Get Messages Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch conversation history' });
  }
}
