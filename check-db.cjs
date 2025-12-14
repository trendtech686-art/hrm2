const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'hrm_files.db');
const db = new sqlite3.Database(dbPath);

console.log('=== Checking all product files in DB ===');
db.all("SELECT employee_id, document_name, COUNT(*) as count FROM files WHERE document_type = 'products' GROUP BY employee_id, document_name", (err, rows) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Product files grouped by ID:');
  rows.forEach(row => {
    console.log(`  ${row.employee_id} (${row.document_name}): ${row.count} files`);
  });
  
  // Also check if PROD000002 exists
  db.all("SELECT * FROM files WHERE employee_id LIKE '%PROD000002%' OR employee_id LIKE '%SP00000%'", (err2, rows2) => {
    console.log('\n=== Files matching PROD or SP ===');
    if (rows2 && rows2.length > 0) {
      rows2.forEach(r => {
        console.log(`  ID: ${r.employee_id}, Type: ${r.document_name}, File: ${r.filename}`);
      });
    } else {
      console.log('  No files found');
    }
    db.close();
  });
});
