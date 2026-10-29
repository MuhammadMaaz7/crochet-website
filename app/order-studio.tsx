"use client";
import ProductPhoto from "./product-photo";
import {useEffect,useRef,useState} from "react";
import type {Product,Settings} from "../lib/catalog";
import {Flower} from "./studio-experiences";
import {BUNTING_LAYOUT_IMAGE} from "../lib/product-presentation";
import {customStartingPoints} from "../lib/custom-starting-points";
import {productColourways} from "../lib/customisation";

type DesignNotes=Record<string,{idea:string;colours:string}>;
type Mode="product"|"custom";
type Fields={idea:string;colours:string;budget:string;deadline:string;name:string;contact:string;city:string;country:string;consent:boolean;website:string};
const archiveIdeas:Record<string,string[]>={"A thoughtful gift":["Celebration gajray","Personalised bunting","Tulip bouquet"],"Something for home":["Tissue cover","Dining set","Wall hanging"],"A bag or pouch":["Bow shoulder tote","Colour-block shoulder bag","Cactus crossbody"],"My own idea":["Crochet gajray","Personalised wall hanging"]};
const palettes=[{name:"Soft pastels",swatches:["#d8b3cc","#b6c9b6","#f1dcc1"]},{name:"Earthy tones",swatches:["#ac784f","#718265","#dfcfa9"]},{name:"Bright & happy",swatches:["#c9506a","#e7b644","#4c9697"]}];
function newToken(){const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=Array.from(b).map(x=>x.toString(16).padStart(2,"0")).join("");return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;}

