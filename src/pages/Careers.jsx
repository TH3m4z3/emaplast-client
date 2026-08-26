import { useLang } from "../hooks/useLang.js";
import { useFetch } from "../hooks/useFetch.js";
import { t } from "../i18n.js";
import { tField } from "../services/http.js";

export default function Careers() {
  const lang = useLang();
  const { data } = useFetch("/api/jobs");
  return (
    <div className="container section">
      <header className="page-hero"><h1 className="display">{t(lang, "careers")}</h1></header>
      {(data || []).map((j) => (
        <article className="card" key={j.id}>
          <h3>{tField(j, lang, "title")}</h3>
          <p className="muted">{tField(j, lang, "location")}</p>
          <p>{tField(j, lang, "description")}</p>
        </article>
      ))}
    </div>
  );
}
