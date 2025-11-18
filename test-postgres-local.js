// Test PostgreSQL connection locally
const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'hrm_local',
  user: 'hrm_user',
  password: 'local_dev_password'
})

async function testLocalPostgreSQL() {
  try {
    console.log('Testing local PostgreSQL connection...')
    
    // Test connection
    console.log('Connecting to PostgreSQL...')
    const client = await pool.connect()
    console.log('Connected to PostgreSQL successfully!')
    
    // Test version
    const versionResult = await client.query('SELECT version()')
    console.log('PostgreSQL Version:', versionResult.rows[0].version.split(' ').slice(0, 2).join(' '))
    
    // Test current database
    const dbResult = await client.query('SELECT current_database()')
    console.log('Current Database:', dbResult.rows[0].current_database)
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    if (tablesResult.rows.length === 0) {
      console.log('No tables found. Need to import schema first.')
      console.log('Next step: Create and import hrm_schema.sql')
      console.log('Run: psql -U hrm_user -h localhost -d hrm_local -f hrm_schema.sql')
    } else {
      console.log('Tables found:')
      tablesResult.rows.forEach(table => {
        console.log(`   - ${table.table_name} (${table.table_type})`)
      })
      
      // Test employees table if exists
      const employeesExists = tablesResult.rows.find(t => t.table_name === 'employees')
      if (employeesExists) {
        const employeeCount = await client.query('SELECT COUNT(*) as count FROM employees')
        console.log(`Employees count: ${employeeCount.rows[0].count}`)
        
        if (employeeCount.rows[0].count > 0) {
          const sampleEmployees = await client.query('SELECT system_id, full_name FROM employees LIMIT 3')
          console.log('Sample employees:')
          sampleEmployees.rows.forEach(emp => {
            console.log(`   - ${emp.system_id}: ${emp.full_name}`)
          })
        } else {
          console.log('Tables exist but no employee data found')
          console.log('Ready to start adding employees via app!')
        }
      }
    }
    
    client.release()
    await pool.end()
    
    console.log('All tests completed successfully!')
    console.log('Ready to proceed with local development!')
    
  } catch (error) {
    console.error('Test failed:', error.message)
    
    // Specific error handling with solutions
    if (error.code === 'ECONNREFUSED') {
      console.log('Solution: Make sure PostgreSQL is installed and running')
      console.log('   - Download: https://www.postgresql.org/download/windows/')
      console.log('   - Check service: Get-Service postgresql*')
      console.log('   - Start if stopped: Start-Service postgresql-x64-15')
    } else if (error.code === '28P01') {
      console.log('Solution: Check database credentials')
      console.log('   - Connect as postgres: psql -U postgres')
      console.log('   - Create user: CREATE USER hrm_user WITH PASSWORD \'local_dev_password\';')
      console.log('   - Grant access: GRANT ALL PRIVILEGES ON DATABASE hrm_local TO hrm_user;')
    } else if (error.code === '3D000') {
      console.log('Solution: Create database first')
      console.log('   - Connect as postgres: psql -U postgres')
      console.log('   - Create database: CREATE DATABASE hrm_local;')
      console.log('   - Grant privileges: GRANT ALL PRIVILEGES ON DATABASE hrm_local TO hrm_user;')
    } else {
      console.log(`Error Code: ${error.code}`)
      console.log('Check LOCAL-POSTGRESQL-SETUP.md for complete guide')
    }
    
    await pool.end()
  }
}

// Run the test
testLocalPostgreSQL()