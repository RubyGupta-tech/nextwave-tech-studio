import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;
  
  // Basic Resend webhook structure check
  if (payload.type !== 'email.received' || !payload.data) {
    return res.status(200).json({ status: 'ignored', message: 'Not an inbound email' });
  }

  const { from, text, subject, message_id, created_at } = payload.data;
  
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Database configuration missing' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // 1. Identify the lead by matching the 'from' email address
    // We look for the most recent lead with this email address
    const leads = await sql`
      SELECT id FROM leads 
      WHERE email ILIKE ${from} 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    if (leads.length === 0) {
      console.log(`No lead found for email: ${from}`);
      return res.status(200).json({ status: 'success', message: 'Lead not found, skipping save' });
    }

    const leadId = leads[0].id;

    // 2. Save the message to the conversation history
    await sql`
      INSERT INTO messages (lead_id, sender, content, message_id, subject)
      VALUES (${leadId}, 'client', ${text || 'No text content'}, ${message_id}, ${subject})
      ON CONFLICT (message_id) DO NOTHING
    `;

    // 3. Update lead status to 'New Reply' for visibility
    await sql`
      UPDATE leads 
      SET status = 'New Reply' 
      WHERE id = ${leadId} AND status != 'Converted'
    `;

    return res.status(200).json({ 
      success: true, 
      message: 'Inbound message synced to database successfully',
      leadId: leadId
    });
  } catch (error) {
    console.error('Webhook Inbound Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
