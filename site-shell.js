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

if (siteFrame.getAttribute('src') !== activePage) siteFrame.src = activePage;

const setMusicState = (playing) => {
  musicControl.dataset.state = playing ? 'playing' : 'paused';
  musicControl.setAttribute('aria-pressed', String(playing));
  musicControl.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  musicLabel.textContent = playing ? 'Music on' : 'Music off';
  musicStatus.textContent = playing ? 'Background music is playing.' : 'Background music is paused.';
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
