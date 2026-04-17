import { Resend } from 'resend';
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const payload = req.body;
    if (payload.type !== 'email.received' || !payload.data) {
      return res.status(200).json({ status: 'ignored', message: 'Not an inbound email' });
    }

    const { from, text, subject, message_id } = payload.data;
    const resend = new Resend(process.env.RESEND_API_KEY || '');
    const sql = neon(process.env.DATABASE_URL || '');

    // 1. Identify the lead
    const leads = await sql`
      SELECT id FROM leads 
      WHERE email ILIKE ${from} 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    if (leads.length > 0) {
      const leadId = leads[0].id;

      // 2. Save the message
      await sql`
        INSERT INTO messages (lead_id, sender, content, message_id, subject)
        VALUES (${leadId}, 'client', ${text || 'No text content'}, ${message_id}, ${subject})
        ON CONFLICT (message_id) DO NOTHING
      `;

      // 3. Update lead status
      await sql`
        UPDATE leads SET status = 'New Reply' 
        WHERE id = ${leadId} AND status != 'Converted'
      `;

      // 4. Forward to Gmail
      await resend.emails.send({
        from: 'NextWave Studio Bridge <notifications@dnextwave.com>',
        to: ['d.nextwavetech@gmail.com'],
        subject: `[STUDIO REPLY] From: ${from} - ${subject}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px;">
            <h2 style="color: #1ABC9C;">New Client Response</h2>
            <p><strong>From:</strong> ${from}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">${text}</div>
            <br/>
            <a href="https://dnextwave.com/admin" style="display: inline-block; padding: 10px 20px; background: #0B1F3A; color: #fff; text-decoration: none; border-radius: 6px;">Open Dashboard ➔</a>
          </div>
        `,
      });
    }

    return res.status(200).json({ success: true, message: 'Processed' });
  } catch (error) {
    console.error('Webhook Sync Error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
