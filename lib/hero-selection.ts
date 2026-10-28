import type {Product} from './catalog';
/** Editorial selection for clarity and range; this is not a sales ranking. */
export function heroSelection(products:Product[]){
  const available=products.filter(p=>p.published&&p.availability!=='Unavailable');
  const main=['golden-fan-bag','mocha-bow-tote','chai-table','spring-tissue'].map(id=>available.find(p=>p.id===id)).find(Boolean)||available[0];
  const secondary=['forever-bouquet','rose-gajra','spring-tissue'].map(id=>available.find(p=>p.id===id&&p.id!==main?.id)).find(Boolean);
  // A replacement owner photo must never inherit the old hero treatment.
  const mainImage=main?.id==='golden-fan-bag'&&main.image==='/assets/fan-bag-styled.webp'?'/assets/fan-bag-hero-v2.webp':main?.image;
  return {main,secondary,mainImage};
}
