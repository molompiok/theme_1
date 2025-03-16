// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>
import { dehydrate } from "@tanstack/react-query"
import { get_products } from "../../api/products.api";
import { createQueryClient } from "../../utils";
import { PageContextServer } from "vike/types";
import { get_categories } from "../../api/categories.api";



const data = async (pageContext: PageContextServer) => {
  const queryClient = createQueryClient()
  await queryClient.prefetchQuery({ queryKey: ['get_products'], queryFn: () => get_products({}) })
  await queryClient.prefetchQuery({ queryKey: ['get_categories'], queryFn: () => get_categories({store_id : 'd3d8dfcf-b84b-49ed-976d-9889e79e6306'}) })
  return {
    dehydratedState : dehydrate(queryClient),
    title : 'page produit'
    // The page's <title>
    // title: products.name
  }
}


