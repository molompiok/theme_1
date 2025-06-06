// https://vike.dev/data
export { data };
export type Data = Awaited<ReturnType<typeof data>>;
import { dehydrate } from "@tanstack/react-query";
import { get_products } from "../../api/products.api";
import { createQueryClient } from "../../renderer/ReactQueryProvider";
import { PageContextServer } from "vike/types";

const data = async (pageContext: PageContextServer) => {
  const search = pageContext.urlParsed.search;

  // const queryClient = createQueryClient();

  await createQueryClient.prefetchQuery({
    queryKey: ["gets_products", { search: search["name"] }],
    queryFn: () => get_products({ search: search["name"] }),
  });

  return {
    dehydratedState: dehydrate(createQueryClient),
    // The page's <title>
    // title: products.name
  };
};
