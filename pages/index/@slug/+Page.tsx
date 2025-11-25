//pages/index/@slug/+Page.tsx
import { HydrationBoundary, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  get_features_with_values,
  get_products,
} from "../../../api/products.api";
import { ButtonValidCart } from "../../../component/Button";
import ReviewsStars from "../../../component/comment/ReviewsStars";
import { DisplayPriceDetail } from "../../../component/DisplayPrice";
import FavoriteButton from "../../../component/FavoriteButton";
import Loading from "../../../component/Loading";
import { MarkdownViewer } from "../../../component/MarkdownViewer";
import BindTags from "../../../component/product/BindTags";
import { RenderFeatureComponent } from "../../../component/product/RenderFeatureComponent";
import { ProductMedia } from "../../../component/ProductMedia";
import { useMedia } from "../../../hook/useMedia";
import { Feature, ProductClient } from "../../type";
import type { Data } from "./+data";
import { getFirstFeatureWithView } from "../../../utils";
import { Breadcrumb } from "../../../component/product/Breadcrumb";
import { BiShareAlt } from "react-icons/bi";
// import { useData } from "../../../renderer/useData";
import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";
import ProductGallery from "../../../component/product/ProductGallery";

const LazyDetailsSection = lazy(() =>
  import("./sections/DetailsSection").then((module) => ({ default: module.DetailsSection }))
);
const LazyFAQSection = lazy(() =>
  import("./sections/FAQSection").then((module) => ({ default: module.FAQSection }))
);
const LazyReviewsSection = lazy(() =>
  import("./sections/ReviewsSection").then((module) => ({ default: module.ReviewsSection }))
);
const LazySimilarProductsSection = lazy(() =>
  import("../../../component/SimilarProductsSection").then((module) => ({
    default: module.SimilarProductsSection,
  }))
);

export default function Page() {
  const { dehydratedState, product, is404 } = useData<Data>();
  const { baseUrl } = usePageContext()

  console.log({ baseUrl });


  if (is404 || !product) {
    return (
      <div className="bg-white min-h-dvh flex items-center justify-center">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <p>Désolé, le produit que vous recherchez n'est plus disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-dvh pt-10  mx-auto font-sans antialiased">
      <HydrationBoundary state={dehydratedState}>
        <ProductPageContent initialProduct={product} />
      </HydrationBoundary>
    </div>
  );
}

function ProductPageContent({
  initialProduct,
}: {
  initialProduct: NonNullable<Data["product"]>;
}) {
  const [imgIndex, setImgIndex] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const { api } = usePageContext()
  const { slug } = useData<Data>();
  const {
    data: products,
    isPending,
    error,
  } = useQuery({
    queryKey: ["get_product_by_slug", slug],
    queryFn: () => get_products({ slug_product: slug }, api),
    select(data) {
      return data;
    },
    initialData: {
      list: [initialProduct],
      // @ts-ignore
      meta: { page: 1, limit: 10, total: 1, current_page: 1, last_page: 1 },
      category: undefined,
    },
  });

  const product = useMemo(() => products?.list?.[0] ?? null, [products]);
  const { data: features, isPending: isPendingFeatures } = useQuery({
    queryKey: ["get_features_with_values", product?.id],
    queryFn: () => get_features_with_values({ product_id: product?.id }, api),
    enabled: !!product?.id,
  });

  const handleImageClick = (index: number) => {
    swiperInstance?.slideTo(index);
    setImgIndex(index);
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600" role="alert">
        Une erreur est survenue : {error.message}
      </div>
    );
  }

  return (
    <>
      <main className=" font-primary mx-auto flex flex-col min-h-screen">
        <section className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 ">
          <div className="md:sticky md:top-14 md:self-center pt-5 md:ml-5 px-4">
            <InfoProduct product={product} className="md:hidden block" />
            <ProductGallery
              features={features}
              product={product}
              imgIndex={imgIndex}
              setImgIndex={setImgIndex}
              setSwiperInstance={setSwiperInstance}
              isPendingFeatures={isPendingFeatures}
              handleImageClick={handleImageClick}
            />
            <div className="mt-4 md:hidden block">
              <DisplayPriceDetail
                product_id={product.id}
                currency={product.currency}
                price={product.price}
                barred_price={product.barred_price}
              />
            </div>
          </div>
          <div className="h-auto md:pr-4 px-4">
            <ProductDetails product={product} features={features} />
          </div>
        </section>
        <Suspense fallback={<SectionSkeleton title="Détails techniques" />}>
          <LazyDetailsSection productId={product.id} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton title="Produits similaires" />}>
          <LazySimilarProductsSection productSlug={product.slug} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton title="Questions fréquentes" />}>
          <LazyFAQSection productId={product.id} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton title="Avis clients" />}>
          <LazyReviewsSection product={product} />
        </Suspense>
      </main>
    </>
  );
}

