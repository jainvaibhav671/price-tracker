import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice, extractCurrency } from "../utils";

export async function scrapeAmazonProduct(productURL: string) {
  if (productURL.length == 0) return;

  // BrightData proxy configuration
  const username = String(process.env.BD_USERNAME);
  const password = String(process.env.BD_PASSWORD);
  const port = String(process.env.BD_HOST_PORT);
  const sessionId = (100000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${sessionId}`,
      password,
    },
    host: String(process.env.BD_HOST_URL),
    port,
    rejectUnauthorized: false,
  };

  try {
    const res = await axios.get(productURL, options);
    const $ = cheerio.load(res.data);

    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base"),
      $(".a-price.a-text-price"),
    );
    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price"),
    );
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currenty unavailable";
    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";
    const imageURLs = Object.keys(JSON.parse(images));
    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");
    const rating = $("#acrPopover .a-popover-trigger .a-size-base").text().trim()
    const reviewsCount = $("#acrCustomerReviewText").text().trim().replace(" ratings", "")
    const category = $("#wayfinding-breadcrumbs_container li:not(.a-breadcrumb-divider)").first().text().trim()

    const priceHistory = [{ price: Number(originalPrice) }]
    if (originalPrice !== currentPrice) priceHistory.push({ price: Number(currentPrice) })

    console.log(imageURLs)
    return {
      title,
      category,
      image: imageURLs[0],
      url: productURL,
      rating: parseFloat(rating) || 0.0,
      reviewsCount: Number(reviewsCount) || 0,
      isOutOfStock: outOfStock,
      currency: currency || "$",
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      discountRate: Number(discountRate),
      priceHistory: priceHistory,  // TODO: get a history from a database
      lowestPrice: Math.min(Number(currentPrice), Number(originalPrice)),
      highestPrice: Math.max(Number(currentPrice), Number(originalPrice)),
      averagePrice: Number(currentPrice) || Number(originalPrice)
    };
  } catch (error: any) {
    console.log(error)
    throw new Error(`Failed to scrape message: ${error.message}`);
  }
}
