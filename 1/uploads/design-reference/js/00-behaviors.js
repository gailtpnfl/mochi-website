// Nav scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  }, { passive: true });


  // Burger menu
  const burger = document.getElementById('burger');
  const mobMenu = document.getElementById('mob-menu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mob-menu a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobMenu.classList.remove('open');
    });
  });

  // Scroll reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Scroll progress bar
  (function() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    function updateBar() {
      const s = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? s / h : 0) + ')';
    }
    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  })();

  // srv-row click
  document.querySelectorAll('.srv-row').forEach(row => {
    row.addEventListener('click', () => window.open('https://discord.gg/ZGJm8vKUbz', '_blank'));
    row.setAttribute('role','link'); row.setAttribute('tabindex','0');
    row.addEventListener('keydown', e => { if(e.key==='Enter') window.open('https://discord.gg/ZGJm8vKUbz','_blank'); });
  });

  // FAQ accordion
  function toggleFaq(btn) {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }