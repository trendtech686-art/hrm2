const XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const path = 'd:/hrm2/docs/file/danhsachdonhangsapo.xlsx';

console.log('=== Testing xlsx read ===');
console.log('xlsx version:', XLSX.version);

// Method 1: Default read
console.log('\n--- Method 1: readFile ---');
try {
  const wb1 = XLSX.readFile(path);
  console.log('SheetNames:', wb1.SheetNames);
  console.log('Sheets keys:', Object.keys(wb1.Sheets));
  for (const sn of wb1.SheetNames) {
    const ws = wb1.Sheets[sn];
    console.log(`  ${sn}: ${ws ? 'EXISTS' : 'UNDEFINED'}, ref: ${ws ? ws['!ref'] : 'N/A'}`);
  }
} catch (e) {
  console.log('Error:', e.message);
}

// Method 2: Read from buffer
console.log('\n--- Method 2: read from buffer ---');
try {
  const fs = require('fs');
  const buf = fs.readFileSync(path);
  console.log('Buffer size:', buf.length);
  const wb2 = XLSX.read(buf, { type: 'buffer' });
  console.log('SheetNames:', wb2.SheetNames);
  console.log('Sheets keys:', Object.keys(wb2.Sheets));
  for (const sn of wb2.SheetNames) {
    const ws = wb2.Sheets[sn];
    console.log(`  ${sn}: ${ws ? 'EXISTS' : 'UNDEFINED'}, ref: ${ws ? ws['!ref'] : 'N/A'}`);
    if (ws && ws['!ref']) {
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, range: 0 });
      console.log(`  Rows: ${data.length}`);
      if (data.length > 0) {
        console.log('  Header:', JSON.stringify(data[0]).substring(0, 500));
        if (data.length > 1) {
          console.log('  Row 1:', JSON.stringify(data[1]).substring(0, 500));
        }
      }
    }
  }
} catch (e) {
  console.log('Error:', e.message);
}

// Method 3: Read with options
console.log('\n--- Method 3: read with sheetRows limit ---');
try {
  const fs = require('fs');
  const buf = fs.readFileSync(path);
  const wb3 = XLSX.read(buf, { type: 'buffer', sheetRows: 5 });
  console.log('SheetNames:', wb3.SheetNames);
  for (const sn of wb3.SheetNames) {
    const ws = wb3.Sheets[sn];
    console.log(`  ${sn}: ${ws ? 'EXISTS' : 'UNDEFINED'}, ref: ${ws ? ws['!ref'] : 'N/A'}`);
    if (ws) {
      const keys = Object.keys(ws).filter(k => !k.startsWith('!'));
      console.log(`  Cell keys (${keys.length}):`, keys.slice(0, 30).join(', '));
    }
  }
} catch (e) {
  console.log('Error:', e.message);
}
