import React from "react";
import { Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameProvider.jsx";
import Entry from "./pages/Entry.jsx";
import Trail from "./pages/Trail.jsx";
import Context from "./pages/Context.jsx";
import Question from "./pages/Question.jsx";
import Feedback from "./pages/Feedback.jsx";
import Conclusion from "./pages/Conclusion.jsx";
import LearnMore from "./pages/LearnMore.jsx";
import About from "./pages/About.jsx";
import BottomNav from "./components/BottomNav.jsx";

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-[#f3fde9] text-[#151e12] font-body overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Entry />} />
          <Route path="/trail" element={<Trail />} />
          <Route path="/context/:categoryId" element={<Context />} />
          <Route path="/question/:categoryId" element={<Question />} />
          <Route path="/feedback/:categoryId" element={<Feedback />} />
          <Route path="/conclusion" element={<Conclusion />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <BottomNav />
      </div>
    </GameProvider>
  );
}

export default App;
