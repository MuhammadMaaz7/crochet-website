# PhotoCraftSquare — independent Cloudflare edition

Start with [deployment/START-HERE.md](deployment/START-HERE.md). This is a separate hosting alternative; it does not deploy or modify the existing ChatGPT Site.

The complete private release includes the public product assets. The public GitHub source intentionally omits photographs and is not a standalone deployable asset bundle.

- Worker: storefront, API and protected admin in one deployment.
- D1: catalogue edits, settings and requests.
- R2: owner uploads.
- Cloudflare Access: email-code login with server-side signature, issuer, audience and exact-owner checks.

Copy no credentials into source control. The interactive setup writes ignored local configuration. Deployment and live owner login require your Cloudflare account setup; a successful local build is not a completed production migration.

See [validation](deployment/VALIDATION.md) for completed checks and remaining live acceptance work.
