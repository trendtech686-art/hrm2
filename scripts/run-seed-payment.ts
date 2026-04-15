import { seedPaymentSettings } from '../prisma/seeds/seed-payment-settings';
seedPaymentSettings()
  .then(() => { console.log('Done!'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
