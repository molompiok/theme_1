import { useQuery } from "@tanstack/react-query"; // Assurez-vous que c'est le bon import selon votre setup
import ProductCard from "./ProductCard"; // Ajustez le chemin
import { ProductClient, ProductType } from "../../pages/type";
import { usePageContext } from "../../renderer/usePageContext";
import { get_products } from "../../api/products.api";
import Loading from "../Loading";

interface ListProductCardProps {
  slug?: string;
  queryKey: string;
}

function ListProductCard({ slug, queryKey }: ListProductCardProps) {
  const pageContext = usePageContext();
  const categorySlug = slug || pageContext.routeParams?.slug;

  const { data, isPending, error } = useQuery<
    // | ProductClient[]
     {
        products: ProductClient[];
        category: {
          id: string;
          name: string;
          description: string;
        } | undefined | null;
      },
    Error
  >({
    queryKey: [queryKey, { slug_cat: categorySlug }].filter(Boolean),
    queryFn: () =>
      categorySlug ? get_products({ slug_cat: categorySlug }) : get_products({}),
    // staleTime: 24 * 60 * 60 * 1000, // 24 heures
    retry: 2,
  });

  if (isPending) {
    return (
      <div
        className="flex justify-center items-center min-h-[50vh]"
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

  const products: ProductClient[] = Array.isArray(data)
    ? data
    : data?.products || [];

  if (!products.length) {
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
