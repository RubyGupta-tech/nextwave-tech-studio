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

    // Resend does NOT store inbound emails via their API (404 always).
    // The only way to get the body is via Zapier forwarding it.
    // If the user clicks reload and it's still a placeholder, tell them clearly.
    if (msg.content && !msg.content.includes('still indexing at Resend')) {
      // Already has real content - return it
      return res.status(200).json({ success: true, updatedContent: msg.content });
    }

    // Still a placeholder - Zapier hasn't forwarded the body yet
    return res.status(200).json({ 
      success: false, 
      error: 'Zapier has not forwarded the email body yet. Please check your Gmail inbox directly. The message will update automatically once Zapier processes it (usually within 1-2 minutes).'
    });

  } catch (error) {
    console.error('Sync Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
