import { Link, useParams, useSearchParams } from "react-router-dom";
import { useLang } from "../hooks/useLang.js";
import { useFetch } from "../hooks/useFetch.js";
import { t } from "../i18n.js";
import { tField } from "../services/http.js";

export function Resources() {
  const lang = useLang();
  const [params] = useSearchParams();
  const type = params.get("type") || "";
  const { data } = useFetch(`/api/resources${type ? `?type=${type}` : ""}`);
  return (
    <div className="container section">
      <header className="page-hero"><h1 className="display">{t(lang, "navResources")}</h1></header>
      <div className="grid grid-3">
        {(data || []).map((r) => (
          <Link key={r.id} className="card" to={`/${lang}/resources/${r.slug}`}>
            <span className="badge">{t(lang, `resourceTypes.${r.type}`)}</span>
            <h3>{tField(r, lang, "title")}</h3>
            <p className="muted">{tField(r, lang, "excerpt")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ResourceDetail() {
  const lang = useLang();
  const { slug } = useParams();
  const { data: r } = useFetch(`/api/resources/${slug}`);
  if (!r) return <div className="container section">…</div>;
  return (
    <div className="container section">
      <h1 className="display">{tField(r, lang, "title")}</h1>
      <p className="lede">{tField(r, lang, "body")}</p>
      {r.file_url && (
        <a className="btn btn-primary" href={r.file_url} target="_blank" rel="noreferrer">
          {lang === "fr" ? "Télécharger le PDF" : "Download PDF"}
        </a>
      )}
    </div>
  );
}
