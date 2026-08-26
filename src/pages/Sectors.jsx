import { Link } from "react-router-dom";
import { useLang } from "../hooks/useLang.js";
import { useFetch } from "../hooks/useFetch.js";
import { t } from "../i18n.js";
import { tField } from "../services/http.js";

export default function Sectors() {
  const lang = useLang();
  const { data, err } = useFetch("/api/sectors");
  return (
    <div className="container section">
      <header className="page-hero">
        <p className="kicker">{t(lang, "navSectors")}</p>
        <h1 className="display">{lang === "fr" ? "Des palettes adaptées à chaque métier" : "Pallets tailored to each industry"}</h1>
      </header>
      {err && <p className="error">{lang === "fr" ? "Impossible de charger les secteurs." : "Could not load sectors."} {err}</p>}
      <div className="grid grid-3">
        {(data || []).map((s) => (
          <Link className="card sector-card" key={s.id} to={`/${lang}/sectors/${s.slug}`}>
            {s.image_url ? <img className="sector-thumb" src={s.image_url} alt="" /> : null}
            <h3>{tField(s, lang, "title")}</h3>
            <p className="muted">{tField(s, lang, "excerpt")}</p>
            <span className="link-arrow">{lang === "fr" ? "Explorer" : "Explore"} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
