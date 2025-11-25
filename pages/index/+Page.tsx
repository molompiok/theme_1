import LayoutProduct from "../../component/product/LayoutProduct";
import { useData } from "vike-react/useData";
import type { Data } from "./+data";

export { Page };

function Page() {
  const { dehydratedState } = useData<Data>();

  return (
    <div className="min-h-dvh font-primary">
      <LayoutProduct
        dehydratedState={dehydratedState}
        queryKey={"get_products"}
      />
    </div>
  );
}
