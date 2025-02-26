import { ProductType } from "../../S1_data";
import { usePanier } from "../../store/cart";

export function DisplayPriceItemCart({ product }: { product: ProductType | null }) {
  const carts = usePanier((state) => state.panier);
  const itemInPanier = carts.find((item) => item.product.id === product?.id);
  return (
    <h1 className="px-2 whitespace-nowrap text-clamp-xs">
      {itemInPanier?.totalPrice} {product?.currency}
    </h1>
  );
}