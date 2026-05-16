import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ChatPage from "./pages/ChatPage";

import AdminPage from "./pages/AdminPage";

import LoginPage from "./pages/LoginPage";

import RegisterPage from "./pages/RegisterPage";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<ChatPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>

              <AdminPage />

            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}