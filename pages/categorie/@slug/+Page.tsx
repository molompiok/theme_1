import { useData } from "../../../renderer/useData";
import type { Data } from "./+data";
import LayoutProduct from "../../../component/product/LayoutProduct";
import { ProductMedia } from "../../../component/ProductMedia";

export { Page };

function Page() {
  const { dehydratedState, description, title ,view } = useData<Data>();

  return (
    <div className="min-h-dvh  antialiased">
      <header className="relative h-80 md:h-96 bg-gray-950 overflow-hidden">
        {/*grande image*/}
        <ProductMedia className="w-full h-full object-contain absolute inset-0" mediaList={view ?? [] } productName={title ?? ''}/>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-4xl text-white font-bold mb-2">
              {title}
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto">{description}</p>
          </div>
        </div>
      </header>
      <LayoutProduct
        dehydratedState={dehydratedState}
        queryKey={"get_products"}
      />
    </div>
  );
}
