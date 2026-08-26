import { useEffect, useState } from "react";
import { adminService } from "../services/admin.service.js";
import ImageUpload from "./ImageUpload.jsx";

export default function Media() {
  const [rows, setRows] = useState([]);
  const load = () => adminService.media().then(setRows);
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="admin-toolbar">
        <p className="muted">{rows.length} image{rows.length > 1 ? "s" : ""}</p>
      </div>
      <ImageUpload
        label="Ajouter une image"
        value=""
        onChange={() => load()}
        keepDropzone
      />
      <p className="muted" style={{ marginTop: 8 }}>Les fichiers sont enregistrés dans la médiathèque. Vous pouvez aussi les envoyer depuis une fiche produit ou secteur.</p>
      <div className="media-grid">
        {rows.map((m) => (
          <div className="card media-card" key={m.id}>
            {m.mime?.startsWith("image/") || m.url ? <img src={m.url} alt={m.original_name} /> : null}
            <p><b>{m.original_name}</b></p>
            <p className="muted">{m.url}</p>
            <button className="btn btn-small" type="button" onClick={async () => { await adminService.deleteMedia(m.id); load(); }}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}
