import { Link, useSearchParams } from "react-router-dom";
import { useLang } from "../hooks/useLang.js";
import { useFetch } from "../hooks/useFetch.js";
import { t } from "../i18n.js";
import ProductCard from "../components/ProductCard.jsx";

const SIZES = [
  ["1200x800", "1200 × 800 mm"],
  ["1200x1000", "1200 × 1000 mm"],
];

const MODELS = [
  ["ep-1208-s3", "EP 1208-S3"],
  ["ep-1210-p9", "EP 1210-P9"],
  ["ep-1210-sr3", "EP 1210-SR3"],
];

export default function Products() {
  const lang = useLang();
  const [params, setParams] = useSearchParams();
  const dimension = params.get("dimension") || "";
  const use = params.get("use") || "";
  const status = params.get("status") || "";
  const qs = params.toString();
  const { data } = useFetch(`/api/products${qs ? `?${qs}` : ""}`);
  const uses = t(lang, "uses");

  function setFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "status") next.delete("status");
    setParams(next);
  }

  return (
    <div className="container section">
      <header className="page-hero">
        <p className="kicker">{t(lang, "navProducts")}</p>
        <h1 className="display">{t(lang, "allPallets")}</h1>
        <p className="muted">
          {lang === "fr"
            ? "Filtrez par dimensions, usage ou modèle, comme dans le catalogue EMAPLAST."
            : "Filter by size, use or model, as in the EMAPLAST catalogue."}
        </p>
      </header>

      <div className="filter-groups">
        <div className="chip-row">
          <span className="chip-label">{t(lang, "bySize")}</span>
          <button type="button" className={`chip ${!dimension ? "is-on" : ""}`} onClick={() => setFilter("dimension", "")}>
            {lang === "fr" ? "Toutes" : "All"}
          </button>
          {SIZES.map(([id, label]) => (
            <button key={id} type="button" className={`chip ${dimension === id ? "is-on" : ""}`} onClick={() => setFilter("dimension", id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="chip-row">
          <span className="chip-label">{t(lang, "byUse")}</span>
          <button type="button" className={`chip ${!use ? "is-on" : ""}`} onClick={() => setFilter("use", "")}>
            {lang === "fr" ? "Tous" : "All"}
          </button>
          {Object.entries(uses).map(([id, label]) => (
            <button key={id} type="button" className={`chip ${use === id ? "is-on" : ""}`} onClick={() => setFilter("use", id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="chip-row">
          <span className="chip-label">{t(lang, "byModel")}</span>
          {MODELS.map(([slug, label]) => (
            <Link key={slug} className="chip" to={`/${lang}/products/${slug}`}>{label}</Link>
          ))}
          <button type="button" className={`chip ${status === "coming_soon" ? "is-on" : ""}`} onClick={() => setFilter("status", status === "coming_soon" ? "" : "coming_soon")}>
            {t(lang, "futureRefs")}
          </button>
        </div>
      </div>

      <div className="grid grid-3">
        {(data || []).map((p) => <ProductCard key={p.id} p={p} lang={lang} />)}
      </div>
      {data && data.length === 0 && (
        <p className="muted">{lang === "fr" ? "Aucune palette pour ce filtre." : "No pallet matches this filter."}</p>
      )}
    </div>
  );
}
