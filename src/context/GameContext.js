import { createContext } from "react";

/**
 * Contexto global do jogo.
 * Consumido via useGame() — nunca diretamente.
 */
const GameContext = createContext(null);

export default GameContext;
