import { Resend } from 'resend';
import { neon } from '@neondatabase/serverless';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, service, message, source = 'website_form' } = req.body;

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing');
  }

  try {
    // 0. Save lead to Database (Neon)
    try {
      if (process.env.DATABASE_URL) {
        const sql = neon(process.env.DATABASE_URL);
        await sql`
          INSERT INTO leads (name, email, service, message, source)
          VALUES (${name}, ${email}, ${service}, ${message}, ${source})
        `;
        console.log('Lead saved to database successfully');
      }
    } catch (dbError) {
      console.error('Database Save Error:', dbError);
    }

    // 1. Send lead notification to Admin
    const { data: leadData, error: leadError } = await resend.emails.send({
      from: 'NextWave Tech Studio <notifications@dnextwave.com>',
      to: ['d.nextwavetech@gmail.com'],
      subject: `New Lead: ${name} - ${service}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #1ABC9C; border-bottom: 2px solid #1ABC9C; padding-bottom: 10px; font-size: 20px;">NextWave Tech Studio - New Inquiry</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
             <p style="margin: 0; margin-bottom: 12px;"><strong>Name:</strong> ${name}</p>
             <p style="margin: 0; margin-bottom: 12px;"><strong>Email:</strong> ${email}</p>
             <p style="margin: 0; margin-bottom: 12px;"><strong>Service:</strong> ${service}</p>
          </div>
          <p style="margin-top: 24px;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #fff; padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px;">${message}</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: auto;">
              <tr>
                <td style="padding-right: 15px;">
                  <img src="https://dnextwave.com/NextWave_logo1.web.jpeg" alt="Logo" style="width: 45px; height: auto; border-radius: 4px;" />
                </td>
                <td style="text-align: left; border-left: 2px solid #1ABC9C; padding-left: 15px;">
                  <div style="font-weight: 700; color: #0B1F3A; font-size: 14px; letter-spacing: 0.5px;">NEXTWAVE TECH STUDIO</div>
                  <div style="font-size: 12px; color: #64748B; margin-top: 2px;">
                    <a href="https://www.dnextwave.com" style="color: #1ABC9C; text-decoration: none;">www.dnextwave.com</a> | 925-318-1134
                  </div>
                  <div style="font-size: 12px; color: #64748B; margin-top: 2px;">
                    <a href="mailto:d.nextwavetech@gmail.com" style="color: #64748B; text-decoration: none;">d.nextwavetech@gmail.com</a>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      `,
    });

    if (leadError) {
      console.error('Resend Lead Error:', leadError);
      return res.status(400).json({ error: leadError.message, type: 'lead_error' });
    }

    // 2. Send confirmation auto-reply to the client
    const { data: confirmData, error: confirmError } = await resend.emails.send({
      from: 'NextWave Tech Studio <hello@dnextwave.com>',
      to: [email],
      subject: 'Inquiry Received - NextWave Tech Studio',
      html: `
        <div style="font-family: 'Inter', sans-serif; padding: 40px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
          
          <h2 style="color: #1ABC9C; font-size: 24px; margin-bottom: 16px;">Thank you for reaching out!</h2>
          <p style="font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          <p style="font-size: 16px; line-height: 1.6;">We've received your inquiry regarding <strong>${service}</strong>. Our team at NextWave Tech Studio is currently reviewing your details, and we will get back to you within 24-48 business hours.</p>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #1ABC9C;">
            <p style="margin: 0; font-size: 14px; color: #64748B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;"><strong>Your Message Preview:</strong></p>
            <p style="font-style: italic; color: #334155; margin: 0; line-height: 1.6;">"${message}"</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">We look forward to potentially working together to build your digital impact.</p>
          
          <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #eee;">
            <table border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right: 15px;">
                  <img src="https://dnextwave.com/NextWave_logo1.web.jpeg" alt="Logo" style="width: 50px; height: auto; border-radius: 5px;" />
                </td>
                <td style="border-left: 2px solid #1ABC9C; padding-left: 15px;">
                  <div style="font-weight: 800; color: #0B1F3A; font-size: 16px; letter-spacing: -0.5px;">NextWave Tech Studio</div>
                  <div style="font-size: 14px; color: #64748B; margin-top: 4px;">
                    <a href="https://www.dnextwave.com" style="color: #1ABC9C; text-decoration: none; font-weight: 600;">www.dnextwave.com</a>
                  </div>
                  <div style="font-size: 14px; color: #64748B; margin-top: 2px;">
                    <a href="mailto:d.nextwavetech@gmail.com" style="color: #475569; text-decoration: none;">d.nextwavetech@gmail.com</a>
                    <span style="margin: 0 8px; color: #CBD5E1;">|</span>
                    <span>925-318-1134</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      `,
    });

    if (confirmError) {
      console.error('Resend Confirmation Error:', confirmError);
      return res.status(400).json({ error: confirmError.message, type: 'confirmation_error' });
    }

    return res.status(200).json({
      success: true,
      leadId: leadData?.id,
      confirmId: confirmData?.id
    });
  } catch (error) {
    console.error('Email Sending Hard Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
