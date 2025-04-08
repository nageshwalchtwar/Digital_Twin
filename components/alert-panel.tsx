"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNodeStore } from "@/lib/node-store"
import { AlertTriangle, PenToolIcon as Tool } from "lucide-react"

export function AlertPanel() {
  const { nodes } = useNodeStore()
  const [blinking, setBlinking] = useState(false)

  // Check if any node has alerts
  const hasAlerts = nodes.some((node) => node.alerts && node.alerts.length > 0)

  // Check if any node has been in critical state for "a day"
  // For demo purposes, we'll just check if any node is in critical state
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
      <Card className={`border ${needsMaintenance ? "border-orange-300" : ""}`}>
        <CardContent className="p-4 flex items-center gap-4">
          <div className={`rounded-full p-3 ${needsMaintenance ? "bg-orange-100" : "bg-slate-100"}`}>
            <Tool className={`h-6 w-6 ${needsMaintenance ? "text-orange-600" : "text-slate-500"}`} />
          </div>
          <div>
            <h3 className="font-medium">Maintenance Required</h3>
            {needsMaintenance ? (
              <p className="text-sm text-orange-600">Some nodes require maintenance attention</p>
            ) : (
              <p className="text-sm text-slate-500">All nodes are operating within normal parameters</p>
            )}
          </div>
          <div className="ml-auto">
            <Button
              variant={needsMaintenance ? "default" : "outline"}
              className={needsMaintenance ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className={`border ${hasAlerts && blinking ? "border-red-300" : ""}`}>
        <CardContent className="p-4 flex items-center gap-4">
          <div
            className={`rounded-full p-3 ${hasAlerts ? "bg-red-100" : "bg-slate-100"} ${hasAlerts && blinking ? "animate-pulse" : ""}`}
          >
            <AlertTriangle className={`h-6 w-6 ${hasAlerts ? "text-red-600" : "text-slate-500"}`} />
          </div>
          <div>
            <h3 className="font-medium">Active Alerts</h3>
            {hasAlerts ? (
              <p className="text-sm text-red-600">
                {nodes.filter((node) => node.alerts && node.alerts.length > 0).length} nodes have active alerts
              </p>
            ) : (
              <p className="text-sm text-slate-500">No active alerts at this time</p>
            )}
          </div>
          <div className="ml-auto">
            <Button
              variant={hasAlerts ? "default" : "outline"}
              className={hasAlerts ? "bg-red-600 hover:bg-red-700" : ""}
            >
              View Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
