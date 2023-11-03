console.log(
  '1. Реализация burger menu на обеих страницах: +26\n2. Реализация слайдера-карусели на странице Main: +36\n3. Реализация пагинации на странице Pets: +36\n4. Реализация попап на обеих страницах: +12 \n\n110/110'
);
import useMenu from './useMenu.js';
import useCarousel from './useCarousel.js';
import usePagination from './usePagination.js';

//menu-burger
useMenu();

document.querySelector('#carousel') && useCarousel();

document.querySelector('#pagination') && usePagination();
