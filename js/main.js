//burger menu
const burger = document.getElementById('burger');
const menuOverlay = document.getElementById('menuOverlay');
const menuLinks = document.querySelectorAll('.menu-link');

// Toggle menu open/close
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  menuOverlay.classList.toggle('open');
  document.body.classList.toggle('no-scroll');
});

// Close menu when a link is clicked
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    menuOverlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
  });
});

