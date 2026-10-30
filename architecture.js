const animation = window.gsap;
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const architecturePlan = document.querySelector('[data-architecture-plan]');
const motionTargets = document.querySelectorAll('.site-header, [data-architecture-copy], [data-architecture-plan], [data-core-node], [data-core-arrow], [data-deployment-fact], [data-optional-node], [data-optional-arrow]');

const resetMotionState = () => {
  if (!animation) return;
  animation.set(motionTargets, { clearProps: 'opacity,visibility,transform,willChange' });
};

if (animation) {
  const motion = animation.matchMedia();
  motion.add('(prefers-reduced-motion: no-preference)', () => {
    resetMotionState();
    animation.set(motionTargets, { willChange: 'transform, opacity' });
    const timeline = animation.timeline({ defaults: { ease: 'power2.out' }, onComplete: resetMotionState })
      .from('.site-header', { autoAlpha: 0, y: -18, duration: .42 })
      .from('[data-architecture-copy]', { autoAlpha: 0, y: 16, duration: .42, stagger: .07 }, '-=.15')
      .from(architecturePlan, { autoAlpha: 0, y: 20, rotationX: 4, transformOrigin: '50% 0%', duration: .55 }, '-=.18')
      .addLabel('corePath', '-=.1')
      .from('[data-core-node]', { autoAlpha: 0, scale: .92, duration: .34, stagger: .18 }, 'corePath')
      .from('[data-core-arrow]', { autoAlpha: 0, scaleX: 0, transformOrigin: '0% 50%', duration: .24, stagger: .18 }, 'corePath+=.12')
      .addLabel('deploymentProof', '+=.04')
      .from('[data-deployment-fact]', { autoAlpha: 0, y: 8, duration: .25, stagger: .07 }, 'deploymentProof')
      .addLabel('optionalPath', '+=.08')
      .from('[data-optional-node]', { autoAlpha: 0, y: 10, duration: .28, stagger: .1 }, 'optionalPath')
      .from('[data-optional-arrow]', { autoAlpha: 0, scaleX: 0, transformOrigin: '0% 50%', duration: .2, stagger: .1 }, 'optionalPath+=.06');

    return () => {
      timeline.kill();
      resetMotionState();
    };
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

console.assert(architecturePlan && document.querySelectorAll('[data-core-node]').length === 4 && document.querySelectorAll('[data-optional-node]').length === 5, 'Architecture plan must expose the core and optional paths.');
