import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const villages = [
        { name: 'Tahunan', latitude: -6.6167, longitude: 110.6667 },
        { name: 'Batealit', latitude: -6.6333, longitude: 110.7167 },
        { name: 'Kedung', latitude: -6.6500, longitude: 110.6500 },
    ]
    for (const v of villages) {
        const exists = await prisma.village.findFirst({ where: { name: v.name } })
        if (!exists) {
            await prisma.village.create({
                data: {
                    ...v,
                    products: {
                        create: [
                            { name: 'Kursi Jati', category: 'Chair', price: 1500000, stock: 10 },
                            { name: 'Meja Makan', category: 'Table', price: 3000000, stock: 5 },
                        ]
                    }
                }
            })
        }
    }
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
