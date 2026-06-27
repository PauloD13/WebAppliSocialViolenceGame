import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Não mostrar na tela de entrada
  if (currentPath === "/") return null;

  const isActive = (path) => {
    if (path === "/trail" && currentPath === "/trail") return true;
    if (path === "/learn-more" && currentPath === "/learn-more") return true;
    if (path === "/about" && currentPath === "/about") return true;
    return false;
  };

  const navItems = [
    { path: "/trail", icon: "map", label: "Trilha", fill: isActive("/trail") },
    { path: "/learn-more", icon: "school", label: "Saber mais", fill: isActive("/learn-more") },
    { path: "/about", icon: "info", label: "Sobre nós", fill: isActive("/about") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 glass-nav border-t-2 border-[#bccbb2] rounded-t-xl px-4 py-2 flex justify-around items-center h-20">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all hover:bg-[#dce6d2] active:scale-95 ${
            isActive(item.path) ? "text-[#136e00]" : "text-[#3d4b37]"
          }`}
        >
          <span
            className="material-symbols-outlined text-[28px]"
            style={{
              fontVariationSettings: item.fill
                ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
            }}
          >
            {item.icon}
          </span>
          <span className="text-[10px] font-bold mt-0.5 font-headline">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
