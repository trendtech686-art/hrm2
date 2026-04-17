/**
 * Audit Print Template Variables
 * 
 * Rà soát toàn bộ biến {variable} trong templates và so sánh
 * với dữ liệu được cung cấp trong mappers/helpers.
 * 
 * Phát hiện:
 * 1. Biến trong template nhưng KHÔNG có trong mapper (sẽ bị trống khi in)
 * 2. Biến trong mapper nhưng KHÔNG dùng trong template (dead data)
 * 3. Thống kê store variables (logo, email, address...) xem helper nào thiếu
 * 
 * Run: npx tsx scripts/audit-print-variables.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================
// CONFIG
// =============================================

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'features/settings/printer/templates');
const MAPPERS_DIR = path.join(ROOT, 'lib/print-mappers');
const HELPERS_DIR = path.join(ROOT, 'lib/print');
const OUTPUT_FILE = path.join(ROOT, 'scripts/audit-print-variables-report.txt');

// Store-related variables that EVERY template with header should have
const STORE_VARIABLES = [
  '{store_logo}',
  '{store_name}',
  '{store_address}',
  '{store_phone_number}',
  '{store_email}',
  '{store_hotline}',
  '{store_website}',
  '{store_tax_code}',
  '{store_fax}',
];

// Variables injected by getStoreData() in print-service.ts — always available
const AUTO_INJECTED = new Set([
  '{store_logo}',
  '{store_name}',
  '{store_address}',
  '{store_phone_number}',
  '{hotline}',
  '{store_hotline}',
  '{store_email}',
  '{store_fax}',
  '{store_website}',
  '{store_tax_code}',
  '{store_registration_number}',
  '{store_bank_account_name}',
  '{store_bank_account_number}',
  '{store_bank_name}',
  '{print_date}',
  '{print_time}',
]);

// =============================================
// HELPERS
// =============================================

/** Extract {variable} patterns from text (excludes conditionals like {{#if}}) */
function extractTemplateVariables(content: string): Set<string> {
  const vars = new Set<string>();
  // Match {word} but NOT {{word}} and NOT {#word} and NOT {/word}
  const regex = /(?<!\{)\{([a-zA-Z_][a-zA-Z0-9_]*)\}(?!\})/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    vars.add(`{${match[1]}}`);
  }
  return vars;
}

/** Extract '{variable}' keys from mapper/helper files (what data is provided) */
function extractMapperVariables(content: string): Set<string> {
  const vars = new Set<string>();
  // Match string literals like '{variable_name}' or "{variable_name}"
  const regex = /['"`]\{([a-zA-Z_][a-zA-Z0-9_]*)\}['"`]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    vars.add(`{${match[1]}}`);
  }
  return vars;
}

/** Extract conditional variables from {{#if var}} {{#if_not_empty {var}}} etc. */
function extractConditionalVariables(content: string): Set<string> {
  const vars = new Set<string>();
  // {{#if_not_empty {field}}} or {{#if_empty {field}}} or {{#if_gt {field} N}}
  const regex = /\{\{#(?:if_not_empty|if_empty|if_gt|if_lt|if_gte|if_lte)\s+\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    vars.add(`{${match[1]}}`);
  }
  return vars;
}

/** Extract line_xxx variables that come from line items */
function extractLineItemVariables(content: string): Set<string> {
  const vars = new Set<string>();
  const regex = /\{(line_[a-zA-Z0-9_]+)\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    vars.add(`{${match[1]}}`);
  }
  return vars;
}

function readFileUtf8(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

function getFiles(dir: string, ext = '.ts'): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(ext) && f !== 'index.ts' && f !== 'styles.ts')
    .map(f => path.join(dir, f));
}

// =============================================
// MAIN AUDIT
// =============================================

interface TemplateAudit {
  name: string;
  file: string;
  variables: Set<string>;
  conditionalVars: Set<string>;
  lineItemVars: Set<string>;
  hasStoreHeader: boolean;
}

interface MapperAudit {
  name: string;
  file: string;
  variables: Set<string>;
}

function auditTemplates(): TemplateAudit[] {
  const results: TemplateAudit[] = [];
  const files = getFiles(TEMPLATES_DIR);

  for (const file of files) {
    const content = readFileUtf8(file);
    const name = path.basename(file, '.ts');
    const variables = extractTemplateVariables(content);
    const conditionalVars = extractConditionalVariables(content);
    const lineItemVars = extractLineItemVariables(content);
    
    // Merge conditional vars into variables (they also need data)
    for (const v of conditionalVars) variables.add(v);

    // Check if template has store header info
    const hasStoreHeader = variables.has('{store_name}') || variables.has('{store_logo}');

    results.push({ name, file, variables, conditionalVars, lineItemVars, hasStoreHeader });
  }
  
  return results;
}

