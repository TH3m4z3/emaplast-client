import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../services/admin.service.js";

const CARDS = [
  ["products", "products", "Produits", "Gérer le catalogue"],
  ["newSubmissions", "submissions", "Demandes", "Formulaires reçus"],
  ["news", "news", "Actualités", "Articles publiés"],
  ["media", "media", "Médias", "Fichiers et images"],
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    adminService.stats().then(setStats);
  }, []);
  return (
    <div>
      <p className="muted">Vue d’ensemble du site EMAPLAST</p>
      <div className="grid grid-2" style={{ marginTop: 20 }}>
        {CARDS.map(([key, path, title, hint]) => (
          <Link className="card admin-stat" key={key} to={`/admin/${path}`}>
            <p className="muted">{hint}</p>
            <h3>{title}</h3>
            <div className="stat-num">{stats ? stats[key] ?? 0 : "—"}</div>
          </Link>
        ))}
      </div>
      <div className="admin-quick">
        <Link className="btn btn-primary" to="/admin/products">Éditer les produits</Link>
        <Link className="btn btn-ghost" to="/admin/pages">Éditer les pages</Link>
        <Link className="btn btn-ghost" to="/admin/submissions">Voir les formulaires</Link>
      </div>
    </div>
  );
}
