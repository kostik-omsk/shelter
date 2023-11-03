import getPets from './getPets.js';
import usePopUp from './usePopUp.js';
export default async function useCarousel() {
  const BTN_PREV = document.querySelector('.prev');
  const BTN_NEXT = document.querySelector('.next');
  const CAROUSEL = document.querySelector('#carousel');
  const ITEM_RIGHT = document.querySelector('#cards__item-right');
  const ITEM_ACTIVE = document.querySelector('#cards__item-active');
  const ITEM_LEFT = document.querySelector('#cards__item-left');
  //Получаем массим из json
  let cards = await getPets();
  //Получаем начальную ширину экрана при первой загрузке, для генерации масива согласо количеству карт в блоке
  let startWidth = window.innerWidth;
  let countCards = getCountCards(startWidth);
  let newCountCards = null;
  // Вызов функции при инициализации
  let startCards = generateCardSets(cards, countCards);
  renderCards(startCards);

  let previoSetSlide;
  let newprevioSetSlide;
  let prevButtonClicked = null;
  let prevSlide = startCards[0];
  let activSlide = startCards[1];
  let nextSlide = startCards[2];
  let newSlide;

  let btns = document.querySelectorAll('[data-showcard]');

  const handler = function (e) {
    cards.forEach((card) => {
      if (card.name === this.dataset.showcard) {
        usePopUp(card);
      }
    });
  };

  btns.forEach((btn) => {
    btn.onclick = handler;
  });

  const moveLeft = () => {
    if (prevButtonClicked === 'prev' || prevButtonClicked === null) {
      newprevioSetSlide = activSlide;
      previoSetSlide = prevSlide;
      activSlide = prevSlide;
    } else {
      ITEM_LEFT.innerHTML = '';
      previoSetSlide.forEach((card) => ITEM_LEFT.append(createCard(card)));
      activSlide = previoSetSlide;
    }
    CAROUSEL.classList.add('transition-left');
    BTN_PREV.removeEventListener('click', moveLeft);
    BTN_NEXT.removeEventListener('click', moveRight);
    prevButtonClicked = 'prev';
  };

  const moveRight = () => {
    if (prevButtonClicked === 'next' || prevButtonClicked === null) {
      previoSetSlide = activSlide;
      activSlide = nextSlide;
      newprevioSetSlide = activSlide;
    } else {
      ITEM_RIGHT.innerHTML = '';
      newprevioSetSlide.forEach((card) => ITEM_RIGHT.append(createCard(card)));
      activSlide = newprevioSetSlide;
    }
    CAROUSEL.classList.add('transition-right');
    BTN_PREV.removeEventListener('click', moveLeft);
    BTN_NEXT.removeEventListener('click', moveRight);
    prevButtonClicked = 'next';
  };

  BTN_PREV.addEventListener('click', moveLeft);
  BTN_NEXT.addEventListener('click', moveRight);

  CAROUSEL.addEventListener('animationend', (animationEvent) => {
    newSlide = generateCardSets(cards, newCountCards || countCards, activSlide);

    if (animationEvent.animationName === 'move-left') {
      CAROUSEL.classList.remove('transition-left');
      ITEM_ACTIVE.innerHTML = ITEM_LEFT.innerHTML;
      ITEM_LEFT.innerHTML = '';
      newSlide.forEach((card) => ITEM_LEFT.append(createCard(card)));
      prevSlide = newSlide;
    } else {
      CAROUSEL.classList.remove('transition-right');
      ITEM_ACTIVE.innerHTML = ITEM_RIGHT.innerHTML;
      ITEM_RIGHT.innerHTML = '';
      newSlide.forEach((card) => ITEM_RIGHT.append(createCard(card)));
      nextSlide = newSlide;
    }
    btns = document.querySelectorAll('[data-showcard]');
    btns.forEach((btn) => {
      btn.onclick = handler;
    });

    BTN_PREV.addEventListener('click', moveLeft);
    BTN_NEXT.addEventListener('click', moveRight);
  });

  function getCountCards(screenWidth) {
    return screenWidth > 1200 ? 3 : screenWidth < 740 ? 1 : 2;
  }
  // Функция, которая будет вызываться при изменении ширины экрана

  function handleResize() {
    const screenWidth = window.innerWidth;
    const updatedCountCards = getCountCards(screenWidth);
    if (updatedCountCards !== countCards) {
      countCards = updatedCountCards;
      let startCards = generateCardSets(cards, countCards);
      renderCards(startCards);
      newCountCards = updatedCountCards;
      prevSlide = startCards[0];
      activSlide = startCards[1];
      nextSlide = startCards[2];
      prevButtonClicked = null;
      btns = document.querySelectorAll('[data-showcard]');
      btns.forEach((btn) => {
        btn.onclick = handler;
      });
    }
  }
  // Добавление обработчика события на изменение ширины экрана
  window.addEventListener('resize', handleResize);

  // Функция, которая будет генерировать уникальные наборы карточек
  function generateCardSets(cards, count, save) {
    if (save) {
      const slide = generateUniqueCards(
        cards.filter((card) => !save.includes(card)),
        count
      );
      return slide;
    }
    const set1 = generateUniqueCards(cards, count);
    const set2 = generateUniqueCards(
      cards.filter((card) => !set1.includes(card)),
      count
    );
    const remainingCards = cards.filter(
      (card) => !set1.includes(card) && !set2.includes(card)
    );
    const set3 = generateUniqueCards(
      [...remainingCards, set1[Math.floor(Math.random() * set1.length)]],
      count
    );
    return [set1, set2, set3];
  }
  // Функция, которая будет генерировать уникальные карточки для набора
  function generateUniqueCards(cards, count) {
    const uniqueCards = [];
    while (uniqueCards.length < count) {
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      if (!uniqueCards.some((card) => card.id === randomCard.id)) {
        uniqueCards.push(randomCard);
      }
    }
    return uniqueCards;
  }

  function renderCards(cards) {
    // Очищаем контейнеры от старых карточек
    ITEM_LEFT.innerHTML = '';
    ITEM_ACTIVE.innerHTML = '';
    ITEM_RIGHT.innerHTML = '';

    cards[0].forEach((card) => ITEM_LEFT.append(createCard(card)));
    cards[1].forEach((card) => ITEM_ACTIVE.append(createCard(card)));
    cards[2].forEach((card) => ITEM_RIGHT.append(createCard(card)));
  }

  function createCard(card) {
    const cardElem = document.createElement('div');
    cardElem.classList.add('cards__card');
    cardElem.dataset.showcard = `${card.name}`;
    cardElem.innerHTML = `
      <img src="${card.img}" alt="${card.name} ${card.type}">
      <h3>${card.name}</h3>
      <button class="button button-secondary">Learn more</button>
    `;
    return cardElem;
  }
  //////////////////////////////////
}
