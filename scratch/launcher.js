import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🚀 INITIALIZING NEXTWAVE UNIFIED LAUNCHER...');
console.log('-------------------------------------------');

// 1. START LOCAL API SERVER
const apiServer = spawn('node', ['scratch/local-api-server.js'], {
    cwd: rootDir,
    stdio: 'inherit', // Share the same terminal
    shell: true
});

apiServer.on('error', (err) => {
    console.error('❌ Failed to start Local API:', err);
});

// 2. START VITE FRONTEND
// We use 'npx vite' to ensure it finds the local version
const viteProcess = spawn('npx', ['vite'], {
    cwd: rootDir,
    stdio: 'inherit', // Share the same terminal
    shell: true
});

viteProcess.on('error', (err) => {
    console.error('❌ Failed to start Vite:', err);
});

// 3. HANDLE SHUTDOWN
process.on('SIGINT', () => {
    console.log('\n🛑 SHUTTING DOWN LOCAL ENVIRONMENT...');
    apiServer.kill();
    viteProcess.kill();
    process.exit();
});

console.log('📡 Both processes are now streaming to this terminal!');
console.log('📊 Looking for Green Badge on http://localhost:5173/admin');
