import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLang } from "../hooks/useLang.js";
import { useFetch } from "../hooks/useFetch.js";
import { t } from "../i18n.js";
import { tField } from "../services/http.js";
import { formsService } from "../services/forms.service.js";

export default function FormPage({ type }) {
  const lang = useLang();
  const [params] = useSearchParams();
  const { data: products } = useFetch("/api/products");
  const { data: sectors } = useFetch("/api/sectors");
  const { data: settings } = useFetch("/api/settings");
  const s = (k) => settings?.[k]?.[lang] || settings?.[k]?.fr || "";
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "contact", message: "", sector: "",
    product: params.get("product") || "", quantity: "", job_title: "", need: "", preferred_date: "", volume: "", website: "",
  });
  const titles = { contact: t(lang, "contact"), quote: t(lang, "quote"), rfid_demo: t(lang, "rfidDemo"), reborn_study: t(lang, "rebornStudy") };

  async function submit(e) {
    e.preventDefault();
    await formsService.submit(type, form);
    setOk(true);
  }

  if (ok) return <div className="container section"><h1 className="display">{titles[type]}</h1><p>{t(lang, "sent")}</p></div>;

  return (
    <div className="container section">
      <header className="page-hero">
        <p className="kicker">EMAPLAST</p>
        <h1 className="display">{titles[type]}</h1>
        <p className="muted">{s("quote_delay") || (lang === "fr" ? "Devis sous 48 heures." : "Quote within 48 hours.")}</p>
      </header>
      <form className="form card" onSubmit={submit}>
        <input className="honeypot" name="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} tabIndex={-1} autoComplete="off" />
        <label>{t(lang, "name")}<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>{t(lang, "email")}<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        {type !== "contact" && <label>{t(lang, "phone")}<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>}
        {type === "contact" && (
          <>
            <label>{t(lang, "phone")}<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
            <label>{t(lang, "subject")}
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                <option value="contact">Contact</option>
                <option value="quote">{t(lang, "quote")}</option>
                <option value="rfid">{t(lang, "rfidDemo")}</option>
              </select>
            </label>
          </>
        )}
        {type === "quote" && (
          <>
            <label>{t(lang, "sector")}
              <select required value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })}>
                <option value="">—</option>
                {(sectors || []).map((s) => <option key={s.slug} value={s.slug}>{tField(s, lang, "title")}</option>)}
              </select>
            </label>
            <label>{t(lang, "product")}
              <select required value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
                <option value="">—</option>
                {(products || []).map((p) => <option key={p.sku} value={p.sku}>{p.sku}</option>)}
              </select>
            </label>
            <label>{t(lang, "qty")}<input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
          </>
        )}
        {type === "rfid_demo" && (
          <>
            <label>{t(lang, "jobTitle")}<input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} /></label>
            <label>{t(lang, "date")}<input type="date" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} /></label>
          </>
        )}
        {type === "reborn_study" && <label>{t(lang, "volume")}<input value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} /></label>}
        <label>{type === "rfid_demo" ? t(lang, "need") : t(lang, "message")}
          <textarea required={type === "quote" || undefined} value={type === "rfid_demo" ? form.need : form.message} onChange={(e) => setForm({ ...form, [type === "rfid_demo" ? "need" : "message"]: e.target.value })} />
        </label>
        <button className="btn btn-primary" type="submit">{t(lang, "send")}</button>
      </form>
      <aside className="card" style={{ marginTop: 24, maxWidth: 640 }}>
        <p className="kicker">{lang === "fr" ? "Coordonnées" : "Contact details"}</p>
        <p>{s("hq")}<br />{s("plant")}</p>
        <p>{s("phone")}<br />{s("mobile")}<br />{s("email")}{s("email_alt") ? <><br />{s("email_alt")}</> : null}</p>
      </aside>
    </div>
  );
}
