const animation = window.gsap;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const artifact = document.querySelector('[data-project-artifact]');
const artifactImage = document.querySelector('[data-artifact-image]');
const artifactPlaceholder = document.querySelector('[data-artifact-placeholder]');
const artifactNote = document.querySelector('[data-artifact-note]');
const folio = document.querySelector('[data-project-folio]');
const projectPrimaryLink = document.querySelector('[data-project-primary-link]');
const projectSourceLink = document.querySelector('[data-project-source-link]');
let transitionTimeline;

const records = {
  focus: {
    status: 'Recovered record 01', title: 'FocusTube',
    summary: 'A privacy-conscious browser extension for distraction-free learning.',
    broke: 'YouTube’s single-page navigation replaced interface regions and erased the focus state.',
    changed: 'A MutationObserver, navigation signals and per-tab session state restore the experience after transitions.',
    survived: 'Playback, user control, preferences and privacy survive without an account or backend.',
    system: 'Navigation signal, DOM observer, then restored focus state.',
    boundary: 'Browser-only. No account, analytics, remote code or backend.',
    tags: ['JavaScript', 'Browser extension', 'Privacy'], kind: 'focus', glyph: '◉',
    caption: 'Focused learning interface', label: 'Verified interface capture',
    image: 'assets/focustube-after.png',
    imageAlt: 'FocusTube active on a YouTube watch page, preserving the video while removing surrounding distractions',
    imageWidth: 1917, imageHeight: 966,
    artifactNote: 'Authentic before/after captures and public source evidence live inside the recovered record.',
    evidenceTitle: 'Evidence state: publicly verified',
    evidence: 'Public source, authentic before/after captures and the Edge Add-ons destination are attached to the recovered record.',
    primaryLink: { label: 'Open recovered record', href: 'focus.html' },
    sourceLink: { label: 'View source', href: 'https://github.com/Xenon010101/FocusTube' }
  },
  arogya: {
    status: 'Collaborative record 02', title: 'ArogyaAI',
    summary: 'A full-stack workflow that turns uploaded health reports into clearer, bounded explanations.',
    broke: 'Dense report language, fragmented uploads and unconstrained AI summaries made understanding harder and riskier.',
    changed: 'A React interface and Express API handle image or PDF uploads, authentication, report history and assisted summaries.',
    survived: 'Deterministic rules and explicit non-diagnostic limits keep uncertainty visible instead of overstating an answer.',
    system: 'Image or PDF upload, validation, Gemini-assisted summary, deterministic checks, then saved report history.',
    boundary: 'Informational only, not diagnosis or emergency care. Anmol’s public commits cover the interface and brand redesign, demo deployment and analysis cleanup.',
    tags: ['React + Vite', 'Express', 'MongoDB'], kind: 'health', glyph: '✚',
    caption: 'Authenticated analysis dashboard', label: 'Authentic repository capture',
    image: 'assets/arogya-dashboard.png',
    imageAlt: 'ArogyaAI dashboard showing health report analysis controls and report history',
    imageWidth: 1200, imageHeight: 700,
    artifactNote: 'Authentic dashboard capture from the public repository. Use synthetic data only; the workflow is not medical advice.',
    evidenceTitle: 'Evidence state: public source verified',
    evidence: 'Public source, successful CI, authentic screenshots and documented safety boundaries support this collaborative record.',
    primaryLink: { label: 'View ArogyaAI source', href: 'https://github.com/Xenon010101/ArogyaAI' }
  },
  insider: {
    status: 'Primary contributor · record 03', title: 'InsiderEdge',
    summary: 'A collaborative research system for AI-assisted analysis, risk controls and simulated trading.',
    broke: 'Market analysis, technical indicators, risk rules and paper trades lived in disconnected workflows.',
    changed: 'The team connected a Python research agent, indicator analysis, risk management, paper trading and on-chain verification.',
    survived: 'A strong research pipeline still needs a clear line between a visual demo, live integrations and each contributor’s work.',
    system: 'Market inputs, AI and indicator analysis, risk rules, paper trades, then on-chain verification.',
    boundary: 'The live dashboard uses deterministic demo data and is not connected to the agent, exchange APIs or a wallet. Co-developed with Akshita.',
    tags: ['Python', 'Risk systems', 'On-chain'], kind: 'market', glyph: '↗',
    caption: 'Paper-trading dashboard', label: 'Live dashboard capture',
    image: 'assets/insideredge-dashboard.png',
    imageAlt: 'InsiderEdge paper-trading dashboard with portfolio, risk and market analysis panels',
    imageWidth: 1200, imageHeight: 700,
    artifactNote: 'Live dashboard capture. It explicitly labels paper mode and deterministic demo data.',
    evidenceTitle: 'Evidence state: source and live demo verified',
    evidence: 'Public source and commit history identify Anmol as the primary contributor. His commits cover the agent, risk and portfolio logic, dashboard deployment and on-chain reliability fixes.',
    primaryLink: { label: 'Open live dashboard', href: 'https://xenon010101.github.io/InsiderEdge/' },
    sourceLink: { label: 'View source', href: 'https://github.com/Xenon010101/InsiderEdge' }
  }
};

