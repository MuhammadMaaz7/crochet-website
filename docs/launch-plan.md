# PhotoCraftSquare launch decisions
29 October 2026. Recommendations, not evidence of sales or guaranteed ad performance.

## Brand
Warm cream, blush, sage and restrained lilac; dark green readable text and buttons. Rounded controls, photographic product cards, brief fades, tactile hover/press feedback and one-time section reveals. No autoplay video, continuous decorative animation, heavy 3D engine or full-screen loading animation. Reduced-motion users get the complete interface without movement. Islamabad is useful maker provenance and shipping context, not a limitation: keep it in the story and delivery details, rather than lead with geography.

## Catalogue
Lead with floral tissue cover, coordinated dining set, golden fan bag, tulip bouquet, cream tulip pouch and bookmark. Keep the dining set as one configurable product. Berry keyring and penguin stay unpublished pending stronger photos. Fourteen current designs remain visible, including the phone crossbody, bow keyring and two-flower tissue cover added in the catalogue expansion.

Next archive-backed candidates, in priority order:
1. Phone crossbody bag: now listed by quote with a cleaned product photo and a phone-fit question; verify final strap, lining, fastening and load before acceptance.
2. Initial keyring: simple personalised gift; verify supported letters, dimensions, hardware and colour range.
3. Bow keyring: now listed by quote with a cleaned photo; verify hardware, price and repeatable finish.
4. Crochet gajray: clear Mehndi/Mayun occasion; verify pair/single, fastening, fit, materials and deadline capacity.
5. Cactus crossbody bag: distinctive custom design; verify capacity, strap, lining and production cost.

These designs were identified in the prior PhotoCraftSquare-only Instagram audit. The phone bag and bow keyring now have photographed, quote-only listings; the remaining designs are custom-request starting points, not confirmed stock listings. Do not turn archive/student/customer pieces into available products without maker approval. Obtain one clean hero photograph plus detail/scale views and current specifications for each before publishing a standalone listing. Do not manufacture catalogue breadth with invented products or unverified AI angles.

Colour priorities: sage/lilac/oat for floral covers; olive/mustard, rose/sage and teal/seafoam for dining. Existing previews are approximate concepts. For new products, show approved yarn swatches first and prepare product-specific images after the maker verifies the actual options. No arbitrary CSS tint or unsupported AR promise.

## Hosting and domain
The site is already public on Sites, using Cloudflare Workers/D1/R2. Keep this deployment while improving the store; changing hosts alone will not fix oversized images. Sites supports attaching a custom domain. A Vercel migration is possible but requires backend, storage and authentication adaptation; do not point the domain at an unprepared deployment.

Registrar availability/prices checked through Vercel's domain search, 29 October 2026 (USD, one year; not purchased; quotes can change):
- photocraftsquare.com: available, $11.25 registration / $11.25 quoted renewal. Preferred.
- shopphotocraftsquare.com: available, $11.25 / $11.25. Backup only.
- photocraftsquare.shop: available, $2.99 / $38.39. Less attractive ongoing cost.
- photocraftsquare.pk: reported unavailable by this provider; this is not a definitive registry ownership check.

## Measurement comes before paid acquisition
Configure privacy-conscious visitor/performance analytics before promoting the site. Cloudflare Web Analytics is an option: page views, referrers, devices and real-user performance without cookies. It requires the business's analytics account and site token; no tracker has been silently connected. Separate business measures: product views, custom-request starts, submitted requests, owner quotes, accepted orders and completed sales. A saved request is a lead, never a Purchase event.

Track request rates, error rate, submission failures, image transfer sizes and Core Web Vitals; establish a baseline before setting traffic-spike alerts. Requests/assets are not unique people. Bot traffic, retries, blockers and manual sales confirmation affect counts. Protect owner reports; never put contact details, free-text briefs or full request URLs into analytics events. Monitor mobile experience from Pakistan, including Instagram's in-app browser. Server observability and real-user analytics answer different questions.

## Ads
Begin with improved Instagram presentation and organic traffic. Pin a strong product, how-to-order guide and maker introduction. Product posts should link to their exact product page and show current price or a useful price range once costed. Add campaign tags that contain no personal information.

Do not buy broad traffic while prices, making times, business contact, delivery charges, notification follow-up and owner workflows remain unverified. After a real end-to-end order is completed, test a small, maker-capacity-limited campaign for one hero product. Agree the spending cap before creating a paid campaign. Compare qualified requests and accepted orders, not likes. Click-to-WhatsApp can suit assisted custom sales once the real business number and response process are ready. No campaigns, advertising accounts or pixels were created in this pass.

Before commercial launch: approved current product costs/prices, materials/dimensions/care, delivery/returns terms, real contact, owner login test, order notification process, a test fulfilment, backups and custom domain. SEO indexing is intentionally disabled during this review stage; publish accurate metadata/sitemap and enable indexing when ready.

## Sources
- Responsive images and priority: https://web.dev/learn/design/responsive-images
- Cloudflare asset caching: https://developers.cloudflare.com/workers/static-assets/
- Static headers and hashed-asset cache policy: https://developers.cloudflare.com/workers/static-assets/headers/
- Cloudflare Web Analytics: https://developers.cloudflare.com/web-analytics/about/
- Meta website-data training: https://www.facebookblueprint.com/student/activity/714073
