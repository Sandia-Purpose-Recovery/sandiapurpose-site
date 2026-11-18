# Sandia Purpose Foundation website

Static website source for sandiapurpose.com.

The public files live in public/. A GitHub Actions workflow deploys that directory to GitHub Pages whenever main is updated. The existing housing and merch URLs are retained as simple redirects to the corresponding next-step sections on the homepage.

The source is a static front end. It does not collect or store visitor data. Contact links open the visitor's email app; intake scheduling links open the published Google Calendar appointment page.

## Local preview

Serve public/ with any static HTTP server, then open the local address it prints.

## Deployment

Push to main. GitHub Actions publishes public/ to the github-pages environment. The custom domain is configured separately in the repository's Pages settings and at Squarespace DNS.
