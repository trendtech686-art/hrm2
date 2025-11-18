/**
 * Script to migrate old business IDs to new systemId format
 * Maps: NV001 -> NV00000001, NV027 -> NV00000027, etc.
 * 
 * Run: node server/migrate-employee-ids.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');

const dbPath = path.join(__dirname, 'hrm_files.db');
const uploadsPath = path.join(__dirname, 'uploads');

console.log('🔄 Migrating Employee IDs to SystemId Format...\n');

// Mapping function: Business ID (6 digits) -> SystemId (8 digits)
// Example: NV001 -> NV00000001, KH123 -> KH00000123
function migrateId(oldId) {
  // Extract prefix and number
  const match = oldId.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    console.warn(`⚠️  Cannot parse ID: ${oldId}`);
    return oldId; // Return unchanged if cannot parse
  }
  
  const prefix = match[1];
  const number = match[2];
  
  // Pad to 8 digits
  const newId = `${prefix}${number.padStart(8, '0')}`;
  return newId;
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Get all unique employee IDs
  db.all('SELECT DISTINCT employee_id FROM files ORDER BY employee_id', (err, rows) => {
    if (err) {
      console.error('❌ Error reading database:', err.message);
      db.close();
      return;
    }
    
    console.log(`📊 Found ${rows.length} unique employee IDs\n`);
    
    const migrations = [];
    rows.forEach(row => {
      const oldId = row.employee_id;
      const newId = migrateId(oldId);
      
      if (oldId !== newId) {
        migrations.push({ oldId, newId });
        console.log(`   ${oldId} → ${newId}`);
      }
    });
    
    console.log(`\n✅ Will migrate ${migrations.length} employee IDs\n`);
    
    if (migrations.length === 0) {
      console.log('✨ No migration needed - all IDs are already in correct format!');
      db.close();
      return;
    }
    
    // Confirm before proceeding
    console.log('⚠️  This will UPDATE the database and RENAME physical folders!');
    console.log('   Make sure to backup first: cp hrm_files.db hrm_files.db.backup\n');
    
    // Perform migrations
    let completed = 0;
    let errors = 0;
    
    migrations.forEach(({ oldId, newId }) => {
      // Update database
      db.run('UPDATE files SET employee_id = ? WHERE employee_id = ?', [newId, oldId], function(updateErr) {
        if (updateErr) {
          console.error(`❌ Failed to update ${oldId}:`, updateErr.message);
          errors++;
        } else {
          console.log(`✅ Updated ${this.changes} records: ${oldId} → ${newId}`);
          
          // Rename physical folders
          try {
            const permanentDir = path.join(uploadsPath, 'permanent');
            
            // Check both flat and date-based structures
            const oldPaths = [
              path.join(permanentDir, 'employees', oldId),
            ];
            
            // Check date-based folders
            if (fs.existsSync(permanentDir)) {
              const dateFolders = fs.readdirSync(permanentDir);
              dateFolders.forEach(dateFolder => {
                const datePath = path.join(permanentDir, dateFolder);
                if (fs.statSync(datePath).isDirectory()) {
                  const oldDatePath = path.join(datePath, 'employees', oldId);
                  if (fs.existsSync(oldDatePath)) {
                    oldPaths.push(oldDatePath);
                  }
                }
              });
            }
            
            // Rename all found paths
            oldPaths.forEach(oldPath => {
              if (fs.existsSync(oldPath)) {
                const newPath = oldPath.replace(oldId, newId);
                fs.ensureDirSync(path.dirname(newPath));
                fs.moveSync(oldPath, newPath);
                console.log(`   📁 Renamed folder: ${path.basename(path.dirname(oldPath))}/${oldId} → ${newId}`);
              }
            });
            
          } catch (fsErr) {
            console.warn(`⚠️  Could not rename folder for ${oldId}:`, fsErr.message);
          }
        }
        
        completed++;
        
        if (completed === migrations.length) {
          console.log(`\n✨ Migration complete!`);
          console.log(`   ✅ Success: ${migrations.length - errors}`);
          console.log(`   ❌ Errors: ${errors}\n`);
          db.close();
        }
      });
    });
  });
});
