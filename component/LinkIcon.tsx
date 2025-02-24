import React from 'react';
import { usePageContext } from '../renderer/usePageContext';

export {LinkIcon}

function LinkIcon(props: { href: string; className?: string; children: React.ReactNode}) {
  const { href, children } = props;
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;

  const isActive = href === '/' ? urlPathname === href : urlPathname.startsWith(href);

  const className = [
    props.className,
    'underline-animation text-clamp-base font-spacegrotesk whitespace-nowrap',
    isActive && 'underline-animation-active',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a href={href} className={className}>
      {/* <span className="flex md:hidden">{Icon}</span> */}

      <span className="hidden md:inline">{children}</span>
    </a>
  );
}
