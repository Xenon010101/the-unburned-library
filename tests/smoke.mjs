import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const [html, css, js, aboutHtml, aboutCss, aboutJs, skillsHtml, skillsCss, skillsJs, projectsHtml, projectsCss, projectsJs, focusHtml, focusCss, focusJs, architectureHtml, architectureCss, architectureJs, contactHtml, contactCss, contactJs, packageJson, gsapFile, focusBefore, focusAfter, amplifyIcon, cloudFrontIcon, apiGatewayIcon, lambdaIcon, bedrockIcon] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../styles.css', import.meta.url), 'utf8'),
  readFile(new URL('../script.js', import.meta.url), 'utf8'),
  readFile(new URL('../about.html', import.meta.url), 'utf8'),
  readFile(new URL('../about.css', import.meta.url), 'utf8'),
  readFile(new URL('../about.js', import.meta.url), 'utf8'),
  readFile(new URL('../skills.html', import.meta.url), 'utf8'),
  readFile(new URL('../skills.css', import.meta.url), 'utf8'),
  readFile(new URL('../skills.js', import.meta.url), 'utf8'),
  readFile(new URL('../projects.html', import.meta.url), 'utf8'),
  readFile(new URL('../projects.css', import.meta.url), 'utf8'),
  readFile(new URL('../projects.js', import.meta.url), 'utf8'),
  readFile(new URL('../focus.html', import.meta.url), 'utf8'),
  readFile(new URL('../focus.css', import.meta.url), 'utf8'),
  readFile(new URL('../focus.js', import.meta.url), 'utf8'),
  readFile(new URL('../architecture.html', import.meta.url), 'utf8'),
  readFile(new URL('../architecture.css', import.meta.url), 'utf8'),
  readFile(new URL('../architecture.js', import.meta.url), 'utf8'),
  readFile(new URL('../contact.html', import.meta.url), 'utf8'),
  readFile(new URL('../contact.css', import.meta.url), 'utf8'),
  readFile(new URL('../contact.js', import.meta.url), 'utf8'),
  readFile(new URL('../package.json', import.meta.url), 'utf8').then(JSON.parse),
  stat(new URL('../assets/vendor/gsap-3.15.0.min.js', import.meta.url)),
  stat(new URL('../assets/focustube-before.png', import.meta.url)),
  stat(new URL('../assets/focustube-after.png', import.meta.url)),
  readFile(new URL('../assets/aws-icons/aws-amplify.svg', import.meta.url), 'utf8'),
  readFile(new URL('../assets/aws-icons/amazon-cloudfront.svg', import.meta.url), 'utf8'),
  readFile(new URL('../assets/aws-icons/amazon-api-gateway.svg', import.meta.url), 'utf8'),
  readFile(new URL('../assets/aws-icons/aws-lambda.svg', import.meta.url), 'utf8'),
  readFile(new URL('../assets/aws-icons/amazon-bedrock.svg', import.meta.url), 'utf8')
]);

for (const id of ['main', 'home', 'about', 'skills', 'projects', 'architecture', 'contact', 'focus-record', 'keeper-dialog']) {
  assert.match(html, new RegExp(`id="${id}"`), `Missing #${id}`);
}

for (const page of [html, aboutHtml, skillsHtml, projectsHtml, focusHtml, architectureHtml, contactHtml]) {
  assert.match(page, /<link rel="icon" href="assets\/favicon\.svg" type="image\/svg\+xml">/);
}

