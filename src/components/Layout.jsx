import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { t } from "../i18n.js";
import { tField } from "../services/http.js";
import { useFetch } from "../hooks/useFetch.js";
import Logo from "./Logo.jsx";

export default function Layout({ settings = {} }) {
  const { lang = "fr" } = useParams();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("nav-open", open);
    return () => document.documentElement.classList.remove("nav-open");
  }, [open]);
  const close = () => setOpen(false);
  const { data: products } = useFetch("/api/products");
  const { data: sectors } = useFetch("/api/sectors");
  const tr = (k) => t(lang, k);
  const p = (path) => `/${lang}${path}`;
  const s = (key) => settings?.[key]?.[lang] || settings?.[key]?.fr || "";
  const liveProducts = (products || []).filter((item) => item.status === "published");
  const comingSoon = (products || []).some((item) => item.status === "coming_soon");
  const productLinks = [
    [tr("allPallets"), p("/products")],
    [tr("findPallet"), p("/products/find")],
    [tr("compare"), p("/products/compare")],
    ...[...new Set((products || []).map((item) => item.dimension).filter(Boolean))].map((d) => [
      d.replace("x", " × ") + " mm",
      p(`/products?dimension=${d}`),
    ]),
    ...liveProducts.map((item) => [item.sku, p(`/products/${item.slug}`)]),
    ...(comingSoon ? [[tr("futureRefs"), p("/products?status=coming_soon")]] : []),
  ];
  const sectorLinks = [
    [lang === "fr" ? "Tous les secteurs" : "All sectors", p("/sectors")],
    ...(sectors || []).map((item) => [tField(item, lang, "title"), p(`/sectors/${item.slug}`)]),
  ];

  return (
    <div className="site">
      <header className="site-header">
        <div className="container header-bar">
          <Link className="logo-link" to={p("")} onClick={close}>
            <Logo compact />
          </Link>
          {open && <button className="nav-scrim" type="button" aria-label="Close" onClick={close} />}
          <nav className={`main-nav ${open ? "is-open" : ""}`}>
            <Mega label={tr("navProducts")} to={p("/products")} links={productLinks} onNavigate={close} />
            <Mega label={tr("navSectors")} to={p("/sectors")} links={sectorLinks} onNavigate={close} />
            <Mega label={tr("navSmart")} to={p("/smart-logistics")} links={[
              [lang === "fr" ? "Présentation" : "Overview", p("/smart-logistics")],
              ["RFID UHF", p("/smart-logistics/palettes-rfid")],
              ["RTIM", p("/smart-logistics/rtim")],
              [lang === "fr" ? "Gestion de parcs" : "Fleet management", p("/smart-logistics/gestion-parcs")],
            ]} onNavigate={close} />
            <Mega label={tr("navReborn")} to={p("/reborn")} links={[
              [lang === "fr" ? "Le programme" : "The programme", p("/reborn")],
              [tr("cycle"), p("/reborn/cycle")],
              [lang === "fr" ? "Reprise" : "Take-back", p("/reborn/reprise")],
            ]} onNavigate={close} />
            <NavLink to={p("/company/qui-sommes-nous")} onClick={close}>{tr("navCompany")}</NavLink>
            <NavLink to={p("/contact")} onClick={close}>{tr("contact")}</NavLink>
            <Link className="btn btn-primary nav-cta" to={p("/quote")} onClick={close}>{lang === "fr" ? "Devis" : "Quote"}</Link>
          </nav>
          <div className="header-actions">
            <div className="lang-switch">
              <Link className={lang === "fr" ? "active" : ""} to={swapLang("fr")}>FR</Link>
              <Link className={lang === "en" ? "active" : ""} to={swapLang("en")}>EN</Link>
            </div>
            <Link className="btn btn-primary header-quote" to={p("/quote")}>{lang === "fr" ? "Devis" : "Quote"}</Link>
            <button className={`menu-btn ${open ? "is-open" : ""}`} type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Logo />
            <p className="footer-tag">{tr("footerNote")}</p>
            <p className="muted-light">
              {s("hq")}<br />{s("plant")}<br />{s("phone")}<br />{s("mobile")}<br />{s("email")}{s("email_alt") ? <><br />{s("email_alt")}</> : null}
            </p>
          </div>
          <div>
            <h4>{tr("navProducts")}</h4>
            <Link to={p("/products")}>{tr("allPallets")}</Link>
            <Link to={p("/products/find")}>{tr("findPallet")}</Link>
            <Link to={p("/quote")}>{tr("quote")}</Link>
          </div>
          <div>
            <h4>{tr("navReborn")}</h4>
            <Link to={p("/reborn")}>REBORN</Link>
            <Link to={p("/reborn-study")}>{tr("rebornStudy")}</Link>
            <Link to={p("/rfid-demo")}>{tr("rfidDemo")}</Link>
          </div>
          <div>
            <h4>{tr("navCompany")}</h4>
            <Link to={p("/company/qui-sommes-nous")}>{lang === "fr" ? "Qui sommes-nous" : "About"}</Link>
            <Link to={p("/careers")}>{tr("careers")}</Link>
            <Link to={p("/contact")}>{tr("contact")}</Link>
          </div>
        </div>
        <div className="container legal-row">
          <span>© {new Date().getFullYear()} EMAPLAST</span>
          <span>
            <Link to={p("/legal/mentions-legales")}>{tr("legal")}</Link>
            {" · "}
            <Link to={p("/legal/confidentialite")}>{tr("privacy")}</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}

function Mega({ to, label, links, onNavigate }) {
  return (
    <div className="nav-item">
      <Link to={to} onClick={onNavigate}>{label}</Link>
      <div className="mega">
        {links.map(([label2, href]) => (
          <Link key={href} to={href} onClick={onNavigate}>{label2}</Link>
        ))}
      </div>
    </div>
  );
}

function swapLang(next) {
  const parts = window.location.pathname.split("/");
  parts[1] = next;
  return `${parts.join("/")}${window.location.search}`;
}
