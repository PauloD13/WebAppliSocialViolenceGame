import { useContext } from "react";
import GameContext from "../context/GameContext.js";

/**
 * Hook de consumo do contexto do jogo.
 *
 * Interface pública idêntica à versão anterior — nenhuma página precisa
 * ser alterada para usar o novo sistema.
 *
 * @returns {import("../context/GameProvider.jsx").GameContextValue}
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame() deve ser usado dentro de <GameProvider>.");
  }
  return context;
}
