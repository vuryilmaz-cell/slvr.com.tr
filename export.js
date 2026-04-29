const Database = require('better-sqlite3');
const fs = require('fs');
const db = new Database('prisma/dev.db');
const tables = ['categories', 'products', 'product_images', 'users', 'settings'];
const data = {};
tables.forEach(table => {
  try {
    data[table] = db.prepare('SELECT * FROM ' + table).all();
    console.log(table + ': ' + data[table].length + ' rows');
  } catch(e) {
    console.log(table + ': ERROR - ' + e.message);
  }
});
fs.writeFileSync('export.json', JSON.stringify(data, null, 2));
console.log('Export tamamlandi: export.json');
