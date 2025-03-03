import React, { useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { features, generateRandomProducts, ProductType } from "../../S1_data";
import { useData } from "../../renderer/useData";
import { Data } from "../index/+data";
import { createQueryClient } from "../../utils";
import { HydrationBoundary, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { get_features_with_values, get_products } from "../../api/products.api";
import { ProductClient } from "../type";
import { usePageContext } from "../../renderer/usePageContext";
import { BASE_URL } from "../../api";
import { reload } from "vike/client/router";
import { DisplayPrice } from "../../component/DisplayPrice";

export default function Page() {
  // const { dehydratedState } = useData<Data>()
  const [text, setText] = useState('')
  const { urlPathname } = usePageContext()
  useEffect(() => {
    const launchSearch = async () => {
      if (text) {        
        window.history.replaceState(null, '', urlPathname + '?name=' + text)
        await reload()
      } else {
        window.history.replaceState(null, '', urlPathname)

      }
    }
    launchSearch()
  }, [text])

  const queryClient = createQueryClient()

  return (
    <div className="relative bg-gray-100 min-h-dvh w-full">
      <div className="font-primary list-product-breakpoint-2:mx-64 list-product-breakpoint-4:mx-11 mx-3 pt-10 ">
        <h1 className="text-clamp-sm font-bold my-2">Recherche des produits</h1>

        <div className="flex gap-2 items-center  bg-gray-200 w-full py-3 pl-5 mb-10 rounded-xl sticky top-0 ">
          <BsSearch />
          <input
            className="w-full focus:border-none focus:outline-none"
            placeholder="Entrez le nom du produit"
            onChange={(e) => {
              setText(e.target.value)
            }}
          />
        </div>
          {/* <HydrationBoundary state={dehydratedState}  > */}
            <ListProductSearchCard />
          {/* </HydrationBoundary> */}
      </div>
    </div>
  );
}

function ListProductSearchCard() {

  const { urlParsed } = usePageContext()
  console.log({ search: urlParsed.search });

  const { data: products, isLoading ,isFetching ,isPending} = useQuery({ queryKey: ['gets_products', { name: urlParsed.search['name'] }], queryFn: () => get_products({ name: urlParsed.search['name'] }) });

  console.log({ products });

  if (isLoading || isFetching || isPending) {
    <p>Chargement.......</p>
  }
  if (!products || products?.length === 0) {
    return <p>
      Aucun produits
    </p>
  }

  return (
    <div className="grid list-product-breakpoint-3:grid-cols-3 list-product-breakpoint-6:grid-cols-2 grid-cols-1 list-product-breakpoint-3:gap-3 gap-x-2">
      {products.map((product, index) => {
        return (
          <ProductCard key={product.id} product={product} />
        )
      })}
    </div>)
}

function ProductCard({ product }: { product: ProductClient }) {
  const [currentImg, setCurrentImg] = useState(0);

  const { data, isLoading } = useQuery({ queryKey: ['get_features_with_values', product.default_feature_id], queryFn: () => get_features_with_values({ feature_id: product.default_feature_id }) })

  return (
    <div className="relative overflow-hidden border  border-b-white font-primary border-black/15 rounded-2xl pb-4">
      {isLoading ? <div className="flex justify-center items-center"> Loading ......</div> : <img
        src={
          BASE_URL + data?.[0]?.views[currentImg]
        }
        onMouseEnter={() => setCurrentImg(1)}
        onMouseLeave={() => setCurrentImg(0)}
        className="w-full rounded-sm  object-cover aspect-square cursor-pointer hover:scale-95 transition-all duration-500 ease-in-out"
        alt={product.name}
        loading="lazy"
      />}
      <div className="w-full flex-col flex">
        <div className="max-w-[90%] py-1">
          <h1 className="px-2 text-clamp-base font-bold line-clamp-2">
            {product.name}
          </h1>
          {/* <h1 className="px-2 text-clamp-base font-light  line-clamp-1 whitespace-nowrap ">
            {product.description}
          </h1> */}
        </div>
        <DisplayPrice product={product}/>
      </div>
    </div>
  );
}
