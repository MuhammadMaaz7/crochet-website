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
    }
};
export function productColourways(product: Product): Colourway[] {
    const config = previews[product.id];
    // Replacement photos must be reviewed before an old preview can represent them.
    return config?.baseImage === product.image ? config.colourways : [];
}
