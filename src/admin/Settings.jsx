import { useEffect, useState } from "react";
import { adminService } from "../services/admin.service.js";

export default function Settings() {
  const [rows, setRows] = useState([]);
  useEffect(() => { adminService.settings().then(setRows); }, []);

  async function save(e) {
    e.preventDefault();
    await adminService.saveSettings(rows);
    alert("Paramètres enregistrés");
  }

  return (
    <form className="form" onSubmit={save}>
      {rows.map((r, i) => (
        <div className="card" key={r.setting_key}>
          <b>{r.setting_key}</b>
          <label>FR<input value={r.value_fr || ""} onChange={(e) => {
            const next = [...rows]; next[i] = { ...r, value_fr: e.target.value }; setRows(next);
          }} /></label>
          <label>EN<input value={r.value_en || ""} onChange={(e) => {
            const next = [...rows]; next[i] = { ...r, value_en: e.target.value }; setRows(next);
          }} /></label>
        </div>
      ))}
      <button className="btn btn-primary">Enregistrer</button>
    </form>
  );
}
