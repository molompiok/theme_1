// https://vike.dev/data
export { data };
export type Data = Awaited<ReturnType<typeof data>>;
import { dehydrate } from "@tanstack/react-query";
import { get_products } from "../../api/products.api";
import { PageContextServer } from "vike/types";
import { useQueryClient } from "@tanstack/react-query";

const data = async (pageContext: PageContextServer) => {
  const search = pageContext.urlParsed.search;
  const { api } = pageContext;

  const queryClient = useQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["gets_products", { search: search["name"] }],
    queryFn: () => get_products({ search: search["name"] }, api),
  });

  return {
    dehydratedState: dehydrate(queryClient),
    // The page's <title>
    // title: products.name
  };
};
