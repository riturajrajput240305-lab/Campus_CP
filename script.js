const revealItems = document.querySelectorAll('.panel, .platform-grid article, .stats div, .steps article');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('in-view');
      currentObserver.unobserve(target);
    });
  }, { threshold: .18 });

  revealItems.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index * 45, 180)}ms`);
    observer.observe(element);
  });
} else {
  revealItems.forEach((element) => element.classList.add('in-view'));
}
