import { Resend } from 'resend';
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messageId } = req.body;
  const authHeader = (req.headers['x-crm-admin-key'] || req.headers['x-nextwave-auth'])?.trim();
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!authHeader || authHeader !== correctPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!messageId) {
    return res.status(400).json({ error: 'Missing messageId' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 1. Get the message and its original Resend ID (stored in message_id column)
    const messages = await sql`SELECT * FROM messages WHERE id = ${parseInt(messageId)}`;
    if (messages.length === 0) {
      return res.status(404).json({ error: 'Message not found in database' });
    }

    const msg = messages[0];
    const resendId = msg.message_id; // This is the emailId from Resend

    if (!resendId || !resendId.includes('-')) {
       return res.status(400).json({ error: 'Message does not have a valid Resend ID for syncing' });
    }

    // 2. Try fetching from Resend again
    let finalContent = "";
    try {
      let response = null;
      if (resend.emails?.receiving?.get) {
        response = await resend.emails.receiving.get(resendId);
      } else if (resend.emails?.get) {
        response = await resend.emails.get(resendId);
      }
      
      const { data, error } = response || {};
      if (!error && data) {
        finalContent = data.text || data.html?.replace(/<[^>]*>?/gm, '') || msg.subject;
      } else {
        return res.status(404).json({ error: error?.message || 'Email still not found at Resend' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Resend fetch failed: ' + err.message });
    }

    // 3. Update the database
    if (finalContent) {
      await sql`
        UPDATE messages 
        SET content = ${finalContent} 
        WHERE id = ${parseInt(messageId)}
      `;
      return res.status(200).json({ success: true, updatedContent: finalContent });
    }

    return res.status(500).json({ error: 'Failed to extract content' });
  } catch (error) {
    console.error('Sync Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
