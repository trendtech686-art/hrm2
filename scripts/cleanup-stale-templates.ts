import 'dotenv/config';
import { prisma } from '../lib/prisma';

prisma.settingsData.deleteMany({ where: { type: 'task-templates' } })
  .then(r => console.log('Cleaned up:', r))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
