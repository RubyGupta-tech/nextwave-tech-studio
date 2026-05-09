import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Health check
  if (req.method === 'GET') {
    return res.status(200).send(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center; color: #0B1F3A;">
        <h1 style="color: #1ABC9C;">⚡ NextWave PLATINUM Sync Engine</h1>
        <p>Your Inbox Webhook is <b>ONLINE</b> and waiting for deliveries.</p>
        <p style="font-size: 13px; color: #64748b;">(v34.2 PLATINUM SYNC ACTIVE)</p>
      </div>
    `);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth check
  const { auth, from_email, content, subject } = req.body;
  const authKey = (req.query.auth || auth || req.headers['x-crm-admin-key'])?.trim();
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!correctPassword || authKey !== correctPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing sync key.' });
  }

  // Extract email body from Zapier payload
  // Zapier can send it as: content, text, body, body-plain, stripped-text
  let emailContent = (
    content ||
    req.body.text ||
    req.body.body ||
    req.body['body-plain'] ||
    req.body['stripped-text'] ||
    subject ||
    ''
  );

  if (emailContent && typeof emailContent === 'object') {
    emailContent = emailContent.text || emailContent.body || JSON.stringify(emailContent);
  }

  const finalContent = emailContent?.toString().trim() || '(No message body)';
  const senderEmail = (from_email || req.body.data?.from || '').trim();

  if (!senderEmail) {
    return res.status(400).json({ error: 'Missing sender email (from_email).' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Find the lead by email
    const leads = await sql`
      SELECT id FROM leads 
      WHERE email ILIKE ${senderEmail} 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    if (leads.length === 0) {
      return res.status(200).json({ 
        success: true, 
        warning: 'Email received but no matching lead found in CRM.' 
      });
    }

    const leadId = leads[0].id;

    // Check if there's an existing placeholder message for this reply
    // (created by the Resend webhook firing first) and UPDATE it instead of inserting a duplicate
    const existingPlaceholder = await sql`
      SELECT id FROM messages 
      WHERE lead_id = ${leadId}
        AND sender = 'client'
        AND content LIKE '%still indexing at Resend%'
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (existingPlaceholder.length > 0) {
      // Replace the placeholder with the real content from Zapier
      await sql`
        UPDATE messages
        SET content = ${finalContent}, subject = ${subject || null}
        WHERE id = ${existingPlaceholder[0].id}
      `;
      return res.status(200).json({ success: true, message: 'Placeholder updated with real email body.' });
    }

    // No placeholder found — just insert fresh
    await sql`
      INSERT INTO messages (lead_id, sender, content, subject)
      VALUES (${leadId}, 'client', ${finalContent}, ${subject || null})
    `;

    // Update lead status
    await sql`
      UPDATE leads 
      SET status = 'New Reply', updated_at = NOW()
      WHERE id = ${leadId} AND status != 'Converted'
    `;

    return res.status(200).json({ success: true, message: 'Message synced to CRM successfully.' });

  } catch (error) {
    console.error('Inbound Sync Error:', error);
    return res.status(500).json({ error: 'Internal Server Error during sync' });
  }
}
