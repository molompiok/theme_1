import { BsCartCheck } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../component/Popover";
import { productCommands } from "../../../S1_data";
import { features } from "process";
import clsx from "clsx";

export default function Page() {
  return (
    <div className="bg-gray-200 px-3 font-primary relative w-full min-h-dvh pt-10 ">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex gap-2 items-center font-light">
          <BsCartCheck className="text-5xl text-green-500/60" />
          <h1 className="text-3xl">Mes commandes</h1>
        </div>
        <div className="flex justify-end mb-5 border-b border-b-black/70">
          <Popover>
            <PopoverTrigger
              asChild
              className=" gap-2 justify-center items-center bg-white sm:flex hidden "
            >
              <button className="flex gap-1 mb-5 ">
                <span className="font-light">Filtrez par</span>
                <span className="cursor-pointer">Plus recents</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="z-20">
              <div className="bg-white shadow-2xl  flex flex-col gap-y-3 px-6 rounded-2xl py-2">
                {[
                  "plus recent",
                  "plus ancien",
                  "mieux mote",
                  "Prix eleve",
                  "Prix bas",
                ].map((sort, index) => {
                  return (
                    <div
                      className="text-lg capitalize underline-animation cursor-pointer"
                      key={index}
                    >
                      {sort}
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-col items-center divide-y bg-white w-[80%] mx-auto gap-y-2">
        {productCommands.map((pCommand, index) => {
          return (
            <div key={index} className="flex">
              <img src={pCommand.views[0]} className="size-36" />
              <div>
                <h1 className="text-clamp-sm font-bold">{pCommand.name}</h1>
                <div className="flex gap-1">
                  {Object.keys(pCommand.features).map((k) => {
                    return (
                      <span className="font-light" key={k}>
                        <span className="">{pCommand.features[k]}</span>
                      </span>
                    );
                  })}
                </div>
                <p className="font-light text-clamp-sm w-[90%] whitespace-pre-wrap">
                  {pCommand.description}
                </p>
              </div>
              <div className="w-[200ppx]">
                <div className="flex gap-2 text-clamp-sm">
                  <div className="flex ">
                    {/* <span className="font-light">Total : </span> */}
                    <div className="">
                      <span className="font-light ">
                        {pCommand.quantity} x {pCommand.price_unit}
                      </span>
                      <span className="font-light">{pCommand.currency}</span>
                    </div>
                  </div>
                  = {pCommand.quantity * pCommand.price_unit}
                </div>
                <div>
                  <span>
                    <span className="bg-gray-500 p-1 m-1 rounded-3xl text-white">status</span> 
                    <span className={clsx({
                      'text-red-500' : pCommand.status === "RETURN",
                      'text-green-500' : pCommand.status !== "RETURN"
                    })}>
                      {pCommand.status === "RETURN"
                        ? "Produit retourne"
                        : "Produit livre"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
