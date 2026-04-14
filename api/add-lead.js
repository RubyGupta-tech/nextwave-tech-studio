import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, service, notes, source = 'manual_entry' } = req.body;
  const authHeader = req.headers['x-nextwave-auth']?.trim();
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();

  // 1. Authorization Check
  if (!authHeader || authHeader !== correctPassword) {
    return res.status(401).json({ error: 'Unauthorized manual entry' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Database configuration missing' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // 2. Insert the lead manually
    const result = await sql`
      INSERT INTO leads (name, email, phone, service, notes, source, status)
      VALUES (${name}, ${email}, ${phone || ''}, ${service}, ${notes || ''}, ${source}, 'New')
      RETURNING *
    `;

    return res.status(200).json({ 
      success: true, 
      message: 'Manual lead added successfully',
      lead: result[0]
    });
  } catch (error) {
    console.error('Add Lead Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to add lead to database',
      details: error.message 
    });
  }
}
