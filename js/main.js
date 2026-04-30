const burger      = document.getElementById('burger');
const menuOverlay = document.getElementById('menuOverlay');
const menuLinks   = document.querySelectorAll('.menu-link');

let scrollY = 0;

// ── open / close burger ──────────────────────────
burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('open');
  menuOverlay.classList.toggle('open');

  if (isOpen) {
    scrollY = window.scrollY;
    document.body.style.top    = `-${scrollY}px`;
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }
});

// ── click link → close menu → scroll to section ─
menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const target = link.getAttribute('href');

    // close menu
    burger.classList.remove('open');
    menuOverlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);

    // wait for overlay to close then scroll
    setTimeout(() => {
      const section = document.querySelector(target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 420);
  });
});
// ── Contact Form ──────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');
const btnText     = document.getElementById('btnText');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();

  btnText.textContent = 'იგზავნება...';

  const templateParams = {
    from_name: document.getElementById('from_name').value,
    from_email: document.getElementById('from_email').value,
    message: document.getElementById('message').value
  };

  emailjs.send('service_upv5ldx', 'template_9zo3mkh', templateParams)
    .then(function(response) {
      console.log('SUCCESS!', response);

      btnText.textContent = 'გაგზავნა';
      formStatus.textContent = '✓ შეტყობინება გაიგზავნა!';
      formStatus.style.color = 'green';

      contactForm.reset();
    })
    .catch(function(error) {
      console.log('FAILED...', error);

      btnText.textContent = 'გაგზავნა';
      formStatus.textContent = '✗ შეცდომა. სცადეთ თავიდან.';
      formStatus.style.color = 'red';
    });
});