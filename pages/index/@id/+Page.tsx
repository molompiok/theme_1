import { DisplayPriceDetail } from "../../../component/DisplayPrice";

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useMemo, useState } from "react";
import ColorComponent from "../../../component/FeatureDetailProduct/ColorComponent";
import TextComponent from "../../../component/FeatureDetailProduct/TextComponent";
import { useproductFeatures } from "../../../store/features";
import ReviewsStars from "../../../component/comment/ReviewsStars";
import { ButtonValidCart } from "../../../component/Button";
import { usePanier } from "../../../store/cart";
import clsx from "clsx";
import { ProductMedia } from "../../../component/ProductMedia";
import { Helmet } from "react-helmet";
import { BASE_URL } from "../../../api";
import { HydrationBoundary, useQuery } from "@tanstack/react-query";
import { Data } from "./+data";
import { useData } from "../../../renderer/useData";
import {
  get_features_with_values,
  get_group_features,
  get_products,
} from "../../../api/products.api";
import Loading from "../../../component/Loading";
import { CommentsProduct } from "../../../S1_data";
import FavoriteButton from "../../../component/FavoriteButton";

export default function Page() {
  const { dehydratedState } = useData<Data>();

  return (
    <>
      <div className="bg-white relative w-full min-h-dvh pt-10 max-w-[1500px] mx-auto font-primary">
        <HydrationBoundary state={dehydratedState}>
          <ProductPageContent />
        </HydrationBoundary>
      </div>
    </>
  );
}

