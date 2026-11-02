const siteFrame = document.querySelector('#site-frame');
const music = document.querySelector('[data-site-music]');
const musicControl = document.querySelector('[data-music-control]');
const musicLabel = document.querySelector('[data-music-label]');
const musicStatus = document.querySelector('[data-music-status]');
const xrayControl = document.querySelector('[data-xray-control]');
const xrayLabel = document.querySelector('[data-xray-label]');
const xrayStatus = document.querySelector('[data-xray-status]');
const xrayViewport = document.querySelector('[data-xray-viewport]');
const xrayBoxes = new Map([...document.querySelectorAll('[data-xray-box]')].map((box) => [box.dataset.xrayBox, box]));
const keeperLaunch = document.querySelector('[data-keeper-open]');
const keeperDialog = document.querySelector('[data-keeper-dialog]');
const keeperLog = document.querySelector('[data-keeper-log]');
const keeperForm = document.querySelector('[data-keeper-form]');
const keeperInput = document.querySelector('[data-keeper-input]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const pages = new Set(['home.html', 'about.html', 'skills.html', 'projects.html', 'focus.html', 'architecture.html', 'contact.html']);
const musicPreferenceKey = 'unburned-library-music';
const musicTimeKey = 'unburned-library-music-time';

const cleanPage = (value) => {
  if (!value) return 'home.html';
  const url = new URL(value, location.href);
  const name = url.pathname.split('/').pop();
  return url.origin === location.origin && pages.has(name) ? `${name}${url.search}${url.hash}` : 'home.html';
};

const pageUrl = (page) => page === 'home.html' ? './' : `?page=${encodeURIComponent(page)}`;
let activePage = cleanPage(new URLSearchParams(location.search).get('page'));
let restoringHistory = false;
let firstFrameLoad = true;
let savedAtSecond = -1;
let xrayEnabled = false;
let xrayGeometryFrame;
let keeperReplyTimer;
let keeperTyping;

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

if (siteFrame.getAttribute('src') !== activePage) siteFrame.src = activePage;

const setMusicState = (playing) => {
  musicControl.dataset.state = playing ? 'playing' : 'paused';
  musicControl.setAttribute('aria-pressed', String(playing));
  musicControl.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  musicLabel.textContent = playing ? 'Music on' : 'Music off';
  musicStatus.textContent = playing ? 'Background music is playing.' : 'Background music is paused.';
};

const addKeeperMessage = (speaker, text, record) => {
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
    source.target = 'site-frame';
    source.textContent = record.source;
    message.append(source);
  }

  keeperLog.append(message);
  keeperLog.scrollTop = keeperLog.scrollHeight;
  if (!reducedMotion.matches) message.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 280, easing: 'ease-out' });
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

const updateXrayGeometry = () => {
  if (!xrayEnabled) return;
  const content = siteFrame.contentDocument;
  if (!content) return;
  const targets = {
    header: '.site-header',
    nav: '.primary-nav',
    hero: '.hero__content',
    title: '#hero-title',
    brick: '[data-brick]'
  };

  for (const [name, selector] of Object.entries(targets)) {
    const element = content.querySelector(selector);
    const box = xrayBoxes.get(name);
    if (!element || !box) continue;
    const rect = element.getBoundingClientRect();
    box.style.setProperty('--x', `${rect.left}px`);
    box.style.setProperty('--y', `${rect.top}px`);
    box.style.setProperty('--w', `${rect.width}px`);
    box.style.setProperty('--h', `${rect.height}px`);
  }

  xrayViewport.textContent = `VIEWPORT ${siteFrame.clientWidth} × ${siteFrame.clientHeight}`;
};

const queueXrayGeometry = () => {
  cancelAnimationFrame(xrayGeometryFrame);
  xrayGeometryFrame = requestAnimationFrame(updateXrayGeometry);
};

const setXrayState = (enabled) => {
  xrayEnabled = enabled && activePage.startsWith('home.html');
  document.body.classList.toggle('xray-active', xrayEnabled);
  xrayControl.setAttribute('aria-pressed', String(xrayEnabled));
  xrayControl.setAttribute('aria-label', `${xrayEnabled ? 'Turn off' : 'Turn on'} engineering X-ray mode`);
  xrayLabel.textContent = xrayEnabled ? 'X-Ray on' : 'X-Ray off';
  xrayStatus.textContent = `Engineering X-ray mode ${xrayEnabled ? 'on' : 'off'}.`;
  if (xrayEnabled) queueXrayGeometry();
};

