const { Client } = require('pg');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('export.json', 'utf8'));

function toDate(val) {
  if (!val) return null;
  if (typeof val === 'number') return new Date(val).toISOString();
  return val;
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function importData() {
  await client.connect();
  console.log('Baglandi');

  for (const row of data.categories) {
    await client.query(
      'INSERT INTO categories (id, name, slug, description, image_url, is_active, display_order, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING',
      [row.id, row.name, row.slug, row.description, row.image_url, row.is_active, row.display_order, toDate(row.created_at)]
    );
  }
  console.log('Categories: OK');

  for (const row of data.products) {
    await client.query(
      'INSERT INTO products (id, category_id, name, slug, description, price, discount_price, stock_quantity, sku, material, weight, is_featured, is_active, views, display_order, gender, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) ON CONFLICT (id) DO NOTHING',
      [row.id, row.category_id, row.name, row.slug, row.description, row.price, row.discount_price, row.stock_quantity, row.sku, row.material, row.weight, row.is_featured, row.is_active, row.views, row.display_order, row.gender, toDate(row.created_at), toDate(row.updated_at)]
    );
  }
  console.log('Products: OK');

  for (const row of data.product_images) {
    await client.query(
      'INSERT INTO product_images (id, product_id, image_url, is_primary, display_order, created_at) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING',
      [row.id, row.product_id, row.image_url, row.is_primary, row.display_order, toDate(row.created_at)]
    );
  }
  console.log('Product Images: OK');

  for (const row of data.settings) {
    await client.query(
      'INSERT INTO settings (id, setting_key, setting_value, created_at, updated_at) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING',
      [row.id, row.setting_key, row.setting_value, toDate(row.created_at), toDate(row.updated_at)]
    );
  }
  console.log('Settings: OK');

  await client.end();
  console.log('Import tamamlandi!');
}

importData().catch(console.error);
