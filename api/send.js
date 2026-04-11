import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, service, message } = req.body;

  try {
    // 1. Send lead notification to NextWave Admin
    const leadNotification = await resend.emails.send({
      from: 'NextWave Studio <hello@send.nextwavetech.studio>',
      to: ['d.nextwavetech@gmail.com'],
      subject: `New Lead: ${name} - ${service}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1ABC9C;">New Inquiry Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service Requested:</strong> ${service}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    // 2. Send confirmation auto-reply to the client
    const clientConfirmation = await resend.emails.send({
      from: 'NextWave Studio <hello@send.nextwavetech.studio>',
      to: [email],
      subject: 'Inquiry Received - NextWave Tech Studio',
      html: `
        <div style="font-family: sans-serif; padding: 40px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1ABC9C;">Thank you for reaching out!</h2>
          <p>Hi ${name},</p>
          <p>We've received your inquiry regarding <strong>${service}</strong>. Our team is reviewing your details and we will get back to you within 24-48 business hours.</p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;"><strong>Your Message:</strong></p>
            <p style="font-style: italic; color: #444;">"${message}"</p>
          </div>
          <p>We look forward to potentially working together to build your digital impact.</p>
          <br />
          <p>Best regards,</p>
          <p><strong>The NextWave Team</strong><br />
          <a href="https://nextwavetech.studio" style="color: #1ABC9C; text-decoration: none;">nextwavetech.studio</a></p>
        </div>
      `,
    });

    return res.status(200).json({ 
      success: true, 
      leadId: leadNotification.data?.id,
      confirmId: clientConfirmation.data?.id 
    });
  } catch (error) {
    console.error('Email Error:', error);
    return res.status(400).json({ error: error.message });
  }
}
