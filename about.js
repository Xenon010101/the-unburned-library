const animation = window.gsap;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const journeyDialog = document.querySelector('[data-journey-dialog]');
const portrait = document.querySelector('[data-about-portrait]');
const keeperImage = document.querySelector('[data-keeper-image]');
const keeperGlow = document.querySelector('[data-keeper-glow]');
const keeperCaption = document.querySelector('[data-keeper-caption]');
const leftLeaf = document.querySelector('[data-manuscript-left]');
const rightLeaf = document.querySelector('[data-manuscript-right]');
const keeperArrivalTargets = [portrait, keeperImage, keeperGlow, keeperCaption].filter(Boolean);

if (animation) {
  const motion = animation.matchMedia();
  motion.add({
    desktop: '(min-width: 901px)',
    mobile: '(max-width: 900px)',
    reduceMotion: '(prefers-reduced-motion: reduce)'
  }, ({ conditions }) => {
    if (conditions.reduceMotion) return;

    animation.timeline({
      defaults: { ease: 'power2.out' },
      onStart: () => animation.set(keeperArrivalTargets, { willChange: 'transform,opacity' }),
      onComplete: () => animation.set(keeperArrivalTargets, { clearProps: 'willChange' })
    })
      .addLabel('keeper-arrival', 0)
      .from('.site-header', { autoAlpha: 0, y: -18, duration: .42 }, 'keeper-arrival')
      .from('[data-about-copy]', { autoAlpha: 0, y: 20, duration: .58, stagger: .07 }, 'keeper-arrival+=.1')
      .from(portrait, { autoAlpha: 0, x: conditions.desktop ? 52 : 0, y: conditions.mobile ? 28 : 0, scale: .975, duration: .76, ease: 'power3.out' }, 'keeper-arrival+=.18')
      .from(keeperImage, { autoAlpha: 0, y: conditions.desktop ? 88 : 48, scale: .94, transformOrigin: '50% 100%', duration: .92, ease: 'power3.out' }, 'keeper-arrival+=.28')
      .from(keeperGlow, { autoAlpha: 0, scale: .18, duration: .9, ease: 'power2.out' }, 'keeper-arrival+=.64')
      .from(keeperCaption, { autoAlpha: 0, x: conditions.desktop ? 18 : 0, y: conditions.mobile ? 10 : 0, duration: .42 }, 'keeper-arrival+=.78');
  });
}

const openManuscript = () => {
  if (!journeyDialog || journeyDialog.open) return;
  journeyDialog.showModal();

  if (!animation || reducedMotion.matches) return;
  const mobile = window.matchMedia('(max-width: 620px)').matches;
  animation.set(leftLeaf, { rotationY: mobile ? 0 : 84, rotationX: mobile ? -72 : 0, autoAlpha: 0 });
  animation.set(rightLeaf, { rotationY: mobile ? 0 : -84, rotationX: mobile ? 72 : 0, autoAlpha: 0 });
  animation.timeline({ defaults: { ease: 'power3.out' } })
    .to([leftLeaf, rightLeaf], { autoAlpha: 1, duration: .16 })
    .to(leftLeaf, { rotationY: 0, rotationX: 0, duration: .72 })
    .to(rightLeaf, { rotationY: 0, rotationX: 0, duration: .72 }, '<.08')
    .from('.manuscript__leaf > *', { autoAlpha: 0, y: 10, duration: .3, stagger: .035 }, '-=.28');
};

document.querySelectorAll('[data-journey-open]').forEach((button) => button.addEventListener('click', openManuscript));
document.querySelector('[data-journey-close]')?.addEventListener('click', () => journeyDialog?.close());
journeyDialog?.addEventListener('click', (event) => {
  if (event.target === journeyDialog) journeyDialog.close();
});
journeyDialog?.addEventListener('close', () => {
  if (animation) animation.set([leftLeaf, rightLeaf].filter(Boolean), { clearProps: 'all' });
});

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

console.assert(journeyDialog && leftLeaf && rightLeaf && portrait && keeperImage && keeperGlow && keeperCaption, 'About page elements must exist.');
