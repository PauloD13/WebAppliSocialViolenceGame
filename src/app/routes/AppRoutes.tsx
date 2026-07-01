import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { EntrancePage } from "../../features/nickname/pages/EntrancePage";
import { TrailsPage } from "../../features/trails/pages/TrailsPage";
import { QuizPage } from "../../features/quiz/pages/QuizPage";
import { ResultsPage } from "../../features/results/pages/ResultsPage";
import { RankingPage } from "../../features/ranking/pages";
import { ContextPage } from "../../features/content/pages/ContextPage";
import { LessonsPage } from "../../features/lessons/pages";
import { RealtimePage } from "../../features/realtime/pages";
import { AboutPage } from "../../features/about/pages";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EntrancePage />} />
      <Route path="/trails" element={<TrailsPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="/content" element={<ContextPage />} />
      <Route path="/lessons" element={<LessonsPage />} />
      <Route path="/realtime" element={<RealtimePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
