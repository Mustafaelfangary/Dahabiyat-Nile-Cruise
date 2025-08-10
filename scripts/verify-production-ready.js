const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function verifyProductionReady() {
  try {
    console.log('🔍 Verifying production readiness...\n');
    
    let allChecks = true;
    
    // Check 1: Admin user with Outlook email
    console.log('1️⃣ Checking admin user...');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'dark1devil2025@outlook.com' },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true
      }
    });
    
    if (adminUser && adminUser.role === 'ADMIN' && adminUser.isEmailVerified) {
      console.log('✅ Admin user configured correctly');
      console.log(`   - Email: ${adminUser.email}`);
      console.log(`   - Role: ${adminUser.role}`);
      console.log(`   - Verified: ${adminUser.isEmailVerified}`);
    } else {
      console.log('❌ Admin user not properly configured');
      allChecks = false;
    }
    
    // Check 2: Database schema
    console.log('\n2️⃣ Checking database schema...');
    try {
      const userCount = await prisma.user.count();
      const dahabiyaCount = await prisma.dahabiya.count();
      console.log('✅ Database schema is valid');
      console.log(`   - Users: ${userCount}`);
      console.log(`   - Dahabiyas: ${dahabiyaCount}`);
    } catch (error) {
      console.log('❌ Database schema issues:', error.message);
      allChecks = false;
    }
    
    // Check 3: Environment file
    console.log('\n3️⃣ Checking environment configuration...');
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      const requiredVars = [
        'DATABASE_URL',
        'NEXTAUTH_SECRET',
        'NEXTAUTH_URL'
      ];
      
      let envChecks = true;
      requiredVars.forEach(varName => {
        if (envContent.includes(varName)) {
          console.log(`   ✅ ${varName} configured`);
        } else {
          console.log(`   ❌ ${varName} missing`);
          envChecks = false;
        }
      });
      
      if (envChecks) {
        console.log('✅ Environment variables configured');
      } else {
        console.log('❌ Some environment variables missing');
        allChecks = false;
      }
    } else {
      console.log('❌ .env file not found');
      allChecks = false;
    }
    
    // Check 4: Package.json scripts
    console.log('\n4️⃣ Checking package.json scripts...');
    const packagePath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      const requiredScripts = ['build', 'start', 'dev'];
      let scriptChecks = true;
      
      requiredScripts.forEach(script => {
        if (packageJson.scripts && packageJson.scripts[script]) {
          console.log(`   ✅ ${script} script available`);
        } else {
          console.log(`   ❌ ${script} script missing`);
          scriptChecks = false;
        }
      });
      
      if (scriptChecks) {
        console.log('✅ Required scripts available');
      } else {
        console.log('❌ Some required scripts missing');
        allChecks = false;
      }
    } else {
      console.log('❌ package.json not found');
      allChecks = false;
    }
    
    // Summary
    console.log('\n📋 Production Readiness Summary:');
    if (allChecks) {
      console.log('🎉 ALL CHECKS PASSED - Ready for production deployment!');
      console.log('\n🚀 Next steps for VPS deployment:');
      console.log('1. Update NEXTAUTH_URL in .env to your domain');
      console.log('2. Update DATABASE_URL for production database');
      console.log('3. Run: npm run build');
      console.log('4. Run: npm start');
      console.log('5. Test admin login at: https://your-domain.com/auth/signin');
      console.log('   Email: dark1devil2025@outlook.com');
      console.log('   Password: 1082034D1d@#');
    } else {
      console.log('❌ Some checks failed - Please fix issues before deployment');
    }
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    await prisma.$disconnect();
  }
}

verifyProductionReady();
