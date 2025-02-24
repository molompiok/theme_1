import { ProductType } from "../S1_data";
import { usePanier } from "../store/cart";

export function CartButton({text , textMobile , setIsModalOpen, product}: {text: string, textMobile: string, setIsModalOpen: () => void, product: ProductType}) {
  const addItems = usePanier((state) => state.add);
    return (
      <div className="w-full group relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation()
          addItems(product)
          setIsModalOpen()
        }}
        className="w-full border border-gray-400 px-2 py-1 cursor-pointer relative z-10 bg-white overflow-hidden rounded-sm"
      >
        <span className="relative whitespace-nowrap z-20 group-hover:underline group-hover:text-white transition-all duration-500 text-clamp-base -translate-y-1/2 group-hover:translate-y-0">
          <span className="hidden button-cart-1:inline">{text}</span>
          <span className="button-cart-1:hidden">{textMobile}</span>
        </span>
        <div
          className="absolute top-0 left-0 w-full h-full bg-black z-10 transition-transform duration-500 transform -translate-y-full group-hover:translate-y-0"
        ></div>
      </button>
    </div>
    );
}
export  function CommandButton({text , callBack}: {text: string, callBack?: () => void}) {
  const addItems = usePanier((state) => state.add);
    return (
      <div className="w-full group relative inline-block">
      <button
        onClick={() => {
          callBack?.()
        }}
        className="w-full border border-gray-300 px-2 py-1.5 cursor-pointer relative z-10 bg-black/60 overflow-hidden rounded-sm"
      >
        <span className="relative whitespace-nowrap z-20 group-hover:underline text-white transition-all duration-500 text-clamp-base -translate-y-1/2 group-hover:translate-y-0">
          <span className="hidden button-cart-1:inline">{text}</span>
        </span>
        <div
          className="absolute top-0 left-0 w-full h-full bg-black z-10 transition-transform duration-500 transform translate-y-full group-hover:translate-y-0"
        ></div>
      </button>
    </div>
    );
}