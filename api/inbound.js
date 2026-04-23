import { Resend } from 'resend';
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // 1. Validation: Only POST allowed
  if (req.method === 'GET') {
    return res.status(200).send(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center; color: #0B1F3A;">
        <h1 style="color: #1ABC9C;">⚡ NextWave PLATINUM Sync Engine</h1>
        <p>Your Inbox Webhook is <b>ONLINE</b> and waiting for deliveries.</p>
        <p style="font-size: 13px; color: #64748b;">(v31.1 PLATINUM SYNC ACTIVE)</p>
      </div>
    `);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Auth
  const { auth, from_email, content, subject } = req.body;
  const authKey = (req.query.auth || auth || req.headers['x-crm-admin-key'])?.trim();
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!correctPassword || authKey !== correctPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing sync key.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY || '');
  let finalContent = "";
  let senderEmail = from_email || req.body.data?.from;

  // 3. Robust Content Extraction (v31.0 Platinum Sync)
  if (req.body.data?.email_id) {
    // This is a Resend Metadata Webhook
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(3000); 

    let finalContent = "";
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts && !finalContent) {
      try {
        attempts++;
        const { data, error } = await resend.emails.receiving.get(req.body.data.email_id);
        
        if (!error && data) {
           finalContent = data.text || data.html?.replace(/<[^>]*>?/gm, '') || req.body.data.subject || "No Content";
        } else {
          const fallback = await resend.emails.get(req.body.data.email_id);
          if (fallback?.data) {
             finalContent = fallback.data.text || fallback.data.html?.replace(/<[^>]*>?/gm, '') || req.body.data.subject || "No Content";
          } else { 
            const errMsg = error?.message || fallback.error?.message || "Not Found";
            if (errMsg.toLowerCase().includes('restricted to only send')) {
              finalContent = `⚠️ [RESTRICTED CONTENT]: Your API Key is "Sending Only". Update it to "Full Access" on Resend.com. (Subject: ${req.body.data.subject})`;
              break;
            }
            if (attempts < maxAttempts) {
              await sleep(2000);
            } else {
              finalContent = `[PLATINUM ERROR]: ${errMsg} (Subject: ${req.body.data.subject})`;
            }
          }
        }
      } catch (err) {
        const exMsg = err.message || "";
        if (exMsg.toLowerCase().includes('restricted to only send')) {
           finalContent = `⚠️ [RESTRICTED]: API Key limited to "Sending Only". (Subject: ${req.body.data.subject})`;
           break;
        }
        if (attempts < maxAttempts) {
          await sleep(2000);
        } else {
          finalContent = `[PLATINUM EXCEPTION]: ${exMsg} (Subject: ${req.body.data.subject})`;
        }
      }
    }
  } else {
    // Normal Webhook (Zapier/Direct)
    let emailContent = (
      content || 
      req.body.text || 
      req.body.body || 
      req.body['body-plain'] || 
      req.body['stripped-text'] || 
      subject
    );

    if (emailContent && typeof emailContent === 'object') {
      emailContent = emailContent.text || emailContent.body || JSON.stringify(emailContent);
    }
    finalContent = emailContent?.toString().trim() || "(No text content)";
  }

  if (!senderEmail) {
    return res.status(400).json({ error: 'Missing sender email.' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // 4. Find the lead by email
    const leads = await sql`SELECT id FROM leads WHERE email ILIKE ${senderEmail.trim()} LIMIT 1`;

    if (leads.length === 0) {
      // Logic: If lead not found, we don't know where to put it. 
      // Option: Create a "Ghost Lead" or just return success with a warning.
      return res.status(200).json({ success: true, warning: 'Email received but no matching lead found in CRM.' });
    }

    const leadId = leads[0].id;

    // 5. Insert into messages as 'client'
    await sql`
      INSERT INTO messages (lead_id, sender, content)
      VALUES (${leadId}, 'client', ${finalContent})
    `;

    return res.status(200).json({ success: true, message: 'Message synced to CRM successfully.' });

  } catch (error) {
    console.error('Inbound Sync Error:', error);
    return res.status(500).json({ error: 'Internal Server Error during sync' });
  }
}