function auditMappers(): MapperAudit[] {
  const results: MapperAudit[] = [];
  const files = getFiles(MAPPERS_DIR);

  for (const file of files) {
    const content = readFileUtf8(file);
    const name = path.basename(file, '.ts').replace('.mapper', '');
    const variables = extractMapperVariables(content);
    results.push({ name, file, variables });
  }

  return results;
}

function auditHelpers(): MapperAudit[] {
  const results: MapperAudit[] = [];
  const files = getFiles(HELPERS_DIR);

  for (const file of files) {
    const content = readFileUtf8(file);
    const name = path.basename(file, '.ts').replace('-print-helper', '');
    const variables = extractMapperVariables(content);
    results.push({ name, file, variables });
  }

  return results;
}

/** Try to match template name to corresponding mapper/helper */
function findMatchingMapper(templateName: string, mappers: MapperAudit[], helpers: MapperAudit[]): MapperAudit | undefined {
  // Direct match
  const directMapper = mappers.find(m => m.name === templateName);
  if (directMapper) return directMapper;

  const directHelper = helpers.find(h => h.name === templateName);
  if (directHelper) return directHelper;

  // Fuzzy match (e.g., 'sales-return' template → 'sales-return' mapper)
  const normalized = templateName.replace(/-/g, '');
  return mappers.find(m => m.name.replace(/-/g, '') === normalized)
    || helpers.find(h => h.name.replace(/-/g, '') === normalized);
}

