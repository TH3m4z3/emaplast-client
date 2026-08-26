import { useLang } from "../hooks/useLang.js";
import { useFetch } from "../hooks/useFetch.js";
import { t } from "../i18n.js";
import { tField } from "../services/http.js";

export default function Faq() {
  const lang = useLang();
  const { data } = useFetch("/api/faqs");
  return (
    <div className="container section">
      <header className="page-hero"><h1 className="display">{t(lang, "faq")}</h1></header>
      {(data || []).map((f) => (
        <details className="card faq-item" key={f.id}>
          <summary>{tField(f, lang, "question")}</summary>
          <p>{tField(f, lang, "answer")}</p>
        </details>
      ))}
    </div>
  );
}
