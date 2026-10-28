# PhotoCraftSquare shop
A focused crochet catalogue, custom-request workflow and private studio workspace.
## Run
Use Node 22.13+ and the included package manager lockfile. Install with the Sites dependency helper, generate the schema with `npm run db:generate`, build and apply local D1 migrations as described in the starter docs. Use the supported Sites preview command for this environment.
## Architecture
- Vinext server-rendered pages, React interactions and plain CSS.
- D1 stores product overrides, settings, enquiries and rate-limit counters.
- R2 stores administrator-uploaded product images.
- ChatGPT sign-in supplies identity; an explicit owner allowlist authorizes the studio server-side.
- SITE_ORIGIN is the canonical origin accepted by mutation endpoints.
- No raw card data, gateway integration, courier booking or automated payment confirmation.
## Configuration
Set ADMIN_USER_ID to the verified Site owner identity, or ADMIN_OWNER_EMAIL to the verified owner email resolved from the platform access policy, through runtime configuration. It is not the GitHub username or Instagram username. Never put credentials in source. Missing admin identity denies studio access. Configure SITE_ORIGIN to the exact deployed origin. Add the optional WhatsApp number through studio settings, digits in international format.
## Content
Four catalogue candidates use images from PhotoCraftSquare's Instagram and AI-assisted styling concepts. Reference images are available on product pages. The maker must verify the images, current availability, specifications, prices and policies before customer launch. No historical prices are used as current prices.
## Safety and scope
Request receipt is distinct from order acceptance. Product prices are looked up on the server; quotes and payment verification are administrator-only. No public customer lookup. Mutation origins, server validation, size limits, anti-spam fields and bounded request rates are enforced. Admin photos are limited to raster images and served with an allowlisted content type and nosniff. Public reference-image uploads are not enabled.
This is an owner-private review deployment. Before public launch: verify image fidelity and ownership, complete product specs, confirm contact/payment/delivery/returns/privacy procedures, test owner access, backups and operational follow-up, and review platform audience/access. Keep this explicit admin allowlist when changing audience.
## Checks
`node --experimental-strip-types scripts/check-business-rules.mjs`
`node node_modules/typescript/bin/tsc --noEmit`
Use the maintained build helper to create deployment output. Browser QA covers collection filtering, product views, source-image comparison, enquiry saving and private admin access. Local test customer data is synthetic and stays out of source.
## 3D
Photo tilt is a presentation effect, labelled as such. True product rotation requires a real multi-angle shoot or verified model. A single edited front image must not be sold as a verified 360-degree view.
## Git
Legacy code remains on the original repository's development branch. The new shop belongs on its own feature branch; do not overwrite development. Site runtime identity is kept in the hosting manifest; private research and customer data do not belong in the public repository.


## Image assets omitted from public source
The seven product/reference image assets are intentionally excluded from this public branch pending explicit permission to publish them on GitHub. They are present in the owner-private Site deployment. To run with your own assets, place properly licensed photos at the paths listed in lib/catalog.ts or replace those paths and descriptions. The source branch does not include private research reports, customer records, runtime secrets or account information.


## Mobile storefront and product colour previews

The published collection contains twelve designs; the penguin is an unpublished draft. Every product card opens its product page, with decorative numbering and quick-add controls removed. Phones use a compact header and menu, shorter image-led hero, two-column collection, photo-adjacent colour swatches and a persistent request button. The dining-set configurator lives only on its product page.

The dining set and floral tissue cover offer prepared photo colour concepts of their actual designs. These are labelled approximate AI-assisted visualisations, not manufactured colour stock, arbitrary live recolouring or camera AR. Original studio photographs remain available. Product-specific choices survive browsing and carry into one saved enquiry. Replacement primary photos disable stale preview packs.

The public source mirror excludes all product/reference/colour-preview images, private research, customer records and runtime credentials. Image paths are defined in lib/catalog.ts and lib/customisation.ts; authorised private assets are required for a complete visual build.

Validation: TypeScript, production build, safe catalogue paths, unique IDs, unpublished penguin and stale-preview guards. Browser QA reviewed three narrow iframe layouts without horizontal overflow, menu and product navigation, direct-tap/keyboard photo colour selection, gallery originals, sticky request action and multi-product requests. A request with separate dining-set and tissue-cover colour choices persisted to D1. Physical-phone/Safari-device and owner-authenticated admin browser checks remain outstanding.
