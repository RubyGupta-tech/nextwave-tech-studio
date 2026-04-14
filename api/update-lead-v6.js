import { neon } from '@neondatabase/serverless';
// Nuclear Sync v6.0 - 2026-04-13T23:14:00Z

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, status, notes, phone, is_archived } = req.body;
  const authHeader = req.headers['x-nextwave-auth']?.trim();
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!authHeader || authHeader !== correctPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
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

    return res.status(200).json({ success: true, message: 'Lead updated successfully v6' });
  } catch (error) {
    console.error('Update Lead Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update lead v6' });
  }
}
