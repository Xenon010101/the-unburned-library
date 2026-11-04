const animation = window.gsap;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const instrument = document.querySelector('[data-instrument]');
const recordPanel = document.querySelector('[data-skill-record]');
const outerRing = document.querySelector('[data-ring-outer]');
const middleRing = document.querySelector('[data-ring-middle]');
const skillButtons = [...document.querySelectorAll('[data-skill]')];
let transitionTimeline;

const records = {
  interfaces: {
    evidenceLabel: 'Verified evidence',
    title: 'Interfaces',
    description: "I build responsive browser experiences that keep the user's goal visible and the interface predictable.",
    tools: ['React', 'TypeScript', 'JavaScript'],
    project: 'FocusTube',
    proof: 'A browser extension that restores a focused learning interface as YouTube changes underneath it.',
    use: 'Accessible UI, browser behavior and stateful interactions.',
    protect: 'User control, clarity and responsive performance.'
  },
  systems: {
    evidenceLabel: 'Public source verified',
    title: 'Backend systems',
    description: 'I connect product behavior to reliable application logic, automation and explicit failure handling.',
    tools: ['Node.js', 'Python', 'REST APIs'],
    project: 'ArogyaAI · collaborative',
    proof: 'A public health-report interpretation workflow with CI, authentic interface evidence and explicit non-diagnostic boundaries.',
    use: 'APIs, server logic, validation and task automation.',
    protect: 'Reliability, understandable errors and safe boundaries.'
  },
  data: {
    evidenceLabel: 'Primary contribution verified',
    title: 'Data',
    description: 'I shape information so products can retrieve it clearly, preserve context and support useful decisions.',
    tools: ['MongoDB', 'MySQL', 'Data modeling'],
    project: 'InsiderEdge · primary contributor',
    proof: 'A public market-analysis research platform with a live paper-mode dashboard and documented work across agent, risk and portfolio logic.',
    use: 'Persistence, querying and application data models.',
    protect: 'Traceability, useful structure and honest interpretation.'
  },
  cloud: {
    evidenceLabel: 'Deployed evidence',
    title: 'Cloud and delivery',
    description: 'I design the path from working code to a deployed experience that remains simple to operate.',
    tools: ['AWS Amplify', 'Git', 'GitHub'],
    project: 'The Unburned Library',
    proof: 'An Amplify-first static portfolio architecture with an optional, isolated AWS-backed Keeper.',
    use: 'Version control, deployment and bounded cloud architecture.',
    protect: 'Fast first paint, predictable cost and graceful fallback.'
  }
};

const renderRecord = (record) => {
  document.querySelector('[data-skill-evidence-state]').textContent = record.evidenceLabel;
  document.querySelector('[data-skill-title]').textContent = record.title;
  document.querySelector('[data-skill-description]').textContent = record.description;
  document.querySelector('[data-skill-project]').textContent = record.project;
  document.querySelector('[data-skill-proof]').textContent = record.proof;
  document.querySelector('[data-skill-use]').textContent = record.use;
  document.querySelector('[data-skill-protect]').textContent = record.protect;
  document.querySelector('[data-skill-center]').textContent = record.title;
  document.querySelectorAll('[data-skill-tool]').forEach((tool, index) => {
    tool.textContent = record.tools[index];
  });
};

skillButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const record = records[button.dataset.skill];
    if (!record) return;

    skillButtons.forEach((candidate) => {
      candidate.setAttribute('aria-pressed', String(candidate === button));
    });

    if (!animation || reducedMotion.matches) {
      renderRecord(record);
      return;
    }

    transitionTimeline?.kill();
    animation.set([recordPanel, outerRing, middleRing, ...skillButtons], { clearProps: 'willChange' });
    const selectionTargets = [recordPanel, outerRing, middleRing, button];
    animation.set(selectionTargets, { willChange: 'transform,opacity' });
    transitionTimeline = animation.timeline({
      defaults: { ease: 'power2.out', overwrite: 'auto' },
      onComplete: () => animation.set(selectionTargets, { clearProps: 'willChange' })
    })
      .to(recordPanel, { autoAlpha: 0, x: 12, duration: .16, onComplete: () => renderRecord(record) })
      .to(recordPanel, { autoAlpha: 1, x: 0, duration: .3 })
      .to(outerRing, { rotation: `+=${32 + index * 7}`, duration: .52 }, 0)
      .to(middleRing, { rotation: `-=${22 + index * 5}`, duration: .52 }, 0)
      .fromTo(button, { scale: .92 }, { scale: 1, duration: .28 }, .1);
  });
});

if (animation) {
  const motion = animation.matchMedia();
  motion.add({
    desktop: '(min-width: 901px)',
    mobile: '(max-width: 900px)',
    reduceMotion: '(prefers-reduced-motion: reduce)'
  }, ({ conditions }) => {
    if (conditions.reduceMotion) return;
    const arrivalTargets = [instrument, recordPanel, ...skillButtons].filter(Boolean);
    animation.timeline({
      defaults: { ease: 'power2.out' },
      onStart: () => animation.set(arrivalTargets, { willChange: 'transform,opacity' }),
      onComplete: () => animation.set(arrivalTargets, { clearProps: 'willChange' })
    })
      .addLabel('craft-arrival', 0)
      .from('.site-header', { autoAlpha: 0, y: -18, duration: .42 }, 'craft-arrival')
      .from('[data-craft-copy]', { autoAlpha: 0, y: 18, duration: .54, stagger: .07 }, 'craft-arrival+=.1')
      .from(instrument, { autoAlpha: 0, scale: .86, rotation: conditions.desktop ? -6 : 0, duration: .78, ease: 'power3.out' }, 'craft-arrival+=.2')
      .from(skillButtons, { autoAlpha: 0, scale: .82, duration: .4, stagger: .055 }, 'craft-arrival+=.44')
      .from(recordPanel, { autoAlpha: 0, x: conditions.desktop ? 30 : 0, y: conditions.mobile ? 18 : 0, duration: .58 }, 'craft-arrival+=.52');
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

console.assert(instrument && recordPanel && Object.keys(records).length === 4, 'Skills instrument must expose four disciplines.');
