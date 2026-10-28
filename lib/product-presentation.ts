import type {Product} from './catalog';
export const BUNTING_LAYOUT_IMAGE='/assets/bunting-full-layout.webp';
/** A full-banner example is distinct from a photographed finished commission. */
export function presentationLabel(product:Pick<Product,'id'|'image'>){
  return product.id==='personalised-bunting'&&product.image===BUNTING_LAYOUT_IMAGE?'Example layout':null;
}
