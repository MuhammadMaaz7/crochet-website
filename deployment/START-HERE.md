# PhotoCraftSquare: independent Cloudflare deployment

Prepared 29 October 2026. Use this complete private package on your Mac. The existing ChatGPT-hosted shop remains online; none of the steps below require sharing a password or API token in chat. This package is a separate Cloudflare branch, not an instruction to overwrite the working Site.

## What is ready, and what is not

Ready in code: storefront, PKR starting prices, product colours, saved requests, owner editor, upload endpoint, image optimisation/cache, and independent signed-token owner authentication. Tested locally with real signed synthetic tokens. The independent production deployment, actual Access login, live data/media transfer and real order fulfilment still require the account steps below. The package includes source product photos, but no existing customer records, runtime secrets, owner-uploaded /media objects or private research.

The new admin uses Cloudflare Access. It accepts only an RS256-signed token with the configured issuer/application audience, required timestamps/identity and the exact allowed owner email. Missing settings, missing/invalid token and old ChatGPT identity headers cannot grant access. The intended owner is the email you supplied privately; enter it in the local setup prompt rather than committing it to GitHub.

## 1. Prepare the Mac

Download and unzip this package into a new folder, for example `~/Projects/photocraftsquare-cloudflare`. Open Terminal in that folder (the folder containing package.json, not the deployment subfolder).

Use Node 24 LTS and Corepack. Check:

```bash
node --version
corepack --version
```

If Corepack is missing, install it with `npm install --global corepack` from the npm registry. Node should show v24.x. If your shell still selects a different Homebrew Node, fix the PATH before proceeding. Do not uninstall your other projects' tools.

