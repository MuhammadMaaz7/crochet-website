"use client";
import ProductPhoto from "../product-photo";
import { useEffect, useState } from "react";
import { defaults, statuses, categories, Product, Settings } from "../../lib/catalog";
type Row = {
    id: string;
    data: {
        kind?: "product"|"custom";
        contactMethod?: "email"|"whatsapp";
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
export default function AdminUI() {
    const [tab, setTab] = useState("Requests"), [products, setProducts] = useState<Product[]>([]), [settings, setSettings] = useState<Settings | null>(null), [rows, setRows] = useState<Row[]>([]), [edit, setEdit] = useState<Product | null>(null), [message, setMessage] = useState(""), [error, setError] = useState(""), [busy, setBusy] = useState(false), [filter, setFilter] = useState("all");
    async function load() { try {
        const r = await fetch("/api/admin", { cache: "no-store" });
        const d = await r.json() as {
            error?: string;
            products: Product[];
            settings: Settings;
            requests: Row[];
            path: string;
        };
        if (!r.ok)
            throw Error(d.error);
        setProducts(d.products);
        setSettings(d.settings);
        setRows(d.requests);
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Could not load the studio.");
    } }
    useEffect(() => { load(); }, []);
    async function save(type: string, data: unknown) { setBusy(true); setError(""); setMessage(""); try {
        const r = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, data }) });
        const d = await r.json() as {
            error?: string;
            products: Product[];
            settings: Settings;
            requests: Row[];
            path: string;
        };
        if (!r.ok)
            throw Error(d.error);
        setMessage("Saved.");
        await load();
        return true;
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Could not save.");
        return false;
    }
    finally {
        setBusy(false);
    } }
    async function upload(f: File) { setBusy(true); setError(""); try {
        const b = new FormData();
        b.set("photo", f);
        const r = await fetch("/api/media", { method: "POST", body: b });
        const d = await r.json() as {
            error?: string;
            products: Product[];
            settings: Settings;
            requests: Row[];
            path: string;
        };
        if (!r.ok)
            throw Error(d.error);
        setEdit(p => p ? { ...p, image: d.path, reference: undefined, gallery: undefined, styled: false } : p);
        setMessage("Photo uploaded. Save the piece to use it.");
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed.");
    }
    finally {
        setBusy(false);
    } }
    return <div className="admin"><header className="admin-header"><a href="/" className="wordmark">PhotoCraftSquare <small>The studio</small></a><a href="/" className="text-button">View the shop ↗</a></header><main className="wrap"><div className="section-heading"><div><p className="eyebrow">YOUR WORKTABLE</p><h1>A little order<br />behind the <em>lovely.</em></h1></div><p>Manage pieces and customer requests.<br />Payment is always verified separately.</p></div><nav className="tabs admin-tabs">{["Requests", "Pieces", "Shop settings"].map(t => <button key={t} className={tab === t ? "active" : ""} aria-pressed={tab === t} onClick={() => { setTab(t); setMessage(""); setError(""); }}>{t}{t === "Requests" ? " (" + rows.filter(r => r.status === "new").length + ")" : ""}</button>)}</nav>{error && <p className="error" role="alert">{error}</p>}{message && <p className="saved" role="status">{message}</p>}
    {tab === "Requests" && <section><div className="admin-toolbar"><label>Show requests<select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All statuses</option>{statuses.map(s => <option key={s}>{s}</option>)}</select></label><button className="text-button" onClick={load}>Refresh</button></div>{rows.filter(r => filter === "all" || r.status === filter).map(r => <article className="request-card" key={r.id}><div className="request-heading"><div><span className="request-kind">{r.data.kind==="custom"||!r.data.items.length?"Custom piece":"Product order"}</span><span className="eyebrow">{new Date(r.created).toLocaleDateString("en-PK")}</span><h2>{r.data.name}</h2><p>{r.data.city}, {r.data.country}</p></div><span className="status">{r.status}</span></div><p><b>{r.data.contactMethod==="email"?"Reply by email:":r.data.contactMethod==="whatsapp"?"Reply on WhatsApp:":"Contact:"}</b> {r.data.contact}</p><p>{r.data.idea}</p>{r.data.items.length > 0 && <ul>{r.data.items.map(i => <li key={i.id}>{i.name} × {i.quantity}</li>)}</ul>}<p>Colours: {r.data.colours || "Not specified"} · Budget: {r.data.budget || "Not specified"} · Needed by: {r.data.deadline || "Flexible"}</p><details><summary>Reference</summary><p className="reference">{r.id}</p></details><form className="request-actions" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); save("request", { id: r.id, status: f.get("status"), quote: f.get("quote") ? Number(f.get("quote")) : null, payment: f.get("payment") }); }}><label>Status<select name="status" defaultValue={r.status}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label><label>Agreed total · PKR<input name="quote" type="number" min="0" max="10000000" defaultValue={r.quote ?? ""}/></label><label>Payment<select name="payment" defaultValue={r.payment}><option value="pending">Pending / not verified</option><option value="verified">Manually verified</option></select></label><button className="button" disabled={busy}>Save request</button></form><p className="caption">Only mark payment verified after checking the actual payment. A quote includes any agreed delivery charge.</p></article>)}{!rows.filter(r => filter === "all" || r.status === filter).length && <div className="empty">No requests here yet. New order requests will appear after they are saved through the shop.</div>}</section>}
    {tab === "Pieces" && <section><div className="admin-toolbar"><p>{products.length} pieces · Drafts are hidden from the shop</p><button className="button" onClick={() => setEdit({ ...defaults[0], id: "", name: "", description: "", details: "", image: "/assets/tulip-cream.webp", reference: undefined, published: false, styled: false })}>Add a piece ＋</button></div><div className="admin-products">{products.map(p => <button key={p.id} className="admin-product" onClick={() => setEdit(p)}><ProductPhoto src={p.image} alt="" width="110" height="110" sizes="110px" loading="lazy"/><span><b>{p.name}</b><small>{p.published ? "Published" : "Draft"} · {p.price === null ? "Price on enquiry" : "PKR " + p.price.toLocaleString()}</small></span><span>Edit</span></button>)}</div>{edit && <form className="edit-form" onSubmit={async (e) => { e.preventDefault(); if (await save("product", edit))
        setEdit(null); }}><div className="section-heading"><h2>{edit.id ? "Edit this piece" : "A new piece"}</h2><button type="button" className="text-button" onClick={() => setEdit(null)}>Close editor</button></div><div className="form-grid"><label>Product code<input required pattern="[a-z0-9-]{1,60}" value={edit.id} readOnly={products.some(p => p.id === edit.id)} onChange={e => setEdit({ ...edit, id: e.target.value })} placeholder="e.g. tulip-pouch-blue"/></label><label>Name<input required value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} maxLength={100}/></label><label>Collection<select value={edit.category} onChange={e => setEdit({ ...edit, category: e.target.value as Product["category"] })}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Starting price in PKR · leave blank for custom quote<input type="number" min="1" max="1000000" value={edit.price ?? ""} onChange={e => setEdit({ ...edit, price: e.target.value ? Number(e.target.value) : null })}/></label><label>Availability<select value={edit.availability} onChange={e => setEdit({ ...edit, availability: e.target.value as Product["availability"] })}>{["Enquire", "Made to order", "Ready to ship", "Unavailable"].map(c => <option key={c}>{c}</option>)}</select></label><label>Making / dispatch estimate<input value={edit.leadTime} onChange={e => setEdit({ ...edit, leadTime: e.target.value })} maxLength={100}/></label></div><label>Description<textarea required minLength={10} maxLength={2000} rows={4} value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })}/></label><label>Dimensions, material, care & inclusions<textarea maxLength={1000} rows={3} value={edit.details} onChange={e => setEdit({ ...edit, details: e.target.value })}/></label><label>Photo upload · JPG, PNG or WebP under 5 MB<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { if (e.target.files?.[0])
        upload(e.target.files[0]); }}/></label><p className="caption">Upload product-only images with location metadata removed. Uploaded photos may appear publicly when the shop is launched.</p><ProductPhoto className="edit-preview" src={edit.image} alt="Selected product preview" sizes="180px"/><label>Or choose a studio image<select value={edit.image} onChange={e => setEdit({ ...edit, image: e.target.value })}>{!defaults.some(p => p.image === edit.image) && <option value={edit.image}>Uploaded image</option>}{defaults.map(p => <option key={p.id} value={p.image}>{p.name}</option>)}</select></label><label className="consent"><input type="checkbox" checked={edit.styled} onChange={e => setEdit({ ...edit, styled: e.target.checked })}/>Label this image as a styled concept</label><label className="consent"><input type="checkbox" checked={edit.published} onChange={e => setEdit({ ...edit, published: e.target.checked })}/>Publish this piece in the shop</label><button className="button" disabled={busy}>Save piece</button></form>}</section>}
    {tab === "Shop settings" && settings && <form className="edit-form" onSubmit={e => { e.preventDefault(); save("settings", settings); }}><h2>The useful details.</h2><label>WhatsApp number · international format, digits only<input placeholder="923…" value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} pattern="^$|[1-9][0-9]{7,14}"/></label><p className="caption">Leave blank until you are ready. A regular WhatsApp account works. This number becomes public through the direct shop chat link and saved-request link. No chat access or automatic messages are connected.</p><label>Shop announcement<input value={settings.notice} onChange={e => setSettings({ ...settings, notice: e.target.value })} maxLength={250}/></label><label>Delivery & making-time information<textarea required minLength={10} maxLength={1500} rows={5} value={settings.shipping} onChange={e => setSettings({ ...settings, shipping: e.target.value })}/></label><label>Cancellation, changes & returns information<textarea required minLength={10} maxLength={1500} rows={5} value={settings.returns} onChange={e => setSettings({ ...settings, returns: e.target.value })}/></label><label className="consent"><input type="checkbox" checked={settings.accepting} onChange={e => setSettings({ ...settings, accepting: e.target.checked })}/>Accept new enquiries</label><button className="button" disabled={busy}>Save shop settings</button></form>}</main><footer className="admin-foot">PhotoCraftSquare studio · Customer details are private.</footer></div>;
}