function main() {
  console.log('🔍 Auditing print template variables...\n');
  
  const templates = auditTemplates();
  const mappers = auditMappers();
  const helpers = auditHelpers();

  const lines: string[] = [];
  const addLine = (text: string) => { lines.push(text); console.log(text); };
  
  addLine('═══════════════════════════════════════════════════════════════');
  addLine('   PRINT TEMPLATE VARIABLE AUDIT REPORT');
  addLine(`   Generated: ${new Date().toISOString()}`);
  addLine('═══════════════════════════════════════════════════════════════');
  addLine('');

  // ── 1. Per-template audit ──
  let totalMissing = 0;
  let totalDead = 0;
  const missingStoreVars: { template: string; missing: string[] }[] = [];

  for (const tmpl of templates) {
    const mapper = findMatchingMapper(tmpl.name, mappers, helpers);
    
    addLine(`┌─ Template: ${tmpl.name}`);
    addLine(`│  File: ${path.relative(ROOT, tmpl.file)}`);
    addLine(`│  Variables: ${tmpl.variables.size} | Line items: ${tmpl.lineItemVars.size} | Has store header: ${tmpl.hasStoreHeader}`);
    
    if (mapper) {
      addLine(`│  Mapper: ${path.relative(ROOT, mapper.file)}`);
      
      // Variables in template but NOT in mapper (and not auto-injected)
      const missingInMapper: string[] = [];
      for (const v of tmpl.variables) {
        if (AUTO_INJECTED.has(v)) continue;
        if (tmpl.lineItemVars.has(v)) continue; // line items handled separately
        if (!mapper.variables.has(v)) {
          missingInMapper.push(v);
        }
      }

      // Variables in mapper but NOT in template
      const deadInMapper: string[] = [];
      for (const v of mapper.variables) {
        if (AUTO_INJECTED.has(v)) continue;
        if (!tmpl.variables.has(v) && !tmpl.lineItemVars.has(v)) {
          deadInMapper.push(v);
        }
      }

      if (missingInMapper.length > 0) {
        addLine(`│  ⚠️  MISSING in mapper (${missingInMapper.length}):`);
        for (const v of missingInMapper) {
          addLine(`│     ❌ ${v}`);
        }
        totalMissing += missingInMapper.length;
      }

      if (deadInMapper.length > 0) {
        addLine(`│  📦 Dead in mapper (${deadInMapper.length}):`);
        for (const v of deadInMapper.slice(0, 10)) {
          addLine(`│     🗑️  ${v}`);
        }
        if (deadInMapper.length > 10) {
          addLine(`│     ... and ${deadInMapper.length - 10} more`);
        }
        totalDead += deadInMapper.length;
      }

      if (missingInMapper.length === 0 && deadInMapper.length === 0) {
        addLine(`│  ✅ All variables matched`);
      }
    } else {
      addLine(`│  ⚠️  NO matching mapper/helper found`);
    }

    // Check store variables
    if (tmpl.hasStoreHeader) {
      const missingStore = STORE_VARIABLES.filter(v => tmpl.variables.has(v) && !AUTO_INJECTED.has(v));
      // Actually check which store vars are USED but not in the auto-injected set
      const usedStoreVars = STORE_VARIABLES.filter(v => tmpl.variables.has(v));
      const missingFromTemplate = STORE_VARIABLES.filter(v => !tmpl.variables.has(v) && v !== '{store_fax}' && v !== '{store_website}' && v !== '{store_hotline}');
      
      if (missingFromTemplate.length > 0) {
        missingStoreVars.push({ template: tmpl.name, missing: missingFromTemplate });
        addLine(`│  ⚠️  Store variables NOT used in template:`);
        for (const v of missingFromTemplate) {
          addLine(`│     📋 ${v}`);
        }
      }
    }

    addLine('└─');
    addLine('');
  }

  // ── 2. Summary ──
  addLine('═══════════════════════════════════════════════════════════════');
  addLine('   SUMMARY');
  addLine('═══════════════════════════════════════════════════════════════');
  addLine(`Templates scanned:    ${templates.length}`);
  addLine(`Mappers found:        ${mappers.length}`);
  addLine(`Helpers found:        ${helpers.length}`);
  addLine(`Missing variables:    ${totalMissing}`);
  addLine(`Dead mapper data:     ${totalDead}`);
  addLine('');

  // ── 3. Store variables coverage ──
  addLine('═══════════════════════════════════════════════════════════════');
  addLine('   STORE VARIABLE COVERAGE (templates with headers)');
  addLine('═══════════════════════════════════════════════════════════════');
  
  const headeredTemplates = templates.filter(t => t.hasStoreHeader);
  addLine(`Templates with store header: ${headeredTemplates.length}`);
  addLine('');

  for (const sv of STORE_VARIABLES) {
    const using = headeredTemplates.filter(t => t.variables.has(sv)).map(t => t.name);
    const notUsing = headeredTemplates.filter(t => !t.variables.has(sv)).map(t => t.name);
    const pct = headeredTemplates.length > 0 ? Math.round(using.length / headeredTemplates.length * 100) : 0;
    addLine(`${sv}: ${using.length}/${headeredTemplates.length} (${pct}%)`);
    if (notUsing.length > 0 && notUsing.length <= 10) {
      addLine(`  Not using: ${notUsing.join(', ')}`);
    }
  }
  addLine('');

  // ── 4. Templates missing store email/logo ──
  addLine('═══════════════════════════════════════════════════════════════');
  addLine('   ⚠️  TEMPLATES MISSING {store_email} or {store_logo}');
  addLine('═══════════════════════════════════════════════════════════════');

  for (const tmpl of headeredTemplates) {
    const issues: string[] = [];
    if (!tmpl.variables.has('{store_email}')) issues.push('{store_email}');
    if (!tmpl.variables.has('{store_logo}')) issues.push('{store_logo}');
    if (issues.length > 0) {
      addLine(`  ${tmpl.name}: missing ${issues.join(', ')}`);
    }
  }
  addLine('');

  // ── 5. Orphaned mappers (no matching template) ──
  addLine('═══════════════════════════════════════════════════════════════');
  addLine('   ORPHANED MAPPERS (no matching template)');
  addLine('═══════════════════════════════════════════════════════════════');
  
  for (const mapper of mappers) {
    const match = templates.find(t => 
      t.name === mapper.name || 
      t.name.replace(/-/g, '') === mapper.name.replace(/-/g, '')
    );
    if (!match) {
      addLine(`  🗑️  ${mapper.name} → ${path.relative(ROOT, mapper.file)}`);
    }
  }
  addLine('');

  // ── 6. createStoreSettings audit (check all helpers) ──
  addLine('═══════════════════════════════════════════════════════════════');
  addLine('   createStoreSettings() AUDIT');
  addLine('═══════════════════════════════════════════════════════════════');

  const helperFiles = getFiles(HELPERS_DIR);
  for (const file of helperFiles) {
    const content = readFileUtf8(file);
    const name = path.basename(file, '.ts');
    
    if (content.includes('createStoreSettings')) {
      const hasEmail = /email.*:.*(?:storeInfo|email|generalSettings)/i.test(content);
      const hasLogo = /logo.*:.*(?:getStoreLogo|storeInfo|logo)/i.test(content);
      const hasGetGeneralSettings = content.includes('getGeneralSettings');
      const hasGetStoreInfoSync = content.includes('getStoreInfoSync');
      
      const status = [];
      if (!hasEmail) status.push('❌ email');
      if (!hasLogo) status.push('❌ logo');
      if (!hasGetGeneralSettings && !hasGetStoreInfoSync) status.push('⚠️ no fallback');
      
      if (status.length > 0) {
        addLine(`  ${name}: ${status.join(' | ')}`);
      } else {
        addLine(`  ${name}: ✅ email + logo + fallback`);
      }
    }
  }
  addLine('');

  // ── Write report ──
  const report = lines.join('\n');
  fs.writeFileSync(OUTPUT_FILE, '\uFEFF' + report, 'utf-8'); // BOM for UTF-8
  console.log(`\n📄 Report saved to: ${path.relative(ROOT, OUTPUT_FILE)}`);
}

main();
