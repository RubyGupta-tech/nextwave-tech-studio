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

    if (!emailId || !fromEmail) {
      return res.status(200).json({ status: 'ignored', message: 'Incomplete metadata' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY || '');
    const sql = neon(process.env.DATABASE_URL || '');

    // v34.0 Maximum Reliability Polling
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Check payload first (just in case Resend includes it now)
    let finalContent = payload.data?.text || payload.data?.html?.replace(/<[^>]*>?/gm, '') || "";
    
    if (!finalContent) {
      await sleep(5000); // Initial 5s buffer 
      
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts && !finalContent) {
        try {
          attempts++;
          let response = null;
          
          if (resend.emails?.receiving?.get) {
            response = await resend.emails.receiving.get(emailId);
          } else if (resend.emails?.get) {
            response = await resend.emails.get(emailId);
          }
          
          const { data, error } = response || {};
          
          if (!error && data) {
            finalContent = data.text || data.html?.replace(/<[^>]*>?/gm, '') || subject;
          } else {
            const errorMsg = error?.message || "Still Indexing...";
            if (errorMsg.toLowerCase().includes('restricted to only send')) {
              finalContent = `⚠️ [RESTRICTED]: Update Resend API Key to "Full Access". (Subject: ${subject})`;
              break;
            }
            
            if (attempts < maxAttempts) {
              await sleep(3000); // Wait another 3s between retries
            } else {
              finalContent = `[PLATINUM ERROR]: Email content still indexing at Resend after 15s. Please refresh dashboard in a moment. (Subject: ${subject})`;
            }
          }
        } catch (err) {
           if (attempts < maxAttempts) {
             await sleep(3000);
           } else {
             finalContent = `[PLATINUM EXCEPTION]: ${err.message} (Subject: ${subject})`;
           }
        }
      }
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
    }

    return res.status(200).json({ success: true, message: 'Processed' });
  } catch (error) {
    console.error('Webhook Sync Error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
