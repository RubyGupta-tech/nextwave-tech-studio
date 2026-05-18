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

    const messages = await sql`SELECT * FROM messages WHERE id = ${parseInt(messageId)}`;
    if (messages.length === 0) {
      return res.status(404).json({ error: 'Message not found in database' });
    }

    const msg = messages[0];

    // Try to fetch from Resend directly if we have a messageId and it's a placeholder
    if (msg.content && msg.content.includes('still indexing at Resend') && msg.message_id) {
      try {
        const resendRes = await fetch(`https://api.resend.com/emails/${msg.message_id}`, {
          headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY || ''}` }
        });
        if (resendRes.ok) {
          const emailData = await resendRes.json();
          const body = emailData.text || (emailData.html ? emailData.html.replace(/<[^>]*>?/gm, '') : "");
          if (body && body.trim() !== '') {
            await sql`UPDATE messages SET content = ${body.trim()} WHERE id = ${msg.id}`;
            return res.status(200).json({ success: true, updatedContent: body.trim() });
          }
        }
      } catch (err) {
        console.error("Resend Sync Error:", err);
      }
    }

    if (msg.content && !msg.content.includes('still indexing at Resend')) {
      // Already has real content - return it
      return res.status(200).json({ success: true, updatedContent: msg.content });
    }

    // Still a placeholder - Zapier hasn't forwarded the body yet
    return res.status(200).json({ 
      success: false, 
      error: 'The email body is still not available. Please check your Gmail inbox directly. It will update automatically once Zapier processes it (usually within 1-2 minutes).'
    });

  } catch (error) {
    console.error('Sync Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
