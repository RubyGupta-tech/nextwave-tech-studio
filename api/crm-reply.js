import { Resend } from 'resend';
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Global catch-all for any unexpected errors
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { leadId, toEmail, toName, replyText, originalMessage, service } = req.body;
    const authHeader = req.headers['x-nextwave-auth']?.trim();
    const correctPassword = process.env.ADMIN_PASSWORD?.trim();

    // 1. Auth Check
    if (!authHeader || authHeader !== correctPassword) {
      return res.status(401).json({ error: 'Unauthorized: Admin password mismatch.' });
    }

    // 2. Env check
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'System Error: RESEND_API_KEY missing.' });
    }
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: 'System Error: DATABASE_URL missing.' });
    }

    // 3. Validation
    if (!leadId || !toEmail || !replyText) {
      return res.status(400).json({ error: 'Missing required lead details or message content.' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const sql = neon(process.env.DATABASE_URL);

    // 4. Send Email
    const { data: mailResult, error: mailError } = await resend.emails.send({
      from: 'NextWave Tech Studio <hello@dnextwave.com>',
      to: [toEmail],
      reply_to: 'd.nextwavetech@gmail.com',
      subject: `Re: Your Inquiry for ${service} - NextWave Tech Studio`,
      html: `
        <div style="font-family: sans-serif; padding: 40px; color: #1e293b; max-width: 650px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px;">
          <div style="margin-bottom: 25px; padding: 15px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0; font-size: 13px; color: #166534; text-align: center;">
            <strong>💬 Studio Response:</strong> Please reply directly to this thread—your message will be delivered to <b>d.nextwavetech@gmail.com</b>.
          </div>
          <p>Hi ${toName || 'there'},</p>
          <div style="white-space: pre-wrap; line-height: 1.6; margin-bottom: 30px;">${replyText}</div>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #1ABC9C;">
            <p style="font-size: 11px; color: #64748B; margin: 0 0 8px 0;">ORIGINAL MESSAGE:</p>
            <p style="font-style: italic; margin: 0; font-size: 14px;">"${originalMessage || 'N/A'}"</p>
          </div>
        </div>
      `,
    });

    if (mailError) {
      console.error('Resend API Error:', mailError);
      return res.status(400).json({ error: `Email Delivery Failed: ${mailError.message}` });
    }

    // 5. Save Record
    const lId = parseInt(leadId);
    if (isNaN(lId)) {
      return res.status(400).json({ error: 'Invalid Lead ID' });
    }

    await sql`
      INSERT INTO messages (lead_id, sender, content, message_id)
      VALUES (${lId}, 'admin', ${replyText}, ${mailResult?.id || null})
    `;

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent and record saved.',
      id: mailResult?.id 
    });

  } catch (error) {
    console.error('CRITICAL CRM ERROR:', error);
    return res.status(500).json({ 
      error: 'Critical Server Error', 
      details: error.message 
    });
  }
}
