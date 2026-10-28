"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import type {Product,Settings} from "../lib/catalog";
import {StudioHero,GiftFinder,ProductCustomizer,ProductGallery,Flower} from "./studio-experiences";
import {productColourways} from "../lib/customisation";
import OrderStudio from "./order-studio";
const money=(n:number|null)=>n===null?"Price on request":"PKR "+n.toLocaleString("en-PK");
function persistPicks(ids:string[]){try{localStorage.setItem("pcs-picks",JSON.stringify(ids));}catch{}}
function Mark() { return <svg viewBox="0 0 52 52" aria-hidden="true"><path d="M26 6c6-9 13 0 9 7 9-4 16 5 8 11 10 5 3 15-5 12 2 10-10 14-13 5-6 8-16 1-12-7-10 1-13-11-3-14-7-7 2-16 9-11 0-7 5-9 7-3Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="26" cy="25" r="6" fill="currentColor"/></svg>; }

export default function Shop({products,settings,initialProduct,initialCustom=false}:{products:Product[];settings:Settings;initialProduct?:string;initialCustom?:boolean}) {
  const [filter,setFilter]=useState("All pieces"),[search,setSearch]=useState(""),[picks,setPicks]=useState<string[]>([]);
  const [drawer,setDrawer]=useState(false),[custom,setCustom]=useState(initialCustom),[menu,setMenu]=useState(false),[colourIndex,setColourIndex]=useState(0);
  const [quantities,setQuantities]=useState<Record<string,number>>({});
  const [itemNotes,setItemNotes]=useState<Record<string,{idea:string;colours:string}>>({});
  const menuRef=useRef<HTMLButtonElement>(null);
  const product=products.find(p=>p.id===initialProduct);
  const colourways=product?productColourways(product):[];
  const closeOrder=useCallback(()=>{setDrawer(false);setCustom(false)},[]);
  useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("pcs-picks")||"[]");if(Array.isArray(saved))setPicks(saved.filter((id:unknown):id is string=>typeof id==="string"&&products.some(p=>p.id===id)).slice(0,12));}catch{}},[products]);
  useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("pcs-designs")||"{}");const valid:Record<string,{idea:string;colours:string}>={};for(const p of products){const note=saved[p.id];if(productColourways(p).length&&typeof note?.idea==="string"&&note.idea.length<=500&&typeof note?.colours==="string"&&note.colours.length<=80)valid[p.id]=note;}setItemNotes(valid);}catch{}},[products]);
  useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("pcs-quantities")||"{}");const valid:Record<string,number>={};for(const p of products){const q=saved[p.id];if(Number.isInteger(q)&&q>=1&&q<=50)valid[p.id]=q;}setQuantities(valid);}catch{}},[products]);
  const saveQuantities=(value:Record<string,number>)=>{try{localStorage.setItem("pcs-quantities",JSON.stringify(value))}catch{}};
  const updateQuantity=(id:string,quantity:number)=>{if(!Number.isInteger(quantity)||quantity<1||quantity>50)return;setQuantities(prev=>{const next={...prev,[id]:quantity};saveQuantities(next);return next;});};
  const saveDesigns=(notes:Record<string,{idea:string;colours:string}>)=>{try{localStorage.setItem("pcs-designs",JSON.stringify(notes))}catch{}};
  const addPiece=(id:string)=>{if(!products.some(p=>p.id===id&&p.availability!=="Unavailable"))return;setPicks(prev=>{const next=prev.includes(id)?prev:prev.length<12?[...prev,id]:prev;persistPicks(next);return next;});};
  const removePiece=(id:string)=>{setQuantities(prev=>{const next={...prev};delete next[id];saveQuantities(next);return next;});setPicks(prev=>{const next=prev.filter(x=>x!==id);persistPicks(next);return next;});setItemNotes(prev=>{const next={...prev};delete next[id];saveDesigns(next);return next;});};
  const choose=(id:string)=>{addPiece(id);setCustom(false);setDrawer(true);};
  const plan=(text:string,palette:string,id?:string)=>{if(id){if(!products.some(p=>p.id===id&&p.availability!=="Unavailable"))return;setItemNotes(prev=>{const next={...prev,[id]:{idea:text,colours:palette}};saveDesigns(next);return next;});addPiece(id);setCustom(false);setDrawer(true);}else{setDrawer(false);setCustom(true);}};
  const shelfOrder=["spring-tissue","chai-table","golden-fan-bag","forever-bouquet","tulip-cream","tulip-bookmark","owl-wall","tissue-garden","tulip-pink","whale-keyring","tooth-keepsake","berry-keyring"];
  const catalogue=[...products].sort((a,b)=>{const ai=shelfOrder.indexOf(a.id),bi=shelfOrder.indexOf(b.id);return (ai<0?999:ai)-(bi<0?999:bi);});
  const visible=catalogue.filter(p=>(filter==="All pieces"||p.category===filter)&&(p.name+" "+p.description).toLowerCase().includes(search.toLowerCase()));
    return <><a className="skip" href="#main">Skip to content</a><div className="notice">{settings.notice || "Handmade in Islamabad · Custom colours welcome"}</div>
    <header className="header" onKeyDown={e => { if (e.key === "Escape") {
        setMenu(false);
        menuRef.current?.focus();
    } }}>
      <a href="/" className="wordmark" onClick={() => setMenu(false)}><Mark /><span>PhotoCraftSquare<small>HANDMADE CROCHET</small></span></a>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="/#collection">Shop</a><button onClick={() => plan("", "")}>Custom orders</button><a href="/#maker">Our story</a><a href="/#help">How to order</a></nav>
      <div className="header-actions"><button className="order-launch" onClick={()=>{setMenu(false);setDrawer(true);setCustom(false)}}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14l1 14H4L5 7Z" stroke="currentColor" strokeWidth="1.5"/><path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.5"/></svg><span className="order-mobile-label">Order</span><span className="order-desktop-label">Your order</span>{picks.length>0&&<b>{picks.length}</b>}</button><button ref={menuRef} className="menu-button" aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu(!menu)}>{menu ? <span aria-hidden="true">×</span> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>}</button></div>
      {menu && <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation"><a href="/#collection" onClick={() => setMenu(false)}>Shop all products <span>↗</span></a><a href="/#gift-finder" onClick={() => setMenu(false)}>Find a gift <span>↗</span></a><button onClick={() => { setMenu(false); plan("", ""); }}>Request something custom <span>↗</span></button><a href="/#maker" onClick={() => setMenu(false)}>Our story</a><a href="/#help" onClick={() => setMenu(false)}>How to order</a></nav>}
    </header>
    <main id="main">
    {product ? <section className="product-detail wrap">
      <div className="breadcrumb"><a href="/#collection">← All products</a></div>
      <div className="product-mobile-title"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p>{money(product.price)}</p></div>
      <div className="detail-grid">
        <ProductGallery product={product} colourway={colourIndex > 0 ? colourways[colourIndex] : undefined} onClearColourway={() => setColourIndex(0)} colourways={colourways} selectedColour={colourIndex} onSelectColour={setColourIndex}/>
        <div className="detail-copy"><div className="desktop-product-title"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="price">{money(product.price)}</p></div><p className="lead">{product.description}</p>
          {colourways.length > 0 ? <ProductCustomizer product={product} colourways={colourways} selected={colourIndex} onSelect={setColourIndex} onRequest={plan} accepting={settings.accepting && product.availability !== "Unavailable"}/> : <><button className="button inline-product-request" disabled={product.availability === "Unavailable" || !settings.accepting} onClick={() => choose(product.id)}>Order this piece <span aria-hidden="true">↗</span></button><p className="preview-note">Ask us about your preferred colours.</p></>}
          <details className="product-information"><summary>Product details</summary><p>{product.details}</p><p>{product.availability === "Enquire" ? "Availability is confirmed with your quote." : product.availability} · {product.leadTime}</p></details>
          <details className="product-information"><summary>Delivery & making time</summary><p>{settings.shipping}</p></details>
          <p className="detail-note">Choose your piece. We confirm the price and details before you pay.</p>
        </div>
      </div>
    </section> : <>
      <StudioHero products={products}/>
      <section className="collection wrap" id="collection">
        <div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p><h2>Find your <em>little lovely.</em></h2></div></div>
        <div className="collection-controls"><div className="tabs" role="group" aria-label="Filter collection">{[{ value: "All pieces", label: "All" }, { value: "For the home", label: "Home" }, { value: "Little gifts", label: "Gifts" }, { value: "Bags & accessories", label: "Bags" }].map(x => <button key={x.value} aria-pressed={filter === x.value} className={filter === x.value ? "active" : ""} onClick={() => setFilter(x.value)}>{x.label}</button>)}</div><label className="search-box"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="m15 15 5 5" stroke="currentColor" strokeWidth="1.5"/></svg><input type="search" aria-label="Search products" placeholder="Search products" value={search} onChange={e => setSearch(e.target.value)}/></label></div>
        <p className="collection-count" aria-live="polite">{visible.length} {visible.length === 1 ? "product" : "products"}</p>
        <div className="products">{visible.map(p => <article className="product-card" key={p.id}><a href={"/shop/" + p.id} className="product-link"><div className="product-image"><img src={p.image} alt={p.name} loading="lazy" width="650" height="650"/></div><div className="product-meta"><h3>{p.name}</h3><p>{money(p.price)}</p><span className="view-product">View product <i aria-hidden="true">↗</i></span></div></a></article>)}</div>
        {!visible.length && <p className="empty">No matching products. <button onClick={() => { setFilter("All pieces"); setSearch(""); }}>Clear search</button></p>}
      </section>
      <section className="custom-invite wrap"><Flower /><div><h2>A colour you love.<br /><em>A gift that’s them.</em></h2><p>Have something in mind? Let’s make it personal.</p><button className="button" onClick={() => plan("", "")}>Request a custom piece <span aria-hidden="true">↗</span></button></div></section>
      <GiftFinder products={products}/>
      <section className="maker wrap" id="maker"><div><p className="eyebrow">MEET THE MAKER</p><h2>Made by hand.<br /><em>From Islamabad.</em></h2></div><div><p>PhotoCraftSquare makes crochet gifts, bags and pieces for your home—one stitch at a time.</p><p>Choose a design you love, or tell us about something personal.</p><a className="text-button" href="https://www.instagram.com/photocraftsquare/" target="_blank" rel="noopener noreferrer">Visit our Instagram ↗</a></div></section>
    </>}
    <section className="help wrap" id="help"><div><h2>Good to know.</h2></div><div>{[["How do I order?", "Choose a product and tap Order this piece, or start a custom order. We agree the price, delivery and making time before your order is confirmed."], ["Can I choose my colours?", "Ask about the colours you have in mind. Yarn availability and the final design are confirmed with your quote."], ["Where do you deliver?", settings.shipping], ["What about changes or returns?", settings.returns], ["How is my request information used?", "Your name, contact and request details are stored so PhotoCraftSquare can respond and manage your order request. We do not collect card details here. Please avoid including sensitive information. Contact the studio through Instagram for access or deletion requests."]].map(([q, a]) => <details key={q}><summary>{q}<span>＋</span></summary><p>{a}</p></details>)}</div></section>
    </main><footer><div className="footer-main"><a href="/" className="wordmark"><Mark /><span>PhotoCraftSquare<small>Handmade crochet · Islamabad</small></span></a><div><a href="/#collection">The collection</a><button onClick={() => plan("", "")}>Custom order</button><a href="/#help">Ordering & privacy</a></div><div><a href="https://www.instagram.com/photocraftsquare/" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} PhotoCraftSquare</span><span>Islamabad, Pakistan · One stitch at a time.</span></div></footer>
    {product && <div className="product-sticky"><span>{money(product.price)}</span>{colourways.length > 0 ? <button className="button" type="submit" form="product-customizer" disabled={!settings.accepting || product.availability === "Unavailable"}>Order this piece ↗</button> : <button className="button" onClick={() => choose(product.id)} disabled={!settings.accepting || product.availability === "Unavailable"}>Order this piece ↗</button>}</div>}
    {(drawer||custom)&&<OrderStudio mode={custom?"custom":"product"} products={catalogue} selectedIds={picks} notes={itemNotes} settings={settings} quantities={quantities} onQuantityChange={updateQuantity} onAdd={addPiece} onRemove={removePiece} onClose={closeOrder}/>}
    </>;
}
