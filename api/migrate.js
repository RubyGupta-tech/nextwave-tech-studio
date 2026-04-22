import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const auth = req.query.auth;
  if (auth !== process.env.ADMIN_PASSWORD) {
    return res.status(401).send('Unauthorized');
  }

  const sql = neon(process.env.DATABASE_URL);
  try {
    await sql`
      ALTER TABLE leads 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `;
    await sql`UPDATE leads SET updated_at = created_at WHERE updated_at IS NULL`;
    return res.status(200).send('Migration successful: updated_at column added.');
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
