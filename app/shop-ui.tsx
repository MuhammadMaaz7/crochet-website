"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Product, Settings } from "../lib/catalog";
import { StudioHero, GiftFinder, ProductCustomizer, ProductGallery, Flower } from "./studio-experiences";
import { productColourways } from "../lib/customisation";
const money = (n: number | null) => n === null ? "Price on request" : "PKR " + n.toLocaleString("en-PK");
function persistPicks(ids: string[]) {
    try {
        localStorage.setItem("pcs-picks", JSON.stringify(ids));
    }
    catch { }
}
function requestToken() { const b = crypto.getRandomValues(new Uint8Array(16)); b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128; const h = Array.from(b).map(x => x.toString(16).padStart(2, "0")).join(""); return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20); }
function Mark() { return <svg viewBox="0 0 52 52" aria-hidden="true"><path d="M26 6c6-9 13 0 9 7 9-4 16 5 8 11 10 5 3 15-5 12 2 10-10 14-13 5-6 8-16 1-12-7-10 1-13-11-3-14-7-7 2-16 9-11 0-7 5-9 7-3Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="26" cy="25" r="6" fill="currentColor"/></svg>; }
export default function Shop({ products, settings, initialProduct, initialCustom = false }: {
    products: Product[];
    settings: Settings;
    initialProduct?: string;
    initialCustom?: boolean;
}) {
    const [filter, setFilter] = useState("All pieces"), [search, setSearch] = useState(""), [picks, setPicks] = useState<string[]>([]), [drawer, setDrawer] = useState(false), [custom, setCustom] = useState(initialCustom), [idea, setIdea] = useState(""), [colours, setColours] = useState(""), [sent, setSent] = useState(""), [error, setError] = useState(""), [busy, setBusy] = useState(false), [copied, setCopied] = useState(false);
    const [itemNotes, setItemNotes] = useState<Record<string, {
        idea: string;
        colours: string;
    }>>({});
    const menuRef = useRef<HTMLButtonElement>(null);
    const token = useRef(""), summary = useRef("");
    const dialogRef = useRef<HTMLDivElement>(null);
    const product = products.find(p => p.id === initialProduct);
    const [menu, setMenu] = useState(false), [colourIndex, setColourIndex] = useState(0);
    const colourways = product ? productColourways(product) : [];
    useEffect(() => {
        if (sent)
            dialogRef.current?.focus();
    }, [sent]);
    useEffect(() => {
        try {
            const p = JSON.parse(localStorage.getItem("pcs-picks") || "[]");
            if (Array.isArray(p))
                setPicks(p.filter((id: any) => typeof id === "string" && products.some(p => p.id === id)).slice(0, 12));
        }
        catch { }
    }, [products]);
    useEffect(() => { try {
        const saved = JSON.parse(localStorage.getItem("pcs-designs") || "{}");
        const valid: Record<string, {
            idea: string;
            colours: string;
        }> = {};
        for (const p of products) {
            const note = saved[p.id];
            if (productColourways(p).length && typeof note?.idea === "string" && note.idea.length <= 500 && typeof note?.colours === "string" && note.colours.length <= 80)
                valid[p.id] = note;
        }
        setItemNotes(valid);
    }
    catch { } }, [products]);
    const saveDesigns = (notes: Record<string, {
        idea: string;
        colours: string;
    }>) => { try {
        localStorage.setItem("pcs-designs", JSON.stringify(notes));
    }
    catch { } };
    const selectedDesigns = picks.filter(id => itemNotes[id]).map(id => ({ name: products.find(p => p.id === id)?.name || id, ...itemNotes[id] }));
    const requestIdea = idea || selectedDesigns.map(n => n.name + ": " + n.idea).join("\n\n") || (picks.length ? "Please confirm the price and availability for these products." : "");
    const requestColours = colours || selectedDesigns.map(n => n.name + ": " + n.colours).join("; ");
    const choose = (id: string) => {
        if (sent) {
            setSent("");
            token.current = "";
            setCopied(false);
        }
        setError("");
        setIdea("");
        setColours("");
        setPicks(prev => { const next = prev.includes(id) ? prev : prev.length < 12 ? [...prev, id] : prev; persistPicks(next); return next; });
        setDrawer(true);
    };
    const remove = (id: string) => { setPicks(prev => { const n = prev.filter(x => x !== id); persistPicks(n); return n; }); setItemNotes(prev => { const next = { ...prev }; delete next[id]; saveDesigns(next); return next; }); };
    useEffect(() => {
        if (!drawer && !custom)
            return;
        const last = document.activeElement as HTMLElement;
        document.body.style.overflow = "hidden";
        dialogRef.current?.focus();
        const key = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setDrawer(false);
                setCustom(false);
            }
            if (e.key === "Tab") {
                const n = dialogRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex="0"]');
                if (!n?.length)
                    return;
                const first = n[0], end = n[n.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    end.focus();
                }
                else if (!e.shiftKey && document.activeElement === end) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener("keydown", key);
        return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", key); last?.focus?.(); };
    }, [drawer, custom]);
    const plan = (text: string, palette: string, id?: string) => {
        if (sent) {
            setSent("");
            token.current = "";
            setCopied(false);
        }
        setError("");
        setIdea(id ? "" : text);
        setColours(id ? "" : palette);
        if (id) {
            setItemNotes(prev => { const next = { ...prev, [id]: { idea: text, colours: palette } }; saveDesigns(next); return next; });
        }
        if (id && products.some(p => p.id === id && p.availability !== "Unavailable"))
            setPicks(prev => { const next = prev.includes(id) ? prev : prev.length < 12 ? [...prev, id] : prev; persistPicks(next); return next; });
        setCustom(true);
        setDrawer(false);
    };
    const shelfOrder = ["spring-tissue", "chai-table", "golden-fan-bag", "forever-bouquet", "tulip-cream", "tulip-bookmark", "owl-wall", "tissue-garden", "tulip-pink", "whale-keyring", "tooth-keepsake", "berry-keyring"];
    const visible = products.filter(p => (filter === "All pieces" || p.category === filter) && (p.name + " " + p.description).toLowerCase().includes(search.toLowerCase())).sort((a, b) => { const ai = shelfOrder.indexOf(a.id), bi = shelfOrder.indexOf(b.id); return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi); });
    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setBusy(true);
        const f = new FormData(e.currentTarget);
        if (!token.current)
            token.current = requestToken();
        const data = { token: token.current, name: String(f.get("name")), contact: String(f.get("contact")), city: String(f.get("city")), country: String(f.get("country")), idea: String(f.get("idea")), colours: String(f.get("colours") || ""), budget: String(f.get("budget") || ""), deadline: String(f.get("deadline") || ""), items: picks.map(id => ({ id, quantity: Number(f.get("qty-" + id) || 1) })), consent: f.get("consent") === "on", website: String(f.get("website") || "") };
        try {
            const r = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
            const result = await r.json() as {
                error?: string;
                id: string;
            };
            if (!r.ok)
                throw Error(result.error || "Please try again.");
            summary.current = "PhotoCraftSquare request " + result.id + "\n" + data.items.map(i => products.find(p => p.id === i.id)?.name + " × " + i.quantity).join("\n") + "\n" + data.idea + "\nColours: " + data.colours + "\nDestination: " + data.city + ", " + data.country + "\nRequested by: " + (data.deadline || "Flexible");
            setSent(result.id);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "Unable to save. Please try again.");
        }
        finally {
            setBusy(false);
        }
    }
    return <><a className="skip" href="#main">Skip to content</a><div className="notice">{settings.notice || "Handmade in Islamabad · Custom colours welcome"}</div>
    <header className="header" onKeyDown={e => { if (e.key === "Escape") {
        setMenu(false);
        menuRef.current?.focus();
    } }}>
      <Link href="/" className="wordmark" onClick={() => setMenu(false)}><Mark /><span>PhotoCraftSquare<small>HANDMADE CROCHET</small></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="/#collection">Shop</a><button onClick={() => plan("", "")}>Custom orders</button><a href="/#maker">Our story</a><a href="/#help">How to order</a></nav>
      <div className="header-actions"><button className="enquiry-button" onClick={() => { setMenu(false); if (sent) {
        setSent("");
        token.current = "";
        setCopied(false);
    } setDrawer(true); }}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h14v12H9l-4 4V4Z" stroke="currentColor" strokeWidth="1.5"/><path d="M8 8h8M8 12h5" stroke="currentColor" strokeWidth="1.5"/></svg><span>Enquiry{picks.length > 0 && <b>{picks.length}</b>}</span></button><button ref={menuRef} className="menu-button" aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu(!menu)}>{menu ? <span aria-hidden="true">×</span> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>}</button></div>
      {menu && <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation"><a href="/#collection" onClick={() => setMenu(false)}>Shop all products <span>↗</span></a><a href="/#gift-finder" onClick={() => setMenu(false)}>Find a gift <span>↗</span></a><button onClick={() => { setMenu(false); plan("", ""); }}>Request something custom <span>↗</span></button><a href="/#maker" onClick={() => setMenu(false)}>Our story</a><a href="/#help" onClick={() => setMenu(false)}>How to order</a></nav>}
    </header>
    <main id="main">
    {product ? <section className="product-detail wrap">
      <div className="breadcrumb"><Link href="/#collection">← All products</Link></div>
      <div className="product-mobile-title"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p>{money(product.price)}</p></div>
      <div className="detail-grid">
        <ProductGallery product={product} colourway={colourIndex > 0 ? colourways[colourIndex] : undefined} onClearColourway={() => setColourIndex(0)} colourways={colourways} selectedColour={colourIndex} onSelectColour={setColourIndex}/>
        <div className="detail-copy"><div className="desktop-product-title"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="price">{money(product.price)}</p></div><p className="lead">{product.description}</p>
          {colourways.length > 0 ? <ProductCustomizer product={product} colourways={colourways} selected={colourIndex} onSelect={setColourIndex} onRequest={plan} accepting={settings.accepting && product.availability !== "Unavailable"}/> : <><button className="button inline-product-request" disabled={product.availability === "Unavailable" || !settings.accepting} onClick={() => choose(product.id)}>Request price <span aria-hidden="true">↗</span></button><p className="preview-note">Ask us about your preferred colours.</p></>}
          <details className="product-information"><summary>Product details</summary><p>{product.details}</p><p>{product.availability === "Enquire" ? "Availability is confirmed with your quote." : product.availability} · {product.leadTime}</p></details>
          <details className="product-information"><summary>Delivery & making time</summary><p>{settings.shipping}</p></details>
          <p className="detail-note">Send a request. We agree the price and details before you pay.</p>
        </div>
      </div>
    </section> : <>
      <StudioHero products={products}/>
      <section className="collection wrap" id="collection">
        <div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p><h2>Find your <em>little lovely.</em></h2></div></div>
        <div className="collection-controls"><div className="tabs" role="group" aria-label="Filter collection">{[{ value: "All pieces", label: "All" }, { value: "For the home", label: "Home" }, { value: "Little gifts", label: "Gifts" }, { value: "Bags & accessories", label: "Bags" }].map(x => <button key={x.value} aria-pressed={filter === x.value} className={filter === x.value ? "active" : ""} onClick={() => setFilter(x.value)}>{x.label}</button>)}</div><label className="search-box"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="m15 15 5 5" stroke="currentColor" strokeWidth="1.5"/></svg><input type="search" aria-label="Search products" placeholder="Search products" value={search} onChange={e => setSearch(e.target.value)}/></label></div>
        <p className="collection-count" aria-live="polite">{visible.length} {visible.length === 1 ? "product" : "products"}</p>
        <div className="products">{visible.map(p => <article className="product-card" key={p.id}><Link href={"/shop/" + p.id} className="product-link"><div className="product-image"><img src={p.image} alt={p.name} loading="lazy" width="650" height="650"/></div><div className="product-meta"><h3>{p.name}</h3><p>{money(p.price)}</p><span className="view-product">View product <i aria-hidden="true">↗</i></span></div></Link></article>)}</div>
        {!visible.length && <p className="empty">No matching products. <button onClick={() => { setFilter("All pieces"); setSearch(""); }}>Clear search</button></p>}
      </section>
      <section className="custom-invite wrap"><Flower /><div><h2>A colour you love.<br /><em>A gift that’s them.</em></h2><p>Have something in mind? Let’s make it personal.</p><button className="button" onClick={() => plan("", "")}>Request a custom piece <span aria-hidden="true">↗</span></button></div></section>
      <GiftFinder products={products}/>
      <section className="maker wrap" id="maker"><div><p className="eyebrow">OUR LITTLE STUDIO</p><h2>Made by hand.<br /><em>From Islamabad.</em></h2></div><div><p>PhotoCraftSquare makes crochet gifts, bags and pieces for your home—one stitch at a time.</p><p>Choose a design you love, or tell us about something personal.</p><a className="text-button" href="https://www.instagram.com/photocraftsquare/" target="_blank" rel="noopener noreferrer">Visit our Instagram ↗</a></div></section>
    </>}
    <section className="help wrap" id="help"><div><h2>Good to know.</h2></div><div>{[["How do I order?", "Open a product and tap Request price, or send a custom request. We reply to agree the price, delivery and making time. No payment is taken on this website."], ["Can I choose my colours?", "Ask about the colours you have in mind. Yarn availability and the final design are confirmed with your quote."], ["Where do you deliver?", settings.shipping], ["What about changes or returns?", settings.returns], ["How is my request information used?", "Your name, contact and request details are stored so the studio can respond and manage your enquiry. We do not collect card details here. Please avoid including sensitive information. Contact the studio through Instagram for access or deletion requests."]].map(([q, a]) => <details key={q}><summary>{q}<span>＋</span></summary><p>{a}</p></details>)}</div></section>
    </main><footer><div className="footer-main"><Link href="/" className="wordmark"><Mark /><span>PhotoCraftSquare<small>Handmade crochet · Islamabad</small></span></Link><div><a href="/#collection">The collection</a><button onClick={() => plan("", "")}>Custom requests</button><a href="/#help">Ordering & privacy</a></div><div><a href="https://www.instagram.com/photocraftsquare/" target="_blank" rel="noopener noreferrer">Instagram ↗</a><Link href="/admin">The studio ↗</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} PhotoCraftSquare</span><span>Islamabad, Pakistan · One stitch at a time.</span></div></footer>
    {product && <div className="product-sticky"><span>{money(product.price)}</span>{colourways.length > 0 ? <button className="button" type="submit" form="product-customizer" disabled={!settings.accepting || product.availability === "Unavailable"}>Request this design ↗</button> : <button className="button" onClick={() => choose(product.id)} disabled={!settings.accepting || product.availability === "Unavailable"}>Request price ↗</button>}</div>}
    {(drawer || custom) && <div className="overlay" onClick={e => {
                if (e.target === e.currentTarget) {
                    setDrawer(false);
                    setCustom(false);
                }
            }}><div className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabIndex={-1} ref={dialogRef}><button className="close" onClick={() => { setDrawer(false); setCustom(false); }} aria-label="Close enquiry">×</button><p className="eyebrow">{sent ? "SAVED WITH THE STUDIO" : custom ? "MADE FOR YOU" : "YOUR ENQUIRY"}</p><h2 id="drawer-title">{sent ? "A lovely start." : custom ? "Tell us what you need." : "Your enquiry."}</h2>{sent ? <div className="success" role="status"><p>Your request is saved. The studio can now review it and reply using the contact you provided.</p><p className="reference">Reference: {sent}</p><p>This is an enquiry, not a confirmed order. No payment has been taken.</p>{settings.whatsapp && <a className="button" target="_blank" rel="noopener noreferrer" href={"https://wa.me/" + settings.whatsapp + "?text=" + encodeURIComponent(summary.current)}>Continue on WhatsApp ↗</a>}<button className="text-button" onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(summary.current);
                        setCopied(true);
                    }
                    catch {
                        setError("Copy isn’t available here. Please note your reference.");
                    }
                }}>{copied ? "Summary copied" : "Copy request summary"}</button><button className="text-button" onClick={() => { setSent(""); token.current = ""; setDrawer(false); setCustom(false); }}>Continue browsing</button></div> : <><p>{custom ? "Tell us the piece, colours or occasion you have in mind." : "Send these products to the studio for a price and availability check."}</p><form onSubmit={submit}>{picks.map(id => { const p = products.find(p => p.id === id); return p && <div className="pick-row" key={id}><img src={p.image} alt="" width="72" height="72"/><div><b>{p.name}</b><p>{money(p.price)}</p>{itemNotes[id] && <p className="picked-design">{itemNotes[id].colours}</p>}<button type="button" className="text-button small" onClick={() => remove(id)}>Remove</button></div><label>Qty<input name={"qty-" + id} aria-label={"Quantity for " + p.name} type="number" min="1" max="50" defaultValue="1" required/></label></div>; })}<div className="form-grid"><label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={80}/></label><label>WhatsApp or email<input name="contact" required minLength={5} maxLength={150}/></label><label>Delivery city<input name="city" autoComplete="address-level2" required maxLength={100}/></label><label>Country<input name="country" autoComplete="country-name" defaultValue="Pakistan" required maxLength={80}/></label></div><label>Anything we should know?<textarea name="idea" required minLength={10} maxLength={2000} defaultValue={requestIdea} placeholder="A piece, a size, a person or an occasion…" rows={4}/></label><label>Colours you have in mind <small>(optional)</small><input name="colours" maxLength={150} defaultValue={requestColours}/></label><div className="form-grid"><label>Budget in PKR <small>(optional)</small><input name="budget" maxLength={80} placeholder="Your comfortable range"/></label><label>Needed by <small>(optional)</small><input name="deadline" type="date" min={new Date().toISOString().slice(0, 10)}/></label></div><div className="trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div><label className="consent"><input name="consent" type="checkbox" required/><span>I agree to the studio using these details to respond to this request. <a href="/#help" onClick={() => { setDrawer(false); setCustom(false); }}>Ordering & privacy</a></span></label><p className="caption">Reference pictures can be shared when the studio replies. Requested dates depend on availability.</p><button className="button" disabled={busy || !settings.accepting}>{busy ? "Saving your request…" : settings.accepting ? "Send request ↗" : "Requests are paused"}</button><p className="caption">We confirm price, delivery and making time before accepting your order.</p></form></>}{error && <p role="alert" className="error">{error}</p>}</div></div>}</>;
}
