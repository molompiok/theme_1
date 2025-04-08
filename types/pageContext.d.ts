// types/pageContext.d.ts
import type { PageContextBuiltIn } from 'vike/types'
import { QueryClient, DehydratedState } from '@tanstack/react-query'

export type PageContextCustom = {
    dehydratedState?: DehydratedState
  // Ajoute ici d'autres propriétés personnalisées si nécessaire
}

// Étend le type PageContext de Vike
declare global {
  namespace Vike {
    interface PageContext extends PageContextCustom, PageContextBuiltIn {}
  }
}