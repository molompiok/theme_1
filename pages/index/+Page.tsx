import { CiSliderHorizontal } from "react-icons/ci";
import { CartButton } from "../../component/Button";
import { navigate } from "vike/client/router";
import { DisplayPrice } from "../../component/DisplayPrice";
import { useData } from "../../renderer/useData";
import { Data } from "./+data";
import { HydrationBoundary, useQuery } from "@tanstack/react-query";
import {
  get_features_with_values,
  get_group_features,
  get_products,
} from "../../api/products.api";
import { ProductClient } from "../type";
import Loading from "../../component/Loading";
import { ProductMedia } from "../../component/ProductMedia";
import FavoriteButton from "../../component/FavoriteButton";
import ReviewsStars from "../../component/comment/ReviewsStars";
import { formatSlug } from "../../utils";

export { Page };

function Page() {
  const { dehydratedState } = useData<Data>();
  return (
    <div className="min-h-screen bg-gray-50 font-primary">
      <div className="container mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
          <aside className="hidden lg:block sticky top-6 self-start rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h1 className="text-lg font-semibold mb-4">Filtres</h1>
          </aside>

          <div className="flex items-center justify-between mb-6 lg:hidden">
            <span className="text-base font-medium">Filtres</span>
            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm">Filtres</span>
              <CiSliderHorizontal size={24} color="black" />
            </button>
          </div>

          <HydrationBoundary state={dehydratedState}>
            <ListProductCard />
          </HydrationBoundary>
        </div>
      </div>
    </div>
  );
}

function ListProductCard() {
  const { data: products, status } = useQuery({
    queryKey: ["gets_products"],
    queryFn: () => get_products({}),
  });

  if (status === "pending") {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loading />
      </div>
    );
  }
  if (!products || products.length === 0) {
    return (
      <p className="text-center text-lg text-gray-500 py-20">
        Aucun produit trouvé
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: ProductClient }) {
  const handleGo = () => {
    navigate(`/${formatSlug(product.slug)}`);
  };

  const { data: feature, status } = useQuery({
    queryKey: ["get_features_with_values", product.default_feature_id],
    queryFn: () =>
      get_features_with_values({ feature_id: product.default_feature_id }),
  });

  const { data: group_features } = useQuery({
    queryKey: ["get_group_features", product?.id],
    queryFn: () => get_group_features({ product_id: product?.id }),
    enabled: !!product?.id,
  });

  const mediaList = feature?.[0]?.values?.[0]?.views || [];

  return (
    <div
      onClick={handleGo}
      className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md 
        transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden max-w-md mx-auto"
    >
      <div className="relative w-full aspect-square overflow-hidden">
        {status === "pending" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loading />
          </div>
        ) : (
          <ProductMedia
            mediaList={mediaList}
            productName={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <FavoriteButton key={product.id} product_id={product.id} />
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="mb-2">
          <h1 className="text-sm sm:text-base/5 font-semibold line-clamp-2 mb-1">
            {product.name}
          </h1>
          <div className="flex items-center gap-1">
            <ReviewsStars note={4.6} size={14} style="text-orange-500" />
            <span className="text-xs text-gray-600">(280 avis)</span>
          </div>
        </div>

        <div className="">
          <DisplayPrice
            currency={product.currency}
            price={product.price ?? 0}
            barred_price={product.barred_price}
          />
        </div>

        <div className="mt-auto">
          <CartButton
            text="Ajouter au panier"
            product={product}
            stock={group_features?.[0]?.stock ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
