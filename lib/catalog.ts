import { z } from "zod";
export const categories=["Little gifts","For the home","Bags & accessories","Occasion pieces"] as const;
export const productSchema = z.object({ id: z.string().regex(/^[a-z0-9-]{1,60}$/), name: z.string().trim().min(2).max(100), category: z.enum(categories), description: z.string().trim().min(10).max(2000), image: z.string().regex(/^\/(assets\/[a-zA-Z0-9_.-]+|media\/[a-zA-Z0-9-]+)$/), reference: z.string().regex(/^\/assets\/[a-zA-Z0-9_.-]+$/).optional(), gallery: z.array(z.object({ image: z.string().regex(/^\/(assets\/[a-zA-Z0-9_.-]+|media\/[a-zA-Z0-9-]+)$/), label: z.string().max(80) })).max(8).optional(), price: z.number().int().min(1).max(1000000).nullable(), availability: z.enum(["Enquire", "Made to order", "Ready to ship", "Unavailable"]), leadTime: z.string().max(100), details: z.string().max(1000), published: z.boolean(), styled: z.boolean() });
export type Product = z.infer<typeof productSchema>;
export const defaults: Product[] = [
  {
    "id": "tulip-cream",
    "name": "Tulip pouch · cream",
    "category": "Bags & accessories",
    "description": "A small crochet pouch with a row of blush tulips, green stems and a button-fastened flap. A little floral detail for your everyday essentials.",
    "image": "/assets/tulip-cream.webp",
    "reference": "/assets/pouch-reference.jpg",
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "details": "Dimensions, yarn and lining to be confirmed. Ask about your preferred colours.",
    "published": true,
    "styled": true
  },
  {
    "id": "tissue-garden",
    "name": "Granny-square tissue cover",
    "category": "For the home",
    "description": "A multicoloured crochet tissue-box cover with floral squares and textured rows. A practical piece with plenty of personality.",
    "image": "/assets/tissue-styled.webp",
    "reference": "/assets/tissue-reference.jpg",
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "details": "Please share your tissue-box dimensions so we can confirm the fit. Box contents are confirmed before acceptance.",
    "published": true,
    "styled": true
  },
  {
    "id": "tulip-pink",
    "name": "Tulip pouch · pink",
    "category": "Bags & accessories",
    "description": "Bright pink crochet, mint edging and a row of pale tulips. A cheerful button-fastened pouch for small everyday things.",
    "image": "/assets/tulip-pink.webp",
    "reference": "/assets/pouch-reference.jpg",
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "details": "Dimensions, yarn and lining to be confirmed. Custom colours can be discussed.",
    "published": true,
    "styled": true
  },
  {
    "id": "tooth-keepsake",
    "name": "Tooth keepsake",
    "category": "Little gifts",
    "description": "A smiling crochet tooth with a pink bow and a little white coat. An idea for a dentist, dental student or a desk that needs a smile.",
    "image": "/assets/tooth-styled.webp",
    "reference": "/assets/tooth-reference.jpg",
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "details": "Decorative keepsake. Size and material to be confirmed; no infant or toy-safety certification is claimed.",
    "published": true,
    "styled": true
  },
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "golden-fan-bag",
    "name": "Golden fan bag",
    "category": "Bags & accessories",
    "description": "An intricate golden crochet sling bag with a fan-shaped flap, scalloped edges and an oval button. A small statement with a lot of stitch detail.",
    "image": "/assets/fan-bag-styled.webp",
    "details": "Confirm dimensions, strap length, lining and yarn with the studio.",
    "reference": "/assets/fan-bag-original.webp"
  },
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "tulip-bookmark",
    "name": "Tulip bookmark",
    "category": "Little gifts",
    "description": "A pale pink and lilac crochet tulip with an olive-green stem and leaf. A little bloom to keep your place between chapters.",
    "image": "/assets/bookmark-styled.webp",
    "details": "Ask about stem length and available flower colours. Books are styling props.",
    "reference": "/assets/bookmark-original.webp"
  },
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": false,
    "styled": true,
    "id": "penguin",
    "name": "Pocket-sized personality",
    "category": "Little gifts",
    "description": "A round black-and-white crochet penguin with charcoal feet and a bright orange stitched beak. A cheerful character for a desk or shelf.",
    "image": "/assets/penguin-styled.webp",
    "details": "Decorative keepsake. Size and materials are confirmed by the studio. Not represented as a certified infant toy.",
    "reference": "/assets/penguin-original.webp"
  },
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "chai-table",
    "name": "Crochet dining set",
    "category": "For the home",
    "description": "A coordinated crochet runner, mats and coasters. Textured shell stitches turn everyday tea into a little occasion.",
    "image": "/assets/dining-set-styled.webp",
    "details": "Choose the pieces and quantities you need. Quote depends on size, yarn and set contents. Crockery, furniture and glassware are styling props.",
    "reference": "/assets/dining-set-original.webp",
    "gallery": [
      {
        "image": "/assets/dining-detail-original.webp",
        "label": "Original · stitch detail"
      },
      {
        "image": "/assets/dining-coaster-original.webp",
        "label": "Original · coaster detail"
      }
    ]
  },
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "owl-wall",
    "name": "Owl wall hanging",
    "category": "For the home",
    "description": "Cream crochet, golden eyes and textured feather details, finished with a branch perch and tassels. An owl wall hanging with its own quiet character.",
    "image": "/assets/owl-styled.webp",
    "reference": "/assets/owl-original.webp",
    "details": "Confirm finished dimensions, hanging method and included support with the studio."
  },
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": false,
    "styled": false,
    "id": "berry-keyring",
    "name": "Berry keyring",
    "category": "Little gifts",
    "description": "A flat purple strawberry motif with green leaves and a blue loop, attached to a metal keyring. A little colour for your keys or bag.",
    "image": "/assets/strawberry-original.webp",
    "details": "Shown in the studio’s original purple and green palette. Confirm size, materials and available colours."
  },
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "whale-keyring",
    "name": "Whale keyring",
    "category": "Little gifts",
    "description": "A tiny crochet whale keyring in blue and red, with a pale underside and a dark hanging loop. A playful companion for everyday keys.",
    "image": "/assets/whale-styled.webp",
    "reference": "/assets/whale-original.webp",
    "details": "Confirm size, yarn and hardware with the studio. Keyring is an accessory, not an infant toy.",
    "gallery": [
      {
        "image": "/assets/whale-side.webp",
        "label": "Original · another view"
      }
    ]
  },
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "forever-bouquet",
    "name": "Tulip bouquet",
    "category": "Little gifts",
    "description": "Peach and lavender crochet tulips, little white flowers and green leaves, wrapped in golden paper and tied with a cream lace bow.",
    "image": "/assets/bouquet-styled.webp",
    "details": "Flower count, palette, wrapping and finished dimensions are agreed with your quote.",
    "reference": "/assets/bouquet-original.webp"
  },
  {
    "id": "spring-tissue",
    "name": "Floral tissue cover",
    "category": "For the home",
    "description": "A crochet tissue-box cover with an open textured stitch and five bright flowers. A little handmade garden for a bedside table or a favourite corner.",
    "image": "/assets/green-cover-styled.webp",
    "reference": "/assets/green-cover-original.webp",
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "details": "Share your tissue-box dimensions so we can confirm fit. Flower colours and yarn are agreed with your quote.",
    "published": true,
    "styled": true
  },
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "phone-crossbody",
    "name": "Granny-stitch phone bag",
    "category": "Bags & accessories",
    "description": "A compact crochet phone bag with diagonal textured stitches, a button flap and a matching crochet strap. A little colour for your everyday essentials.",
    "image": "/assets/phone-crossbody-styled.webp",
    "details": "Share your phone model or dimensions including its case. Finished size, strap length, lining, yarn and colour options are agreed before making. Current availability and price are confirmed by quote."
},
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "bow-keyring",
    "name": "Blush bow keyring",
    "category": "Little gifts",
    "description": "A soft pink crochet bow with long, gently folded tails and silver-coloured keyring hardware. Flecks of colour in the yarn make each little bow its own.",
    "image": "/assets/bow-keyring-styled.webp",
    "details": "Confirm finished bow size, yarn and hardware with the maker. Ask about your preferred colours. An accessory for keys or a bag; not a toy for young children."
},
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "two-flower-tissue",
    "name": "Two-flower tissue cover",
    "category": "For the home",
    "description": "Airy open-stitch crochet, finished with two contrasting flowers and mustard-yellow centres. A softer little detail for a desk or bedside table.",
    "image": "/assets/two-flower-tissue-v2.webp",
    "details": "Share your tissue-box length, width and height in centimetres. Fit, flower colours, yarn and making time are confirmed with your quote. Tissues and box contents are not assumed to be included."
},
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "mocha-bow-tote",
    "name": "Bow shoulder tote",
    "category": "Bags & accessories",
    "description": "An airy crochet tote with integrated shoulder straps and an oversized cream bow. A statement piece for everyday outings, with the stitchwork left beautifully visible.",
    "image": "/assets/mocha-bow-tote-product-v2.webp",
    "details": "Finished dimensions, strap drop, lining, fastening and carrying capacity are confirmed with the maker. The open-stitch design is not claimed to secure loose valuables or protect a laptop."
},
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "earth-tone-shoulder",
    "name": "Colour-block shoulder bag",
    "category": "Bags & accessories",
    "description": "Chunky crochet in layered colour bands, with an open textured shoulder strap. A colour-rich bag with an easy everyday feel.",
    "image": "/assets/earth-tone-shoulder-styled.webp",
    "details": "Confirm usable dimensions, lining, fastening, strap drop and carrying capacity before acceptance. Colour placement can vary with yarn and agreed customisation."
},
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "cactus-crossbody",
    "name": "Cactus crossbody",
    "category": "Bags & accessories",
    "description": "A cactus-shaped crochet bag with raised bobble texture, a long crochet strap and little golden hanging details. A playful statement with a practical purpose.",
    "image": "/assets/cactus-crossbody-styled.webp",
    "details": "Confirm usable capacity, opening, lining and strap length. The shaped silhouette does not imply a standard phone fit. Custom colours and final construction are agreed with your quote."
},
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "marigold-gajra",
    "name": "Marigold gajra",
    "category": "Occasion pieces",
    "description": "A ruffled crochet marigold with a soft white floral band. A keepsake wrist piece for Mayun, Mehndi or a celebration that calls for something handmade.",
    "image": "/assets/marigold-gajra-styled.webp",
    "details": "Choose a single piece, a pair or a group quantity. Share wrist circumference and your event date. Fit, fastening, exact materials, palette and making capacity are confirmed before acceptance. Quantity means individual gajray, not pairs."
},
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "rose-gajra",
    "name": "Rose & jasmine gajra",
    "category": "Occasion pieces",
    "description": "Crochet roses among soft white puffed blossoms. A floral wrist accessory to coordinate with your outfit, request as a pair, or share across a celebration.",
    "image": "/assets/rose-gajra-styled.webp",
    "details": "The photo shows a pair for styling; the order quantity counts individual gajray. Select 2 for a pair. Wrist fit, fastening, materials, colours and event timing are confirmed by quote."
},
  {
    "price": null,
    "availability": "Enquire",
    "leadTime": "Confirmed with your quote",
    "published": true,
    "styled": true,
    "id": "personalised-bunting",
    "name": "Personalised crochet bunting",
    "category": "Occasion pieces",
    "description": "Personalised crochet flags for birthdays and celebrations. See the full birthday layout example, then choose your own wording, colours and banner length.",
    "image": "/assets/bunting-full-layout.webp",
    "gallery": [{"image":"/assets/bunting-styled.webp","label":"Stitch detail"}],
    "details": "The full-banner image is a layout example based on the photographed flag design; the close-up shows stitch detail. Quote depends on wording, flag count, flag size, hanging length and colours. These are agreed before making. Keep cords and hanging decor away from young children."
}
];
export const settingsSchema = z.object({ whatsapp: z.string().regex(/^$|^[1-9][0-9]{7,14}$/), accepting: z.boolean(), notice: z.string().max(250), shipping: z.string().min(10).max(1500), returns: z.string().min(10).max(1500) });
export type Settings = z.infer<typeof settingsSchema>;
export const defaultSettings: Settings = { whatsapp: "", accepting: true, notice: "Website preview · Ask us for prices", shipping: "Based in Islamabad. Pakistan delivery is quoted before acceptance. International delivery can be discussed; serviceability and charges are confirmed for your destination. Making time and courier transit are separate.", returns: "Before an order is accepted, we confirm its scope, price, delivery and applicable cancellation or return terms. Please contact us if an item arrives damaged or differs from the agreed order." };
export const statuses = ["new", "quoted", "accepted", "making", "shipped", "completed", "declined", "cancelled"] as const;
export const enquirySchema = z.object({ token: z.string().uuid(), name: z.string().trim().min(2).max(80), contact: z.string().trim().min(5).max(150), city: z.string().trim().min(2).max(100), country: z.string().trim().min(2).max(80), idea: z.string().trim().min(10).max(2000), colours: z.string().max(150), budget: z.string().max(80), deadline: z.string().max(20), items: z.array(z.object({ id: z.string().max(60), quantity: z.number().int().min(1).max(50) })).max(12), kind:z.enum(["product","custom"]).optional(),contactMethod:z.enum(["whatsapp","email"]).optional(),consent: z.literal(true), website: z.string().max(0) }).superRefine((value,ctx)=>{
  if(value.kind==="product"&&!value.items.length)ctx.addIssue({code:z.ZodIssueCode.custom,path:["items"],message:"Choose a product"});
  if(value.contactMethod==="email"&&!z.string().email().safeParse(value.contact).success)ctx.addIssue({code:z.ZodIssueCode.custom,path:["contact"],message:"Enter a valid email"});
  if(value.contactMethod==="whatsapp"&&(!/^\+?[\d\s()\-]{7,30}$/.test(value.contact)||value.contact.replace(/\D/g,"").length<7||value.contact.replace(/\D/g,"").length>15))ctx.addIssue({code:z.ZodIssueCode.custom,path:["contact"],message:"Enter a valid phone number"});
});
