"use client"

import { useState } from "react"
import { FaThermometerHalf, FaExclamationTriangle, FaBolt, FaArrowsAlt } from "react-icons/fa"
import { useNodes } from "../context/NodeContext"
import { useThingSpeak } from "../context/ThingSpeakContext"
import { Link } from "react-router-dom"

const NodeInfo = () => {
  const { getSelectedNode } = useNodes()
  const { getNodeDataFromThingSpeak, loading } = useThingSpeak()
  const [activeTab, setActiveTab] = useState("overview")

  const selectedNode = getSelectedNode()
  const thingSpeakData = selectedNode ? getNodeDataFromThingSpeak(selectedNode._id) : null

  if (!selectedNode) {
    return (
      <div className="bg-white rounded-lg shadow-md h-[600px] flex items-center justify-center">
        <div className="text-center p-6">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gray-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium">No Node Selected</h3>
          <p className="text-sm text-gray-500 mt-2">Select a node on the map to view its details</p>
        </div>
      </div>
    )
  }

  const statusColor =
    selectedNode.status === "active"
      ? "bg-green-100 text-green-800"
      : selectedNode.status === "warning"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800"

  if (loading && !thingSpeakData) {
    return (
      <div className="bg-white rounded-lg shadow-md h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-[600px] overflow-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">{selectedNode.name}</h2>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <div className="flex border-b pb-2 mb-4">
            <button
              className={`px-4 py-2 ${activeTab === "overview" ? "border-b-2 border-blue-500 text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "details" ? "border-b-2 border-blue-500 text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "thingspeak" ? "border-b-2 border-blue-500 text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("thingspeak")}
            >
              ThingSpeak Data
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4 flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-2">
                  <FaBolt className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Motor Current</p>
                  <h4 className="text-2xl font-bold">{thingSpeakData?.motorCurrent.toFixed(2) || "0.00"}A</h4>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4 flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-2">
                  <FaThermometerHalf className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Motor Temperature</p>
                  <h4 className="text-2xl font-bold">{thingSpeakData?.motorTemperature.toFixed(1) || "0.0"}°C</h4>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4 flex items-center gap-4">
                <div className="rounded-full bg-yellow-100 p-2">
                  <FaThermometerHalf className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Ambient Temperature</p>
                  <h4 className="text-2xl font-bold">{thingSpeakData?.ambientTemperature.toFixed(1) || "0.0"}°C</h4>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4 flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-2">
                  <FaArrowsAlt className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Linear Acceleration</p>
                  <h4 className="text-lg font-bold">
                    X: {thingSpeakData?.linearX.toFixed(2) || "0.00"} m/s²
                    <br />
                    Y: {thingSpeakData?.linearY.toFixed(2) || "0.00"} m/s²
                    <br />
                    Z: {thingSpeakData?.linearZ.toFixed(2) || "0.00"} m/s²
                  </h4>
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-medium mb-2">Node Details</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-gray-500">ID</span>
                    <span>{selectedNode._id}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-gray-500">Location</span>
                    <span>
                      {selectedNode.lat}, {selectedNode.lng}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-gray-500">Last Maintenance</span>
                    <span>{selectedNode.lastMaintenance || "Not available"}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                      {selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-medium mb-2">Performance Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Efficiency</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uptime</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Load</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "thingspeak" && thingSpeakData && (
            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-medium mb-2">ThingSpeak Data</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-gray-500">Motor Temperature</span>
                    <span>{thingSpeakData.motorTemperature.toFixed(1)}°C</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-gray-500">Ambient Temperature</span>
                    <span>{thingSpeakData.ambientTemperature.toFixed(1)}°C</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-gray-500">Linear X</span>
                    <span>{thingSpeakData.linearX.toFixed(2)} m/s²</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-gray-500">Linear Y</span>
                    <span>{thingSpeakData.linearY.toFixed(2)} m/s²</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-gray-500">Linear Z</span>
                    <span>{thingSpeakData.linearZ.toFixed(2)} m/s²</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-gray-500">Motor Current</span>
                    <span>{thingSpeakData.motorCurrent.toFixed(2)}A</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-gray-500">Last Updated</span>
                    <span>{new Date(thingSpeakData.lastUpdated).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-medium mb-2">Historical Data</h3>
                <p className="text-sm text-gray-600 mb-4">View detailed historical data and trends for this node.</p>
                <Link
                  to={`/historical-data/${selectedNode._id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 inline-block"
                >
                  View Historical Data
                </Link>
              </div>
            </div>
          )}

          {selectedNode.alerts && selectedNode.alerts.length > 0 && (
            <div className="mt-4 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <FaExclamationTriangle className="h-5 w-5" />
                  <h4 className="font-medium">Active Alerts</h4>
                </div>
                <ul className="mt-2 space-y-1">
                  {selectedNode.alerts.map((alert, index) => (
                    <li key={index} className="text-sm text-yellow-700 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NodeInfo