assert.match(html, /aria-controls="focus-record"/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /@view-transition\s*\{\s*navigation:\s*auto;/);
assert.match(css, /::view-transition-new\(root\)/);
assert.match(js, /prefers-reduced-motion/);
assert.match(js, /showModal\(\)/);
assert.match(js, /animation\.timeline/);
assert.match(js, /animation\.matchMedia/);
assert.match(js, /reducedMotion\.addEventListener\('change'/);
assert.match(js, /let recoveryTrigger/);
assert.match(js, /recoveryTrigger\?\.focus\(\)/);
assert.doesNotMatch(html, /design-references\//, 'Mockups must not be production backgrounds.');
assert.match(html, /assets\/focustube-after\.png/);
assert.match(html, /https:\/\/github\.com\/Xenon010101\/FocusTube/);
assert.match(html, /microsoftedge\.microsoft\.com\/addons\/detail\/cjhibbneibhhcjiiekbhfgiilhijgibo/);
assert.match(html, /brand__short/);
assert.match(css, /overflow-x: clip/);
assert.match(html, /nalanda-courtyard-hero\.webp/);
assert.match(html, /I build systems<br> that survive\./);
assert.match(html, /Projects, failures and lessons, recovered and preserved\./);
assert.doesNotMatch(css, /scroll-snap/, 'Portfolio pages must use normal vertical scrolling.');
assert.match(html, /anmol-portrait\.webp/);
assert.match(html, /keeper-mini-ancient\.webp/);
assert.match(html, /keeper-mini-ancient\.webp" alt="" width="1122" height="1402"/);
assert.match(html, /<dialog class="record-dialog" id="focus-record" aria-labelledby="focus-record-title"/);
assert.match(html, /id="focus-record-title"/);
assert.match(html, /<dialog class="keeper-dialog" id="keeper-dialog" aria-labelledby="keeper-dialog-title"/);
assert.match(html, /id="keeper-dialog-title"/);
assert.match(html, /href="about\.html"/);
assert.match(html, /href="skills\.html"/);
assert.match(html, /href="projects\.html"/);
assert.match(html, /href="contact\.html"/);
assert.match(html, /href="https:\/\/github\.com\/Xenon010101"/);
assert.match(html, /href="https:\/\/www\.linkedin\.com\/in\/anmol-patel-481b54289"/);
assert.match(html, /assets\/vendor\/gsap-3\.15\.0\.min\.js/);
assert.match(html, /data-brick-status/);
assert.equal((html.match(/class="brick-face brick-face--/g) || []).length, 6, 'Brick must render six spatial faces.');
assert.match(aboutHtml, /id="journey-manuscript"/);
assert.match(aboutHtml, /assets\/anmol-keeper-standing\.webp/);
assert.equal((aboutHtml.match(/data-journey-step/g) || []).length, 4, 'About page must preserve four journey layers.');
assert.match(aboutHtml, /artistic interpretation inspired by conservation at Nalanda Mahavihara/i);
assert.match(aboutCss, /\.manuscript__leaf/);
assert.match(aboutCss, /\.journey-path li::after,\s*\.journey-path li:nth-child\(odd\)::after,\s*\.journey-path li:nth-child\(even\)::after\s*\{[^}]*right:\s*100%;[^}]*left:\s*auto;/s, 'Mobile journey connectors must override both odd and even desktop positions.');
assert.match(aboutJs, /animation\.timeline/);
assert.match(aboutJs, /addLabel\('keeper-arrival'/);
assert.match(aboutJs, /clearProps: 'willChange'/);
assert.equal((skillsHtml.match(/data-skill="/g) || []).length, 4, 'Skills instrument must expose four disciplines.');
assert.match(skillsHtml, /aria-live="polite"/);
assert.match(skillsHtml, /data-skill-evidence-state/);
assert.match(skillsCss, /\.skill-instrument__ring/);
assert.match(skillsJs, /FocusTube/);
assert.match(skillsJs, /animation\.timeline/);
assert.match(skillsJs, /prefers-reduced-motion/);
assert.match(skillsJs, /evidenceLabel: 'Verified evidence'/);
assert.match(skillsJs, /evidenceLabel: 'Evidence pending'/);
assert.match(skillsJs, /evidenceLabel: 'Contribution pending'/);
assert.match(skillsJs, /addLabel\('craft-arrival'/);
assert.match(skillsJs, /transitionTimeline\?\.kill/);
assert.match(skillsJs, /clearProps: 'willChange'/);
assert.equal((projectsHtml.match(/data-project="/g) || []).length, 3, 'Project archive must expose three records.');
assert.match(projectsHtml, /Evidence state: publicly verified/);
assert.match(projectsHtml, /authentic before\/after captures and public source evidence/i);
assert.match(projectsHtml, /data-archive-ledger/);
assert.match(projectsHtml, /1 recovered/i);
assert.match(projectsHtml, /2 awaiting evidence/i);
assert.match(projectsHtml, /data-artifact-image/);
assert.match(projectsHtml, /assets\/focustube-after\.png/);
assert.match(projectsCss, /\.archive-drawers/);
assert.match(projectsCss, /min-width:\s*0/);
assert.match(projectsJs, /transitionTimeline\?\.kill/);
assert.match(projectsJs, /Evidence state: ownership pending/);
assert.match(projectsJs, /addLabel\('record-change'/);
assert.match(projectsJs, /clearProps: 'opacity,visibility,transform,willChange'/);
assert.match(projectsJs, /transitionTimeline\?\.kill\(\);\s*resetTransitionState\(\);/);
assert.equal((projectsJs.match(/link: false/g) || []).length, 2, 'Only the verified FocusTube record may expose a case-study link.');
assert.match(projectsJs, /image: 'assets\/focustube-after\.png'/);
assert.match(projectsHtml, /href="focus\.html"/);
assert.match(focusHtml, /id="focus-record-title"/);
assert.equal((focusHtml.match(/<section>\s*<span aria-hidden="true">0[123]<\/span>/g) || []).length, 3, 'FocusTube record must expose three recovery layers.');
assert.match(focusHtml + focusJs, /assets\/focustube-before\.png/);
assert.match(focusHtml, /assets\/focustube-after\.png/);
assert.match(focusHtml, /Public evidence verified/);
assert.doesNotMatch(focusHtml + focusCss, /survival-contract/, 'FocusTube must not repeat the recovery decisions.');
assert.match(focusHtml, /<dt>Manifest<\/dt><dd>V3 · 1\.1\.0<\/dd>/);
assert.match(focusHtml, /<code>storage<\/code> · <code>activeTab<\/code>/);
assert.match(focusHtml, /https:\/\/github\.com\/Xenon010101\/FocusTube/);
assert.match(focusHtml, /microsoftedge\.microsoft\.com\/addons\/detail\/cjhibbneibhhcjiiekbhfgiilhijgibo/);
assert.match(focusHtml, /xenon010101\.github\.io\/FocusTube\/PRIVACY\.html/);
assert.match(focusCss, /\.manuscript__roller/);
assert.match(focusCss, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(focusJs, /previewStates/);
assert.match(focusJs, /scaleX: \.035/);
assert.match(focusJs, /leftTravel/);
assert.match(focusJs, /rotationY: -72/);
assert.match(focusHtml, /href="architecture\.html"/);
assert.equal((architectureHtml.match(/data-core-node/g) || []).length, 4, 'Architecture page must expose four core nodes.');
assert.equal((architectureHtml.match(/data-optional-node/g) || []).length, 5, 'Architecture page must expose five optional nodes.');
assert.equal((architectureHtml.match(/data-official-aws-icon/g) || []).length, 5, 'Architecture page must use five official AWS service icons.');
for (const iconPath of ['aws-amplify.svg', 'amazon-cloudfront.svg', 'amazon-api-gateway.svg', 'aws-lambda.svg', 'amazon-bedrock.svg']) {
  assert.match(architectureHtml, new RegExp(`assets/aws-icons/${iconPath.replace('.', '\\.')}`));
}
for (const icon of [amplifyIcon, cloudFrontIcon, apiGatewayIcon, lambdaIcon, bedrockIcon]) {
  assert.match(icon, /<svg/);
  assert.doesNotMatch(icon, /<script|javascript:|<foreignObject|(?:href|xlink:href)\s*=\s*["'](?!#)/i);
}
assert.equal((architectureHtml.match(/data-deployment-fact/g) || []).length, 4, 'Architecture page must expose four verified deployment facts.');
assert.match(architectureHtml, /Not deployed/);
assert.match(architectureHtml, /Deployment verified/);
assert.match(architectureHtml, /<dt>Platform<\/dt><dd>WEB<\/dd>/);
assert.match(architectureHtml, /verified baseline job <code>16<\/code>/);
assert.match(architectureHtml, /No optional service calls/i);
assert.match(architectureHtml, /Static package[\s\S]*AWS Amplify Hosting[\s\S]*Amplify global CDN[\s\S]*Visitor/);
assert.match(architectureHtml, /Official AWS Architecture Icons · Q3 2026/);
assert.match(architectureHtml, /<dt>Verified baseline<\/dt><dd>Job 16 · SUCCEED<\/dd>/);
assert.doesNotMatch(architectureHtml, /Always available|budget alert|guaranteed (?:zero cost|free)/i);
assert.match(architectureHtml, /production\.d38i1t194jgpzt\.amplifyapp\.com/);
assert.match(architectureHtml, /ap-southeast-2/);
assert.match(architectureHtml, /CloudFront-powered delivery/);
assert.doesNotMatch(architectureHtml, /S3|DynamoDB|Cognito/);
assert.match(architectureCss, /\.route-chain--core/);
assert.match(architectureCss, /\.deployment-ledger/);
assert.match(architectureCss, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(architectureJs, /corePath/);
assert.match(architectureJs, /deploymentProof/);
assert.match(architectureJs, /animation\.matchMedia/);
assert.match(architectureJs, /document\.querySelectorAll\('\.site-header, \[data-architecture-copy\],/);
assert.match(architectureJs, /clearProps: 'opacity,visibility,transform,willChange'/);
assert.match(architectureHtml, /href="contact\.html"/);
assert.match(contactHtml, /href="https:\/\/github\.com\/Xenon010101"/);
assert.match(contactHtml, /href="https:\/\/www\.linkedin\.com\/in\/anmol-patel-481b54289"/);
assert.match(contactHtml, /href="mailto:anmolpatel2112@gmail\.com"/);
assert.match(contactHtml, /anmolpatel2112@gmail\.com/);
assert.match(contactHtml, /data-contact-desk/);
assert.match(contactHtml, /assets\/anmol-portrait-transparent\.webp/);
assert.match(contactHtml, /class="contact-letter"/);
assert.match(contactHtml, /Direct correspondence/);
assert.match(contactHtml, /No form\. Nothing stored\./);
assert.doesNotMatch(contactHtml, /<form/i);
assert.match(contactCss, /\.contact-portrait__frame/);
assert.match(contactCss, /\.contact-portrait\s*\{[^}]*min-width:\s*0;[^}]*max-width:\s*100%/s);
assert.doesNotMatch(contactCss, /var\(--body\)/);
assert.match(contactCss, /\.contact-letter/);
assert.match(contactCss, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(contactJs, /data-contact-portrait/);
assert.match(contactJs, /data-contact-desk/);
assert.match(contactJs, /matchMedia/);
assert.match(html, /href="mailto:anmolpatel2112@gmail\.com"/);
assert.match(html, /systems<br> that survive\./);
assert.doesNotMatch(html, /<script[^>]+src="https?:/);
assert.doesNotMatch(html, /♙/);
assert.doesNotMatch(html + css, /nalanda-courtyard-hero\.png|anmol-portrait\.png/);
assert.equal(packageJson.dependencies.gsap, '3.15.0');
assert.ok(gsapFile.size > 50_000 && gsapFile.size < 100_000, 'Unexpected GSAP bundle size.');
assert.ok(focusBefore.size > 500_000, 'Before screenshot is missing or unexpectedly small.');
assert.ok(focusAfter.size > 150_000, 'After screenshot is missing or unexpectedly small.');

console.log('Static smoke checks passed.');
