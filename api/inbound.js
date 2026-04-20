import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // 1. Validation: Only POST allowed (Zapier/Make use POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Auth: Check for secret token in query param or body
  const { auth, from_email, content, subject } = req.body;
  const authKey = (req.query.auth || auth || req.headers['x-crm-admin-key'])?.trim();
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!correctPassword || authKey !== correctPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing sync key.' });
  }

  // 3. Data Check
  if (!from_email || !content) {
    return res.status(400).json({ error: 'Missing required email data (from_email and content).' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // 4. Find the lead by email
    const leads = await sql`SELECT id FROM leads WHERE email ILIKE ${from_email.trim()} LIMIT 1`;

    if (leads.length === 0) {
      // Logic: If lead not found, we don't know where to put it. 
      // Option: Create a "Ghost Lead" or just return success with a warning.
      return res.status(200).json({ success: true, warning: 'Email received but no matching lead found in CRM.' });
    }

    const leadId = leads[0].id;

    // 5. Insert into messages as 'client'
    await sql`
      INSERT INTO messages (lead_id, sender, content)
      VALUES (${leadId}, 'client', ${content})
    `;

    return res.status(200).json({ success: true, message: 'Message synced to CRM successfully.' });

  } catch (error) {
    console.error('Inbound Sync Error:', error);
    return res.status(500).json({ error: 'Internal Server Error during sync' });
  }
}
