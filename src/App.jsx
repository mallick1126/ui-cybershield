import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home/Home";
import Feed from "./Feed/Feed";
import Forum from "./Forum/Forum";
import Quiz from "./Quiz/Quiz";
import Navbar from "./Navbar/Navbar";
import Login from "./auth/Login/Login";
import Register from "./auth/Register/Register";
import "./App.css";
import Results from "./QuizResult/Result";
import ProtectedRoute from "./common-components/ProtectedRoute";
import ViewTest from "./ViewTest/viewTest";
import ErrorBoundary from "./common-components/ErrorBoundary";
import { ErrorHandlingProvider } from "./context/ErrorHandlingContext";

function App() {
  return (
    <ErrorHandlingProvider>
      <ErrorBoundary>
        <div className="app">
          <BrowserRouter>
            <Navbar />
            <div className="top-padding" style={{ paddingTop: "70px" }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="quiz" element={<Quiz />} />
                <Route path="feed" element={<Feed />} />
                <Route path="forum" element={<Forum />} />
                <Route path="auth">
                  <Route index element={<Navigate to="/auth/login" replace />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Route>
                <Route
                  path="/results"
                  element={
                    <ProtectedRoute>
                      <Results />
                    </ProtectedRoute>
                  }
                />
                <Route path="viewtest" element={<ViewTest />} />
              </Routes>
            </div>
          </BrowserRouter>
        </div>
      </ErrorBoundary>
    </ErrorHandlingProvider>
  );
}

export default App;
