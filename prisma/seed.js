const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  const serveurPrive = await prisma.voteSite.upsert({
    where: { title: 'serveur-prive.net' },
    update: {}, 
    create: {
      title: 'serveur-prive.net',
      url: 'https://serveur-prive.net/minecraft/ekaii-mc/vote',
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })