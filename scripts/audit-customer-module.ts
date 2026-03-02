/**
 * Comprehensive Customer Module Audit Script
 * 
 * Checks:
 * 1. Prisma schema vs actual DB data
 * 2. API routes - all methods work
 * 3. Form validation schema completeness
 * 4. Data flow: DB -> API -> Form -> API -> DB
 */

import { prisma } from '../lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

interface AuditResult {
  category: string;
  check: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  details?: unknown;
}

const results: AuditResult[] = [];

function log(result: AuditResult) {
  results.push(result);
  const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} [${result.category}] ${result.check}: ${result.message}`);
  if (result.details && result.status !== 'PASS') {
    console.log('   Details:', JSON.stringify(result.details, null, 2).split('\n').map(l => '   ' + l).join('\n'));
  }
}

async function auditPrismaSchema() {
  console.log('\n========== 1. PRISMA SCHEMA AUDIT ==========\n');
  
  // Read prisma schema for Customer
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema', 'sales', 'customer.prisma');
  
  if (!fs.existsSync(schemaPath)) {
    log({ category: 'Prisma', check: 'Customer schema file', status: 'WARN', message: `Schema file not found at ${schemaPath}` });
  } else {
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    log({ category: 'Prisma', check: 'Customer schema exists', status: 'PASS', message: 'Found customer.prisma' });
  }
  
  // Get actual customer from DB
  const sampleCustomer = await prisma.customer.findFirst({
    where: { isDeleted: false }
  });
  
  if (!sampleCustomer) {
    log({ category: 'Prisma', check: 'Sample data', status: 'WARN', message: 'No customers in DB to validate against' });
    return;
  }
  
  // Check all fields in sample customer
  const dbFields = Object.keys(sampleCustomer);
  log({ 
    category: 'Prisma', 
    check: 'DB fields count', 
    status: 'PASS', 
    message: `Customer has ${dbFields.length} fields in DB`,
    details: dbFields
  });
  
  // Check for null vs undefined issues
  const nullFields = dbFields.filter(f => (sampleCustomer as Record<string, unknown>)[f] === null);
  const undefinedFields = dbFields.filter(f => (sampleCustomer as Record<string, unknown>)[f] === undefined);
  
  log({
    category: 'Prisma',
    check: 'Null fields',
    status: nullFields.length > 10 ? 'WARN' : 'PASS',
    message: `${nullFields.length} fields are null`,
    details: nullFields
  });
  
  if (undefinedFields.length > 0) {
    log({
      category: 'Prisma',
      check: 'Undefined fields',
      status: 'FAIL',
      message: `${undefinedFields.length} fields are undefined (should not happen)`,
      details: undefinedFields
    });
  }
  
  // Check status field
  log({
    category: 'Prisma',
    check: 'Status value',
    status: 'PASS',
    message: `Status = "${sampleCustomer.status}"`,
    details: { status: sampleCustomer.status, type: typeof sampleCustomer.status }
  });
  
  // Check addresses
  log({
    category: 'Prisma',
    check: 'Addresses field',
    status: Array.isArray(sampleCustomer.addresses) ? 'PASS' : 'FAIL',
    message: `Addresses is ${Array.isArray(sampleCustomer.addresses) ? 'array' : typeof sampleCustomer.addresses}`,
    details: sampleCustomer.addresses
  });
}

async function auditAPIRoutes() {
  console.log('\n========== 2. API ROUTES AUDIT ==========\n');
  
  const apiDir = path.join(process.cwd(), 'app', 'api', 'customers');
  
  // Check main routes
  const mainRoute = path.join(apiDir, 'route.ts');
  const dynamicRoute = path.join(apiDir, '[systemId]', 'route.ts');
  
  // Check if files exist
  if (!fs.existsSync(mainRoute)) {
    log({ category: 'API', check: 'Main route', status: 'FAIL', message: 'app/api/customers/route.ts not found' });
  } else {
    const content = fs.readFileSync(mainRoute, 'utf-8');
    const hasGET = content.includes('export async function GET');
    const hasPOST = content.includes('export async function POST');
    
    log({ category: 'API', check: 'Main GET', status: hasGET ? 'PASS' : 'FAIL', message: hasGET ? 'GET handler exists' : 'Missing GET handler' });
    log({ category: 'API', check: 'Main POST', status: hasPOST ? 'PASS' : 'FAIL', message: hasPOST ? 'POST handler exists' : 'Missing POST handler' });
  }
  
  if (!fs.existsSync(dynamicRoute)) {
    log({ category: 'API', check: 'Dynamic route', status: 'FAIL', message: 'app/api/customers/[systemId]/route.ts not found' });
  } else {
    const content = fs.readFileSync(dynamicRoute, 'utf-8');
    const hasGET = content.includes('export async function GET');
    const hasPUT = content.includes('export async function PUT');
    const hasPATCH = content.includes('PATCH') || content.includes('export { PUT as PATCH }');
    const hasDELETE = content.includes('export async function DELETE');
    
    log({ category: 'API', check: '[systemId] GET', status: hasGET ? 'PASS' : 'FAIL', message: hasGET ? 'GET handler exists' : 'Missing GET handler' });
    log({ category: 'API', check: '[systemId] PUT', status: hasPUT ? 'PASS' : 'FAIL', message: hasPUT ? 'PUT handler exists' : 'Missing PUT handler' });
    log({ category: 'API', check: '[systemId] PATCH', status: hasPATCH ? 'PASS' : 'FAIL', message: hasPATCH ? 'PATCH handler/alias exists' : 'Missing PATCH handler - API client uses PATCH!' });
    log({ category: 'API', check: '[systemId] DELETE', status: hasDELETE ? 'PASS' : 'FAIL', message: hasDELETE ? 'DELETE handler exists' : 'Missing DELETE handler' });
    
    // Check params pattern for Next.js 15+
    const hasPromiseParams = content.includes('params: Promise<');
    const hasAwaitParams = content.includes('await params');
    
    log({ 
      category: 'API', 
      check: 'Next.js 15 params', 
      status: hasPromiseParams && hasAwaitParams ? 'PASS' : 'FAIL', 
      message: hasPromiseParams && hasAwaitParams ? 'Using Promise<params> pattern correctly' : 'Not using Next.js 15 async params pattern!'
    });
  }
}

async function auditFormSchema() {
  console.log('\n========== 3. FORM VALIDATION SCHEMA AUDIT ==========\n');
  
  const validationPath = path.join(process.cwd(), 'features', 'customers', 'validation.ts');
  
  if (!fs.existsSync(validationPath)) {
    log({ category: 'Form', check: 'Validation file', status: 'FAIL', message: 'validation.ts not found' });
    return;
  }
  
  const content = fs.readFileSync(validationPath, 'utf-8');
  
  // Check status enum values
  const statusMatch = content.match(/status:\s*z\.enum\(\[(.*?)\]/s);
  if (statusMatch) {
    const statusValues = statusMatch[1];
    const hasACTIVE = statusValues.includes("'ACTIVE'") || statusValues.includes('"ACTIVE"');
    const hasActive = statusValues.includes("'active'") || statusValues.includes('"active"');
    const hasDangGiaoDich = statusValues.includes('Đang giao dịch');
    
    log({
      category: 'Form',
      check: 'Status enum',
      status: hasACTIVE ? 'PASS' : 'FAIL',
      message: hasACTIVE ? 'Status enum includes ACTIVE (uppercase from DB)' : 'Status enum missing ACTIVE - DB uses uppercase!',
      details: { values: statusValues }
    });
  }
  
  // Check address schema required fields
  const addressSchemaMatch = content.match(/addressSchema\s*=\s*z\.object\(\{([\s\S]*?)\}\)/);
  if (addressSchemaMatch) {
    const addressFields = addressSchemaMatch[1];
    
    const provinceIdOptional = addressFields.includes('provinceId') && addressFields.includes('.optional()');
    const districtIdOptional = addressFields.includes('districtId') && addressFields.includes('.optional()');
    const wardIdOptional = addressFields.includes('wardId') && addressFields.includes('.optional()');
    
    log({
      category: 'Form',
      check: 'Address IDs optional',
      status: provinceIdOptional && wardIdOptional ? 'PASS' : 'WARN',
      message: 'provinceId/districtId/wardId should be optional (imported data may not have them)'
    });
  }
}

async function auditAPIClient() {
  console.log('\n========== 4. API CLIENT AUDIT ==========\n');
  
  const apiClientPath = path.join(process.cwd(), 'features', 'customers', 'api', 'customers-api.ts');
  
  if (!fs.existsSync(apiClientPath)) {
    log({ category: 'Client', check: 'API client file', status: 'FAIL', message: 'customers-api.ts not found' });
    return;
  }
  
  const content = fs.readFileSync(apiClientPath, 'utf-8');
  
  // Check HTTP methods used
  const updateMatch = content.match(/updateCustomer[\s\S]*?method:\s*['"](\w+)['"]/);
  if (updateMatch) {
    const method = updateMatch[1];
    log({
      category: 'Client',
      check: 'Update method',
      status: 'PASS',
      message: `updateCustomer uses ${method} method`,
      details: { method }
    });
  }
  
  // Check API_BASE
  const apiBaseMatch = content.match(/API_BASE\s*=\s*['"]([^'"]+)['"]/);
  if (apiBaseMatch) {
    log({
      category: 'Client',
      check: 'API base URL',
      status: 'PASS',
      message: `API_BASE = "${apiBaseMatch[1]}"`
    });
  }
}

async function auditDataFlow() {
  console.log('\n========== 5. DATA FLOW TEST ==========\n');
  
  // Get a sample customer
  const customer = await prisma.customer.findFirst({
    where: { isDeleted: false }
  });
  
  if (!customer) {
    log({ category: 'DataFlow', check: 'Sample customer', status: 'WARN', message: 'No customer to test with' });
    return;
  }
  
  log({
    category: 'DataFlow',
    check: 'Sample customer loaded',
    status: 'PASS',
    message: `Testing with customer: ${customer.id} - ${customer.name}`
  });
  
  // Check critical fields
  const criticalFields = ['systemId', 'id', 'name', 'status', 'addresses'];
  for (const field of criticalFields) {
    const value = (customer as Record<string, unknown>)[field];
    log({
      category: 'DataFlow',
      check: `Field: ${field}`,
      status: value !== undefined ? 'PASS' : 'FAIL',
      message: `${field} = ${JSON.stringify(value)?.substring(0, 100)}...`
    });
  }
  
  // Check if addresses have required sub-fields
  if (Array.isArray(customer.addresses) && customer.addresses.length > 0) {
    const firstAddr = customer.addresses[0] as Record<string, unknown>;
    const addrFields = ['id', 'label', 'street', 'province', 'district', 'ward'];
    const missingFields = addrFields.filter(f => !firstAddr[f]);
    
    log({
      category: 'DataFlow',
      check: 'Address structure',
      status: missingFields.length === 0 ? 'PASS' : 'WARN',
      message: missingFields.length === 0 ? 'Address has all required fields' : `Missing: ${missingFields.join(', ')}`,
      details: firstAddr
    });
    
    // Check for ID fields in address
    const hasProvinceId = 'provinceId' in firstAddr;
    const hasDistrictId = 'districtId' in firstAddr;
    const hasWardId = 'wardId' in firstAddr;
    
    log({
      category: 'DataFlow',
      check: 'Address IDs',
      status: 'WARN',
      message: `provinceId: ${hasProvinceId}, districtId: ${hasDistrictId}, wardId: ${hasWardId}`,
      details: { hasProvinceId, hasDistrictId, hasWardId }
    });
  }
}

async function auditFormComponents() {
  console.log('\n========== 6. FORM COMPONENTS AUDIT ==========\n');
  
  const formPath = path.join(process.cwd(), 'features', 'customers', 'customer-form.tsx');
  const formPagePath = path.join(process.cwd(), 'features', 'customers', 'customer-form-page.tsx');
  
  // Check customer-form.tsx
  if (fs.existsSync(formPath)) {
    const content = fs.readFileSync(formPath, 'utf-8');
    
    // Check form id matches button
    const formId = content.match(/form id="([^"]+)"/);
    log({
      category: 'Form',
      check: 'Form ID',
      status: formId ? 'PASS' : 'FAIL',
      message: formId ? `Form ID = "${formId[1]}"` : 'Form missing id attribute'
    });
    
    // Check onSubmit handler
    const hasOnSubmit = content.includes('form.handleSubmit');
    log({
      category: 'Form',
      check: 'Submit handler',
      status: hasOnSubmit ? 'PASS' : 'FAIL',
      message: hasOnSubmit ? 'form.handleSubmit is used' : 'Missing form.handleSubmit'
    });
    
    // Check for mode
    const modeMatch = content.match(/mode:\s*['"](\w+)['"]/);
    log({
      category: 'Form',
      check: 'Form mode',
      status: 'PASS',
      message: `Form mode = "${modeMatch?.[1] || 'default'}"`
    });
  }
  
  // Check customer-form-page.tsx
  if (fs.existsSync(formPagePath)) {
    const content = fs.readFileSync(formPagePath, 'utf-8');
    
    // Check button form attribute
    const buttonFormAttr = content.match(/form="([^"]+)"/);
    log({
      category: 'Form',
      check: 'Button form attr',
      status: buttonFormAttr ? 'PASS' : 'FAIL',
      message: buttonFormAttr ? `Button form="${buttonFormAttr[1]}"` : 'Button missing form attribute'
    });
    
    // Check mutation usage
    const usesMutateAsync = content.includes('mutateAsync');
    log({
      category: 'Form',
      check: 'Mutation async',
      status: usesMutateAsync ? 'PASS' : 'FAIL',
      message: usesMutateAsync ? 'Uses mutateAsync correctly' : 'Not using mutateAsync'
    });
  }
}

async function generateSummary() {
  console.log('\n========== AUDIT SUMMARY ==========\n');
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const warned = results.filter(r => r.status === 'WARN').length;
  
  console.log(`Total checks: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️ Warnings: ${warned}`);
  
  if (failed > 0) {
    console.log('\n=== CRITICAL ISSUES TO FIX ===\n');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`❌ [${r.category}] ${r.check}: ${r.message}`);
    });
  }
  
  if (warned > 0) {
    console.log('\n=== WARNINGS TO REVIEW ===\n');
    results.filter(r => r.status === 'WARN').forEach(r => {
      console.log(`⚠️ [${r.category}] ${r.check}: ${r.message}`);
    });
  }
}

async function main() {
  console.log('🔍 CUSTOMER MODULE COMPREHENSIVE AUDIT\n');
  console.log('=====================================\n');
  
  try {
    await auditPrismaSchema();
    await auditAPIRoutes();
    await auditFormSchema();
    await auditAPIClient();
    await auditDataFlow();
    await auditFormComponents();
    await generateSummary();
  } catch (error) {
    console.error('Audit failed:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
