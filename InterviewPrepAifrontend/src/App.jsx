import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import SessionAnalysis from "./pages/InterviewPrep/SessionAnalysis";
import ProtectedRoute from "./components/Layouts/ProtectedRoute";
import CookieConsent from "./components/CookieConsent";
import Loader from "./components/Loader";
import ScrollToTopButton from "./components/ScrollToTopButton";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && <Loader />}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviewprep"
            element={
              <ProtectedRoute>
                <InterviewPrep />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session-analysis"
            element={
              <ProtectedRoute>
                <SessionAnalysis />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
            background: "#12121a",
            color: "#e0e0e8",
            border: "1px solid #1e1e2e",
          },
        }}
      />
      <ScrollToTopButton />
      <CookieConsent />
    </>
  );
};

export default App;
