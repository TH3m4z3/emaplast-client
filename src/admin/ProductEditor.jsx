import { useEffect, useMemo, useState } from "react";
import { adminService } from "../services/admin.service.js";
import ImageUpload from "./ImageUpload.jsx";

const USES = [
  ["lightweight-export", "Légères et export"],
  ["industrial", "Industrielles"],
  ["heavy-duty", "Charges lourdes"],
  ["racking", "Rack et automatisation"],
  ["hygienic", "Hygiéniques"],
  ["rfid", "Intelligentes RFID"],
];

const EMPTY = {
  slug: "",
  sku: "",
  status: "published",
  dimension: "1200x800",
  uses_json: [],
  has_rfid: 0,
  hygienic: 0,
  nestable: 0,
  weight_kg: "",
  static_load: "",
  dynamic_load: "",
  rack_load: "",
  length_mm: 1200,
  width_mm: 800,
  height_mm: "",
  entries: 4,
  material: "Polyéthylène et polypropylène",
  color: "Standard : gris foncé ou noir",
  title_fr: "",
  title_en: "",
  excerpt_fr: "",
  excerpt_en: "",
  description_fr: "",
  description_en: "",
  image_url: "",
  sort_order: 0,
};

export default function ProductEditor() {
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState(null);
  const [q, setQ] = useState("");
  const load = () => adminService.list("products").then(setRows);
  useEffect(() => { load(); }, []);

  const visible = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.sku, r.slug, r.title_fr, r.title_en, r.dimension].join(" ").toLowerCase().includes(s)
    );
  }, [rows, q]);

  async function save(e) {
    e.preventDefault();
    const payload = {
      ...edit,
      has_rfid: edit.has_rfid ? 1 : 0,
      hygienic: edit.hygienic ? 1 : 0,
      nestable: edit.nestable ? 1 : 0,
      uses_json: Array.isArray(edit.uses_json) ? edit.uses_json : [],
      weight_kg: Number(edit.weight_kg) || 0,
      static_load: Number(edit.static_load) || 0,
      dynamic_load: Number(edit.dynamic_load) || 0,
      rack_load: Number(edit.rack_load) || 0,
      length_mm: Number(edit.length_mm) || 0,
      width_mm: Number(edit.width_mm) || 0,
      height_mm: Number(edit.height_mm) || 0,
      entries: Number(edit.entries) || 4,
      sort_order: Number(edit.sort_order) || 0,
    };
    delete payload.id;
    delete payload.documents;
    delete payload.created_at;
    delete payload.updated_at;
    if (edit.id) await adminService.update("products", edit.id, payload);
    else await adminService.create("products", payload);
    setEdit(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Supprimer ce produit du site ?")) return;
    await adminService.remove("products", id);
    if (edit?.id === id) setEdit(null);
    load();
  }

  function toggleUse(id) {
    const cur = Array.isArray(edit.uses_json) ? edit.uses_json : [];
    setEdit({ ...edit, uses_json: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div className="filter-row">
          <input
            className="admin-search"
            placeholder="Rechercher un produit (SKU, titre, slug…)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <p className="muted">{visible.length} produit{visible.length > 1 ? "s" : ""}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEdit({ ...EMPTY })}>Nouveau produit</button>
      </div>

      <table className="data">
        <thead>
          <tr>
            <th></th>
            <th>SKU</th>
            <th>Titre FR</th>
            <th>Dimensions</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visible.map((r) => (
            <tr key={r.id} className={edit?.id === r.id ? "is-on" : ""}>
              <td>{r.image_url ? <img className="thumb" src={r.image_url} alt="" /> : "—"}</td>
              <td>{r.sku}</td>
              <td>{r.title_fr}</td>
              <td>{r.dimension?.replace("x", " × ")}</td>
              <td>{r.status === "published" ? "Publié" : "Bientôt"}</td>
              <td className="row-actions">
                <button className="btn btn-small" type="button" onClick={() => setEdit(normalize(r))}>Modifier</button>
                <button className="btn btn-small" type="button" onClick={() => remove(r.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {edit && (
        <form className="form card page-form" onSubmit={save}>
          <h3>{edit.id ? `Modifier ${edit.sku || "le produit"}` : "Nouveau produit"}</h3>
          <div className="grid grid-2">
            <label>SKU / modèle<input required value={edit.sku} onChange={(e) => setEdit({ ...edit, sku: e.target.value })} /></label>
            <label>Slug (URL)
              <input required value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value.trim().toLowerCase().replace(/\s+/g, "-") })} />
            </label>
            <label>Statut
              <select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
                <option value="published">Publié (visible sur le site)</option>
                <option value="coming_soon">Bientôt disponible</option>
              </select>
            </label>
            <label>Dimensions (L × l)
              <select value={edit.dimension} onChange={(e) => {
                const dimension = e.target.value;
                const [length_mm, width_mm] = dimension.split("x").map(Number);
                setEdit({ ...edit, dimension, length_mm, width_mm });
              }}>
                <option value="1200x800">1200 × 800 mm</option>
                <option value="1200x1000">1200 × 1000 mm</option>
              </select>
            </label>
            <label>Ordre d’affichage<input type="number" value={edit.sort_order} onChange={(e) => setEdit({ ...edit, sort_order: e.target.value })} /></label>
          </div>
          <ImageUpload label="Photo du produit" value={edit.image_url} onChange={(image_url) => setEdit({ ...edit, image_url })} />

          <p className="chip-label">Usages (filtres du catalogue)</p>
          <div className="chip-row">
            {USES.map(([id, label]) => (
              <button type="button" key={id} className={`chip ${(edit.uses_json || []).includes(id) ? "is-on" : ""}`} onClick={() => toggleUse(id)}>
                {label}
              </button>
            ))}
          </div>
          <div className="chip-row" style={{ marginTop: 8 }}>
            <label className="check"><input type="checkbox" checked={!!edit.has_rfid} onChange={(e) => setEdit({ ...edit, has_rfid: e.target.checked ? 1 : 0 })} /> RFID</label>
            <label className="check"><input type="checkbox" checked={!!edit.hygienic} onChange={(e) => setEdit({ ...edit, hygienic: e.target.checked ? 1 : 0 })} /> Hygiénique</label>
            <label className="check"><input type="checkbox" checked={!!edit.nestable} onChange={(e) => setEdit({ ...edit, nestable: e.target.checked ? 1 : 0 })} /> Emboîtable</label>
          </div>

          <h4>Charges et cotes</h4>
          <div className="grid grid-2">
            <label>Poids (kg)<input type="number" step="0.1" value={edit.weight_kg} onChange={(e) => setEdit({ ...edit, weight_kg: e.target.value })} /></label>
            <label>Charge statique (kg)<input type="number" value={edit.static_load} onChange={(e) => setEdit({ ...edit, static_load: e.target.value })} /></label>
            <label>Charge dynamique (kg)<input type="number" value={edit.dynamic_load} onChange={(e) => setEdit({ ...edit, dynamic_load: e.target.value })} /></label>
            <label>Charge rack (kg, 0 = non rackable)<input type="number" value={edit.rack_load} onChange={(e) => setEdit({ ...edit, rack_load: e.target.value })} /></label>
            <label>Hauteur (mm)<input type="number" value={edit.height_mm} onChange={(e) => setEdit({ ...edit, height_mm: e.target.value })} /></label>
            <label>Entrées<input type="number" value={edit.entries} onChange={(e) => setEdit({ ...edit, entries: e.target.value })} /></label>
            <label>Matière<input value={edit.material} onChange={(e) => setEdit({ ...edit, material: e.target.value })} /></label>
            <label>Coloris<input value={edit.color} onChange={(e) => setEdit({ ...edit, color: e.target.value })} /></label>
          </div>

          <h4>Textes français</h4>
          <label>Titre FR<input required value={edit.title_fr} onChange={(e) => setEdit({ ...edit, title_fr: e.target.value })} /></label>
          <label>Chapô FR<textarea value={edit.excerpt_fr} onChange={(e) => setEdit({ ...edit, excerpt_fr: e.target.value })} /></label>
          <label>Description FR<textarea value={edit.description_fr} onChange={(e) => setEdit({ ...edit, description_fr: e.target.value })} /></label>

          <h4>English copy</h4>
          <label>Title EN<input required value={edit.title_en} onChange={(e) => setEdit({ ...edit, title_en: e.target.value })} /></label>
          <label>Intro EN<textarea value={edit.excerpt_en} onChange={(e) => setEdit({ ...edit, excerpt_en: e.target.value })} /></label>
          <label>Description EN<textarea value={edit.description_en} onChange={(e) => setEdit({ ...edit, description_en: e.target.value })} /></label>

          <div className="admin-toolbar">
            <button className="btn btn-primary" type="submit">Enregistrer le produit</button>
            <button className="btn btn-ghost" type="button" onClick={() => setEdit(null)}>Annuler</button>
            {edit.id && <button className="btn btn-ghost" type="button" onClick={() => remove(edit.id)}>Supprimer</button>}
          </div>
        </form>
      )}
    </div>
  );
}

function normalize(row) {
  return {
    ...EMPTY,
    ...row,
    uses_json: Array.isArray(row.uses_json) ? row.uses_json : [],
    has_rfid: row.has_rfid ? 1 : 0,
    hygienic: row.hygienic ? 1 : 0,
    nestable: row.nestable ? 1 : 0,
  };
}
