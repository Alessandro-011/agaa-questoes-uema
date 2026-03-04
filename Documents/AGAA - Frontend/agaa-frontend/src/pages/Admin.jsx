import { useState, useEffect, useCallback } from "react";

// ─── PALETTE ────────────────────────────────────────────────────────────────
// Bandeira do Maranhão: preto, vermelho-carmesim, branco
// UEMA: azul institucional
const C = {
  black:    "#0D0D0D",
  crimson:  "#C8102E",
  crimsonD: "#9B0C22",
  crimsonL: "#E8253F",
  white:    "#F5F3EE",
  offWhite: "#EAE7E0",
  uemaBlue: "#003B6F",
  uemaBluL: "#005299",
  gray50:   "#F9F7F4",
  gray100:  "#EEEBE4",
  gray200:  "#D6D1C8",
  gray400:  "#9E9890",
  gray600:  "#5C5750",
  gray800:  "#2A2620",
  gold:     "#BFA046",
};

// ─── BASE URL ────────────────────────────────────────────────────────────────
const API = "http://localhost:8080";

async function api(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ─── ICONS (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const paths = {
    home: "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z M9 21V12h6v9",
    list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
    book: "M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 004 17V5a2 2 0 012-2h14v14H6.5M4 19.5V21",
    plus: "M12 5v14M5 12h14",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    trash: "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
    close: "M18 6L6 18M6 6l12 12",
    check: "M20 6L9 17l-5-5",
    warn: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4M12 17h.01",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    chevronR: "M9 18l6-6-6-6",
    chevronD: "M6 9l6 6 6-6",
    doc: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6M16 13H8M16 17H8M10 9H8",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]?.split(" M").map((d, i) => (
        <path key={i} d={(i === 0 ? "" : "M") + d} />
      ))}
    </svg>
  );
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Source Serif 4', Georgia, serif;
    background: ${C.gray50};
    color: ${C.gray800};
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${C.gray100}; }
  ::-webkit-scrollbar-thumb { background: ${C.gray200}; border-radius: 3px; }

  input, textarea, select {
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 14px;
  }

  button { cursor: pointer; font-family: 'Source Serif 4', Georgia, serif; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .fade-in { animation: fadeIn 0.3s ease forwards; }
  .slide-in { animation: slideIn 0.25s ease forwards; }
`;

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────

const Badge = ({ label, variant = "default" }) => {
  const styles = {
    default: { bg: C.gray100, color: C.gray600 },
    FACIL:   { bg: "#D4EDDA", color: "#1A5C2A" },
    MEDIO:   { bg: "#FFF3CD", color: "#7B5600" },
    DIFICIL: { bg: "#F8D7DA", color: "#721C24" },
    OBJETIVA:   { bg: "#D6EAF8", color: "#1A4A72" },
    DISCURSIVA: { bg: "#E8DAEF", color: "#5B2C6F" },
  };
  const s = styles[label] || styles.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px", borderRadius: 3,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
      textTransform: "uppercase",
      background: s.bg, color: s.color,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {label}
    </span>
  );
};

const Spinner = () => (
  <div style={{
    width: 20, height: 20, borderRadius: "50%",
    border: `3px solid ${C.gray200}`,
    borderTopColor: C.crimson,
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  }} />
);

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "error" ? C.crimson : C.uemaBlue;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: bg, color: "#fff",
      padding: "12px 20px", borderRadius: 4,
      fontSize: 14, maxWidth: 360,
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      display: "flex", alignItems: "center", gap: 10,
      animation: "fadeIn 0.25s ease",
    }}>
      <Icon name={type === "error" ? "warn" : "check"} size={16} />
      {msg}
      <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "#fff", opacity: 0.7 }}>
        <Icon name="close" size={14} />
      </button>
    </div>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(13,13,13,0.65)",
    backdropFilter: "blur(3px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 16,
  }} onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div style={{
      background: "#fff", borderRadius: 6,
      width: "100%", maxWidth: 700,
      maxHeight: "90vh", overflow: "auto",
      boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
      animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        padding: "20px 24px",
        borderBottom: `3px solid ${C.crimson}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, background: "#fff", zIndex: 1,
      }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.black }}>
          {title}
        </h2>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: C.gray400,
          padding: 4, borderRadius: 4,
          transition: "color 0.2s",
        }} onMouseOver={e => e.target.style.color = C.crimson}
           onMouseOut={e => e.target.style.color = C.gray400}>
          <Icon name="close" size={20} />
        </button>
      </div>
      <div style={{ padding: "24px" }}>{children}</div>
    </div>
  </div>
);