function ProductPageContent() {
  const [indexValue, setIndexValue] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [imgIndex, setImgIndex] = useState<number>(0);

  const handleImageClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
      setImgIndex(index);
    }
  };

  const lstType = useproductFeatures((state) => state.lastType);
  const pfeature = useproductFeatures((state) => state.productFeatures);
  const toggleCart = usePanier((state) => state.toggleCart);
  const addProduct = usePanier((state) => state.add);

  const handleModalcartOpen = () => {
    toggleCart(true);
    document.body.style.overflow = "hidden";
  };

  const { slug } = useData<Data>();

  const {
    data: products,
    isError: isErrorProduct,
    isPending: isPendingProduct,
  } = useQuery({
    queryKey: ["get_products", slug],
    queryFn: () => get_products({ slug }),
  });


  useEffect(() => {
    if (!features || !product?.id || !features.length) return;
    const value = pfeature.get(product.id)?.get(lstType);
    const featureIndex = features.findIndex(
      (feature) => feature.name === lstType
    );
    if (featureIndex === -1) return;
    const valueIndex = features[featureIndex].values.findIndex(
      (v) => v.text === value
    );
    if (!features[featureIndex].values[valueIndex].views.length) return;
    if (valueIndex === -1) return;
    setIndexValue(valueIndex);
  }, [pfeature, lstType]);


  if (isPendingProduct) {
    return <Loading />;
  }

  if (isErrorProduct) {
    return (
      <div>
        <span>
          Erreur : {isErrorProduct || "Impossible de charger les produits"}
        </span>
      </div>
    );
  }

  if (!products?.length) {
    return <div>Aucun produit trouvé pour ce nom.</div>;
  }

  const product = useMemo(() => products?.[0] ?? null, [products]);

  const {
    data: features,
    isPending: isPendingFeature,
    isError: isErrorFeature,
  } = useQuery({
    queryKey: ["get_features_with_values", product?.id],
    queryFn: () => product?.id ? get_features_with_values({ product_id: product?.id }) : Promise.resolve([]),
    enabled: !!product?.id,
  });
  
  const { data: group_features, status: status_group_feature } = useQuery({
    queryKey: ["get_group_features", product?.id],
    queryFn: () => product?.id ? get_group_features({ product_id: product.id }) : Promise.resolve([]),
    enabled: !!product?.id,
  });




  if (isPendingFeature) {
    return <Loading />;
  }

  if (isErrorFeature) {
    return (
      <div>
        <span>
          Erreur : {isErrorFeature || "Impossible de charger les variantes"}
        </span>
      </div>
    );
  }



 
  return (
    <>
     <Helmet>
        <title>{product?.name || "Page Produit"}</title>
        <meta
          name="description"
          content={product?.description || "Description du produit"}
        />
        <meta property="og:title" content={product?.name || "Page Produit"} />
        <meta
          property="og:description"
          content={product?.description || "Description du produit"}
        />
        <meta
          property="og:image"
          content={BASE_URL + features[0].values[0].views[0]}
        />
      </Helmet>
      <div className="flex h-full img-pdetail-breakpoint-2:flex-row flex-col  items-start gap-5 mb-24">
        <div className="img-pdetail-breakpoint-2:hidden flex gap-y-3 flex-col pl-5">
          <div>
            <h1 className="text-clamp-lg pt-4 font-bold">{product.name}</h1>
            <h1 className="font-light">{product.description}</h1>
          </div>
          <DisplayPriceDetail
            currency={product.currency}
            price={product.price}
          />
          <div className="flex items-center gap-1 text-gray-500/70 ">
            <ReviewsStars note={4.6} size={20} style="" />
            <div>(280 aviss)</div>
          </div>
        </div>
        <div className="w-full flex justify-center img-pdetail-breakpoint-2:sticky img-pdetail-breakpoint-2:top-20 items-start  h-full">
          <div className="img-pdetail-breakpoint-2:flex  hidden flex-col justify-start  gap-y-3 overflow-y-auto  items-end max-h-[50dvh] w-full">
            {features
              .find((f) => f.id === product.default_feature_id)
              ?.values[indexValue]?.views.map((v, index) => {
                return (
                  <div
                    key={index}
                    className={clsx("p-1 border-2 mx-1 rounded-md", {
                      "border-gray-800": imgIndex === index,
                      "border-gray-300": imgIndex !== index,
                    })}
                  >
                    <ProductMedia
                      mediaList={[v]}
                      productName={v}
                      onClick={() => handleImageClick(index)}
                      className="img-pdetail-breakpoint-2:size-20 img-pdetail-breakpoint-2:min-w-20 img-pdetail-breakpoint-2:min-h-20 size-16 min-h-16 min-w-16 cursor-pointer"
                    />
                  </div>
                );
              })}
          </div>
          <div className=" w-full md:min-w-lg relative">
          <FavoriteButton product_id={product.id} />
            <Swiper
              modules={[A11y, Pagination]}
              spaceBetween={5}
              lazyPreloadPrevNext={1}
              pagination={{ clickable: true, dynamicBullets: true }}
              slidesPerView={1}
              autoHeight={true}

              mousewheel={true}
              onActiveIndexChange={(sw) => {
                setImgIndex(sw.realIndex);
              }}
              onSwiper={setSwiperInstance}
              className="!w-full !h-full"
            >
              {features
                .find((f) => f.id === product.default_feature_id)
                ?.values[indexValue]?.views.map((v, index) => {
                  return (
                    <SwiperSlide key={index} className=" !w-full">
                      <div className="w-full h-full flex items-center justify-center">
                      <ProductMedia
                      mediaList={[v]}
                      productName={v}
                      onClick={() => handleImageClick(index)}
                      className="object-contain aspect-square"
                    />
                      </div>
                      {/* <div className="swiper-lazy-preloader swiper-lazy-preloader-white" /> */}
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        </div>
        <div className="flex size-full flex-col justify-between items-start img-pdetail-breakpoint-2:pr-0 pr-2">
          <div className="img-pdetail-breakpoint-2:block hidden">
            <h1 className="text-clamp-md pt-4 font-bold">{product.name}</h1>
            <h1 className="text-clamp-xs mb-2">{product.description}</h1>
            <DisplayPriceDetail
              currency={product.currency}
              price={product.price}
            />
            <div className="flex items-center  gap-1 text-cyan-950 ">
              <ReviewsStars note={4.6} size={20} style="" />
              <div>(280 avis)</div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 img-pdetail-breakpoint-2:p-0 pl-4 max-h-[60dvh] overflow-auto">
            {features.map((feature, index) => {
              return (
                <div key={index}>
                  <div className="flex items-center justify-start overflow-x-auto gap-1 scrollbar-thin my-0">
                    {feature.type === "color" && (
                      <ColorComponent
                        values={feature.values}
                        feature_name={feature.name}
                        feature_required={feature.required}
                        productId={product.id}
                        stock={group_features?.[0].stock ?? 0}
                      />
                    )}
                    {feature.type === "text" && (
                      <TextComponent
                        values={feature.values}
                        feature_name={feature.name}
                        feature_required={feature.required}
                        productId={product.id}
                        stock={group_features?.[0].stock ?? 0}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <ButtonValidCart
            features={features}
            product={product}
            onClick={() => {
              handleModalcartOpen();
              addProduct(product, group_features?.[0]?.stock ?? 0);
            }}
          />
        </div>
      </div>
      <div className="w-full mx-auto ">
        <div className="mb-7">
          <div className="flex justify-center flex-col items-center text-clamp-md">
            <div className="text-center">
              <span>Les Avis sur</span>{" "}
              <span className="underline  underline-offset-4">
                {product.name}
              </span>{" "}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-clamp-lg">4.3</span>
              <div className="flex flex-col items-start justify-start">
                <ReviewsStars note={4.6} size={25} style="text-black/85 " />
                <span className="text-clamp-xs px-2 font-light">280 avis</span>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-full ">
          <div className="flex justify-end mb-5 border-b border-b-black/70">
            <button className="flex gap-1 mb-5 ">
              <span className="font-light">Filtrez par</span>
              <span className="cursor-pointer">Avec Media</span>
            </button>
          </div>
          <div className="flex flex-col  gap-6 divide-y px-7">
          {CommentsProduct.map((c, i) => {
            return (
              <div
                key={i}
                className="flex md:flex-row flex-col  items-stretch w-full py-5"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <ReviewsStars
                      note={c.note}
                      size={19}
                      style="text-black/85 "
                    />
                    <h1 className="text-clamp-sm font-bold">{c.title}</h1>
                  </div>
                  <p className="font-light pr-7">{c.description}</p>
                </div>
                <div className="bg-gray-300 img-pdetail-breakpoint-5:min-w-80 w-full p-3 ">
                  <span>{c.user.name}</span>
                  <div className="flex flex-col font-light">
                    <span>{c.product.name}</span>
                    <span>{c.product.feature}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div> 
    </>
  );
}
