# The Unburned Library

A static implementation of Anmol Patel's AWS portfolio concept. GSAP 3.15.0 is pinned in `package.json` and self-hosted from `assets/vendor` so the deployed page does not rely on a third-party CDN.

## Preview locally

Run any static file server from this folder. For example:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Verify

```powershell
npm test
```

## Deploy to AWS Amplify Hosting

The static site is deployed to AWS Amplify Hosting in Sydney (`ap-southeast-2`):

- Live site: https://production.d38i1t194jgpzt.amplifyapp.com/
- App ID: `d38i1t194jgpzt`
- Branch: `production`

No build command or backend is required. See `DEPLOYMENT_EVIDENCE.md` for the verified deployment record and repeatable update flow.

## Before submission

- Recheck the FocusTube source, Edge listing and privacy link immediately before submission; authentic repository screenshots are already integrated.
- Reconfirm the published email, GitHub and LinkedIn destinations immediately before submission.
- Verify every project claim and contribution.
- Add responsive image variants if field testing shows the current WebP assets are still too large.
- Test keyboard, reduced-motion and low-end mobile behaviour.
