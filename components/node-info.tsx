"use client"

import type React from "react"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNodeStore, enrichNodeData } from "@/lib/node-store"
import { Activity, AlertTriangle, Battery, Thermometer, Zap } from "lucide-react"

export function NodeInfo() {
  const { nodes, selectedNodeId, getSelectedNode } = useNodeStore()
  const selectedNode = getSelectedNode()

  useEffect(() => {
    // Enrich node data with random values for demo
    enrichNodeData()
  }, [])

  if (!selectedNode) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <CardContent className="text-center p-6">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-slate-100 p-3">
              <MapIcon className="h-6 w-6 text-slate-500" />
            </div>
          </div>
          <h3 className="text-lg font-medium">No Node Selected</h3>
          <p className="text-sm text-slate-500 mt-2">Select a node on the map to view its details</p>
        </CardContent>
      </Card>
    )
  }

  const statusColor =
    selectedNode.status === "active"
      ? "bg-green-100 text-green-800"
      : selectedNode.status === "warning"
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-800"

  return (
    <Card className="h-[600px] overflow-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{selectedNode.name}</CardTitle>
          <Badge className={statusColor}>
            {selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Voltage</p>
                    <h4 className="text-2xl font-bold">{selectedNode.voltage}V</h4>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-full bg-amber-100 p-2">
                    <Activity className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Current</p>
                    <h4 className="text-2xl font-bold">{selectedNode.current?.toFixed(2)}A</h4>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-full bg-red-100 p-2">
                    <Thermometer className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Temperature</p>
                    <h4 className="text-2xl font-bold">{selectedNode.temperature}°C</h4>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`rounded-full ${selectedNode.motorStatus ? "bg-green-100" : "bg-slate-100"} p-2`}>
                    <Battery className={`h-4 w-4 ${selectedNode.motorStatus ? "text-green-600" : "text-slate-600"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Motor Status</p>
                    <h4 className="text-2xl font-bold">{selectedNode.motorStatus ? "ON" : "OFF"}</h4>
                  </div>
                </CardContent>
              </Card>
            </div>

            {selectedNode.alerts && selectedNode.alerts.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="h-5 w-5" />
                    <h4 className="font-medium">Active Alerts</h4>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {selectedNode.alerts.map((alert, index) => (
                      <li key={index} className="text-sm text-amber-700 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {alert}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="details" className="space-y-4 pt-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Node Details</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-slate-500">ID</span>
                    <span>{selectedNode.id}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-slate-500">Location</span>
                    <span>
                      {selectedNode.lat}, {selectedNode.lng}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-slate-500">Last Maintenance</span>
                    <span>{selectedNode.lastMaintenance}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-slate-500">Status</span>
                    <Badge className={statusColor}>
                      {selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Performance Metrics</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Efficiency</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uptime</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Load</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function MapIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" x2="9" y1="3" y2="18" />
      <line x1="15" x2="15" y1="6" y2="21" />
    </svg>
  )
}
