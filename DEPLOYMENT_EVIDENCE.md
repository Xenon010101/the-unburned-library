# AWS Amplify Deployment Evidence

Verified on 31 October 2026 (Asia/Calcutta).

- Service: AWS Amplify Hosting, static `WEB` app
- Region: Sydney (`ap-southeast-2`)
- App name: `the-unburned-library`
- App ID: `d38i1t194jgpzt`
- Branch: `production`
- Initial deployment job: `1`: `SUCCEED` (11:42:50–11:42:53 IST)
- Evidence-update job: `2`: `SUCCEED` (11:48:21–11:48:30 IST)
- Verified-contact job: `3`: `SUCCEED` (11:55:47–11:55:56 IST)
- About-transition job: `4`: `SUCCEED` (15:46:37–15:46:46 IST)
- Skills-instrument job: `5`: `SUCCEED` (16:00:23–16:00:32 IST)
- Projects-archive job: `6`: `SUCCEED` (16:30:03–16:30:12 IST)
- Projects-motion-fix job: `7`: `SUCCEED` (16:41:40–16:41:49 IST)
- Architecture-evidence job: `8`: `SUCCEED` (16:58:44–16:58:53 IST)
- Architecture-baseline-label job: `9`: `SUCCEED` (17:00:29–17:00:38 IST)
- Empty deployment reservations: jobs `10` and `11`: `CANCELLED` before upload or start
- Official-AWS-icons job: `12`: `SUCCEED` (17:24:48–17:24:57 IST)
- Contact-correspondence job: `13`: `SUCCEED` (17:50:02–17:50:11 IST)
- Homepage-accessibility job: `14`: `SUCCEED` (22:32:56–22:33:05 IST)
- Homepage-focus-return job: `15`: `SUCCEED` (22:37:42–22:37:51 IST)
- About-mobile-overflow job: `16`: `SUCCEED` (23:00:39–23:00:49 IST)
- Production-release job: `17`: `SUCCEED` (09:57:29–09:57:38 IST)
- WebGL-cuboid job: `18`: `SUCCEED` (17:03:25–17:03:34 IST)
- Hero-copy job: `19`: `SUCCEED` (17:24:30–17:24:39 IST)
- Responsive-copy-fix job: `20`: `SUCCEED` (17:29:56–17:30:05 IST)
- Em-dash-removal job: `21`: `SUCCEED` (17:43:16–17:43:25 IST)
- FocusTube-copy-reduction job: `22`: `SUCCEED` (17:59:08–17:59:17 IST)
- Homepage-brick-routing job: `23`: `SUCCEED` (00:51:30–00:51:39 IST, 31 October)
- Architecture-overlay-fix job: `24`: `SUCCEED` (21:56:00–21:56:09 IST, 31 October)
- Persistent-music job: `25`: `SUCCEED` (22:26:03–22:26:12 IST, 31 October)
- Live URL: https://production.d38i1t194jgpzt.amplifyapp.com/
- Public verification: Architecture page loaded with all five local official AWS SVGs at non-zero intrinsic dimensions; the Contact page preserved all three verified destinations and fit its desk and portrait inside the 430px viewport with no horizontal overflow
- Homepage verification: at 430×932, changing reduced motion 120ms into the brick recovery opened the record immediately; Escape closed it, re-enabled the brick and returned focus to the exact trigger with no horizontal overflow
- About verification: at 390×932 and 430×932, the live page had zero horizontal overflow, retained one visible left-side journey connector per card, loaded every image and returned HTTP 200
- Production-release verification: the live homepage exposed the rebuilt archive sections, opened the illuminated Keeper manuscript dialog, and produced no browser console errors
- WebGL-cuboid verification: Chrome loaded the Three.js canvas, hid the CSS fallback, rendered the brick as an extruded and beveled cuboid, completed the recovery interaction, opened the record dialog, reset the trigger after close, and produced no browser console warnings or errors
- Hero-copy verification: the live 1440×900 and 390×844 layouts render the shortened headline and supporting line without horizontal overflow; the homepage sections and all six standalone pages retain normal content-driven vertical scrolling with no scroll snapping
- Copy verification: the live homepage, all six standalone pages and the FocusTube interaction script contain no em-dash characters
- FocusTube verification: the live manuscript keeps its existing unfurl animation, removes the repeated constraint ledger, shortens the recovery copy and has no horizontal overflow at 1440×900 or 390×844
- Brick-routing verification: the live 3D brick completes its recovery animation and opens `focus.html`; the other homepage recovery buttons retain the existing record dialog
- Architecture-overlay verification: the decorative inset remains while its background is transparent, restoring the intended black and bronze blueprint surface
- Persistent-music verification: the supplied track continued on the same audio element through Home, About and browser Back navigation without pausing or resetting

The deployment contains 43 production files in a 12.40 MB ZIP. It includes the persistent site shell, the supplied ambient track, the pinned Three.js 0.180.0 browser modules and an accessible CSS cuboid fallback. It excludes local tests, QA screenshots, browser profiles, source notes, design references, development dependencies and superseded high-resolution PNG assets. There is no deployed backend, database, authentication service, Lambda function, API Gateway or Bedrock integration.

## Repeatable update flow

1. Run `npm test`.
2. Rebuild `amplify-dist` from the production HTML, CSS, JavaScript and referenced assets.
3. Compress the contents so `index.html` is at the ZIP root.
4. Create an Amplify deployment for app `d38i1t194jgpzt`, branch `production`.
5. Upload the ZIP to the returned one-time URL and start the deployment job.
6. Wait for `SUCCEED`, then verify the public homepage and a production asset.

The optional Keeper architecture shown on the site remains a clearly labelled future enhancement and was not deployed.
