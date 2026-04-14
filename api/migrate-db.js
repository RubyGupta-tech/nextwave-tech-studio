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
    await sql`ALTER TABLE leads ALTER COLUMN email DROP NOT NULL;`;
    await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;`;
    await sql`UPDATE leads SET is_archived = false WHERE is_archived IS NULL;`;
    await sql`UPDATE leads SET status = 'New' WHERE status IS NULL;`;

    return res.status(200).send(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center; background: #f0fdf4; border-radius: 20px; border: 2px solid #22c55e; max-width: 600px; margin: 40px auto;">
        <h1>CRM Database Sync v5.0 (Cloud Sync Enabled)</h1>
        <p style="color: green; font-weight: bold;">✔ Archive system correctly initialized.</p>
        <p style="color: green; font-weight: bold;">✔ Email field correctly set to optional.</p>
        <p style="color: green; font-weight: bold;">✔ Records synchronized for Inbox/Archives filtering.</p>
        <br/>
        <a href="/admin" style="padding: 10px 20px; background: #0B1F3A; color: #fff; text-decoration: none; border-radius: 5px;">Back to Dashboard</a>
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

