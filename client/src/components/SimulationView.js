"use client"

import { useState, useEffect } from "react"
import { FaPlay, FaSync } from "react-icons/fa"

const SimulationView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [simulationData, setSimulationData] = useState(null)

  // Simulate loading the simulation
  const loadSimulation = () => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      setSimulationData({
        loaded: true,
        timestamp: new Date().toISOString(),
      })
      setIsLoading(false)
    }, 1500)
  }

  // Load simulation on mount
  useEffect(() => {
    loadSimulation()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md h-[600px]">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Simulation View</h2>
        <button
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
          onClick={loadSimulation}
          disabled={isLoading}
        >
          <FaSync className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center h-[calc(100%-5rem)]">
        {isLoading ? (
          <div className="text-center">
            <FaSync className="h-12 w-12 animate-spin text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Loading simulation...</p>
          </div>
        ) : simulationData ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
              {/* Placeholder for simulation visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                    <TrainIcon className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Simulation loaded and ready</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Last updated: {new Date(simulationData.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Train tracks visualization */}
              <div className="absolute bottom-10 left-0 right-0 h-4 flex items-center">
                <div className="w-full h-2 bg-gray-300 relative">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 w-2 h-6 bg-gray-400"
                      style={{ left: `${i * 5}%`, top: "-2px" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="rounded-full bg-gray-100 p-4 mx-auto mb-4">
              <FaPlay className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No simulation data available</p>
            <button
              className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={loadSimulation}
            >
              Load Simulation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const TrainIcon = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <path d="M8 19l-2 3" />
      <path d="M18 22l-2-3" />
      <path d="M8 15h0" />
      <path d="M16 15h0" />
    </svg>
  )
}

export default SimulationView
