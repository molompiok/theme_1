import React, { PropsWithChildren } from "react";
import FilterPanel from "./FilterPanel";
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";
import ListProductCard from "./ListProductCard";
import FilterPopover from "../FilterPopover";

interface LayoutProductProps {
  dehydratedState: DehydratedState;
  queryKey: string;
}

export default function LayoutProduct({
  dehydratedState,
  queryKey,
}: PropsWithChildren<LayoutProductProps>) {

  return (
    <main className="container font-primary mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
        <aside className="hidden lg:block lg:sticky lg:top-0 self-start">
          <FilterPanel />
        </aside>
        <section className="space-y-6">
          <div className="flex justify-start flex-row-reverse gap-2">
            <div className="lg:hidden flex  gap-2">
              <FilterPanel />
            </div>
            <FilterPopover />
          </div>
          <HydrationBoundary state={dehydratedState}>
            <ListProductCard queryKey={queryKey} />
          </HydrationBoundary>
        </section>
      </div>
    </main>
  );

}