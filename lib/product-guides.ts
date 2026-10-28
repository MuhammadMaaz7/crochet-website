import type {Product} from './catalog';
export function fitQuestion(product:Product){
  if(product.id==='phone-crossbody')return {label:'Your phone model or dimensions',placeholder:'Phone model, or height × width × depth in cm',help:'Include your case. We’ll confirm the finished fit.'};
  if(product.id.includes('tissue'))return {label:'Your tissue-box dimensions',placeholder:'Length × width × height in cm',help:'Have a box in mind? Share its size for the right fit.'};
  if(product.category==='Bags & accessories')return {label:'What would you like it to hold?',placeholder:'A phone, cards, glasses…',help:'We’ll agree the size, strap and finish before making.'};
  return null;
}
export function pieceBrief(product:Product,values:{colours:string;fit:string;note:string}){
  return [`Please quote ${product.name}.`,`Colours: ${values.colours.trim()||'As pictured'}.`,values.fit.trim()?`Fit / size: ${values.fit.trim()}.`:'',values.note.trim()?`For the maker: ${values.note.trim()}`:'','Please confirm final details, price and making time.'].filter(Boolean).join(' ').slice(0,500);
}
export function relatedPieces(product:Product,products:Product[]){
  const pairings:Record<string,string[]>={
    'phone-crossbody':['bow-keyring','tulip-cream','golden-fan-bag'],
    'bow-keyring':['phone-crossbody','tulip-bookmark','forever-bouquet'],
    'two-flower-tissue':['spring-tissue','chai-table','tissue-garden'],
    'spring-tissue':['two-flower-tissue','chai-table','tissue-garden'],
    'chai-table':['spring-tissue','two-flower-tissue','owl-wall'],
    'forever-bouquet':['bow-keyring','tulip-bookmark','tulip-cream']
  };
  const available=products.filter(p=>p.id!==product.id&&p.availability!=='Unavailable');
  const preferred=(pairings[product.id]||[]).map(id=>available.find(p=>p.id===id)).filter((p):p is Product=>!!p);
  return [...preferred,...available.filter(p=>!preferred.some(x=>x.id===p.id)&&p.category===product.category)].slice(0,3);
}
