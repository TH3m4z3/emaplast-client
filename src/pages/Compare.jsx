import { useState } from "react";
import { useLang } from "../hooks/useLang.js";
import { useFetch } from "../hooks/useFetch.js";
import { t } from "../i18n.js";

export default function Compare() {
  const lang = useLang();
  const { data: products } = useFetch("/api/products");
  const [ids, setIds] = useState([]);
  const selected = (products || []).filter((p) => ids.includes(p.id));
  const toggle = (id) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < 4 ? [...cur, id] : cur));
  return (
    <div className="container section">
      <header className="page-hero">
        <h1 className="display">{t(lang, "compare")}</h1>
        <p className="lede">{t(lang, "select2")}</p>
      </header>
      <div className="grid grid-3">
        {(products || []).map((p) => (
          <button key={p.id} className={`card selectable ${ids.includes(p.id) ? "is-on" : ""}`} onClick={() => toggle(p.id)} type="button">
            {ids.includes(p.id) ? "✓ " : ""}{p.sku}
          </button>
        ))}
      </div>
      {selected.length >= 2 && (
        <table className="compare-table">
          <thead><tr><th></th>{selected.map((p) => <th key={p.id}>{p.sku}</th>)}</tr></thead>
          <tbody>
            {["dimension", "weight_kg", "static_load", "dynamic_load", "rack_load", "has_rfid"].map((k) => (
              <tr key={k}><th>{k}</th>{selected.map((p) => <td key={p.id}>{String(p[k])}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
