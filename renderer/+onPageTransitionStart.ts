//renderer/+onPageTransitionStart.ts
import { OnPageTransitionStartAsync } from "vike/types"

export const onPageTransitionStart: OnPageTransitionStartAsync = async () => {
  const hasOpenModal = !!document.querySelector('div[data-is-open="true"]');


  if (hasOpenModal) {
    console.log('Modal is open, skipping page transition loader');
    return; // Ne pas afficher le loader
  }

  const loader = document.getElementById('page-loader'); // Utilise l'ID c'est plus sûr
  if (loader) {
    loader.classList.remove('is-hidden');
  } else {
    console.warn('Page loader element (#page-loader) not found.');
  }

}