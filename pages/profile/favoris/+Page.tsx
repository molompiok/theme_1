import { HydrationBoundary, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { BsHeartFill } from "react-icons/bs";
import {
  get_favorites,
  get_features_with_values,
} from "../../../api/products.api";
import { DisplayPrice } from "../../../component/DisplayPrice";
import FavoriteButton from "../../../component/FavoriteButton";
import FilterPopover from "../../../component/FilterPopover";
import Loading from "../../../component/Loading";
import { ProductMedia } from "../../../component/ProductMedia";
import Skeleton from "../../../component/Skeleton";
import { useFiltersAndUrlSync } from "../../../hook/useUrlFilterManager";
import { useData } from "../../../renderer/useData";
import { usePageContext } from "../../../renderer/usePageContext";
import { useSelectedFiltersStore } from "../../../store/filter";
import { defaultOptions, filterOptions, OrderByType, ProductFavorite } from "../../type";
import { Data } from "./+data";

export default function Page() {
  const { dehydratedState } = useData<Data>();
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { setSelectedFilters, selectedFilters , setFilter } = useSelectedFiltersStore();
  useFiltersAndUrlSync([], urlPathname, setSelectedFilters, selectedFilters);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container mx-auto min-h-dvh bg-white py-6 px-4 font-primary">
      <div
        className={`sticky inset-x-0 bg-white border-gray-200 transition-all w-full duration-300 py-5
           ${isScrolled ? 'border-b mt-0 top-11 sm:top-15 z-40' : 'top-0 mt-7 z-40'
          }`}
        style={{
          paddingLeft: isScrolled ? '1rem' : '0',
          paddingRight: isScrolled ? '1rem' : '0',
        }}
      >

        <div className="max-w-5xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-0">
              <BsHeartFill className="text-2xl sm:text-4xl text-red-500 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Mes Favoris</h1>
            </div>
            <FilterPopover
              setFilter={setFilter}
              selectedFilters={selectedFilters}
              defaultOptions={[...defaultOptions]}
            />
          </div>
        </div>
        <HydrationBoundary  state={dehydratedState}>
        <div className="max-w-5xl mx-auto">
          <ProductList />
        </div>
        </HydrationBoundary>
      </div>
    </div>
  );
}

const ProductList = () => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const pageContext = usePageContext();
  const { selectedFilters } = useSelectedFiltersStore();

  const filterNameToId = useMemo(() => {
    return filterOptions.reduce((acc, filter) => {
      acc[filter.name.toLowerCase()] = filter.id;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  const orderText = selectedFilters?.order_by?.[0]?.text || 'date_desc';
  const order = (filterNameToId[orderText.toLowerCase()] as OrderByType) || 'date_desc';
  const { order_by, ...restFilters } = selectedFilters;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['get_favorites_infinite', order],
    queryFn: ({ pageParam = 1 }) => get_favorites({ limit: 12, page: pageParam, order_by: order }), 
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.meta.current_page;
      const lastPageNum = lastPage.meta.last_page;
      return currentPage < lastPageNum ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allFavorites = data?.pages.flatMap(page => page.list) || [];

  if (status === 'pending') {
    return (
      <div className="flex justify-center items-center min-h-[50vh]" aria-live="polite">
        <Skeleton type="product-list" count={8} />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-600 text-lg">Une erreur est survenue</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {allFavorites.map((favorite) => (
          <ProductCard key={favorite.id} favorite={favorite} />
        ))}
      </div>

      {!allFavorites.length ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600 text-lg">Aucun favori pour le moment</p>
        </div>
      ) : (
        <div ref={observerTarget} className="py-4 flex justify-center min-h-[50px]">
          {isFetchingNextPage ? (
            <Loading size="medium" className="my-16" />
          ) : hasNextPage ? (
            <span className="text-gray-500">Faites défiler pour charger plus...</span>
          ) : (
            <p className="text-gray-500 text-sm">Tous les favoris ont été chargés</p>
          )}
        </div>
      )}
    </div>
  );
};

function ProductCard({ favorite }: { favorite: ProductFavorite }) {
  const { data: feature, status } = useQuery({
    queryKey: ["get_features_with_values", favorite.default_feature_id],
    queryFn: () =>
      get_features_with_values({ feature_id: favorite.default_feature_id }),
    enabled: !!favorite.default_feature_id,
  });

  const mediaList = feature?.[0]?.values[0].views || [];

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 w-full">
      <div className="relative aspect-square">
        <FavoriteButton
          product_id={favorite.product_id}
        />
        {status === "pending" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loading />
          </div>
        ) : (
          <ProductMedia
            mediaList={mediaList}
            productName={favorite.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className="p-2 sm:p-3">
        <h1 className="text-base/5 sm:text-lg/5 font-semibold text-gray-800 line-clamp-2 mb-1 sm:mb-2 hover:text-blue-600 transition-colors">
          {favorite.name}
        </h1>
        <p className="text-xs/5 sm:text-sm/5 text-gray-600 line-clamp-2 mb-2 sm:mb-3">
          {favorite.description}
        </p>
        <div className="flex items-center justify-between">
          <DisplayPrice
            currency={favorite.currency}
            price={favorite.price ?? 0}
            barred_price={favorite.barred_price ?? undefined}
          />
          <div className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
}