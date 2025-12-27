/**
 * Script thêm print_date print_time vào footer của templates
 */

const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '../features/settings/printer/templates');

// Templates cần update footer
const templates = [
  'complaint.ts',
  'handover.ts', 
  'packing-guide.ts',
  'packing-request.ts',
  'penalty.ts',
  'quote.ts',
  'refund-confirmation.ts',
  'return-order.ts',
  'sales-return.ts',
  'sales-summary.ts',
  'supplier-order.ts',
  'warranty-request.ts',
  'warranty.ts',
  // Shipping-label và product-label không cần vì là nhãn
];

// Các pattern cần tìm và thay thế
const patterns = [
  // Pattern 1: Footer có hotline
  {
    search: /Hotline:\s*\{store_phone_number\}<\/div>\s*<\/div>/g,
    replace: 'Hotline: {store_phone_number} | In lúc: {print_date} {print_time}</div>\n</div>'
  },
  // Pattern 2: Footer có text cảm ơn
  {
    search: /Cảm ơn quý khách.*?<\/p>\s*<\/div>\s*<\/div>\s*`;/gs,
    replace: (match) => {
      if (match.includes('{print_date}')) return match;
      return match.replace('</div>\n</div>\n`;', 
        '\n  <div style="font-size: 10px; margin-top: 5px;">In lúc: {print_date} {print_time}</div>\n</div>\n</div>\n`;');
    }
  },
  // Pattern 3: Footer đơn giản
  {
    search: /(<!-- FOOTER -->[\s\S]*?)(border-top:\s*1px\s*dashed\s*#333;)([\s\S]*?)(font-size:\s*11px;)?([^}]*?)(<\/div>\s*<\/div>\s*`;)/,
    replace: (match, p1, p2, p3, p4, p5, p6) => {
      if (match.includes('{print_date}')) return match;
      // Thêm print_date vào cuối footer
      const footerEnd = '</div>\n\n</div>\n`;';
      const insertBefore = '</div>\n\n</div>\n`;';
      return match.replace(p6, `\n  <div style="margin-top: 5px;">In lúc: {print_date} {print_time}</div>\n${p6}`);
    }
  }
];

function addPrintDateToFooter(content, filename) {
  // Nếu đã có print_date thì skip
  if (content.includes('{print_date}')) {
    return { content, changed: false };
  }
  
  let updated = content;
  
  // Tìm <!-- FOOTER --> và thêm print_date
  const footerMatch = updated.match(/<!-- FOOTER -->[\s\S]*?<\/div>\s*\n\s*<\/div>\s*\n`;/);
  
  if (footerMatch) {
    const footer = footerMatch[0];
    
    // Tìm vị trí cuối cùng của </div> trước `;
    const lastDivIndex = footer.lastIndexOf('</div>', footer.lastIndexOf('</div>') - 1);
    const insertPoint = footer.indexOf('</div>', lastDivIndex);
    
    // Chèn print_date line
    const newLine = '\n  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div>';
    const newFooter = footer.slice(0, insertPoint) + newLine + footer.slice(insertPoint);
    
    updated = updated.replace(footer, newFooter);
    return { content: updated, changed: true };
  }
  
  // Không có FOOTER comment, tìm pattern khác
  // Tìm div cuối cùng trước `;
  const endPattern = /<\/div>\s*\n\s*<\/div>\s*\n`;/g;
  let lastMatch;
  let m;
  while ((m = endPattern.exec(updated)) !== null) {
    lastMatch = m;
  }
  
  if (lastMatch) {
    const insertPos = lastMatch.index;
    const beforeDiv = '\n<!-- FOOTER -->\n<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">\n  In lúc: {print_date} {print_time}\n</div>\n\n';
    
    updated = updated.slice(0, insertPos) + beforeDiv + updated.slice(insertPos);
    return { content: updated, changed: true };
  }
  
  return { content, changed: false };
}

function main() {
  console.log('='.repeat(60));
  console.log('ADD print_date TO TEMPLATES FOOTER');
  console.log('='.repeat(60));
  
  templates.forEach(file => {
    const filePath = path.join(templatesDir, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`\n⚠️  ${file} - File not found`);
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: updated, changed } = addPrintDateToFooter(content, file);
    
    if (changed) {
      fs.writeFileSync(filePath, updated);
      console.log(`\n✅ ${file} - Đã thêm print_date`);
    } else {
      console.log(`\n⏭️  ${file} - Đã có print_date`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('Done!');
}

main();
