import { neon } from '@neondatabase/serverless';
// Nuclear Sync v6.0 - 2026-04-13T23:14:00Z

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    const filter = req.query.filter || 'all';
    const searchQuery = (req.query.search || '').trim();
    const serviceFilter = req.query.service || 'all';
    const tab = req.query.tab || 'active';
    const isArchived = (tab === 'archived');
    
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
      v: '6.0',
      tab: tab
    });
  } catch (error) {
    console.error('Database Fetch Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch leads' });
  }
}
