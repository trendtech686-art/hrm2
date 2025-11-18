# LOCAL POSTGRESQL SETUP GUIDE

> **Created:** November 11, 2025  
> **Purpose:** Setup PostgreSQL local trên Windows cho development và testing trước khi deploy VPS
> **Strategy:** Test local → migrate VPS khi ready

---

## 🚀 **WINDOWS POSTGRESQL INSTALLATION**

### 1. **Download PostgreSQL 15**
```
Link: https://www.postgresql.org/download/windows/
Version: PostgreSQL 15.x (LTS recommended)
Installer: postgresql-15.x-x-windows-x64.exe
```

### 2. **Installation Steps**
```bash
# Run installer as Administrator
# Chọn components:
✅ PostgreSQL Server
✅ pgAdmin 4
✅ Stack Builder (optional)
✅ Command Line Tools

# Port: 5432 (default)
# Superuser password: nhập password mạnh
# Locale: Vietnamese (optional) hoặc English
```

### 3. **Verify Installation**
```powershell
# Check PostgreSQL service
Get-Service postgresql*

# Should show: 
# Status: Running
# Name: postgresql-x64-15
```

---

## 🔧 **DATABASE SETUP**

### 1. **Connect via Command Line**
```powershell
# Add PostgreSQL to PATH (if not added during install)
$env:PATH += ";C:\Program Files\PostgreSQL\15\bin"

# Connect to PostgreSQL
psql -U postgres -h localhost
# Nhập password đã set khi install
```

### 2. **Create HRM Database**
```sql
-- Create database
CREATE DATABASE hrm_local;

-- Create user for app
CREATE USER hrm_user WITH PASSWORD 'local_dev_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hrm_local TO hrm_user;

-- Connect to hrm database
\c hrm_local;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO hrm_user;
```

---

## 📊 **DATABASE SCHEMA SETUP**

### 1. **Create Schema File**
```sql
-- hrm_schema.sql - Complete HRM database schema
-- Create tables for HRM system

-- employees table
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  system_id VARCHAR(10) UNIQUE NOT NULL, -- EMP000001 format
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  address TEXT,
  position VARCHAR(50),
  department VARCHAR(50),
  salary DECIMAL(15,2),
  start_date DATE,
  birth_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- customers table  
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  system_id VARCHAR(10) UNIQUE NOT NULL, -- CUS000001 format
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  system_id VARCHAR(10) UNIQUE NOT NULL, -- PRD000001 format
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- orders table (for future - hundreds of thousands records)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  system_id VARCHAR(10) UNIQUE NOT NULL, -- ORD000001 format
  customer_id INTEGER REFERENCES customers(id),
  employee_id INTEGER REFERENCES employees(id),
  total_amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, cancelled
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- order_items table  
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL
);

-- vouchers table
CREATE TABLE vouchers (
  id SERIAL PRIMARY KEY,
  system_id VARCHAR(10) UNIQUE NOT NULL, -- VOU000001 format
  code VARCHAR(20) UNIQUE NOT NULL,
  discount_type VARCHAR(10) NOT NULL, -- percentage, fixed
  discount_value DECIMAL(15,2) NOT NULL,
  min_order_amount DECIMAL(15,2) DEFAULT 0,
  max_discount_amount DECIMAL(15,2),
  usage_limit INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance với large datasets
CREATE INDEX idx_employees_system_id ON employees(system_id);
CREATE INDEX idx_employees_created_at ON employees(created_at);

CREATE INDEX idx_customers_system_id ON customers(system_id);
CREATE INDEX idx_customers_phone ON customers(phone_number);

CREATE INDEX idx_products_system_id ON products(system_id);
CREATE INDEX idx_products_category ON products(category);

CREATE INDEX idx_orders_system_id ON orders(system_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_employee_id ON orders(employee_id);

CREATE INDEX idx_vouchers_system_id ON vouchers(system_id);
CREATE INDEX idx_vouchers_code ON vouchers(code);
CREATE INDEX idx_vouchers_active ON vouchers(is_active);
```

### 2. **Import Schema to Local PostgreSQL**
```powershell
# Create the schema file first (save above SQL as hrm_schema.sql)

# Import schema to local database
psql -U hrm_user -h localhost -d hrm_local -f hrm_schema.sql

# Verify import
psql -U hrm_user -h localhost -d hrm_local -c "\dt"

# Check specific tables
psql -U hrm_user -h localhost -d hrm_local -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
```

---

## ⚙️ **APPLICATION CONFIGURATION**

### 1. **Environment Variables**
```bash
# .env.local (new file)
DATABASE_URL=postgresql://hrm_user:local_dev_password@localhost:5432/hrm_local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrm_local
DB_USER=hrm_user
DB_PASSWORD=local_dev_password
DB_SSL=false
NODE_ENV=development
```

### 2. **PostgreSQL Client Setup**
```typescript
// lib/postgres-client.ts (new file)
import { Pool } from 'pg'

const isDevelopment = process.env.NODE_ENV === 'development'

// Local PostgreSQL connection
const localConfig = {
  host: 'localhost',
  port: 5432,
  database: 'hrm_local',
  user: 'hrm_user',
  password: 'local_dev_password',
  ssl: false
}

// Production VPS config (for later)
const productionConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false // VPS internal network
}

const pool = new Pool(isDevelopment ? localConfig : productionConfig)

export { pool }

// Connection test function
export async function testConnection() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT version()')
    console.log('✅ PostgreSQL connected:', result.rows[0].version)
    client.release()
    return true
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error)
    return false
  }
}
```

---

## 🧪 **TESTING LOCAL SETUP**

