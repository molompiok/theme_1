import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard"; // Assuming this is a well-styled component
import {
  OrderByType,
  ProductClient,
  filterOptions as defaultSortOptions,
} from "../../pages/type"; // Renamed filterOptions to avoid confusion
import { usePageContext } from "../../renderer/usePageContext";
import { get_products } from "../../api/products.api";
import Skeleton from "../Skeleton"; // Assuming this provides a good visual skeleton for ProductCard
import { useSelectedFiltersStore } from "../../store/filter";
import { useMemo } from "react";
import Loading from "../Loading"; // Assuming this is a nice spinner

// Icons for visual feedback
import { FiAlertTriangle, FiInbox, FiChevronDown } from "react-icons/fi";
import clsx from "clsx";

interface ListProductCardProps {
  slug?: string;
  queryKey: string; // e.g., "category_products", "search_products"
}

// Helper to create a mapping from sort option text to its ID
const sortOptionMap = defaultSortOptions.reduce((acc, option) => {
  acc[option.name.toLowerCase()] = option.id;
  return acc;
}, {} as Record<string, string>);

function ListProductCard({ slug, queryKey }: ListProductCardProps) {
  const pageContext = usePageContext();
  const categorySlug = slug || pageContext.routeParams?.slug;
  const { selectedFilters } = useSelectedFiltersStore();

  const { order, queryFilters } = useMemo(() => {
    const currentOrderText =
      selectedFilters?.order_by?.[0]?.text?.toLowerCase() || "date_desc";
    const newOrder =
      (sortOptionMap[currentOrderText] as OrderByType) || "date_desc";
    const { order_by, ...restFilters } = selectedFilters;
    return { order: newOrder, queryFilters: restFilters };
  }, [selectedFilters]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status, // 'pending', 'error', 'success'
    error, // Contains error object if status is 'error'
  } = useInfiniteQuery({
    // Add type for Error
    queryKey: [queryKey, categorySlug, queryFilters, order], // queryFilters and order are now stable
    queryFn: ({ pageParam = 1 }) =>
      get_products({
        slug_cat: categorySlug,
        max_price: selectedFilters["max_price"]?.[0]?.text
          ? parseFloat(selectedFilters["max_price"]?.[0]?.text)
          : undefined,
        min_price: selectedFilters["min_price"]?.[0]?.text
          ? parseFloat(selectedFilters["min_price"]?.[0]?.text)
          : undefined,
        filters: queryFilters,
        order_by: order,
        limit: 12, // Increased limit for a fuller initial view, adjust as needed
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.meta?.current_page;
      const lastPageNum = lastPage?.meta?.last_page;
      return currentPage && lastPageNum && currentPage < lastPageNum
        ? currentPage + 1
        : undefined;
    },
    initialPageParam: 1,

    retry: 1, // Standard retry, can be adjusted
  });

  // Flatten pages for rendering
  const allProducts = useMemo(
    () => data?.pages.flatMap((page) => page.list) || [],
    [data]
  );
  const totalProducts = data?.pages?.[0]?.meta?.total ?? 0; // Get total from the first page's meta

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="py-8" aria-live="polite" aria-busy="true">
        <div className="mb-6 h-6 w-1/3 bg-gray-200 animate-pulse rounded-md"></div>{" "}
        {/* Placeholder for product count */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map(
            (
              _,
              index // Show a consistent number of skeletons
            ) => (
              <Skeleton key={index} type="card" /> // Assuming type "product-card" matches ProductCard
            )
          )}
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (status === "error") {
    return (
      <div
        className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-xl border border-red-200 shadow-sm"
        role="alert"
      >
        <FiAlertTriangle className="text-red-500 size-12 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-1">
          Oops! Something went wrong.
        </h3>
        <p className="text-gray-600 mb-4">
          We couldn't load the products. Please try again later.
        </p>
        {/* Optional: Log error details for debugging */}
        {/* {error && <p className="text-xs text-red-400 mt-2">Error: {error.message}</p>} */}
        {/* Could add a refetch button here if desired, though react-query handles retries */}
      </div>
    );
  }

  // --- No Products State ---
  if (allProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <FiInbox className="text-gray-400 size-12 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-1">
          No Products Found
        </h3>
        <p className="text-gray-600">
          {Object.keys(queryFilters).length > 0 || categorySlug
            ? "Try adjusting your filters or check back later."
            : "There are currently no products available."}
        </p>
      </div>
    );
  }

  // --- Success State (Products available) ---
  return (
    <div className="py-2 md:py-4">
      <div className="mb-6 text-left">
        <p className="text-gray-700 ml-3 text-sm sm:text-base font-medium">
          Affichage de{" "}
          <span className="font-bold text-slate-600">{allProducts.length}</span>{" "}
          de <span className="font-bold text-slate-600">{totalProducts}</span>{" "}
          produits
        </p>
      </div>

      <div className="grid grid-cols-2 min-[750px]:grid-cols-3 min-[1200px]:grid-cols-3 min-[1400px]:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {allProducts.map((product) => (
          <ProductCard key={product?.id} product={product} />
        ))}
      </div>

      <div className="pt-8 pb-4 flex flex-col items-center justify-center min-h-[60px]">
        {isFetchingNextPage ? (
          <Loading size="medium" className="my-4" />
        ) : hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={clsx(
              "flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "bg-slate-100 text-slate-600 hover:bg-slate-400 hover:text-white focus-visible:ring-slate-500",
              "disabled:opacity-70 disabled:cursor-not-allowed"
            )}
          >
            <FiChevronDown className="size-5" />
            Charger plus de produits
          </button>
        ) : (
          <p className="text-gray-500 text-sm py-4">
            Vous avez atteint la fin de la liste!
          </p>
        )}
      </div>
    </div>
  );
}

export default ListProductCard;