const Btn = ({ label, icon, variant = "primary", onClick, disabled, small }) => {
  const styles = {
    primary: { bg: C.crimson, hover: C.crimsonD, color: "#fff" },
    secondary: { bg: C.uemaBlue, hover: "#002D56", color: "#fff" },
    ghost: { bg: "transparent", hover: C.gray100, color: C.gray600 },
    danger: { bg: "#fff", hover: "#FFF0F0", color: C.crimson, border: `1px solid ${C.crimson}` },
  };
  const s = styles[variant];
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseOver={() => setHov(true)}
      onMouseOut={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: small ? "6px 12px" : "9px 18px",
        borderRadius: 4,
        background: hov ? s.hover : s.bg,
        color: s.color,
        border: s.border || "none",
        fontSize: small ? 13 : 14,
        fontWeight: 600,
        letterSpacing: "0.02em",
        opacity: disabled ? 0.5 : 1,
        transition: "background 0.15s, transform 0.1s",
        transform: hov && !disabled ? "translateY(-1px)" : "none",
        boxShadow: variant === "primary" ? "0 2px 8px rgba(200,16,46,0.3)" : "none",
      }}>
      {icon && <Icon name={icon} size={small ? 14 : 16} />}
      {label}
    </button>
  );
};

const Field = ({ label, required, error, children, hint }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      display: "block", marginBottom: 5,
      fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", color: C.gray600,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {label}{required && <span style={{ color: C.crimson }}> *</span>}
    </label>
    {children}
    {hint && <p style={{ marginTop: 4, fontSize: 12, color: C.gray400 }}>{hint}</p>}
    {error && <p style={{ marginTop: 4, fontSize: 12, color: C.crimson }}>{error}</p>}
  </div>
);

const inputStyle = (err) => ({
  width: "100%", padding: "9px 12px",
  border: `1px solid ${err ? C.crimson : C.gray200}`,
  borderRadius: 4, fontSize: 14,
  background: "#fff", color: C.gray800,
  outline: "none", transition: "border 0.15s",
  fontFamily: "'Source Serif 4', serif",
});

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const MENU_ADMIN = [
  { id: "dashboard",  label: "Início",          icon: "home" },
  { id: "provas",     label: "Provas",           icon: "book" },
  { id: "questoes",   label: "Questões",         icon: "list" },
  { id: "visualizar", label: "Visualizar Prova", icon: "eye"  },
];

const MENU_USER = [
  { id: "visualizar", label: "Provas & Questões", icon: "eye" },
];

