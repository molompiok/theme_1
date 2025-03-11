export { data };
export type Data = Awaited<ReturnType<typeof data>>;
import { dehydrate } from "@tanstack/react-query";
import { PageContextServer } from "vike/types";
import { createQueryClient } from "../../../utils";
import { get_products_by_category } from "../../../api/products.api";

const data = async (pageContext: PageContextServer) => {
  const queryClient = createQueryClient();
  const slug = pageContext.routeParams!.slug;
  await queryClient.prefetchQuery({
    queryKey: ["get_products_by_category", slug],
    queryFn: () => get_products_by_category({slug }),
  });
  const data = await queryClient.ensureQueryData({
    queryKey: ["get_products_by_category", slug],
    queryFn: () => get_products_by_category({ slug }),
   
  });

  return {
    dehydratedState: dehydrate(queryClient),
    title: data.category.name,
    description: data.category.description
    // The page's <title>
    // title: products.name
  };
};
