import { neon } from '@neondatabase/serverless';

const url = 'postgres://u0j687id40v90h:p3be99f899a778e76313b63cc302f37c7f394236cd388eb625026a760c41031c5@c8sc08huv6isv6.cluster-czrs8kj4isg7.us-east-1.k8s.neon.tech/neondb?sslmode=require';

const sql = neon(url);

console.log('Testing connection...');
sql`SELECT 1 as test`
  .then(r => console.log('✅ SUCCESS! DB Connected:', JSON.stringify(r)))
  .catch(e => console.error('❌ FAIL:', e.message, '\nCODE:', e.code));
