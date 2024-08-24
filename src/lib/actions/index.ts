"use server";

import { scrapeAmazonProduct } from "../scraper";
import prismaClient from "../prisma";
import { revalidatePath } from "next/cache";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

export async function scrapeAndStoreProduct(productURL: string) {
  if (productURL.length == 0) return;

  try {
    const scrapedProduct = await scrapeAmazonProduct(productURL);
    if (!scrapedProduct) return;

    // either all goes right or all goes wrong
    const newProduct = await prismaClient.$transaction(async (prisma) => {
      let product = scrapedProduct;
      console.log("PRODUCT: ", product)
      const existingProduct = await prismaClient.product.findFirst({
        where: {
          url: scrapedProduct.url,
        },
        include: {
          priceHistory: true,
        },
      });
      console.log(existingProduct)

      // update the product's price history
      if (existingProduct) {
        const newPriceHistoryItem = await prisma.priceHistory.create({
          data: {
            price: product.priceHistory[0].price,
            productId: existingProduct.id
          }
        })

        product.priceHistory = [...existingProduct.priceHistory, newPriceHistoryItem];

        return await prisma.product.update({
          include: {
            priceHistory: true
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
            averagePrice: getAveragePrice(product.priceHistory)
          }
        })
      }

      return await prisma.product.create({
        include: {
          priceHistory: true,
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
    return scrapedProduct;
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
    console.log(products)
    return products
  } catch(error) {

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
