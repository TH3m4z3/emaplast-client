import { useEffect, useState } from "react";
import { API_BASE, getToken } from "../services/http.js";
import { adminService } from "../services/admin.service.js";

export default function Submissions() {
  const [rows, setRows] = useState([]);
  const load = () => adminService.submissions().then(setRows);
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="admin-toolbar">
        <p className="muted">{rows.filter((r) => r.status === "new").length} non traité(s)</p>
        <button className="btn btn-ghost" onClick={() => {
          fetch(`${API_BASE}/api/admin/submissions/export.csv`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then((r) => r.text())
            .then((txt) => {
              const a = document.createElement("a");
              a.href = URL.createObjectURL(new Blob([txt], { type: "text/csv" }));
              a.download = "demandes.csv";
              a.click();
            });
        }}>Exporter CSV</button>
      </div>
      <table className="data">
        <thead><tr><th>Date</th><th>Type</th><th>Statut</th><th>Contenu</th><th></th></tr></thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id}>
              <td>{String(s.created_at).slice(0, 16).replace("T", " ")}</td>
              <td>{s.type}</td>
              <td><span className={`badge ${s.status === "new" ? "is-new" : ""}`}>{s.status === "new" ? "Nouveau" : "Traité"}</span></td>
              <td><pre className="payload">{JSON.stringify(s.payload, null, 2)}</pre></td>
              <td>
                {s.status === "new" && (
                  <button className="btn btn-small" onClick={async () => { await adminService.markSubmission(s.id, "processed"); load(); }}>
                    Marquer traité
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
