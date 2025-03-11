import { OnPageTransitionStartAsync } from "vike/types"

export const onPageTransitionStart: OnPageTransitionStartAsync = async (): ReturnType<OnPageTransitionStartAsync> => {
  console.log('Page transition start')
  document.querySelector('body')!.classList.add('page-is-transitioning')
  
  // Optionnel: ajouter un effet de sortie
  const pageContent = document.querySelector('.page-content')
  if (pageContent) {
    pageContent.classList.add('page-exit')
  }
}