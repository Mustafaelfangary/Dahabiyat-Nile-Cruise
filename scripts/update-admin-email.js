const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function updateAdminEmail() {
  try {
    console.log('🔄 Updating admin email from Gmail to Outlook...\n');
    
    const oldEmail = 'dark1devil2025@gmail.com';
    const newEmail = 'dark1devil2025@outlook.com';
    const adminPassword = '1082034D1d@#';
    
    // Check if old admin exists
    const oldAdmin = await prisma.user.findUnique({
      where: { email: oldEmail }
    });
    
    if (oldAdmin) {
      console.log('🗑️ Removing old Gmail admin account...');
      await prisma.user.delete({
        where: { email: oldEmail }
      });
      console.log('✅ Old admin account removed');
    } else {
      console.log('ℹ️ No existing Gmail admin found');
    }
    
    // Check if new admin already exists
    const existingNewAdmin = await prisma.user.findUnique({
      where: { email: newEmail }
    });
    
    if (existingNewAdmin) {
      console.log('ℹ️ Outlook admin already exists. Updating to ensure proper settings...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Update existing user
      const updatedAdmin = await prisma.user.update({
        where: { email: newEmail },
        data: {
          name: 'System Administrator',
          password: hashedPassword,
          role: 'ADMIN',
          isEmailVerified: true,
          emailVerified: new Date(),
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isEmailVerified: true,
          createdAt: true
        }
      });
      
      console.log('✅ Admin user updated successfully:');
      console.log(updatedAdmin);
    } else {
      console.log('🆕 Creating new Outlook admin account...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Create new admin user
      const newAdmin = await prisma.user.create({
        data: {
          name: 'System Administrator',
          email: newEmail,
          password: hashedPassword,
          role: 'ADMIN',
          isEmailVerified: true,
          emailVerified: new Date(),
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isEmailVerified: true,
          createdAt: true
        }
      });
      
      console.log('✅ Admin user created successfully:');
      console.log(newAdmin);
    }
    
    console.log('\n🎉 Admin email update completed!');
    console.log('📧 New Email: dark1devil2025@outlook.com');
    console.log('🔑 Password: 1082034D1d@#');
    console.log('👑 Role: ADMIN');
    console.log('✅ Email Verified: true');
    console.log('\n🌐 This will work on both:');
    console.log('   - Local development: http://localhost:3001');
    console.log('   - Production VPS: your-domain.com');
    console.log('\nThe admin can now sign in without email verification!');
    
  } catch (error) {
    console.error('❌ Error updating admin email:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateAdminEmail();
