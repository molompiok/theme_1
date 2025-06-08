import { PropsWithChildren } from "react";
import FilterPanel from "./FilterPanel";
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";
import ListProductCard from "./ListProductCard";
import FilterPopover from "../FilterPopover";
import { useSelectedFiltersStore } from "../../store/filter";

interface LayoutProductProps {
  dehydratedState: DehydratedState;
  queryKey: string;
}

export default function LayoutProduct({
  dehydratedState,
  queryKey,
}: PropsWithChildren<LayoutProductProps>) {
  const { selectedFilters, setFilter } = useSelectedFiltersStore();

  return (
    <main className="container font-primary mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-1 lg:gap-8">
        <aside className="hidden lg:block lg:sticky lg:top-7 self-start">
          <FilterPanel />
        </aside>
        <section className="space-y-6">
          <div className="flex justify-start flex-row-reverse gap-2">
            <div className="lg:hidden flex   gap-2">
              <FilterPanel />
            </div>
            <FilterPopover
              setFilter={setFilter}
              selectedFilters={selectedFilters}
            />
          </div>
          <HydrationBoundary state={dehydratedState}>
            <ListProductCard queryKey={queryKey} />
          </HydrationBoundary>
        </section>
      </div>
    </main>
  );
}
