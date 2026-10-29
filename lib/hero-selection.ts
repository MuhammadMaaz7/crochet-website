import type {Product} from './catalog';
/** Editorial selection for clarity and range; this is not a sales ranking. */
export function heroSelection(products:Product[]){
  const available=products.filter(p=>p.published&&p.availability!=='Unavailable');
  const main=['mocha-bow-tote','earth-tone-shoulder','chai-table','spring-tissue'].map(id=>available.find(p=>p.id===id)).find(Boolean)||available[0];
  const secondary=['rose-gajra','spring-tissue','marigold-gajra'].map(id=>available.find(p=>p.id===id&&p.id!==main?.id)).find(Boolean);
  const mainImage=main?.image;
  return {main,secondary,mainImage};
}
