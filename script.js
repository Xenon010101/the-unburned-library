const hero = document.querySelector('.hero');
const recordDialog = document.querySelector('[data-record-dialog]');
const keeperDialog = document.querySelector('[data-keeper-dialog]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const animation = window.gsap;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const brick = document.querySelector('[data-brick]');
const brickStage = document.querySelector('[data-brick-stage]');
const brickCallout = document.querySelector('[data-brick-callout]');
const brickCavity = document.querySelector('[data-brick-cavity]');
const brickDust = document.querySelector('[data-brick-dust]');
const brickTray = document.querySelector('[data-brick-tray]');
const brickStatus = document.querySelector('[data-brick-status]');
const folio = document.querySelector('[data-folio]');
const keeperLaunch = document.querySelector('[data-keeper-open]');

let isRecovering = false;
let recoveryTimeline;
let recoveryTrigger;
let keeperTimeline;

const setBrickStatus = (message) => {
  if (brickStatus) brickStatus.textContent = message;
};

const showRecord = () => {
  if (!recordDialog || recordDialog.open) return;

  const shouldAnimate = animation && !reducedMotion.matches && folio;
  if (shouldAnimate) {
    animation.set(folio, { autoAlpha: 0, scaleX: .12, rotationX: 8, transformOrigin: '50% 0%' });
  }

  recordDialog.showModal();
  setBrickStatus('Record recovered. Opening the FocusTube case study.');

  if (!shouldAnimate) return;
  animation.timeline({ defaults: { ease: 'power2.out' } })
    .to(folio, { autoAlpha: 1, scaleX: 1, rotationX: 0, duration: .58 })
    .from(folio.querySelectorAll('header, .folio__layers, .evidence, footer'), {
      autoAlpha: 0,
      y: 12,
      duration: .28,
      stagger: .05
    }, '-=.2');
};

const openRecord = (event) => {
  if (!hero || !recordDialog || !brick || recordDialog.open || isRecovering) return;

  recoveryTrigger = event?.currentTarget instanceof HTMLElement ? event.currentTarget : brick;
  isRecovering = true;
  brick.disabled = true;
  hero.classList.add('is-recovering');
  setBrickStatus('Recovering record 01 from the conservation wall.');

  if (!animation || reducedMotion.matches) {
    window.setTimeout(showRecord, reducedMotion.matches ? 80 : 1450);
    return;
  }

  const mobile = window.matchMedia('(max-width: 620px)').matches;
  const xPercent = mobile ? 50 : 0;
  recoveryTimeline?.kill();
  recoveryTimeline = animation.timeline({
    defaults: { ease: 'power2.out' },
    onComplete: showRecord
  });

  if (brickCallout) {
    recoveryTimeline.to(brickCallout, { autoAlpha: 0, y: -8, duration: .2 });
  }

  recoveryTimeline
    .to(brick, {
      x: mobile ? 0 : -72,
      xPercent,
      y: mobile ? -16 : 0,
      z: 160,
      rotationX: -18,
      rotationY: 24,
      rotationZ: -2,
      scale: 1.04,
      duration: .48,
      ease: 'power3.out'
    })
    .to(brickCavity, { autoAlpha: 1, scale: .98, duration: .22 }, '-=.18')
    .to(brickDust, { autoAlpha: .85, scale: 1.18, rotation: 4, duration: .2 }, '<')
    .to(brickTray, { autoAlpha: 1, y: 0, duration: .28 }, '<.04')
    .to(brick, {
      x: mobile ? 0 : 24,
      xPercent,
      y: mobile ? 180 : 210,
      z: 34,
      rotationX: 76,
      rotationY: 18,
      rotationZ: 10,
      scale: .98,
      duration: .62,
      ease: 'power2.in'
    })
    .to(brick, { y: mobile ? 168 : 198, rotationX: 69, duration: .14, ease: 'power2.out' })
    .to(brick, { y: mobile ? 180 : 210, rotationX: 76, duration: .11, ease: 'power1.in' })
    .to(brickDust, { autoAlpha: 0, duration: .28 }, '-=.3');
};

reducedMotion.addEventListener('change', (event) => {
  if (!event.matches || !isRecovering || recordDialog?.open) return;
  recoveryTimeline?.kill();
  recoveryTimeline = undefined;
  if (animation) {
    animation.set([brick, brickCallout, brickCavity, brickDust, brickTray].filter(Boolean), { clearProps: 'all' });
  }
  showRecord();
});

document.querySelectorAll('[data-recover]').forEach((trigger) => trigger.addEventListener('click', openRecord));
brick?.addEventListener('click', openRecord);

recordDialog?.addEventListener('close', () => {
  recoveryTimeline?.kill();
  recoveryTimeline = undefined;
  isRecovering = false;
  brick.disabled = false;
  hero?.classList.remove('is-recovering');
  setBrickStatus('Record 01 returned to the conservation wall.');
  if (animation) {
    animation.set([brick, brickCallout, brickCavity, brickDust, brickTray, folio].filter(Boolean), { clearProps: 'all' });
  }
  recoveryTrigger?.focus();
  recoveryTrigger = undefined;
});

if (animation && hero) {
  hero.classList.add('has-gsap');
  const motion = animation.matchMedia();
  motion.add({
    desktop: '(min-width: 901px)',
    mobile: '(max-width: 900px)',
    reduceMotion: '(prefers-reduced-motion: reduce)'
  }, ({ conditions }) => {
    if (conditions.reduceMotion) return;

    animation.timeline({ defaults: { ease: 'power2.out' } })
      .from('.site-header', { autoAlpha: 0, y: -20, duration: .48 })
      .from('[data-hero-copy]', { autoAlpha: 0, y: 20, duration: .6, stagger: .08 }, '-=.16')
      .from(brickStage, { autoAlpha: 0, x: conditions.desktop ? 34 : 0, y: conditions.mobile ? 24 : 0, duration: .68 }, '-=.36')
      .from(brick, { scale: .94, duration: .3 }, '<.18')
      .from(keeperLaunch, { autoAlpha: 0, y: 16, duration: .4 }, '-=.2');
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

const evidencePreview = document.querySelector('[data-evidence-preview]');
const evidenceImage = document.querySelector('[data-evidence-image]');
const evidenceCaption = document.querySelector('[data-evidence-caption]');
document.querySelectorAll('[data-evidence]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-evidence]').forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
    if (!evidencePreview || !evidenceImage || !evidenceCaption) return;
    const after = button.dataset.evidence === 'after';
    evidenceImage.src = after ? 'assets/focustube-after.png' : 'assets/focustube-before.png';
    evidenceImage.alt = after
      ? 'YouTube watch page after FocusTube removes surrounding distractions while preserving the video player'
      : 'YouTube watch page before FocusTube, with recommendations, navigation, metadata and the extension popup visible';
    evidenceCaption.textContent = after
      ? 'Verified after-state screenshot from the public FocusTube repository.'
      : 'Verified before-state screenshot from the public FocusTube repository.';
  });
});

