"use client"

import { useState, useEffect } from "react"
import { FaExclamationTriangle, FaTools } from "react-icons/fa"
import { useNodes } from "../context/NodeContext"

const AlertPanel = () => {
  const { nodes } = useNodes()
  const [blinking, setBlinking] = useState(false)

  // Check if any node has alerts
  const hasAlerts = nodes.some((node) => node.alerts && node.alerts.length > 0)

  // Check if any node has been in critical state
  const needsMaintenance = nodes.some((node) => node.status === "critical")

  // Blink effect for alerts
  useEffect(() => {
    if (hasAlerts) {
      const interval = setInterval(() => {
        setBlinking((prev) => !prev)
      }, 1000)

      return () => clearInterval(interval)
    } else {
      setBlinking(false)
    }
  }, [hasAlerts])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className={`bg-white rounded-lg shadow-md border ${needsMaintenance ? "border-orange-300" : ""}`}>
        <div className="p-4 flex items-center gap-4">
          <div className={`rounded-full p-3 ${needsMaintenance ? "bg-orange-100" : "bg-gray-100"}`}>
            <FaTools className={`h-6 w-6 ${needsMaintenance ? "text-orange-600" : "text-gray-500"}`} />
          </div>
          <div>
            <h3 className="font-medium">Maintenance Required</h3>
            {needsMaintenance ? (
              <p className="text-sm text-orange-600">Some nodes require maintenance attention</p>
            ) : (
              <p className="text-sm text-gray-500">All nodes are operating within normal parameters</p>
            )}
          </div>
          <div className="ml-auto">
            <button
              className={`px-4 py-2 rounded-md ${
                needsMaintenance
                  ? "bg-orange-600 text-white hover:bg-orange-700"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      <div className={`bg-white rounded-lg shadow-md border ${hasAlerts && blinking ? "border-red-300" : ""}`}>
        <div className="p-4 flex items-center gap-4">
          <div
            className={`rounded-full p-3 ${hasAlerts ? "bg-red-100" : "bg-gray-100"} ${
              hasAlerts && blinking ? "animate-pulse" : ""
            }`}
          >
            <FaExclamationTriangle className={`h-6 w-6 ${hasAlerts ? "text-red-600" : "text-gray-500"}`} />
          </div>
          <div>
            <h3 className="font-medium">Active Alerts</h3>
            {hasAlerts ? (
              <p className="text-sm text-red-600">
                {nodes.filter((node) => node.alerts && node.alerts.length > 0).length} nodes have active alerts
              </p>
            ) : (
              <p className="text-sm text-gray-500">No active alerts at this time</p>
            )}
          </div>
          <div className="ml-auto">
            <button
              className={`px-4 py-2 rounded-md ${
                hasAlerts
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              View Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertPanel
