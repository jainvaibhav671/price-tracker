import HeroCarousel from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import Searchbar from "@/components/Searchbar";
import { getAllProducts } from "@/lib/actions";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const products = await getAllProducts()

  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-start pt-16">
            <p className="text-ring flex items-center gap-1 text-md">
              <span>Smart shopping made easy</span>
              <ArrowRight className="mt-1" width={16} height={16} />
            </p>
            <h1 className="head-text ">
              Unleash the power of{" "}
              <span className="text-primary">PriceTracker</span>
            </h1>
            <p className="mt-6 text-lg">
              PriceTracker is a one-stop solution for all your price tracking
              needs. With its user-friendly interface and powerful features, you
            </p>
            <Searchbar />
          </div>
          <HeroCarousel />
        </div>
      </section>

      <section className="px-6 md:px-20 my-16" id="trending">
        <h1 className="text-4xl text-primary font-bold mb-8">Tracked Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