### 1. **Install pg Package**
```powershell
# Install PostgreSQL client for Node.js
npm install pg
npm install @types/pg --save-dev
```

### 2. **Create Test Script**
```javascript
// test-postgres-local.js
const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'hrm_local',
  user: 'hrm_user',
  password: 'local_dev_password'
})

async function testLocal() {
  try {
    console.log('🔍 Testing local PostgreSQL connection...')
    
    // Test connection
    const client = await pool.connect()
    console.log('✅ Connected to PostgreSQL')
    
    // Test query
    const result = await client.query('SELECT version()')
    console.log('📊 PostgreSQL Version:', result.rows[0].version)
    
    // Test tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    console.log('📋 Tables:', tables.rows.map(r => r.table_name))
    
    // Test employees table
    const employees = await client.query('SELECT * FROM employees LIMIT 5')
    console.log('👥 Sample Employees:', employees.rows)
    
    client.release()
    await pool.end()
    
    console.log('✅ All tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testLocal()
```

### 3. **Run Test**
```powershell
# Run local PostgreSQL test
node test-postgres-local.js
```

---

## 🔄 **EMPLOYEE STORE MIGRATION**

### 1. **Create PostgreSQL Store**
```typescript
// features/employees/postgres-store.ts
import { create } from 'zustand'
import { Employee } from './types'
import { pool } from '../../lib/postgres-client'

interface EmployeeStore {
  employees: Employee[]
  isLoading: boolean
  error: string | null
  
  fetchEmployees: () => Promise<void>
  createEmployee: (employee: Omit<Employee, 'id' | 'systemId'>) => Promise<void>
  updateEmployee: (id: string, updates: Partial<Employee>) => Promise<void>
  deleteEmployee: (id: string) => Promise<void>
}

export const usePostgresEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  isLoading: false,
  error: null,

  fetchEmployees: async () => {
    set({ isLoading: true, error: null })
    try {
      const client = await pool.connect()
      const result = await client.query(`
        SELECT * FROM employees 
        ORDER BY created_at DESC
      `)
      
      // Convert snake_case to camelCase
      const employees = result.rows.map(row => ({
        id: row.id,
        systemId: row.system_id,
        fullName: row.full_name,
        phoneNumber: row.phone_number,
        email: row.email,
        address: row.address,
        position: row.position,
        department: row.department,
        salary: row.salary,
        startDate: row.start_date,
        birthDate: row.birth_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
      
      set({ employees, isLoading: false })
      client.release()
      
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  createEmployee: async (employeeData) => {
    set({ isLoading: true, error: null })
    try {
      const client = await pool.connect()
      
      // Generate next system_id
      const maxResult = await client.query(`
        SELECT COALESCE(MAX(CAST(SUBSTRING(system_id FROM 4) AS INTEGER)), 0) as max_id 
        FROM employees 
        WHERE system_id LIKE 'EMP%'
      `)
      const nextId = (maxResult.rows[0].max_id + 1).toString().padStart(6, '0')
      const systemId = `EMP${nextId}`
      
      // Insert employee
      const result = await client.query(`
        INSERT INTO employees (
          system_id, full_name, phone_number, email, address, 
          position, department, salary, start_date, birth_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        systemId,
        employeeData.fullName,
        employeeData.phoneNumber,
        employeeData.email,
        employeeData.address,
        employeeData.position,
        employeeData.department,
        employeeData.salary,
        employeeData.startDate,
        employeeData.birthDate
      ])
      
      // Add to local state
      const newEmployee = {
        id: result.rows[0].id,
        systemId: result.rows[0].system_id,
        fullName: result.rows[0].full_name,
        phoneNumber: result.rows[0].phone_number,
        email: result.rows[0].email,
        address: result.rows[0].address,
        position: result.rows[0].position,
        department: result.rows[0].department,
        salary: result.rows[0].salary,
        startDate: result.rows[0].start_date,
        birthDate: result.rows[0].birth_date,
        createdAt: result.rows[0].created_at,
        updatedAt: result.rows[0].updated_at
      }
      
      set(state => ({
        employees: [newEmployee, ...state.employees],
        isLoading: false
      }))
      
      client.release()
      
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  updateEmployee: async (id, updates) => {
    // Implementation similar to create
  },

  deleteEmployee: async (id) => {
    // Implementation for soft delete
  }
}))
```

---

## 📋 **MIGRATION CHECKLIST**

### Phase 1: Local Setup ✅
- [ ] Install PostgreSQL 15 on Windows
- [ ] Create hrm_local database  
- [ ] Setup hrm_user with privileges
- [ ] Test connection via psql

### Phase 2: Schema Setup ⏳
- [ ] Create hrm_schema.sql file với complete schema
- [ ] Import schema to local PostgreSQL
- [ ] Verify all tables created correctly
- [ ] Add sample test data

### Phase 3: App Integration ⏳
- [ ] Install pg npm package
- [ ] Create postgres-client.ts
- [ ] Create postgres-store.ts for employees
- [ ] Test CRUD operations locally

### Phase 4: Testing ⏳  
- [ ] Run connection tests
- [ ] Test employee creation/update
- [ ] Compare với localStorage functionality
- [ ] Performance testing

### Phase 5: Production Ready ⏳
- [ ] Environment variable setup
- [ ] Error handling & logging
- [ ] Connection pooling optimization
- [ ] Ready for VPS deployment

---

## 🎯 **NEXT STEPS**

1. **Install PostgreSQL** trên Windows máy anh
2. **Run migration scripts** to setup database
3. **Test connection** với Node.js app  
4. **Migrate employee store** from localStorage
5. **Verify functionality** before VPS deployment

Approach này cho phép anh **test everything local** trước khi commit to VPS! 🚀