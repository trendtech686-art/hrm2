import { seedInventorySettings } from '../prisma/seeds/seed-inventory-settings';
seedInventorySettings()
  .then(() => { console.log('Done!'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
