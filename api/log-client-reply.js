import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { leadId, content } = req.body;
  const authHeader = (req.headers['x-crm-admin-key'] || req.headers['x-nextwave-auth'] || req.body.auth)?.trim();
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();

  // 1. Authorization Check
  if (!authHeader) {
    return res.status(401).json({ error: 'Auth header missing' });
  }

  if (authHeader !== correctPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  if (!leadId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Database configuration missing' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Save the manually logged client message
    await sql`
      INSERT INTO messages (lead_id, sender, content)
      VALUES (${parseInt(leadId)}, 'client', ${content})
    `;

    return res.status(200).json({ success: true, message: 'Client message logged successfully' });
  } catch (error) {
    console.error('Log Client Reply Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to log message' });
  }
}
