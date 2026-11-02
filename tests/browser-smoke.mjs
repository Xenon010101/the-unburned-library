import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const port = process.argv[2] || '9223';
const pageUrl = pathToFileURL(resolve('home.html')).href;
const aboutUrl = pathToFileURL(resolve('about.html')).href;
const skillsUrl = pathToFileURL(resolve('skills.html')).href;
const projectsUrl = pathToFileURL(resolve('projects.html')).href;
const focusUrl = pathToFileURL(resolve('focus.html')).href;
const architectureUrl = pathToFileURL(resolve('architecture.html')).href;
const contactUrl = pathToFileURL(resolve('contact.html')).href;
const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(pageUrl)}`, { method: 'PUT' }).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolveOpen, reject) => {
  socket.addEventListener('open', resolveOpen, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve: resolveCall, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolveCall(message.result);
});

const send = (method, params = {}) => new Promise((resolveCall, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve: resolveCall, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};

const waitFor = async (expression, timeout = 6000) => {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 60));
  }
  throw new Error(`Timed out waiting for: ${expression}`);
};

const wait = (milliseconds) => evaluate(`new Promise((resolve) => setTimeout(resolve, ${milliseconds}))`);

const screenshot = async (path) => {
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(path, Buffer.from(data, 'base64'));
};

const assertNoDocumentOverflow = async (label) => {
  const widths = await evaluate(`({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth })`);
  assert.ok(widths.scroll <= widths.client + 1, `${label} document overflow: ${JSON.stringify(widths)}`);
};

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pageUrl });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1400);

assert.equal(await evaluate(`document.querySelector('.hero').classList.contains('has-gsap')`), true);
assert.ok(Number(await evaluate(`getComputedStyle(document.querySelector('#hero-title')).opacity`)) > .99);
assert.equal(await evaluate(`document.querySelectorAll('.brick-face').length`), 6);
await screenshot('desktop-qa.png');
await evaluate(`document.querySelector('[data-brick]').click()`);
await wait(900);
await screenshot('brick-flight-qa.png');
await waitFor(`location.pathname.endsWith('/focus.html')`, 7000);
await screenshot('focus-from-brick-qa.png');

await send('Page.navigate', { url: pageUrl });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1400);
await evaluate(`document.querySelector('[data-recover]').click()`);
await waitFor(`document.querySelector('[data-record-dialog]').open`, 7000);
await wait(900);
assert.match(await evaluate(`document.querySelector('[data-brick-status]').textContent`), /Record recovered/);
assert.ok(Number(await evaluate(`getComputedStyle(document.querySelector('[data-folio]')).opacity`)) > .99);
await screenshot('record-open-qa.png');
await evaluate(`document.querySelector('[data-record-dialog]').close()`);
await waitFor(`!document.querySelector('[data-brick]').disabled`);

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send('Page.reload', { ignoreCache: true });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1400);
await assertNoDocumentOverflow('Homepage mobile');
await screenshot('mobile-qa.png');

await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: aboutUrl });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1400);
assert.equal(await evaluate(`document.querySelector('[aria-current="page"]').textContent.trim()`), 'About');
assert.equal(await evaluate(`document.querySelectorAll('[data-journey-step]').length`), 4);
assert.equal(await evaluate(`document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1`), true);
await screenshot('about-desktop-qa.png');
await evaluate(`document.querySelector('[data-journey-open]').click()`);
await waitFor(`document.querySelector('[data-journey-dialog]').open`);
await wait(1000);
assert.equal(await evaluate(`getComputedStyle(document.querySelector('[data-manuscript-left]')).visibility`), 'visible');
await screenshot('about-manuscript-qa.png');
await evaluate(`document.querySelector('[data-journey-dialog]').close()`);

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send('Page.reload', { ignoreCache: true });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1400);
await assertNoDocumentOverflow('About mobile');
const aboutMobileOverflow = await evaluate(`[...document.querySelectorAll('body *')].map((element) => { const rect = element.getBoundingClientRect(); return { tag: element.tagName, className: element.className?.toString?.() || '', left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }; }).filter(({ left, right }) => left < -1 || right > document.documentElement.clientWidth + 1).slice(0, 12)`);
assert.deepEqual(aboutMobileOverflow, [], `About mobile overflow: ${JSON.stringify(aboutMobileOverflow)}`);
await screenshot('about-mobile-qa.png');

await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: skillsUrl });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1400);
assert.equal(await evaluate(`document.querySelector('[aria-current="page"]').textContent.trim()`), 'Skills');
assert.equal(await evaluate(`document.querySelectorAll('[data-skill]').length`), 4);
await screenshot('skills-desktop-qa.png');
await evaluate(`document.querySelector('[data-skill="systems"]').click()`);
await waitFor(`document.querySelector('[data-skill-title]').textContent === 'Backend systems'`);
await wait(500);
assert.equal(await evaluate(`document.querySelector('[data-skill-project]').textContent`), 'ArogyaAI · provisional');
assert.equal(await evaluate(`document.querySelector('[data-skill="systems"]').getAttribute('aria-pressed')`), 'true');
await screenshot('skills-system-qa.png');

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send('Page.reload', { ignoreCache: true });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1400);
await assertNoDocumentOverflow('Skills mobile');
const skillsMobileOverflow = await evaluate(`[...document.querySelectorAll('body *')].map((element) => { const rect = element.getBoundingClientRect(); return { tag: element.tagName, className: element.className?.toString?.() || '', left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }; }).filter(({ left, right }) => left < -1 || right > document.documentElement.clientWidth + 1).slice(0, 12)`);
assert.deepEqual(skillsMobileOverflow, [], `Skills mobile overflow: ${JSON.stringify(skillsMobileOverflow)}`);
await screenshot('skills-mobile-qa.png');
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.reload', { ignoreCache: true });
await waitFor(`document.readyState === 'complete' && matchMedia('(prefers-reduced-motion: reduce)').matches`);
assert.notEqual(await evaluate(`getComputedStyle(document.querySelector('.skill-node--top')).transform`), 'none');
await evaluate(`document.querySelector('[data-skill="systems"]').click()`);
assert.equal(await evaluate(`document.querySelector('[data-skill-title]').textContent`), 'Backend systems');
await send('Emulation.setEmulatedMedia', { features: [] });

await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: projectsUrl });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1400);
assert.equal(await evaluate(`document.querySelector('[aria-current="page"]').textContent.trim()`), 'Projects');
assert.equal(await evaluate(`document.querySelectorAll('[data-project]').length`), 3);
await screenshot('projects-desktop-qa.png');
await evaluate(`document.querySelector('[data-project="arogya"]').click()`);
await waitFor(`document.querySelector('[data-project-title]').textContent === 'ArogyaAI'`);
await wait(500);
assert.match(await evaluate(`document.querySelector('[data-project-evidence-title]').textContent`), /pending/);
assert.match(await evaluate(`document.querySelector('[data-project-system]').textContent`), /Gemini-assisted summary/);
assert.match(await evaluate(`document.querySelector('[data-project-boundary]').textContent`), /does not diagnose/);
assert.equal(await evaluate(`document.querySelector('[data-project-link]').hidden`), true);
assert.equal(await evaluate(`getComputedStyle(document.querySelector('[data-project-link]')).display`), 'none');
await screenshot('projects-arogya-qa.png');

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send('Page.reload', { ignoreCache: true });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1400);
await assertNoDocumentOverflow('Projects mobile');
const projectsMobileOverflow = await evaluate(`[...document.querySelectorAll('body *')].map((element) => { const rect = element.getBoundingClientRect(); return { tag: element.tagName, className: element.className?.toString?.() || '', left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }; }).filter(({ left, right }) => left < -1 || right > document.documentElement.clientWidth + 1).slice(0, 12)`);
assert.deepEqual(projectsMobileOverflow, [], `Projects mobile overflow: ${JSON.stringify(projectsMobileOverflow)}`);
await screenshot('projects-mobile-qa.png');
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.reload', { ignoreCache: true });
await waitFor(`document.readyState === 'complete' && matchMedia('(prefers-reduced-motion: reduce)').matches`);
await evaluate(`document.querySelector('[data-project="insider"]').click()`);
assert.equal(await evaluate(`document.querySelector('[data-project-title]').textContent`), 'InsiderEdge');
assert.match(await evaluate(`document.querySelector('[data-project-system]').textContent`), /paper trades/);
assert.match(await evaluate(`document.querySelector('[data-project-boundary]').textContent`), /static visual demo/);
assert.equal(await evaluate(`getComputedStyle(document.querySelector('[data-project-link]')).display`), 'none');
await send('Emulation.setEmulatedMedia', { features: [] });

await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: focusUrl });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(760);
const openingPaperScale = await evaluate(`new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.manuscript__paper')).transform).a`);
assert.ok(openingPaperScale > 0.03 && openingPaperScale < 0.98, `Expected partially unfurled paper, got scale ${openingPaperScale}`);
assert.notEqual(await evaluate(`getComputedStyle(document.querySelector('.manuscript__roller--left')).transform`), 'none');
await screenshot('focus-scroll-opening-qa.png');
await wait(900);
assert.equal(await evaluate(`document.querySelector('[aria-current="page"]').textContent.trim()`), 'Projects');
assert.equal(await evaluate(`document.querySelectorAll('.record-layers section').length`), 3);
await evaluate(`document.querySelector('[data-preview="before"]').click()`);
assert.equal(await evaluate(`document.querySelector('[data-preview-title]').textContent`), 'Before focus mode');
assert.equal(await evaluate(`document.querySelector('[data-preview="before"]').getAttribute('aria-pressed')`), 'true');
assert.equal(await evaluate(`document.querySelector('[data-preview-image]').getAttribute('src')`), 'assets/focustube-before.png');
assert.equal(await evaluate(`document.querySelectorAll('.evidence-links a').length`), 3);
await screenshot('focus-desktop-qa.png');

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send('Page.reload', { ignoreCache: true });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1400);
await assertNoDocumentOverflow('Focus mobile');
const focusMobileOverflow = await evaluate(`[...document.querySelectorAll('body *')].map((element) => { const rect = element.getBoundingClientRect(); return { tag: element.tagName, className: element.className?.toString?.() || '', left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }; }).filter(({ left, right }) => left < -1 || right > document.documentElement.clientWidth + 1).slice(0, 12)`);
assert.deepEqual(focusMobileOverflow, [], `Focus mobile overflow: ${JSON.stringify(focusMobileOverflow)}`);
await screenshot('focus-mobile-qa.png');

