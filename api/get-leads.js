import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // 1. Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Check for the admin password in the headers
  const authHeader = req.headers['x-nextwave-auth']?.trim();
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!correctPassword) {
    return res.status(500).json({ error: 'Server Error: ADMIN_PASSWORD is not set.' });
  }

  if (!authHeader || authHeader !== correctPassword) {
    return res.status(401).json({ 
      error: 'Invalid password. Unauthorized access.' 
    });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL is not defined.' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    // 3. Fetch leads from the database, newest first
    const rows = await sql`
      SELECT * FROM leads 
      ORDER BY created_at DESC 
      LIMIT 500;
    `;

    return res.status(200).json({ 
      success: true, 
      leads: rows,
      total: rows.length 
    });
  } catch (error) {
    console.error('Database Fetch Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch leads from database' 
    });
  }
}