keeperLaunch?.addEventListener('click', () => {
  if (!keeperDialog || keeperDialog.open) return;
  keeperDialog.showModal();
  if (!animation || reducedMotion.matches) return;

  keeperTimeline?.kill();
  keeperTimeline = animation.timeline({ defaults: { ease: 'power2.out' } })
    .from(keeperDialog, { autoAlpha: 0, scale: .96, y: 18, duration: .32 })
    .from('.keeper-dialog__manuscript', { scaleX: .08, transformOrigin: '50% 50%', duration: .48, ease: 'power3.inOut' }, '<.04')
    .from('.keeper-dialog__keeper img', { autoAlpha: 0, y: 22, duration: .4 }, '-=.18')
    .from('.keeper-dialog__header, .keeper-dialog__body, .keeper-dialog__prompts, .keeper-dialog__guardrail', {
      autoAlpha: 0,
      y: 8,
      duration: .24,
      stagger: .045
    }, '-=.2');
});

keeperDialog?.addEventListener('close', () => {
  keeperTimeline?.kill();
  keeperTimeline = undefined;
  if (animation) {
    animation.set([
      keeperDialog,
      keeperDialog.querySelector('.keeper-dialog__manuscript'),
      keeperDialog.querySelector('.keeper-dialog__keeper img'),
      ...keeperDialog.querySelectorAll('.keeper-dialog__header, .keeper-dialog__body, .keeper-dialog__prompts, .keeper-dialog__guardrail')
    ].filter(Boolean), { clearProps: 'all' });
  }
  keeperLaunch?.focus();
});

const keeperAnswers = {
  focus: 'YouTube rebuilt parts of its interface during navigation, erasing the focus state. FocusTube listens for DOM and route changes, then restores the experience without interrupting playback.<cite>Recovered record 01 · FocusTube</cite>',
  nalanda: 'The portfolio borrows the logic of conservation: understand what changed, intervene carefully and preserve what still works. It is an artistic interpretation, not a reconstruction.<cite>Portfolio context · Cultural framing</cite>',
  aws: 'The core site is static: GitHub deploys to AWS Amplify Hosting and its global CDN. API Gateway, Lambda and Bedrock are optional and only support the Keeper.<cite>AWS architecture record</cite>'
};

document.querySelectorAll('[data-question]').forEach((button) => {
  button.addEventListener('click', () => {
    const answer = keeperAnswers[button.dataset.question];
    const output = document.querySelector('[data-keeper-answer]');
    if (!answer || !output) return;
    document.querySelectorAll('[data-question]').forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
    output.innerHTML = `<p>${answer}</p>`;
    if (animation && !reducedMotion.matches) {
      animation.fromTo(output, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .3, ease: 'power2.out', overwrite: 'auto' });
    }
  });
});

console.assert(hero && recordDialog && keeperDialog, 'Core interactive elements must exist.');
