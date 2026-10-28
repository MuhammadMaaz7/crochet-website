"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Product, Settings } from "../lib/catalog";
import { StudioHero, GiftFinder, TableStudio, ProductGallery, Flower } from "./studio-experiences";
const money = (n: number | null) => n === null ? "Price on enquiry" : "PKR " + n.toLocaleString("en-PK");
function persistPicks(ids: string[]) { try {
    localStorage.setItem("pcs-picks", JSON.stringify(ids));
}
catch { } }
function requestToken() { const b = crypto.getRandomValues(new Uint8Array(16)); b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128; const h = Array.from(b).map(x => x.toString(16).padStart(2, "0")).join(""); return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20); }
function Mark() { return <svg viewBox="0 0 52 52" aria-hidden="true"><path d="M26 6c6-9 13 0 9 7 9-4 16 5 8 11 10 5 3 15-5 12 2 10-10 14-13 5-6 8-16 1-12-7-10 1-13-11-3-14-7-7 2-16 9-11 0-7 5-9 7-3Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="26" cy="25" r="6" fill="currentColor"/></svg>; }
export default function Shop({ products, settings, initialProduct, initialCustom = false }: {
    products: Product[];
    settings: Settings;
    initialProduct?: string;
    initialCustom?: boolean;
}) {
    const [filter, setFilter] = useState("All pieces"), [search, setSearch] = useState(""), [picks, setPicks] = useState<string[]>([]), [drawer, setDrawer] = useState(false), [custom, setCustom] = useState(initialCustom), [idea, setIdea] = useState(""), [colours, setColours] = useState(""), [sent, setSent] = useState(""), [error, setError] = useState(""), [busy, setBusy] = useState(false), [copied, setCopied] = useState(false);
    const token = useRef(""), summary = useRef("");
    const dialogRef = useRef<HTMLDivElement>(null);
    const product = products.find(p => p.id === initialProduct);
    useEffect(() => { if (sent)
        dialogRef.current?.focus(); }, [sent]);
    useEffect(() => { try {
        const p = JSON.parse(localStorage.getItem("pcs-picks") || "[]");
        if (Array.isArray(p))
            setPicks(p.filter((id: any) => typeof id === "string" && products.some(p => p.id === id)).slice(0, 12));
    }
    catch { } }, [products]);
    const choose = (id: string) => { if (sent) {
        setSent("");
        token.current = "";
        setCopied(false);
    } setError(""); setIdea(""); setColours(""); setPicks(prev => { const next = prev.includes(id) ? prev : prev.length < 12 ? [...prev, id] : prev; persistPicks(next); return next; }); setDrawer(true); };
    const remove = (id: string) => setPicks(prev => { const n = prev.filter(x => x !== id); persistPicks(n); return n; });
    useEffect(() => { if (!drawer && !custom)
        return; const last = document.activeElement as HTMLElement; document.body.style.overflow = "hidden"; dialogRef.current?.focus(); const key = (e: KeyboardEvent) => { if (e.key === "Escape") {
        setDrawer(false);
        setCustom(false);
    } if (e.key === "Tab") {
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
    } }; document.addEventListener("keydown", key); return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", key); last?.focus?.(); }; }, [drawer, custom]);
    const plan = (text: string, palette: string, id?: string) => { if (sent) {
        setSent("");
        token.current = "";
        setCopied(false);
    } setError(""); setIdea(text); setColours(palette); if (id && products.some(p => p.id === id && p.availability !== "Unavailable"))
        setPicks(prev => { const next = prev.includes(id) ? prev : prev.length < 12 ? [...prev, id] : prev; persistPicks(next); return next; }); setCustom(true); setDrawer(false); };
    const shelfOrder = ["spring-tissue", "chai-table", "golden-fan-bag", "forever-bouquet", "tulip-cream", "penguin", "tulip-bookmark", "owl-wall", "tissue-garden", "tulip-pink", "whale-keyring", "tooth-keepsake", "berry-keyring"];
    const visible = products.filter(p => (filter === "All pieces" || p.category === filter) && (p.name + " " + p.description).toLowerCase().includes(search.toLowerCase())).sort((a, b) => { const ai = shelfOrder.indexOf(a.id), bi = shelfOrder.indexOf(b.id); return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi); });
    async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setError(""); setBusy(true); const f = new FormData(e.currentTarget); if (!token.current)
        token.current = requestToken(); const data = { token: token.current, name: String(f.get("name")), contact: String(f.get("contact")), city: String(f.get("city")), country: String(f.get("country")), idea: String(f.get("idea")), colours: String(f.get("colours") || ""), budget: String(f.get("budget") || ""), deadline: String(f.get("deadline") || ""), items: picks.map(id => ({ id, quantity: Number(f.get("qty-" + id) || 1) })), consent: f.get("consent") === "on", website: String(f.get("website") || "") }; try {
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
    } }
    return <><a className="skip" href="#main">Skip to content</a><div className="notice">{settings.notice || "Crochet from Islamabad · Made personal"}</div><header className="header"><Link href="/" className="wordmark"><Mark /><span>PhotoCraftSquare<small>A crochet kind of lovely</small></span></Link><nav aria-label="Main navigation"><a href="/#collection">The collection</a><button onClick={() => plan("", "")}>Made for you</button><a href="/#colour-studio">Colour worktable</a><a href="/#maker">Our story</a></nav><button className="picks-button" onClick={() => { if (sent) {
        setSent("");
        token.current = "";
        setCopied(false);
    } setDrawer(true); }}>Your picks <span>{picks.length}</span></button></header><main id="main">
        {product ? <section className="product-detail wrap"><div className="breadcrumb"><Link href="/#collection">The collection</Link><span>/</span>{product.name}</div><div className="detail-grid"><ProductGallery product={product}/><div className="detail-copy"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="price">{money(product.price)}</p><p className="lead">{product.description}</p><dl><dt>Availability</dt><dd>{product.availability === "Enquire" ? "Ask about this piece" : product.availability}</dd><dt>Making / dispatch</dt><dd>{product.leadTime}</dd></dl><p>{product.details}</p><button className="button" disabled={product.availability === "Unavailable" || !settings.accepting} onClick={() => choose(product.id)}>Add to your enquiry <span>＋</span></button><button className="text-button" onClick={() => plan("I’m interested in " + product.name + " in a different colour. Please help me choose the yarn.", "", product.id)}>Make this more me ↗</button><div className="detail-note">We confirm the piece, price, delivery and timing before accepting an order. No payment is taken here.</div><details><summary>Delivery & making time</summary><p>{settings.shipping}</p></details></div></div></section> : <><StudioHero products={products} onCustom={() => plan("", "")}/><div className="stitched-strip"><span>Small joys, made by hand.</span><Flower /><span>A colour for every kind of you.</span><Flower /><span>From Islamabad, with love.</span></div><GiftFinder products={products} onPick={choose}/>
        <section className="collection wrap" id="collection"><div className="section-heading"><div><p className="eyebrow">THE STUDIO SHELF</p><h2>Go on. Pick your <em>favourite.</em></h2></div><p>Every piece starts with yarn.<br />What it becomes is the fun part.</p></div><div className="collection-controls"><div className="tabs" aria-label="Filter collection">{["All pieces", "For the home", "Little gifts", "Bags & accessories"].map(x => <button key={x} aria-pressed={filter === x} className={filter === x ? "active" : ""} onClick={() => setFilter(x)}>{x}</button>)}</div><input aria-label="Search pieces" placeholder="Find a piece…" value={search} onChange={e => setSearch(e.target.value)}/></div><div className="collection-count" aria-live="polite">{visible.length} pieces to get to know</div><div className="products">{visible.map((p, i) => <article className="product-card" key={p.id}><Link href={"/shop/" + p.id} className="product-image"><img src={p.image} alt={p.name + (p.styled ? " — styled presentation" : " — studio photograph")} loading="lazy" width="1254" height="1254"/><span className="product-index">{String(i + 1).padStart(2, "0")}</span><span className="view-piece">Meet this piece ↗</span></Link><div className="product-meta"><div><p className="eyebrow">{p.category}</p><h3><Link href={"/shop/" + p.id}>{p.name}</Link></h3><p>{money(p.price)}</p></div><button className="add-pick" aria-label={"Add " + p.name + " to your enquiry"} onClick={() => choose(p.id)} disabled={p.availability === "Unavailable" || !settings.accepting}>＋</button></div></article>)}</div>{!visible.length && <p className="empty">No pieces match yet. Try another collection or <button onClick={() => { setFilter("All pieces"); setSearch(""); }}>clear your search</button>.</p>}<p className="caption">Explore designs made by the studio. Current availability, yarn and price are confirmed with your enquiry. Styled images include original photographs for comparison.</p></section>{products.some(p => p.id === "chai-table") && <TableStudio onPlan={plan}/>}<section className="custom-invite wrap"><Flower /><div><p className="eyebrow">NOT QUITE WHAT YOU HAD IN MIND?</p><h2>Some lovely things<br />start with <em>“what if…”</em></h2></div><div><p>A favourite colour. A tiny inside joke. A gift for a person who’s impossible to shop for.</p><button className="button" onClick={() => plan("", "")}>Tell us your what-if <span>↗</span></button></div></section><section className="maker wrap" id="maker"><div><p className="eyebrow">OUR LITTLE STUDIO</p><h2>A small studio.<br />A big soft spot<br />for <em>handmade.</em></h2></div><div><p className="lead">PhotoCraftSquare is an Islamabad-based crochet practice, making pieces for homes, everyday use and thoughtful gifts.</p><p>From small pouches to coordinated table pieces, the work begins one stitch at a time. Explore an existing design or start a conversation about a custom piece.</p><a className="text-button" href="https://www.instagram.com/photocraftsquare/" target="_blank" rel="noopener noreferrer">See the making on Instagram ↗</a><div className="maker-line"><Mark /><span>Made by hand.<br />Made to be part of your day.</span></div></div></section></>}
    <section className="help wrap" id="help"><div><p className="eyebrow">BEFORE WE GET STITCHING</p><h2>A few useful things.</h2></div><div>{[["How do I order?", "Choose a piece and add it to your enquiry, or tell us about a custom idea. We confirm availability, the final price, delivery and timing before an order is accepted."], ["Can I choose my colours?", "Ask about the colours you have in mind. Yarn availability and the final design are confirmed with your quote."], ["Where do you deliver?", settings.shipping], ["What about changes or returns?", settings.returns], ["How is my request information used?", "Your name, contact and request details are stored so the studio can respond and manage your enquiry. We do not collect card details here. Please avoid including sensitive information. Contact the studio through Instagram for access or deletion requests."]].map(([q, a]) => <details key={q}><summary>{q}<span>＋</span></summary><p>{a}</p></details>)}</div></section>
    </main><footer><div className="footer-main"><Link href="/" className="wordmark"><Mark /><span>PhotoCraftSquare<small>Little things. Thoughtfully made.</small></span></Link><div><a href="/#collection">The collection</a><button onClick={() => plan("", "")}>Custom requests</button><a href="/#help">Ordering & privacy</a></div><div><a href="https://www.instagram.com/photocraftsquare/" target="_blank" rel="noopener noreferrer">Instagram ↗</a><Link href="/admin">The studio ↗</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} PhotoCraftSquare</span><span>Islamabad, Pakistan · One stitch at a time.</span></div></footer>
    {(drawer || custom) && <div className="overlay" onClick={e => { if (e.target === e.currentTarget) {
        setDrawer(false);
        setCustom(false);
    } }}><div className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabIndex={-1} ref={dialogRef}><button className="close" onClick={() => { setDrawer(false); setCustom(false); }} aria-label="Close enquiry">×</button><p className="eyebrow">{sent ? "SAVED WITH THE STUDIO" : custom ? "MADE FOR YOU" : "YOUR LITTLE COLLECTION"}</p><h2 id="drawer-title">{sent ? "A lovely start." : custom ? "Tell us your idea." : "Your picks."}</h2>{sent ? <div className="success" role="status"><p>Your request is saved. The studio can now review it and reply using the contact you provided.</p><p className="reference">Reference: {sent}</p><p>This is an enquiry, not a confirmed order. No payment has been taken.</p>{settings.whatsapp && <a className="button" target="_blank" rel="noopener noreferrer" href={"https://wa.me/" + settings.whatsapp + "?text=" + encodeURIComponent(summary.current)}>Continue on WhatsApp ↗</a>}<button className="text-button" onClick={async () => { try {
        await navigator.clipboard.writeText(summary.current);
        setCopied(true);
    }
    catch {
        setError("Copy isn’t available here. Please note your reference.");
    } }}>{copied ? "Summary copied" : "Copy request summary"}</button><button className="text-button" onClick={() => { setSent(""); token.current = ""; setDrawer(false); setCustom(false); }}>Back to the collection</button></div> : <><p>{custom ? "Colours, sizes, a special occasion—start with what you know." : "These pieces will be included in your request. You can ask about colours and details below."}</p><form onSubmit={submit}>{picks.map(id => { const p = products.find(p => p.id === id); return p && <div className="pick-row" key={id}><img src={p.image} alt="" width="72" height="72"/><div><b>{p.name}</b><p>{money(p.price)}</p><button type="button" className="text-button small" onClick={() => remove(id)}>Remove</button></div><label>Qty<input name={"qty-" + id} aria-label={"Quantity for " + p.name} type="number" min="1" max="50" defaultValue="1" required/></label></div>; })}<div className="form-grid"><label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={80}/></label><label>WhatsApp or email<input name="contact" required minLength={5} maxLength={150}/></label><label>Delivery city<input name="city" autoComplete="address-level2" required maxLength={100}/></label><label>Country<input name="country" autoComplete="country-name" defaultValue="Pakistan" required maxLength={80}/></label></div><label>Your idea / anything to know<textarea name="idea" required minLength={10} maxLength={2000} defaultValue={idea || (picks.length ? "I’m interested in these pieces. Please confirm the price and availability." : "")} placeholder="A piece, a size, a person or an occasion…" rows={4}/></label><label>Colours you have in mind <small>(optional)</small><input name="colours" maxLength={150} defaultValue={colours}/></label><div className="form-grid"><label>Budget in PKR <small>(optional)</small><input name="budget" maxLength={80} placeholder="Your comfortable range"/></label><label>Needed by <small>(optional)</small><input name="deadline" type="date" min={new Date().toISOString().slice(0, 10)}/></label></div><div className="trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div><label className="consent"><input name="consent" type="checkbox" required/><span>I agree to the studio using these details to respond to this request. <a href="/#help" onClick={() => { setDrawer(false); setCustom(false); }}>Ordering & privacy</a></span></label><p className="caption">Reference pictures can be shared when the studio replies. Requested dates depend on availability.</p><button className="button" disabled={busy || !settings.accepting}>{busy ? "Saving your request…" : settings.accepting ? "Send an enquiry ↗" : "Requests are paused"}</button><p className="caption">We confirm price, delivery and making time before accepting your order.</p></form></>}{error && <p role="alert" className="error">{error}</p>}</div></div>}</>;
}
