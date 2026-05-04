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
    document.body.style.top = `-${scrollY}px`;
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

    burger.classList.remove('open');
    menuOverlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);

    setTimeout(() => {
      const section = document.querySelector(target);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }, 420);
  });
});

// ── Contact Form ──────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');
const btnText     = document.getElementById('btnText');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  btnText.textContent = 'იგზავნება...';

  const templateParams = {
    from_name:  document.getElementById('from_name').value,
    from_email: document.getElementById('from_email').value,
    message:    document.getElementById('message').value
  };

  emailjs.send('service_upv5ldx', 'template_9zo3mkh', templateParams)
    .then(function () {
      btnText.textContent    = 'გაგზავნა';
      formStatus.textContent = '✓ შეტყობინება გაიგზავნა!';
      formStatus.className   = 'form_status success';
      contactForm.reset();
    })
    .catch(function () {
      btnText.textContent    = 'გაგზავნა';
      formStatus.textContent = '✗ შეცდომა. სცადეთ თავიდან.';
      formStatus.className   = 'form_status error';
    });
});

// ── Materials scroll animation ────────────────────
function initMaterials() {
  const items = document.querySelectorAll('.material-item');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:  0.05,
    rootMargin: '0px 0px -20px 0px'
  });

  items.forEach(function (item) {
    // if already visible on load, show immediately
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      item.classList.add('is-visible');
    } else {
      observer.observe(item);
    }
  });
}

// run after everything is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMaterials);
} else {
  initMaterials();
}