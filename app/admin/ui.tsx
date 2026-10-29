"use client";
import "./workbench.css";
import ProductPhoto from "../product-photo";
import { useEffect, useRef, useState } from "react";
import { ShoppingBag, Package, SlidersHorizontal, Search, Plus, ArrowUpRight, ArrowLeft, Check, RefreshCw, X, Inbox, ImagePlus, Save } from "lucide-react";
import { defaults, statuses, categories, type Product, type Settings } from "../../lib/catalog";
export type RequestRow = {
    id: string;
    data: {
        kind?: "product" | "custom";
        contactMethod?: "email" | "whatsapp";
        name: string;
        contact: string;
        city: string;
        country: string;
        idea: string;
        colours: string;
        budget: string;
        deadline: string;
        items: {
            id: string;
            name: string;
            quantity: number;
        }[];
    };
    status: string;
    quote: number | null;
    payment: string;
    created: string;
};
export type AdminData = {
    products: Product[];
    settings: Settings;
    requests: RequestRow[];
};
type Tab = "Orders" | "Products" | "Settings";
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const money = (n: number | null) => n === null ? "Custom quote" : `PKR ${n.toLocaleString("en-PK")}`;
const date = (s: string) => new Date(s).toLocaleDateString("en-PK", { day: "numeric", month: "short" });
export default function AdminUI({ initialData }: {
    initialData?: AdminData;
} = {}) {
    const [data, setData] = useState<AdminData | null>(initialData || null), [tab, setTab] = useState<Tab>("Orders"), [query, setQuery] = useState(""), [filter, setFilter] = useState("all"), [selected, setSelected] = useState<string | null>(null), [edit, setEdit] = useState<Product | null>(null), [existing, setExisting] = useState(false), [settings, setSettings] = useState<Settings | null>(initialData?.settings || null), [busy, setBusy] = useState(false), [loading, setLoading] = useState(!initialData), [error, setError] = useState(""), [message, setMessage] = useState(""), [dirty, setDirty] = useState(false), [leave, setLeave] = useState<(() => void) | null>(null);
    const heading = useRef<HTMLHeadingElement>(null);
    async function load() { setLoading(true); setError(""); try {
        const r = await fetch("/api/admin", { cache: "no-store" });
        if (!r.ok)
            throw Error(r.status === 403 ? "Your session has expired. Reopen admin to sign in again." : "We couldn’t load your shop. Please try again.");
        const d = await r.json() as AdminData;
        setData(d);
        setSettings(d.settings);
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Could not load your shop.");
    }
    finally {
        setLoading(false);
    } }
    useEffect(() => { if (!initialData)
        void load(); }, [initialData]);
    useEffect(() => { if (!dirty)
        return; const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; }; window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);
    function navigate(action: () => void) { if (dirty) {
        setLeave(() => action);
        return;
    } action(); }
    function changeTab(t: Tab) { navigate(() => { setTab(t); setQuery(""); setFilter("all"); setEdit(null); setSelected(null); setSettings(data?.settings || null); setMessage(""); setError(""); heading.current?.focus(); }); }
    async function save(type: string, value: unknown) { setBusy(true); setError(""); setMessage(""); try {
        const r = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, data: value }) });
        const d = await r.json() as {
            error?: string;
        };
        if (!r.ok)
            throw Error(d.error || "Could not save. Your changes are still here.");
        setDirty(false);
        await load();
        setMessage(type === "product" ? "Product saved. Your shop is up to date." : type === "settings" ? "Shop settings saved." : "Order updated.");
        return true;
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Could not save. Please try again.");
        return false;
    }
    finally {
        setBusy(false);
    } }
    function updateProduct(p: Partial<Product>) { setEdit(e => e ? { ...e, ...p } : null); setDirty(true); }
    async function upload(f: File) { if (f.size > 5 * 1024 * 1024) {
        setError("Choose a JPG, PNG or WebP smaller than 5 MB.");
        return;
    } setBusy(true); setError(""); try {
        const form = new FormData();
        form.set("photo", f);
        const r = await fetch("/api/media", { method: "POST", body: form });
        const d = await r.json() as {
            error?: string;
            path: string;
        };
        if (!r.ok)
            throw Error(d.error || "Upload failed. Try a smaller image.");
        updateProduct({ image: d.path, reference: undefined, gallery: undefined, styled: false });
        setMessage("Photo uploaded. Save the product to apply it.");
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed.");
    }
    finally {
        setBusy(false);
    } }
    const rows = data?.requests || [], products = data?.products || [];
    const newCount = rows.filter(r => r.status === "new").length;
    const making = rows.filter(r => r.status === "making").length;
    const filtered = rows.filter(r => (filter === "all" || r.status === filter) && `${r.data.name} ${r.data.contact} ${r.data.items.map(i => i.name).join(" ")} ${r.id}`.toLowerCase().includes(query.toLowerCase()));
    const visibleProducts = products.filter(p => (filter === "all" || (filter === "published" ? p.published : !p.published)) && `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
    const order = rows.find(r => r.id === selected);
    function newProduct() { navigate(() => { setExisting(false); setEdit({ ...defaults[0], id: "", name: "", description: "", details: "", price: null, image: "", gallery: undefined, reference: undefined, published: false, styled: false }); setDirty(false); setMessage(""); }); }
    return <div className="workbench"><aside className="wb-sidebar"><a href="/" className="wb-brand">PhotoCraft<span>Square</span><small>THE MAKER’S DESK</small></a><p className="wb-nav-label">YOUR SHOP</p><nav aria-label="Shop management">{([{ name: "Orders", icon: ShoppingBag }, { name: "Products", icon: Package }, { name: "Settings", icon: SlidersHorizontal }] as const).map(({ name, icon: Icon }) => <button key={name} aria-current={tab === name ? "page" : undefined} onClick={() => changeTab(name)} disabled={busy}><Icon size={19}/><span>{name}</span>{name === "Orders" && newCount > 0 && <b>{newCount}</b>}</button>)}</nav><div className="wb-sidebar-note"><span className="wb-live-dot"/> Your private workspace<p>Small batches.<br />Lovely things.</p><a href="/" target="_blank" rel="noreferrer">Visit your shop <ArrowUpRight size={16}/></a></div></aside>
 <div className="wb-body"><header className="wb-topbar"><span>PhotoCraftSquare <i>/</i> {tab}</span><a href="/" target="_blank" rel="noreferrer">View shop <ArrowUpRight size={16}/></a></header><main className="wb-main"><div className="wb-page-heading"><div><p className="wb-kicker">THE MAKER’S DESK</p><h1 ref={heading} tabIndex={-1}>{tab === "Orders" ? "A little order, a lot of lovely." : tab === "Products" ? (edit ? edit.id ? "Make it just right." : "Something new, handmade." : "Your handmade collection.") : "The details that make it yours."}</h1><p>{tab === "Orders" ? "Every lovely piece starts with a conversation." : tab === "Products" ? "Keep your pieces, photos and prices looking their best." : "Set how customers reach you and what they need to know."}</p></div>{tab === "Products" && !edit && <button className="wb-primary" onClick={newProduct} disabled={busy}><Plus size={18}/> Add product</button>}</div>
 {error && <div className="wb-alert wb-error" role="alert">{error}<button onClick={() => setError("")} aria-label="Dismiss error"><X size={16}/></button></div>}{message && <div className="wb-alert wb-success" role="status"><Check size={18}/>{message}<button onClick={() => setMessage("")} aria-label="Dismiss notification"><X size={16}/></button></div>}
 {leave && <div className="wb-discard" role="alert"><div><b>You have unsaved changes.</b><p>Save them first, or discard to continue.</p></div><button className="wb-secondary" onClick={() => setLeave(null)}>Keep editing</button><button className="wb-danger" onClick={() => { setDirty(false); leave(); setLeave(null); }}>Discard changes</button></div>}
 {loading && !data ? <div className="wb-loading" aria-busy="true" aria-label="Loading your shop"><div /><div /><div /></div> : !data ? <div className="wb-empty"><Inbox /><h2>Your shop couldn’t load.</h2><button className="wb-primary" onClick={load}>Try again</button></div> : <>
 {tab === "Orders" && <><div className="wb-stats"><div><span>New enquiries</span><strong>{newCount}</strong><small>Ready for your reply</small></div><div><span>On the worktable</span><strong>{making}</strong><small>Pieces in the making</small></div><div><span>Total requests</span><strong>{rows.length}</strong><small>Latest 200 enquiries</small></div></div><section className="wb-panel"><div className="wb-panel-heading"><div><h2>Your order inbox <span>{rows.length}</span></h2><p>Review a request, agree the details, then start making.</p></div><button className="wb-icon-button" disabled={loading || busy} aria-label="Refresh orders" onClick={() => navigate(() => { void load(); })}><RefreshCw size={18}/></button></div><div className="wb-tools"><label className="wb-search"><Search size={18}/><span className="sr-only">Search orders</span><input placeholder="Search name or product…" value={query} onChange={e => setQuery(e.target.value)}/></label><label className="wb-filter"><span className="sr-only">Filter orders by status</span><select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All statuses</option>{statuses.map(s => <option key={s} value={s}>{title(s)}</option>)}</select></label></div><div className="wb-inbox-layout"><div className="wb-order-list">{filtered.map(r => <button key={r.id} className={`wb-order-row ${selected === r.id ? "is-selected" : ""}`} aria-pressed={selected === r.id} onClick={() => navigate(() => setSelected(r.id))}><div className="wb-avatar">{r.data.name.slice(0, 1).toUpperCase()}</div><div className="wb-order-title"><b>{r.data.name}</b><span>{r.data.kind === "custom" || !r.data.items.length ? "Custom piece" : r.data.items.map(i => `${i.name} × ${i.quantity}`).join(", ")}</span><small>{r.data.city} · {date(r.created)}</small></div><span className={`wb-status status-${r.status}`}>{title(r.status)}</span></button>)}{!filtered.length && <div className="wb-empty"><Inbox size={32}/><h3>{rows.length ? "No matching orders" : "Room for something lovely."}</h3><p>{rows.length ? "Try another name or status." : "New customer enquiries will appear here. Share your shop to start the conversation."}</p>{!rows.length && <a href="/" target="_blank" rel="noreferrer" className="wb-secondary">Open your shop <ArrowUpRight size={16}/></a>}</div>}</div>{order ? <section className="wb-order-detail" aria-label={`Order from ${order.data.name}`}><div className="wb-detail-heading"><div><p className="wb-kicker">{order.data.kind === "custom" ? "CUSTOM REQUEST" : "ORDER REQUEST"}</p><h2>{order.data.name}</h2><p>{order.data.city}, {order.data.country}</p></div><button className="wb-icon-button" aria-label="Close order details" onClick={() => navigate(() => setSelected(null))}><X size={20}/></button></div><div className="wb-contact"><small>{order.data.contactMethod === "whatsapp" ? "WhatsApp contact" : "Customer contact"}</small><b>{order.data.contact}</b></div>{order.data.idea && <div className="wb-brief"><h3>The idea</h3><p>{order.data.idea}</p></div>}{order.data.items.length > 0 && <ul className="wb-items">{order.data.items.map(i => <li key={i.id}><span>{i.name}</span><b>× {i.quantity}</b></li>)}</ul>}<dl className="wb-order-facts"><div><dt>Colours</dt><dd>{order.data.colours || "To discuss"}</dd></div><div><dt>Budget</dt><dd>{order.data.budget || "To discuss"}</dd></div><div><dt>Needed by</dt><dd>{order.data.deadline || "Flexible"}</dd></div></dl><form key={`${order.id}-${order.status}-${order.quote}-${order.payment}`} className="wb-form" onChange={() => setDirty(true)} onSubmit={async (e) => { e.preventDefault(); const f = new FormData(e.currentTarget); await save("request", { id: order.id, status: f.get("status"), quote: f.get("quote") ? Number(f.get("quote")) : null, payment: f.get("payment") }); }}><label>Order stage<select name="status" defaultValue={order.status}>{statuses.map(s => <option value={s} key={s}>{title(s)}</option>)}</select></label><label>Agreed total <span>PKR, including agreed delivery</span><input name="quote" type="number" inputMode="numeric" min="0" max="10000000" step="1" defaultValue={order.quote ?? ""} placeholder="Not quoted yet"/></label><label>Payment<select name="payment" defaultValue={order.payment}><option value="pending">Not verified</option><option value="verified">Manually verified</option></select></label><p className="wb-help">Mark payment verified only after checking the actual payment.</p><button className="wb-primary" disabled={busy}><Save size={17}/>{busy ? "Saving…" : "Save order"}</button></form><details className="wb-reference"><summary>Request reference</summary><code>{order.id}</code></details></section> : filtered.length > 0 && <div className="wb-select-prompt"><ShoppingBag size={30}/><h3>A closer look.</h3><p>Select an enquiry to see the details<br />and update its progress.</p></div>}</div></section></>}
 {tab === "Products" && !edit && <section><div className="wb-tools wb-product-tools"><label className="wb-search"><Search size={18}/><span className="sr-only">Search products</span><input placeholder="Find a product…" value={query} onChange={e => setQuery(e.target.value)}/></label><div className="wb-segments" aria-label="Product visibility">{["all", "published", "draft"].map(f => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{title(f)}{f === "all" ? ` (${products.length})` : ""}</button>)}</div></div><div className="wb-products">{visibleProducts.map(p => <button className="wb-product" key={p.id} onClick={() => { setExisting(true); setEdit(structuredClone(p)); setDirty(false); setMessage(""); }}><div className="wb-product-image"><ProductPhoto src={p.image} alt={p.name} sizes="(max-width: 600px) 43vw, 230px" loading="lazy"/><span className={`wb-status ${p.published ? "status-published" : "status-draft"}`}>{p.published ? "Published" : "Draft"}</span></div><div className="wb-product-info"><small>{p.category}</small><h2>{p.name}</h2><p>{money(p.price)}<span>Edit product</span></p></div></button>)}</div>{!visibleProducts.length && <div className="wb-empty"><Package size={32}/><h3>No products found.</h3><p>Try another search or visibility filter.</p></div>}</section>}
 {tab === "Products" && edit && <form className="wb-editor wb-form" onSubmit={async (e) => { e.preventDefault(); if (!existing && products.some(p => p.id === edit.id)) {
            setError("That product code is already in use. Choose a different code.");
            return;
        } if (!edit.image) {
            setError("Add a product photo before saving.");
            return;
        } if (await save("product", edit))
            setEdit(null); }}><div className="wb-editor-top"><button type="button" className="wb-link-button" disabled={busy} onClick={() => navigate(() => { setEdit(null); setMessage(""); })}><ArrowLeft size={17}/> All products</button><span className="wb-help">{dirty ? "Unsaved changes" : "Changes appear after saving"}</span></div><div className="wb-editor-grid"><div className="wb-editor-fields"><section className="wb-panel wb-field-section"><h2>The product</h2><p>Give customers the details they need to choose.</p><label>Product name<input required maxLength={100} value={edit.name} onChange={e => updateProduct({ name: e.target.value })} placeholder="e.g. Jasmine wrist gajra"/></label><div className="wb-two-fields"><label>Collection<select value={edit.category} onChange={e => updateProduct({ category: e.target.value as Product["category"] })}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Starting price · PKR<input type="number" inputMode="numeric" min="1" max="1000000" step="1" value={edit.price ?? ""} onChange={e => updateProduct({ price: e.target.value ? Number(e.target.value) : null })} placeholder="Leave blank for a quote"/></label></div><label>Description<textarea required minLength={10} maxLength={2000} rows={4} value={edit.description} onChange={e => updateProduct({ description: e.target.value })} placeholder="What makes this piece special?"/></label><label>Size, materials & care<textarea maxLength={1000} rows={3} value={edit.details} onChange={e => updateProduct({ details: e.target.value })} placeholder="Include dimensions, what’s included and care instructions."/></label><label>Product code <span>{existing ? "Permanent shop link" : "Lowercase letters, numbers and hyphens"}</span><input required pattern="[a-z0-9-]{1,60}" readOnly={existing} value={edit.id} onChange={e => updateProduct({ id: e.target.value })} placeholder="jasmine-wrist-gajra"/></label></section><section className="wb-panel wb-field-section"><h2>Availability</h2><div className="wb-two-fields"><label>Order availability<select value={edit.availability} onChange={e => updateProduct({ availability: e.target.value as Product["availability"] })}>{["Enquire", "Made to order", "Ready to ship", "Unavailable"].map(s => <option key={s}>{s}</option>)}</select></label><label>Making / dispatch time<input maxLength={100} value={edit.leadTime} onChange={e => updateProduct({ leadTime: e.target.value })} placeholder="e.g. Made in 5–7 days"/></label></div></section></div><aside className="wb-editor-aside"><section className="wb-panel wb-field-section"><h2>Product photo</h2><div className="wb-photo-preview">{edit.image ? <ProductPhoto src={edit.image} alt="Product photo preview" sizes="320px"/> : <div><ImagePlus size={38}/><p>A lovely photo starts here.</p></div>}</div><label className="wb-upload"><ImagePlus size={18}/> Choose a photo<input type="file" disabled={busy} accept="image/jpeg,image/png,image/webp" onChange={e => { if (e.target.files?.[0])
            void upload(e.target.files[0]); e.target.value = ""; }}/></label><p className="wb-help">JPG, PNG or WebP · up to 5 MB. Use a product-only photo with location metadata removed.</p><label>Or use a collection photo<select value={edit.image} onChange={e => updateProduct({ image: e.target.value, reference: undefined, gallery: undefined })}><option value="">Choose a photo</option>{edit.image && !defaults.some(p => p.image === edit.image) && <option value={edit.image}>Uploaded photo</option>}{defaults.map(p => <option key={p.id} value={p.image}>{p.name}</option>)}</select></label><label className="wb-check"><input type="checkbox" checked={edit.styled} onChange={e => updateProduct({ styled: e.target.checked })}/><span>Label as a styled concept</span></label></section><section className="wb-panel wb-field-section"><h2>Shop visibility</h2><label className="wb-check"><input type="checkbox" checked={edit.published} onChange={e => updateProduct({ published: e.target.checked })}/><span>Show this product in the shop<small>Turn off to keep it as a private draft.</small></span></label></section></aside></div><div className="wb-savebar"><span>{dirty ? "You have unsaved changes" : "Ready when you are"}</span><button type="button" className="wb-secondary" disabled={busy} onClick={() => navigate(() => setEdit(null))}>Cancel</button><button className="wb-primary" disabled={busy}><Save size={17}/>{busy ? "Saving…" : "Save product"}</button></div></form>}
 {tab === "Settings" && settings && <form className="wb-form wb-settings" onSubmit={async (e) => { e.preventDefault(); await save("settings", settings); }} onChange={() => setDirty(true)}><section className="wb-panel wb-field-section"><div className="wb-settings-title"><span>01</span><div><h2>Keep the conversation going.</h2><p>Choose where customers can reach you.</p></div></div><label>WhatsApp number<input inputMode="tel" placeholder="923001234567" pattern="^$|[1-9][0-9]{7,14}" value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}/></label><p className="wb-help">Use country code 92, without +, spaces or the first 0. A regular WhatsApp account works. This number becomes public; your chats stay private. Leave blank to hide the chat link.</p><label>Shop announcement<input maxLength={250} value={settings.notice} onChange={e => setSettings({ ...settings, notice: e.target.value })} placeholder="A small update for your customers"/></label></section><section className="wb-panel wb-field-section"><div className="wb-settings-title"><span>02</span><div><h2>Set clear expectations.</h2><p>A little clarity makes ordering easier.</p></div></div><label>Delivery & making times<textarea required minLength={10} maxLength={1500} rows={5} value={settings.shipping} onChange={e => setSettings({ ...settings, shipping: e.target.value })}/></label><label>Changes, cancellations & returns<textarea required minLength={10} maxLength={1500} rows={5} value={settings.returns} onChange={e => setSettings({ ...settings, returns: e.target.value })}/></label></section><section className="wb-panel wb-field-section"><h2>Open for lovely things?</h2><label className="wb-check"><input type="checkbox" checked={settings.accepting} onChange={e => setSettings({ ...settings, accepting: e.target.checked })}/><span>Accept new enquiries<small>Pause when your worktable is full. Existing requests stay saved.</small></span></label></section><div className="wb-savebar"><span>{dirty ? "Unsaved changes" : "Your shop, your pace."}</span><button className="wb-primary" disabled={busy || !dirty}><Save size={17}/>{busy ? "Saving…" : "Save settings"}</button></div></form>}
 </>}<footer className="wb-footer">Made with care. Managed by you.<span>Customer details stay in your private admin.</span></footer></main></div></div>;
}
