// ── About Overlay ──
function openAboutOverlay() {
  const overlay = document.getElementById('about-overlay');
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  overlay.scrollTop = 0;
}
function closeAboutOverlay() {
  document.getElementById('about-overlay').classList.remove('is-open');
  document.body.style.overflow = '';
}
// Close overlay on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeAboutOverlay();
});

// ── Offer Slider — scroll-driven ──
(function() {
  var section = document.getElementById('what-we-offer');
  if (!section) return;

  var panels = section.querySelectorAll('.offer-panel');
  var dashes = section.querySelectorAll('.offer-nav-dash');
  var count   = panels.length;
  var current = -1;

  var wrap = section.querySelector('.offer-wrap');

  function goTo(idx) {
    if (idx === current) return;
    if (current >= 0) {
      panels[current].classList.remove('is-active');
      dashes[current].classList.remove('is-active');
    }
    current = idx;
    panels[current].classList.add('is-active');
    dashes[current].classList.add('is-active');
    // Toggle nav colour for light panels
    if (panels[current].classList.contains('offer-light')) {
      wrap.classList.add('offer-wrap-light');
    } else {
      wrap.classList.remove('offer-wrap-light');
    }
  }

  // Scroll handler — measure from when sticky pins (rect.top = 0)
  function onScroll() {
    var rect     = section.getBoundingClientRect();
    var scrolled = Math.max(0, -rect.top);            // 0 when sticky pins
    var total    = section.offsetHeight - window.innerHeight; // total scrollable px
    var progress = Math.min(1, scrolled / total);
    var idx      = Math.min(count - 1, Math.floor(progress * count));
    goTo(idx);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init on load

  // Click on dashes → scroll to that panel's position
  dashes.forEach(function(d) {
    d.addEventListener('click', function() {
      var idx    = parseInt(this.getAttribute('data-target'));
      var total  = section.offsetHeight - window.innerHeight;
      var target = section.offsetTop + (idx / count) * total;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });
})();