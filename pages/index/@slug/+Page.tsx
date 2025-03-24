import { DisplayPriceDetail } from "../../../component/DisplayPrice";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useMemo, useRef, useState } from "react";
import { ColorComponent } from "../../../component/FeatureDetailProduct/ColorComponent";
import { TextComponent } from "../../../component/FeatureDetailProduct/TextComponent";
import { useproductFeatures } from "../../../store/features";
import ReviewsStars from "../../../component/comment/ReviewsStars";
import { ButtonValidCart } from "../../../component/Button";
import { useModalCart } from "../../../store/cart";
import clsx from "clsx";
import { ProductMedia } from "../../../component/ProductMedia";
import { Helmet } from "react-helmet";
import { BASE_URL } from "../../../api";
import { HydrationBoundary, useQuery } from "@tanstack/react-query";
import { useData } from "../../../renderer/useData";
import {
  get_features_with_values,
  get_products,
} from "../../../api/products.api";
import Loading from "../../../component/Loading";
import { CommentsProduct } from "../../../S1_data";
import FavoriteButton from "../../../component/FavoriteButton";
import type { Data } from "./+data";
import { Feature, ProductClient } from "../../type";
import gsap from "gsap";
import { RenderFeatureComponent } from "../../../component/product/RenderFeatureComponent";
import { getFirstFeatureWithView } from "../../../utils";

export default function Page() {
  const { dehydratedState } = useData<Data>();

  return (
    <div className="bg-white min-h-dvh pt-10 max-w-[1500px] mx-auto font-sans antialiased">
      <Helmet>
        <title>Page Produit</title>
        <meta name="robots" content="index, follow" />
      </Helmet>
      <HydrationBoundary state={dehydratedState}>
        <ProductPageContent />
      </HydrationBoundary>
    </div>
  );
}

function ProductPageContent() {
  const [imgIndex, setImgIndex] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const { slug } = useData<Data>();
  const {
    data: products,
    isPending,
    error,
  } = useQuery({
    queryKey: ["get_products", slug],
    queryFn: () => get_products({ slug_product: slug }),
    select(data) {
      return data.list;
    },
  });

  const product = useMemo(() => products?.[0] ?? null, [products]);

  const { data: features, isPending: isPendingFeatures } = useQuery({
    queryKey: ["get_features_with_values", product?.id],
    queryFn: () => get_features_with_values({ product_id: product?.id }),
    enabled: !!product?.id,
  });
  console.log("🚀 ~ ProductPageContent ~ features:", features);

  const handleImageClick = (index: number) => {
    swiperInstance?.slideTo(index);
    setImgIndex(index);
  };

  if (isPending || isPendingFeatures) {
    return (
      <div
        className="flex items-center justify-center min-h-[50vh]"
        aria-live="polite"
      >
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

  if (!product) {
    return <div className="text-center py-20">Aucun produit trouvé</div>;
  }

  return (
    <>
      <Helmet>
        <title>{product.name}</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta
          property="og:image"
          content={BASE_URL + features?.[0]?.values[0]?.views[0]}
        />
      </Helmet>
      <main className="container font-primary mx-auto px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-12">
          <ProductGallery
            features={features}
            product={product}
            imgIndex={imgIndex}
            setImgIndex={setImgIndex}
            setSwiperInstance={setSwiperInstance}
            handleImageClick={handleImageClick}
          />
          <ProductDetails product={product} features={features} />
        </section>
        <FAQSection expandedFAQ={expandedFAQ} setExpandedFAQ={setExpandedFAQ} />
        <ReviewsSection product={product} />
      </main>
    </>
  );
}

interface ProductGalleryProps {
  features: Feature[] | undefined;
  product: ProductClient;
  imgIndex: number;
  setSwiperInstance: (instance: any) => void;
  handleImageClick: (index: number) => void;
  setImgIndex: React.Dispatch<React.SetStateAction<number>>;
}

function ProductGallery({
  features,
  product,
  imgIndex,
  setSwiperInstance,
  handleImageClick,
  setImgIndex,
}: ProductGalleryProps) {
  const selectedFeatures = useproductFeatures(
    (state) => state.selectedFeatures
  );

  const mediaViews = useMemo(() => {
    if (!features || !features.length) return ["/img/default_img.gif"];

    const defualt_feature = getFirstFeatureWithView(features);

    if (!defualt_feature) return ["/img/default_img.gif"];

    const selectedValue = selectedFeatures.get(defualt_feature.name);
    const value =
      defualt_feature.values.find((v) => v.text === selectedValue) ||
      defualt_feature.values[0];
    return value?.views.length ? value.views : [""];
  }, [features, selectedFeatures, product]);

  return (
    <div className="relative flex gap-2">
      <div className=" min-[600px]:flex hidden flex-col gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {mediaViews.map((view, index) => (
          <button
            key={index}
            className={clsx("p-1 border-2 rounded-md flex-shrink-0", {
              "border-gray-800": imgIndex === index,
              "border-gray-200": imgIndex !== index,
            })}
            onClick={() => handleImageClick(index)}
          >
            <ProductMedia
              mediaList={[view]}
              productName={product.name}
              className="size-11 md:size-14 object-cover"
            />
          </button>
        ))}
      </div>
      <div className=" min-[600px]:size-[80%] size-full relative">
        <FavoriteButton product_id={product.id} />
        <Swiper
          modules={[A11y, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setImgIndex(swiper.realIndex)}
          className="rounded-lg overflow-hidden"
        >
          {mediaViews.map((view, index) => (
            <SwiperSlide key={index}>
              <ProductMedia
                mediaList={[view]}
                productName={product.name}
                className="w-full aspect-square object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

interface ProductDetailsProps {
  product: ProductClient;
  features: Feature[] | undefined;
}

function ProductDetails({ product, features }: ProductDetailsProps) {
  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600 text-base/5 mt-2">{product.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <ReviewsStars note={4.6} size={20} style="text-orange-500" />
        <span className="text-sm text-gray-600">(280 avis)</span>
      </div>
      <DisplayPriceDetail currency={product.currency} price={product.price} />
      <div className="space-y-3 max-h-[50dvh] overflow-y-auto scrollbar-thin">
        {features?.map((feature) => (
          <div key={feature.id || feature.name} className="space-y-0">
            <RenderFeatureComponent feature={feature} product_id={product.id} />
          </div>
        ))}
      </div>
      <ButtonValidCart features={features} product={product} />
    </div>
  );
}

function ReviewsSection({ product }: { product: ProductClient }) {
  return (
    <section className="py-12 border-t">
      <h2 className="text-4xl font-semibold text-center mb-6">
        Avis sur{" "}
        <span className="underline underline-offset-4">{product.name}</span>
      </h2>
      <div className="flex justify-center items-center gap-4 mb-8">
        <span className="text-3xl font-bold">4.3</span>
        <div>
          <ReviewsStars note={4.6} size={24} style="text-orange-500" />
          <span className="text-sm text-gray-600">280 avis</span>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <button className="text-sm text-gray-600 hover:text-gray-800">
          Filtrer par: Avec Media
        </button>
      </div>
      <div className="space-y-6 divide-y">
        {CommentsProduct.map((comment, index) => (
          <article
            key={index}
            className="pt-6 grid md:grid-cols-[2fr_1fr] gap-6"
          >
            <div className="space-y-2">
              <ReviewsStars
                note={comment.note}
                size={18}
                style="text-orange-500"
              />
              <h3 className="font-semibold">{comment.title}</h3>
              <p className="text-gray-600">{comment.description}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <span className="font-medium">{comment.user.name}</span>
              <div className="text-sm text-gray-600 mt-1">
                <p>{comment.product.name}</p>
                <p>{comment.product.feature}</p>
              </div>
            </div>
          </article>
        ))}
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
      answer:
        "Oui, vous avez 30 jours pour retourner un produit non utilisé dans son emballage d'origine.",
    },
    {
      question: "Les produits sont-ils garantis ?",
      answer:
        "Oui, tous nos produits bénéficient d'une garantie de 1 an contre les défauts de fabrication.",
    },
  ];

  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    faqRefs.current.forEach((el, index) => {
      if (!el) return;
      const isExpanded = expandedFAQ === index;
      gsap.to(el, {
        height: isExpanded ? "auto" : 0,
        opacity: isExpanded ? 1 : 0,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  }, [expandedFAQ]);

  const handleToggle = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <section className="py-12 border-t">
      <div className="container mx-auto">
        <h2 className="min-[400px]:text-3xl text-xl font-bold text-center mb-5 text-gray-800">
          Questions Fréquentes
        </h2>
        <div className="space-y-0 divide-y-1 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-2xl bg-white overflow-hidden">
              <button
                className={clsx(
                  "w-full text-left p-2 flex justify-between items-center transition-colors",
                  {
                    "bg-gray-200": expandedFAQ === index,
                    "hover:bg-gray-100": expandedFAQ !== index,
                  }
                )}
                onClick={() => handleToggle(index)}
                aria-expanded={expandedFAQ === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="min-[470px]:text-[1.07rem] text-sm font-semibold text-gray-600 pr-4">
                  {faq.question}
                </span>
                <span
                  className={clsx(
                    "text-4xl font-light text-black/60 transition-transform duration-300",
                    {
                      "rotate-45": expandedFAQ === index,
                    }
                  )}
                >
                  +
                </span>
              </button>
              <div
                ref={(el) => {
                  faqRefs.current[index] = el;
                }}
                id={`faq-answer-${index}`}
                className="text-gray-600 overflow-hidden"
                style={{ height: 0, opacity: 0 }}
              >
                <p className="min-[470px]:text-lg text-base/5 pt-1 pb-4 pl-4">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
