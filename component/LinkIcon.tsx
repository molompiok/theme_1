import React from "react";
import { usePageContext } from "../renderer/usePageContext";
import { navigate } from "vike/client/router";

export { LinkIcon };

function LinkIcon(props: {
  href: string;
  className?: string;
  isSimple?: boolean ;
  children: React.ReactNode;
}) {
  const { href, children ,isSimple  } = props;
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;

  const isActive =  isSimple ?
    href === "/" ? urlPathname === href : urlPathname.startsWith(href) : urlPathname === href

  const className = [
    props.className,
    "underline-animation text-[.95rem] font-primary whitespace-nowrap uppercase cursor-pointer",
    isActive && "underline-animation-active",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      onClick={() => {
        navigate(href);
      }}
     
    >
      <span  className={className}>{children}</span>
    </button>
  );
}
