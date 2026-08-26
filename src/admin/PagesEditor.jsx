import { useEffect, useState } from "react";
import { adminService } from "../services/admin.service.js";

const SECTIONS = [
  ["company", "Entreprise"],
  ["smart", "Smart Logistics"],
  ["reborn", "REBORN"],
  ["legal", "Légal"],
];

const EMPTY_PAGE = {
  section: "company",
  slug: "",
  title_fr: "",
  title_en: "",
  excerpt_fr: "",
  excerpt_en: "",
  seo_title_fr: "",
  seo_title_en: "",
  seo_desc_fr: "",
  seo_desc_en: "",
  published: 1,
  sort_order: 0,
  content_fr: [{ type: "p", text: "" }],
  content_en: [{ type: "p", text: "" }],
};

export default function PagesEditor() {
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState(null);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const load = () => adminService.list("pages").then(setRows);
  useEffect(() => { load(); }, []);

  const visible = rows.filter((r) => {
    if (filter !== "all" && r.section !== filter) return false;
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return [r.slug, r.title_fr, r.title_en].join(" ").toLowerCase().includes(s);
  });

  async function save(e) {
    e.preventDefault();
    const payload = {
      ...edit,
      published: edit.published ? 1 : 0,
      sort_order: Number(edit.sort_order) || 0,
      content_fr: Array.isArray(edit.content_fr) ? edit.content_fr : [],
      content_en: Array.isArray(edit.content_en) ? edit.content_en : [],
    };
    delete payload.id;
    if (edit.id) await adminService.update("pages", edit.id, payload);
    else await adminService.create("pages", payload);
    setEdit(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Supprimer cette page et tout son contenu ?")) return;
    await adminService.remove("pages", id);
    if (edit?.id === id) setEdit(null);
    load();
  }

  return (
    <div className="pages-editor">
      <div className="admin-toolbar">
        <div className="filter-row">
          <input className="admin-search" placeholder="Rechercher une page…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Toutes les sections</option>
            {SECTIONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
          <p className="muted">{visible.length} page{visible.length > 1 ? "s" : ""}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEdit({ ...EMPTY_PAGE })}>Nouvelle page</button>
      </div>

      <table className="data">
        <thead>
          <tr>
            <th>Section</th>
            <th>Slug</th>
            <th>Titre FR</th>
            <th>Publiée</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visible.map((r) => (
            <tr key={r.id} className={edit?.id === r.id ? "is-on" : ""}>
              <td>{SECTIONS.find(([id]) => id === r.section)?.[1] || r.section}</td>
              <td>{r.slug}</td>
              <td>{r.title_fr}</td>
              <td>{r.published ? "Oui" : "Non"}</td>
              <td className="row-actions">
                <button className="btn btn-small" onClick={() => setEdit(normalize(r))}>Modifier tout</button>
                <button className="btn btn-small" onClick={() => remove(r.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {edit && (
        <form className="form card page-form" onSubmit={save}>
          <h3>{edit.id ? "Modifier la page" : "Nouvelle page"}</h3>
          <div className="grid grid-2">
            <label>Section
              <select value={edit.section} onChange={(e) => setEdit({ ...edit, section: e.target.value })}>
                {SECTIONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </label>
            <label>Slug (URL)
              <input required value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value.trim().toLowerCase().replace(/\s+/g, "-") })} />
            </label>
            <label>Ordre
              <input type="number" value={edit.sort_order} onChange={(e) => setEdit({ ...edit, sort_order: e.target.value })} />
            </label>
            <label className="check">
              <input type="checkbox" checked={!!edit.published} onChange={(e) => setEdit({ ...edit, published: e.target.checked ? 1 : 0 })} />
              Page publiée
            </label>
          </div>

          <h4>Textes français</h4>
          <label>Titre FR<input required value={edit.title_fr} onChange={(e) => setEdit({ ...edit, title_fr: e.target.value })} /></label>
          <label>Chapô FR<textarea value={edit.excerpt_fr} onChange={(e) => setEdit({ ...edit, excerpt_fr: e.target.value })} /></label>
          <label>SEO titre FR<input value={edit.seo_title_fr || ""} onChange={(e) => setEdit({ ...edit, seo_title_fr: e.target.value })} /></label>
          <label>SEO description FR<textarea value={edit.seo_desc_fr || ""} onChange={(e) => setEdit({ ...edit, seo_desc_fr: e.target.value })} /></label>
          <BlockList
            label="Contenu FR"
            blocks={edit.content_fr}
            onChange={(content_fr) => setEdit({ ...edit, content_fr })}
          />

          <h4>English copy</h4>
          <label>Title EN<input required value={edit.title_en} onChange={(e) => setEdit({ ...edit, title_en: e.target.value })} /></label>
          <label>Intro EN<textarea value={edit.excerpt_en} onChange={(e) => setEdit({ ...edit, excerpt_en: e.target.value })} /></label>
          <label>SEO title EN<input value={edit.seo_title_en || ""} onChange={(e) => setEdit({ ...edit, seo_title_en: e.target.value })} /></label>
          <label>SEO description EN<textarea value={edit.seo_desc_en || ""} onChange={(e) => setEdit({ ...edit, seo_desc_en: e.target.value })} /></label>
          <BlockList
            label="Content EN"
            blocks={edit.content_en}
            onChange={(content_en) => setEdit({ ...edit, content_en })}
          />

          <div className="admin-toolbar">
            <button className="btn btn-primary" type="submit">Enregistrer toute la page</button>
            <button className="btn btn-ghost" type="button" onClick={() => setEdit(null)}>Annuler</button>
            {edit.id && <button className="btn btn-ghost" type="button" onClick={() => remove(edit.id)}>Supprimer la page</button>}
          </div>
        </form>
      )}
    </div>
  );
}

function normalize(row) {
  return {
    ...EMPTY_PAGE,
    ...row,
    published: row.published ? 1 : 0,
    content_fr: Array.isArray(row.content_fr) ? row.content_fr : [],
    content_en: Array.isArray(row.content_en) ? row.content_en : [],
  };
}

function BlockList({ label, blocks, onChange }) {
  const list = Array.isArray(blocks) ? blocks : [];

  function update(i, patch) {
    onChange(list.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  }
  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function add(type) {
    const block = type === "ul" || type === "ol" ? { type, items: [""] } : { type, text: "" };
    onChange([...list, block]);
  }

  return (
    <div className="block-editor">
      <div className="admin-toolbar">
        <b>{label}</b>
        <div className="row-actions">
          <button type="button" className="btn btn-small" onClick={() => add("h2")}>+ Titre</button>
          <button type="button" className="btn btn-small" onClick={() => add("p")}>+ Paragraphe</button>
          <button type="button" className="btn btn-small" onClick={() => add("ul")}>+ Liste</button>
          <button type="button" className="btn btn-small" onClick={() => add("ol")}>+ Liste numérotée</button>
        </div>
      </div>
      {list.map((b, i) => (
        <div className="block-card" key={i}>
          <div className="admin-toolbar">
            <select value={b.type} onChange={(e) => {
              const type = e.target.value;
              update(i, type === "ul" || type === "ol" ? { type, items: b.items || [b.text || ""] } : { type, text: b.text || (b.items || []).join("\n") });
            }}>
              <option value="h2">Titre</option>
              <option value="p">Paragraphe</option>
              <option value="ul">Liste</option>
              <option value="ol">Liste numérotée</option>
            </select>
            <div className="row-actions">
              <button type="button" className="btn btn-small" onClick={() => move(i, -1)}>↑</button>
              <button type="button" className="btn btn-small" onClick={() => move(i, 1)}>↓</button>
              <button type="button" className="btn btn-small" onClick={() => onChange(list.filter((_, idx) => idx !== i))}>Supprimer le bloc</button>
            </div>
          </div>
          {b.type === "ul" || b.type === "ol" ? (
            <textarea
              rows={4}
              placeholder="Une ligne = un élément"
              value={(b.items || []).join("\n")}
              onChange={(e) => update(i, { items: e.target.value.split("\n") })}
            />
          ) : (
            <textarea
              rows={b.type === "h2" ? 2 : 4}
              value={b.text || ""}
              onChange={(e) => update(i, { text: e.target.value })}
            />
          )}
        </div>
      ))}
    </div>
  );
}
