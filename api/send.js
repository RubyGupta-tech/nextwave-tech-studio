import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, service, message } = req.body;

  try {
    // 1. Send lead notification to NextWave Admin
    // 1. Send lead notification to NextWave Admin
    const { data: leadData, error: leadError } = await resend.emails.send({
      from: 'NextWave Tech Studio <hello@dnextwave.com>',
      to: ['d.nextwavetech@gmail.com'],
      subject: `New Lead: ${name} - ${service}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://dnextwave.com/NextWave_logo1.web.jpeg" alt="NextWave Logo" style="width: 180px; height: auto;" />
          </div>
          <h2 style="color: #1ABC9C; border-bottom: 2px solid #1ABC9C; padding-bottom: 10px; font-size: 20px;">New Inquiry Received</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
             <p style="margin: 0; margin-bottom: 12px;"><strong>Name:</strong> ${name}</p>
             <p style="margin: 0; margin-bottom: 12px;"><strong>Email:</strong> ${email}</p>
             <p style="margin: 0; margin-bottom: 12px;"><strong>Service:</strong> ${service}</p>
          </div>
          <p style="margin-top: 24px;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #fff; padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px;">${message}</p>
          <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px;">
            NEXTWAVE TECH STUDIO · www.dnextwave.com
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
      subject: 'We Received Your Inquiry - NextWave Tech Studio',
      html: `
        <div style="font-family: 'Inter', sans-serif; padding: 40px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://dnextwave.com/NextWave_logo1.web.jpeg" alt="NextWave Logo" style="width: 200px; height: auto;" />
          </div>
          
          <h2 style="color: #1ABC9C; font-size: 24px; margin-bottom: 16px;">Thank you for reaching out!</h2>
          <p style="font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          <p style="font-size: 16px; line-height: 1.6;">We've received your inquiry regarding <strong>${service}</strong>. Our team is currently reviewing your details, and we will get back to you within 24-48 business hours.</p>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #1ABC9C;">
            <p style="margin: 0; font-size: 14px; color: #64748B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;"><strong>Your Message Preview:</strong></p>
            <p style="font-style: italic; color: #334155; margin: 0; line-height: 1.6;">"${message}"</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">We look forward to potentially working together to build your digital impact.</p>
          
          <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-weight: 700; color: #0B1F3A;">The NextWave Team</p>
            <a href="https://www.dnextwave.com" style="color: #1ABC9C; text-decoration: none; font-weight: 600; font-size: 14px;">www.dnextwave.com</a>
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
