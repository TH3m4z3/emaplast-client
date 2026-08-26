import { useMemo, useState } from "react";
import { useLang } from "../hooks/useLang.js";
import { useFetch } from "../hooks/useFetch.js";
import { t } from "../i18n.js";
import ProductCard from "../components/ProductCard.jsx";

export default function FindPallet() {
  const lang = useLang();
  const { data: products } = useFetch("/api/products");
  const [form, setForm] = useState({ dimension: "", use: "", rfid: false, hygienic: false, nestable: false });
  const results = useMemo(() => (products || []).filter((p) => {
    if (form.dimension && p.dimension !== form.dimension) return false;
    if (form.use && !(p.uses_json || []).includes(form.use)) return false;
    if (form.rfid && !p.has_rfid) return false;
    if (form.hygienic && !p.hygienic) return false;
    if (form.nestable && !p.nestable) return false;
    return p.status === "published";
  }), [products, form]);

  return (
    <div className="container section">
      <header className="page-hero">
        <h1 className="display">{t(lang, "findPallet")}</h1>
      </header>
      <div className="grid grid-2">
        <form className="form card" onSubmit={(e) => e.preventDefault()}>
          <label>{t(lang, "bySize")}
            <select value={form.dimension} onChange={(e) => setForm({ ...form, dimension: e.target.value })}>
              <option value="">—</option>
              <option value="1200x800">1200 × 800</option>
              <option value="1200x1000">1200 × 1000</option>
            </select>
          </label>
          <label>{t(lang, "byUse")}
            <select value={form.use} onChange={(e) => setForm({ ...form, use: e.target.value })}>
              <option value="">—</option>
              {Object.entries(t(lang, "uses")).map(([k, lab]) => <option key={k} value={k}>{lab}</option>)}
            </select>
          </label>
          <label className="check"><input type="checkbox" checked={form.rfid} onChange={(e) => setForm({ ...form, rfid: e.target.checked })} /> RFID</label>
          <label className="check"><input type="checkbox" checked={form.hygienic} onChange={(e) => setForm({ ...form, hygienic: e.target.checked })} /> {t(lang, "uses.hygienic")}</label>
          <label className="check"><input type="checkbox" checked={form.nestable} onChange={(e) => setForm({ ...form, nestable: e.target.checked })} /> {lang === "fr" ? "Emboîtable" : "Nestable"}</label>
        </form>
        <div>
          <h3>{t(lang, "recommend")}</h3>
          {(results || []).map((p) => <ProductCard key={p.id} p={p} lang={lang} />)}
        </div>
      </div>
    </div>
  );
}
