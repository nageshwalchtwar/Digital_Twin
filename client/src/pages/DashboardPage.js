"use client"

import DashboardNav from "../components/DashboardNav"
import MapView from "../components/MapView"
import NodeInfo from "../components/NodeInfo"
import AlertPanel from "../components/AlertPanel"
import MultiNodeDashboard from "../components/MultiNodeDashboard"
import { useState } from "react"
import { FaList, FaMapMarkedAlt } from "react-icons/fa"

const DashboardPage = () => {
  const [viewMode, setViewMode] = useState("map") // map or list

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">ThingSpeak Digital Twin Dashboard</h1>
          <div className="flex gap-2">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                viewMode === "map" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setViewMode("map")}
            >
              <FaMapMarkedAlt />
              Map View
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setViewMode("list")}
            >
              <FaList />
              List View
            </button>
          </div>
        </div>

        {viewMode === "map" ? (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/2">
                <MapView />
              </div>
              <div className="w-full lg:w-1/2">
                <NodeInfo />
              </div>
            </div>
            <AlertPanel />
          </div>
        ) : (
          <div className="space-y-6">
            <MultiNodeDashboard />
            <AlertPanel />
          </div>
        )}
      </main>
    </div>
  )
}

export default DashboardPage
