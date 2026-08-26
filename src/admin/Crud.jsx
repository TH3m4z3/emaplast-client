import { useEffect, useState } from "react";
import { adminService } from "../services/admin.service.js";
import ImageUpload from "./ImageUpload.jsx";

const TITLES = {
  products: "Produits",
  sectors: "Secteurs",
  pages: "Pages",
  resources: "Ressources",
  news: "Actualités",
  faqs: "FAQ",
  jobs: "Carrières",
};

export default function Crud({ table, jsonFields = [] }) {
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState(null);
  const [q, setQ] = useState("");
  const load = () => adminService.list(table).then(setRows);
  useEffect(() => { load(); }, [table]);

  const visible = rows.filter((r) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return [r.sku, r.slug, r.title_fr, r.title_en, r.question_fr].join(" ").toLowerCase().includes(s);
  });

  async function save(e) {
    e.preventDefault();
    const payload = { ...edit };
    jsonFields.forEach((f) => {
      if (typeof payload[f] === "string") {
        try { payload[f] = JSON.parse(payload[f]); } catch { /* keep */ }
      }
    });
    if (edit.id) await adminService.update(table, edit.id, payload);
    else await adminService.create(table, payload);
    setEdit(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Supprimer cet élément ?")) return;
    await adminService.remove(table, id);
    load();
  }

  const fields = rows[0]
    ? Object.keys(rows[0]).filter((k) => !["id", "created_at", "updated_at", "documents"].includes(k))
    : ["slug", "title_fr", "title_en"];

  return (
    <div>
      <div className="admin-toolbar">
        <div className="filter-row">
          <input className="admin-search" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
          <p className="muted">{visible.length} élément{visible.length > 1 ? "s" : ""}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEdit({ published: 1 })}>Nouveau</button>
      </div>
      <table className="data">
        <thead><tr><th>ID</th><th>Libellé</th><th></th></tr></thead>
        <tbody>
          {visible.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.sku || r.slug || r.title_fr || r.question_fr || r.setting_key}</td>
              <td className="row-actions">
                <button className="btn btn-small" onClick={() => setEdit(stringifyJson(r, jsonFields))}>Modifier</button>
                <button className="btn btn-small" onClick={() => remove(r.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {edit && (
        <form className="form card" style={{ marginTop: 24 }} onSubmit={save}>
          <h3>{edit.id ? "Modifier" : "Nouveau"} — {TITLES[table] || table}</h3>
          {fields.map((f) => f === "image_url" ? (
            <ImageUpload key={f} label="Image" value={edit.image_url || ""} onChange={(image_url) => setEdit({ ...edit, image_url })} />
          ) : (
            <label key={f}>{f}
              <textarea rows={String(edit[f] || "").length > 80 ? 5 : 2} value={edit[f] ?? ""} onChange={(e) => setEdit({ ...edit, [f]: e.target.value })} />
            </label>
          ))}
          <div className="admin-toolbar">
            <button className="btn btn-primary" type="submit">Enregistrer</button>
            <button className="btn btn-ghost" type="button" onClick={() => setEdit(null)}>Annuler</button>
          </div>
        </form>
      )}
    </div>
  );
}

function stringifyJson(row, jsonFields) {
  const copy = { ...row };
  jsonFields.forEach((f) => {
    if (copy[f] != null && typeof copy[f] !== "string") copy[f] = JSON.stringify(copy[f], null, 2);
  });
  return copy;
}
