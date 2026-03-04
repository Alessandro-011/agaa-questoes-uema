import { useState } from "react";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";

export default function App() {
  const [perfil, setPerfil] = useState(null); // null | "admin" | "user"

  if (perfil === "admin") return <Admin perfil="admin" />;
  if (perfil === "user")  return <Admin perfil="user" />;

  return <Landing onSelectPerfil={setPerfil} />;
}
