import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ success: false, error: 'DATABASE_URL is not defined' });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Starting CRM Migration...');
    
    // 1. Add 'status' column if it doesn't exist
    await sql`
      ALTER TABLE leads 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'New';
    `;

    // 2. Add 'notes' column if it doesn't exist
    await sql`
      ALTER TABLE leads 
      ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
    `;

    // 3. Update any null statuses to 'New' just in case
    await sql`
      UPDATE leads SET status = 'New' WHERE status IS NULL;
    `;

    return res.status(200).json({ 
      success: true, 
      message: 'Database migration successful: CRM columns (status, notes) added to "leads" table.' 
    });
  } catch (error) {
    console.error('Migration Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
