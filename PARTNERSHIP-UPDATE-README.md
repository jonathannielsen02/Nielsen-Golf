# Nielsen Golf — Partner With Us update

Updated `src/views/PartnerWithUsView.tsx` only. All other website files are preserved from the ZIP supplied on October 12, 2026.

## What changed
- Replaced the old dynamic sponsorship tier grid in the Sponsor section with four fixed tier cards: Supporting $100/mo (4 credits), Official $250/mo (8), Premier $500/mo (15), Signature $750/mo (22).
- Preset packages fully allocate their credits; no personalized video is included by default.
- Added an optional experience menu with credits and estimated standalone values.
- Reused the existing sponsor inquiry modal and submission flow, updated its budget and branding options to match the new tiers.
- Preserved donations, investments, partner logo wall, routing, Google Sheets data handling, and other website sections.

## Publish to GitHub
This ZIP contains the full repository folder. **Do not upload the ZIP as one file to the repo.** Unzip it, open `Nielsen-Golf-main`, and copy the modified `src/views/PartnerWithUsView.tsx` into the matching path in your GitHub repository. Commit to the branch used by GitHub Pages. Alternatively use Git to replace your repository working tree with the extracted folder, review the diff, commit and push.

## Important
- The uploaded archive is dated September 12, 2026. If you've edited the live website since then, replacing the entire repository with this archive may undo newer changes. Safest approach: upload only the modified `src/views/PartnerWithUsView.tsx` file to the current GitHub branch.
- Sponsorship inquiries continue to use the website's existing submission backend. Confirm it works on your deployed site.
- All amounts are illustrative proposals; confirm contractual terms and availability before accepting partners.
- Dependencies were not present locally, so an npm/TypeScript production build was not run here.
