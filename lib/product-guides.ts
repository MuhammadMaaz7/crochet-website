import type {Product} from './catalog';
type FitQuestion={label:string;placeholder:string;help:string;required?:boolean};
export function fitQuestion(product:Product):FitQuestion|null{
  if(product.id.includes("gajra"))return {label:"Wrist circumference",placeholder:"Measure around the wrist in cm",help:"We’ll confirm fit and fastening before making."};
  if(product.id==="personalised-bunting")return {label:"Your banner wording",placeholder:"A name, HAPPY BIRTHDAY, or your own message",help:"Flag count and finished length are confirmed with your quote.",required:true};
  if(product.id==='phone-crossbody')return {label:'Your phone model or dimensions',placeholder:'Phone model, or height × width × depth in cm',help:'Include your case. We’ll confirm the finished fit.'};
  if(product.id.includes('tissue'))return {label:'Your tissue-box dimensions',placeholder:'Length × width × height in cm',help:'Have a box in mind? Share its size for the right fit.'};
  if(product.category==='Bags & accessories')return {label:'What would you like it to hold?',placeholder:'A phone, cards, glasses…',help:'We’ll agree the size, strap and finish before making.'};
  return null;
}
export function pieceBrief(product:Product,values:{colours:string;fit:string;note:string}){
  return [`Please quote ${product.name}.`,`Colours: ${values.colours.trim()||'As pictured'}.`,values.fit.trim()?`${fitQuestion(product)?.label||"Size / details"}: ${values.fit.trim()}.`:'',values.note.trim()?`For the maker: ${values.note.trim()}`:'','Please confirm final details, price and making time.'].filter(Boolean).join(' ').slice(0,500);
}
export function relatedPieces(product:Product,products:Product[]){
  const pairings:Record<string,string[]>={
    'marigold-gajra':['rose-gajra','personalised-bunting','forever-bouquet'],
    'rose-gajra':['marigold-gajra','personalised-bunting','forever-bouquet'],
    'personalised-bunting':['marigold-gajra','rose-gajra','forever-bouquet'],
    'mocha-bow-tote':['earth-tone-shoulder','cactus-crossbody','golden-fan-bag'],
    'earth-tone-shoulder':['mocha-bow-tote','cactus-crossbody','phone-crossbody'],
    'cactus-crossbody':['mocha-bow-tote','earth-tone-shoulder','golden-fan-bag'],
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
