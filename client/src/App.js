"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Pages
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import SimulationPage from "./pages/SimulationPage"
import HistoricalDataPage from "./pages/HistoricalDataPage"

// Context
import { AuthProvider, useAuth } from "./context/AuthContext"
import { NodeProvider } from "./context/NodeContext"
import { ThingSpeakProvider } from "./context/ThingSpeakContext"

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <NodeProvider>
        <ThingSpeakProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/simulation"
                element={
                  <ProtectedRoute>
                    <SimulationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/historical-data/:nodeId?"
                element={
                  <ProtectedRoute>
                    <HistoricalDataPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
          <ToastContainer position="top-right" autoClose={3000} />
        </ThingSpeakProvider>
      </NodeProvider>
    </AuthProvider>
  )
}

export default App
