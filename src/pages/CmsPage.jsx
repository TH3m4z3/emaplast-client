import { Link, useParams } from "react-router-dom";
import { useLang } from "../hooks/useLang.js";
import { useFetch } from "../hooks/useFetch.js";
import { t } from "../i18n.js";
import { tField } from "../services/http.js";
import Blocks from "../components/Blocks.jsx";

export default function CmsPage({ section }) {
  const lang = useLang();
  const { slug } = useParams();
  const { data: pages } = useFetch(`/api/pages?section=${section}`);
  const { data: page } = useFetch(slug ? `/api/pages/${section}/${slug}` : `/api/pages?section=${section}`);
  const current = slug ? page : (pages || [])[0];
  const base = section === "company" ? "company" : section === "smart" ? "smart-logistics" : section === "reborn" ? "reborn" : "legal";
  if (!current || Array.isArray(current)) {
    return (
      <div className="container section">
        <h1 className="display">{section === "smart" ? t(lang, "navSmart") : section === "reborn" ? "REBORN" : t(lang, "navCompany")}</h1>
        <div className="grid grid-2">
          {(pages || []).map((pg) => (
            <Link key={pg.id} className="card" to={`/${lang}/${base}/${pg.slug}`}>
              <h3>{tField(pg, lang, "title")}</h3>
              <p className="muted">{tField(pg, lang, "excerpt")}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="container section">
      <header className="page-hero">
        <h1 className="display">{tField(current, lang, "title")}</h1>
        <p className="lede">{tField(current, lang, "excerpt")}</p>
      </header>
      <Blocks content={lang === "en" ? current.content_en : current.content_fr} />
    </div>
  );
}
