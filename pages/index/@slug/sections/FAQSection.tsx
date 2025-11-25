import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { usePageContext } from "vike-react/usePageContext";
import { get_product_faqs } from "../../../../api/faq.api";
import { ProductFaq, FaqSource } from "../../../type";
import { BiChevronDown } from "react-icons/bi";

interface FAQSectionProps {
  productId: string;
}

export function FAQSection({ productId }: FAQSectionProps) {
  const { api } = usePageContext();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [activeGroup, setActiveGroup] = useState<string>("__all__");
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

  const {
    data: faqResponse,
    isLoading: isFaqLoading,
    isFetching: isFaqFetching,
    isError: isFaqError,
    error: faqError,
  } = useQuery({
    queryKey: ["product-faqs", productId],
    queryFn: () => get_product_faqs({ product_id: productId }, api),
    enabled: !!productId,
  });
  const faqs = faqResponse?.list ?? [];

  useEffect(() => {
    if (expandedFAQ !== null && expandedFAQ >= faqs.length) {
      setExpandedFAQ(null);
    }
    faqRefs.current = faqRefs.current.slice(0, faqs.length);
  }, [faqs.length, expandedFAQ]);

  useEffect(() => {
    faqRefs.current.forEach((el, index) => {
      if (!el) return;
      const isExpanded = expandedFAQ === index;
      el.style.height = isExpanded ? `${el.scrollHeight}px` : "0px";
      el.style.opacity = isExpanded ? "1" : "0";
    });
  }, [expandedFAQ, faqs.length]);

  const handleToggle = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const formatGroupLabel = useCallback((value: string | null) => {
    if (!value) return null;
    return value
      .split(/[\s_-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, []);

  const groupedFaqs = useMemo(() => {
    const order: Array<{
      key: string;
      label: string | null;
      items: Array<{ faq: ProductFaq; index: number }>;
    }> = [];
    const seen = new Map<
      string,
      { key: string; label: string | null; items: Array<{ faq: ProductFaq; index: number }> }
    >();

    faqs.forEach((faq, index) => {
      const key = faq.group ?? "__default__";
      if (!seen.has(key)) {
        seen.set(key, {
          key,
          label: faq.group ? formatGroupLabel(faq.group) : null,
          items: [],
        });
        order.push(seen.get(key)!);
      }
      seen.get(key)!.items.push({ faq, index });
    });

    return order;
  }, [faqs, formatGroupLabel]);

  useEffect(() => {
    if (
      activeGroup !== "__all__" &&
      !groupedFaqs.some((group) => group.key === activeGroup)
    ) {
      setActiveGroup("__all__");
    }
  }, [activeGroup, groupedFaqs]);

  const tabGroups = useMemo(
    () => [
      { key: "__all__", label: "Toutes" },
      ...groupedFaqs.map((group) => ({
        key: group.key,
        label: group.label ?? "Autres",
      })),
    ],
    [groupedFaqs]
  );

  const visibleGroups =
    activeGroup === "__all__"
      ? groupedFaqs
      : groupedFaqs.filter((group) => group.key === activeGroup);

  const showSpinner = isFaqLoading || (isFaqFetching && !faqs.length);

  return (
    <section className="w-full bg-white">
      <div className="w-full">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-black tracking-tight">
          Questions fréquentes
        </h2>

        {showSpinner ? (
          <div className="flex justify-center py-12" role="status" aria-live="polite">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
          </div>
        ) : isFaqError ? (
          <div className="text-center text-sm text-red-600">
            Impossible de charger la FAQ. {faqError instanceof Error ? faqError.message : ""}
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            Aucune question fréquente n'est disponible pour ce produit.
          </div>
        ) : (
          <div className="w-full space-y-4 relative">
            {isFaqFetching && (
              <div className="absolute top-0 right-6 flex items-center gap-2 text-xs text-gray-500">
                <span>Actualisation...</span>
                <div className="h-3 w-3 animate-spin rounded-full border border-gray-400 border-t-transparent" />
              </div>
            )}
            <div className="w-full overflow-x-auto">
              <div className="flex gap-2 min-w-max pr-4 justify-center">
                {tabGroups.map((tab) => {
                  const isActive = tab.key === activeGroup;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveGroup(tab.key)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                        isActive
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {visibleGroups.map((group) => (
              <div key={group.key} className="w-full">
                <div className="space-y-0">
                  {group.items.map(({ faq, index }) => (
                    <div
                      key={faq.id}
                      className="w-full border-b border-gray-200 last:border-b-0"
                    >
                      <button
                        className="w-full py-6 px-4 text-left flex justify-between items-center group focus:outline-none transition-colors duration-200 hover:bg-gray-50"
                        onClick={() => handleToggle(index)}
                        aria-expanded={expandedFAQ === index}
                      >
                        <div className="flex flex-col gap-2 pr-4">
                          <span className="text-lg md:text-xl font-medium text-black leading-tight">
                            {faq.title}
                          </span>
                        </div>
                        <BiChevronDown
                          className={`w-5 h-5 text-black transition-transform duration-300 flex-shrink-0 ${
                            expandedFAQ === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        ref={(el) => (faqRefs.current[index] = el!)}
                        className="w-full overflow-hidden transition-all duration-300 ease-out"
                        style={{
                          height: "0px",
                          opacity: "0",
                        }}
                      >
                        <div className="pb-6 px-4 pr-9 space-y-4">
                          <p className="text-base md:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                            {faq.content}
                          </p>
                          {faq.sources && faq.sources.length > 0 && (
                            <div className="space-y-3">
                              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Sources
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {faq.sources.map((source, sourceIndex) => (
                                  <FaqSourceLink
                                    key={`${faq.id}-source-${sourceIndex}`}
                                    source={source}
                                    className="flex-none basis-[260px] max-w-full"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FaqSourceLink({ source, className }: { source: FaqSource; className?: string }) {
  const [imgError, setImgError] = useState(false);
  const hostname = useMemo(() => getHostname(source.url), [source.url]);
  const origin = useMemo(() => getOrigin(source.url), [source.url]);
  const initials = useMemo(
    () => getInitials(source.label, hostname),
    [source.label, hostname]
  );
  const colorClass = SOURCE_COLORS[hashText(hostname || initials) % SOURCE_COLORS.length];

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "group flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition-colors duration-200 hover:border-gray-400 hover:bg-gray-50",
        className
      )}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
        {!imgError && origin ? (
          <img
            src={`${origin}/favicon.ico`}
            alt={hostname || source.label || source.url}
            className="w-6 h-6"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className={`w-8 h-8 ${colorClass} rounded-full flex items-center justify-center text-white text-xs font-semibold`}
          >
            {initials}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {source.label || hostname || source.url}
        </p>
        {hostname && (
          <p className="text-xs text-gray-500 truncate">
            {hostname}
          </p>
        )}
      </div>
      <span className="text-lg text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-gray-600">
        →
      </span>
    </a>
  );
}

const SOURCE_COLORS = [
  "bg-gray-900",
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
];

function hashText(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getHostname(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getOrigin(url: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    return "";
  }
}

function getInitials(label?: string, hostname?: string) {
  const source = label || hostname || "";
  if (!source) return "??";
  return source
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

