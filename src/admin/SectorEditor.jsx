import { useEffect, useMemo, useState } from "react";
import { adminService } from "../services/admin.service.js";
import ImageUpload from "./ImageUpload.jsx";

const EMPTY = {
  slug: "",
  title_fr: "",
  title_en: "",
  excerpt_fr: "",
  excerpt_en: "",
  challenges_fr: [""],
  challenges_en: [""],
  solutions_fr: "",
  solutions_en: "",
  product_slugs: [],
  logistics_fr: "",
  logistics_en: "",
  circular_fr: "",
  circular_en: "",
  why_fr: ["", "", ""],
  why_en: ["", "", ""],
  image_url: "",
  published: 1,
  sort_order: 0,
};

export default function SectorEditor() {
  const [rows, setRows] = useState([]);
  const [products, setProducts] = useState([]);
  const [edit, setEdit] = useState(null);
  const [q, setQ] = useState("");
  const load = () => {
    adminService.list("sectors").then(setRows);
    adminService.list("products").then(setProducts);
  };
  useEffect(() => { load(); }, []);

  const visible = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.slug, r.title_fr, r.title_en, r.excerpt_fr].join(" ").toLowerCase().includes(s)
    );
  }, [rows, q]);

  async function save(e) {
    e.preventDefault();
    const payload = {
      ...edit,
      published: edit.published ? 1 : 0,
      sort_order: Number(edit.sort_order) || 0,
      challenges_fr: cleanList(edit.challenges_fr),
      challenges_en: cleanList(edit.challenges_en),
      why_fr: cleanList(edit.why_fr),
      why_en: cleanList(edit.why_en),
      product_slugs: Array.isArray(edit.product_slugs) ? edit.product_slugs : [],
    };
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    if (edit.id) await adminService.update("sectors", edit.id, payload);
    else await adminService.create("sectors", payload);
    setEdit(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Supprimer ce secteur du site ?")) return;
    await adminService.remove("sectors", id);
    if (edit?.id === id) setEdit(null);
    load();
  }

  function toggleProduct(slug) {
    const cur = Array.isArray(edit.product_slugs) ? edit.product_slugs : [];
    setEdit({ ...edit, product_slugs: cur.includes(slug) ? cur.filter((x) => x !== slug) : [...cur, slug] });
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div className="filter-row">
          <input
            className="admin-search"
            placeholder="Rechercher un secteur…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <p className="muted">{visible.length} secteur{visible.length > 1 ? "s" : ""}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEdit({ ...EMPTY })}>Nouveau secteur</button>
      </div>

      <table className="data">
        <thead>
          <tr>
            <th>Titre FR</th>
            <th>Slug</th>
            <th>Palettes</th>
            <th>Publié</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visible.map((r) => (
            <tr key={r.id} className={edit?.id === r.id ? "is-on" : ""}>
              <td>{r.title_fr}</td>
              <td>{r.slug}</td>
              <td>{(r.product_slugs || []).length}</td>
              <td>{r.published ? "Oui" : "Non"}</td>
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
          <h3>{edit.id ? `Modifier ${edit.title_fr || "le secteur"}` : "Nouveau secteur"}</h3>
          <div className="grid grid-2">
            <label>Titre FR<input required value={edit.title_fr} onChange={(e) => setEdit({ ...edit, title_fr: e.target.value })} /></label>
            <label>Title EN<input required value={edit.title_en} onChange={(e) => setEdit({ ...edit, title_en: e.target.value })} /></label>
            <label>Slug (URL)
              <input required value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value.trim().toLowerCase().replace(/\s+/g, "-") })} />
            </label>
            <label>Ordre<input type="number" value={edit.sort_order} onChange={(e) => setEdit({ ...edit, sort_order: e.target.value })} /></label>
            <label className="check">
              <input type="checkbox" checked={!!edit.published} onChange={(e) => setEdit({ ...edit, published: e.target.checked ? 1 : 0 })} />
              Secteur publié
            </label>
          </div>
          <ImageUpload label="Image du secteur" value={edit.image_url} onChange={(image_url) => setEdit({ ...edit, image_url })} />
          <label>Chapô FR<textarea value={edit.excerpt_fr} onChange={(e) => setEdit({ ...edit, excerpt_fr: e.target.value })} /></label>
          <label>Intro EN<textarea value={edit.excerpt_en} onChange={(e) => setEdit({ ...edit, excerpt_en: e.target.value })} /></label>

          <h4>1. Enjeux du secteur</h4>
          <label>Enjeux FR (une ligne = un point)<textarea value={(edit.challenges_fr || []).join("\n")} onChange={(e) => setEdit({ ...edit, challenges_fr: e.target.value.split("\n") })} /></label>
          <label>Challenges EN<textarea value={(edit.challenges_en || []).join("\n")} onChange={(e) => setEdit({ ...edit, challenges_en: e.target.value.split("\n") })} /></label>

          <h4>2. Solutions EMAPLAST recommandées</h4>
          <label>Texte FR<textarea value={edit.solutions_fr} onChange={(e) => setEdit({ ...edit, solutions_fr: e.target.value })} /></label>
          <label>Text EN<textarea value={edit.solutions_en} onChange={(e) => setEdit({ ...edit, solutions_en: e.target.value })} /></label>
          <p className="chip-label">Palettes affichées sur la page secteur</p>
          <div className="chip-row">
            {products.map((p) => (
              <button type="button" key={p.slug} className={`chip ${(edit.product_slugs || []).includes(p.slug) ? "is-on" : ""}`} onClick={() => toggleProduct(p.slug)}>
                {p.sku}
              </button>
            ))}
          </div>

          <h4>3. Logistique connectée</h4>
          <label>Texte FR<textarea value={edit.logistics_fr} onChange={(e) => setEdit({ ...edit, logistics_fr: e.target.value })} /></label>
          <label>Text EN<textarea value={edit.logistics_en} onChange={(e) => setEdit({ ...edit, logistics_en: e.target.value })} /></label>

          <h4>4. Valeur circulaire / REBORN</h4>
          <label>Texte FR<textarea value={edit.circular_fr} onChange={(e) => setEdit({ ...edit, circular_fr: e.target.value })} /></label>
          <label>Text EN<textarea value={edit.circular_en} onChange={(e) => setEdit({ ...edit, circular_en: e.target.value })} /></label>

          <h4>5. Pourquoi EMAPLAST</h4>
          <label>Preuves FR (une ligne = un point)<textarea value={(edit.why_fr || []).join("\n")} onChange={(e) => setEdit({ ...edit, why_fr: e.target.value.split("\n") })} /></label>
          <label>Proof points EN<textarea value={(edit.why_en || []).join("\n")} onChange={(e) => setEdit({ ...edit, why_en: e.target.value.split("\n") })} /></label>

          <div className="admin-toolbar">
            <button className="btn btn-primary" type="submit">Enregistrer le secteur</button>
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
    published: row.published ? 1 : 0,
    challenges_fr: Array.isArray(row.challenges_fr) ? row.challenges_fr : [],
    challenges_en: Array.isArray(row.challenges_en) ? row.challenges_en : [],
    product_slugs: Array.isArray(row.product_slugs) ? row.product_slugs : [],
    why_fr: Array.isArray(row.why_fr) ? row.why_fr : [],
    why_en: Array.isArray(row.why_en) ? row.why_en : [],
  };
}

function cleanList(value) {
  return (Array.isArray(value) ? value : String(value || "").split("\n"))
    .map((x) => String(x).trim())
    .filter(Boolean);
}
