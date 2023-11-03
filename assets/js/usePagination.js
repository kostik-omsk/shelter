import getPets from './getPets.js';
import usePopUp from './usePopUp.js';
export default async function usePagination() {
  //Получаем массим из json с 8 питомцами
  let pets = await getPets();
  //Кнопки пагинации
  const BTN_FIRST = document.querySelector('#first');
  const BTN_PREV = document.querySelector('#prev');
  const BTNT_COUNT = document.querySelector('#count');
  const BTN_NEXT = document.querySelector('#next');
  const BTN_LAST = document.querySelector('#last');
  //блок с карточками
  const PAGINATION = document.querySelector('#pagination');
  let arrPets48 = generateArrPets48();
  console.log('🚀 ~ usePagination ~ arrPets48:', arrPets48);
  let pages = [];
  let numberOfPages;
  let numberOfCardsInPages;
  let countPages = 1;
  handleResize(); // запускаем функцию, чтобы задать начальное значения, и загрузить первую страницу

  //создаем массив из 48 питомцев где каждый питомец встречается ровно 6 раз
  function generateArrPets48() {
    let arr48 = [];
    let currentArr = [];
    let correct = false;
    for (let i = 0; i < 2; i++) {
      arr48 = arr48.concat(pets.sort(() => 0.5 - Math.random()));
      while (!correct) {
        currentArr = pets.sort(() => 0.5 - Math.random());
        correct = noFourLastTwoFirst(currentArr);
      }
      correct = false;
      while (!correct) {
        currentArr = pets.sort(() => 0.5 - Math.random());
        correct = noTwoFirstFourLast(currentArr);
      }
      correct = false;
    }
    function noFourLastTwoFirst(currentArr) {
      if (
        !currentArr.slice(0, 4).includes(arr48.at(-1)) &&
        !currentArr.slice(0, 4).includes(arr48.at(-2))
      ) {
        arr48 = arr48.concat(currentArr);
        return true;
      }
      return false;
    }
    function noTwoFirstFourLast(currentArr) {
      if (
        !arr48.slice(-4).includes(currentArr[0]) &&
        !arr48.slice(-4).includes(currentArr[1])
      ) {
        arr48 = arr48.concat(currentArr);
        return true;
      }
      return false;
    }
    return arr48;
  }

  function generatePagesPets(arr48, numberOfCards) {
    for (let i = 0; i < arr48.length; i += numberOfCards) {
      const chunk = arr48.slice(i, i + numberOfCards);
      pages.push(chunk);
    }
  }

  function getCountPages(screenWidth) {
    return screenWidth >= 1280 ? 6 : screenWidth > 633 ? 8 : 16;
  }

  function handleResize() {
    const screenWidth = window.innerWidth;
    let updateNumberPages = getCountPages(screenWidth);
    if (updateNumberPages !== numberOfPages) {
      pages = [];
      numberOfPages = updateNumberPages;
      numberOfCardsInPages = 48 / numberOfPages;
      generatePagesPets(arrPets48, numberOfCardsInPages);
      countPages = 1;
      BTNT_COUNT.textContent = 1;
      PAGINATION.innerHTML = '';
      pages[countPages - 1].forEach((card) =>
        PAGINATION.append(createCard(card))
      );
      updateButtonsState();
    }
  }

  function createCard(card) {
    const cardElem = document.createElement('div');
    cardElem.classList.add('cards__card');
    cardElem.innerHTML = `
      <img src="${card.img}" alt="${card.name} ${card.type}">
      <h3>${card.name}</h3>
      <button class="button button-secondary">Learn more</button>
    `;
    cardElem.addEventListener('click', () => {
      usePopUp(card);
    });
    return cardElem;
  }

  ///Управление пагинацией
  const updatePage = (pageIndex) => {
    countPages = pageIndex;
    BTNT_COUNT.textContent = countPages;
    PAGINATION.innerHTML = '';
    pages[countPages - 1].forEach((card) =>
      PAGINATION.append(createCard(card))
    );
    updateButtonsState();
  };

  const step = (direction) => {
    const newPageIndex = countPages + direction;
    if (newPageIndex >= 1 && newPageIndex <= numberOfPages) {
      updatePage(newPageIndex);
    }
  };

  const goLast = () => {
    updatePage(numberOfPages);
  };

  const goFirst = () => {
    updatePage(1);
  };

  function updateButtonsState() {
    BTN_PREV.disabled = countPages <= 1;
    BTN_FIRST.disabled = countPages <= 1;
    BTN_NEXT.disabled = countPages >= numberOfPages;
    BTN_LAST.disabled = countPages >= numberOfPages;
  }

  BTN_NEXT.addEventListener('click', () => {
    step(1);
  });
  BTN_PREV.addEventListener('click', () => {
    step(-1);
  });
  BTN_LAST.addEventListener('click', goLast);
  BTN_FIRST.addEventListener('click', goFirst);

  window.addEventListener('resize', handleResize);
}
