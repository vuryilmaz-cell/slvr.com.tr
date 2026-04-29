const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect().then(() => {
  return client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'categories' ORDER BY ordinal_position");
}).then(r => {
  console.log('categories kolonlari:', r.rows.map(x => x.column_name));
  client.end();
}).catch(console.error);
