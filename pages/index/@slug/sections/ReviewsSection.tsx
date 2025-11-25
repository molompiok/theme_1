import { useCallback, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { usePageContext } from "vike-react/usePageContext";
import { ProductClient } from "../../../type";
import { get_comments } from "../../../../api/comment.api";
import ReviewsStars from "../../../../component/comment/ReviewsStars";
import BindTags from "../../../../component/product/BindTags";
import { ProductMedia } from "../../../../component/ProductMedia";

interface ReviewsSectionProps {
  product: ProductClient;
}

export function ReviewsSection({ product }: ReviewsSectionProps) {
  const [filterMedia, setFilterMedia] = useState(false);
  const [expandedComment, setExpandedComment] = useState<number | null>(null);
  const { api } = usePageContext();

  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["comments", product.id],
    queryFn: ({ pageParam = 1 }) =>
      get_comments(
        {
          product_id: product.id,
          page: pageParam,
          limit: 2,
          with_users: true,
        },
        api
      ),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.meta?.current_page;
      const lastPageNum = lastPage?.meta?.last_page;
      return currentPage && lastPageNum && currentPage < lastPageNum
        ? currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    select: (result) => ({
      list: result.pages.flatMap((page) => page?.list || []),
      meta: result.pages[0]?.meta,
    }),
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  const comments = useMemo(() => data?.list || [], [data?.list]);
  const filteredComments = useMemo(
    () =>
      filterMedia
        ? comments.filter((comment) => comment.views?.length > 0)
        : comments,
    [comments, filterMedia]
  );

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  const toggleExpandedComment = useCallback((index: number) => {
    setExpandedComment((prev) => (prev === index ? null : index));
  }, []);

  if (isLoading) {
    return (
      <SectionWrapper>
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-500 border-r-transparent" />
        <p className="mt-2 text-gray-600">Chargement des avis...</p>
      </SectionWrapper>
    );
  }

  if (isError) {
    return (
      <SectionWrapper>
        <p className="text-red-500">
          Une erreur s'est produite : {error instanceof Error ? error.message : "Erreur inconnue"}
        </p>
      </SectionWrapper>
    );
  }

  return (
    <section className="py-8 md:py-12 border-t">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
            Avis sur{" "}
            <span className="underline underline-offset-4 text-orange-500 decoration-orange-300">
              {product.name}
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="flex items-baseline">
              <span className="text-2xl md:text-3xl font-bold">{product.rating}</span>
              <span className="text-sm text-gray-700 ml-1">/5</span>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <ReviewsStars note={Number(product.rating)} size={25} style="text-orange-500" />
              <span className="text-sm text-gray-600">
                {data?.meta?.total || 0} avis vérifiés
              </span>
            </div>
          </div>
        </header>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
          <div className="flex gap-2">
            <FilterChip isActive={!filterMedia} onClick={() => setFilterMedia(false)}>
              Tous
            </FilterChip>
            <FilterChip isActive={filterMedia} onClick={() => setFilterMedia(true)}>
              Avec média
            </FilterChip>
          </div>
          <span className="text-sm text-gray-600">{filteredComments.length} avis</span>
        </div>

        <div className="space-y-6 divide-y-2 divide-gray-100">
          {filteredComments.length > 0 ? (
            filteredComments.map((comment, index) => (
              <article
                key={`${comment.id}-${index}`}
                className="pt-7 pb-2 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 md:gap-6"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <ReviewsStars note={comment.rating} size={22} style="text-orange-500" />
                    <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{comment.title}</h3>
                  <CommentContent
                    comment={comment}
                    index={index}
                    expandedComment={expandedComment}
                    onToggle={toggleExpandedComment}
                  />
                  {comment.views?.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                      {comment.views.map((viewUrl, idx) => (
                        <div
                          key={idx}
                          className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden"
                        >
                          <ProductMedia
                            mediaList={[...new Set([viewUrl, ...(comment?.views || [])])]}
                            productName={product.name}
                            showFullscreen
                            shouldHoverVideo={false}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                      {comment.user?.full_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="font-medium">
                      {comment.user?.full_name?.substring(0, 8) || "Inconnu"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1 text-green-600 mb-1">
                      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.471-1.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs">Achat vérifié</span>
                    </div>
                    <BindTags tags={comment.bind_name || {}} />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              {filterMedia
                ? "Aucun avis avec média n'a été trouvé."
                : "Aucun avis n'a été trouvé."}
            </div>
          )}
          <div className="flex justify-center mt-8">
            {isFetchingNextPage ? (
              <div className="my-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-500 border-r-transparent" />
            ) : hasNextPage ? (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-black/10 transition-all duration-500 disabled:opacity-50"
              >
                Charger plus de commentaires
              </button>
            ) : comments.length > 0 ? (
              <p className="text-gray-500 text-sm">Tous les commentaires ont été chargés</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-8 md:py-12 border-t">
      <div className="container mx-auto px-4 max-w-6xl text-center py-12">{children}</div>
    </section>
  );
}

function FilterChip({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`px-3 py-1 text-sm rounded-full transition-colors ${
        isActive ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function CommentContent({
  comment,
  index,
  expandedComment,
  onToggle,
}: {
  comment: Awaited<ReturnType<typeof get_comments>>["list"][number];
  index: number;
  expandedComment: number | null;
  onToggle: (index: number) => void;
}) {
  const isTruncated = comment?.description?.length > 150 && expandedComment !== index;

  return (
    <div>
      {isTruncated ? (
        <>
          <p className="text-gray-600">{comment.description.substring(0, 150)}...</p>
          <button
            className="text-gray-900 text-sm font-bold mt-1 hover:underline"
            onClick={() => onToggle(index)}
          >
            Voir plus
          </button>
        </>
      ) : (
        <p className="text-gray-600 whitespace-pre-line">{comment.description}</p>
      )}
      {expandedComment === index && comment.description.length > 150 && (
        <button
          className="text-gray-900 text-sm font-bold mt-1 hover:underline"
          onClick={() => onToggle(index)}
        >
          Voir moins
        </button>
      )}
    </div>
  );
}

