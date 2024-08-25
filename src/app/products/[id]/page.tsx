import ProductInfoCard from "@/components/PriceInfoCard"
import { ProductCard } from "@/components/ProductCard"
import TrackModal from "@/components/TrackModal"
import { getProductById } from "@/lib/actions"
import { formatNumber } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

type Props = {
    params: { id: string }
}

export default async function Page({ params: { id } }: Props) {
    const product = await getProductById(id)

    if (!product) redirect('/')

    return <div className="product-container">
        <div className="flex gap-28 xl:flex-row flex-col">
            <div className="md:w-[580px] lg:h-[400px] flex items-center justify-center hover:border-blue-400 border rounded-lg p-2">
                <Image src={product.image} alt={product.title} width={580} height={400} className="h-96 w-full mx-auto" />
            </div>
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
                    <div className="flex flex-col gap-3">
                        <p className="text-[28px] text-secondary font-semibold">{product.title}</p>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <Link className="text-base hover:underline text-black opacity-50" href={product.url} target="_blank">Visit Product</Link>
                        <div className="flex items-center gap-3">
                            {/* <div className="product-hearts">
                                <Image alt="heart" width={20} height={20} src="/assets/icons/red-heart.svg" />
                                <p className="text-base font-semibold text-primary">{product.reviewsCount}</p>
                            </div> */}
                            <div className="p-2 bg-white-200 rounded-10">
                                <Image src="/assets/icons/bookmark.svg" alt="bookmark" width={20} height={20} />
                            </div>
                            <div className="p-2 bg-white-200 rounded-10">
                                <Image src="/assets/icons/share.svg" alt="share" width={20} height={20} />
                            </div>
                        </div>
                    </div>

                    <div className="product-info w-full flex items-center">
                        <div className="flex flex-col gap-3">
                            <p className="text-3xl text-secondary font-bold">{product.currency} {formatNumber(product.currentPrice)}</p>
                            <p className="text-xl text-black opacity-50 line-through">{product.currency} {formatNumber(product.originalPrice)}</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-3 items-center justify-end">
                                <div className="product-stars">
                                    <Image src="/assets/icons/star.svg" width={20} height={20} alt="star" />
                                    <p>{product.rating}</p>
                                </div>
                                <Link href={"reviews-url"} className="product-reviews">
                                    <Image src="/assets/icons/comment.svg" width={20} height={20} alt="review" />
                                    <p>{product.reviewsCount} Reviews</p>
                                </Link>
                            </div>
                            {/* TODO: scrape count of 5* and 4* reviews  */}
                            <p className="text-black opacity-50"><span className="font-semibold text-primary-green">93%</span> of customers recommend this</p>
                        </div>
                    </div>

                    <div className="my-7 flex flex-col gap-5">
                        <div className="flex gap-5 flex-wrap">
                            <ProductInfoCard title="Current Price" iconSrc="/assets/icons/price-tag.svg" value={`${product.currency} ${formatNumber(product.currentPrice)}`} color="#0266ff" />
                            <ProductInfoCard title="Average Price" iconSrc="/assets/icons/chart.svg" value={`${product.currency} ${product.averagePrice && formatNumber(product.averagePrice)}`} color="#8C60FF" />
                            <ProductInfoCard title="Highest Price" iconSrc="/assets/icons/arrow-up.svg" value={`${product.currency} ${product.highestPrice && formatNumber(product.highestPrice)}`} color="#FA7677" />
                            <ProductInfoCard title="Lowest Price" iconSrc="/assets/icons/arrow-down.svg" value={`${product.currency} ${product.lowestPrice && formatNumber(product.lowestPrice)}`} color="#22FF39" />
                        </div>
                        <TrackModal productId={id} />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-5">
                <h3 className="text-2xl text-secondary font-semibold">Product Description</h3>
                <div className="flex flex-col gap-4">{product?.description?.split('\n')}</div>
            </div>

            <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
                <Image src="/assets/icons/bag.svg" alt="check" width={22} height={22} />
                <Link href="/" className="text-base text-white">Buy Now</Link>
            </button>
        </div>
    </div>
}
