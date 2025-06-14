import { OnPageTransitionStartAsync } from "vike/types"

export const onPageTransitionStart: OnPageTransitionStartAsync = async () => {
  console.log('Page transition start: Showing loader');

  const loader = document.getElementById('page-loader'); // Utilise l'ID c'est plus sûr
  if (loader) {
    loader.classList.remove('is-hidden');
  } else {
    console.warn('Page loader element (#page-loader) not found.');
  }

}