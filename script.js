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
const keeperLog = document.querySelector('[data-keeper-log]');
const keeperForm = document.querySelector('[data-keeper-form]');
const keeperInput = document.querySelector('[data-keeper-input]');

let isRecovering = false;
let recoveryTimeline;
let recoveryTrigger;
let keeperTimeline;
let keeperReplyTimer;
let keeperTyping;

const setBrickStatus = (message) => {
  if (brickStatus) brickStatus.textContent = message;
};

const showRecord = () => {
  if (recoveryTrigger === brick) {
    setBrickStatus('Record recovered. Opening the full FocusTube case study.');
    window.location.assign('focus.html');
    return;
  }

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
    window.brick3D?.recover({ mobile: window.matchMedia('(max-width: 620px)').matches, reduced: reducedMotion.matches });
    window.setTimeout(showRecord, reducedMotion.matches ? 80 : 1450);
    return;
  }

  const mobile = window.matchMedia('(max-width: 620px)').matches;
  const xPercent = mobile ? 50 : 0;
  const webglBrick = window.brick3D;
  recoveryTimeline?.kill();
  recoveryTimeline = animation.timeline({
    defaults: { ease: 'power2.out' },
    onComplete: showRecord
  });

  if (brickCallout) {
    recoveryTimeline.to(brickCallout, { autoAlpha: 0, y: -8, duration: .2 });
  }

  if (webglBrick) {
    webglBrick.recover({ mobile });
    const clock = { progress: 0 };
    recoveryTimeline
      .to(brickCavity, { autoAlpha: 1, scale: .98, duration: .22 }, .34)
      .to(brickDust, { autoAlpha: .85, scale: 1.18, rotation: 4, duration: .2 }, '<')
      .to(brickTray, { autoAlpha: 1, y: 0, duration: .28 }, '<.04')
      .to(clock, { progress: 1, duration: .95, ease: 'none' }, .34)
      .to(brickDust, { autoAlpha: 0, duration: .24 }, '-=.24');
    return;
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
      x: mobile ? 0 : -18,
      xPercent,
      y: mobile ? 88 : 102,
      z: 124,
      rotationX: 58,
      rotationY: -12,
      rotationZ: 7,
      scale: 1.01,
      duration: .34,
      ease: 'power1.in'
    })
    .to(brick, {
      x: mobile ? 0 : 24,
      xPercent,
      y: mobile ? 180 : 210,
      z: 34,
      rotationX: 150,
      rotationY: 14,
      rotationZ: 6,
      scale: .98,
      duration: .32,
      ease: 'power2.in'
    })
    .to(brick, { y: mobile ? 168 : 198, z: 42, rotationX: 142, duration: .14, ease: 'power2.out' })
    .to(brick, { y: mobile ? 180 : 210, z: 34, rotationX: 150, duration: .11, ease: 'power1.in' })
    .to(brickDust, { autoAlpha: 0, duration: .28 }, '-=.3');
};

reducedMotion.addEventListener('change', (event) => {
  if (!event.matches || !isRecovering || recordDialog?.open) return;
  recoveryTimeline?.kill();
  recoveryTimeline = undefined;
  if (animation) {
    animation.set([brick, brickCallout, brickCavity, brickDust, brickTray].filter(Boolean), { clearProps: 'all' });
  }
  window.brick3D?.recover({ mobile: window.matchMedia('(max-width: 620px)').matches, reduced: true });
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
  window.brick3D?.reset();
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
  if (!animation || reducedMotion.matches) {
    keeperInput?.focus();
    return;
  }

  keeperTimeline?.kill();
  keeperTimeline = animation.timeline({ defaults: { ease: 'power2.out' } })
    .from(keeperDialog, { autoAlpha: 0, scale: .96, y: 18, duration: .32 })
    .from('.keeper-dialog__manuscript', { scaleX: .08, transformOrigin: '50% 50%', duration: .48, ease: 'power3.inOut' }, '<.04')
    .from('.keeper-dialog__keeper img', { autoAlpha: 0, y: 22, duration: .4 }, '-=.18')
    .from('.keeper-dialog__header, .keeper-dialog__body, .keeper-dialog__prompts, .keeper-dialog__composer, .keeper-dialog__guardrail', {
      autoAlpha: 0,
      y: 8,
      duration: .24,
      stagger: .045
    }, '-=.2')
    .call(() => keeperInput?.focus());
});

keeperDialog?.addEventListener('close', () => {
  clearTimeout(keeperReplyTimer);
  keeperTyping?.remove();
  keeperTyping = undefined;
  if (keeperInput) keeperInput.disabled = false;
  keeperTimeline?.kill();
  keeperTimeline = undefined;
  if (animation) {
    animation.set([
      keeperDialog,
      keeperDialog.querySelector('.keeper-dialog__manuscript'),
      keeperDialog.querySelector('.keeper-dialog__keeper img'),
      ...keeperDialog.querySelectorAll('.keeper-dialog__header, .keeper-dialog__body, .keeper-dialog__prompts, .keeper-dialog__composer, .keeper-dialog__guardrail')
    ].filter(Boolean), { clearProps: 'all' });
  }
  keeperLaunch?.focus();
});

