import { neon } from '@neondatabase/serverless';
// Heartbeat: 2026-04-13T23:08:00Z

export default async function handler(req, res) {
  // 1. Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Check for the admin password (headers first, then query param fallback for GET)
  const authHeader = (req.headers['x-crm-admin-key'] || req.headers['x-nextwave-auth'] || req.query.auth)?.trim();
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!correctPassword) {
    return res.status(500).json({ error: 'ERR_ENV_PASSWORD_MISSING' });
  }

  if (!authHeader) {
    return res.status(401).json({ error: 'ERR_AUTH_MISSING' });
  }

  if (authHeader !== correctPassword) {
    return res.status(401).json({ error: 'ERR_AUTH_INVALID' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'ERR_ENV_DB_URL_MISSING' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Silent Migration (v32.1): Ensure updated_at exists for sorting
    await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`.catch(() => {});
    
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
      ORDER BY updated_at DESC, created_at DESC 
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
