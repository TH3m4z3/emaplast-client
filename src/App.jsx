import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { settingsService } from "./services/settings.service.js";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import FindPallet from "./pages/FindPallet.jsx";
import Compare from "./pages/Compare.jsx";
import Sectors from "./pages/Sectors.jsx";
import SectorDetail from "./pages/SectorDetail.jsx";
import CmsPage from "./pages/CmsPage.jsx";
import { Resources, ResourceDetail } from "./pages/Resources.jsx";
import { News, NewsDetail } from "./pages/News.jsx";
import Faq from "./pages/Faq.jsx";
import Tco from "./pages/Tco.jsx";
import WoodVsPlastic from "./pages/WoodVsPlastic.jsx";
import Careers from "./pages/Careers.jsx";
import FormPage from "./pages/FormPage.jsx";
import {
  AdminFaqs,
  AdminHome,
  AdminJobs,
  AdminLogin,
  AdminMedia,
  AdminNews,
  AdminPages,
  AdminProducts,
  AdminResources,
  AdminSectors,
  AdminSettings,
  AdminSubmissions,
  RequireAuth,
} from "./admin/AdminApp.jsx";

export default function App() {
  const [settings, setSettings] = useState({});
  useEffect(() => {
    settingsService.get().then(setSettings).catch(() => {});
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/fr" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAuth />}>
        <Route index element={<AdminHome />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="sectors" element={<AdminSectors />} />
        <Route path="pages" element={<AdminPages />} />
        <Route path="resources" element={<AdminResources />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="faqs" element={<AdminFaqs />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="submissions" element={<AdminSubmissions />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="/:lang" element={<LangLayout settings={settings} />}>
        <Route index element={<Home settings={settings} />} />
        <Route path="products" element={<Products />} />
        <Route path="products/find" element={<FindPallet />} />
        <Route path="products/compare" element={<Compare />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="sectors" element={<Sectors />} />
        <Route path="sectors/:slug" element={<SectorDetail />} />
        <Route path="smart-logistics" element={<CmsPage section="smart" />} />
        <Route path="smart-logistics/:slug" element={<CmsPage section="smart" />} />
        <Route path="reborn" element={<CmsPage section="reborn" />} />
        <Route path="reborn/:slug" element={<CmsPage section="reborn" />} />
        <Route path="company/:slug" element={<CmsPage section="company" />} />
        <Route path="legal/:slug" element={<CmsPage section="legal" />} />
        <Route path="resources" element={<Resources />} />
        <Route path="resources/:slug" element={<ResourceDetail />} />
        <Route path="news" element={<News />} />
        <Route path="news/:slug" element={<NewsDetail />} />
        <Route path="faq" element={<Faq />} />
        <Route path="tco" element={<Tco />} />
        <Route path="wood-vs-plastic" element={<WoodVsPlastic />} />
        <Route path="careers" element={<Careers />} />
        <Route path="contact" element={<FormPage type="contact" />} />
        <Route path="quote" element={<FormPage type="quote" />} />
        <Route path="rfid-demo" element={<FormPage type="rfid_demo" />} />
        <Route path="reborn-study" element={<FormPage type="reborn_study" />} />
      </Route>
    </Routes>
  );
}

function LangLayout({ settings }) {
  const { lang } = useParams();
  if (lang !== "fr" && lang !== "en") return <Navigate to="/fr" replace />;
  return <Layout settings={settings} />;
}
