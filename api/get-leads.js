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
    
    // 3. Handle Filtering Logic
    const filter = req.query.filter || 'all';
    const searchQuery = (req.query.search || '').trim();
    const serviceFilter = req.query.service || 'all';
    const tab = req.query.tab || 'active';
    const isArchived = (tab === 'archived');
    
    // We'll use a single robust query with flexible WHERE clauses.
    // This is safer and prevents complex string building.
    const searchPattern = searchQuery ? `%${searchQuery}%` : '';

    const rows = await sql`
      SELECT * FROM leads 
      WHERE 
        is_archived = ${isArchived}
        AND (${searchPattern} = '' OR name ILIKE ${searchPattern} OR email ILIKE ${searchPattern})
        AND (${serviceFilter} = 'all' OR service = ${serviceFilter})
        AND (
          ${filter} = 'all' 
          OR (${filter} = 'today' AND created_at >= NOW() - INTERVAL '1 day')
          OR (${filter} = 'week' AND created_at >= NOW() - INTERVAL '7 days')
          OR (${filter} = 'month' AND created_at >= NOW() - INTERVAL '30 days')
        )
      ORDER BY created_at DESC 
      LIMIT 1000
    `;

    // Force fresh data (No Cache)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.status(200).json({ 
      success: true, 
      leads: rows,
      total: rows.length,
      debug: { tab, isArchived }
    });
  } catch (error) {
    console.error('Database Fetch Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch leads from database' 
    });
  }
}
