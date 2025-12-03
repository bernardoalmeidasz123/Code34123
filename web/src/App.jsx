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
  const [amount, setAmount] = useState("9900");
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
      const res = await api.post("/purchases/create", {
        language: lang,
        amountCents: parseInt(amount, 10) || 0,
      });
      setQr(res.data.purchase.pixQrCode);
      setMessage("PIX gerado.");
      loadPurchases();
    } catch (e) {
      setError(e.response?.data?.message || "Erro ao gerar PIX");
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Futuristic • Azul & Preto</p>
          <h1>Code34</h1>
          <p>34 exercícios gratuitos de lógica e 34 por linguagem com desbloqueio via PIX.</p>
          <div className="cta-row">
            <button className="neo-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Entrando..." : token ? "Logado" : "Entrar"}
            </button>
            <button className="neo-btn ghost" onClick={createPix} disabled={!token}>
              Desbloquear linguagem
            </button>
          </div>
          {error && <p className="error">{error}</p>}
          {message && <p className="ok">{message}</p>}
        </div>
        <div className="glass">
          <h3>Login</h3>
          <div className="form">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
            <label>Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
            <button className="neo-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
          <div className="glass-info">
            <h4>Progresso rápido</h4>
            <ul>
              <li>XP por exercício</li>
              <li>Certificado ao concluir 34</li>
              <li>PIX com QR único</li>
            </ul>
          </div>
        </div>
      </header>

      <section className="panel" id="checkout">
        <div className="panel-head">
          <h2>Checkout PIX</h2>
          <span>Escolha a linguagem e gere o QR</span>
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
            <label>Valor em centavos</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
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

      <section className="panel" id="exercicios">
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

      <section className="panel" id="gratis">
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
    </div>
  );
}
