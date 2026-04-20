import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const status = {
    auth: !!process.env.ADMIN_PASSWORD,
    db: !!process.env.DATABASE_URL,
    pLen: process.env.ADMIN_PASSWORD?.length || 0,
    v: 20,
    status: 'checking'
  };

  try {
    if (status.db) {
      const sql = neon(process.env.DATABASE_URL);
      await sql`SELECT 1`;
      status.dbStatus = 'online';
    } else {
      status.dbStatus = 'config_missing';
    }

    status.status = (status.auth && status.db && status.dbStatus === 'online') ? 'online' : 'error';
    
    return res.status(200).json(status);
  } catch (error) {
    return res.status(200).json({ 
      ...status, 
      status: 'error', 
      error: error.message 
    });
  }
}
