import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // 1. Validation: Only POST allowed (Zapier/Make use POST)
  // Friendly message for browser visits
  if (req.method === 'GET') {
    return res.status(200).send(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center; color: #0B1F3A;">
        <h1 style="color: #1ABC9C;">⚡ NextWave CRM Sync Engine</h1>
        <p>Your Inbox Webhook is <b>ONLINE</b> and waiting for deliveries.</p>
        <p style="font-size: 13px; color: #64748b;">(Note: This URL is for Zapier/Make automation. Visits via browser are for status checking only.)</p>
      </div>
    `);
  }

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

  // 3. Robust Data Extraction
  // We check multiple common webhook field names (Zapier, Mailgun, SendGrid)
  let emailContent = (
    content || 
    req.body.text || 
    req.body.body || 
    req.body['body-plain'] || 
    req.body['stripped-text'] || 
    req.body['stripped_text'] ||
    subject
  );

  // If content is an object (sometimes webhooks nest data), try to stringify or find text
  if (emailContent && typeof emailContent === 'object') {
    emailContent = emailContent.text || emailContent.body || JSON.stringify(emailContent);
  }

  // Debug Fallback: If no text is found in standard fields, dump the entire body so we can see what Zapier is sending
  let finalContent = emailContent?.toString().trim();
  
  if (!finalContent || finalContent === subject) {
    finalContent = `[DEBUG v28] TEXT NOT FOUND. RAW PAYLOAD: ${JSON.stringify(req.body).substring(0, 500)}...`;
  }

  if (!from_email) {
    return res.status(400).json({ error: 'Missing from_email field.' });
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
      VALUES (${leadId}, 'client', ${finalContent})
    `;

    return res.status(200).json({ success: true, message: 'Message synced to CRM successfully.' });

  } catch (error) {
    console.error('Inbound Sync Error:', error);
    return res.status(500).json({ error: 'Internal Server Error during sync' });
  }
}
