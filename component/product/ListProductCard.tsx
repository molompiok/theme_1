import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { Filter, filterOptions, OrderByType, ProductClient, ProductType } from "../../pages/type";
import { usePageContext } from "../../renderer/usePageContext";
import { get_filters, get_products } from "../../api/products.api";
import Skeleton from "../Skeleton";
import { useSelectedFiltersStore } from "../../store/filter";
import { useEffect, useMemo, useRef } from "react";
import Loading from "../Loading";

interface ListProductCardProps {
  slug?: string;
  queryKey: string;
}

function ListProductCard({ slug, queryKey }: ListProductCardProps) {
  const pageContext = usePageContext();
  const categorySlug = slug || pageContext.routeParams?.slug;
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
    queryKey: [queryKey, categorySlug, selectedFilters],
    queryFn: ({ pageParam = 1 }) =>
      get_products({
        slug_cat: categorySlug,
        filters: restFilters,
        order_by: order,
        limit: 4,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.meta?.current_page;
      const lastPageNum = lastPage?.meta?.last_page;
      return currentPage && lastPageNum ? currentPage < lastPageNum ? currentPage + 1 : undefined : undefined;
    },
    initialPageParam: 1,
    select: (data) => ({
      list: data.pages.flatMap(page => page.list),
      meta: data.pages[0]?.meta,
    }),
    retry: 2,
  });

  const allProducts = data?.list || [];

  if (status === 'pending') {
    return (
      <div className="flex justify-center items-center min-h-[50vh]" aria-live="polite">
        <Skeleton type="product-list" count={8} />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200" role="alert">
        <p className="text-gray-600 text-lg">Une erreur est survenue</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2  min-[600px]:grid-cols-3  xl:grid-cols-4 lg:grid-cols-3">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {!allProducts.length ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600 text-lg">
            {categorySlug
              ? "Aucun produit disponible pour cette catégorie"
              : "Aucun produit trouvé"}
          </p>
        </div>
      ) : (
        <div className="py-4 flex justify-center min-h-[50px]">
          {isFetchingNextPage ? (
            <Loading size="medium" className="my-16" />
          ) : hasNextPage ? (
            <button
              onClick={() => fetchNextPage()}
              className="px-4 py-2  text-black rounded-md hover:bg-black/10 transition-all duration-500"
            >
              Charger plus de produits
            </button>
          ) : (
            <p className="text-gray-500 text-sm">Tous les produits ont été chargés</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ListProductCard;
