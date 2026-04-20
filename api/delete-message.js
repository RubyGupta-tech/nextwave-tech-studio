import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, auth } = req.body;
  const authHeader = (req.headers['x-crm-admin-key'] || req.headers['x-nextwave-auth'] || auth)?.trim();
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();

  // 1. Triple-Lock Authentication
  if (!correctPassword) {
    return res.status(500).json({ error: 'ERR_ENV_PASSWORD_MISSING' });
  }
  if (!authHeader || authHeader !== correctPassword) {
    return res.status(401).json({ error: 'ERR_AUTH_INVALID' });
  }

  if (!id) {
    return res.status(400).json({ error: 'Missing message ID' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Database configuration missing' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Delete the specific message
    await sql`DELETE FROM messages WHERE id = ${parseInt(id)}`;

    return res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete Message Error:', error);
    return res.status(500).json({ success: false, error: 'ERR_DB_QUERY_FAILED', details: error.message });
  }
}
