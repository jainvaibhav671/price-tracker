import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link className="product-card w-full align-center" title={product.title} href={`/products/${product.id}`}>
      <div className="w-64 min-h-80 product-card_img-container">
        <Image fill className="product-card-img" src={product.image} alt={product.title} />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>
        <div className="flex justify-between">
          <p className="text-black opacity-50 text-lg capitalize">{product.category}</p>
          <p>
            <span>{product?.currency}</span>
            <span>{product?.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  )
}
