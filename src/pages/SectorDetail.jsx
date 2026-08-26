import { Link, useParams } from "react-router-dom";
import { useLang } from "../hooks/useLang.js";
import { useFetch } from "../hooks/useFetch.js";
import { t } from "../i18n.js";
import { tField } from "../services/http.js";
import ProductCard from "../components/ProductCard.jsx";

export default function SectorDetail() {
  const lang = useLang();
  const { slug } = useParams();
  const { data: s } = useFetch(`/api/sectors/${slug}`);
  if (!s) return <div className="container section">…</div>;
  const challenges = lang === "en" ? s.challenges_en : s.challenges_fr;
  const why = lang === "en" ? s.why_en : s.why_fr;
  return (
    <div className="container section journey">
      <header className="page-hero">
        <h1 className="display">{tField(s, lang, "title")}</h1>
      </header>
      {s.image_url ? <img className="sector-hero" src={s.image_url} alt="" /> : null}
      <article className="journey-block">
        <h2>1. {t(lang, "challenges")}</h2>
        <ul>{(challenges || []).map((c) => <li key={c}>{c}</li>)}</ul>
      </article>
      <article className="journey-block">
        <h2>2. {t(lang, "solutions")}</h2>
        <p>{tField(s, lang, "solutions")}</p>
        <div className="grid grid-3">{(s.products || []).map((p) => <ProductCard key={p.id} p={p} lang={lang} />)}</div>
        <Link className="btn btn-primary" to={`/${lang}/quote`}>{t(lang, "quote")}</Link>
      </article>
      <article className="journey-block">
        <h2>3. {t(lang, "connected")}</h2>
        <p>{tField(s, lang, "logistics")}</p>
        <Link className="btn btn-dark" to={`/${lang}/rfid-demo`}>{t(lang, "rfidDemo")}</Link>
      </article>
      <article className="journey-block">
        <h2>4. {t(lang, "circular")}</h2>
        <p>{tField(s, lang, "circular")}</p>
        <Link className="btn btn-primary" to={`/${lang}/reborn-study`}>{t(lang, "rebornStudy")}</Link>
      </article>
      <article className="journey-block">
        <h2>5. {t(lang, "why")} — {tField(s, lang, "title")}</h2>
        <ul>{(why || []).map((c) => <li key={c}>{c}</li>)}</ul>
        <Link className="btn btn-ghost" to={`/${lang}/contact`}>{t(lang, "contact")}</Link>
      </article>
    </div>
  );
}
