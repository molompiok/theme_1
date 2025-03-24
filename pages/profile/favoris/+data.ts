export { data }
export type Data = Awaited<ReturnType<typeof data>>
import { dehydrate } from "@tanstack/react-query"
import { PageContextServer } from "vike/types";
import { createQueryClient } from "../../../utils";
import { get_favorites } from "../../../api/products.api";



const data = async (pageContext: PageContextServer) => {
  // const queryClient = createQueryClient()
  await createQueryClient.prefetchQuery({ queryKey: ['get_favorites'], queryFn: () => get_favorites({}) })
  return {
    dehydratedState : dehydrate(createQueryClient),
    title : 'Mes favoris'
    // The page's <title>
    // title: products.name
  }
}