await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: architectureUrl });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1900);
assert.equal(await evaluate(`document.querySelector('[aria-current="page"]').textContent.trim()`), 'Architecture');
assert.equal(await evaluate(`document.querySelectorAll('[data-core-node]').length`), 4);
assert.equal(await evaluate(`document.querySelectorAll('[data-optional-node]').length`), 5);
assert.ok(Number(await evaluate(`getComputedStyle(document.querySelector('[data-architecture-plan]')).opacity`)) > .99);
await screenshot('architecture-desktop-qa.png');

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send('Page.reload', { ignoreCache: true });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1900);
await assertNoDocumentOverflow('Architecture mobile');
const architectureMobileOverflow = await evaluate(`[...document.querySelectorAll('body *')].map((element) => { const rect = element.getBoundingClientRect(); return { tag: element.tagName, className: element.className?.toString?.() || '', left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }; }).filter(({ left, right }) => left < -1 || right > document.documentElement.clientWidth + 1).slice(0, 12)`);
assert.deepEqual(architectureMobileOverflow, [], `Architecture mobile overflow: ${JSON.stringify(architectureMobileOverflow)}`);
await screenshot('architecture-mobile-qa.png');

await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: contactUrl });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1500);
assert.equal(await evaluate(`document.querySelector('[aria-current="page"]').textContent.trim()`), 'Contact');
assert.equal(await evaluate(`document.querySelectorAll('.contact-letter[href^="mailto:"]').length`), 1);
assert.equal(await evaluate(`document.querySelectorAll('.contact-route').length`), 2);
assert.equal(await evaluate(`document.querySelectorAll('.contact-route[href]').length`), 2);
assert.equal(await evaluate(`document.querySelectorAll('form').length`), 0);
await screenshot('contact-desktop-qa.png');

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send('Page.reload', { ignoreCache: true });
await waitFor(`document.readyState === 'complete' && typeof window.gsap === 'object'`);
await wait(1500);
await assertNoDocumentOverflow('Contact mobile');
const contactMobileOverflow = await evaluate(`[...document.querySelectorAll('body *')].map((element) => { const rect = element.getBoundingClientRect(); return { tag: element.tagName, className: element.className?.toString?.() || '', left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }; }).filter(({ left, right }) => left < -1 || right > document.documentElement.clientWidth + 1).slice(0, 12)`);
assert.deepEqual(contactMobileOverflow, [], `Contact mobile overflow: ${JSON.stringify(contactMobileOverflow)}`);
await screenshot('contact-mobile-qa.png');

socket.close();
console.log('Browser smoke checks passed.');
