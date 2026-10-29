# Release validation — 29 October 2026

Passed: TypeScript; catalogue and request validation rules; 33 photo/157 responsive variant asset checks; bounded photo cache tests; independent signed-token authentication tests; deployment configuration checks; production build; Cloudflare deployment dry run.

The managed browser preview rendered the protected /admin page with “Owner sign-in required” without a token. No ChatGPT login is used by this edition.

Not yet verified in your Cloudflare account: real Access email login, authenticated product/price edits and uploads, D1-backed order submission and repeat-token handling, actual delivery/CPU limits, DNS/HTTPS, real WhatsApp contact, migration of existing customer records/uploads, and backup restore. Perform the live acceptance checklist in START-HERE before switching traffic. The deployment is not complete until these pass.

This is a fresh-resource migration package, not a snapshot of live database or uploaded R2 objects. The existing Site remains the rollback until migration is reconciled. Do not merge this alternative deployment configuration into the working Sites branch without planning that transition.
