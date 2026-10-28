"use client";
import { useState } from "react";
import type { Product } from "../lib/catalog";
import type { Colourway } from "../lib/customisation";
export function Flower({ className = "" }: {
    className?: string;
}) {
    return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 34C28-5 4 27 33 45-9 49 8 85 40 64c-8 42 33 42 24 0 34 22 51-15 10-19C103 26 76-5 56 34Z" fill="currentColor"/><circle cx="51" cy="49" r="10" fill="var(--oat)"/></svg>;
}
export function StudioHero({ products }: {
    products: Product[];
}) {
    const main = products.find(p => p.id === "spring-tissue") || products[0];
    const secondary = products.find(p => p.id === "golden-fan-bag");
    if (!main)
        return null;
    return <section className="studio-hero">
    <div className="hero-writing">
      <p className="eyebrow">HANDMADE IN ISLAMABAD</p>
      <h1>Little things.<br /><em>Made personal.</em></h1>
      <p className="hero-description">Crochet gifts & home pieces,<br className="desktop-break"/> made for you.</p>
    </div>
    <div className="hero-scrapbook">
      <a href={"/shop/" + main.id} className="hero-main-photo">
        <img src={main.image} alt={main.name} width="900" height="900" fetchPriority="high"/>
        <span>{main.name}<b aria-hidden="true">↗</b></span>
      </a>
      {secondary && <a href={"/shop/" + secondary.id} className="hero-mini-photo">
        <img src={secondary.image} alt={secondary.name} width="280" height="280"/>
        <span>{secondary.name} ↗</span>
      </a>}
      <Flower className="hero-flower"/>
    </div>
    <div className="hero-actions"><a href="#collection" className="button">Explore the collection <span aria-hidden="true">↗</span></a><p>Handmade · Custom colours welcome</p></div>
  </section>;
}
const interests = [
    { name: "Book lovers", ids: ["tulip-bookmark", "tulip-cream", "forever-bouquet"] },
    { name: "Home lovers", ids: ["spring-tissue", "chai-table", "owl-wall"] },
    { name: "Little surprises", ids: ["whale-keyring", "tooth-keepsake", "forever-bouquet"] },
    { name: "Everyday bags", ids: ["golden-fan-bag", "tulip-cream", "tulip-pink"] }
];
export function GiftFinder({ products }: {
    products: Product[];
}) {
    const [interest, setInterest] = useState(0);
    const suggestions = interests[interest].ids.map(id => products.find(p => p.id === id)).filter((p): p is Product => !!p && p.availability !== "Unavailable");
    return <section className="gift-finder wrap" id="gift-finder">
    <div className="section-heading"><div><p className="eyebrow">A LITTLE HELP CHOOSING</p><h2>A gift for <em>their kind of day.</em></h2></div></div>
    <div className="interest-tabs" role="group" aria-label="Find gifts by interest">
      {interests.map((x, i) => <button key={x.name} aria-pressed={interest === i} className={interest === i ? "active" : ""} onClick={() => setInterest(i)}>{x.name}</button>)}
    </div>
    <div className="finder-results" aria-live="polite">
      {suggestions.map(p => <a key={p.id} href={"/shop/" + p.id} className="gift-product"><img src={p.image} alt={p.name} width="350" height="350" loading="lazy"/><div><h3>{p.name}</h3><span>View product ↗</span></div></a>)}
    </div>
  </section>;
}
function ColourPicker({ colourways, selected, onSelect }: {
    colourways: Colourway[];
    selected: number;
    onSelect: (index: number) => void;
}) {
    const current = colourways[selected] || colourways[0];
    return <fieldset className="colour-picker"><legend>Try a colour <small>on this product</small></legend>
    <div className="colour-options">{colourways.map((c, i) => <button type="button" key={c.name} className={selected === i ? "selected" : ""} aria-pressed={selected === i} onClick={() => onSelect(i)}>
      <span className="yarn-swatches" aria-hidden="true">{c.swatches.map(colour => <i key={colour} style={{ backgroundColor: colour }}/>)}</span><span>{c.name}</span><b aria-hidden="true">{selected === i ? "✓" : ""}</b>
    </button>)}</div>
    <p className="preview-note" role="status">{current.approximate ? "Photo colour preview · approximate yarn colours" : "Colour as pictured"}</p>
  </fieldset>;
}
export function ProductCustomizer({ product, colourways, selected, onSelect, onRequest, accepting }: {
    product: Product;
    colourways: Colourway[];
    selected: number;
    onSelect: (index: number) => void;
    onRequest: (idea: string, colours: string, id: string) => void;
    accepting: boolean;
}) {
    const [mats, setMats] = useState(4), [coasters, setCoasters] = useState(4), [runner, setRunner] = useState(true), [error, setError] = useState("");
    const table = product.id === "chai-table";
    const current = colourways[selected] || colourways[0];
    const request = (e: React.FormEvent) => {
        e.preventDefault();
        if (table && !mats && !coasters && !runner) {
            setError("Choose at least one piece for your set.");
            return;
        }
        const parts = table ? [mats ? `${mats} place mats` : "", coasters ? `${coasters} coasters` : "", runner ? "1 runner" : ""].filter(Boolean).join(", ") : product.name;
        onRequest(`Please quote ${parts}. Colour choice: ${current.name}. Please confirm yarn, dimensions and making time.`, current.name, product.id);
    };
    return <form className="product-customizer" id="product-customizer" onSubmit={request}>
    <div className="desktop-colour-picker"><ColourPicker colourways={colourways} selected={selected} onSelect={onSelect}/></div>
    {table && <fieldset className="set-options"><legend>Choose your set</legend>
      <div className="form-grid">
        <label>Place mats<select aria-label="Place mats" value={mats} onChange={e => { setMats(Number(e.target.value)); setError(""); }}>{[0, 2, 4, 6].map(n => <option key={n} value={n}>{n === 0 ? "None" : n}</option>)}</select></label>
        <label>Coasters<select aria-label="Coasters" value={coasters} onChange={e => { setCoasters(Number(e.target.value)); setError(""); }}>{[0, 2, 4, 6].map(n => <option key={n} value={n}>{n === 0 ? "None" : n}</option>)}</select></label>
      </div>
      <label className="check-label"><input type="checkbox" checked={runner} onChange={e => { setRunner(e.target.checked); setError(""); }}/> Include a table runner</label>
    </fieldset>}
    {error && <p className="error" role="alert">{error}</p>}
    <button className="button inline-product-request" disabled={!accepting}>Order this piece <span aria-hidden="true">↗</span></button>
    <p className="preview-note">We confirm the yarn and final price with you.</p>
  </form>;
}
function InspectPhoto({ image, alt }: {
    image: string;
    alt: string;
}) {
    const [zoom, setZoom] = useState(false);
    return <button className={"gallery-image " + (zoom ? "zoomed" : "")} onClick={() => setZoom(!zoom)} aria-label={zoom ? "Zoom out of product photo" : "Zoom in to inspect stitches"} aria-pressed={zoom}>
    <img src={image} alt={alt} width="1254" height="1254"/>
    <span aria-hidden="true">{zoom ? "− Zoom out" : "＋ Zoom"}</span>
  </button>;
}
export function ProductGallery({ product, colourway, onClearColourway, colourways, selectedColour, onSelectColour }: {
    product: Product;
    colourway?: Colourway;
    onClearColourway: () => void;
    colourways: Colourway[];
    selectedColour: number;
    onSelectColour: (index: number) => void;
}) {
    const images = [{image:product.image,label:"Product photo"},...(product.gallery||[]).filter(p=>!p.image.includes("-original")&&!/^original/i.test(p.label))];
    const [index, setIndex] = useState(0);
    const selected = colourway ? { image: colourway.image, label: colourway.name + " · colour preview" } : images[index] || images[0];
    return <div className="product-gallery">
    <div className="gallery-photo-wrap"><InspectPhoto key={selected.image} image={selected.image} alt={product.name + " — " + selected.label}/>{colourway && <span className="colour-preview-badge">Colour preview</span>}</div>
    {colourways.length > 0 && <div className="mobile-colour-picker"><ColourPicker colourways={colourways} selected={selectedColour} onSelect={onSelectColour}/></div>}
    {images.length>1&&<div className="gallery-thumbs" role="group" aria-label="Product photographs">
      {images.map((im, i) => <button key={im.image} onClick={() => { setIndex(i); onClearColourway(); }} className={!colourway && index === i ? "active" : ""} aria-pressed={!colourway && index === i}><img src={im.image} alt="" width="75" height="75"/><span>{im.label}</span></button>)}
    </div>}
    {colourway&&<p className="preview-note" aria-live="polite">{colourway.name} · Final yarn shades may vary.</p>}
  </div>;
}