const setText = (selector, value) => {
  document.querySelector(selector).textContent = value;
};

const resetTransitionState = () => {
  if (!animation) return;
  animation.set([artifact, folio], { clearProps: 'opacity,visibility,transform,willChange' });
};

const setProjectLink = (link, config) => {
  link.hidden = !config;
  if (!config) return;
  link.href = config.href;
  link.textContent = config.label;
  const external = config.href.startsWith('http');
  link.toggleAttribute('target', external);
  link.toggleAttribute('rel', external);
  if (external) {
    link.target = '_blank';
    link.rel = 'noreferrer';
  }
};

const revealFolio = () => {
  folio.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
};

const renderRecord = (record) => {
  setText('[data-project-status]', record.status);
  setText('[data-project-title]', record.title);
  setText('[data-project-summary]', record.summary);
  setText('[data-project-broke]', record.broke);
  setText('[data-project-changed]', record.changed);
  setText('[data-project-survived]', record.survived);
  setText('[data-project-system]', record.system);
  setText('[data-project-boundary]', record.boundary);
  setText('[data-project-evidence-title]', record.evidenceTitle);
  setText('[data-project-evidence]', record.evidence);
  setText('[data-artifact-name]', record.title);
  setText('[data-artifact-caption]', record.caption);
  setText('[data-artifact-label]', record.label);
  setText('[data-artifact-glyph]', record.glyph);
  artifactNote.textContent = record.artifactNote;
  artifactImage.hidden = !record.image;
  artifactPlaceholder.hidden = Boolean(record.image);
  if (record.image) {
    artifactImage.src = record.image;
    artifactImage.alt = record.imageAlt;
    artifactImage.width = record.imageWidth;
    artifactImage.height = record.imageHeight;
  } else {
    artifactImage.removeAttribute('src');
    artifactImage.alt = '';
  }
  document.querySelectorAll('[data-project-tag]').forEach((tag, index) => { tag.textContent = record.tags[index]; });
  artifact.dataset.artifactKind = record.kind;
  setProjectLink(projectPrimaryLink, record.primaryLink);
  setProjectLink(projectSourceLink, record.sourceLink);
};

document.querySelectorAll('[data-project]').forEach((button) => {
  button.addEventListener('click', () => {
    const record = records[button.dataset.project];
    if (!record) return;
    document.querySelectorAll('[data-project]').forEach((candidate) => {
      candidate.setAttribute('aria-pressed', String(candidate === button));
    });

    transitionTimeline?.kill();
    resetTransitionState();
    if (!animation || reducedMotion.matches) {
      renderRecord(record);
      revealFolio();
      return;
    }

    animation.set([artifact, folio], { willChange: 'transform, opacity' });
    transitionTimeline = animation.timeline({
      defaults: { ease: 'power2.out', overwrite: 'auto' },
      onComplete: () => { resetTransitionState(); revealFolio(); },
      onInterrupt: resetTransitionState
    })
      .addLabel('record-change')
      .to([artifact, folio], { autoAlpha: 0, y: 12, duration: .18, onComplete: () => renderRecord(record) }, 'record-change')
      .fromTo(artifact, { autoAlpha: 0, y: 12, rotationY: -7 }, { autoAlpha: 1, y: 0, rotationY: 0, duration: .42 })
      .to(folio, { autoAlpha: 1, y: 0, duration: .34 }, '<.08');
  });
});

if (animation) {
  const motion = animation.matchMedia();
  motion.add({
    desktop: '(min-width: 901px)', mobile: '(max-width: 900px)', reduceMotion: '(prefers-reduced-motion: reduce)'
  }, ({ conditions }) => {
    if (conditions.reduceMotion) return;
    animation.set([artifact, folio], { willChange: 'transform, opacity' });
    animation.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: resetTransitionState
    })
      .addLabel('archive-arrival')
      .from('.site-header', { autoAlpha: 0, y: -18, duration: .45 })
      .from('[data-project-copy]', { autoAlpha: 0, y: 18, duration: .5, stagger: .07 }, '-=.16')
      .from(artifact, { autoAlpha: 0, z: -90, rotationY: conditions.desktop ? -8 : 0, duration: .7 }, '-=.34')
      .from(folio, { autoAlpha: 0, x: conditions.desktop ? 28 : 0, y: conditions.mobile ? 18 : 0, duration: .54 }, '-=.4');
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

console.assert(artifact && artifactImage && artifactPlaceholder && artifactNote && folio && projectPrimaryLink && projectSourceLink && Object.keys(records).length === 3, 'Project archive must expose three records and their artifact states.');
