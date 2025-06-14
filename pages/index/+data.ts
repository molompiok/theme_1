// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>
import { dehydrate } from "@tanstack/react-query"
import { get_filters, get_products } from "../../api/products.api";
import { PageContextServer } from "vike/types";
import { get_categories } from "../../api/categories.api";
import { createQueryClient } from "../../renderer/ReactQueryProvider";
import { createApiInstances } from "../../renderer/createApiInstance";



const data = async (pageContext: PageContextServer) => {
  // const search = pageContext.urlParsed.searchAll;
  const queryClient = createQueryClient()
  const { api } = createApiInstances(pageContext);
  await queryClient.prefetchQuery({
    queryKey: ["get_filters"],
    queryFn: () => get_filters({}, api),
  });
  await queryClient.prefetchQuery({ queryKey: ['get_products'], queryFn: () => get_products({}, api) })
  await queryClient.prefetchQuery({ queryKey: ['get_categories'], queryFn: () => get_categories({}, api) })
  return {
    dehydratedState: dehydrate(queryClient),
    title: 'page produit'
    // The page's <title>
    // title: products.name
  }
}


