import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  const complaint = await prisma.complaint.findUnique({
    where: { id: 'KN000001' },
    select: {
      systemId: true,
      id: true,
      type: true,
      affectedProducts: true,
      images: true,
      verification: true,
    },
  });

  if (!complaint) {
    console.log('KN000001 not found');
    return;
  }

  console.log('=== KN000001 Data ===');
  console.log('type:', complaint.type);
  console.log('verification:', complaint.verification);
  console.log('images:', JSON.stringify(complaint.images, null, 2));
  console.log('affectedProducts:', JSON.stringify(complaint.affectedProducts, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
