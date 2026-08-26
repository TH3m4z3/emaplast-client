import { useState } from "react";
import { adminService } from "../services/admin.service.js";

export default function ImageUpload({ value, onChange, label = "Image", keepDropzone = false }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);

  async function send(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choisissez un fichier image (JPG, PNG, WebP, GIF).");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const saved = await adminService.upload(file);
      onChange(saved.url);
    } catch (e) {
      setError(e.message || "Échec du téléversement");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="image-upload">
      <p className="chip-label">{label}</p>
      {value && !keepDropzone ? (
        <div className="upload-preview">
          <img src={value} alt="" />
          <div className="row-actions">
            <label className="btn btn-small">
              Remplacer
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden disabled={busy} onChange={(e) => send(e.target.files?.[0])} />
            </label>
            <button type="button" className="btn btn-small" onClick={() => onChange("")}>Retirer</button>
          </div>
        </div>
      ) : (
        <label
          className={`upload-drop ${over ? "is-over" : ""} ${busy ? "is-busy" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            send(e.dataTransfer.files?.[0]);
          }}
        >
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden disabled={busy} onChange={(e) => send(e.target.files?.[0])} />
          <strong>{busy ? "Téléversement…" : "Déposez une image ou cliquez pour choisir"}</strong>
          <span>JPG, PNG, WebP ou GIF — 8 Mo max.</span>
        </label>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
