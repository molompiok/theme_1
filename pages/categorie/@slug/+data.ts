export { data };
export type Data = Awaited<ReturnType<typeof data>>;
import { dehydrate } from "@tanstack/react-query";
import { PageContextServer } from "vike/types";
import { createQueryClient } from "../../../utils";
import { get_filters, get_products } from "../../../api/products.api";

const data = async (pageContext: PageContextServer) => {
  // const queryClient = createQueryClient();
  const slug = pageContext.routeParams!.slug;
  // const search = pageContext.urlParsed.searchAll;
  await createQueryClient.prefetchQuery({
    queryKey: ["get_products", { slug_cat : slug ,  }],
    queryFn: () => get_products({ slug_cat : slug }),
  });


  await createQueryClient.prefetchQuery({
    queryKey: ["get_filters", { slug : slug }],
    queryFn: () => get_filters({ slug : slug }),
  });

  const data = await createQueryClient.ensureQueryData({
    queryKey: ["get_products", { slug_cat : slug }],
    queryFn: () => get_products({ slug_cat : slug }),
  });
  console.log("🚀 ~ data ~ data:", data)

  return {
    dehydratedState: dehydrate(createQueryClient),
    title: data?.category?.name,
    view: data?.category?.view,
    description: data?.category?.description,
    // The page's <title>
    // title: products.name
  };
};
