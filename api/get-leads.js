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
    const search = req.query.search || '';
    const serviceFilter = req.query.service || 'all';
    
    let queryConditions = [];
    const params = [];

    // Time-based filtering
    if (filter === 'today') {
      queryConditions.push("created_at >= NOW() - INTERVAL '1 day'");
    } else if (filter === 'week') {
      queryConditions.push("created_at >= NOW() - INTERVAL '7 days'");
    } else if (filter === 'month') {
      queryConditions.push("created_at >= NOW() - INTERVAL '30 days'");
    }

    // Search filtering (name or email)
    if (search) {
      queryConditions.push(`(name ILIKE '%${search}%' OR email ILIKE '%${search}%')`);
    }

    // Service filtering
    if (serviceFilter !== 'all') {
      queryConditions.push(`service = '${serviceFilter}'`);
    }

    const whereClause = queryConditions.length > 0 ? `WHERE ${queryConditions.join(' AND ')}` : '';
    
    const rows = await sql.query(`
      SELECT * FROM leads 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT 1000
    `);

    return res.status(200).json({ 
      success: true, 
      leads: rows.rows,
      total: rows.rowCount 
    });
  } catch (error) {
    console.error('Database Fetch Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch leads from database' 
    });
  }
}
