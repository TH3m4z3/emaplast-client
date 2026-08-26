import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getToken, setToken } from "../services/http.js";
import Logo from "../components/Logo.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Crud from "./Crud.jsx";
import ProductEditor from "./ProductEditor.jsx";
import SectorEditor from "./SectorEditor.jsx";
import PagesEditor from "./PagesEditor.jsx";
import Submissions from "./Submissions.jsx";
import Media from "./Media.jsx";
import Settings from "./Settings.jsx";

export const ADMIN_GROUPS = [
  {
    label: "Contenu",
    items: [
      [".", "Tableau de bord"],
      ["products", "Produits"],
      ["sectors", "Secteurs"],
      ["pages", "Pages"],
      ["resources", "Ressources"],
      ["news", "Actualités"],
    ],
  },
  {
    label: "Demandes",
    items: [
      ["submissions", "Formulaires"],
      ["jobs", "Carrières"],
      ["faqs", "FAQ"],
    ],
  },
  {
    label: "Système",
    items: [
      ["media", "Médias"],
      ["settings", "Paramètres"],
    ],
  },
];

export function AdminLogin() {
  return <Login />;
}

export function RequireAuth() {
  if (!getToken()) return <Navigate to="/admin/login" replace />;
  return <AdminShell />;
}

export function AdminProducts() {
  return <ProductEditor />;
}

export function AdminSectors() {
  return <SectorEditor />;
}

export function AdminPages() {
  return <PagesEditor />;
}

export function AdminResources() {
  return <Crud table="resources" />;
}

export function AdminNews() {
  return <Crud table="news" />;
}

export function AdminFaqs() {
  return <Crud table="faqs" />;
}

export function AdminJobs() {
  return <Crud table="jobs" />;
}

export function AdminSubmissions() {
  return <Submissions />;
}

export function AdminMedia() {
  return <Media />;
}

export function AdminSettings() {
  return <Settings />;
}

export function AdminHome() {
  return <Dashboard />;
}

function AdminShell() {
  const loc = useLocation();
  const nav = useNavigate();
  const current = ADMIN_GROUPS.flatMap((g) => g.items).find(([id]) =>
    id === "." ? loc.pathname === "/admin" || loc.pathname === "/admin/" : loc.pathname === `/admin/${id}`
  );

  return (
    <div className="admin">
      <aside className="admin-side">
        <Link to="/admin" className="admin-brand">
          <Logo compact />
        </Link>
        {ADMIN_GROUPS.map((group) => (
          <div key={group.label} className="admin-group">
            <p className="admin-group-label">{group.label}</p>
            {group.items.map(([id, label]) => (
              <NavLink
                key={label}
                to={id === "." ? "/admin" : `/admin/${id}`}
                end={id === "."}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {label}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="admin-side-foot">
          <a className="admin-site-link" href="/fr" target="_blank" rel="noreferrer">Voir le site ↗</a>
          <button className="btn btn-ghost light" type="button" onClick={() => { setToken(""); nav("/admin/login"); }}>
            Déconnexion
          </button>
        </div>
      </aside>
      <div className="admin-body">
        <header className="admin-top">
          <h1>{current?.[1] || "Administration"}</h1>
          <span className="muted">Édition dans le tableau de bord</span>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
