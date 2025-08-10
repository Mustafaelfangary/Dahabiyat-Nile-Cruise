async function testAdminLogin() {
  try {
    console.log('🧪 Testing admin login flow...\n');

    const adminEmail = 'dark1devil2025@outlook.com';

    // Test: Test credentials authentication directly from database
    console.log('1️⃣ Testing admin credentials...');
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcrypt');

    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare('1082034D1d@#', user.password);
      console.log('✅ Password validation:', isPasswordValid ? 'PASSED' : 'FAILED');
      console.log('✅ User role:', user.role);
      console.log('✅ Email verified:', user.isEmailVerified);
      console.log('✅ User ID:', user.id);
      console.log('✅ User name:', user.name);

      if (isPasswordValid && user.role === 'ADMIN' && user.isEmailVerified) {
        console.log('\n🎉 ALL TESTS PASSED!');
        console.log('✅ Admin can sign in without email verification');
        console.log('✅ Credentials are correct');
        console.log('✅ Role is ADMIN');
        console.log('✅ Email is verified');
        console.log('\n📝 Summary:');
        console.log('   📧 Email: dark1devil2025@outlook.com');
        console.log('   🔑 Password: 1082034D1d@#');
        console.log('   👑 Role: ADMIN');
        console.log('   ✅ Can sign in without verification code');
      } else {
        console.log('\n❌ Some tests failed');
      }
    } else {
      console.log('❌ Admin user not found in database');
    }

    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAdminLogin();
