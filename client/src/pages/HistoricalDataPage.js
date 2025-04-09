"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import DashboardNav from "../components/DashboardNav"
import { useThingSpeak } from "../context/ThingSpeakContext"
import { useNodes } from "../context/NodeContext"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { FaCalendarAlt, FaSync } from "react-icons/fa"

const HistoricalDataPage = () => {
  const { nodeId } = useParams()
  const { fetchHistoricalData, historicalData, loading } = useThingSpeak()
  const { nodes, setSelectedNodeId } = useNodes()
  const [timeRange, setTimeRange] = useState(1) // Default to 1 day
  const [selectedMetric, setSelectedMetric] = useState("all")

  useEffect(() => {
    fetchHistoricalData(timeRange)
    if (nodeId) {
      setSelectedNodeId(nodeId)
    }
  }, [timeRange, nodeId, fetchHistoricalData, setSelectedNodeId])

  const handleRefresh = () => {
    fetchHistoricalData(timeRange)
  }

  const formatXAxis = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  // Function to determine which lines to show based on selected metric
  const shouldShowLine = (metric) => {
    if (selectedMetric === "all") return true
    if (selectedMetric === "temperature" && (metric === "motorTemp" || metric === "ambientTemp")) return true
    if (selectedMetric === "acceleration" && (metric === "linearX" || metric === "linearY" || metric === "linearZ"))
      return true
    if (selectedMetric === metric) return true
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="container mx-auto p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Historical Data</h1>
              <p className="text-gray-600">View historical sensor data from ThingSpeak Channel ID: 2293900</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-500" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(Number(e.target.value))}
                  className="border rounded-md p-2"
                >
                  <option value={1}>Last 24 Hours</option>
                  <option value={3}>Last 3 Days</option>
                  <option value={7}>Last 7 Days</option>
                  <option value={30}>Last 30 Days</option>
                </select>
              </div>
              <div>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="border rounded-md p-2"
                >
                  <option value="all">All Metrics</option>
                  <option value="temperature">Temperature</option>
                  <option value="acceleration">Acceleration</option>
                  <option value="motorTemp">Motor Temperature</option>
                  <option value="ambientTemp">Ambient Temperature</option>
                  <option value="motorCurrent">Motor Current</option>
                </select>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                <FaSync className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : historicalData.length === 0 ? (
            <div className="flex justify-center items-center h-96">
              <p className="text-gray-500">No historical data available for the selected time range.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Main Chart */}
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Sensor Data Over Time</h2>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatXAxis}
                        type="number"
                        domain={["dataMin", "dataMax"]}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(label) => new Date(label).toLocaleString()}
                        formatter={(value) => [value.toFixed(2), ""]}
                      />
                      <Legend />
                      {shouldShowLine("motorTemp") && (
                        <Line
                          type="monotone"
                          dataKey="motorTemp"
                          name="Motor Temperature (°C)"
                          stroke="#ff0000"
                          activeDot={{ r: 8 }}
                        />
                      )}
                      {shouldShowLine("ambientTemp") && (
                        <Line
                          type="monotone"
                          dataKey="ambientTemp"
                          name="Ambient Temperature (°C)"
                          stroke="#ff9900"
                          activeDot={{ r: 8 }}
                        />
                      )}
                      {shouldShowLine("motorCurrent") && (
                        <Line
                          type="monotone"
                          dataKey="motorCurrent"
                          name="Motor Current (A)"
                          stroke="#0000ff"
                          activeDot={{ r: 8 }}
                        />
                      )}
                      {shouldShowLine("linearX") && (
                        <Line
                          type="monotone"
                          dataKey="linearX"
                          name="Linear X (m/s²)"
                          stroke="#00cc00"
                          activeDot={{ r: 8 }}
                        />
                      )}
                      {shouldShowLine("linearY") && (
                        <Line
                          type="monotone"
                          dataKey="linearY"
                          name="Linear Y (m/s²)"
                          stroke="#9900cc"
                          activeDot={{ r: 8 }}
                        />
                      )}
                      {shouldShowLine("linearZ") && (
                        <Line
                          type="monotone"
                          dataKey="linearZ"
                          name="Linear Z (m/s²)"
                          stroke="#00cccc"
                          activeDot={{ r: 8 }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Temperature Chart */}
              {(selectedMetric === "all" || selectedMetric === "temperature") && (
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4">Temperature Data</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={formatXAxis}
                          type="number"
                          domain={["dataMin", "dataMax"]}
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(label) => new Date(label).toLocaleString()}
                          formatter={(value) => [value.toFixed(2), ""]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="motorTemp"
                          name="Motor Temperature (°C)"
                          stroke="#ff0000"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="ambientTemp"
                          name="Ambient Temperature (°C)"
                          stroke="#ff9900"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Acceleration Chart */}
              {(selectedMetric === "all" || selectedMetric === "acceleration") && (
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4">Acceleration Data</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={formatXAxis}
                          type="number"
                          domain={["dataMin", "dataMax"]}
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(label) => new Date(label).toLocaleString()}
                          formatter={(value) => [value.toFixed(2), ""]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="linearX"
                          name="Linear X (m/s²)"
                          stroke="#00cc00"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="linearY"
                          name="Linear Y (m/s²)"
                          stroke="#9900cc"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="linearZ"
                          name="Linear Z (m/s²)"
                          stroke="#00cccc"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Current Chart */}
              {(selectedMetric === "all" || selectedMetric === "motorCurrent") && (
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4">Motor Current Data</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={formatXAxis}
                          type="number"
                          domain={["dataMin", "dataMax"]}
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(label) => new Date(label).toLocaleString()}
                          formatter={(value) => [value.toFixed(2), ""]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="motorCurrent"
                          name="Motor Current (A)"
                          stroke="#0000ff"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default HistoricalDataPage
