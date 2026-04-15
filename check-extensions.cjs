// Use the same Prisma setup as the app
const { Pool } = require('pg');

async function checkExtensions() {
  // Use DATABASE_URL from environment
  const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/erp_db';
  
  const pool = new Pool({ connectionString });
  
  try {
    // Test FUZZY SEARCH with pg_trgm similarity
    console.log('=== FUZZY SEARCH TEST ===\n');
    
    // Test 1: Typo tolerance
    console.log('1. Typo tolerance (searching "hoco" with typo "hco"):');
    const typoTest = await pool.query(`
      SELECT name, similarity(LOWER(name), 'hco') as sim 
      FROM products 
      WHERE similarity(LOWER(name), 'hco') > 0.1 
      ORDER BY sim DESC 
      LIMIT 5
    `);
    console.table(typoTest.rows);

    // Test 2: Partial match
    console.log('\n2. Partial match (searching "x14"):');
    const partialTest = await pool.query(`
      SELECT name, id, similarity(LOWER(name), 'x14') as name_sim,
             similarity(LOWER(id), 'x14') as id_sim
      FROM products 
      WHERE similarity(LOWER(name), 'x14') > 0.1 
         OR similarity(LOWER(id), 'x14') > 0.1
      ORDER BY GREATEST(similarity(LOWER(name), 'x14'), similarity(LOWER(id), 'x14')) DESC 
      LIMIT 5
    `);
    console.table(partialTest.rows);

    // Test 3: Vietnamese search (unaccent)
    console.log('\n3. Vietnamese accent test (searching "cap sac"):');
    const vnTest = await pool.query(`
      SELECT name, 
             similarity(unaccent(LOWER(name)), unaccent('cap sac')) as sim
      FROM products 
      WHERE similarity(unaccent(LOWER(name)), unaccent('cap sac')) > 0.1
      ORDER BY sim DESC 
      LIMIT 5
    `);
    console.table(vnTest.rows);

    // Test 4: Current ILIKE search (what we use now)
    console.log('\n4. Current ILIKE search (searching "%hoco%"):');
    const start = Date.now();
    const ilikeTest = await pool.query(`
      SELECT name FROM products WHERE name ILIKE '%hoco%' LIMIT 5
    `);
    console.log(`Time: ${Date.now() - start}ms, Results: ${ilikeTest.rows.length}`);

    // Test 5: Similarity search (fuzzy)
    console.log('\n5. Fuzzy similarity search (searching "hoco"):');
    const start2 = Date.now();
    const fuzzyTest = await pool.query(`
      SELECT name, similarity(LOWER(name), 'hoco') as sim
      FROM products 
      WHERE LOWER(name) % 'hoco'
      ORDER BY sim DESC
      LIMIT 5
    `);
    console.log(`Time: ${Date.now() - start2}ms, Results: ${fuzzyTest.rows.length}`);
    console.table(fuzzyTest.rows);

    // Show current similarity threshold
    const thresholdResult = await pool.query('SHOW pg_trgm.similarity_threshold');
    console.log('\nCurrent similarity threshold:', thresholdResult.rows[0].pg_trgm_similarity_threshold);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkExtensions();
