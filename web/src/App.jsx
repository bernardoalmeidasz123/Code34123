import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

const languages = ["PYTHON", "JAVASCRIPT", "CSHARP", "JAVA", "PHP", "DART"];
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://code34123-bumv.vercel.app/api",
});

function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
}

export default function App() {
  const [tab, setTab] = useState("login");
  const [free, setFree] = useState([]);
  const [lang, setLang] = useState("PYTHON");
  const [exercises, setExercises] = useState([]);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [amountReais, setAmountReais] = useState("99.00");
  const [qr, setQr] = useState("");
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    api.get("/exercises/free").then((res) => setFree(res.data.exercises || []));
    const saved = localStorage.getItem("token");
    if (saved) {
      setToken(saved);
      setAuthToken(saved);
      loadPurchases();
    }
  }, []);

  useEffect(() => {
    api
      .get(`/exercises/language/${lang}`)
      .then((res) => setExercises(res.data.exercises || []))
      .catch(() => setExercises([]));
  }, [lang, token]);

  const loadPurchases = async () => {
    try {
      const res = await api.get("/purchases/mine");
      setPurchases(res.data.purchases || []);
    } catch {
      setPurchases([]);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setMessage("Login realizado.");
      loadPurchases();
      setTab("checkout");
    } catch (e) {
      setError(e.response?.data?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  const submitExercise = async (exerciseId) => {
    if (!token) {
      setError("Faça login para enviar.");
      return;
    }
    const passed = code.trim().length > 0;
    try {
      await api.post(`/exercises/${exerciseId}/submit`, { code, output: "", passed });
      setMessage(passed ? "Enviado! ✅" : "Falhou nos testes.");
    } catch (e) {
      setError(e.response?.data?.message || "Erro ao enviar");
    }
  };

  const createPix = async () => {
    if (!token) {
      setError("Faça login para gerar PIX.");
      return;
    }
    try {
      const amountCents = Math.round(parseFloat(amountReais.replace(",", ".")) * 100) || 0;
      const res = await api.post("/purchases/create", { language: lang, amountCents });
      setQr(res.data.purchase.pixQrCode);
      setMessage("PIX gerado.");
      loadPurchases();
    } catch (e) {
      setError(e.response?.data?.message || "Erro ao gerar PIX");
    }
  };

  return (
    <div className="page">
      <nav className="tabs">
        <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>
          Login
        </button>
        <button className={`tab ${tab === "checkout" ? "active" : ""}`} onClick={() => setTab("checkout")}>
          Checkout
        </button>
        <button className={`tab ${tab === "exercicios" ? "active" : ""}`} onClick={() => setTab("exercicios")}>
          Exercícios
        </button>
        <button className={`tab ${tab === "gratis" ? "active" : ""}`} onClick={() => setTab("gratis")}>
          Gratuitos
        </button>
      </nav>

      {error && <p className="error">{error}</p>}
      {message && <p className="ok">{message}</p>}

      {tab === "login" && (
        <section className="panel">
          <div className="panel-head">
            <h2>Login</h2>
            <span>Entre com suas credenciais</span>
          </div>
          <div className="form">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
            <label>Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
            <button className="neo-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Entrando..." : token ? "Logado" : "Entrar"}
            </button>
          </div>
        </section>
      )}

      {tab === "checkout" && (
        <section className="panel">
          <div className="panel-head">
            <h2>Checkout PIX</h2>
            <span>Valor em reais</span>
          </div>
          <div className="checkout-grid">
            <div className="card">
              <h4>Linguagens</h4>
              <div className="chips">
                {languages.map((l) => (
                  <button key={l} className={`chip ${l === lang ? "active" : ""}`} onClick={() => setLang(l)}>
                    {l}
                  </button>
                ))}
              </div>
              <label>Valor (R$)</label>
              <input type="text" value={amountReais} onChange={(e) => setAmountReais(e.target.value)} />
              <button className="neo-btn" onClick={createPix} disabled={!token}>
                Gerar PIX
              </button>
              {qr && (
                <div className="qr-box">
                  <h5>QR Code PIX</h5>
                  <p className="muted">Copie a linha abaixo para pagar:</p>
                  <textarea readOnly value={qr} />
                </div>
              )}
            </div>
            <div className="card">
              <h4>Minhas compras</h4>
              {purchases.length === 0 ? <p className="muted">Nenhuma compra ainda.</p> : null}
              {purchases.map((p) => (
                <div key={p.id} className="purchase-row">
                  <span>{p.language}</span>
                  <span>{p.status}</span>
                  <span>R$ {(p.amountCents / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === "exercicios" && (
        <section className="panel">
          <div className="panel-head">
            <h2>Exercícios</h2>
            <div className="chips">
              {languages.map((l) => (
                <button key={l} className={`chip ${l === lang ? "active" : ""}`} onClick={() => setLang(l)}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="grid">
            {exercises.length === 0 ? <p className="muted">Bloqueada. Finalize o PIX para liberar.</p> : null}
            {exercises.map((ex) => (
              <article key={ex.id} className="card">
                <h4>{ex.title}</h4>
                <p>{ex.content}</p>
                <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder={ex.starterCode || "// seu código"} />
                <button className="neo-btn" onClick={() => submitExercise(ex.id)}>
                  Enviar
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "gratis" && (
        <section className="panel">
          <div className="panel-head">
            <h2>Exercícios gratuitos</h2>
            <span>Comece agora</span>
          </div>
          <div className="grid">
            {free.map((ex) => (
              <article key={ex.slug} className="card">
                <h4>{ex.title}</h4>
                <p>{ex.content}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
