import type {Product} from './catalog';
/** Starting prices are not checkout totals. */
export function priceLabel(p:Pick<Product,'id'|'price'>){return p.price===null?'Price by quote':'From PKR '+p.price.toLocaleString('en-PK')+(p.id.includes('gajra')?' / gajra':'');}
