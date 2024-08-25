import { scrapeAndStoreProduct } from "@/lib/actions";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import prismaClient from "@/lib/prisma";
import { getEmailNotifType } from "@/lib/utils";
import { Product, User } from "@prisma/client";
import { NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes
export const revalidate = 0;
export const dynamic = "force-dynamic"

export async function GET() {
    try {

        const products = await prismaClient.product.findMany()

        if (products.length == 0) throw new Error("No proudcts found")

        const updatedProducts = await Promise.all(
            products.map(async (product: Product) => {
                const newProduct = await scrapeAndStoreProduct({ product: product, includeUsers: true })
                if (typeof newProduct === "undefined" ) throw new Error("Couldn't fetch product, try again later")

                const emailNotifType = getEmailNotifType(newProduct, product)

                if (emailNotifType && newProduct.userIDs.length > 0) {
                    const productInfo = {
                        id: newProduct.id,
                        title: newProduct.title,
                        url: newProduct.url,
                        image: newProduct.image
                    }

                    const emailContent = await generateEmailBody(productInfo, emailNotifType)
                    const userEmails = newProduct.users.map((user: User) => user.email)

                    await sendEmail(emailContent, userEmails)
                }

                return newProduct
            })
        )

        return NextResponse.json({
            message: "Cron job completed",
            data: updatedProducts
        })


    } catch (error) {
        throw new Error(`Error in GET ${error}`)
    }
}
