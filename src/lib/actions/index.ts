"use server";

import { scrapeAmazonProduct } from "../scraper";
import prismaClient from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { Product } from "@prisma/client";

export async function scrapeAndStoreProduct(params: { productURL?: string; product?: Product, includeUsers: boolean }) {

  let existingProduct: any | undefined = undefined;
  let productURL = "";

  if (typeof params.product !== "undefined") {
    existingProduct = params.product
    productURL = params.product.url
  }

  if (typeof params.productURL !== "undefined") {
    productURL = params.productURL
  }

  if (productURL.length == 0) return;

  try {
    const scrapedProduct = await scrapeAmazonProduct(productURL);
    if (!scrapedProduct) return;

    // either all goes right or all goes wrong
    const newProduct = await prismaClient.$transaction(async (prisma) => {
      let product = scrapedProduct;

      if (typeof existingProduct === "undefined") {
        existingProduct = await prismaClient.product.findFirst({
          where: {
            url: scrapedProduct.url,
          },
          include: {
            priceHistory: true,
            users: params.includeUsers
          },
        });
      }

      // update the product's price history
      if (typeof existingProduct !== "undefined" && existingProduct != null) {
        const newPriceHistoryItem = await prisma.priceHistory.create({
          data: {
            price: product.priceHistory[0].price,
            productId: existingProduct.id
          }
        })

        product.priceHistory = [...existingProduct.priceHistory, newPriceHistoryItem];

        return await prisma.product.update({
          include: {
            priceHistory: true,
            users: params.includeUsers
          },
          where: {
            id: existingProduct.id
          },
          data: {
            currentPrice: product.currentPrice,
            originalPrice: product.originalPrice,
            discountRate: product.discountRate,
            reviewsCount: product.reviewsCount,
            isOutOfStock: product.isOutOfStock,
            lowestPrice: getLowestPrice(product.priceHistory),
            highestPrice: getHighestPrice(product.priceHistory),
            averagePrice: getAveragePrice(product.priceHistory),
          }
        })
      }

      return await prisma.product.create({
        include: {
          priceHistory: true,
          users: params.includeUsers
        },
        data: {
          ...product,
          priceHistory: {
            createMany: {
              data: product.priceHistory
            }
          }
        }
      })
    })

    revalidatePath(`/products/${newProduct.id}`)
    return newProduct;
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {

    const product = await prismaClient.product.findFirst({
      where: {
        id: productId
      },
      include: {
        priceHistory: true
      }
    })

    if (!product) return null

    return product;

  } catch (error) {
    console.log(error)
  }
}

export async function getAllProducts() {
  try {
    const products = await prismaClient.product.findMany()
    return products
  } catch (error) {
    console.log(error)
  }
}

// export async function getSimilarProducts(productId: string) {
//   try {

//     const similarProducts = await prismaClient.$runCommandRaw({
//       aggregate: "Product",
//       cursor: {},
//       pipeline: [
//         { $match: { _id: { $ne: currentProduct.id } } },
//         { $sample: { size: 3 } }
//       ]
//     })

//     // @ts-ignore
//     return similarProducts.cursor.firstBatch as Product[]

//   } catch(error) {
//     console.log(error)
//   }
// }

export async function addUserEmailToProduct(productId: string, email: string) {
  try {

    const product = await getProductById(productId)

    if (!product || typeof product === "undefined") return;

    const user = await prismaClient.user.findFirst({
      where: {
        email: email
      }
    })

    // user does not exist
    if (!user) {
      await prismaClient.user.create({
        data: {
          email: email,
          productIDs: [productId]
        }
      })
    } else {

      if (productId in user.productIDs) {
        return { message: "You are already tracking this product" }
      }

      await prismaClient.user.update({
        where: {
          id: user.id
        },
        data: {
          productIDs: [
            ...user.productIDs,
            productId
          ]
        }
      })
    }

    const emailContent = await generateEmailBody(product, "WELCOME")
    await sendEmail(emailContent, [email])

    return { message: "Your will now receive product updates in your mail!" }
  } catch (error) {
    console.log(error)

    return { message: "Try again later." }
  }
}
