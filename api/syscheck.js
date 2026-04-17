import { Resend } from 'resend';
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const checkResults = {
    db: '🔴 Not Configured',
    resend: '🔴 Not Configured',
    auth: '🔴 Not Configured',
    api_dir: '🟢 Reachable'
  };

  try {
    // 1. Check DB
    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL);
        await sql`SELECT 1`;
        checkResults.db = '🟢 Connected & Responsive';
      } catch (err) {
        checkResults.db = '🔴 Connection Error: ' + err.message;
      }
    }

    // 2. Check Resend
    if (process.env.RESEND_API_KEY) {
      checkResults.resend = '🟢 Key Detected (Starts with ' + process.env.RESEND_API_KEY.substring(0, 3) + '...)';
    }

    // 3. Check Admin Auth
    if (process.env.ADMIN_PASSWORD) {
      checkResults.auth = '🟢 Password Set (Length: ' + process.env.ADMIN_PASSWORD.length + ')';
    }

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <div style="font-family: 'Inter', sans-serif; padding: 40px; max-width: 650px; margin: 50px auto; border: 1px solid #e2e8f0; border-radius: 24px; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        <h1 style="color: #0B1F3A; margin-top: 0;">CRM System Health</h1>
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 25px 0;" />
        
        <div style="display: grid; gap: 15px; font-size: 16px;">
          <div style="padding: 15px; background: #f8fafc; border-radius: 12px; display: flex; justify-content: space-between;">
            <strong>Database Status:</strong> <span>${checkResults.db}</span>
          </div>
          <div style="padding: 15px; background: #f8fafc; border-radius: 12px; display: flex; justify-content: space-between;">
            <strong>Email API Key:</strong> <span>${checkResults.resend}</span>
          </div>
          <div style="padding: 15px; background: #f8fafc; border-radius: 12px; display: flex; justify-content: space-between;">
            <strong>Admin Dashboard Auth:</strong> <span>${checkResults.auth}</span>
          </div>
          <div style="padding: 15px; background: #f0fdf4; border-radius: 12px; display: flex; justify-content: space-between; color: #166534;">
            <strong>API Routing:</strong> <span>🟢 Functioning!</span>
          </div>
        </div>

        <p style="margin-top: 30px; font-size: 14px; color: #64748b; line-height: 1.6;">
          If all items are 🟢, your CRM is fully operational. If anything is 🔴, check your Vercel Project Settings -> Environment Variables.
        </p>

        <a href="/admin" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #0B1F3A; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Open Dashboard ➔
        </a>
      </div>
    `);
  } catch (error) {
    return res.status(500).send(`Error while checking system: ${error.message}`);
  }
}