const keeperRecords = [
  {
    matches: /focus|youtube|extension|privacy|playback|broke|problem/i,
    answer: 'YouTube rebuilt parts of its interface during navigation, which erased the focus state. FocusTube observes route and DOM changes, then restores the experience without interrupting playback or collecting browsing data.',
    source: 'Recovered record 01 · FocusTube',
    href: 'focus.html'
  },
  {
    matches: /nalanda|inspiration|root|preserv|library|story/i,
    answer: 'The portfolio borrows the logic of conservation: understand what changed, intervene carefully and preserve what still works. Nalanda is the personal origin of that metaphor, presented as an artistic interpretation rather than a reconstruction.',
    source: 'Builder manuscript · Nalanda context',
    href: 'about.html'
  },
  {
    matches: /aws|architecture|amplify|cloud|host|deploy|cost|free/i,
    answer: 'The production portfolio is a static package hosted by AWS Amplify in Sydney. It works without a model call. API Gateway, Lambda and Bedrock remain an optional future route, so this Keeper currently costs nothing to answer.',
    source: 'AWS architecture ledger',
    href: 'architecture.html'
  },
  {
    matches: /skill|stack|technology|technologies|react|python|node|build|engineer/i,
    answer: 'Anmol works across interfaces, backend systems, data and cloud delivery. The strongest verified example is FocusTube, where browser behavior, privacy constraints and resilient state restoration meet in one shipped extension.',
    source: 'Skills instrument · Verified work',
    href: 'skills.html'
  },
  {
    matches: /project|work|github|source|portfolio/i,
    answer: 'FocusTube is the complete recovered record with public source and a working Edge listing. ArogyaAI and InsiderEdge remain clearly marked as provisional until their ownership and evidence are verified.',
    source: 'Recovered project archive',
    href: 'projects.html'
  },
  {
    matches: /contact|email|hire|reach|talk|connect/i,
    answer: 'You can reach Anmol directly by email, GitHub or LinkedIn. The contact page exposes those destinations without storing a message or using a form backend.',
    source: 'Direct correspondence desk',
    href: 'contact.html'
  },
  {
    matches: /anmol|who|student|about/i,
    answer: 'Anmol Patel is a software engineering student from Nalanda, Bihar. He builds practical products where technology meets people and real-world problems, with a focus on full-stack systems and AI.',
    source: 'About the builder',
    href: 'about.html'
  }
];

const addKeeperMessage = (speaker, text, record) => {
  if (!keeperLog) return;
  const message = document.createElement('article');
  message.className = 'keeper-message';
  message.dataset.speaker = speaker;

  const label = document.createElement('span');
  label.className = 'keeper-message__speaker';
  label.textContent = speaker === 'keeper' ? 'Keeper' : 'You';
  const copy = document.createElement('p');
  copy.textContent = text;
  message.append(label, copy);

  if (record) {
    const source = document.createElement('a');
    source.href = record.href;
    source.textContent = record.source;
    message.append(source);
  }

  keeperLog.append(message);
  keeperLog.scrollTop = keeperLog.scrollHeight;
  if (animation && !reducedMotion.matches) {
    animation.from(message, { autoAlpha: 0, y: 8, duration: .28, ease: 'power2.out' });
  }
};

const askKeeper = (value) => {
  const question = value.trim().replace(/\s+/g, ' ').slice(0, 180);
  if (!question || !keeperLog || !keeperInput) return;
  clearTimeout(keeperReplyTimer);
  keeperTyping?.remove();
  addKeeperMessage('visitor', question);
  keeperInput.value = '';
  keeperInput.disabled = true;

  keeperTyping = document.createElement('p');
  keeperTyping.className = 'keeper-typing';
  keeperTyping.setAttribute('role', 'status');
  keeperTyping.textContent = 'The Keeper is consulting the archive';
  keeperLog.append(keeperTyping);
  keeperLog.scrollTop = keeperLog.scrollHeight;

  keeperReplyTimer = setTimeout(() => {
    keeperTyping?.remove();
    keeperTyping = undefined;
    const record = keeperRecords.find((candidate) => candidate.matches.test(question));
    addKeeperMessage(
      'keeper',
      record?.answer || 'That question is outside the preserved records I can verify. Ask about Anmol, FocusTube, skills, Nalanda, AWS hosting, projects or contact details.',
      record
    );
    keeperInput.disabled = false;
    keeperInput.focus();
  }, reducedMotion.matches ? 0 : 520);
};

keeperForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  askKeeper(keeperInput.value);
});

document.querySelectorAll('[data-keeper-prompt]').forEach((button) => {
  button.addEventListener('click', () => askKeeper(button.dataset.keeperPrompt));
});

console.assert(hero && recordDialog && keeperDialog, 'Core interactive elements must exist.');
