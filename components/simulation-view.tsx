"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, RefreshCw } from "lucide-react"

export function SimulationView() {
  const [isLoading, setIsLoading] = useState(false)
  const [simulationData, setSimulationData] = useState<any>(null)

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
    <Card className="h-[600px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Simulation View</CardTitle>
          <Button variant="outline" size="icon" onClick={loadSimulation} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-[calc(100%-5rem)]">
        {isLoading ? (
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Loading simulation...</p>
          </div>
        ) : simulationData ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden">
              {/* Placeholder for simulation visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-slate-200 rounded-lg flex items-center justify-center">
                    <TrainIcon className="h-16 w-16 text-slate-400" />
                  </div>
                  <p className="text-slate-500">Simulation loaded and ready</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Last updated: {new Date(simulationData.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Train tracks visualization */}
              <div className="absolute bottom-10 left-0 right-0 h-4 flex items-center">
                <div className="w-full h-2 bg-slate-300 relative">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 w-2 h-6 bg-slate-400"
                      style={{ left: `${i * 5}%`, top: "-2px" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="rounded-full bg-slate-100 p-4 mx-auto mb-4">
              <Play className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500">No simulation data available</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={loadSimulation}>
              Load Simulation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TrainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
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
