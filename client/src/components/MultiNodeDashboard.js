"use client"

import { useState } from "react"
import { useNodes } from "../context/NodeContext"
import { useThingSpeak } from "../context/ThingSpeakContext"
import { FaThermometerHalf, FaBolt, FaArrowsAlt, FaChartLine } from "react-icons/fa"
import { Link } from "react-router-dom"

const MultiNodeDashboard = () => {
  const { nodes, loading: nodesLoading, setSelectedNodeId } = useNodes()
  const { getNodeDataFromThingSpeak, loading: thingSpeakLoading } = useThingSpeak()
  const [displayMode, setDisplayMode] = useState("grid") // grid or list

  if (nodesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (nodes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">No Nodes Available</h2>
        <p className="text-gray-600 mb-4">There are no nodes configured in the system.</p>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Nodes</h2>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md ${
              displayMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setDisplayMode("grid")}
          >
            Grid
          </button>
          <button
            className={`px-3 py-1 rounded-md ${
              displayMode === "list" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setDisplayMode("list")}
          >
            List
          </button>
        </div>
      </div>

      {displayMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nodes.map((node) => {
            const thingSpeakData = getNodeDataFromThingSpeak(node._id)
            const statusColor = getStatusColor(node.status)

            return (
              <div key={node._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold">{node.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                    {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                  </span>
                </div>
                <div className="p-4">
                  {thingSpeakLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <FaThermometerHalf className="text-red-500" />
                          <div>
                            <p className="text-xs text-gray-500">Motor Temp</p>
                            <p className="font-medium">{thingSpeakData?.motorTemperature.toFixed(1) || "0.0"}°C</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaThermometerHalf className="text-yellow-500" />
                          <div>
                            <p className="text-xs text-gray-500">Ambient Temp</p>
                            <p className="font-medium">{thingSpeakData?.ambientTemperature.toFixed(1) || "0.0"}°C</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <FaBolt className="text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-500">Motor Current</p>
                            <p className="font-medium">{thingSpeakData?.motorCurrent.toFixed(2) || "0.00"}A</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaArrowsAlt className="text-green-500" />
                          <div>
                            <p className="text-xs text-gray-500">Linear Accel</p>
                            <p className="font-medium">X: {thingSpeakData?.linearX.toFixed(1) || "0.0"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-gray-50 flex justify-between">
                  <button
                    onClick={() => setSelectedNodeId(node._id)}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <Link
                    to={`/historical-data/${node._id}`}
                    className="flex items-center gap-1 text-green-500 hover:text-green-700 text-sm font-medium"
                  >
                    <FaChartLine size={14} />
                    Historical Data
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Node</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motor Temp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ambient Temp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motor Current
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nodes.map((node) => {
                const thingSpeakData = getNodeDataFromThingSpeak(node._id)
                const statusColor = getStatusColor(node.status)

                return (
                  <tr key={node._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{node.name}</div>
                      <div className="text-sm text-gray-500">ID: {node._id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {thingSpeakLoading ? (
                        <div className="animate-pulse h-4 w-12 bg-gray-200 rounded"></div>
                      ) : (
                        <div className="text-sm font-medium">
                          {thingSpeakData?.motorTemperature.toFixed(1) || "0.0"}°C
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {thingSpeakLoading ? (
                        <div className="animate-pulse h-4 w-12 bg-gray-200 rounded"></div>
                      ) : (
                        <div className="text-sm font-medium">
                          {thingSpeakData?.ambientTemperature.toFixed(1) || "0.0"}°C
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {thingSpeakLoading ? (
                        <div className="animate-pulse h-4 w-12 bg-gray-200 rounded"></div>
                      ) : (
                        <div className="text-sm font-medium">{thingSpeakData?.motorCurrent.toFixed(2) || "0.00"}A</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-4">
                        <button
                          onClick={() => setSelectedNodeId(node._id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Details
                        </button>
                        <Link to={`/historical-data/${node._id}`} className="text-green-500 hover:text-green-700">
                          History
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MultiNodeDashboard
