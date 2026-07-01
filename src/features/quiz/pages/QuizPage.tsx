import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSessionStore } from "../../nickname/hooks/useSessionStore";
import { useQuiz, useSubmitQuiz } from "../hooks";

export const QuizPage = () => {
  const location = useLocation();
  const trailId = (location.state as { trailId?: string } | null)?.trailId;
  const sessionId = useSessionStore((state) => state.sessionId);
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: quiz, isLoading, isError } = useQuiz({ sessionId: sessionId ?? "", trailId });
  const submitMutation = useSubmitQuiz();
  const question = quiz?.questions[currentIndex];
  const canAdvance = Boolean(question && selectedAnswers[question.id]);

  const handleAnswer = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (!question) return;
    if (currentIndex + 1 < (quiz?.questions.length ?? 0)) {
      setCurrentIndex((current) => current + 1);
      return;
    }

    const answers = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
      questionId,
      optionId,
    }));
    submitMutation.mutate(
      { sessionId: sessionId ?? "", answers },
      {
        onSuccess: (result) => {
          navigate("/results", { state: { resultId: result.resultId } });
        },
      },
    );
  };

  if (!sessionId) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10">
        <p className="text-slate-700">Você precisa iniciar uma sessão antes de começar o quiz.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <section className="mb-8 rounded-3xl bg-white p-8 shadow-lg shadow-slate-200">
        <h2 className="text-3xl font-semibold text-slate-900">Quiz</h2>
        <p className="mt-2 text-slate-600">Responda as perguntas para completar a trilha.</p>
      </section>
      {isLoading && <p className="text-slate-600">Carregando perguntas...</p>}
      {isError && <p className="text-red-600">Erro ao carregar o quiz.</p>}
      {quiz && question && (
        <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
          <div>
            <span className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Pergunta {currentIndex + 1} de {quiz.questions.length}
            </span>
            <h3 className="mt-4 text-2xl font-semibold text-slate-900">{question.question}</h3>
          </div>
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`w-full rounded-3xl border px-5 py-4 text-left transition ${selectedAnswers[question.id] === option.id ? "border-emerald-600 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
                onClick={() => handleAnswer(question.id, option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-white transition hover:bg-emerald-700 disabled:opacity-60"
              onClick={handleNext}
              disabled={!canAdvance || submitMutation.isPending}
            >
              {currentIndex + 1 < quiz.questions.length ? "Próxima" : "Enviar respostas"}
            </button>
          </div>
          {submitMutation.isError && (
            <p className="text-red-600">Erro ao enviar o quiz. Tente novamente.</p>
          )}
        </div>
      )}
    </main>
  );
};
