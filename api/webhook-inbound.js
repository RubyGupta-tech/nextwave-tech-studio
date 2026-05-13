import { Resend } from 'resend';
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const payload = req.body;
    
    // 1. Metadata Verification
    const emailId = payload.data?.email_id;
    const fromEmail = payload.data?.from;
    const subject = payload.data?.subject || "No Subject";

    if (payload.type !== 'email.received') {
      return res.status(200).json({ status: 'ignored', type: payload.type });
    }

    const resend = new Resend(process.env.RESEND_API_KEY || '');
    const sql = neon(process.env.DATABASE_URL || '');

    // Check payload first (Robust extraction for Resend and Zapier)
    let finalContent = payload.data?.text || 
                       payload.data?.body_plain || 
                       payload.data?.html?.replace(/<[^>]*>?/gm, '') || 
                       payload.text || 
                       payload.body_plain || 
                       payload.content || 
                       payload.html?.replace(/<[^>]*>?/gm, '') || 
                       "";
    
    // Resend webhooks DO NOT include text/html in the payload. 
    // They must be fetched via the API. Since Vercel limits us to 10s, we instantly drop an indexing message.
    if (!finalContent || finalContent.trim() === '') {
      finalContent = `📩 **NEW REPLY RECEIVED**\nSubject: ${subject}\n\n[The full text of this message is still indexing at Resend. Please check your inbox directly or refresh the dashboard in a moment.]`;
    }

    const cleanContent = finalContent.toString().trim();

    // 1. Identify the lead
    const leads = await sql`
      SELECT id FROM leads 
      WHERE email ILIKE ${fromEmail} 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    if (leads.length > 0) {
      const leadId = leads[0].id;

      // 3. Save the message
      await sql`
        INSERT INTO messages (lead_id, sender, content, message_id, subject)
        VALUES (${leadId}, 'client', ${cleanContent}, ${emailId}, ${subject})
        ON CONFLICT (message_id) DO NOTHING
      `;

      // 3. Update lead status & timestamp
      await sql`
        UPDATE leads 
        SET status = 'New Reply', updated_at = NOW() 
        WHERE id = ${leadId} AND status != 'Converted'
      `;

      // 4. Forward to Gmail
      try {
        await resend.emails.send({
          from: 'NextWave Studio Bridge <notifications@dnextwave.com>',
          to: ['d.nextwavetech@gmail.com'],
          subject: `[STUDIO REPLY] From: ${fromEmail} - ${subject}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px;">
              <h2 style="color: #1ABC9C;">New Client Response</h2>
              <p><strong>From:</strong> ${fromEmail}</p>
              <p><strong>Message:</strong></p>
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">${cleanContent}</div>
              <br/>
              <a href="https://dnextwave.com/admin" style="display: inline-block; padding: 10px 20px; background: #0B1F3A; color: #fff; text-decoration: none; border-radius: 6px;">Open Dashboard -></a>
            </div>
          `,
        });
      } catch (forwardError) {
        // If forwarding fails, save the error in the notes or message so we can see it
        await sql`
          UPDATE messages 
          SET content = content || '\n\n⚠️ Forwarding Error: ' || ${forwardError.message}
          WHERE message_id = ${emailId}
        `;
      }
    }

    return res.status(200).json({ success: true, message: 'Processed' });
  } catch (error) {
    console.error('Webhook Sync Error:', error.message);
    // Even if it fails, try to log the error to the database
    try {
      const sql = neon(process.env.DATABASE_URL || '');
      await sql`INSERT INTO messages (lead_id, sender, content) VALUES (1, 'admin', ${'CRITICAL WEBHOOK ERROR: ' + error.message})`;
    } catch (e) {}
    return res.status(500).json({ success: false, error: error.message });
  }
}
