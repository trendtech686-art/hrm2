import { prisma } from './lib/prisma';

interface GHTKAccount {
  id: string;
  name: string;
  active: boolean;
  isDefault: boolean;
  credentials: {
    apiToken: string;
    partnerCode?: string;
  };
}

async function checkGHTKConfig() {
  console.log('Checking GHTK config in database...\n');

  // Check shipping_partners_config
  const setting = await prisma.setting.findUnique({
    where: {
      key_group: {
        key: 'shipping_partners_config',
        group: 'shipping',
      }
    }
  });

  if (!setting) {
    console.log('❌ Setting "shipping_partners_config" NOT FOUND');
    console.log('\nYou need to configure GHTK in the Shipping Settings page.');
  } else {
    console.log('✅ Setting found:', setting.key);

    const config = setting.value as Record<string, unknown>;
    const ghtkPartner = (config.partners as Record<string, unknown>)?.GHTK as {
      accounts?: GHTKAccount[];
    } | undefined;

    console.log('\n--- GHTK Config Analysis (New Structure) ---');
    if (!ghtkPartner?.accounts?.length) {
      console.log('❌ No GHTK accounts configured');
    } else {
      console.log(`✅ Found ${ghtkPartner.accounts.length} GHTK account(s):`);
      
      for (const acc of ghtkPartner.accounts) {
        console.log(`\n  Account: ${acc.name} (${acc.id})`);
        console.log(`    - active: ${acc.active}`);
        console.log(`    - isDefault: ${acc.isDefault}`);
        console.log(`    - apiToken: ${acc.credentials?.apiToken ? '✅ Set' : '❌ Missing'}`);
        console.log(`    - partnerCode: ${acc.credentials?.partnerCode || 'Not set'}`);
      }

      // Find the default active account
      const activeAccount = ghtkPartner.accounts.find(acc => acc.active && acc.isDefault)
        || ghtkPartner.accounts.find(acc => acc.active);

      if (activeAccount) {
        console.log(`\n✅ Active account: "${activeAccount.name}"`);
        console.log(`   Token: ${activeAccount.credentials.apiToken.substring(0, 10)}...`);
      } else {
        console.log('\n❌ No active account found');
      }
    }
  }

  await prisma.$disconnect();
}

checkGHTKConfig().catch(console.error);
