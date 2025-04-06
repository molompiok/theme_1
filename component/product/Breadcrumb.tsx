// components/Breadcrumb.tsx
import { useQuery } from "@tanstack/react-query"
import React from "react"
import { get_categories } from "../../api/categories.api"
import { Link } from "../Link"


type Category = {
    id: string
    name: string
    parent_category_id: string | null
    slug?: string // Ajout d'un slug pour les URLs
}

interface BreadcrumbProps {
    categoryId: string
}

function getParentCategories(
    categoryId: string,
    allCategories: Category[]
): Category[] {
    const map = new Map(allCategories.map((cat) => [cat.id, cat]))
    const result: Category[] = []

    let current = map.get(categoryId)

    while (current) {
        result.push(current)
        current = current.parent_category_id
            ? map.get(current.parent_category_id)
            : undefined
    }

    return result
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ categoryId }) => {
    const storeId = "d3d8dfcf-b84b-49ed-976d-9889e79e6306";

    // Fetch categories
    const {
        data: categories = [],
        isPending,
    } = useQuery({
        queryKey: ["get_categories", storeId],
        queryFn: () => get_categories({ store_id: storeId }),
        select: (data) => (data.list ? data.list : []),
    });

    // Loading state
    if (isPending) {
        return <div className="text-gray-600 text-sm">Loading...</div>;
    }

    // Empty state
    if (!categories || categories.length === 0) {
        return (
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center text-gray-600 text-sm">
                    <li>
                        <Link href="/" className="hover:text-primary font-semibold hover:font-bold">
                            Accueil
                        </Link>
                    </li>
                </ol>
            </nav>
        );
    }

    // Breadcrumb logic
    const parentCategories = getParentCategories(categoryId, categories);
    const reversedCategories = [...parentCategories].reverse();
    const maxItems = 2; 
    const shouldTruncate = reversedCategories.length > maxItems;

    return (
        <nav aria-label="Breadcrumb" className="text-gray-900 text-xs/5">
            <ol className="flex items-center flex-wrap gap-1 max-w-full">
                <li>
                    <Link href="/" className="hover:text-primary font-semibold hover:font-bold">
                        Accueil
                    </Link>
                </li>

                {shouldTruncate ? (
                    <>
                        <li className="flex items-center">
                            <span className="">/</span>
                            <span className="text-gray-500">...</span>
                        </li>
                        {reversedCategories.slice(-maxItems).map((category) => (
                            <li key={category.id} className="flex items-center">
                                <span className="mr-0.5">/</span>
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
                            <span className="mr-0.5">/</span>
                            <Link
                                href={`/categorie/${category.slug}`}
                                className="hover:text-primary font-semibold hover:font-bold truncate max-w-[150px]"
                            >
                                {category.name}
                            </Link>
                        </li>
                    ))
                )}
                <span className="">/</span>
            </ol>
        </nav>
    );
};