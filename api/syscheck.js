import { Resend } from 'resend';
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const results = {
    database: '🔴 Connection Failed',
    resend: '🔴 API Key Missing',
    admin_auth: '🔴 PASSWORD NOT SET',
    status: 'Ready'
  };

  // 1. Check Admin Password
  if (process.env.ADMIN_PASSWORD) {
    results.admin_auth = '🟢 Configured (Length: ' + process.env.ADMIN_PASSWORD.length + ')';
  }

  // 2. Check Resend
  if (process.env.RESEND_API_KEY) {
    results.resend = '🟢 Key Detected (Starts with ' + process.env.RESEND_API_KEY.substring(0, 3) + '...)';
  }

  // 3. Check Database
  if (process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      const test = await sql`SELECT 1 as connected`;
      if (test[0].connected === 1) {
        results.database = '🟢 Connection Successful';
      }
    } catch (e) {
      results.database = '🔴 Error: ' + e.message;
    }
  }

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(`
    <div style="font-family: sans-serif; padding: 40px; max-width: 600px; margin: 40px auto; border: 1px solid #e2e8f0; border-radius: 20px;">
      <h1 style="color: #0B1F3A;">CRM System Diagnostics</h1>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
      <div style="font-size: 18px; line-height: 2;">
        <p><strong>Database:</strong> ${results.database}</p>
        <p><strong>Email (Resend):</strong> ${results.resend}</p>
        <p><strong>Admin Auth:</strong> ${results.admin_auth}</p>
      </div>
      <br/>
      <p style="color: #64748b; font-size: 14px;">If any item is 🔴, please check your Vercel Environment Variables and REDEPLOY.</p>
      <a href="/admin" style="display: inline-block; padding: 10px 20px; background: #1ABC9C; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">Return to Dashboard</a>
    </div>
  `);
}
