import { Link } from "react-router-dom";
import { useLang } from "../hooks/useLang.js";
import { useFetch } from "../hooks/useFetch.js";
import { t } from "../i18n.js";
import { tField } from "../services/http.js";
import ProductCard from "../components/ProductCard.jsx";

const VALUES = {
  fr: [
    ["Satisfaction client", "Fabriquer des palettes est notre métier ; apporter de la valeur à votre chaîne logistique est notre objectif, dans une relation de confiance."],
    ["Engagement environnemental", "Palettes 100 % recyclables. EMAPLAST reprend le parc en fin de vie et fabrique son propre compound, aux charges comparables à la matière vierge."],
    ["Stabilité et fiabilité", "Tests de charge en laboratoire (ISO 8611). Palettes conçues pour un large éventail d’applications dans toute la chaîne d’approvisionnement."],
  ],
  en: [
    ["Customer satisfaction", "Making pallets is our craft; adding value to your logistics chain is the goal, in a lasting partnership of trust."],
    ["Environmental commitment", "Pallets are 100% recyclable. EMAPLAST takes back end-of-life fleets and produces its own compound, with loads comparable to virgin material."],
    ["Stability and reliability", "Laboratory load tests (ISO 8611). Pallets designed for a wide range of supply-chain applications."],
  ],
};

const ADVANTAGES = {
  fr: ["Grande qualité à prix réduit", "Manipulation aisée et sans risque", "Économie d’espace et de temps", "Résistance aux intempéries", "Longue durée de vie", "Délais de livraison très courts", "Reprise en fin de vie", "Hygiène alimentaire"],
  en: ["High quality at a fair price", "Easy, safe handling", "Space and time savings", "Weather resistance", "Long service life", "Very short lead times", "End-of-life take-back", "Food-hygiene compliant"],
};

export default function Home({ settings }) {
  const lang = useLang();
  const { data: products } = useFetch("/api/products");
  const { data: sectors } = useFetch("/api/sectors");
  const s = (k) => settings?.[k]?.[lang] || settings?.[k]?.fr || "";
  const title = s("hero_title") || (lang === "fr" ? "Le fabricant algérien de palettes en plastique" : "The Algerian plastic pallet manufacturer");
  const subtitle = s("hero_subtitle") || (lang === "fr"
    ? "Injection, RFID et économie circulaire REBORN pour l’industrie et la grande distribution."
    : "Injection moulding, RFID and the REBORN circular programme for industry and retail.");

  return (
    <>
      <section className="hero">
        <img className="hero-photo" src="/brand/hero.jpg" alt="" />
        <div className="hero-shade" />
        <div className="container hero-inner">
          <p className="kicker">{lang === "fr" ? "PERFORMANCE · EFFICACITÉ · RENTABILITÉ" : "PERFORMANCE · EFFICIENCY · PROFITABILITY"}</p>
          <h1>{title}</h1>
          <p className="lede">{subtitle}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to={`/${lang}/products/find`}>{t(lang, "findPallet")}</Link>
            <Link className="btn btn-ghost light" to={`/${lang}/quote`}>{t(lang, "quote")}</Link>
            <Link className="btn btn-ghost light" to={`/${lang}/rfid-demo`}>{t(lang, "rfidDemo")}</Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container stats-row">
          <div><b>{(products || []).filter((p) => p.status === "published").length || "—"}</b><span>{lang === "fr" ? "références phares" : "flagship models"}</span></div>
          <div><b>{(sectors || []).length || "—"}</b><span>{lang === "fr" ? "secteurs accompagnés" : "sectors served"}</span></div>
          <div><b>100%</b><span>{lang === "fr" ? "recyclables" : "recyclable"}</span></div>
          <div><b>M’sila</b><span>{lang === "fr" ? "usine algérienne" : "Algerian plant"}</span></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="kicker">{t(lang, "navProducts")}</p>
            <h2>{lang === "fr" ? "Une gamme pensée pour vos flux" : "A range built around your flows"}</h2>
          </div>
          <div className="grid grid-3">
            {(products || []).filter((p) => p.status === "published").map((p) => (
              <ProductCard key={p.id} p={p} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      <section className="split">
        <img src="/brand/pallets.jpg" alt="Usine EMAPLAST" />
        <div className="split-copy">
          <p className="kicker">{lang === "fr" ? "L’usine" : "The plant"}</p>
          <h2>{lang === "fr" ? "Technologie de pointe, à M’sila" : "Advanced manufacturing in M’sila"}</h2>
          <p>
            {lang === "fr"
              ? "Injection, contrôle qualité et personnalisation (couleur, logo, RFID) pour des palettes adaptées à l’industrie et à la grande distribution."
              : "Injection moulding, quality control and customisation (colour, logo, RFID) for industry and retail."}
          </p>
          <Link className="btn btn-primary" to={`/${lang}/company/notre-usine`}>{t(lang, "readMore")}</Link>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <div className="section-head">
            <p className="kicker">{t(lang, "navSectors")}</p>
            <h2>{lang === "fr" ? "Des solutions par métier" : "Solutions by industry"}</h2>
          </div>
          <div className="grid grid-3">
            {(sectors || []).slice(0, 6).map((sct) => (
              <Link key={sct.id} className="card sector-card" to={`/${lang}/sectors/${sct.slug}`}>
                <h3>{tField(sct, lang, "title")}</h3>
                <p className="muted">{tField(sct, lang, "excerpt")}</p>
                <span className="link-arrow">{lang === "fr" ? "Voir le secteur" : "View sector"} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="kicker">{lang === "fr" ? "Nos atouts" : "Why EMAPLAST"}</p>
            <h2>{lang === "fr" ? "Une grande qualité, un partenariat durable" : "High quality, lasting partnership"}</h2>
          </div>
          <div className="grid grid-3">
            {VALUES[lang].map(([title, text]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p className="muted">{text}</p>
              </article>
            ))}
          </div>
          <ul className="chips">
            {ADVANTAGES[lang].map((a) => <li key={a}>{a}</li>)}
          </ul>
        </div>
      </section>

      <section className="cta-photo">
        <img src="/brand/plant.jpg" alt="" />
        <div className="container cta-copy">
          <h2>REBORN</h2>
          <p>{lang === "fr" ? "Reprise, valorisation, compound. Un cycle aussi important que le catalogue." : "Take-back, recovery, compound — as important as the catalogue."}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to={`/${lang}/reborn`}>{t(lang, "readMore")}</Link>
            <Link className="btn btn-ghost light" to={`/${lang}/reborn-study`}>{t(lang, "rebornStudy")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
