import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

const languages = ["PYTHON", "JAVASCRIPT", "CSHARP", "JAVA", "PHP", "DART"];
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://code34.vercel.app/api",
});

export default function App() {
  const [free, setFree] = useState([]);
  const [lang, setLang] = useState("PYTHON");
  const [exercises, setExercises] = useState([]);
  const [code, setCode] = useState("");

  useEffect(() => {
    api.get("/exercises/free").then((res) => setFree(res.data.exercises || []));
  }, []);

  useEffect(() => {
    api
      .get(`/exercises/language/${lang}`)
      .then((res) => setExercises(res.data.exercises || []))
      .catch(() => setExercises([]));
  }, [lang]);

  return (
    <div className="page">
      <header className="hero">
        <div>
       
          <h1>Code34</h1>
          <p>34 exercícios gratuitos de lógica e 34 por linguagem com desbloqueio via PIX.</p>
          <div className="cta-row">
            <button className="neo-btn">Entrar</button>
            <button className="neo-btn ghost">Desbloquear linguagem</button>
          </div>
        </div>
        <div className="glass">
          <h3>Progresso rápido</h3>
          <ul>
            <li>XP por exercício</li>
            <li>Certificado ao concluir 34</li>
            <li>PIX com QR único</li>
          </ul>
        </div>
      </header>

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

      <section className="panel">
        <div className="panel-head">
          <h2>Linguagens</h2>
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
              <button className="neo-btn">Enviar</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
