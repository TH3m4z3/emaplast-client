import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../services/http.js";
import { adminService } from "../services/admin.service.js";
import Logo from "../components/Logo.jsx";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Emaplast2026!");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await adminService.login(username, password);
      setToken(res.token);
      nav("/admin");
    } catch (e2) {
      setError(e2.message);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-visual">
        <img src="/brand/plant.jpg" alt="" />
        <div className="login-visual-copy">
          <p className="kicker">EMAPLAST</p>
          <h2>Pilotage du site et du catalogue</h2>
        </div>
      </div>
      <form className="login-box" onSubmit={submit}>
        <Logo />
        <h1>Administration</h1>
        <p className="muted">Connectez-vous pour gérer les pages, produits et demandes.</p>
        {error && <p className="error">{error}</p>}
        <label>Identifiant<input value={username} onChange={(e) => setUsername(e.target.value)} /></label>
        <label>Mot de passe<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button className="btn btn-primary" type="submit">Connexion</button>
      </form>
    </div>
  );
}
