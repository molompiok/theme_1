// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { get_products } from "../../api/products.api";
import { createQueryClient } from "../../utils";
import { PageContextServer } from "vike/types";



const data = async (pageContext: PageContextServer) => {
  const queryClient = createQueryClient()

  

  await queryClient.prefetchQuery({ queryKey: ['gets_products'], queryFn: () => get_products({}) })

  return {
    dehydratedState : dehydrate(queryClient),
    title : 'page produit'
    // The page's <title>
    // title: products.name
  }
}


