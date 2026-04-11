import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
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
      message: 'Database table "leads" created or already exists.',
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
