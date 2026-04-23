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

    // We add a delay to allow Resend to index the email content after delivery notification.
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(3000); // v33.0: Increased to 3s for reliability

    let finalContent = "";
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts && !finalContent) {
      try {
        attempts++;
        // Priority: Receiving API (Official for Inbound)
        const { data, error } = await resend.emails.receiving.get(emailId);
        
        if (!error && data) {
          finalContent = data.text || data.html?.replace(/<[^>]*>?/gm, '') || subject;
        } else {
          // Fallback: General Emails API
          const fallback = await resend.emails.get(emailId);
          if (fallback?.data) {
             finalContent = fallback.data.text || fallback.data.html?.replace(/<[^>]*>?/gm, '') || subject;
          } else {
             const errorMsg = error?.message || fallback.error?.message || "Not Found";
             if (errorMsg.toLowerCase().includes('restricted to only send')) {
                finalContent = `⚠️ [RESTRICTED CONTENT]: New reply received, but your Resend API Key is limited to "Sending Only". Please update to "Full Access" on Resend.com. (Subject: ${subject})`;
                break;
             }
             if (attempts < maxAttempts) {
                console.log(`Email not found, retrying attempt ${attempts+1}...`);
                await sleep(2000); // Wait another 2s before retry
             } else {
                finalContent = `[PLATINUM ERROR]: ${errorMsg} (Subject: ${subject})`;
             }
          }
        }
      } catch (err) {
         const exMsg = err.message || "";
         if (exMsg.toLowerCase().includes('restricted to only send')) {
            finalContent = `⚠️ [RESTRICTED CONTENT]: Your Resend API Key lacks permission to read emails. Please update to "Full Access". (Subject: ${subject})`;
            break;
         }
         if (attempts < maxAttempts) {
           await sleep(2000);
         } else {
           finalContent = `[PLATINUM EXCEPTION]: ${exMsg} (Subject: ${subject})`;
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
