//renderer/+onPageTransitionEnd.ts
import { OnPageTransitionEndAsync } from "vike/types"

export const onPageTransitionEnd: OnPageTransitionEndAsync = async () => {
  console.log('Page transition end: Hiding loader');

  const hasOpenModal = !!document.querySelector('div[data-is-open="true"]');


  if (hasOpenModal) {
    console.log('Modal is open, skipping page transition loader');
    return; // Ne pas afficher le loader
  }

  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.add('is-hidden');
  } else {
    console.warn('Page loader element (#page-loader) not found.');
  }

}