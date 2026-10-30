const animation = window.gsap;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const artifact = document.querySelector('[data-project-artifact]');
const artifactImage = document.querySelector('[data-artifact-image]');
const artifactPlaceholder = document.querySelector('[data-artifact-placeholder]');
const artifactNote = document.querySelector('[data-artifact-note]');
const folio = document.querySelector('[data-project-folio]');
const projectLink = document.querySelector('[data-project-link]');
let transitionTimeline;

const records = {
  focus: {
    status: 'Recovered record 01', title: 'FocusTube',
    summary: 'A privacy-conscious browser extension for distraction-free learning.',
    broke: 'YouTube’s single-page navigation replaced interface regions and erased the focus state.',
    changed: 'A MutationObserver, navigation signals and per-tab session state restore the experience after transitions.',
    survived: 'Playback, user control, preferences and privacy survive without an account or backend.',
    tags: ['JavaScript', 'Browser extension', 'Privacy'], kind: 'focus', glyph: '◉',
    caption: 'Focused learning interface', label: 'Verified interface capture',
    image: 'assets/focustube-after.png',
    imageAlt: 'FocusTube active on a YouTube watch page, preserving the video while removing surrounding distractions',
    artifactNote: 'Authentic before/after captures and public source evidence live inside the recovered record.',
    evidenceTitle: 'Evidence state: publicly verified',
    evidence: 'Public source, authentic before/after captures and the Edge Add-ons destination are attached to the recovered record.',
    link: true
  },
  arogya: {
    status: 'Provisional record 02', title: 'ArogyaAI',
    summary: 'A health-report interpretation workflow with explicit safety boundaries.',
    broke: 'Dense health reports can be difficult to understand without clear context and careful language.',
    changed: 'The product explores a guided interpretation workflow while limiting what the system is allowed to claim.',
    survived: 'In high-stakes interfaces, boundaries and uncertainty matter more than confident output.',
    tags: ['React', 'Node.js', 'MongoDB'], kind: 'health', glyph: '✚',
    caption: 'Bounded interpretation workflow', label: 'Conceptual workflow study', image: null,
    artifactNote: 'Conceptual cover only. Product screenshots and implementation evidence are not yet admitted to the archive.',
    evidenceTitle: 'Evidence state: pending',
    evidence: 'Add verified screenshots, repository history, safety behavior and deployment evidence before presenting this as recovered.',
    link: false
  },
  insider: {
    status: 'Collaborative record 03', title: 'InsiderEdge',
    summary: 'A collaborative market-analysis and paper-trading research platform.',
    broke: 'Market research, experimentation and simulated trading were spread across disconnected workflows.',
    changed: 'The team combined research and paper-trading exploration inside one product direction.',
    survived: 'Collaborative work is credible only when personal ownership and contribution boundaries are explicit.',
    tags: ['Python', 'Data', 'AI'], kind: 'market', glyph: '↗',
    caption: 'Market research workspace', label: 'Conceptual data study', image: null,
    artifactNote: 'Conceptual cover only. Personal ownership and contribution evidence are still being verified.',
    evidenceTitle: 'Evidence state: ownership pending',
    evidence: "Verify Anmol's exact contribution, commits and responsibilities before this record is admitted to the final archive.",
    link: false
  }
};

const setText = (selector, value) => {
  document.querySelector(selector).textContent = value;
};

const resetTransitionState = () => {
  if (!animation) return;
  animation.set([artifact, folio], { clearProps: 'opacity,visibility,transform,willChange' });
};

const renderRecord = (record) => {
  setText('[data-project-status]', record.status);
  setText('[data-project-title]', record.title);
  setText('[data-project-summary]', record.summary);
  setText('[data-project-broke]', record.broke);
  setText('[data-project-changed]', record.changed);
  setText('[data-project-survived]', record.survived);
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
  } else {
    artifactImage.removeAttribute('src');
    artifactImage.alt = '';
  }
  document.querySelectorAll('[data-project-tag]').forEach((tag, index) => { tag.textContent = record.tags[index]; });
  artifact.dataset.artifactKind = record.kind;
  projectLink.hidden = !record.link;
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
      return;
    }

    animation.set([artifact, folio], { willChange: 'transform, opacity' });
    transitionTimeline = animation.timeline({
      defaults: { ease: 'power2.out', overwrite: 'auto' },
      onComplete: resetTransitionState,
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

console.assert(artifact && artifactImage && artifactPlaceholder && artifactNote && folio && Object.keys(records).length === 3, 'Project archive must expose three records and their artifact states.');
