window.addEventListener("DOMContentLoaded", () => {
    const siteHeader = document.getElementById('siteHeader');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    function setHeaderState() {
      if (window.scrollY > 12) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    function openMenu() {
      mobileMenu.classList.add('open');
      menuOverlay.classList.add('show');
      menuToggle.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      menuOverlay.classList.remove('show');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) closeMenu();
      else openMenu();
    });

    menuOverlay.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    window.addEventListener('scroll', setHeaderState);
    window.addEventListener('load', setHeaderState);

    const revealItems = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealItems.forEach(item => revealObserver.observe(item));

    const statNumbers = document.querySelectorAll('.stat-number');
    let statsStarted = false;

    function animateValue(el, endValue, suffix = '') {
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * endValue);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsStarted) {
          statsStarted = true;
          statNumbers.forEach(stat => {
            animateValue(stat, Number(stat.dataset.target), stat.dataset.suffix || '');
          });
        }
      });
    }, { threshold: 0.35 });

    const statsGrid = document.getElementById('statsGrid');
    if (statsGrid) statsObserver.observe(statsGrid);

    const satisfactionCounter = document.getElementById('satisfactionCounter');
    let satisfactionStarted = false;
    const satisfactionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !satisfactionStarted) {
          satisfactionStarted = true;
          const end = 98;
          const duration = 1200;
          const startTime = performance.now();

          function update(currentTime) {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            satisfactionCounter.textContent = Math.floor(eased * end) + '%';
            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
        }
      });
    }, { threshold: 0.45 });

    if (satisfactionCounter) satisfactionObserver.observe(satisfactionCounter);

    const typingText = document.getElementById('typingText');
    const phrases = [
      'Connecting people with care.',
      'Making wellbeing support easier to access.',
      'Helping communities thrive together.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];
      if (!deleting) {
        typingText.textContent = currentPhrase.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentPhrase.length) {
          deleting = true;
          setTimeout(typeLoop, 1600);
          return;
        }
      } else {
        typingText.textContent = currentPhrase.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      const speed = deleting ? 42 : 65;
      setTimeout(typeLoop, speed);
    }

    typeLoop();

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });
});