//pages/index/@slug/+Page.tsx
import {
  HydrationBoundary,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { A11y, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { get_comments } from "../../../api/comment.api";
import {
  get_details,
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
import { BiChevronDown, BiShareAlt } from "react-icons/bi";
import { SimilarProductsSection } from "../../../component/SimilarProductsSection";
// import { useData } from "../../../renderer/useData";
import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";
import ProductGallery from "../../../component/product/ProductGallery";

export default function Page() {
  const { dehydratedState, product, is404 } = useData<Data>();
  const { api, baseUrl } = usePageContext()

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
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
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
        <DetailsSection product_id={product.id} />
        <SimilarProductsSection productSlug={product.slug} />
        <FAQSection expandedFAQ={expandedFAQ} setExpandedFAQ={setExpandedFAQ} />
        <ReviewsSection product={product} />
      </main>
    </>
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
  return (
    <div className="">
      <InfoProduct product={product} className="md:block hidden " />
      <div className="space-y-3 max-h-[50dvh] mt-7 overflow-y-auto scrollbar-thin">
        {features?.map((feature) => (
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

function ReviewsSection({ product }: { product: ProductClient }) {
  const [filterMedia, setFilterMedia] = useState(false);
  const [expandedComment, setExpandedComment] = useState<number | null>(null);
  const { api } = usePageContext()

  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["comments", product.id],
    queryFn: ({ pageParam = 1 }) =>
      get_comments({
        product_id: product.id,
        page: pageParam,
        limit: 2,
        with_users: true,
      }, api),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.meta?.current_page;
      const lastPageNum = lastPage?.meta?.last_page;
      return currentPage && lastPageNum && currentPage < lastPageNum
        ? currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    select: (data) => ({
      list: data.pages.flatMap((page) => page?.list || []),
      meta: data.pages[0]?.meta,
    }),
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  const comments = useMemo(() => data?.list || [], [data?.list]);

  const filteredComments = useMemo(
    () =>
      filterMedia
        ? comments.filter((comment) => comment.views?.length > 0)
        : comments,
    [comments, filterMedia]
  );

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  const toggleExpandedComment = useCallback((index: number) => {
    setExpandedComment((prev) => (prev === index ? null : index));
  }, []);

  if (isLoading) {
    return (
      <section className="py-8 md:py-12 border-t">
        <div className="container mx-auto px-4 max-w-6xl text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-500 border-r-transparent" />
          <p className="mt-2 text-gray-600">Chargement des avis...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-8 md:py-12 border-t">
        <div className="container mx-auto px-4 max-w-6xl text-center py-12 text-red-500">
          Une erreur s'est produite :{" "}
          {error instanceof Error ? error.message : "Erreur inconnue"}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 border-t">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center mb-4 md:mb-6">
          Avis sur{" "}
          <span className="underline underline-offset-4 text-orange-500 decoration-orange-300">
            {product.name}
          </span>
        </h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 md:mb-8">
          <div className="flex items-baseline">
            <span className="text-2xl md:text-3xl font-bold">
              {product.rating}
            </span>
            <span className="text-sm text-gray-700 ml-1">/5</span>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <ReviewsStars
              note={Number(product.rating)}
              size={25}
              style="text-orange-500"
            />
            <span className="text-sm text-gray-600">
              {data?.meta?.total || 0} avis vérifiés
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 text-sm rounded-full transition-colors ${!filterMedia
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              onClick={() => setFilterMedia(false)}
            >
              Tous
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full transition-colors ${filterMedia
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              onClick={() => setFilterMedia(true)}
            >
              Avec média
            </button>
          </div>
          <span className="text-sm text-gray-600">
            {filteredComments.length} avis
          </span>
        </div>

        <div className="space-y-6 divide-y-2 divide-gray-100">
          {filteredComments.length > 0 ? (
            filteredComments.map((comment, index) => (
              <article
                key={`${comment.id}-${index}`}
                className="pt-7 pb-2 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 md:gap-6"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <ReviewsStars
                      note={comment.rating}
                      size={22}
                      style="text-orange-500"
                    />
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{comment.title}</h3>
                  <div>
                    {comment?.description?.length > 150 &&
                      expandedComment !== index ? (
                      <>
                        <p className="text-gray-600">
                          {comment.description.substring(0, 150)}...
                        </p>
                        <button
                          className="text-gray-900 text-sm font-bold mt-1 hover:underline"
                          onClick={() => toggleExpandedComment(index)}
                        >
                          Voir plus
                        </button>
                      </>
                    ) : (
                      <p className="text-gray-600 whitespace-pre-line">
                        {comment.description}
                      </p>
                    )}
                    {expandedComment === index &&
                      comment.description.length > 150 && (
                        <button
                          className="text-gray-900 text-sm font-bold mt-1 hover:underline"
                          onClick={() => toggleExpandedComment(index)}
                        >
                          Voir moins
                        </button>
                      )}
                  </div>
                  {comment.views?.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                      {comment.views.map((viewUrl, idx) => (
                        <div
                          key={idx}
                          className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden"
                        >
                          <ProductMedia
                            mediaList={[
                              ...new Set([viewUrl, ...(comment?.views || [])]),
                            ]}
                            productName={product.name}
                            showFullscreen={true}
                            shouldHoverVideo={false}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                      {comment.user?.full_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="font-medium">
                      {comment.user?.full_name?.substring(0, 8) || "Inconnu"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1 text-green-600 mb-1">
                      <svg
                        className="size-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.471-1.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs">Achat vérifié</span>
                    </div>
                    <BindTags tags={comment.bind_name || {}} />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              {filterMedia
                ? "Aucun avis avec média n'a été trouvé."
                : "Aucun avis n'a été trouvé."}
            </div>
          )}
          <div className="flex justify-center mt-8">
            {isFetchingNextPage ? (
              <div className="my-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-500 border-r-transparent" />
            ) : hasNextPage ? (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-black/10 transition-all duration-500 disabled:opacity-50"
              >
                Charger plus de commentaires
              </button>
            ) : comments.length > 0 ? (
              <p className="text-gray-500 text-sm">
                Tous les commentaires ont été chargés
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

type FAQSectionProps = {
  expandedFAQ: number | null;
  setExpandedFAQ: (index: number | null) => void;
};

function FAQSection({ expandedFAQ, setExpandedFAQ }: FAQSectionProps) {
  const faqs = [
    {
      question: "Combien de temps prend la livraison ?",
      answer: "La livraison prend généralement entre 3 et 5 jours ouvrables.",
    },
    {
      question: "Puis-je retourner un produit ?",
      answer: "Oui, vous avez 30 jours pour retourner un produit non utilisé.",
    },
    {
      question: "Les produits sont-ils garantis ?",
      answer: "Oui, garantie de 1 an contre les défauts de fabrication.",
    },
  ];

  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Simulation de l'animation GSAP avec CSS transitions
    faqRefs.current.forEach((el, index) => {
      if (!el) return;
      const isExpanded = expandedFAQ === index;
      if (isExpanded) {
        el.style.height = el.scrollHeight + "px";
        el.style.opacity = "1";
      } else {
        el.style.height = "0px";
        el.style.opacity = "0";
      }
    });
  }, [expandedFAQ]);

  const handleToggle = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <section className="w-full bg-white">
      <div className="w-full">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-black tracking-tight">
          Questions fréquentes
        </h2>

        <div className="w-full space-y-0">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="w-full border-b border-gray-200 last:border-b-0"
            >
              <button
                className="w-full py-6 px-4 text-left flex justify-between items-center group focus:outline-none transition-colors duration-200 hover:bg-gray-50"
                onClick={() => handleToggle(index)}
                aria-expanded={expandedFAQ === index}
              >
                <span className="text-lg md:text-xl font-medium text-black pr-4 leading-tight">
                  {faq.question}
                </span>
                <BiChevronDown
                  className={`w-5 h-5 text-black transition-transform duration-300 flex-shrink-0 ${expandedFAQ === index ? "rotate-180" : ""
                    }`}
                />
              </button>
              <div
                //@ts-ignore
                ref={(el) => (faqRefs.current[index] = el!)}
                className="w-full overflow-hidden transition-all duration-300 ease-out"
                style={{
                  height: "0px",
                  opacity: "0",
                }}
              >
                <div className="pb-6 px-4 pr-9">
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailsSection({ product_id }: { product_id: string }) {
  const { api } = usePageContext()
  const {
    data: details,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["details", product_id],
    queryFn: () => get_details({ product_id }, api),
    select: (data) => data?.list,
  });

  if (isLoading)
    return (
      <div className="p-4 text-center text-gray-600">
        Chargement des détails...
      </div>
    );
  if (error) return null;
  if (!details || details.length === 0) return null;

  const sortedDetails = details.sort((a, b) => b.index - a.index);
  const lastIndex = sortedDetails.length - 1;
  const isEvenCount = sortedDetails.length % 2 === 0;

  return (
    <section className="container mx-auto mt-4 space-y-2">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
        Détails techniques
      </h2>
      <div
        className={clsx("grid gap-4 grid-cols-1", {
          "md:grid-cols-1": sortedDetails.length === 1,
          "md:grid-cols-2": sortedDetails.length >= 2,
        })}
      >
        {sortedDetails.map((detail, index) => {
          const isLast = index === lastIndex;
          const shouldTakeFullWidth = !isEvenCount && isLast;

          return (
            <div
              key={detail.id}
              className={clsx("rounded-lg p-4 bg-white", {
                "md:col-span-2": shouldTakeFullWidth,
                "md:col-span-1": !shouldTakeFullWidth,
              })}
            >
              {shouldTakeFullWidth ? (
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base sm:text-lg font-medium text-gray-950">
                        {detail.title || "Détail produit"}sd
                      </h3>
                    </div>
                    {detail.description && (
                      <div className="text-sm sm:text-base text-gray-600">
                        <MarkdownViewer markdown={detail.description} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 mt-3 md:mt-0">
                    <ul className="space-y-2">
                      {detail?.view?.map((view, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <ProductMedia
                            mediaList={[
                              ...new Set([view, ...(detail?.view || [])]),
                            ]}
                            productName="détails technique"
                            showFullscreen={true}
                            shouldHoverVideo={false}
                            className="w-full h-auto object-cover rounded-md"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start ">
                    <h3 className="text-base sm:text-lg font-medium text-gray-950">
                      {detail.title || "Détail produit"}
                    </h3>
                  </div>
                  {detail.description && (
                    <div className="text-sm sm:text-base text-gray-600">
                      <MarkdownViewer markdown={detail.description} />
                    </div>
                  )}
                  <div className="mt-3">
                    <ul className="space-y-2">
                      {detail?.view?.map((view, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <ProductMedia
                            mediaList={[
                              ...new Set([view, ...(detail?.view || [])]),
                            ]}
                            productName="détails technique"
                            showFullscreen={true}
                            shouldHoverVideo={false}
                            className="w-full h-auto object-cover rounded-md"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
