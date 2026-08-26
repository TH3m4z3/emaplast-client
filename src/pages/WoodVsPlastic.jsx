import { useLang } from "../hooks/useLang.js";
import { t } from "../i18n.js";

export default function WoodVsPlastic() {
  const lang = useLang();
  const rows = lang === "fr"
    ? [["NIMP 15", "Oui", "Non"], ["Humidité", "Absorbe", "Inerte"], ["Hygiène", "Poreux", "Lavable"], ["Durée de vie", "Courte", "Longue"], ["Reprise", "Limitée", "REBORN"]]
    : [["ISPM 15", "Yes", "No"], ["Moisture", "Absorbs", "Inert"], ["Hygiene", "Porous", "Washable"], ["Service life", "Short", "Long"], ["Take-back", "Limited", "REBORN"]];
  return (
    <div className="container section">
      <header className="page-hero"><h1 className="display">{t(lang, "woodVs")}</h1></header>
      <table className="compare-table">
        <thead><tr><th></th><th>{lang === "fr" ? "Bois" : "Wood"}</th><th>{lang === "fr" ? "Plastique EMAPLAST" : "EMAPLAST plastic"}</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c) => <td key={c}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
