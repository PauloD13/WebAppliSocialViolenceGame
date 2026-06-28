import { useEffect, useState } from "react";
import { categories as fallbackCategories } from "../data/categories.js";
import { questions as fallbackQuestions } from "../data/questions.js";
import { loadGameContent } from "../services/gameApi.js";

/**
 * Carrega categorias e perguntas da API com fallback para dados locais.
 *
 * @returns {{
 *   categories: object[],
 *   questions:  object[],
 *   contentStatus: "loading"|"api"|"fallback"|"local",
 *   contentError: string|null,
 * }}
 */
export function useContent() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [questions, setQuestions] = useState(fallbackQuestions);
  const [contentStatus, setContentStatus] = useState("loading");
  const [contentError, setContentError] = useState(null);

  useEffect(() => {
    let active = true;

    loadGameContent().then((content) => {
      if (!active) return;
      setCategories(content.categories);
      setQuestions(content.questions);
      setContentStatus(content.source);
      setContentError(content.error?.message ?? null);
    });

    return () => {
      active = false;
    };
  }, []);

  return { categories, questions, contentStatus, contentError };
}
