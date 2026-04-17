import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { leadId, toEmail, toName, replyText, originalMessage, service } = req.body;
  const authHeader = req.headers['x-nextwave-auth']?.trim();
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();

  // 1. Authorization Check
  if (!authHeader || authHeader !== correctPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!replyText || !toEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Send the reply email via Resend
    const { data, error: mailError } = await resend.emails.send({
      from: 'NextWave (Ruby G - d.nextwavetech@gmail.com) <hello@dnextwave.com>',
      to: [toEmail],
      reply_to: 'd.nextwavetech@gmail.com',
      subject: `Re: Your Inquiry for ${service} - NextWave Tech Studio`,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; padding: 40px; color: #1e293b; max-width: 650px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          
          <div style="margin-bottom: 25px; padding: 15px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0; font-size: 13px; color: #166534; text-align: center;">
            <strong>💬 Studio Response:</strong> Please reply directly to this thread—your message will be delivered to <b>d.nextwavetech@gmail.com</b>.
          </div>

          <div style="margin-bottom: 30px;">
            <img src="https://dnextwave.com/NextWave_logo1.web.jpeg" alt="NextWave Logo" style="width: 60px; height: auto; border-radius: 8px;" />
          </div>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hi ${toName},</p>
          
          <div style="font-size: 16px; line-height: 1.7; color: #334155; margin-bottom: 30px; white-space: pre-wrap;">
${replyText}
          </div>

          <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 40px; border-left: 4px solid #1ABC9C;">
            <p style="margin: 0; font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;"><strong>Regarding your message:</strong></p>
            <p style="font-style: italic; color: #475569; margin: 0; line-height: 1.6; font-size: 14px;">"${originalMessage}"</p>
          </div>

          <div style="padding-top: 30px; border-top: 1px solid #f1f5f9;">
            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
              <tr>
                <td style="border-left: 3px solid #1ABC9C; padding-left: 20px;">
                  <div style="font-weight: 800; color: #0B1F3A; font-size: 18px; letter-spacing: -0.5px;">NextWave Tech Studio</div>
                  <div style="font-size: 14px; color: #64748B; margin-top: 5px;">
                    <a href="https://www.dnextwave.com" style="color: #1ABC9C; text-decoration: none; font-weight: 600;">www.dnextwave.com</a>
                  </div>
                  <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">
                    Design • Development • SEO • Digital Strategy
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 30px; font-size: 11px; color: #cbd5e1; text-align: center;">
            This email was sent from the NextWave Studio response system.
          </div>
        </div>
      `,
    });

    if (mailError) {
      console.error('Resend Reply Error:', mailError);
      return res.status(400).json({ error: mailError.message });
    }

    // 3. Save to database conversation history
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO messages (lead_id, sender, content, message_id, subject)
      VALUES (${parseInt(leadId)}, 'admin', ${replyText}, ${data.id}, ${`Re: Your Inquiry for ${service}`})
    `;

    return res.status(200).json({ 
      success: true, 
      message: 'Reply sent successfully!',
      id: data.id 
    });
  } catch (error) {
    console.error('Reply API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