Install the exact pinned dependencies:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm check
```

Do not run the old Sites installation/publication helpers. This branch builds independently with its own Vite/Worker configuration.

## 2. Authorise Cloudflare locally

```bash
corepack pnpm exec wrangler login
corepack pnpm exec wrangler whoami
```

Your own browser opens. Use Continue with Google and select your intended Cloudflare account. Review the requested permissions and approve locally. The second command should show that account. Do not paste tokens, passwords, login codes or Wrangler's local credential file into chat.

If login cannot finish, stop here and report the error text without credentials. Your Google login in your normal browser does not authenticate ChatGPT's remote browser; the local CLI flow avoids that problem.

## 3. Create separate staging resources

First inspect Workers & Pages in the Cloudflare dashboard and choose a workers.dev subdomain if Cloudflare asks for one. Use a NEW database and bucket, not the existing ChatGPT-hosted resources.

```bash
corepack pnpm exec wrangler d1 create photocraftsquare-staging
corepack pnpm exec wrangler r2 bucket create photocraftsquare-staging-media
```

Copy only the NEW D1 database_id from the first command. Resource IDs are configuration, not API tokens. If R2 asks you to activate billing, inspect the terms and free allowance first; do not enable a paid plan/add-on unintentionally. R2 has usage billing beyond its free allowance. Account creation and a free DNS plan do not guarantee all app services are unlimited/free.

Run the interactive setup and enter the new D1 ID and your intended owner email:

```bash
corepack pnpm cf:prepare
```

It creates ignored `wrangler.json`, with owner-specific settings. It leaves the admin locked. Its default Worker/database/bucket names match the commands above. Never replace the database ID with the old Sites ID.

Apply the schema ONLY to that new database:

```bash
corepack pnpm exec wrangler d1 migrations apply photocraftsquare-staging --remote --config wrangler.json
```

Confirm the CLI identifies the new staging database. The migration command creates the catalogue/settings/request/rate-limit tables. Default catalogue entries come from source; live owner edits and requests are not yet migrated.

## 4. First deployment with admin locked

```bash
corepack pnpm cf:deploy --locked-admin
```

This checks configuration/assets, type-checks, tests authentication, builds and deploys via the generated Cloudflare Vite config. It does not log in to ChatGPT. The deploy command uses your local Cloudflare login.

Copy the exact HTTPS workers.dev URL printed after success. In `wrangler.json`, set `vars.SITE_ORIGIN` to that origin without a trailing slash. Do not guess the subdomain. Admin remains denied until Access is configured.

Test the public shop on your phone. Check photos, colours, product links and the custom form. Submit one synthetic request using `test@example.invalid`; it is a stored lead, not a purchase. Do not send real customer's data during staging. Leave the old shop running.

In Cloudflare > Worker > Metrics, check errors and CPU time across several product pages and request submissions. Free Workers currently have a 10 ms CPU limit per request, so a server-rendered React shop must be measured. If you see CPU-limit errors or latency, stop and optimise/cache the public catalogue or explicitly choose a paid plan. Do not enable a subscription automatically. Static asset delivery and dynamic Worker execution have different limits.

## 5. Register and connect the domain

PKNIC lookup reported `photocraftsquare.pk` unregistered on 29 October 2026; this is not a reservation. PKNIC's published Pakistan rate is PKR 2,100 per year, paid PKR 4,200 for two years. Check final checkout, registrant ownership, renewal terms and availability yourself before paying. You create/own the registrar account and enter payment details locally. Do not buy hosting or email extras merely to register a domain.

1. Register the chosen domain in your own PKNIC/authorised registrar account.
2. In Cloudflare, add that exact domain as a zone and select the Free DNS plan if it fits the displayed terms.
3. Copy the TWO nameservers Cloudflare actually assigns to that zone. Set those exact nameservers at the registrar. If the domain has existing email or records, preserve them before changing nameservers.
4. Wait until Cloudflare reports the zone Active.
5. In the staging Worker's Settings > Domains & Routes, add the apex domain as a Custom Domain. Review the exact Worker target before confirming. Cloudflare should provision HTTPS; test it before continuing.
6. Decide whether www redirects to the apex. Configure an HTTPS redirect preserving the path/query and test it. Do not leave two different canonical order origins.
7. Change `vars.SITE_ORIGIN` to the exact final HTTPS apex origin and redeploy with `--locked-admin`.

Do not switch Instagram links yet. Adding the new domain does not move data from the old shop.

## 6. Configure private admin login

In Cloudflare Zero Trust, set a team name and choose an appropriate plan after reviewing the current price/seat/payment requirements. For passwordless owner login, enable the One-time PIN identity provider. It emails a login code to the approved address; it is separate from the Google password and from WhatsApp.

Create ONE self-hosted Access application with a 24-hour session and these protected paths on the FINAL hostname:

- `photocraftsquare.pk/admin` and its subpaths (use the dashboard's path wildcard form `/admin*`).
- `photocraftsquare.pk/api/admin` and subpaths (`/api/admin*`).
- `photocraftsquare.pk/api/media` and subpaths (`/api/media*`).

Add one Allow policy: Emails equals only your intended admin email. Do not add Everyone, an entire Gmail domain, or a public bypass policy. Keep `/`, `/shop/*`, `/custom`, `/api/requests`, `/assets/*` and public `/media/*` images public. Protecting the whole hostname would prevent customers shopping.

Use the same Access application/AUD for the three protected paths. If the dashboard requires separate applications, stop and adapt the code to explicitly allow their audiences; do not guess or remove JWT validation.

Copy the actual team origin and Application Audience (AUD) from this application. In local `wrangler.json`, set:

- CF_ACCESS_TEAM_DOMAIN: `https://YOUR-REAL-TEAM.cloudflareaccess.com`
- CF_ACCESS_AUD: the actual application AUD tag
- ADMIN_OWNER_EMAIL: exact approved email
- SITE_ORIGIN: exact final shop origin

These are configuration values, not passwords. Never put API tokens or Google passwords in this file.

```bash
corepack pnpm cf:preflight
corepack pnpm cf:deploy
```

Open `https://photocraftsquare.pk/admin`. Access should ask for the approved email, email you a code and then open the admin. Wrong emails must be denied. Direct workers.dev access to admin cannot grant access from old identity headers; still disable unused workers.dev/version-preview routes in the dashboard after final-domain tests, or protect every route consistently. Recheck staging URLs and alternate hostnames.

## 7. Test the admin and ordering end to end

On the new host, using synthetic records:

1. Requests: find the test request, enter a quote, advance status; verify that setting a payment status is only manual bookkeeping, not payment verification.
2. Pieces: change one test price, reload the storefront and confirm it updates. Restore it. Test a draft/unpublished product.
3. Photo upload: upload one maker-owned test photo under 5 MB; verify it loads after reload. Owner replacement photos must not inherit unrelated generated colour previews.
4. Shop settings: add the chosen public WhatsApp number in international digits-only format, e.g. country code plus number without the local leading zero. A regular WhatsApp account works. The number becomes visible to visitors.
5. Test direct footer chat and saved-request Continue on WhatsApp on a phone. Clicking a chat link does not send a message until the visitor sends it.
6. Test a pair of gajray (quantity 2; price is per individual gajra), a custom colour, a bunting wording/date and a variable dining set. Final quote must include agreed scope and delivery.
7. In a private browser window, admin/API/media-upload must require login or return denied; a public customer can shop and submit a request without creating an account.
8. Test from Instagram's in-app browser and a mobile connection.

Requests are saved to the database. There is no automatic owner email/WhatsApp notification service. Until one is separately configured and tested, the maker must check admin regularly. Do not promise automatic alerts just because an email/phone is stored.

## 8. Move real data privately, then launch

Export existing products/settings/requests and owner-uploaded media from the old host using authorised private access. The supplied package does NOT contain them. Keep customer records out of GitHub, chat transcripts, public buckets and public links. Preserve IDs, timestamps, object keys and request statuses during import; do not reset production tables. Rate-limit records are transient, not customer order history.

If there are no real records/uploads, verify that with the owner; do not assume it. Confirm row counts and several records privately after import. Pause old intake briefly during final synchronisation, import the final delta, then update Instagram/WhatsApp links. Keep the old site available for rollback, but avoid accepting requests into both databases unknowingly.

Before ads: maker validates prices against costs/labour, photos and dimensions; set delivery/making times, payment/deposit/cancellation terms, packing and dispatch capacity. The website currently marks SEO as noindex for review. Enable accurate metadata/indexing only when the final store is ready.

## 9. Backups, maintenance and rollback

- Export the new D1 database regularly to private storage, e.g. `corepack pnpm exec wrangler d1 export photocraftsquare-staging --remote --output deployment-state/shop-backup.sql --config wrangler.json` after creating the ignored private folder. Treat the SQL as customer data; encrypt/off-site backup and retention are your responsibility.
- Back up owner-uploaded R2 objects separately; a SQL export does not include image files. The home server can hold an additional private backup, not the only copy.
- Keep resource IDs/config, source/lockfile, product assets and release notes together privately. Never commit live records or credentials.
- Use Cloudflare Worker deployment/version history to roll back code. A code rollback does not undo database writes, schema changes or restore deleted images.
- Check errors, form failures, storage/CPU usage and owner replies after each release. Domain renewal and account recovery remain the owner's responsibility.

## Sources

- https://developers.cloudflare.com/workers/vite-plugin/get-started/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/
- https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/
- https://developers.cloudflare.com/workers/wrangler/commands/d1/
- https://developers.cloudflare.com/r2/get-started/cli/
- https://developers.cloudflare.com/workers/platform/pricing/
- https://www.pknic.net.pk/pricing.html
