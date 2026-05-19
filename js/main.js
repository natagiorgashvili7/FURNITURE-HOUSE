// burger menu
const burger      = document.getElementById('burger');
const menuOverlay = document.getElementById('menuOverlay');
const menuLinks   = document.querySelectorAll('.menu-link');

let scrollY = 0;

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

// contact form
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


// material scroll
function initMaterials() {
  const list  = document.querySelector('.materials-list');
  const items = document.querySelectorAll('.material-item');
  if (!items.length) return;

  list.classList.add('animate');

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
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  items.forEach(function (item) {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      item.classList.add('is-visible');
    } else {
      observer.observe(item);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMaterials);
} else {
  initMaterials();
}


// collection
(function () {
  'use strict';

  const grid       = document.getElementById('collectionGrid');
  const filterBtns = document.querySelectorAll('.filter_btn');
  if (!grid || typeof PRODUCTS === 'undefined') return;

  function buildCard(product) {
    const card = document.createElement('div');
    card.className  = 'product_card';
    card.dataset.room = product.room;

    const photosWrap = document.createElement('div');
    photosWrap.className = 'card_photos';

    const track = document.createElement('div');
    track.className = 'photos_track';

    product.photos.forEach(function (src, idx) {
      const slide = document.createElement('div');
      slide.className = 'photo_slide';

      const img = document.createElement('img');
      img.alt  = product.name + ' — photo ' + (idx + 1);
      img.src  = src;

      img.onerror = function () {
        slide.classList.add('no-image');
        slide.dataset.label = product.roomLabel;
        img.style.display = 'none';
      };

      slide.appendChild(img);
      track.appendChild(slide);
    });

    photosWrap.appendChild(track);

    const dotsEl = document.createElement('div');
    dotsEl.className = 'photo_dots';
    product.photos.forEach(function (_, idx) {
      const dot = document.createElement('div');
      dot.className = 'photo_dot' + (idx === 0 ? ' active' : '');
      dotsEl.appendChild(dot);
    });
    photosWrap.appendChild(dotsEl);

    if (product.photos.length > 1) {
      ['prev', 'next'].forEach(function (dir) {
        const btn = document.createElement('button');
        btn.className = 'photo_arrow ' + dir;
        btn.setAttribute('aria-label', dir === 'prev' ? 'Previous photo' : 'Next photo');
        btn.innerHTML = dir === 'prev' ? '&#8592;' : '&#8594;';
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          scrollBySlide(track, dotsEl, dir === 'prev' ? -1 : 1, product.photos.length);
        });
        photosWrap.appendChild(btn);
      });
    }

    const info = document.createElement('div');
    info.className = 'card_info';
    info.innerHTML =
      '<p class="card_room_label">' + product.roomLabel + '</p>' +
      '<h3 class="card_name">'      + product.name      + '</h3>' +
      '<p class="card_desc">'       + product.description + '</p>';

    card.appendChild(photosWrap);
    card.appendChild(info);

    track.addEventListener('scroll', function () {
      syncDots(track, dotsEl, product.photos.length);
    }, { passive: true });

    enableDrag(track);

    return card;
  }

  
  function scrollBySlide(track, dotsEl, delta, total) {
    var w       = track.offsetWidth;
    var current = Math.round(track.scrollLeft / w);
    var next    = Math.max(0, Math.min(total - 1, current + delta));
    track.scrollTo({ left: next * w, behavior: 'smooth' });
    updateDots(dotsEl, next);
  }

  function syncDots(track, dotsEl, total) {
    var w = track.offsetWidth;
    if (!w) return;
    var idx = Math.round(track.scrollLeft / w);
    idx = Math.max(0, Math.min(total - 1, idx));
    updateDots(dotsEl, idx);
  }

  function updateDots(dotsEl, activeIdx) {
    dotsEl.querySelectorAll('.photo_dot').forEach(function (d, i) {
      d.classList.toggle('active', i === activeIdx);
    });
  }

  function enableDrag(track) {
    var startX, scrollLeft, dragging = false;

    track.addEventListener('mousedown', function (e) {
      dragging   = true;
      startX     = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.classList.add('is-dragging');
    });

    document.addEventListener('mouseup', function () {
      dragging = false;
      track.classList.remove('is-dragging');
    });

    track.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX);
    });
  }


  function render(room) {
    grid.innerHTML = '';
    var filtered = room === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(function (p) { return p.room === room; });

    filtered.forEach(function (product) {
      grid.appendChild(buildCard(product));
    });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      render(btn.dataset.room);
    });
  });

  render('all');

})();