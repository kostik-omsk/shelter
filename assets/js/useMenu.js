export default function useMenu() {
  const body = document.querySelector('body');
  const menuBtn = document.querySelector('.header__burger');
  const navList = document.querySelector('.header__nav');

  body.addEventListener('click', (e) => {
    let click = e.target;
    if (
      click.closest('.header__burger') ||
      (click.closest('.nav__link') && click.closest('.open')) ||
      (click.closest('.open') && !click.closest('.header__nav'))
    ) {
      menuBtn.classList.toggle('open');
      body.classList.toggle('open');
      navList.classList.toggle('open');
    }
  });

  function toggleWidth() {
    setTimeout(() => {
      const screenWidth = window.innerWidth;
      if (screenWidth > 750) {
        menuBtn.classList.remove('open');
        body.classList.remove('open');
        navList.classList.remove('open');
      }
    }, 1000);
  }

  window.addEventListener('resize', toggleWidth);
}
