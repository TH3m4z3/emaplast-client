import { Link } from "react-router-dom";
import { tField } from "../services/http.js";
import { t } from "../i18n.js";
import SafeImg from "./SafeImg.jsx";

export default function ProductCard({ p, lang }) {
  return (
    <Link className="card product-card" to={`/${lang}/products/${p.slug}`}>
      <div className="product-art">
        <SafeImg src={p.image_url} alt={p.sku || ""} />
        <span className="sku-chip">{p.sku}</span>
      </div>
      {p.status === "coming_soon" && <span className="badge">{t(lang, "comingSoon")}</span>}
      <h3>{tField(p, lang, "title")}</h3>
      <p className="muted">{p.dimension?.replace("x", " × ")} mm</p>
    </Link>
  );
}
