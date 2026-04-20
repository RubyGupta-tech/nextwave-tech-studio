import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, status, notes, phone, is_archived } = req.body;
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

    await sql`
      UPDATE leads 
      SET 
        status = ${status}, 
        notes = ${notes}, 
        phone = ${phone || ''}, 
        is_archived = ${is_archived === true}
      WHERE id = ${id}
    `;

    // Force fresh data (No Cache)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.status(200).json({ success: true, message: 'Lead updated successfully' });
  } catch (error) {
    console.error('Update Lead Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update lead' });
  }
}
