import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { usePageContext } from "vike-react/usePageContext";
import { MarkdownViewer } from "../../../../component/MarkdownViewer";
import { ProductMedia } from "../../../../component/ProductMedia";
import { get_details } from "../../../../api/products.api";

interface DetailsSectionProps {
  productId: string;
}

export function DetailsSection({ productId }: DetailsSectionProps) {
  const { api } = usePageContext();
  const {
    data: details,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["details", productId],
    queryFn: () => get_details({ product_id: productId }, api),
    select: (data) => data?.list,
  });

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-600" role="status">
        Chargement des détails...
      </div>
    );
  }

  if (error || !details?.length) {
    return null;
  }

  const sortedDetails = [...details].sort((a, b) => b.index - a.index);
  const lastIndex = sortedDetails.length - 1;
  const isEvenCount = sortedDetails.length % 2 === 0;

  return (
    <section className="container mx-auto mt-4 space-y-2">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
        Détails techniques
      </h2>
      <div
        className={clsx("grid gap-4 grid-cols-1", {
          "md:grid-cols-1": sortedDetails.length === 1,
          "md:grid-cols-2": sortedDetails.length >= 2,
        })}
      >
        {sortedDetails.map((detail, index) => {
          const isLast = index === lastIndex;
          const shouldTakeFullWidth = !isEvenCount && isLast;

          const MediaList = () => (
            <ul className="space-y-2">
              {detail?.view?.map((view, i) => (
                <li key={i} className="flex items-center text-sm">
                  <ProductMedia
                    mediaList={[...new Set([view, ...(detail?.view || [])])]}
                    productName={detail.title || "Détail produit"}
                    showFullscreen
                    shouldHoverVideo={false}
                    className="w-full h-auto object-cover rounded-md"
                  />
                </li>
              ))}
            </ul>
          );

          return (
            <div
              key={detail.id}
              className={clsx("rounded-lg p-4 bg-white", {
                "md:col-span-2": shouldTakeFullWidth,
                "md:col-span-1": !shouldTakeFullWidth,
              })}
            >
              {shouldTakeFullWidth ? (
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <SectionTitle title={detail.title} />
                    {detail.description && (
                      <div className="text-sm sm:text-base text-gray-600">
                        <MarkdownViewer markdown={detail.description} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 mt-3 md:mt-0">
                    <MediaList />
                  </div>
                </div>
              ) : (
                <>
                  <SectionTitle title={detail.title} />
                  {detail.description && (
                    <div className="text-sm sm:text-base text-gray-600">
                      <MarkdownViewer markdown={detail.description} />
                    </div>
                  )}
                  <div className="mt-3">
                    <MediaList />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SectionTitle({ title }: { title?: string }) {
  return (
    <div className="flex justify-between items-start">
      <h3 className="text-base sm:text-lg font-medium text-gray-950">
        {title || "Détail produit"}
      </h3>
    </div>
  );
}

