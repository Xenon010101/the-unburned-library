const animation = window.gsap;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const manuscript = document.querySelector('[data-manuscript]');
const manuscriptPaper = manuscript?.querySelector('.manuscript__paper');
const leftRoller = manuscript?.querySelector('.manuscript__roller--left');
const rightRoller = manuscript?.querySelector('.manuscript__roller--right');
const manuscriptContent = manuscriptPaper?.children;
const browserStudy = document.querySelector('[data-browser-study]');
const previewImage = document.querySelector('[data-preview-image]');
const previewTitle = document.querySelector('[data-preview-title]');
const previewCaption = document.querySelector('[data-preview-caption]');

const previewStates = {
  before: {
    title: 'Before focus mode',
    source: 'assets/focustube-before.png',
    alt: 'YouTube watch page before FocusTube, with recommendations, navigation, metadata and the extension popup visible',
    caption: 'Before — the video competes with recommendations, comments, navigation and metadata.'
  },
  after: {
    title: 'Focus mode active',
    source: 'assets/focustube-after.png',
    alt: 'YouTube watch page after FocusTube removes surrounding distractions while preserving the video player',
    caption: 'After — the player remains while recommendations, comments and navigation clutter are removed.'
  }
};

document.querySelectorAll('[data-preview]').forEach((button) => {
  button.addEventListener('click', () => {
    const state = previewStates[button.dataset.preview];
    if (!state) return;
    document.querySelectorAll('[data-preview]').forEach((candidate) => {
      candidate.setAttribute('aria-pressed', String(candidate === button));
    });
    browserStudy.classList.toggle('is-after', button.dataset.preview === 'after');
    previewImage.src = state.source;
    previewImage.alt = state.alt;
    previewTitle.textContent = state.title;
    previewCaption.textContent = state.caption;
  });
});

if (animation && !reducedMotion.matches && manuscriptPaper && leftRoller && rightRoller) {
  const manuscriptBounds = manuscript.getBoundingClientRect();
  const leftBounds = leftRoller.getBoundingClientRect();
  const rightBounds = rightRoller.getBoundingClientRect();
  const leftTravel = manuscriptBounds.width / 2 - (leftBounds.left - manuscriptBounds.left + leftBounds.width / 2);
  const rightTravel = manuscriptBounds.width / 2 - (manuscriptBounds.right - rightBounds.right + rightBounds.width / 2);

  animation.set(manuscriptContent, { autoAlpha: 0, y: 8 });
  animation.set([manuscriptPaper, leftRoller, rightRoller], { willChange: 'transform' });

  animation.timeline({
    defaults: { ease: 'power2.out' },
    onComplete: () => animation.set([manuscriptPaper, leftRoller, rightRoller], { clearProps: 'willChange' })
  })
    .from('.site-header', { autoAlpha: 0, y: -18, duration: .42 })
    .from('[data-record-copy]', { autoAlpha: 0, y: 16, duration: .42, stagger: .07 }, '-=.15')
    .addLabel('unfurl', '-=.18')
    .from(manuscriptPaper, { scaleX: .035, rotationX: 5, transformOrigin: '50% 50%', duration: 1.05, ease: 'power3.inOut' }, 'unfurl')
    .from(leftRoller, { x: leftTravel, rotationY: -72, duration: 1.05, ease: 'power3.inOut' }, 'unfurl')
    .from(rightRoller, { x: -rightTravel, rotationY: 72, duration: 1.05, ease: 'power3.inOut' }, 'unfurl')
    .to(manuscriptContent, { autoAlpha: 1, y: 0, duration: .38, stagger: .055 }, 'unfurl+=.72');
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

console.assert(manuscript && manuscriptPaper && leftRoller && rightRoller && browserStudy && previewImage && Object.keys(previewStates).length === 2, 'FocusTube record must expose its scroll and evidence states.');
