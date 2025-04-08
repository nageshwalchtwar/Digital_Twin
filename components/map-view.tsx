"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { MapPin, Plus, Trash2 } from "lucide-react"
import { useNodeStore } from "@/lib/node-store"
import L from "leaflet" // Import Leaflet

// Mock initial nodes
const initialNodes = [
  { id: "1", name: "Node 1", lat: 51.505, lng: -0.09, status: "active" },
  { id: "2", name: "Node 2", lat: 51.51, lng: -0.1, status: "warning" },
  { id: "3", name: "Node 3", lat: 51.515, lng: -0.09, status: "critical" },
]

export function MapView() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newNode, setNewNode] = useState({ name: "", lat: "", lng: "" })

  const { nodes, setNodes, selectNode } = useNodeStore()

  useEffect(() => {
    // Initialize nodes from mock data
    if (nodes.length === 0) {
      setNodes(initialNodes)
    }

    // Initialize Leaflet map
    if (typeof window !== "undefined" && !map) {
      import("leaflet").then((L) => {
        // Fix icon paths for Leaflet
        import("leaflet/dist/leaflet.css")

        // Fix default icon issue
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        })

        // Create map if it doesn't exist
        if (mapRef.current && !map) {
          const newMap = L.map(mapRef.current).setView([51.505, -0.09], 13)

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(newMap)

          setMap(newMap)
        }
      })
    }

    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [])

  // Update markers when nodes or map changes
  useEffect(() => {
    if (map && nodes.length > 0) {
      // Clear existing markers
      markers.forEach((marker) => marker.remove())

      // Add new markers
      const newMarkers = nodes.map((node) => {
        const marker = L.marker([node.lat, node.lng])
          .addTo(map)
          .bindPopup(node.name)
          .on("click", () => {
            selectNode(node.id)
          })

        return marker
      })

      setMarkers(newMarkers)
    }
  }, [map, nodes])

  const handleAddNode = () => {
    if (!newNode.name || !newNode.lat || !newNode.lng) {
      return
    }

    const lat = Number.parseFloat(newNode.lat)
    const lng = Number.parseFloat(newNode.lng)

    if (isNaN(lat) || isNaN(lng)) {
      return
    }

    const newNodeObj = {
      id: Date.now().toString(),
      name: newNode.name,
      lat,
      lng,
      status: "active",
    }

    setNodes([...nodes, newNodeObj])
    setNewNode({ name: "", lat: "", lng: "" })
    setIsAddDialogOpen(false)
  }

  const handleRemoveNode = (id: string) => {
    setNodes(nodes.filter((node) => node.id !== id))
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Node Map</CardTitle>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus size={16} />
                  Add Node
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Node</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Node Name</Label>
                    <Input
                      id="name"
                      value={newNode.name}
                      onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
                      placeholder="Enter node name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        value={newNode.lat}
                        onChange={(e) => setNewNode({ ...newNode, lat: e.target.value })}
                        placeholder="e.g. 51.505"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        value={newNode.lng}
                        onChange={(e) => setNewNode({ ...newNode, lng: e.target.value })}
                        placeholder="e.g. -0.09"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNode}>Add Node</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative">
        <div ref={mapRef} className="h-full w-full z-0" />
      </CardContent>
      <div className="p-4 border-t">
        <h3 className="text-sm font-medium mb-2">Node List</h3>
        <div className="max-h-32 overflow-y-auto">
          <ul className="space-y-1">
            {nodes.map((node) => (
              <li key={node.id} className="flex items-center justify-between text-sm p-2 hover:bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <MapPin
                    size={14}
                    className={
                      node.status === "active"
                        ? "text-green-500"
                        : node.status === "warning"
                          ? "text-amber-500"
                          : "text-red-500"
                    }
                  />
                  <span>{node.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-500 hover:text-red-500"
                  onClick={() => handleRemoveNode(node.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}
