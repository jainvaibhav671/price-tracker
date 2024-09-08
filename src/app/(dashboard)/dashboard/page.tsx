import { ProductCard } from "@/components/ProductCard";
import { getUserProducts } from "../actions";

export default async function Page() {
    const user = await getUserProducts()

    console.log(user?.products)

    return (
        <>
            <h1>Your Products</h1>
                <div className="grid grid-cols-8 gap-8">
            {user?.products.map((product) => <ProductCard product={product} />)}
            </div>
        </>
    )
}
