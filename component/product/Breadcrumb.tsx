import React from "react";
import { useQuery } from "@tanstack/react-query";
import { get_categories } from "../../api/categories.api";
import { Link } from "../Link";
import { Category } from "../../pages/type";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

interface BreadcrumbProps {
  categoryId: string;
}

function getParentCategories(
  categoryId: string,
  allCategories: Category[]
): Category[] {
  const map = new Map(allCategories.map((cat) => [cat.id, cat]));
  const result: Category[] = [];

  let current = map.get(categoryId);

  while (current) {
    result.push(current);
    current = current.parent_category_id
      ? map.get(current.parent_category_id)
      : undefined;
  }

  return result;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ categoryId }) => {
  console.log("🚀 ~ categoryId:", categoryId);
  const storeId = "d3d8dfcf-b84b-49ed-976d-9889e79e6306";

  const isMobile = useMediaQuery("(max-width: 767px)");
  const maxItems = isMobile ? 2 : 3;

  const { data: categories = [], isPending } = useQuery({
    queryKey: ["get_categories", storeId],
    queryFn: () => get_categories({ store_id: storeId }),
    select: (data) => (data?.list ? data.list : []),
  });

  console.log("🚀 ~ categories:", categories);
  if (isPending) {
    return <div className="text-gray-600 text-sm">Loading...</div>;
  }

  if (!categories || categories.length === 0) {
    return (
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center text-gray-600 text-sm">
          <li>
            <Link
              href="/"
              className="hover:text-primary font-semibold hover:font-bold"
            >
              Accueil
            </Link>
          </li>
        </ol>
      </nav>
    );
  }

  const parentCategories = getParentCategories(categoryId, categories);
  console.log("🚀 ~ parentCategories:", parentCategories);
  const reversedCategories = [...parentCategories].reverse();
  const shouldTruncate = reversedCategories.length > maxItems;

  return (
    <nav aria-label="Breadcrumb" className="text-gray-600 text-sm">
      <ol className="flex items-center flex-wrap gap-1 max-w-full">
        <li>
          <Link
            href="/"
            className="hover:text-primary font-semibold hover:font-bold"
          >
            Accueil
          </Link>
        </li>
        {shouldTruncate ? (
          <>
            <li className="flex items-center">
              <span className="mx-1">/</span>
              <span className="text-gray-500">...</span>
            </li>
            {reversedCategories.slice(-maxItems).map((category) => (
              <li key={category.id} className="flex items-center">
                <span className="mx-1">/</span>
                <Link
                  href={`/categorie/${category.slug}`}
                  className="hover:text-primary font-semibold hover:font-bold truncate max-w-[150px]"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </>
        ) : (
          reversedCategories.map((category) => (
            <li key={category.id} className="flex items-center">
              <span className="mx-1">/</span>
              <Link
                href={`/categorie/${category.slug}`}
                className="hover:text-primary font-semibold hover:font-bold truncate max-w-[150px]"
              >
                {category.name}
              </Link>
            </li>
          ))
        )}
      </ol>
    </nav>
  );
};
