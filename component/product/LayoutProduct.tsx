import React, { PropsWithChildren } from 'react'
import FilterPanel from './FilterPanel'
import { DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import ListProductCard from './ListProductCard'

export default function LayoutProduct({dehydratedState , queryKey} :PropsWithChildren<{dehydratedState : DehydratedState,queryKey : string}>) {
  return (
    <main className="container font-primary mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
          <aside className="lg:sticky lg:top-6 self-start">
            <FilterPanel />
          </aside>
          <section className="space-y-6">
            <HydrationBoundary state={dehydratedState}>
              <ListProductCard queryKey={queryKey}/>
            </HydrationBoundary>
          </section>
        </div>
      </main>
  )
}
