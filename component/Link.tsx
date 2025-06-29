import { navigate } from "vike/client/router";
import { usePageContext } from "vike-react/usePageContext";

export { Link, LinkSideBar };

function Link(props: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { href } = props;
  const isActive =
    href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  const className = [
    props.className,
    "underline-animation font-spacegrotesk whitespace-nowrap cursor-pointer",
    isActive && "underline-animation-active",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      onClick={() => {
        navigate(href);
        document.body.style.overflow = "auto";
        props?.onClick?.();
      }}
      className={className}
    >
      <span >{props.children}</span>
    </button>
  );
}

function LinkSideBar(props: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const className = [
    props.className,
    "font-primary whitespace-nowrap cursor-pointer",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div
      onClick={() => {
        document.body.style.overflow = "auto";
        props?.onClick?.();
      }}
      className={className}
    >
      {" "}
      {props.children}
    </div>
  );
}
