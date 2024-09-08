import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link className="product-card w-full align-center" title={product.title} href={`/products/${product.id}`}>
      <div className="w-64 relative flex flex-1 flex-col">
        <Image width={400} height={400} className="max-h-64 w-full h-full rounded-lg bg-transparent" src={product.image} alt={product.title} />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold truncate">{product.title}</h3>
        <div className="flex justify-between">
          <p className="opacity-50 text-lg capitalize">{product.category}</p>
          <p>
            <span>{product?.currency}</span>
            <span>{product?.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  )
}
