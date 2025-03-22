import { useData } from "../../renderer/useData";
import { Data } from "./+data";
import LayoutProduct from "../../component/product/LayoutProduct";

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
