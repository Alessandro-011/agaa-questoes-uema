import { useState } from "react";

// ─── PALETTE (Maranhão + UEMA) ────────────────────────────────────────────────
const C = {
  black:    "#0A0A0A",
  blackSoft:"#111111",
  crimson:  "#C8102E",
  crimsonD: "#9B0C22",
  crimsonL: "#E8253F",
  white:    "#F5F3EE",
  offWhite: "#EAE6DC",
  uemaBlue: "#003B6F",
  uemaBluL: "#00529B",
  gold:     "#C9A84C",
  gray300:  "#8A8278",
  gray500:  "#4A4640",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${C.black};
    color: ${C.white};
    font-family: 'Cormorant Garamond', Georgia, serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes stripeSlide {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes scanline {
    0%   { top: -5%; }
    100% { top: 105%; }
  }
  @keyframes shakeX {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-10px); }
    40%       { transform: translateX(10px); }
    60%       { transform: translateX(-8px); }
    80%       { transform: translateX(6px); }
  }

  .fade-up { animation: fadeUp 0.7s cubic-bezier(.22,.68,0,1.2) both; }
  .fade-in { animation: fadeIn 0.5s ease both; }
  .shake   { animation: shakeX 0.4s ease; }

  ::selection { background: ${C.crimson}; color: #fff; }
`;

// ─── STAR DECORATIVO ──────────────────────────────────────────────────────────
const Star = ({ size = 40, color = C.crimson, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <polygon points="20,2 24,16 38,16 27,25 31,39 20,30 9,39 13,25 2,16 16,16"
      fill="none" stroke={color} strokeWidth="1.5" />
  </svg>
);

// ─── BACKGROUND ───────────────────────────────────────────────────────────────
const Background = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `
        linear-gradient(rgba(200,16,46,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(200,16,46,0.04) 1px, transparent 1px)
      `,
      backgroundSize: "80px 80px",
    }} />
    <div style={{
      position: "absolute", top: 0, left: "50%",
      width: "1px", height: "100%",
      background: `linear-gradient(to bottom, transparent, rgba(200,16,46,0.2) 30%, rgba(200,16,46,0.2) 70%, transparent)`,
    }} />
    <div style={{
      position: "absolute", width: 600, height: 600, borderRadius: "50%",
      border: "1px solid rgba(200,16,46,0.07)",
      top: "50%", left: "50%", transform: "translate(-50%, -50%)",
    }} />
    <div style={{
      position: "absolute", width: 900, height: 900, borderRadius: "50%",
      border: "1px solid rgba(200,16,46,0.04)",
      top: "50%", left: "50%", transform: "translate(-50%, -50%)",
    }} />
    <div style={{
      position: "absolute", left: 0, right: 0, height: "40px",
      background: "linear-gradient(to bottom, transparent, rgba(200,16,46,0.03), transparent)",
      animation: "scanline 8s linear infinite",
    }} />
    <Star size={300} color="rgba(200,16,46,0.03)" style={{ position: "absolute", right: -60, top: -60, animation: "rotateSlow 60s linear infinite" }} />
    <Star size={200} color="rgba(0,59,111,0.06)" style={{ position: "absolute", left: -40, bottom: -40, animation: "rotateSlow 80s linear infinite reverse" }} />
  </div>
);

// ─── CARD DE PERFIL ───────────────────────────────────────────────────────────
const ProfileCard = ({ role, title, subtitle, description, features, accentColor, icon, delay, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const isAdmin = role === "admin";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className="fade-up"
      style={{
        animationDelay: `${delay}s`,
        position: "relative",
        width: "100%",
        maxWidth: 420,
        cursor: "pointer",
        transition: "transform 0.35s cubic-bezier(.22,.68,0,1.2)",
        transform: pressed ? "scale(0.97)" : hovered ? "translateY(-6px) scale(1.01)" : "none",
      }}
    >
      <div style={{
        position: "absolute", inset: -1, borderRadius: 12,
        background: hovered ? `linear-gradient(135deg, ${accentColor}, transparent 60%)` : "transparent",
        transition: "all 0.4s ease",
      }} />

      <div style={{
        position: "relative",
        background: hovered
          ? `linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))`
          : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? accentColor : "rgba(255,255,255,0.08)"}`,
        borderRadius: 12,
        padding: "40px 36px 36px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "60%", height: "50%",
          background: `radial-gradient(ellipse at top right, ${accentColor}12, transparent 70%)`,
          transition: "opacity 0.3s",
          opacity: hovered ? 1 : 0.3,
        }} />

        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: accentColor,
          transformOrigin: "left",
          animation: "stripeSlide 0.6s cubic-bezier(.22,.68,0,1.2) both",
          animationDelay: `${delay + 0.2}s`,
        }} />

        <div style={{
          width: 64, height: 64, borderRadius: 12,
          background: `${accentColor}18`,
          border: `1px solid ${accentColor}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 28, fontSize: 28,
          transition: "all 0.3s",
          transform: hovered ? "scale(1.1)" : "scale(1)",
          animation: hovered ? "float 2.5s ease-in-out infinite" : "none",
        }}>
          {icon}
        </div>

        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, letterSpacing: "0.22em",
          color: accentColor, marginBottom: 8, textTransform: "uppercase",
        }}>
          {subtitle}
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 34, fontWeight: 800, lineHeight: 1.1,
          color: C.white, marginBottom: 14,
        }}>
          {title}
        </h2>

        <p style={{
          fontSize: 16, lineHeight: 1.65,
          color: "rgba(245,243,238,0.55)",
          marginBottom: 28, fontWeight: 300,
        }}>
          {description}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, width: "100%" }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: accentColor, flexShrink: 0, opacity: 0.8,
              }} />
              <span style={{ fontSize: 14, color: "rgba(245,243,238,0.6)", lineHeight: 1.4 }}>{f}</span>
            </div>
          ))}
        </div>

        <div style={{
          width: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", borderRadius: 8,
          background: hovered ? accentColor : `${accentColor}18`,
          border: `1px solid ${accentColor}`,
          transition: "all 0.25s ease",
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, fontWeight: 500, letterSpacing: "0.08em",
            color: hovered ? "#fff" : accentColor,
            transition: "color 0.25s",
          }}>
            {isAdmin ? "ACESSAR PAINEL" : "INICIAR PROVA"}
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={hovered ? "#fff" : accentColor} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "all 0.25s", transform: hovered ? "translateX(4px)" : "none" }}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// ─── HEADER ───────────────────────────────────────────────────────────────────
const Header = () => (
  <div className="fade-up" style={{ textAlign: "center", marginBottom: 64 }}>
    <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 28 }}>
      {[C.crimson, C.white, C.crimson].map((color, i) => (
        <div key={i} style={{
          width: 40, height: 3, borderRadius: 2,
          background: color, opacity: color === C.white ? 0.15 : 1,
          animation: `stripeSlide 0.5s cubic-bezier(.22,.68,0,1.2) both`,
          animationDelay: `${0.1 + i * 0.08}s`, transformOrigin: "left",
        }} />
      ))}
    </div>

    <div style={{ position: "relative", display: "inline-block", marginBottom: 6 }}>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(52px, 8vw, 88px)",
        fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, color: C.white,
      }}>
        AGAA
      </h1>
      <div style={{
        position: "absolute", bottom: -4, left: 0, right: 0, height: 3,
        background: `linear-gradient(to right, ${C.crimson}, ${C.crimsonL})`,
        borderRadius: 2,
        animation: "stripeSlide 0.6s cubic-bezier(.22,.68,0,1.2) 0.4s both",
        transformOrigin: "left",
      }} />
    </div>

    <div style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "clamp(10px, 1.8vw, 13px)", letterSpacing: "0.3em",
      color: C.crimson, marginTop: 12, marginBottom: 20, textTransform: "uppercase",
    }}>
      Sistema de Questões · UEMA · PAES
    </div>

    <p style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "clamp(16px, 2.2vw, 20px)",
      fontWeight: 300, fontStyle: "italic",
      color: "rgba(245,243,238,0.45)",
      maxWidth: 440, margin: "0 auto", lineHeight: 1.6,
    }}>
      Selecione seu perfil de acesso para continuar
    </p>
  </div>
);

// ─── DIVISÓRIA ────────────────────────────────────────────────────────────────
const Divider = () => (
  <div style={{
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 12, padding: "0 8px",
  }}>
    <div style={{ width: 1, height: 60, background: "rgba(200,16,46,0.2)" }} />
    <Star size={28} color="rgba(200,16,46,0.3)" />
    <div style={{ width: 1, height: 60, background: "rgba(200,16,46,0.2)" }} />
  </div>
);

// ─── RODAPÉ ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <div className="fade-in" style={{ textAlign: "center", marginTop: 64, animationDelay: "0.9s" }}>
    <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 16 }}>
      {["PAES", "UEMA", "Maranhão"].map((tag, i) => (
        <span key={i} style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, letterSpacing: "0.2em",
          color: "rgba(245,243,238,0.18)", textTransform: "uppercase",
        }}>
          {i > 0 && <span style={{ marginRight: 24, color: "rgba(200,16,46,0.25)" }}>·</span>}
          {tag}
        </span>
      ))}
    </div>
    <p style={{
      fontSize: 12, color: "rgba(245,243,238,0.15)",
      fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em",
    }}>
      © {new Date().getFullYear()} Universidade Estadual do Maranhão
    </p>
  </div>
);

// ─── MODAL LOGIN ADMIN ────────────────────────────────────────────────────────
const AdminLogin = ({ onBack, onEnter }) => {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [shake, setShake] = useState(false);
  const SENHA = "admin123";

  const handleLogin = () => {
    if (senha === SENHA) {
      onEnter();
    } else {
      setErro(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(10,10,10,0.92)",
      backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div
        className={shake ? "shake" : "fade-up"}
        style={{
          background: "rgba(17,17,17,0.95)",
          border: `1px solid rgba(200,16,46,0.3)`,
          borderRadius: 12, padding: "48px 44px",
          width: "100%", maxWidth: 400,
          boxShadow: `0 0 80px rgba(200,16,46,0.1)`,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: "rgba(200,16,46,0.12)",
            border: "1px solid rgba(200,16,46,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, margin: "0 auto 20px",
          }}>🔑</div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: "0.25em", color: C.crimson, marginBottom: 8, textTransform: "uppercase",
          }}>
            Acesso Restrito
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: C.white, marginBottom: 8 }}>
            Painel Admin
          </h2>
          <p style={{ fontSize: 14, color: "rgba(245,243,238,0.4)", lineHeight: 1.5 }}>
            Insira a senha para acessar o painel de gerenciamento
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: "block", marginBottom: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: "0.18em",
            color: "rgba(245,243,238,0.4)", textTransform: "uppercase",
          }}>
            Senha de Acesso
          </label>
          <input
            type="password"
            value={senha}
            onChange={e => { setSenha(e.target.value); setErro(false); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="••••••••"
            autoFocus
            style={{
              width: "100%", padding: "13px 16px",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${erro ? C.crimson : "rgba(255,255,255,0.1)"}`,
              borderRadius: 8, fontSize: 16,
              color: C.white, outline: "none",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.15em", transition: "border 0.2s",
            }}
          />
          {erro && (
            <p style={{ marginTop: 8, fontSize: 13, color: C.crimson, fontFamily: "'JetBrains Mono', monospace" }}>
              Senha incorreta. Tente novamente.
            </p>
          )}
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: "100%", padding: "14px",
            background: C.crimson, border: "none",
            borderRadius: 8, color: "#fff",
            fontSize: 14, fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.1em", cursor: "pointer",
            transition: "background 0.2s", marginBottom: 14,
          }}
          onMouseOver={e => e.currentTarget.style.background = C.crimsonD}
          onMouseOut={e => e.currentTarget.style.background = C.crimson}
        >
          ENTRAR NO PAINEL →
        </button>

        <button
          onClick={onBack}
          style={{
            width: "100%", padding: "11px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, color: "rgba(245,243,238,0.35)",
            fontSize: 13, cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.08em", transition: "all 0.2s",
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(245,243,238,0.6)"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(245,243,238,0.35)"; }}
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
};

