/**
 * Script đồng bộ tất cả print templates theo chuẩn responsive
 * 
 * Chuẩn template v2 (2025-12-08):
 * - Container: font-size: 12px, line-height: 1.4, padding: 10px
 * - Header: Logo 70px trái + Store info phải
 * - Title: font-size: 16px, border-bottom: 2px solid
 * - Info table: Label width 22%, font-size: 11px
 * - Product table: table-layout: fixed, font-size: 10px
 * - Summary table: width: 250px, margin-left: auto
 * - Footer: font-size: 10px, color: #666, print_date print_time
 * - Signature: height: 50px, font-size: 11px
 */

const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '../features/settings/printer/templates');

// Thống kê các thay đổi cần làm
const STYLE_UPDATES = {
  // Container
  containerOld: /font-size:\s*13px;\s*line-height:\s*1\.5;/g,
  containerNew: 'font-size: 12px; line-height: 1.4;',
  
  // Thêm padding nếu thiếu
  maxWidthOld: /max-width:\s*800px;\s*margin:\s*0\s+auto;(?!\s*padding)/g,
  maxWidthNew: 'max-width: 800px; margin: 0 auto; padding: 10px;',
  
  // Header title
  titleOld: /font-size:\s*18px;\s*border-bottom/g,
  titleNew: 'font-size: 16px; font-weight: bold; border-bottom',
  
  // Info table padding  
  infoPaddingOld: /padding:\s*5px;\s*width:\s*(20|25)%/g,
  infoPaddingNew: 'padding: 4px 6px; width: 22%',
  
  // Table width
  summaryWidthOld: /width:\s*(280|300|350)px;\s*margin-left:\s*auto/g,
  summaryWidthNew: 'width: 250px; margin-left: auto',
  
  // Add table-layout fixed
  productTableOld: /border-collapse:\s*collapse;\s*margin-bottom:\s*15px;(?!\s*table-layout)/g,
  productTableNew: 'border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;',
  
  // Header sizes
  headerFontOld: /font-size:\s*16px;\s*font-weight:\s*bold/g,
  headerFontNew: 'font-size: 14px; font-weight: bold; margin-bottom: 2px',
  
  // Margin bottom reductions
  marginOld: /margin-bottom:\s*15px/g,
  marginNew: 'margin-bottom: 10px',
  
  marginOld2: /margin-bottom:\s*20px/g,
  marginNew2: 'margin-bottom: 12px',
  
  // Signature space
  signatureSpaceOld: /<br><br><br><br>/g,
  signatureSpaceNew: '<div style="height: 50px;"></div>',
  
  // Footer
  footerOld: /margin-top:\s*20px;\s*padding-top:\s*10px/g,
  footerNew: 'margin-top: 15px; padding-top: 8px',
};

function syncTemplate(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updated = content;
  let changes = [];
  
  // Apply replacements
  Object.keys(STYLE_UPDATES).forEach((key, idx) => {
    if (key.endsWith('Old')) {
      const newKey = key.replace('Old', 'New');
      const oldPattern = STYLE_UPDATES[key];
      const newValue = STYLE_UPDATES[newKey];
      
      if (oldPattern.test(updated)) {
        updated = updated.replace(oldPattern, newValue);
        changes.push(key.replace('Old', ''));
      }
    }
  });
  
  return { updated, changes };
}

function main() {
  console.log('='.repeat(60));
  console.log('SYNC PRINT TEMPLATES - Responsive Standards v2');
  console.log('='.repeat(60));
  
  const files = fs.readdirSync(templatesDir)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'styles.ts');
  
  let totalChanges = 0;
  
  files.forEach(file => {
    const filePath = path.join(templatesDir, file);
    const { updated, changes } = syncTemplate(filePath);
    
    if (changes.length > 0) {
      fs.writeFileSync(filePath, updated);
      console.log(`\n✅ ${file}:`);
      changes.forEach(c => console.log(`   - ${c}`));
      totalChanges += changes.length;
    } else {
      console.log(`\n⏭️  ${file}: Đã đúng chuẩn`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`Tổng: ${totalChanges} thay đổi trên ${files.length} files`);
  console.log('='.repeat(60));
  
  // Additional check for missing print_date
  console.log('\n📋 Kiểm tra templates thiếu print_date:');
  files.forEach(file => {
    const filePath = path.join(templatesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('{print_date}')) {
      console.log(`   ⚠️  ${file} - Thiếu {print_date}`);
    }
  });
}

main();
