# PhotoCraftSquare

A mobile-first crochet storefront with guided product/custom requests and an owner-only workspace. Existing legacy development remains on its original branch. This feature branch is the current storefront implementation; the draft PR is not merged.

## Runtime and publishing
Vinext / React on Sites' Cloudflare Workers runtime, D1 for catalogue overrides and order requests, R2 for owner-uploaded photos. The existing public review site is https://photocraftsquare-studio.wellsugar256.chatgpt.site . Source updates are built, versioned and published through the Sites workflow. This is not a Vercel deployment. Moving to Vercel would require adapting the Worker/D1/R2 and authentication integrations.

## Ordering
Product cards open detail pages. The dining set has a set-content planner; it is one product. Dining-set and floral-cover colourways use prepared approximate photo concepts, not AR or arbitrary live recolouring. Replacing a product's base photo disables its old preview pack.

Both product and custom requests use three steps. Custom requests are independent of selected products. Product selections, colours and quantities can persist locally; contact fields are not stored in browser storage. Saved requests are quotes awaiting owner confirmation, not paid or confirmed orders. Custom starting-point suggestions include archived designs and require feasibility/availability confirmation.

## Owner access and integrations
Set `ADMIN_USER_ID` or `ADMIN_OWNER_EMAIL` from the verified platform owner identity, and `SITE_ORIGIN` to the exact deployed origin. Never put secrets in source. `/admin`, `/api/admin` and uploads enforce owner authorisation server-side. No public admin links. An anonymous visitor or forged identity header cannot grant owner access.

Requests save to D1 without email or WhatsApp. Email is a reply preference, not an automatic notification. A real business WhatsApp number can be configured in owner settings to offer a voluntary handoff after saving. Automated email, payment processing and courier integration are not connected.

## Photos and performance
`ProductPhoto` uses responsive WebP derivatives for known photos, appropriate `sizes`, asynchronous decoding, lazy loading below the fold and high priority for the main hero/product photo. Original photo files are never overwritten. Derivative filenames contain a content hash; `/assets/pcs-*` has a one-year immutable browser-cache policy in `public/_headers`. Verify the effective production header after publication; a platform response may override static header rules. Cloudflare static-asset caching is managed by the host. Customer data and admin responses are never covered by this image-cache rule.

Run `python scripts/optimise-images.py` (Pillow required) after changing approved source photos. Commit the regenerated manifest and image derivatives together to the hosted repository. New owner uploads fall back to their original URL until reviewed and optimised; arbitrary external images are not fetched. Product photos/derivatives, private research, customer data and credentials are excluded from the public GitHub source mirror. The mirror needs approved image assets restored for a complete visual build.

The public collection currently has twenty designs; berry and penguin are unpublished until suitable photos are available. Best home pieces, the golden bag and bouquet lead. Original-photo comparisons and process notes are absent from customer galleries. Approximate colour previews retain a short shade-variation label.

## Checks
- `node node_modules/typescript/bin/tsc --noEmit`
- `node --experimental-strip-types scripts/check-business-rules.mjs`
- `node scripts/check-image-delivery.mjs`
- Build using the supported Sites build helper.

Browser QA covers product navigation, colour previews, custom requests, validation, preference persistence and narrow layouts. Owner-authenticated admin browser testing, real phone/slow-network performance and operational fulfilment testing remain launch tasks. Motion honours reduced-motion preferences. No unsupported reviews, prices, stock or product safety claims are invented.

See `docs/launch-plan.md` for catalogue, hosting, domain, analytics and advertising decisions.

## Catalogue expansion
Three photographed designs have been added: purple phone crossbody, blush bow keyring and grey two-flower tissue cover. Their source posts were reviewed within PhotoCraftSquare; backgrounds were edited with the built-in image tool and the outputs compared to the references. Photography remains subject to maker fidelity review. Source-photo comparisons stay internal. Thirty-one known photos now have 145 responsive derivatives.

Product pages without prepared photo colourways have a colour-request choice, relevant fit question and optional maker note. The phone bag asks for model/dimensions including its case; tissue covers ask for box dimensions. These choices persist with selected-design notes and reach the stored request. A custom colour request does not digitally recolour that photo. Related products respect public catalogue data and unavailable status. Product routes have individual titles, descriptions and share-image metadata. Request-scoped catalogue memoisation avoids duplicate metadata/page reads.

Requests support at most 12 distinct designs. Additional selection shows an explanation and the picker disables extra designs until a selected one is removed. Quantities remain separately editable. No current price, stock, material or dimensions are invented.

## Occasion and larger-piece merchandising
Six further quote-only listings: bow shoulder tote, colour-block shoulder bag, cactus crossbody, marigold gajra, rose/jasmine gajra and personalised bunting. The homepage leads with larger bags and celebration pieces; keyrings remain smaller gifts further down. An Occasion category is shared between the catalogue schema, storefront and owner editor.

Nine designs have product-specific photo palette packs. Collection-card swatches change the actual photo, link to the selected palette and restore it on the detail page; share-image metadata also follows a recognised palette. Unknown palette query values fall back to the base product. Replacing a primary photo still disables its stale pack. Free-text colour requests do not claim live recolouring. Fit questions remain available on palette-enabled products.

Gajra quantities count individual items (2 means one pair). Shortcut buttons offer 1, 2 or 6 and permit a quantity up to 50, subject to maker confirmation. Wrist size and colours enter per-product notes; the event date uses the existing request deadline. Bunting requires wording before opening an order request. Photos show actual observed design/detail, with approximate background/colour treatments requiring final maker review. See docs/catalogue-strategy.md for sourced commercial hypotheses and limits.

Occasion orders show the event date directly on the details step. The date is retained across Back/Continue, appears in the contact review and optional handoff summary, and was verified in a saved local D1 request alongside two gajray, wrist measurement and the selected blush palette. Bunting empty wording was blocked in browser QA before adding it to a request. Mobile checks covered collection category layout, card swatches, palette-preserving navigation and sticky product form actions.
