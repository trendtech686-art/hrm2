const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'hrm_files.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('Checking files table for products...');
  db.all("SELECT * FROM files WHERE document_type = 'products'", (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Found ${rows.length} product files.`);
    rows.forEach(row => {
      console.log(`ID: ${row.id}, EmployeeID: ${row.employee_id}, DocName: ${row.document_name}, Status: ${row.status}, Path: ${row.filepath}`);
    });
  });
});

db.close();
