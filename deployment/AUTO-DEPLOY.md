# Automatic deployment

Prepared, not enabled. The public source mirror deliberately omits product photographs. Use a PRIVATE full-source deployment repository containing the complete package and storefront public/ assets. Never commit wrangler.json, .dev.vars, customer records or deployment-state. The workflow deliberately skips public repositories and repositories without CF_AUTODEPLOY=true.

After verifying manual deployment and owner login, copy the three files from this change into the complete local package: .github/workflows/cloudflare-deploy.yml, scripts/cloudflare-ci-config.mjs and this guide. Create a private deployment repository with the full package. Do not change the visibility of the existing public repository, which can affect existing integrations.

In that private repository, Settings > Secrets and variables > Actions:

Secrets:
- CLOUDFLARE_API_TOKEN: create a dedicated custom Cloudflare API token scoped to this account, with Workers Scripts Edit and Workers R2 Storage Write, plus D1 Read for binding lookup. If the deploy API reports a missing permission, inspect it before granting more. The token is for existing resources, not DNS/domain purchases or account administration.
- CLOUDFLARE_ACCOUNT_ID: your account identifier.
- PCS_OWNER_EMAIL: exact owner email accepted by this release.

Repository variables:
- PCS_D1_ID: existing staging database UUID.
- PCS_SITE_ORIGIN: exact HTTPS shop origin, no trailing slash.
- PCS_ACCESS_TEAM: exact HTTPS team.cloudflareaccess.com origin.
- PCS_ACCESS_AUD: saved admin application's audience tag.
- CF_AUTODEPLOY: true, set LAST after all other values/assets are ready.

Pushes to main or feat/independent-cloudflare run dependency installation, configuration validation, source/asset/auth tests, production build and deploy to the existing staging Worker. Other branches and pull requests do not deploy. Failed checks stop deployment. Jobs are serialized and have read-only GitHub permissions. No remote database migration runs automatically; schema changes require a reviewed migration before releasing dependent application code.

Use a dedicated token rather than a Global API key or the local OAuth token. Paste it directly into GitHub Secrets, not a chat, source file or terminal command history. This workflow does not require a Cloudflare paid Workers plan. GitHub Actions usage is subject to your account's included minutes and billing settings; review these before enabling.

One-time live acceptance: push a harmless visible content edit, inspect the Actions run, confirm Worker deployment success and verify the edit on the website. Restore the content if it was only a test. Until that succeeds, automatic deployment is not verified.

Future code updates must target the PRIVATE deployment repository. A push only to the old public mirror will not deploy this private repository. Keep the public source mirror optional; use the private deployment repository as the authoritative source for future work.
