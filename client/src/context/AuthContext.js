"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in (via token in localStorage)
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token")

      if (token) {
        try {
          // Set auth header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

          // Verify token with backend
          const res = await axios.get("/api/auth/verify")

          if (res.data.user) {
            setCurrentUser(res.data.user)
            setIsAuthenticated(true)
          } else {
            // Invalid token
            localStorage.removeItem("token")
            delete axios.defaults.headers.common["Authorization"]
          }
        } catch (error) {
          console.error("Auth verification error:", error)
          localStorage.removeItem("token")
          delete axios.defaults.headers.common["Authorization"]
        }
      }

      setLoading(false)
    }

    checkLoggedIn()
  }, [])

  // Login function
  const login = async (username, password) => {
    try {
      const res = await axios.post("/api/auth/login", { username, password })

      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
        setCurrentUser(res.data.user)
        setIsAuthenticated(true)
        return { success: true }
      }
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message)
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please try again.",
      }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
