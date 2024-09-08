import { auth } from "@/auth"
import ProductInfoCard from "@/components/PriceInfoCard"
import TrackModal from "@/components/TrackModal"
import { Button } from "@/components/ui/button"
import { getProductById } from "@/lib/actions"
import { formatNumber } from "@/lib/utils"
import { User } from "@prisma/client"
import { Bookmark, ExternalLink, MessageSquareText, Share2, Star, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

type Props = {
    params: { id: string }
}

export default async function Page({ params: { id } }: Props) {
    const product = await getProductById(id)

    const session = await auth()
    if (!product) redirect('/')

    return <div className="product-container">
        <div className="flex gap-28 xl:flex-row flex-col">
            <div className="flex gap-4">
                <div className="md:w-[580px] lg:h-[400px] flex items-center justify-center hover:border-blue-400 border rounded-lg p-2">
                    <Image width={580} height={400} className="h-96 w-full mx-auto" src={product.image} alt={product.title} />
                </div>
                <div className="flex flex-col gap-2">
                    <Button variant="ghost">
                        <Bookmark width={20} height={20} />
                    </Button>
                    <Button variant="ghost">
                        <Share2 width={20} height={20} />
                    </Button>
                    <Button variant="ghost">
                        <TrendingUp width={20} height={20} />
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-3">
                    <p className="text-[28px] font-semibold">{product.title}</p>
                </div>
                <div className="flex items-center justify-between w-full">
                    <Button variant="link" className="px-0r">
                        <Link className="text-base hover:underline underline-offset-4 flex gap-2 items-center" href={product.url} target="_blank"><ExternalLink width={20} height={20} /><span>Visit Product</span></Link>
                    </Button>
                    <TrackModal user={session?.user as User} productId={id} />
                </div>

                <div className="product-info w-full flex justify-between items-center">
                    <div className="flex flex-col gap-3">
                        <p className="text-3xl text-foreground font-bold">{product.currency} {formatNumber(product.currentPrice)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <div className="flex gap-3 items-center justify-end">
                            <div className="flex justify-center items-center gap-2 py-2 px-4 rounded-2xl text-yellow-700 bg-yellow-100">
                                <Star width={20} height={20} />
                                <p>{product.rating}</p>
                            </div>
                            <Link href={"reviews-url"} className="flex justify-center items-center gap-2 py-2 px-4 rounded-2xl text-blue-700 bg-blue-200">
                                <MessageSquareText className="mt-1" width={20} height={20} />
                                <p>{product.reviewsCount} Reviews</p>
                            </Link>
                        </div>
                        {/* TODO: scrape count of 5* and 4* reviews  */}
                        <p><span className="font-semibold text-green-400">93%</span> of customers recommend this</p>
                    </div>
                </div>

                <div className="my-3 flex gap-5 flex-wrap">
                    <ProductInfoCard title="Current Price" iconSrc="/assets/icons/price-tag.svg" value={`${product.currency} ${formatNumber(product.currentPrice)}`} color="#0266ff" />
                    <ProductInfoCard title="Average Price" iconSrc="/assets/icons/chart.svg" value={`${product.currency} ${product.averagePrice && formatNumber(product.averagePrice)}`} color="#8C60FF" />
                    <ProductInfoCard title="Highest Price" iconSrc="/assets/icons/arrow-up.svg" value={`${product.currency} ${product.highestPrice && formatNumber(product.highestPrice)}`} color="#FA7677" />
                    <ProductInfoCard title="Lowest Price" iconSrc="/assets/icons/arrow-down.svg" value={`${product.currency} ${product.lowestPrice && formatNumber(product.lowestPrice)}`} color="#22FF39" />
                </div>
            </div>
        </div>
    </div>
}
