const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../webovens-cms-tool/.tmp/data.db');
console.log('Opening DB at:', dbPath);

try {
  const db = new Database(dbPath);
  
  // List all tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables.map(t => t.name));

  // Let's query users
  const users = db.prepare("SELECT id, username, email, document_id FROM up_users").all();
  console.log('Users:', users);

  // Let's query reviews if it exists
  const reviewsTable = tables.find(t => t.name === 'reviews');
  if (reviewsTable) {
    const reviews = db.prepare("SELECT * FROM reviews LIMIT 5").all();
    console.log('Reviews:', reviews);
  } else {
    console.log('reviews table not found');
  }
  
  db.close();
} catch (err) {
  console.error('SQLite Error:', err);
}
