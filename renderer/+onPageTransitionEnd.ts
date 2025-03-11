import { OnPageTransitionEndAsync } from "vike/types"

export const onPageTransitionEnd: OnPageTransitionEndAsync = async (): ReturnType<OnPageTransitionEndAsync> => {
  console.log('Page transition end')
  document.querySelector('body')!.classList.remove('page-is-transitioning')
  
  // Faire apparaître la nouvelle page
  const pageContent = document.querySelector('.page-content')
  if (pageContent) {
  
    // Ou avec l'animation
    pageContent.classList.add('fade-in-page')
  }
}