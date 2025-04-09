"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { FaChartBar, FaPlayCircle, FaSignOutAlt, FaChartLine } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"

const DashboardNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.info("You have been logged out")
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="font-bold text-xl text-gray-800">
            ThingSpeak Digital Twin
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              location.pathname === "/dashboard" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaChartBar size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/historical-data"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              location.pathname.includes("/historical-data")
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaChartLine size={18} />
            <span>Historical Data</span>
          </Link>

          <Link
            to="/simulation"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              location.pathname === "/simulation" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaPlayCircle size={18} />
            <span>Simulation</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-red-500 hover:bg-red-50"
          >
            <FaSignOutAlt size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  )
}

export default DashboardNav
