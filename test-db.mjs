import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testConnection() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not set in your environment.');
    process.exit(1);
  }

  console.log('🔗 Attempting to connect to Neon...');
  
  try {
    const sql = neon(databaseUrl);
    
    // 1. Test basic query
    const startTime = Date.now();
    const result = await sql`SELECT NOW() as now, version();`;
    const endTime = Date.now();
    
    console.log('✅ Connection Successful!');
    console.log(`⏱️ Latency: ${endTime - startTime}ms`);
    console.log(`📅 DB Time: ${result[0].now}`);
    console.log(`📦 DB Version: ${result[0].version.split(' ')[0]}`);

    // 2. Test table initialization
    console.log('\n🛠️ Initializing tables...');
    await sql`
      CREATE TABLE IF NOT EXISTS test_papers (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Tables initialized.');

    // 3. Test Write
    const testId = `test-${Date.now()}`;
    console.log(`📝 Writing test record (id: ${testId})...`);
    await sql`INSERT INTO test_papers (id, title) VALUES (${testId}, 'Test Paper from ArxivDigest');`;
    console.log('✅ Write successful.');

    // 4. Test Read
    console.log('📖 Reading test record...');
    const rows = await sql`SELECT * FROM test_papers WHERE id = ${testId};`;
    if (rows.length > 0) {
      console.log(`✅ Read successful: ${rows[0].title}`);
    }

    // 5. Cleanup
    console.log('🧹 Cleaning up test table...');
    await sql`DROP TABLE test_papers;`;
    console.log('✅ Cleanup complete.');

    console.log('\n🚀 ALL TESTS PASSED! Your Neon database is ready.');

  } catch (error) {
    console.error('❌ Database test failed:');
    console.error(error.message);
    if (error.message.includes('password authentication failed')) {
      console.error('💡 Hint: Check if your database password in DATABASE_URL is correct.');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('💡 Hint: Check your database host name.');
    }
    process.exit(1);
  }
}

testConnection();
