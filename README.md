# Sandia Purpose Foundation website

Static website source for sandiapurpose.com.

The public files live in public/. A GitHub Actions workflow deploys that directory to GitHub Pages whenever main is updated. The existing housing and merch URLs are retained as simple redirects to the corresponding next-step sections on the homepage.

The site is static. Foundation outreach and supporter inquiries open the visitor's email app. Housing and referral links let visitors call Recovery Services or request a callback by email. The site does not collect or store visitor data.

Before restoring online booking, open the replacement schedule signed out, check that it offers a time with Recovery Services, and complete a test booking and cancellation with the coordinator. Check that both parties receive the confirmations. Keep the phone and email options available alongside any future booking link.

## Local preview

Serve public/ with any static HTTP server, then open the local address it prints.

## Deployment

Push to main. GitHub Actions publishes public/ to the github-pages environment. The custom domain is configured separately in the repository's Pages settings and at Squarespace DNS.