export default function OrderStudio({mode,products,selectedIds,notes,settings,quantities,selectionWarning="",onQuantityChange,onAdd,onRemove,onClose}:{
  mode:Mode;products:Product[];selectedIds:string[];notes:DesignNotes;settings:Settings;
  quantities:Record<string,number>;selectionWarning?:string;onQuantityChange:(id:string,quantity:number)=>void;
  onAdd:(id:string)=>void;onRemove:(id:string)=>void;onClose:()=>void;
}) {
  const [step,setStep]=useState(0),[kind,setKind]=useState(""),[occasion,setOccasion]=useState("Just because"),[showPieces,setShowPieces]=useState(false);
  const [replyBy,setReplyBy]=useState<"whatsapp"|"email">("whatsapp");
  const [fields,setFields]=useState<Fields>({idea:"",colours:"",budget:"",deadline:"",name:"",contact:"",city:"",country:"Pakistan",consent:false,website:""});
  const [busy,setBusy]=useState(false),[error,setError]=useState(""),[sent,setSent]=useState(""),[copied,setCopied]=useState(false);
  const busyRef=useRef(false);
  const dialog=useRef<HTMLElement>(null),heading=useRef<HTMLHeadingElement>(null),requestToken=useRef(""),requestSummary=useRef("");
  const kinds=customStartingPoints(products);
  const custom=mode==="custom";
  const selected=selectedIds.map(id=>products.find(p=>p.id===id)).filter((p):p is Product=>!!p);
  const available=products.filter(p=>p.published&&p.availability!=="Unavailable");
  const occasionOrder=!custom&&selected.some(p=>p.category==="Occasion pieces");
  const inspiration=kinds.find(k=>k.name===kind)||kinds[0];
  const photoFor=(p:Product)=>productColourways(p).find(c=>c.name===notes[p.id]?.colours)?.image||p.image;
  const mainPhoto=custom?inspiration.image:selected[0]?photoFor(selected[0]):"/assets/green-cover-styled.webp";
  const count=selected.reduce((n,p)=>n+(quantities[p.id]||1),0);
  const steps=custom?["Your idea","Make it yours","Send request"]:["Your pieces","The details","Send request"];
  const titles=custom?["What shall we make?","A little more you.","Where can we reach you?"]:[selected.length?"Your little order.":"Pick your lovely thing.","The finishing touches.","Where can we reach you?"];
  const descriptions=custom?["Start with the kind of piece you have in mind.","Tell us what would make this piece personal.","We’ll agree the price and details before making starts."]:["Choose your pieces. We’ll confirm the price with you.","Anything you’d like the maker to know?","Leave your details so we can confirm your order request."];
  const unit=(p:Product,q:number)=>p.id==="chai-table"?(q===1?"set":"sets"):p.id.includes("gajra")?(q===1?"gajra":"gajray"):p.id==="personalised-bunting"?(q===1?"banner":"banners"):(q===1?"piece":"pieces");
  const ideaPlaceholder=kind==="Something for home"?"A table runner in greens and cream, sized for my dining table…":kind==="A bag or pouch"?"A small button pouch, in pink and cream, for everyday essentials…":kind==="My own idea"?"Describe the piece, colours or size you are imagining…":"A tulip pouch for a birthday gift, with cream flowers and pink edging…";
  const change=<K extends keyof Fields>(key:K,value:Fields[K])=>{setFields(f=>({...f,[key]:value}));setError("");};

  useEffect(()=>{busyRef.current=busy},[busy]);
  useEffect(()=>{if(error)dialog.current?.querySelector<HTMLElement>('[role="alert"]')?.scrollIntoView({block:"nearest"});},[error]);
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement;
    const oldOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const key=(e:KeyboardEvent)=>{
      if(e.key==="Escape"&&!busyRef.current){e.preventDefault();onClose();}
      if(e.key!=="Tab")return;
      const all=Array.from(dialog.current?.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),input:not(:disabled):not([tabindex="-1"]),select:not(:disabled),textarea:not(:disabled)')||[]).filter(el=>el.getClientRects().length>0);
      const first=all[0],last=all[all.length-1];
      if(!first||!last)return;
      if(e.shiftKey&&(document.activeElement===first||document.activeElement===heading.current)){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    };
    document.addEventListener("keydown",key);
    return()=>{document.body.style.overflow=oldOverflow;document.removeEventListener("keydown",key);previous?.focus?.();};
  },[onClose]);
  useEffect(()=>{heading.current?.focus();},[step,sent]);

  function brief(){
    if(custom)return `Custom piece: ${kind}. Occasion: ${occasion}.\n${fields.idea.trim()}`;
    const lines=selected.map(p=>`${p.name} × ${quantities[p.id]||1} ${unit(p,quantities[p.id]||1)}${notes[p.id]?"\n"+(p.id==="chai-table"?"Each set: ":"")+notes[p.id].idea:""}`);
    return "Please confirm the price and availability for:\n"+lines.join("\n\n")+(fields.idea.trim()?"\n\nNote for the maker: "+fields.idea.trim():"");
  }
  function next(){
    setError("");
    if(step===0&&custom&&!kind){setError("Choose a starting point for your custom piece.");return;}
    if(step===0&&!custom&&!selected.length){setError("Choose at least one piece to continue.");return;}
    if(step===1&&custom&&fields.idea.trim().length<10){setError("Tell us a little more about your idea—at least 10 characters.");return;}
    setStep(s=>Math.min(2,s+1));
  }
  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(step<2){next();return;}
    setError("");
    if(replyBy==="whatsapp"&&(!/^\+?[\d\s()\-]{7,30}$/.test(fields.contact)||fields.contact.replace(/\D/g,"").length<7||fields.contact.replace(/\D/g,"").length>15)){setError("Enter a valid WhatsApp number, including the area or country code.");return;}
    const idea=brief();
    if(idea.length>2000){setError("Your design notes are a little long. Please shorten your note before sending.");return;}
    if(!requestToken.current)requestToken.current=newToken();
    const colours=custom?fields.colours:selected.filter(p=>notes[p.id]).map(p=>`${p.name}: ${notes[p.id].colours}`).join("; ");
    const payload={...fields,token:requestToken.current,kind:mode,contactMethod:replyBy,idea,colours:colours.length<=150?colours:"See per-product colour choices in the design notes.",items:custom?[]:selected.map(p=>({id:p.id,quantity:quantities[p.id]||1}))};
    setBusy(true);
    try{
      const response=await fetch("/api/requests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result=await response.json() as {id?:string;error?:string};
      if(!response.ok||!result.id)throw Error(result.error||"Please try again.");
      requestSummary.current=`PhotoCraftSquare request ${result.id}\n${idea}\nColours: ${colours||"To discuss"}${fields.deadline?"\nNeeded by: "+fields.deadline:""}${fields.budget?"\nBudget in PKR: "+fields.budget:""}`;
      setSent(result.id);
    }catch(e){setError(e instanceof Error?e.message:"We couldn’t save your request. Please try again.");}
    finally{setBusy(false);}
  }
  const adjust=(id:string,delta:number)=>onQuantityChange(id,Math.max(1,Math.min(50,(quantities[id]||1)+delta)));

  return <div className="order-overlay" onClick={e=>{if(e.target===e.currentTarget&&!busy)onClose()}}>
    <section className={"order-studio "+(custom?"custom-order":"piece-order")} role="dialog" aria-modal="true" aria-labelledby="order-title" ref={dialog}>
      <header className="order-studio-header"><span className="order-brand"><Flower/> PhotoCraftSquare</span><span className="order-header-label">{custom?"A PIECE OF YOUR OWN":"A LITTLE HANDMADE HAPPINESS"}</span><button className="order-close" aria-label="Close order request" disabled={busy} onClick={onClose}>×</button></header>
      {sent?<div className="order-success">
        <div className="success-flower"><Flower/><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4 10-10" fill="none" stroke="currentColor" strokeWidth="2"/></svg></div>
        <p className="eyebrow">SAVED FOR PHOTOCRAFTSQUARE</p><h2 id="order-title" tabIndex={-1} ref={heading}>A lovely beginning.</h2>
        <p>Your {custom?"custom piece":"order"} request is saved.<br/>We’ll use your {replyBy==="email"?"email":"WhatsApp number"} to discuss the price and details.</p>
        <div className="order-next-steps"><div><b>Request saved</b><span>Your ideas are ready for the maker.</span></div><div><b>Agree the details</b><span>Price, colours and timing—confirmed together.</span></div><div><b>Then, we make it</b><span>After you approve the order.</span></div></div>
        <p className="order-reference">Reference <b>{sent.slice(0,8).toUpperCase()}</b></p>
        <p className="order-clarification">No payment has been taken. This request is not a confirmed order.</p>
        <div className="success-actions">{settings.whatsapp&&<a className="button" href={"https://wa.me/"+settings.whatsapp+"?text="+encodeURIComponent(requestSummary.current)} target="_blank" rel="noopener noreferrer">Continue on WhatsApp</a>}<button className="button" onClick={onClose}>Back to the shop</button><button className="text-button" onClick={async()=>{try{await navigator.clipboard.writeText(requestSummary.current);setCopied(true)}catch{setError("Please note the reference shown above.")}}}>{copied?"Copied":"Copy request details"}</button></div>
        {error&&<p className="error" role="alert">{error}</p>}
      </div>:<div className="order-layout">
        <aside className="order-moodboard" aria-label={custom?"Your inspiration board":"Your order summary"}>
          <div className="order-moodboard-heading"><p className="eyebrow">{custom?"DREAM IT. WE’LL STITCH IT.":"CHOSEN WITH A LITTLE LOVE"}</p><h2>{custom?<>Your idea.<br/><em>Our little hook.</em></>:<>Little things.<br/><em>All yours.</em></>}</h2></div>
          <div className="order-board-photo"><ProductPhoto key={mainPhoto} src={mainPhoto} alt={custom?"Crochet inspiration for "+(kind||"a custom piece"):selected[0]?.name||"Crochet pieces from the studio"} width="600" height="600" sizes="360px"/><span>{custom?(mainPhoto===BUNTING_LAYOUT_IMAGE?"EXAMPLE LAYOUT":"INSPIRATION"):selected[0]?.name||"YOUR NEXT FAVOURITE"}</span></div>
          <div className="order-board-caption">{custom?<><b>{kind||"Made around your idea"}</b><span>{step>0?occasion:"Pick a starting point. Make it personal."}</span>{fields.colours&&<span className="board-preference">{fields.colours}</span>}</>:<><b>{count?`${count} ${count===1?"item":"items"} in your request`:"Choose something lovely"}</b><span>A personal quote. No payment now.</span>{selected.length>1&&<div className="board-miniatures">{selected.slice(1,4).map(p=><ProductPhoto key={p.id} src={photoFor(p)} alt={p.name} width="56" height="56" sizes="56px"/>)}</div>}</>}</div>
        </aside>
        <div className="order-panel">
          <ol className="order-progress" aria-label="Order request steps">{steps.map((label,i)=><li key={label} className={i===step?"current":i<step?"complete":""} aria-current={i===step?"step":undefined}><span>{i<step?"✓":i+1}</span><b>{label}</b></li>)}</ol>
          <form className="order-form" aria-busy={busy} onSubmit={submit}>
            <fieldset key={step} className="order-step-body" disabled={busy} aria-busy={busy}>
              <p className="eyebrow">{custom?"CUSTOM PIECE":"ORDER REQUEST"} · STEP {step+1} OF 3</p>
              <h2 id="order-title" tabIndex={-1} ref={heading}>{titles[step]}</h2><p className="order-step-intro">{descriptions[step]}</p>{step===0&&selectionWarning&&<p className="error" role="alert">{selectionWarning}</p>}
              {!settings.accepting&&<p className="error">The studio is currently pausing new requests.</p>}
              {step===0&&(custom?<div className="custom-kind-grid" role="group" aria-label="Type of custom piece">{kinds.map(k=><button type="button" key={k.name} aria-pressed={kind===k.name} className={kind===k.name?"selected":""} onClick={()=>{setKind(k.name);setError("")}}><div><ProductPhoto src={k.image} alt="" width="240" height="190" sizes="(max-width: 699px) 42vw, 240px"/>{k.image===BUNTING_LAYOUT_IMAGE&&<span className="custom-example-label">Example layout</span>}{kind===k.name&&<i aria-hidden="true">✓</i>}</div><b>{k.name}</b><span>{k.hint}</span></button>)}</div>:<>
                {!selected.length&&<p className="order-inline-help">Tap a piece to add it to your order request.</p>}
                <div className="selected-order-pieces">{selected.map(p=><article className="selected-order-piece" key={p.id}><ProductPhoto src={photoFor(p)} alt={p.name} width="100" height="100" sizes="100px"/><div><h3>{p.name}</h3>{notes[p.id]?.colours&&<span className="design-tag">{notes[p.id].colours}</span>}<p>{p.price===null?"Price confirmed with your quote":"PKR "+p.price.toLocaleString("en-PK")}</p>{notes[p.id]?.idea&&<details className="order-piece-preferences"><summary>Your preferences</summary><p>{notes[p.id].idea}</p></details>}<div className="order-quantity"><button type="button" aria-label={"Decrease quantity for "+p.name} disabled={(quantities[p.id]||1)<=1} onClick={()=>adjust(p.id,-1)}>−</button><span aria-live="polite">{quantities[p.id]||1} {unit(p,quantities[p.id]||1)}</span><button type="button" aria-label={"Increase quantity for "+p.name} disabled={(quantities[p.id]||1)>=50} onClick={()=>adjust(p.id,1)}>＋</button></div></div><button className="remove-order-piece" type="button" aria-label={"Remove "+p.name} onClick={()=>onRemove(p.id)}>×</button></article>)}</div>
                {!!selected.length&&<button type="button" className="order-add-another" aria-expanded={showPieces} onClick={()=>setShowPieces(!showPieces)}>{showPieces?"Hide collection":"＋ Add another piece"}</button>}
                {showPieces&&selectedIds.length>=12&&<p className="preview-note">Up to 12 designs per request. Remove a design to choose another.</p>}
                {(!selected.length||showPieces)&&<div className="order-product-picker" role="group" aria-label="Choose products">{available.map(p=><button type="button" key={p.id} className={selectedIds.includes(p.id)?"selected":""} aria-pressed={selectedIds.includes(p.id)} disabled={!selectedIds.includes(p.id)&&selectedIds.length>=12} onClick={()=>selectedIds.includes(p.id)?onRemove(p.id):onAdd(p.id)}><div><ProductPhoto src={photoFor(p)} alt="" width="200" height="200" sizes="(max-width: 699px) 40vw, 200px" loading="lazy"/>{selectedIds.includes(p.id)&&<i aria-hidden="true">✓</i>}</div><span>{p.name}</span></button>)}</div>}
              </>)}
              {step===1&&<>
                {custom?<>
                  <fieldset className="order-choice-group"><legend>Need a starting point?</legend><div className="occasion-options">{(archiveIdeas[kind]||[]).map(x=><button type="button" key={x} onClick={()=>{const line=`Design idea: ${x.toLowerCase()}.`;if(!fields.idea.includes(line)&&fields.idea.length+line.length+1<=1200)change("idea",[fields.idea.trim(),line].filter(Boolean).join("\n"));}}>{x}</button>)}</div><p className="preview-note">Custom design ideas · details and availability by quote.</p></fieldset>
                  <label className="order-field">Tell us your idea<textarea name="customIdea" rows={3} required minLength={10} maxLength={1200} placeholder={ideaPlaceholder} value={fields.idea} onChange={e=>change("idea",e.target.value)}/></label>
                  <fieldset className="order-choice-group"><legend>What’s the occasion?</legend><div className="occasion-options">{["Just because","Birthday","Wedding","New home"].map(x=><button type="button" key={x} aria-pressed={occasion===x} className={occasion===x?"selected":""} onClick={()=>setOccasion(x)}>{x}</button>)}</div></fieldset>
                  <fieldset className="order-choice-group"><legend>Choose a colour mood <small>or tell us your own</small></legend><div className="order-palettes">{palettes.map(p=><button type="button" key={p.name} aria-pressed={fields.colours===p.name} className={fields.colours===p.name?"selected":""} onClick={()=>change("colours",p.name)}><span aria-hidden="true">{p.swatches.map(c=><i key={c} style={{backgroundColor:c}}/>)}</span><b>{p.name}</b></button>)}</div></fieldset>
                  <label className="order-field">Your colours <small>(optional)</small><input name="colours" value={fields.colours} onChange={e=>change("colours",e.target.value)} maxLength={150} placeholder="Blush pink, cream and a little green"/></label>
                </>:<>
                  <div className="order-detail-summary">{selected.map(p=><div key={p.id}><ProductPhoto src={photoFor(p)} alt="" width="48" height="48" sizes="48px"/><span><b>{p.name}</b><small>{notes[p.id]?.colours||"Colours as pictured"} · {quantities[p.id]||1} {unit(p,quantities[p.id]||1)}</small></span><i aria-hidden="true">✓</i></div>)}</div>
                  <label className="order-field">A note for the maker <small>(optional)</small><textarea name="orderNote" rows={3} maxLength={1200} placeholder="Different colours, a size, or something we should know…" value={fields.idea} onChange={e=>change("idea",e.target.value)}/></label>
                </>}
                {occasionOrder&&<label className="order-field">Event date <small>(optional)</small><input type="date" name="deadline" min={new Date().toISOString().slice(0,10)} value={fields.deadline} onInput={e=>change("deadline",e.currentTarget.value)} onChange={e=>change("deadline",e.target.value)}/><small>We’ll confirm making time before accepting your order.</small></label>}
                <details className="order-extras"><summary>{occasionOrder?"Have a budget in mind?":"Have a budget or a date in mind?"} <span>＋</span></summary><div className="form-grid"><label>Budget in PKR <small>(optional)</small><input name="budget" placeholder="Your comfortable range" maxLength={80} value={fields.budget} onChange={e=>change("budget",e.target.value)}/></label>{!occasionOrder&&<label>Needed by <small>(optional)</small><input type="date" name="deadline" min={new Date().toISOString().slice(0,10)} value={fields.deadline} onInput={e=>change("deadline",e.currentTarget.value)} onChange={e=>change("deadline",e.target.value)}/></label>}</div><p>We’ll confirm what’s possible before accepting the order.</p></details>
              </>}
              {step===2&&<>
                <div className="order-contact-summary"><Flower/><span>{custom?kind:`${selected.length} ${selected.length===1?"design":"designs"} selected`}<small>{custom?(fields.colours||"Colours to discuss"):"Your pieces and preferences will be included."}</small>{fields.deadline&&<small>Needed by {fields.deadline}</small>}</span><button type="button" onClick={()=>setStep(0)}>Edit</button></div>
                <label className="order-field">Your name<input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="What should we call you?" value={fields.name} onChange={e=>change("name",e.target.value)}/></label>
                <fieldset className="order-choice-group"><legend>How should we reply?</legend><div className="reply-options">{["whatsapp","email"].map(method=><button key={method} type="button" aria-pressed={replyBy===method} className={replyBy===method?"selected":""} onClick={()=>{setReplyBy(method as "whatsapp"|"email");change("contact","")}}>{method==="whatsapp"?"WhatsApp":"Email"}<span aria-hidden="true">{replyBy===method?"✓":""}</span></button>)}</div></fieldset>
                <label className="order-field">{replyBy==="email"?"Email address":"WhatsApp number"}<input key={replyBy} name="contact" type={replyBy==="email"?"email":"tel"} inputMode={replyBy==="email"?"email":"tel"} autoComplete={replyBy==="email"?"email":"tel"} required minLength={replyBy==="email"?5:7} maxLength={replyBy==="email"?150:30} placeholder={replyBy==="email"?"you@example.com":"e.g. +92 300 1234567"} value={fields.contact} onChange={e=>change("contact",e.target.value)}/></label>
                <div className="form-grid"><label>Delivery city<input name="city" required minLength={2} maxLength={100} autoComplete="address-level2" placeholder="Your city" value={fields.city} onChange={e=>change("city",e.target.value)}/></label><label>Country<input name="country" required minLength={2} maxLength={80} autoComplete="country-name" value={fields.country} onChange={e=>change("country",e.target.value)}/></label></div>
                <label className="consent order-consent"><input type="checkbox" required checked={fields.consent} onChange={e=>change("consent",e.target.checked)}/><span>PhotoCraftSquare may use these details to reply about this request.</span></label>
                <details className="order-privacy"><summary>How we use your details</summary><p>Your contact and request are saved so PhotoCraftSquare can reply and manage the order. No card details are collected. Contact PhotoCraftSquare on Instagram for access or deletion requests.</p></details>
                <div className="trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={e=>change("website",e.target.value)}/></label></div>
              </>}
              {error&&<p className="error" role="alert">{error}</p>}
            </fieldset>
            {busy&&<p className="saving-request" role="status"><span aria-hidden="true"/>Keeping your pieces and notes together…</p>}
            <footer className="order-actions"><div>{step>0?<button type="button" className="order-back" disabled={busy} onClick={()=>{setError("");setStep(s=>s-1)}}>← Back</button>:<span className="order-no-payment">A quote first.<br/>No payment now.</span>}</div><button className="button" disabled={busy||(step===2&&!settings.accepting)}>{busy?"Saving your request…":step<2?"Continue":custom?"Send custom request":"Send order request"}</button></footer>
          </form>
        </div>
      </div>}
    </section>
  </div>;
}
