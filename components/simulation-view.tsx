// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Play, RefreshCw } from "lucide-react"

// export function SimulationView() {
//   const [isLoading, setIsLoading] = useState(false)
//   const [simulationData, setSimulationData] = useState<any>(null)

//   // Simulate loading the simulation
//   const loadSimulation = () => {
//     setIsLoading(true)

//     // Simulate API call delay
//     setTimeout(() => {
//       setSimulationData({
//         loaded: true,
//         timestamp: new Date().toISOString(),
//       })
//       setIsLoading(false)
//     }, 1500)
//   }

//   // Load simulation on mount
//   useEffect(() => {
//     loadSimulation()
//   }, [])

//   return (
//     <Card className="h-[600px]">
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <CardTitle>Simulation View</CardTitle>
//           <Button variant="outline" size="icon" onClick={loadSimulation} disabled={isLoading}>
//             <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent className="flex flex-col items-center justify-center h-[calc(100%-5rem)]">
//         {isLoading ? (
//           <div className="text-center">
//             <RefreshCw className="h-12 w-12 animate-spin text-slate-300 mx-auto mb-4" />
//             <p className="text-slate-500">Loading simulation...</p>
//           </div>
//         ) : simulationData ? (
//           <div className="w-full h-full flex flex-col items-center justify-center">
//             <div className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden">
//               {/* Placeholder for simulation visualization */}
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="text-center">
//                   <div className="w-32 h-32 mx-auto mb-4 bg-slate-200 rounded-lg flex items-center justify-center">
//                     <TrainIcon className="h-16 w-16 text-slate-400" />
//                   </div>
//                   <p className="text-slate-500">Simulation loaded and ready</p>
//                   <p className="text-xs text-slate-400 mt-1">
//                     Last updated: {new Date(simulationData.timestamp).toLocaleTimeString()}
//                   </p>
//                 </div>
//               </div>

//               {/* Train tracks visualization */}
//               <div className="absolute bottom-10 left-0 right-0 h-4 flex items-center">
//                 <div className="w-full h-2 bg-slate-300 relative">
//                   {Array.from({ length: 20 }).map((_, i) => (
//                     <div
//                       key={i}
//                       className="absolute top-0 w-2 h-6 bg-slate-400"
//                       style={{ left: `${i * 5}%`, top: "-2px" }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center">
//             <div className="rounded-full bg-slate-100 p-4 mx-auto mb-4">
//               <Play className="h-8 w-8 text-slate-400" />
//             </div>
//             <p className="text-slate-500">No simulation data available</p>
//             <Button variant="outline" size="sm" className="mt-4" onClick={loadSimulation}>
//               Load Simulation
//             </Button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// function TrainIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <rect x="4" y="3" width="16" height="16" rx="2" />
//       <path d="M4 11h16" />
//       <path d="M12 3v8" />
//       <path d="M8 19l-2 3" />
//       <path d="M18 22l-2-3" />
//       <path d="M8 15h0" />
//       <path d="M16 15h0" />
//     </svg>
//   )
// }











"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Download, Save, BarChart2 } from "lucide-react"

export function SimulationView() {
  const [inputParams, setInputParams] = useState({
    voltage: "",
    current: "",
    ambientTemp: "",
    duration: "",
  })
  const [outputParams, setOutputParams] = useState({
    motorTemp: "N/A",
    vibration: "N/A",
    flowRate: "N/A",
    rmse: "N/A",
  })
  const [isSimulating, setIsSimulating] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputParams((prev) => ({ ...prev, [name]: value }))
  }

  const runSimulation = () => {
    setIsSimulating(true)

    // Simulate API call or computation
    setTimeout(() => {
      setOutputParams({
        motorTemp: "75°C",
        vibration: "0.02 m/s²",
        flowRate: "10 L/min",
        rmse: "0.005",
      })
      setIsSimulating(false)
    }, 2000)
  }

  const downloadCSV = () => {
    const csvContent = `Input Parameters,Value\nVoltage,${inputParams.voltage}\nCurrent,${inputParams.current}\nAmbient Temperature,${inputParams.ambientTemp}\nDuration,${inputParams.duration}\n\nOutput Parameters,Value\nMotor Temperature,${outputParams.motorTemp}\nVibration,${outputParams.vibration}\nFlow Rate,${outputParams.flowRate}\nRMSE,${outputParams.rmse}`
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "simulation_output.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadPlots = () => {
    alert("Download plots functionality is not implemented yet.")
  }

  const showPlots = () => {
    alert("Show plots functionality is not implemented yet.")
  }

  const saveData = () => {
    alert("Save data functionality is not implemented yet.")
  }

  return (
    <Card className="h-[600px]">
      <CardHeader className="pb-3">
        <CardTitle>Simulation View</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Input and Output Section */}
        <div className="grid grid-cols-3 gap-4">
          {/* Input Parameters */}
          <div>
            <h3 className="text-lg font-medium mb-4">Input Parameters</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="voltage">Voltage</Label>
                <Input
                  id="voltage"
                  name="voltage"
                  value={inputParams.voltage}
                  onChange={handleInputChange}
                  placeholder="Enter voltage"
                />
              </div>
              <div>
                <Label htmlFor="current">Current</Label>
                <Input
                  id="current"
                  name="current"
                  value={inputParams.current}
                  onChange={handleInputChange}
                  placeholder="Enter current"
                />
              </div>
              <div>
                <Label htmlFor="ambientTemp">Ambient Temp.</Label>
                <Input
                  id="ambientTemp"
                  name="ambientTemp"
                  value={inputParams.ambientTemp}
                  onChange={handleInputChange}
                  placeholder="Enter ambient temperature"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={inputParams.duration}
                  onChange={handleInputChange}
                  placeholder="Enter duration"
                />
              </div>
            </div>
          </div>

          {/* Motor Visualization */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center">
              <Play className="h-16 w-16 text-slate-400" />
            </div>
            <p className="text-center text-sm text-slate-500 mt-2">Motor Simulation</p>
          </div>

          {/* Output Parameters */}
          <div>
            <h3 className="text-lg font-medium mb-4">Output Parameters</h3>
            <div className="space-y-3">
              <div>
                <Label>Motor Temp.</Label>
                <p className="text-sm text-slate-600">{outputParams.motorTemp}</p>
              </div>
              <div>
                <Label>Vibration</Label>
                <p className="text-sm text-slate-600">{outputParams.vibration}</p>
              </div>
              <div>
                <Label>Flow Rate</Label>
                <p className="text-sm text-slate-600">{outputParams.flowRate}</p>
              </div>
              <div>
                <Label>RMSE Value</Label>
                <p className="text-sm text-slate-600">{outputParams.rmse}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button onClick={downloadCSV} variant="outline" size="sm" className="gap-1">
              <Download size={16} />
              Download Output CSV
            </Button>
            <Button onClick={downloadPlots} variant="outline" size="sm" className="gap-1">
              <Download size={16} />
              Download Plots
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={showPlots} variant="outline" size="sm" className="gap-1">
              <BarChart2 size={16} />
              Show Plots
            </Button>
            <Button onClick={saveData} variant="outline" size="sm" className="gap-1">
              <Save size={16} />
              Save Data
            </Button>
          </div>
        </div>

        {/* Run Simulation Button */}
        <div className="flex justify-center">
          <Button onClick={runSimulation} disabled={isSimulating}>
            {isSimulating ? "Running Simulation..." : "Run Simulation"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}