import type { Product } from "./catalog";
export type Colourway = {
    name: string;
    image: string;
    swatches: string[];
    approximate: boolean;
};
type PreviewConfig = {
    baseImage: string;
    colourways: Colourway[];
};
const previews: Record<string, PreviewConfig> = {
    "chai-table": {
        baseImage: "/assets/dining-set-styled.webp",
        colourways: [
            { name: "Olive & mustard", image: "/assets/dining-set-styled.webp", swatches: ["#7b873c", "#b88527", "#f3e2b3"], approximate: false },
            { name: "Rose & sage", image: "/assets/table-rose-preview.webp", swatches: ["#b76b7e", "#8d9d80", "#f3e2b3"], approximate: true },
            { name: "Teal & seafoam", image: "/assets/table-coastal-preview.webp", swatches: ["#397e83", "#a6cdca", "#f3e2b3"], approximate: true }
        ]
    },
    "spring-tissue": {
        baseImage: "/assets/green-cover-styled.webp",
        colourways: [
            { name: "Sage", image: "/assets/green-cover-styled.webp", swatches: ["#9eb89b"], approximate: false },
            { name: "Lilac", image: "/assets/cover-lilac-preview.webp", swatches: ["#b3a0c4"], approximate: true },
            { name: "Oat", image: "/assets/cover-oat-preview.webp", swatches: ["#d9cba7"], approximate: true }
        ]
    },
    "mocha-bow-tote": {
    "baseImage": "/assets/mocha-bow-tote-product-v2.webp",
    "colourways": [
        {
            "name": "Mocha & cream",
            "image": "/assets/mocha-bow-tote-product-v2.webp",
            "swatches": [
                "#97704e",
                "#f3ead9"
            ],
            "approximate": false
        },
        {
            "name": "Sage & cream",
            "image": "/assets/tote-sage-product-v2.webp",
            "swatches": [
                "#87967c",
                "#f3ead9"
            ],
            "approximate": true
        }
    ]
},
    "earth-tone-shoulder": {
    "baseImage": "/assets/earth-tone-shoulder-styled.webp",
    "colourways": [
        {
            "name": "Earthy mix",
            "image": "/assets/earth-tone-shoulder-styled.webp",
            "swatches": [
                "#a58170",
                "#aa3f35",
                "#384b60"
            ],
            "approximate": false
        },
        {
            "name": "Sage & lilac",
            "image": "/assets/earth-pastel-preview.webp",
            "swatches": [
                "#87967c",
                "#b599c1",
                "#ead8c3"
            ],
            "approximate": true
        }
    ]
},
    "cactus-crossbody": {
    "baseImage": "/assets/cactus-crossbody-styled.webp",
    "colourways": [
        {
            "name": "Leaf green",
            "image": "/assets/cactus-crossbody-styled.webp",
            "swatches": [
                "#688c38",
                "#e4b449"
            ],
            "approximate": false
        },
        {
            "name": "Soft teal",
            "image": "/assets/cactus-teal-preview.webp",
            "swatches": [
                "#5c9791",
                "#e4b449"
            ],
            "approximate": true
        }
    ]
},
    "marigold-gajra": {
    "baseImage": "/assets/marigold-gajra-styled.webp",
    "colourways": [
        {
            "name": "Marigold & white",
            "image": "/assets/marigold-gajra-styled.webp",
            "swatches": [
                "#e7a137",
                "#faf4e9"
            ],
            "approximate": false
        },
        {
            "name": "Blush & white",
            "image": "/assets/marigold-blush-preview.webp",
            "swatches": [
                "#ce8f9e",
                "#faf4e9"
            ],
            "approximate": true
        }
    ]
},
    "rose-gajra": {
    "baseImage": "/assets/rose-gajra-styled.webp",
    "colourways": [
        {
            "name": "Red & ivory",
            "image": "/assets/rose-gajra-styled.webp",
            "swatches": [
                "#9b2737",
                "#f3ead9"
            ],
            "approximate": false
        },
        {
            "name": "Lilac & ivory",
            "image": "/assets/rose-lilac-preview.webp",
            "swatches": [
                "#ab91c0",
                "#f3ead9"
            ],
            "approximate": true
        }
    ]
},
    "phone-crossbody": {
    "baseImage": "/assets/phone-crossbody-styled.webp",
    "colourways": [
        {
            "name": "Purple & lilac",
            "image": "/assets/phone-crossbody-styled.webp",
            "swatches": [
                "#573879",
                "#b4a0c8",
                "#f5f0e5"
            ],
            "approximate": false
        },
        {
            "name": "Sage & blush",
            "image": "/assets/phone-sage-preview.webp",
            "swatches": [
                "#8a9b79",
                "#d2a2b2",
                "#f3ead9"
            ],
            "approximate": true
        }
    ]
},
    "two-flower-tissue": {
    "baseImage": "/assets/two-flower-tissue-v2.webp",
    "colourways": [
        {
            "name": "Grey & teal",
            "image": "/assets/two-flower-tissue-v2.webp",
            "swatches": [
                "#bfc6c5",
                "#258895",
                "#283654"
            ],
            "approximate": false
        },
        {
            "name": "Oat & rose",
            "image": "/assets/two-flower-oat-preview.webp",
            "swatches": [
                "#d5c5a7",
                "#c98fa2",
                "#8b9b7a"
            ],
            "approximate": true
        }
    ]
}
};
export function productColourways(product: Product): Colourway[] {
    const config = previews[product.id];
    // Replacement photos must be reviewed before an old preview can represent them.
    return config?.baseImage === product.image ? config.colourways : [];
}
