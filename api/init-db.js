import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ success: false, error: 'DATABASE_URL is not defined' });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    // Create the leads table if it doesn't exist
    const result = await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        service VARCHAR(255),
        message TEXT,
        source VARCHAR(50) DEFAULT 'website_form',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    return res.status(200).json({ 
      success: true, 
      message: 'Database table "leads" created or already exists for NextWave Tech Studio.',
      result: result
    });
  } catch (error) {
    console.error('Database Init Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
