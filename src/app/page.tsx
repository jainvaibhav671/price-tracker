import HeroCarousel from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import Searchbar from "@/components/Searchbar";
import { getAllProducts } from "@/lib/actions";
import Image from "next/image";

export default async function Home() {

  const products = await getAllProducts()
  console.log(products)

  return (
    <>
      <section className="px-6 md:px-20 py-24 border-2">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart shopping made easy
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>
            <h1 className="head-text">
              Unleash the power of{" "}
              <span className="text-primary">PriceTracker</span>
            </h1>
            <p className="mt-6">
              PriceTracker is a one-stop solution for all your price tracking
              needs. With its user-friendly interface and powerful features, you
            </p>
            <Searchbar />
          </div>
          <HeroCarousel />
        </div>
      </section>
      <section className="trending-section">
        <h2 className="section-text text-primary">Trending</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {products?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
