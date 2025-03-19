// https://vike.dev/data
export { data };
export type Data = Awaited<ReturnType<typeof data>>;
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { get_products } from "../../api/products.api";
import { createQueryClient } from "../../utils";
import { PageContextServer } from "vike/types";

const data = async (pageContext: PageContextServer) => {
  const search = pageContext.urlParsed.search;

  const queryClient = createQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["gets_products", { search: search["name"] }],
    queryFn: () => get_products({ search: search["name"] }),
  });

  return {
    dehydratedState: dehydrate(queryClient),
    // The page's <title>
    // title: products.name
  };
};
