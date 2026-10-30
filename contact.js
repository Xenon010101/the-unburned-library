const animation = window.gsap;
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const portrait = document.querySelector('[data-contact-portrait]');
const contactDesk = document.querySelector('[data-contact-desk]');

if (animation) {
  const motion = animation.matchMedia();

  motion.add('(prefers-reduced-motion: no-preference)', () => {
    const timeline = animation.timeline({ defaults: { ease: 'power2.out' } });

    timeline
      .addLabel('open')
      .from('.site-header', { autoAlpha: 0, y: -18, duration: .4 }, 'open')
      .from('[data-contact-copy]', { autoAlpha: 0, y: 16, duration: .44, stagger: .07 }, 'open+=.14')
      .from(contactDesk, { autoAlpha: 0, x: -18, scaleX: .94, transformOrigin: 'left center', duration: .62 }, 'open+=.32')
      .from('.contact-letter__seal', { autoAlpha: 0, scale: .76, rotation: -12, duration: .36 }, 'open+=.58')
      .from('.contact-route', { autoAlpha: 0, y: 12, duration: .34, stagger: .08 }, 'open+=.62')
      .from('.contact-proof', { autoAlpha: 0, y: 8, duration: .3 }, 'open+=.76')
      .from(portrait, { autoAlpha: 0, x: 26, rotationY: -4, transformOrigin: '50% 50%', duration: .68 }, 'open+=.3');

    return () => timeline.kill();
  });
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
});

nav?.addEventListener('click', (event) => {
  if (!(event.target instanceof HTMLAnchorElement)) return;
  menuButton?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
});

console.assert(portrait && contactDesk && document.querySelectorAll('.contact-route').length === 2, 'Contact page must expose the portrait, primary email and two public profiles.');
