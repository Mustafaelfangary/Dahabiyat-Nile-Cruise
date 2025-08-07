// Check all availability dates in the system
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAllAvailabilityDates() {
  try {
    console.log('🔍 Checking all availability dates in the system...\n');

    // Get all availability dates
    const allAvailabilityDates = await prisma.availabilityDate.findMany({
      include: {
        dahabiya: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: [
        { dahabiya: { name: 'asc' } },
        { date: 'asc' }
      ]
    });

    console.log(`📅 Total availability date records: ${allAvailabilityDates.length}`);

    if (allAvailabilityDates.length === 0) {
      console.log('❌ No availability dates found in the system!');
      console.log('This suggests the admin panel availability setting is not working properly.');
      
      // Check if the AvailabilityDate table exists
      console.log('\n🔍 Checking database schema...');
      try {
        const tableInfo = await prisma.$queryRaw`
          SELECT name FROM sqlite_master WHERE type='table' AND name='AvailabilityDate';
        `;
        console.log('AvailabilityDate table exists:', tableInfo.length > 0);
      } catch (error) {
        console.log('Error checking table:', error.message);
      }
      
    } else {
      console.log('\n📋 Availability dates by dahabiya:');
      
      const groupedByDahabiya = {};
      allAvailabilityDates.forEach(date => {
        const dahabiyaName = date.dahabiya?.name || 'Unknown Dahabiya';
        if (!groupedByDahabiya[dahabiyaName]) {
          groupedByDahabiya[dahabiyaName] = [];
        }
        groupedByDahabiya[dahabiyaName].push(date);
      });

      Object.keys(groupedByDahabiya).forEach(dahabiyaName => {
        const dates = groupedByDahabiya[dahabiyaName];
        console.log(`\n🚢 ${dahabiyaName}:`);
        dates.forEach(date => {
          const status = date.available ? '✅ Available' : '❌ Unavailable';
          const price = date.price ? `$${date.price}` : 'default';
          console.log(`   ${date.date.toISOString().split('T')[0]} - ${status} (${price})`);
        });
      });
    }

    // Also check all dahabiyas to see which ones exist
    console.log('\n🚢 All dahabiyas in the system:');
    const allDahabiyas = await prisma.dahabiya.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        _count: {
          select: {
            availabilityDates: true
          }
        }
      }
    });

    allDahabiyas.forEach(dahabiya => {
      const status = dahabiya.isActive ? '✅ Active' : '❌ Inactive';
      console.log(`   ${dahabiya.name} (${dahabiya.slug}) - ${status} - ${dahabiya._count.availabilityDates} availability dates`);
    });

  } catch (error) {
    console.error('❌ Error checking availability dates:', error);
    console.error('Error details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkAllAvailabilityDates();