// ─── EXPORT PRINCIPAL ─────────────────────────────────────────────────────────
export default function Landing({ onSelectPerfil }) {
  const [screen, setScreen] = useState("landing");

  const handleAdminEnter = () => onSelectPerfil("admin");
  const handleUserEnter  = () => onSelectPerfil("user");

  return (
    <>
      <style>{globalStyle}</style>
      <Background />

      <div style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 24px",
      }}>
        <Header />

        <div style={{
          display: "flex", flexWrap: "wrap",
          alignItems: "stretch", justifyContent: "center",
          gap: 0, width: "100%", maxWidth: 960,
        }}>
          <ProfileCard
            role="admin"
            title="Administrador"
            subtitle="Acesso Restrito"
            description="Gerencie provas, questões, alternativas e gabaritos do banco de dados PAES/UEMA."
            features={[
              "Cadastro e edição de provas",
              "Gerenciamento completo de questões",
              "Controle de gabaritos oficiais",
              "Dashboard com estatísticas",
            ]}
            accentColor={C.crimson}
            icon="🛡️"
            delay={0.25}
            onClick={() => setScreen("admin-login")}
          />

          <Divider />

          <ProfileCard
            role="user"
            title="Candidato"
            subtitle="Acesso Livre"
            description="Acesse o banco de questões, pratique com simulados e confira seus gabaritos em tempo real."
            features={[
              "Visualização de provas anteriores",
              "Prática com questões por área",
              "Correção automática com gabarito",
              "Filtros por disciplina e dificuldade",
            ]}
            accentColor={C.uemaBlue}
            icon="📚"
            delay={0.4}
            onClick={handleUserEnter}
          />
        </div>

        <Footer />
      </div>

      {screen === "admin-login" && (
        <AdminLogin
          onBack={() => setScreen("landing")}
          onEnter={handleAdminEnter}
        />
      )}
    </>
  );
}
