import clsx from "clsx";
import { useEffect, useState } from "react";
const iconsMap = {
  ai: import("react-icons/ai"),
  bi: import("react-icons/bi"),
  bs: import("react-icons/bs"),
  cg: import("react-icons/cg"),
  di: import("react-icons/di"),
  fa: import("react-icons/fa"),
  fa6: import("react-icons/fa6"),
  fc: import("react-icons/fc"),
  fi: import("react-icons/fi"),
  gi: import("react-icons/gi"),
  gr: import("react-icons/gr"),
  hi: import("react-icons/hi"),
  hi2: import("react-icons/hi2"),
  im: import("react-icons/im"),
  io: import("react-icons/io"),
  io5: import("react-icons/io5"),
  lia: import("react-icons/lia"),
  lib: import("react-icons/lib"),
  sl: import("react-icons/sl"),
  si: import("react-icons/si"),
  rx: import("react-icons/rx"),
  ri: import("react-icons/ri"),
  md: import("react-icons/md"),
  lu: import("react-icons/lu"),
  pi: import("react-icons/pi"),
  wi: import("react-icons/wi"),
  vsc: import("react-icons/vsc"),
  ti: import("react-icons/ti"),
  tfi: import("react-icons/tfi"),
  tb: import("react-icons/tb"),
};
const getIcons = async (key: keyof typeof iconsMap) => iconsMap[key];

export default function Page() {
  const [vIcon, setVicons] = useState<keyof typeof iconsMap>("bi");
  const [ListIcon, setListIcon] = useState<
    (typeof iconsMap)[keyof typeof iconsMap] | {}
  >({});

  useEffect(() => {
    const initIcon = async () => {
      setListIcon(await getIcons(vIcon));
    };
    initIcon();
  }, [vIcon]);
  console.log("icon", vIcon, ListIcon);
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap  justify-center bg-gray-300 rounded-3xl gap-4 items-center p-2 p m-2">
        {[
          "ai",
          "bi",
          "bs",
          "cg",
          "di",
          "fa",
          "fa6",
          "fc",
          "fi",
          "gi",
          "gr",
          "hi",
          "hi2",
          "im",
          "io",
          "io5",
          "lia",
          "lib",
          "sl",
          "si",
          "rx",
          "ri",
          "md",
          "lu",
          "pi",
          "wi",
          "vsc",
          "ti",
          "tif",
          "tb",
        ].map((icon, key) => {
          return (
            <button
              className={clsx(
                "text-lg cursor-pointer font-primary p-1 px-4 rounded-xl",
                {
                  "bg-black text-white": vIcon === icon,
                  "bg-gray-100": vIcon !== icon,
                }
              )}
              key={key}
              onClick={() => {
                console.log("icon", icon);

                setVicons(icon as any);
              }}
            >
              {icon}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Object?.keys(ListIcon).map((key: any) => {
          const IconComponent = (ListIcon as any)[key];
          return (
            <div key={key} className="flex flex-col gap-5 items-center">
              <IconComponent className="text-4xl font-primary" />
              <h2 className="text-xl">{key}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
