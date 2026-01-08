import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

async function fixAuthPatterns() {
  // Find all files with wrong pattern
  const files = await glob('app/api/**/*.ts');
  let count = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes("'status' in authResult")) {
      // Replace all occurrences - pattern without semicolons
      content = content.replace(
        /const authResult = await requireAuth\(\)\n  if \('status' in authResult\) return authResult/g,
        'const session = await requireAuth()\n  if (!session) return apiError(\'Unauthorized\', 401)'
      );
      
      // Replace all occurrences - pattern with semicolons
      content = content.replace(
        /const authResult = await requireAuth\(\);\n  if \('status' in authResult\) return authResult;/g,
        'const session = await requireAuth();\n  if (!session) return apiError(\'Unauthorized\', 401);'
      );

      // Also handle pattern with semicolon only on second line
      content = content.replace(
        /const authResult = await requireAuth\(\)\n  if \('status' in authResult\) return authResult;/g,
        'const session = await requireAuth()\n  if (!session) return apiError(\'Unauthorized\', 401);'
      );
      
      fs.writeFileSync(file, content);
      count++;
      console.log('Fixed:', file);
    }
  }
  console.log('Total files fixed:', count);
}

fixAuthPatterns();
