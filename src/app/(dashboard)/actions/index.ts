"use server"

import { auth } from "@/auth"
import prismaClient from "@/lib/prisma"

export async function getUserProducts() {

    const session = await auth()

    if (!session || typeof session.user === "undefined") return;

    const userId = session.user.id

    try {
        const user = await prismaClient.user.findFirst({
            where: {
                id: userId
            },
            include: {
                products: true,
            }
        })

        return user
    } catch (error) {

    }
}