const handleXrayKey = (event) => {
  const target = event.target;
  if (target?.matches?.('input, textarea, select, [contenteditable]')) return;
  if (event.key.toLowerCase() === 'x') setXrayState(!xrayEnabled);
  if (event.key === 'Escape' && xrayEnabled) setXrayState(false);
};

const playMusic = async () => {
  try {
    await music.play();
    localStorage.setItem(musicPreferenceKey, 'true');
  } catch {
    setMusicState(false);
  }
};

const bindMusicGesture = () => {
  if (localStorage.getItem(musicPreferenceKey) === 'false' || !music.paused) return;
  const content = siteFrame.contentDocument;
  if (!content) return;
  const begin = () => playMusic();
  content.addEventListener('pointerdown', begin, { once: true, capture: true });
  content.addEventListener('keydown', begin, { once: true, capture: true });
};

music.volume = .22;
music.addEventListener('play', () => setMusicState(true));
music.addEventListener('pause', () => setMusicState(false));
music.addEventListener('loadedmetadata', () => {
  const savedTime = Number(localStorage.getItem(musicTimeKey));
  if (Number.isFinite(savedTime) && savedTime > 0 && savedTime < music.duration) music.currentTime = savedTime;
});
music.addEventListener('timeupdate', () => {
  const second = Math.floor(music.currentTime);
  if (second !== savedAtSecond && second % 5 === 0) {
    savedAtSecond = second;
    localStorage.setItem(musicTimeKey, String(music.currentTime));
  }
});
window.addEventListener('pagehide', () => localStorage.setItem(musicTimeKey, String(music.currentTime)));

musicControl.addEventListener('click', () => {
  if (music.paused) playMusic();
  else {
    localStorage.setItem(musicPreferenceKey, 'false');
    music.pause();
  }
});
xrayControl.addEventListener('click', () => setXrayState(!xrayEnabled));
document.addEventListener('keydown', handleXrayKey);
window.addEventListener('resize', queueXrayGeometry);

keeperLaunch.addEventListener('click', () => {
  if (keeperDialog.open) return;
  keeperDialog.showModal();
  keeperInput.focus();
});

keeperDialog.addEventListener('close', () => {
  clearTimeout(keeperReplyTimer);
  keeperTyping?.remove();
  keeperTyping = undefined;
  keeperInput.disabled = false;
  keeperLaunch.focus();
});

keeperForm.addEventListener('submit', (event) => {
  event.preventDefault();
  askKeeper(keeperInput.value);
});

document.querySelectorAll('[data-keeper-prompt]').forEach((button) => {
  button.addEventListener('click', () => askKeeper(button.dataset.keeperPrompt || ''));
});

siteFrame.addEventListener('load', () => {
  const frameLocation = siteFrame.contentWindow.location;
  if (frameLocation.origin !== location.origin) return;

  const name = frameLocation.pathname.split('/').pop();
  if (!pages.has(name)) return;

  const nextPage = `${name}${frameLocation.search}${frameLocation.hash}`;
  if (firstFrameLoad && nextPage !== activePage) return;
  document.title = siteFrame.contentDocument.title;

  if (firstFrameLoad) {
    history.replaceState({ page: nextPage }, '', pageUrl(nextPage));
    firstFrameLoad = false;
  } else if (restoringHistory) {
    restoringHistory = false;
  } else if (nextPage !== activePage) {
    history.pushState({ page: nextPage }, '', pageUrl(nextPage));
  }

  activePage = nextPage;
  const isHome = name === 'home.html';
  xrayControl.hidden = !isHome;
  if (!isHome) setXrayState(false);
  else {
    siteFrame.contentDocument.addEventListener('keydown', handleXrayKey);
    siteFrame.contentWindow.addEventListener('scroll', queueXrayGeometry, { passive: true });
    queueXrayGeometry();
  }
  bindMusicGesture();
});

window.addEventListener('popstate', (event) => {
  const nextPage = cleanPage(event.state?.page || new URLSearchParams(location.search).get('page'));
  if (nextPage === activePage) return;
  restoringHistory = true;
  activePage = nextPage;
  siteFrame.src = nextPage;
});

setMusicState(false);
if (localStorage.getItem(musicPreferenceKey) === 'true') playMusic();
