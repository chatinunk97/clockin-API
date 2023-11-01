const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  const package = await prisma.package.create({
    data: {
      price: 5990,
      userCount: 100,
    },
  });
  const company = await prisma.companyProfile.create({
    data: {
      companyName: 'Clockin',
      packageId: package.id,
      companyLocations: {
        create: {
          latitudeCompany: 12.00093275055899,
          longitudeCompany: -14.01464947446926,
        },
      },
      payment: {
        create: {
          paySlip: 'paySlip',
        },
      },
      user: {
        create: {
          employeeId: '1',
          firstName: 'Bob',
          lastName: 'Bab',
          email: 'Bob@email.com',
          mobile: '0999999999',
          password: await bcrypt.hash('superAdmin', 10),
          position: 'SUPERADMIN',
        },
      },
    },
    include: {
      companyLocations: true,
      payment: true,
      user: true,
    },
  });
  console.log({ bob });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
