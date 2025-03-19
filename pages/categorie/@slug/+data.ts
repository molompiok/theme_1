export { data };
export type Data = Awaited<ReturnType<typeof data>>;
import { dehydrate } from "@tanstack/react-query";
import { PageContextServer } from "vike/types";
import { createQueryClient } from "../../../utils";
import { get_filters, get_products } from "../../../api/products.api";

const data = async (pageContext: PageContextServer) => {
  const queryClient = createQueryClient();
  const slug = pageContext.routeParams!.slug;
  await queryClient.prefetchQuery({
    queryKey: ["get_products", { slug_cat : slug }],
    queryFn: () => get_products({ slug_cat : slug }),
  });


  await queryClient.prefetchQuery({
    queryKey: ["get_filters", { slug : slug }],
    queryFn: () => get_filters({ slug : slug }),
  });

  const data = await queryClient.ensureQueryData({
    queryKey: ["get_products", { slug_cat : slug }],
    queryFn: () => get_products({ slug_cat : slug }),
  });
  console.log("🚀 ~ data ~ data:", data)

  return {
    dehydratedState: dehydrate(queryClient),
    title: data?.category?.name,
    description: data?.category?.description,
    // The page's <title>
    // title: products.name
  };
};
