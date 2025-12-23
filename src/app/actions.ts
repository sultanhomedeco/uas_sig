'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addVillage(formData: FormData) {
    const name = formData.get('name') as string
    const latitude = parseFloat(formData.get('latitude') as string)
    const longitude = parseFloat(formData.get('longitude') as string)

    await prisma.village.create({
        data: { name, latitude, longitude }
    })
    revalidatePath('/')
}

export async function addProduct(villageId: number, formData: FormData) {
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)

    await prisma.product.create({
        data: {
            name, category, price, stock, villageId
        }
    })
    revalidatePath('/')
}

export async function deleteProduct(productId: number) {
    await prisma.product.delete({
        where: { id: productId }
    })
    revalidatePath('/')
}

export async function deleteVillage(villageId: number) {
    // Optional: Delete products first or use cascade in schema
    // Schema didn't specify onDelete: Cascade, so we might need manual delete or update schema
    // For now, assume simple delete
    await prisma.product.deleteMany({ where: { villageId } })
    await prisma.village.delete({ where: { id: villageId } })
    revalidatePath('/')
}