const Sidebar = ({ active, setActive, perfil }) => {
  const MENU = perfil === "admin" ? MENU_ADMIN : MENU_USER;
  return (
    <aside style={{
      width: 230, minHeight: "100vh",
      background: C.black,
      display: "flex", flexDirection: "column",
      position: "sticky", top: 0, height: "100vh",
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: "28px 20px 20px",
        borderBottom: `1px solid rgba(255,255,255,0.07)`,
      }}>
        {/* Stripes MA flag */}
        <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 3, background: C.crimson, borderRadius: 2 }} />
          <div style={{ flex: 1, height: 3, background: "#fff", borderRadius: 2 }} />
          <div style={{ flex: 1, height: 3, background: C.crimson, borderRadius: 2 }} />
        </div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 20, fontWeight: 800, color: "#fff",
          lineHeight: 1.15,
        }}>
          AGAA
        </div>
        <div style={{ fontSize: 10, color: C.crimson, letterSpacing: "0.2em", marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
          QUESTÕES · UEMA
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "12px 0", flex: 1 }}>
        {MENU.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "11px 20px",
                background: isActive ? C.crimson : "transparent",
                border: "none", color: isActive ? "#fff" : C.gray400,
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                textAlign: "left", cursor: "pointer",
                transition: "all 0.15s",
                borderLeft: isActive ? `3px solid ${C.white}` : "3px solid transparent",
                letterSpacing: "0.03em",
              }}>
              <Icon name={item.icon} size={16} color={isActive ? "#fff" : C.gray400} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: "16px 20px",
        borderTop: `1px solid rgba(255,255,255,0.07)`,
        fontSize: 11, color: "rgba(255,255,255,0.25)",
        fontFamily: "'JetBrains Mono', monospace",
        lineHeight: 1.6,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: perfil === "admin" ? "rgba(200,16,46,0.2)" : "rgba(0,59,111,0.3)",
          border: `1px solid ${perfil === "admin" ? "rgba(200,16,46,0.4)" : "rgba(0,82,153,0.5)"}`,
          borderRadius: 4, padding: "3px 8px", marginBottom: 8,
          color: perfil === "admin" ? "#E8253F" : "#5599CC",
          fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
        }}>
          {perfil === "admin" ? "🛡️ Admin" : "📚 Candidato"}
        </div>
        <br />
        Universidade Estadual<br />do Maranhão — PAES
      </div>
    </aside>
  );
};

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
const Topbar = ({ title, subtitle }) => (
  <div style={{
    background: "#fff",
    borderBottom: `1px solid ${C.gray100}`,
    padding: "16px 32px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  }}>
    <div>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 22, fontWeight: 700, color: C.black,
      }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13, color: C.gray400, marginTop: 2 }}>{subtitle}</p>}
    </div>
    <div style={{
      fontSize: 12, color: C.gray400,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
    </div>
  </div>
);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ provas, questoes, setActive }) => {
  const stats = [
    { label: "Provas Cadastradas", value: provas.length, icon: "book", color: C.uemaBlue },
    { label: "Questões Cadastradas", value: questoes.length, icon: "list", color: C.crimson },
    {
      label: "Questões Objetivas",
      value: questoes.filter(q => q.tipo === "OBJETIVA").length,
      icon: "check", color: C.gold,
    },
    {
      label: "Questões Discursivas",
      value: questoes.filter(q => q.tipo === "DISCURSIVA").length,
      icon: "doc", color: C.gray600,
    },
  ];

  const byArea = questoes.reduce((acc, q) => {
    acc[q.area_conhecimento] = (acc[q.area_conhecimento] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: 32, animation: "fadeIn 0.3s ease" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: "#fff",
            border: `1px solid ${C.gray100}`,
            borderTop: `4px solid ${s.color}`,
            borderRadius: 6, padding: "20px 24px",
            transition: "box-shadow 0.2s",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace" }}>
                {s.label}
              </span>
              <Icon name={s.icon} size={18} color={s.color} />
            </div>
            <div style={{ fontSize: 40, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: C.black, lineHeight: 1 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Últimas Provas */}
        <div style={{ background: "#fff", border: `1px solid ${C.gray100}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{
            padding: "14px 20px", borderBottom: `1px solid ${C.gray100}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: C.black }}>Provas Recentes</h3>
            <button onClick={() => setActive("provas")} style={{
              background: "none", border: "none", color: C.crimson,
              fontSize: 12, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            }}>Ver todas →</button>
          </div>
          {provas.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: C.gray400, fontSize: 13 }}>Nenhuma prova cadastrada</div>
          ) : provas.slice(-5).reverse().map(p => (
            <div key={p.id} style={{
              padding: "12px 20px",
              borderBottom: `1px solid ${C.gray100}`,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 4, background: C.uemaBlue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="book" size={14} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.gray800 }}>{p.codigo_prova}</div>
                <div style={{ fontSize: 12, color: C.gray400 }}>{p.ano} · {p.fase}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Por Área */}
        <div style={{ background: "#fff", border: `1px solid ${C.gray100}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.gray100}` }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: C.black }}>Questões por Área</h3>
          </div>
          {Object.keys(byArea).length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: C.gray400, fontSize: 13 }}>Nenhuma questão cadastrada</div>
          ) : Object.entries(byArea).sort((a, b) => b[1] - a[1]).map(([area, count]) => {
            const pct = Math.round((count / questoes.length) * 100);
            return (
              <div key={area} style={{ padding: "10px 20px", borderBottom: `1px solid ${C.gray100}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: C.gray800 }}>{area}</span>
                  <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: C.gray400 }}>{count}</span>
                </div>
                <div style={{ height: 4, background: C.gray100, borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: C.crimson, borderRadius: 2, transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── PROVAS PAGE ──────────────────────────────────────────────────────────────
const ProvaForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(initial || {
    codigo_prova: "", fase: "", tipo: "", ano: "", dia: "", data_aplicacao: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.codigo_prova) e.codigo_prova = "Obrigatório";
    if (!form.fase) e.fase = "Obrigatório";
    if (!form.tipo) e.tipo = "Obrigatório";
    if (!form.ano || isNaN(form.ano)) e.ano = "Informe um ano válido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form, ano: parseInt(form.ano) };
      await onSave(payload);
    } finally {
      setLoading(false);
    }
  };

  const inp = (k) => ({
    value: form[k] || "",
    onChange: e => set(k, e.target.value),
    style: inputStyle(errors[k]),
    onFocus: e => e.target.style.borderColor = C.uemaBlue,
    onBlur: e => e.target.style.borderColor = errors[k] ? C.crimson : C.gray200,
  });

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Código da Prova" required error={errors.codigo_prova}>
          <input {...inp("codigo_prova")} placeholder="Ex: PAES2026_OBJ" />
        </Field>
        <Field label="Ano" required error={errors.ano}>
          <input {...inp("ano")} type="number" placeholder="Ex: 2026" />
        </Field>
        <Field label="Fase" required error={errors.fase}>
          <input {...inp("fase")} placeholder="Ex: UNICA, 1ª FASE" />
        </Field>
        <Field label="Tipo" required error={errors.tipo}>
          <input {...inp("tipo")} placeholder="Ex: OBJETIVA_REDAÇÃO" />
        </Field>
        <Field label="Dia da Semana">
          <select {...inp("dia")} style={inputStyle()} onChange={e => set("dia", e.target.value)}>
            <option value="">Selecione</option>
            {["DOMINGO","SEGUNDA","TERÇA","QUARTA","QUINTA","SEXTA","SÁBADO"].map(d =>
              <option key={d} value={d}>{d}</option>
            )}
          </select>
        </Field>
        <Field label="Data de Aplicação">
          <input {...inp("data_aplicacao")} type="date" />
        </Field>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <Btn label="Cancelar" variant="ghost" onClick={onCancel} />
        <Btn label={loading ? "Salvando…" : "Salvar Prova"} icon="check" onClick={handleSubmit} disabled={loading} />
      </div>
    </div>
  );
};

const ProvasPage = ({ provas, onRefresh, toast }) => {
  const [modal, setModal] = useState(null); // null | "create" | {prova}
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = provas.filter(p =>
    p.codigo_prova.toLowerCase().includes(search.toLowerCase()) ||
    String(p.ano).includes(search)
  );

  const handleSave = async (data) => {
    try {
      if (modal === "create") {
        await api("/provas", { method: "POST", body: JSON.stringify(data) });
        toast("Prova criada com sucesso!", "ok");
      } else {
        await api(`/provas/${modal.id}`, { method: "PUT", body: JSON.stringify(data) });
        toast("Prova atualizada!", "ok");
      }
      setModal(null);
      onRefresh();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api(`/provas/${id}`, { method: "DELETE" });
      toast("Prova excluída.", "ok");
      setDeleting(null);
      onRefresh();
    } catch (e) {
      toast(e.message, "error");
      setDeleting(null);
    }
  };

  return (
    <div style={{ padding: 32, animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar prova..."
              style={{ ...inputStyle(), paddingLeft: 36, width: 240 }}
            />
            <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
              <Icon name="search" size={16} color={C.gray400} />
            </div>
          </div>
        </div>
        <Btn label="Nova Prova" icon="plus" onClick={() => setModal("create")} />
      </div>

      <div style={{ background: "#fff", border: `1px solid ${C.gray100}`, borderRadius: 6, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.black }}>
              {["Código", "Ano", "Fase", "Tipo", "Data Aplicação", "Ações"].map(h => (
                <th key={h} style={{
                  padding: "11px 16px", textAlign: "left",
                  fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: "center", color: C.gray400, fontSize: 14 }}>
                  Nenhuma prova encontrada
                </td>
              </tr>
            ) : filtered.map((p, i) => (
              <tr key={p.id} style={{
                borderBottom: `1px solid ${C.gray100}`,
                background: i % 2 === 0 ? "#fff" : C.gray50,
                transition: "background 0.15s",
              }}>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 500 }}>{p.codigo_prova}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 14 }}>{p.ano}</td>
                <td style={{ padding: "12px 16px", fontSize: 14 }}>{p.fase}</td>
                <td style={{ padding: "12px 16px" }}><Badge label={p.tipo} /></td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: C.gray400, fontFamily: "'JetBrains Mono', monospace" }}>
                  {p.data_aplicacao ? new Date(p.data_aplicacao + "T00:00:00").toLocaleDateString("pt-BR") : "—"}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn small label="" icon="edit" variant="ghost" onClick={() => setModal(p)} />
                    <Btn small label="" icon="trash" variant="danger" onClick={() => setDeleting(p)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === "create" ? "Nova Prova" : `Editar: ${modal.codigo_prova}`} onClose={() => setModal(null)}>
          <ProvaForm initial={modal === "create" ? null : modal} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {deleting && (
        <Modal title="Confirmar Exclusão" onClose={() => setDeleting(null)}>
          <p style={{ fontSize: 15, color: C.gray800, marginBottom: 20 }}>
            Tem certeza que deseja excluir a prova <strong>{deleting.codigo_prova}</strong>?
            Isso só é possível se não houver questões vinculadas.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn label="Cancelar" variant="ghost" onClick={() => setDeleting(null)} />
            <Btn label="Excluir" icon="trash" variant="primary" onClick={() => handleDelete(deleting.id)} />
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── QUESTÕES PAGE ────────────────────────────────────────────────────────────
const LETRAS = ["A", "B", "C", "D", "E"];

const buildAlternativas = (existing = []) => {
  return LETRAS.map(letra => {
    const found = existing.find(a => a.letra === letra);
    return found ? { ...found } : { letra, texto: "" };
  });
};

const QuestaoForm = ({ initial, provas, onSave, onCancel }) => {
  const [form, setForm] = useState(() => {
    if (!initial) return {
      numero_na_prova: "", area_conhecimento: "", disciplina: "",
      assunto: "", enunciado: "", imagem_url: "", dificuldade: "MEDIO",
      tipo: "OBJETIVA", prova: provas[0] || null,
      alternativas: buildAlternativas([]),
      gabarito: { alternativaCorreta: null, res_esperada: "", fonte_oficial: "" },
    };
    return {
      ...initial,
      alternativas: buildAlternativas(initial.alternativas || []),
      gabarito: initial.gabarito || { alternativaCorreta: null, res_esperada: "", fonte_oficial: "" },
    };
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.numero_na_prova) e.numero_na_prova = "Obrigatório";
    if (!form.area_conhecimento) e.area_conhecimento = "Obrigatório";
    if (!form.disciplina) e.disciplina = "Obrigatório";
    if (!form.assunto) e.assunto = "Obrigatório";
    if (!form.enunciado) e.enunciado = "Obrigatório";
    if (!form.prova) e.prova = "Selecione uma prova";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const alts = form.tipo === "OBJETIVA" ? form.alternativas.filter(a => a.texto.trim()) : [];
      const gab = form.gabarito?.fonte_oficial || form.gabarito?.res_esperada || form.gabarito?.alternativaCorreta
        ? form.gabarito : null;
      await onSave({ ...form, numero_na_prova: parseInt(form.numero_na_prova), alternativas: alts, gabarito: gab });
    } finally {
      setLoading(false);
    }
  };

  const inp = (k) => ({
    value: form[k] || "",
    onChange: e => set(k, e.target.value),
    style: inputStyle(errors[k]),
    onFocus: e => e.target.style.borderColor = C.uemaBlue,
    onBlur: e => e.target.style.borderColor = errors[k] ? C.crimson : C.gray200,
  });

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Prova" required error={errors.prova}>
          <select style={inputStyle(errors.prova)} value={form.prova?.id || ""}
            onChange={e => set("prova", provas.find(p => p.id == e.target.value) || null)}>
            <option value="">Selecione</option>
            {provas.map(p => <option key={p.id} value={p.id}>{p.codigo_prova} ({p.ano})</option>)}
          </select>
        </Field>
        <Field label="Nº na Prova" required error={errors.numero_na_prova}>
          <input {...inp("numero_na_prova")} type="number" placeholder="Ex: 1" />
        </Field>
        <Field label="Tipo" required>
          <select style={inputStyle()} value={form.tipo} onChange={e => set("tipo", e.target.value)}>
            <option value="OBJETIVA">Objetiva</option>
            <option value="DISCURSIVA">Discursiva</option>
          </select>
        </Field>
        <Field label="Dificuldade" required>
          <select style={inputStyle()} value={form.dificuldade} onChange={e => set("dificuldade", e.target.value)}>
            <option value="FACIL">Fácil</option>
            <option value="MEDIO">Médio</option>
            <option value="DIFICIL">Difícil</option>
          </select>
        </Field>
        <Field label="Área do Conhecimento" required error={errors.area_conhecimento}>
          <input {...inp("area_conhecimento")} placeholder="Ex: CIÊNCIAS DA NATUREZA" />
        </Field>
        <Field label="Disciplina" required error={errors.disciplina}>
          <input {...inp("disciplina")} placeholder="Ex: QUÍMICA" />
        </Field>
      </div>
      <Field label="Assunto" required error={errors.assunto}>
        <input {...inp("assunto")} placeholder="Ex: Propriedades Químicas" />
      </Field>
      <Field label="Enunciado" required error={errors.enunciado}>
        <textarea {...inp("enunciado")} rows={4} placeholder="Digite o enunciado da questão..."
          style={{ ...inputStyle(errors.enunciado), resize: "vertical" }} />
      </Field>
      <Field label="URL da Imagem" hint="Opcional. Deve começar com http:// ou https://">
        <input {...inp("imagem_url")} placeholder="https://..." />
      </Field>

      {/* Alternativas */}
      {form.tipo === "OBJETIVA" && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.gray600, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 10 }}>
            Alternativas
          </div>
          {form.alternativas.map((alt, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: C.crimson, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, flexShrink: 0,
                fontFamily: "'JetBrains Mono', monospace",
              }}>{alt.letra}</div>
              <input
                value={alt.texto}
                onChange={e => {
                  const alts = [...form.alternativas];
                  alts[i] = { ...alts[i], texto: e.target.value };
                  set("alternativas", alts);
                }}
                placeholder={`Texto da alternativa ${alt.letra}...`}
                style={inputStyle()}
              />
            </div>
          ))}
        </div>
      )}

      {/* Gabarito */}
      <div style={{ background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 6, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.gray600, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
          Gabarito (opcional)
        </div>
        {form.tipo === "OBJETIVA" ? (
          <Field label="Alternativa Correta">
            <select style={inputStyle()} value={form.gabarito?.alternativaCorreta?.letra || ""}
              onChange={e => set("gabarito", {
                ...form.gabarito,
                alternativaCorreta: form.alternativas.find(a => a.letra === e.target.value) || null,
              })}>
              <option value="">Selecione</option>
              {form.alternativas.map(a => <option key={a.letra} value={a.letra}>{a.letra}</option>)}
            </select>
          </Field>
        ) : (
          <Field label="Resposta Esperada">
            <textarea
              value={form.gabarito?.res_esperada || ""}
              onChange={e => set("gabarito", { ...form.gabarito, res_esperada: e.target.value })}
              rows={3} style={{ ...inputStyle(), resize: "vertical" }}
              placeholder="Descreva a resposta esperada..."
            />
          </Field>
        )}
        <Field label="Fonte Oficial">
          <input
            value={form.gabarito?.fonte_oficial || ""}
            onChange={e => set("gabarito", { ...form.gabarito, fonte_oficial: e.target.value })}
            style={inputStyle()} placeholder="Ex: Gabarito Oficial UEMA 2026"
          />
        </Field>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn label="Cancelar" variant="ghost" onClick={onCancel} />
        <Btn label={loading ? "Salvando…" : "Salvar Questão"} icon="check" onClick={handleSubmit} disabled={loading} />
      </div>
    </div>
  );
};

const QuestoesPage = ({ questoes, provas, onRefresh, toast }) => {
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [filterProva, setFilterProva] = useState("");
  const [filterTipo, setFilterTipo] = useState("");

  const filtered = questoes.filter(q => {
    const matchSearch = q.disciplina?.toLowerCase().includes(search.toLowerCase())
      || q.assunto?.toLowerCase().includes(search.toLowerCase())
      || q.area_conhecimento?.toLowerCase().includes(search.toLowerCase());
    const matchProva = !filterProva || q.prova?.id == filterProva;
    const matchTipo = !filterTipo || q.tipo === filterTipo;
    return matchSearch && matchProva && matchTipo;
  });

  const handleSave = async (data) => {
    try {
      if (modal === "create") {
        await api("/questoes", { method: "POST", body: JSON.stringify(data) });
        toast("Questão criada com sucesso!", "ok");
      } else {
        await api(`/questoes/${modal.id}`, { method: "PUT", body: JSON.stringify(data) });
        toast("Questão atualizada!", "ok");
      }
      setModal(null);
      onRefresh();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api(`/questoes/${id}`, { method: "DELETE" });
      toast("Questão excluída.", "ok");
      setDeleting(null);
      onRefresh();
    } catch (e) {
      toast(e.message, "error");
      setDeleting(null);
    }
  };

  return (
    <div style={{ padding: 32, animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..." style={{ ...inputStyle(), paddingLeft: 36, width: 200 }} />
            <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
              <Icon name="search" size={16} color={C.gray400} />
            </div>
          </div>
          <select style={{ ...inputStyle(), width: 200 }} value={filterProva} onChange={e => setFilterProva(e.target.value)}>
            <option value="">Todas as provas</option>
            {provas.map(p => <option key={p.id} value={p.id}>{p.codigo_prova}</option>)}
          </select>
          <select style={{ ...inputStyle(), width: 150 }} value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
            <option value="">Todos os tipos</option>
            <option value="OBJETIVA">Objetiva</option>
            <option value="DISCURSIVA">Discursiva</option>
          </select>
        </div>
        <Btn label="Nova Questão" icon="plus" onClick={() => setModal("create")} />
      </div>

      <div style={{ background: "#fff", border: `1px solid ${C.gray100}`, borderRadius: 6, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.black }}>
              {["Nº", "Prova", "Disciplina", "Assunto", "Tipo", "Dif.", "Ações"].map(h => (
                <th key={h} style={{
                  padding: "11px 16px", textAlign: "left",
                  fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: C.gray400, fontSize: 14 }}>
                Nenhuma questão encontrada
              </td></tr>
            ) : filtered.map((q, i) => (
              <tr key={q.id} style={{ borderBottom: `1px solid ${C.gray100}`, background: i % 2 === 0 ? "#fff" : C.gray50 }}>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: C.crimson }}>{q.numero_na_prova}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: C.gray400, fontFamily: "'JetBrains Mono', monospace" }}>
                  {q.prova?.codigo_prova || "—"}
                </td>
                <td style={{ padding: "12px 16px", fontSize: 14 }}>{q.disciplina}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: C.gray600, maxWidth: 200 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.assunto}</div>
                </td>
                <td style={{ padding: "12px 16px" }}><Badge label={q.tipo} /></td>
                <td style={{ padding: "12px 16px" }}><Badge label={q.dificuldade} /></td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn small label="" icon="edit" variant="ghost" onClick={() => setModal(q)} />
                    <Btn small label="" icon="trash" variant="danger" onClick={() => setDeleting(q)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${C.gray100}`, fontSize: 12, color: C.gray400, fontFamily: "'JetBrains Mono', monospace" }}>
          {filtered.length} questão(ões) exibida(s) · {questoes.length} total
        </div>
      </div>

      {modal && (
        <Modal title={modal === "create" ? "Nova Questão" : `Editar Questão Nº ${modal.numero_na_prova}`} onClose={() => setModal(null)}>
          <QuestaoForm initial={modal === "create" ? null : modal} provas={provas} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {deleting && (
        <Modal title="Confirmar Exclusão" onClose={() => setDeleting(null)}>
          <p style={{ fontSize: 15, color: C.gray800, marginBottom: 20 }}>
            Excluir questão <strong>Nº {deleting.numero_na_prova}</strong> — {deleting.disciplina}?
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn label="Cancelar" variant="ghost" onClick={() => setDeleting(null)} />
            <Btn label="Excluir" icon="trash" variant="primary" onClick={() => handleDelete(deleting.id)} />
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── VISUALIZAR PROVA (modo aluno) ────────────────────────────────────────────
const VisualizarProva = ({ provas, questoes }) => {
  const [selectedProva, setSelectedProva] = useState(provas[0]?.id || "");
  const [respostas, setRespostas] = useState({});
  const [showGabarito, setShowGabarito] = useState(false);

  const prova = provas.find(p => p.id == selectedProva);
  const qs = questoes
    .filter(q => q.prova?.id == selectedProva)
    .sort((a, b) => a.numero_na_prova - b.numero_na_prova);

  const acertos = showGabarito
    ? qs.filter(q => {
        const correta = q.gabarito?.alternativaCorreta?.letra;
        return correta && respostas[q.id] === correta;
      }).length
    : 0;

  return (
    <div style={{ padding: 32, animation: "fadeIn 0.3s ease" }}>
      {/* Seletor de prova */}
      <div style={{
        background: "#fff", border: `1px solid ${C.gray100}`, borderRadius: 6,
        padding: "20px 24px", marginBottom: 24,
        display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap",
      }}>
        <div>
          <label style={{ fontSize: 11, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace", display: "block", marginBottom: 5 }}>
            Selecionar Prova
          </label>
          <select style={{ ...inputStyle(), width: 280 }} value={selectedProva} onChange={e => { setSelectedProva(e.target.value); setRespostas({}); setShowGabarito(false); }}>
            <option value="">Selecione uma prova</option>
            {provas.map(p => <option key={p.id} value={p.id}>{p.codigo_prova} — {p.ano}</option>)}
          </select>
        </div>
        {prova && (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace" }}>Fase</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.gray800 }}>{prova.fase}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace" }}>Questões</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.gray800 }}>{qs.length}</div>
            </div>
            {showGabarito && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace" }}>Acertos</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.crimson }}>{acertos}/{qs.filter(q => q.gabarito?.alternativaCorreta).length}</div>
              </div>
            )}
          </div>
        )}
        {qs.length > 0 && (
          <div style={{ marginLeft: "auto" }}>
            <Btn label={showGabarito ? "Ocultar Gabarito" : "Ver Gabarito"} icon="star" variant={showGabarito ? "ghost" : "secondary"} onClick={() => setShowGabarito(g => !g)} />
          </div>
        )}
      </div>

      {/* Questões */}
      {qs.map((q, idx) => {
        const resposta = respostas[q.id];
        const correta = q.gabarito?.alternativaCorreta?.letra;
        return (
          <div key={q.id} style={{
            background: "#fff", border: `1px solid ${C.gray100}`, borderRadius: 6,
            marginBottom: 20, overflow: "hidden",
            animation: `fadeIn 0.3s ease ${idx * 0.04}s both`,
          }}>
            {/* Header */}
            <div style={{
              padding: "12px 20px",
              background: C.black,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 4,
                  background: C.crimson, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16,
                }}>{q.numero_na_prova}</div>
                <div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {q.area_conhecimento} · {q.disciplina}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{q.assunto}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Badge label={q.tipo} />
                <Badge label={q.dificuldade} />
              </div>
            </div>

            {/* Enunciado */}
            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: C.gray800, marginBottom: 16 }}>
                {q.enunciado}
              </p>
              {q.imagem_url && (
                <img src={q.imagem_url} alt="Imagem da questão"
                  style={{ maxWidth: "100%", borderRadius: 4, marginBottom: 16, border: `1px solid ${C.gray200}` }} />
              )}

              {/* Alternativas */}
              {q.tipo === "OBJETIVA" && q.alternativas?.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.alternativas.sort((a, b) => a.letra.localeCompare(b.letra)).map(alt => {
                    const isSelected = resposta === alt.letra;
                    const isCorreta = showGabarito && correta === alt.letra;
                    const isErrada = showGabarito && isSelected && correta && correta !== alt.letra;

                    let bg = "#fff", border = C.gray200, labelBg = C.gray100, labelColor = C.gray600;
                    if (isCorreta) { bg = "#D4EDDA"; border = "#28A745"; labelBg = "#28A745"; labelColor = "#fff"; }
                    else if (isErrada) { bg = "#F8D7DA"; border = C.crimson; labelBg = C.crimson; labelColor = "#fff"; }
                    else if (isSelected) { bg = "#EBF3FB"; border = C.uemaBlue; labelBg = C.uemaBlue; labelColor = "#fff"; }

                    return (
                      <button key={alt.letra} onClick={() => !showGabarito && setRespostas(r => ({ ...r, [q.id]: alt.letra }))}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 12,
                          padding: "10px 14px", borderRadius: 5,
                          border: `1.5px solid ${border}`, background: bg,
                          cursor: showGabarito ? "default" : "pointer",
                          textAlign: "left", transition: "all 0.15s",
                          fontFamily: "'Source Serif 4', serif",
                        }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: "50%",
                          background: labelBg, color: labelColor,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700, flexShrink: 0,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>{alt.letra}</div>
                        <span style={{ fontSize: 14, lineHeight: 1.6, color: C.gray800, paddingTop: 3 }}>{alt.texto}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Gabarito discursiva */}
              {showGabarito && q.gabarito?.res_esperada && (
                <div style={{ marginTop: 16, padding: "14px 16px", background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 5 }}>
                  <div style={{ fontSize: 11, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
                    Resposta Esperada
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: C.gray800 }}>{q.gabarito.res_esperada}</p>
                </div>
              )}

              {showGabarito && q.gabarito?.fonte_oficial && (
                <div style={{ marginTop: 10, fontSize: 12, color: C.gray400, fontFamily: "'JetBrains Mono', monospace" }}>
                  Fonte: {q.gabarito.fonte_oficial}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {selectedProva && qs.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: C.gray400, fontSize: 15 }}>
          <Icon name="doc" size={40} color={C.gray200} />
          <p style={{ marginTop: 12 }}>Nenhuma questão cadastrada para esta prova.</p>
        </div>
      )}
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App({ perfil = "admin" }) {
  const [page, setPage] = useState(perfil === "admin" ? "dashboard" : "visualizar");
  const [provas, setProvas] = useState([]);
  const [questoes, setQuestoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);

  const toast = (msg, type = "ok") => setToastMsg({ msg, type });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, q] = await Promise.all([api("/provas"), api("/questoes")]);
      setProvas(p || []);
      setQuestoes(q || []);
    } catch (e) {
      toast("Erro ao conectar ao servidor. Verifique se o backend está rodando na porta 8080.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const PAGE_TITLES = {
    dashboard:  ["Painel Principal",    "Visão geral do sistema AGAA Questões"],
    provas:     ["Provas",              "Gerencie as provas do PAES/UEMA"],
    questoes:   ["Questões",            "Gerencie o banco de questões"],
    visualizar: ["Provas & Questões",   perfil === "admin" ? "Modo de visualização para o candidato" : "Selecione uma prova para visualizar as questões"],
  };

  const [title, subtitle] = PAGE_TITLES[page] || ["", ""];

  return (
    <>
      <style>{globalStyle}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar active={page} setActive={setPage} perfil={perfil} />
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Topbar title={title} subtitle={subtitle} />
          {loading ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: C.gray400 }}>
              <Spinner /> Carregando dados…
            </div>
          ) : (
            <>
              {page === "dashboard"  && perfil === "admin" && <Dashboard provas={provas} questoes={questoes} setActive={setPage} />}
              {page === "provas"     && perfil === "admin" && <ProvasPage provas={provas} onRefresh={loadData} toast={toast} />}
              {page === "questoes"   && perfil === "admin" && <QuestoesPage questoes={questoes} provas={provas} onRefresh={loadData} toast={toast} />}
              {page === "visualizar" && <VisualizarProva provas={provas} questoes={questoes} />}
            </>
          )}
        </main>
      </div>
      {toastMsg && <Toast msg={toastMsg.msg} type={toastMsg.type} onClose={() => setToastMsg(null)} />}
    </>
  );
}
