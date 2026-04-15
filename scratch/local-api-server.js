import http from 'http';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Manually Load .env (FIXED: Split only on FIRST '=' to preserve full URLs)
let DATABASE_URL = '';
try {
    const envPath = path.join(__dirname, '..', '.env');
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const firstEquals = trimmed.indexOf('=');
        if (firstEquals > -1) {
            const key = trimmed.substring(0, firstEquals).trim();
            const value = trimmed.substring(firstEquals + 1).trim(); // Everything AFTER first =
            if (key === 'DATABASE_URL') DATABASE_URL = value;
        }
    }
} catch (e) {
    console.error("❌ Fatal: Could not read .env file. " + e.message);
    process.exit(1);
}

const sql = neon(DATABASE_URL);

// 2. Local Server Logic (DEEP DIAGNOSTICS v5)
const server = http.createServer(async (req, res) => {
    try {
        const fullUrl = req.url || '/';
        const pathname = fullUrl.split('?')[0];
        const searchParams = new URLSearchParams(fullUrl.split('?')[1] || '');

        const sendJson = (status, data) => {
            res.writeHead(status, { 
                'Content-Type': 'application/json', 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'x-nextwave-auth, Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            });
            res.end(JSON.stringify(data));
        };

        if (req.method === 'OPTIONS') return sendJson(200, {});

        console.log(`[API Request] ${req.method} ${pathname}`);

        // --- MIGRATION / INIT ROUTES ---
        if (pathname === '/api/init-db' || pathname === '/api/migrate-db') {
            try {
                await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT '';`;
                await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'New';`;
                await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';`;
                await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;`;
                await sql`UPDATE leads SET is_archived = false WHERE is_archived IS NULL;`;
                
                return sendJson(200, { success: true, message: 'Local Database Correctly Aligned!' });
            } catch (migErr) {
                console.error("❌ Migration Error:", migErr.message);
                return sendJson(500, { error: 'Database Migration Failed', details: migErr.message });
            }
        }

        if (pathname.startsWith('/api/get-leads')) {
            try {
                const filter = searchParams.get('filter') || 'all';
                const searchQuery = (searchParams.get('search') || '').trim();
                const serviceFilter = searchParams.get('service') || 'all';
                const tab = searchParams.get('tab') || 'active';
                const isArchived = (tab === 'archived');
                
                const searchPattern = searchQuery ? `%${searchQuery}%` : '';

                const rows = await sql`
                    SELECT * FROM leads 
                    WHERE 
                        is_archived = ${isArchived}
                        AND (${searchPattern} = '' OR name ILIKE ${searchPattern} OR email ILIKE ${searchPattern})
                        AND (${serviceFilter} = 'all' OR service = ${serviceFilter})
                        AND (
                            ${filter} = 'all' 
                            OR (${filter} = 'today' AND created_at >= NOW() - INTERVAL '1 day')
                            OR (${filter} = 'week' AND created_at >= NOW() - INTERVAL '7 days')
                            OR (${filter} = 'month' AND created_at >= NOW() - INTERVAL '30 days')
                        )
                    ORDER BY created_at DESC 
                    LIMIT 1000
                `;

                sendJson(200, { success: true, leads: rows, total: rows.length, version: 'Deep Diag v5' });
            } catch (sqlErr) {
                console.error("❌ SQL Error:", sqlErr.message);
                sendJson(500, { error: 'Database Fetch Failed', details: sqlErr.message });
            }
        } 
        else if (pathname.startsWith('/api/update-lead')) {
            if (req.method !== 'POST') return sendJson(405, { error: 'Method not allowed' });
            
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
                try {
                    const data = JSON.parse(body);
                    const { id, is_archived } = data;

                    await sql`UPDATE leads SET is_archived = ${is_archived === true} WHERE id = ${id}`;
                    sendJson(200, { success: true, message: 'Archive state updated locally' });
                } catch (err) {
                    sendJson(500, { error: 'Update Failed', details: err.message });
                }
            });
        }
        else if (pathname === '/api/ping') {
            sendJson(200, { status: 'online', database: 'connected' });
        }
        else {
            sendJson(404, { error: 'Simulator: Route not found' });
        }

    } catch (globalErr) {
        console.error("❌ GLOBAL CRASH:", globalErr);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Global Simulator Crash', details: globalErr.message }));
    }
});

const PORT = 3005;
server.listen(PORT, () => {
    console.log(`\n🚀 LOCAL API SIMULATOR (DEEP DIAGNOSTICS v6 - PORT 3005)`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`💡 Run 'http://localhost:5181/api/migrate-db' to fix the database!`);
});
