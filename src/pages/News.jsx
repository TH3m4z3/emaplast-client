import { Link, useParams } from "react-router-dom";
import { useLang } from "../hooks/useLang.js";
import { useFetch } from "../hooks/useFetch.js";
import { t } from "../i18n.js";
import { tField } from "../services/http.js";

export function News() {
  const lang = useLang();
  const { data } = useFetch("/api/news");
  return (
    <div className="container section">
      <header className="page-hero"><h1 className="display">{t(lang, "news")}</h1></header>
      <div className="grid grid-3">
        {(data || []).map((n) => (
          <Link key={n.id} className="card" to={`/${lang}/news/${n.slug}`}>
            <h3>{tField(n, lang, "title")}</h3>
            <p className="muted">{n.published_at}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function NewsDetail() {
  const lang = useLang();
  const { slug } = useParams();
  const { data: n } = useFetch(`/api/news/${slug}`);
  if (!n) return <div className="container section">…</div>;
  return (
    <div className="container section">
      <h1 className="display">{tField(n, lang, "title")}</h1>
      <p className="lede">{tField(n, lang, "body")}</p>
    </div>
  );
}
