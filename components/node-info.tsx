"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNodeStore } from "@/lib/node-store"
import { Activity, AlertTriangle, Battery, Thermometer, Zap } from "lucide-react"

export function NodeInfo() {
  const { nodes, selectedNodeId, getSelectedNode } = useNodeStore()
  const selectedNode = getSelectedNode()
  const [thingSpeakData, setThingSpeakData] = useState(null)

  useEffect(() => {
    if (selectedNode) {
      fetchThingSpeakData(selectedNode.channelId, selectedNode.apiKey)
    }
  }, [selectedNode])

  const fetchThingSpeakData = async (channelId: string, apiKey: string) => {
    try {
      const response = await fetch(
        `https://api.thingspeak.com/channels/2293900/feeds.json?api_key=SMXU76RXPC1UV049`
      )
      const data = await response.json()
      setThingSpeakData(data.feeds[data.feeds.length - 1]) // Get the latest feed
    } catch (error) {
      console.error("Error fetching ThingSpeak data:", error)
    }
  }

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
            <TabsTrigger value="details">More Detailed</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Motor Temperature</p>
                    <h4 className="text-2xl font-bold">{thingSpeakData?.field1 || "N/A"}°C</h4>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-full bg-amber-100 p-2">
                    <Activity className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ambient Temperature</p>
                    <h4 className="text-2xl font-bold">{thingSpeakData?.field2 || "N/A"}°C</h4>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-full bg-red-100 p-2">
                    <Thermometer className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Linear X</p>
                    <h4 className="text-2xl font-bold">{thingSpeakData?.field3 || "N/A"}</h4>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-2">
                    <Battery className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Linear Y</p>
                    <h4 className="text-2xl font-bold">{thingSpeakData?.field4 || "N/A"}</h4>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Battery className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Linear Z</p>
                    <h4 className="text-2xl font-bold">{thingSpeakData?.field5 || "N/A"}</h4>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="rounded-full bg-yellow-100 p-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Motor Current</p>
                    <h4 className="text-2xl font-bold">{thingSpeakData?.field6 || "N/A"}A</h4>
                  </div>
                </CardContent>
              </Card>
            </div>
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