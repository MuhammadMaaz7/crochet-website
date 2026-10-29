import type {Product} from './catalog';
/** Use the live catalogue image so owner changes reach the custom flow too. */
export function customStartingPoints(products:Product[]){
  const choices=[
    {name:'A thoughtful gift',hint:'Gajray & celebrations',ids:['rose-gajra','marigold-gajra','bow-keyring']},
    {name:'Something for home',hint:'Useful, with a little joy',ids:['spring-tissue','two-flower-tissue','chai-table']},
    {name:'A bag or pouch',hint:'For everyday favourites',ids:['mocha-bow-tote','earth-tone-shoulder','tulip-cream']},
    {name:'My own idea',hint:'Your words, your colours',ids:['personalised-bunting','owl-wall','tulip-bookmark']}
  ];
  const available=products.filter(p=>p.published&&p.availability!=='Unavailable');
  return choices.map(({ids,...choice})=>({...choice,image:ids.map(id=>available.find(p=>p.id===id)).find(Boolean)?.image||available[0]?.image||'/assets/bookmark-styled.webp'}));
}
