const faker = require('faker');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding fake users in database...')

  const userData = [...Array(100)].map(async () => {
    return {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      passwordHash: await bcrypt.hash("Artillery-Rocks!", 10)
    };
  });

  await prisma.user.createMany({
    data: await Promise.all(userData)
  });

  console.log('Finished seeding database!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
