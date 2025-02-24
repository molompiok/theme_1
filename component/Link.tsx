import { usePageContext } from "../renderer/usePageContext";

export { Link }

function Link(props: { href: string; className?: string; children: React.ReactNode }) {
  const pageContext = usePageContext()
  const { urlPathname } = pageContext
  const { href } = props
  const isActive = href === '/' ? urlPathname === href : urlPathname.startsWith(href)
  const className = [
    props.className,
    'underline-animation font-spacegrotesk whitespace-nowrap',
    isActive && 'underline-animation-active'
  ].filter(Boolean).join(' ');
  return <a {...props} className={className} />
}
