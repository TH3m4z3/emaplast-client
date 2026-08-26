import { Link, useParams } from "react-router-dom";
import { useLang } from "../hooks/useLang.js";
import { useFetch } from "../hooks/useFetch.js";
import { t } from "../i18n.js";
import { tField } from "../services/http.js";
import { mediaUrl } from "../utils/image.js";

export default function ProductDetail() {
  const lang = useLang();
  const { slug } = useParams();
  const { data: p } = useFetch(`/api/products/${slug}`);
  if (!p) return <div className="container section">…</div>;
  return (
    <div className="container section">
      <div className="grid grid-2">
        <div className="card product-hero-card">
          <img src={mediaUrl(p.image_url)} alt={p.sku} />
        </div>
        <div>
          {p.status === "coming_soon" && <span className="badge">{t(lang, "comingSoon")}</span>}
          <p className="kicker">{p.sku}</p>
          <h1 className="display">{tField(p, lang, "title")}</h1>
          <p className="muted">{tField(p, lang, "description")}</p>
          <div className="chip-row" style={{ margin: "12px 0 16px" }}>
            {(p.uses_json || []).map((u) => (
              <Link key={u} className="chip" to={`/${lang}/products?use=${u}`}>{t(lang, `uses.${u}`)}</Link>
            ))}
          </div>
          <div className="hero-actions">
            <Link className="btn btn-primary" to={`/${lang}/quote?product=${p.sku}`}>{t(lang, "quote")}</Link>
            <Link className="btn btn-ghost" to={`/${lang}/rfid-demo`}>{t(lang, "rfidDemo")}</Link>
          </div>
        </div>
      </div>
      <h3>{t(lang, "specs")}</h3>
      <table className="compare-table">
        <tbody>
          {[
            ["SKU", p.sku],
            [lang === "fr" ? "Longueur" : "Length", `${p.length_mm} mm`],
            [lang === "fr" ? "Largeur" : "Width", `${p.width_mm} mm`],
            [lang === "fr" ? "Hauteur" : "Height", `${p.height_mm} mm`],
            [lang === "fr" ? "Poids moyen" : "Average weight", `${p.weight_kg} kg`],
            [t(lang, "loadStatic"), `${p.static_load} kg`],
            [t(lang, "loadDynamic"), `${p.dynamic_load} kg`],
            [t(lang, "loadRack"), p.rack_load ? `${p.rack_load} kg` : (lang === "fr" ? "Non rackable" : "Not rackable")],
            [lang === "fr" ? "Entrées" : "Entries", p.entries],
            [lang === "fr" ? "Matériaux" : "Materials", p.material],
            [lang === "fr" ? "Coloris" : "Colour", p.color],
          ].map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}
        </tbody>
      </table>
      <p className="muted" style={{ marginTop: 16 }}>
        {lang === "fr"
          ? "Charges selon une répartition uniforme sur le plateau, à environ +20 °C. Tests laboratoire ISO 8611."
          : "Loads for a uniformly distributed deck load at about +20 °C. ISO 8611 laboratory tests."}
      </p>
    </div>
  );
}
