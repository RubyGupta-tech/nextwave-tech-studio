import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');

  if (!process.env.DATABASE_URL) {
    return res.status(500).send(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center;">
        <h2 style="color: #e74c3c;">❌ Migration Failed</h2>
        <p>DATABASE_URL is missing in Vercel environment variables.</p>
      </div>
    `);
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    // 1. Add CRM columns
    await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'New';`;
    await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';`;
    await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT '';`;
    await sql`UPDATE leads SET status = 'New' WHERE status IS NULL;`;

    return res.status(200).send(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center; background: #f0fdf4; border-radius: 20px; border: 2px solid #22c55e; max-width: 600px; margin: 40px auto;">
        <h2 style="color: #16a34a;">✅ Migration Successful!</h2>
        <p style="font-size: 18px; color: #166534;">Your NextWave CRM is now fully activated.</p>
        <p style="color: #374151;">The 'Status' and 'Notes' columns have been added to your database.</p>
        <hr style="border: 0; border-top: 1px solid #bbf7d0; margin: 20px 0;" />
        <a href="https://www.dnextwave.com/admin" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold;">Go to Admin Dashboard ➔</a>
      </div>
    `);
  } catch (error) {
    return res.status(500).send(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center;">
        <h2 style="color: #e74c3c;">❌ Database Error</h2>
        <p>${error.message}</p>
      </div>
    `);
  }
}

