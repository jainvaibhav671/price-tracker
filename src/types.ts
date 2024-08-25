import { PriceHistory, Product } from "@prisma/client";

export type PriceHistoryItem = Pick<PriceHistory, "price">

export type User = {
  email: string;
};

// export type Product = {
//   _id?: string | undefined;
//   url: string;
//   currency: string;
//   image: string;
//   title: string;
//   currentPrice: number;
//   originalPrice: number;
//   priceHistory: PriceHistoryItem[] | [];
//   highestPrice: number;
//   lowestPrice: number;
//   averagePrice: number;
//   discountRate: number;
//   //description: string;
//   category: string;
//   reviewsCount: number;
//   rating: number;
//   isOutOfStock: boolean;
//   users?: User[];
// };

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = Pick<Product, "id" | "title" | "url" | "image">