function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="py-8 border-t">
      <div className="container mx-auto px-4 max-w-6xl text-center space-y-3">
        <div className="h-6 w-48 mx-auto bg-gray-100 rounded-full animate-pulse" />
        <p className="text-sm text-gray-500">Chargement de {title}...</p>
      </div>
    </section>
  );
}

// interface ProductGalleryProps {
//   features: Feature[] | undefined;
//   product: ProductClient;
//   imgIndex: number;
//   setSwiperInstance: (instance: any) => void;
//   handleImageClick: (index: number) => void;
//   isPendingFeatures: boolean;
//   setImgIndex: React.Dispatch<React.SetStateAction<number>>;
// }

// function ProductGallery({
//   features,
//   product,
//   imgIndex,
//   setSwiperInstance,
//   handleImageClick,
//   setImgIndex,
//   isPendingFeatures
// }: ProductGalleryProps) {
//   const mediaViews = useMedia(features);

//   return (
//     <div className="flex gap-2">
//       <div className=" min-[600px]:flex hidden flex-col gap-2 overflow-x-auto pb-2 scrollbar-thin">
//         {mediaViews?.map((view, index) => (
//           <button
//             key={index}
//             className={clsx("p-1 border-2 rounded-md flex-shrink-0", {
//               "border-gray-800": imgIndex === index,
//               "border-gray-200": imgIndex !== index,
//             })}
//             onClick={() => handleImageClick(index)}
//           >
//             <ProductMedia
//               mediaList={[view]}
//               productName={product.name}
//               shouldHoverVideo={false}
//               className="size-11 md:size-14 object-cover"
//             />
//           </button>
//         ))}
//       </div>
//       <div className="min-[600px]:size-[80%] size-full relative">
//         <FavoriteButton product_id={product.id} className="absolute top-3 right-4" size={32} />
//         <Swiper
//           modules={[A11y, Pagination]}
//           spaceBetween={10}
//           slidesPerView={1}
//           pagination={{ clickable: true, dynamicBullets: true }}
//           onSwiper={setSwiperInstance}
//           onSlideChange={(swiper) => setImgIndex(swiper.realIndex)}
//           className="rounded-lg overflow-hidden"
//         >
//           {mediaViews.map((view, index) => (
//             <SwiperSlide key={index}>
//               <ProductMedia
//                 mediaList={[...new Set([view, ...mediaViews])]}
//                 showFullscreen={true}
//                 shouldHoverVideo={false}
//                 productName={product.name}
//                 className="w-full aspect-square object-contain"
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// }

interface ProductDetailsProps {
  product: ProductClient;
  features: Feature[] | undefined;
}

function ProductDetails({ product, features }: ProductDetailsProps) {
  // Filtrer les features : ne pas afficher la feature par défaut si elle n'a qu'une seule variante
  const filteredFeatures = features?.filter((feature) => {
    // Si c'est la feature par défaut avec une seule variante, ne pas l'afficher
    if (feature.is_default === true && feature.values.length === 1) {
      return false;
    }
    return true;
  });

  return (
    <div className="">
      <InfoProduct product={product} className="md:block hidden " />
      <div className="space-y-3 max-h-[50dvh] mt-7 overflow-y-auto scrollbar-thin">
        {filteredFeatures?.map((feature) => (
          <div key={feature.id || feature.name} className="space-y-0">
            <RenderFeatureComponent
              features={features}
              feature={feature}
              product_id={product.id}
            />
          </div>
        ))}
      </div>
      <ButtonValidCart features={features} product={product} />
    </div>
  );
}
interface InfoProductProps {
  product: ProductClient;
  className?: string;
}
function InfoProduct({ product, className }: InfoProductProps) {
  const { categories_id, name, description, rating } = product;

  const handleShare = () => {
    if (navigator.share && product) {
      navigator
        .share({
          title: product.name,
          text: `Découvrez ${product.name}`,
          url: window.location.href + product.slug,
        })
        .catch(console.error);
    } else {
      alert("Share functionality not available or product not loaded.");
    }
  };

  return (
    <div className={clsx(className, "space-y-4")}>
      <Breadcrumb categoryId={categories_id[0]} />
      <div className="space-y-2">
        <div className="flex items-center justify-start gap-7">
          <h1 className="text-2xl md:text-3xl font-bold md:mb-1">{name}</h1>
          <BiShareAlt
            onClick={handleShare}
            aria-label="Partager le produit"
            role="button"
            size={25}
            className="text-gray-700 p-1 text-2xl  cursor-pointer rounded-full hover:bg-gray-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <ReviewsStars note={rating} size={20} style="text-orange-500" />
          <span className="text-sm text-gray-600">
            ({product.comment_count} avis)
          </span>
        </div>
        <div className="max-h-[50dvh] py-4 px-2 overflow-y-auto scrollbar-thin">
          <MarkdownViewer markdown={description} />
        </div>
        <DisplayPriceDetail
          currency={product.currency}
          price={product.price}
          product_id={product.id}
          barred_price={product.barred_price}
          className="md:block hidden"
        />
      </div>
    </div>
  );
}

