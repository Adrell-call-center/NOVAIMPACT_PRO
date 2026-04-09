const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const adminEmail = process.env.ADMIN_EMAIL || 'admin@novaimpact.fr';
const adminPassword = process.env.ADMIN_PASSWORD || 'NovaAdmin2026!';

async function seed() {
  try {
    const hashedPassword = bcrypt.hashSync(adminPassword, 12);

    // Create admin user if not exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: 'Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
      console.log(`✅ Admin user created: ${adminEmail}`);
    } else {
      console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
    }

    console.log('🎉 Seeding complete!');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    // Don't exit with error code - allow app to continue starting
  } finally {
    await prisma.$disconnect();
  }
}

seed();

