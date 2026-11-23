# Sandia Purpose website pages

Static website source for sandiapurpose.com. GitHub Actions publishes `public/` to GitHub Pages whenever `main` changes.

Each page has a distinct identity and purpose:

- `/` — Sandia Purpose Foundation: nonprofit mission, charitable giving, and Foundation involvement. Contact: rgutierrez@sandiapurpose.com.
- `/recovery-services/` — Sandia Purpose Recovery Services LLC: housing inquiries, intake requests, and referrals. Contact: sandia@sandiaprs.com.
- `/productions/` — Sandia Purpose Productions: freelance videography, seven selected films, a 20-second visual reel, and project inquiries. Contact: sandia@sandiaprs.com.

Donation links appear only on the Foundation page and open its PayPal Giving Fund charity profile. SPR intake requests use email. The website does not collect or store visitor submissions.

Legacy `/housing-referrals/` and `/merch-media/` links redirect to the relevant pages. Old homepage housing and referral fragments are routed to Recovery Services by `interactions.js`.

Productions has its own visual identity in `public/productions/productions.css` and its own menu, film player, and background-film controls in `productions.js`. Its user-supplied films are web encodes in `public/assets/productions/`; the original media remains outside the repository. The player preserves native landscape and portrait framing. Background motion respects reduced-motion preferences. Barlow Condensed and Nunito Sans are self-hosted with their font licenses.

## Local preview

Serve `public/` with a static HTTP server. The shared navigation and optional Foundation film dialog are in `interactions.js`; Foundation background-film controls are in `film.js`.

## Deployment

Push to `main`. The Pages domain and email DNS are managed separately from the site source.
