export default function usePopUp(card) {
  const POP_UP = document.querySelector('#pop-up');
  POP_UP.classList.add('pop-up-open');
  document.body.style.overflow = 'hidden';
  const {
    name,
    img,
    type,
    breed,
    description,
    age,
    inoculations,
    diseases,
    parasites,
  } = card;
  const popupElem = document.createElement('div');
  popupElem.classList.add('pop-up__container');
  popupElem.innerHTML = `
    <button class="btn-circle pop-up__close"><span class="close"></span></button>  
    <div class="pop-up__content">
      <div class="pop-up__img">
        <img src="${img}" alt="">
      </div>
      <div class="pop-up__info info">
       <h2 class="info__title">${name}</h2>
       <h3 class="info__subtitle">${type} - ${breed}</h3> 
       <p class="info__text">${description}</p>
       <ul class="info__list">
        <li class="list-item">
          <span class="list-item__title">Age:</span>
          <span class="list-item__value">${age}</span>
        </li>
        <li class="list-item">
          <span class="list-item__title">Inoculations:</span>
          <span class="list-item__value">${inoculations.join(', ')}</span>
        </li>
        <li class="list-item">
          <span class="list-item__title">Diseases:</span>
          <span class="list-item__value">${diseases.join(', ')}</span>
        </li>
        <li class="list-item">
          <span class="list-item__title">Parasites:</span>
          <span class="list-item__value">${parasites.join(', ')}</span>
        </li>
       </ul>
      </div>
    </div>
    `;
  POP_UP.append(popupElem);
  const BTN_CLOSE = popupElem.querySelector('.pop-up__close');
  POP_UP.addEventListener('click', (e) => {
    if (e.target == BTN_CLOSE || !e.target.closest('.pop-up__content')) {
      POP_UP.classList.remove('pop-up-open');
      document.body.style.overflow = '';
      POP_UP.innerHTML = '';
    }
  });
}
