import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import ExerciseList from "./pages/ExerciseList";
import Exercise from "./pages/Exercise";
import Progress from "./pages/Progress";
import Admin from "./pages/Admin";
import Payment from "./pages/Payment";
import Map from "./pages/Map";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import { authService } from "./services/auth";
import { DEMO_MODE } from "./config";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import ToastProvider from "./components/ToastProvider";

function ProtectedRoute({ children }) {
  if (authService.isLoggedIn()) return children;
  if (DEMO_MODE) return children;
  return <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const user = authService.getUser();
  if (authService.isLoggedIn()) {
    if (user?.role === "admin") return children;
    return <Navigate to="/dashboard" replace />;
  }
  if (DEMO_MODE) return children;
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <ThemeProvider>
    <Router>
      <div className="bg-deco" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login defaultTab="register" />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/course/:id" element={<ProtectedRoute><ExerciseList /></ProtectedRoute>} />
        <Route path="/exercise/:id" element={<ProtectedRoute><Exercise /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/thanh-toan" element={<Payment />} />
        <Route path="/ban-do" element={<Map />} />
        <Route path="/bang-xep-hang" element={<Leaderboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastProvider />
    </Router>
    </ThemeProvider>
  );
}

export default App;
