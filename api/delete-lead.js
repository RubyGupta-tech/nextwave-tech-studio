import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;
  const authHeader = (req.headers['x-crm-admin-key'] || req.headers['x-nextwave-auth'] || req.body.auth)?.trim();
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!authHeader) {
    return res.status(401).json({ error: 'Auth header missing' });
  }

  if (authHeader !== correctPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Database configuration missing' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // 1. Delete associated messages first (Cascade delete)
    await sql`
      DELETE FROM messages WHERE lead_id = ${parseInt(id)}
    `;

    // 2. Delete the lead
    await sql`
      DELETE FROM leads WHERE id = ${parseInt(id)}
    `;

    return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete Lead Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete lead' });
  }
}
