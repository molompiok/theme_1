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
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../../api";
import { formatSlug } from "../../utils";
import ReviewsStars from "../../component/comment/ReviewsStars";

export { Page };

function Page() {
  const { dehydratedState } = useData<Data>();
  return (
    <div>
      <div className="px-3 list-product-breakpoint-6:px-0 list-product-breakpoint-4:px-5 py-2 min-h-dvh bg-gray-50 font-primary ">
        <div className="relative grid list-product-breakpoint-2:grid-cols-[300px_1fr] grid-cols-1 gap-4 list-product-breakpoint-5:mx-1.5 mx-0 list-product-breakpoint-1:mx-20 mt-14">
          <div className="border-2 border-amber-500 min-h-[70dvh] sticky top-24 list-product-breakpoint-2:block hidden">
            <h1>Filtres</h1>
          </div>
          <div className="">
            <div className="justify-between my-4 list-product-breakpoint-2:hidden flex">
              <span className="">Filtres</span>
              <button
                onClick={() => {}}
                className="flex items-center border rounded-3xl gap-1.5 px-3"
              >
                <span className="">Filtres</span>
                <CiSliderHorizontal size={28} color="black" />
              </button>
            </div>
            <HydrationBoundary state={dehydratedState}>
              <ListProductCard />
            </HydrationBoundary>
          </div>
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
    <Loading />;
  }
  if (!products || products.length === 0) {
    return (
      <p className="flex size-full text-clamp-md justify-center mt-20">
        Aucun produits
      </p>
    );
  }

  return (
    <div className="grid list-product-breakpoint-3:grid-cols-3  list-product-breakpoint-3:gap-3 list-product-breakpoint-6:grid-cols-2 grid-cols-1 gap-2">
      {products.map((product, index) => {
        return <ProductCard key={product.id} product={product} />;
      })}
    </div>
  );
}

function ProductCard({ product }: { product: ProductClient }) {
  const handleGo = () => {
    navigate(`/${product.slug}`);
  };
  const { data: feature, status } = useQuery({
    queryKey: ["get_features_with_values", product.default_feature_id],
    queryFn: () =>
      get_features_with_values({ feature_id: product.default_feature_id }),
  });
  const { data: group_features, status: status_group_feature } = useQuery({
    queryKey: ["get_group_features", product?.id],
    queryFn: () => get_group_features({ product_id: product?.id }),
    enabled: !!product?.id,
  });

  const mediaList = (
    feature?.[0]?.values.length ?? 0 > 0 ? feature?.[0]?.values[0].views : []
  )!;

  return (
    <div
      onClick={handleGo}
      className="flex flex-col p-0.5 items-end  rounded-lg justify-baseline relative overflow-hidden font-primary"
    >
      <FavoriteButton product_id={product.id} />
      {status === "pending" ? (
        <Loading />
      ) : (
        <ProductMedia
          mediaList={mediaList}
          productName={product.name}
          className="w-full rounded-sm pb-1 aspect-square object-cover cursor-pointer transition-all duration-500 ease-in-out"
        />
      )}
      <div className="pl-1 size-full items-stretch h-full justify-between flex-col flex">
        <DisplayPrice
          currency={product.currency}
          price={product.price ?? 0}
          barred_price={product.barred_price ?? undefined}
        />
        <div className="font-secondary flex flex-col items-start max-w-[99%]">
          <h1 className="text-clamp-base/6 line-clamp-2 pt-1 overflow-hidden text-ellipsis">
            {product.name}
          </h1>
          <div className="flex justify-center gap-0.5 pb-2 items-center">
            <ReviewsStars note={4.6} size={14} style="text-orange-500" />
            <span className="text-xs">(280 avis)</span>
          </div>
        </div>
        <CartButton
          text="Ajouter au panier"
          product={product}
          stock={group_features?.[0].stock ?? 0}
        />
      </div>
    </div>
  );
}
