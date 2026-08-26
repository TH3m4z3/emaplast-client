import { useState } from "react";
import { useLang } from "../hooks/useLang.js";
import { t } from "../i18n.js";

export default function Tco() {
  const lang = useLang();
  const [v, set] = useState({ wood: 2500, plastic: 6500, cyclesWood: 12, cyclesPlastic: 80, fleet: 500 });
  const woodTco = v.wood * v.fleet * (80 / Math.max(v.cyclesWood, 1));
  const plasticTco = v.plastic * v.fleet;
  return (
    <div className="container section">
      <header className="page-hero"><h1 className="display">{t(lang, "tco")}</h1></header>
      <div className="grid grid-2">
        <form className="form card">
          {[["wood", "Wood unit"], ["plastic", "Plastic unit"], ["cyclesWood", "Wood cycles"], ["cyclesPlastic", "Plastic cycles"], ["fleet", "Fleet"]].map(([k, lab]) => (
            <label key={k}>{lab}<input type="number" value={v[k]} onChange={(e) => set({ ...v, [k]: Number(e.target.value) })} /></label>
          ))}
        </form>
        <div className="card">
          <p>Wood TCO: {Math.round(woodTco).toLocaleString()}</p>
          <p>Plastic TCO: {Math.round(plasticTco).toLocaleString()}</p>
          <p className="muted">{lang === "fr" ? "Simulation pédagogique, à affiner avec une étude." : "Educational simulation, to be refined in a study."}</p>
        </div>
      </div>
    </div>
  );
}
