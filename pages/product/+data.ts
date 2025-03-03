// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { get_products } from "../../api/products.api"



const data = async () => {
  const queryCllient = new QueryClient();
  await sleep(300) // Simulate slow network


  // await queryCllient.prefetchQuery({ queryKey: ['gets_products'], queryFn: get_products })

  return {
    dehydratedState : dehydrate(queryCllient)
    // The page's <title>
    // title: products.name
  }
}




function sleep(milliseconds: number) {
  return new Promise((r) => setTimeout(r, milliseconds))
}
