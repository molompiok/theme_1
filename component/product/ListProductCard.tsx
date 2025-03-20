import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { Filter, filterOptions, ProductClient, ProductType } from "../../pages/type";
import { usePageContext } from "../../renderer/usePageContext";
import { get_filters, get_products, OrderByType } from "../../api/products.api";
import Skeleton from "../Skeleton";
import { useSelectedFiltersStore } from "../../store/filter";

interface ListProductCardProps {
  slug?: string;
  queryKey: string;
}

function ListProductCard({ slug, queryKey }: ListProductCardProps) {
  const pageContext = usePageContext();
  const categorySlug = slug || pageContext.routeParams?.slug;
  const { selectedFilters } = useSelectedFiltersStore()
  const filterNameToId = filterOptions.reduce((acc, filter) => {
    acc[filter.name.toLowerCase()] = filter.id;
    return acc;
  }, {} as Record<string, string>);
  const {
    data: products,
    isPending,
    error,
  } = useQuery({
    queryKey: [queryKey, categorySlug, selectedFilters],
    queryFn: () => {
      const order = filterNameToId?.[selectedFilters?.order_by?.[0]] as OrderByType || 'date_desc'
      const { order_by, ...restFilters } = selectedFilters;
      return categorySlug
        ? get_products({ slug_cat: categorySlug, filters: restFilters , order_by : order  })
        : get_products({ filters: restFilters, order_by : order });
        
    },
    select: (data) => data.list,
    retry: 2,
  });

  if (isPending) {
    return (
      <div
        className="flex justify-center items-center min-h-[50vh]"
        aria-live="polite"
      >
        <Skeleton type="product-list" count={8} />
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

  if (!products?.length) {
    return (
      <p className="text-center text-gray-500 py-20 text-lg">
        {categorySlug
          ? "Aucun produit disponible pour cette catégorie"
          : "Aucun produit trouvé"}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 xl:grid-cols-4 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ListProductCard;
