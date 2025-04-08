"use client"

import { useState } from "react"
import { FaPlay, FaSave } from "react-icons/fa"

const SimulationControls = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [parameters, setParameters] = useState({
    speed: 50,
    acceleration: 30,
    brakeForce: 40,
    loadWeight: 1000,
    enableWindResistance: true,
    enableFriction: true,
    trackGradient: 0,
  })

  const handleSliderChange = (name, value) => {
    setParameters({
      ...parameters,
      [name]: value,
    })
  }

  const handleInputChange = (name, value) => {
    setParameters({
      ...parameters,
      [name]: Number.parseFloat(value) || 0,
    })
  }

  const handleSwitchChange = (name, checked) => {
    setParameters({
      ...parameters,
      [name]: checked,
    })
  }

  const runSimulation = () => {
    setIsRunning(true)

    // Simulate running for 3 seconds
    setTimeout(() => {
      setIsRunning(false)
    }, 3000)
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-[600px] overflow-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Simulation Parameters</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
            <FaSave className="h-4 w-4" />
            Save
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-md ${
              isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            onClick={runSimulation}
            disabled={isRunning}
          >
            <FaPlay className="h-4 w-4" />
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="speed" className="text-sm font-medium">
                Train Speed (km/h)
              </label>
              <span className="text-sm text-gray-500">{parameters.speed}</span>
            </div>
            <input
              id="speed"
              type="range"
              min="0"
              max="200"
              step="1"
              value={parameters.speed}
              onChange={(e) => handleSliderChange("speed", Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="acceleration" className="text-sm font-medium">
                Acceleration (m/s²)
              </label>
              <span className="text-sm text-gray-500">{parameters.acceleration}</span>
            </div>
            <input
              id="acceleration"
              type="range"
              min="0"
              max="100"
              step="1"
              value={parameters.acceleration}
              onChange={(e) => handleSliderChange("acceleration", Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="brakeForce" className="text-sm font-medium">
                Brake Force (kN)
              </label>
              <span className="text-sm text-gray-500">{parameters.brakeForce}</span>
            </div>
            <input
              id="brakeForce"
              type="range"
              min="0"
              max="100"
              step="1"
              value={parameters.brakeForce}
              onChange={(e) => handleSliderChange("brakeForce", Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="loadWeight" className="block text-sm font-medium">
              Load Weight (kg)
            </label>
            <input
              id="loadWeight"
              type="number"
              value={parameters.loadWeight}
              onChange={(e) => handleInputChange("loadWeight", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="trackGradient" className="text-sm font-medium">
                Track Gradient (%)
              </label>
              <span className="text-sm text-gray-500">{parameters.trackGradient}</span>
            </div>
            <input
              id="trackGradient"
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={parameters.trackGradient}
              onChange={(e) => handleSliderChange("trackGradient", Number.parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-medium">Environmental Factors</h3>

          <div className="flex items-center justify-between">
            <label htmlFor="enableWindResistance" className="text-sm font-medium cursor-pointer">
              Wind Resistance
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                id="enableWindResistance"
                type="checkbox"
                checked={parameters.enableWindResistance}
                onChange={(e) => handleSwitchChange("enableWindResistance", e.target.checked)}
                className="sr-only"
              />
              <div
                className={`block h-6 rounded-full w-10 ${parameters.enableWindResistance ? "bg-blue-400" : "bg-gray-300"}`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${parameters.enableWindResistance ? "transform translate-x-4" : ""}`}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="enableFriction" className="text-sm font-medium cursor-pointer">
              Track Friction
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                id="enableFriction"
                type="checkbox"
                checked={parameters.enableFriction}
                onChange={(e) => handleSwitchChange("enableFriction", e.target.checked)}
                className="sr-only"
              />
              <div
                className={`block h-6 rounded-full w-10 ${parameters.enableFriction ? "bg-blue-400" : "bg-gray-300"}`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${parameters.enableFriction ? "transform translate-x-4" : ""}`}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-medium">Advanced Settings</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="motorEfficiency" className="block text-sm font-medium">
                Motor Efficiency (%)
              </label>
              <input
                id="motorEfficiency"
                type="number"
                defaultValue="85"
                min="0"
                max="100"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="powerConsumption" className="block text-sm font-medium">
                Power (kW)
              </label>
              <input
                id="powerConsumption"
                type="number"
                defaultValue="2000"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="simulationDuration" className="block text-sm font-medium">
                Duration (s)
              </label>
              <input
                id="simulationDuration"
                type="number"
                defaultValue="60"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="timeStep" className="block text-sm font-medium">
                Time Step (ms)
              </label>
              <input
                id="timeStep"
                type="number"
                defaultValue="100"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimulationControls
