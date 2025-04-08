"use client"

import { useState, useEffect, useRef } from "react"
import { FaMapMarkerAlt, FaPlus, FaTrashAlt } from "react-icons/fa"
import { useNodes } from "../context/NodeContext"
import { toast } from "react-toastify"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

const MapView = () => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newNode, setNewNode] = useState({ name: "", lat: "", lng: "" })

  const { nodes, loading, error, fetchNodes, addNode, deleteNode, setSelectedNodeId } = useNodes()

  // Initialize Leaflet map
  useEffect(() => {
    if (mapRef.current && !map) {
      const leafletMap = L.map(mapRef.current).setView([51.505, -0.09], 13)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMap)

      setMap(leafletMap)
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
            setSelectedNodeId(node._id)
          })

        return marker
      })

      setMarkers(newMarkers)
    }
  }, [map, nodes, setSelectedNodeId])

  const handleAddNode = async () => {
    if (!newNode.name || !newNode.lat || !newNode.lng) {
      toast.error("Please fill in all fields")
      return
    }

    const lat = Number.parseFloat(newNode.lat)
    const lng = Number.parseFloat(newNode.lng)

    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Latitude and longitude must be valid numbers")
      return
    }

    const newNodeData = {
      name: newNode.name,
      lat,
      lng,
      status: "active",
    }

    const result = await addNode(newNodeData)

    if (result.success) {
      toast.success("Node added successfully")
      setNewNode({ name: "", lat: "", lng: "" })
      setIsAddDialogOpen(false)
    } else {
      toast.error(result.message || "Failed to add node")
    }
  }

  const handleRemoveNode = async (id) => {
    const result = await deleteNode(id)

    if (result.success) {
      toast.success("Node removed successfully")
    } else {
      toast.error(result.message || "Failed to remove node")
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md h-[600px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchNodes} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Node Map</h2>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <FaPlus size={14} />
          Add Node
        </button>
      </div>

      <div className="flex-1 relative">
        <div ref={mapRef} className="h-full w-full z-0" />
      </div>

      <div className="p-4 border-t">
        <h3 className="text-sm font-medium mb-2">Node List</h3>
        <div className="max-h-32 overflow-y-auto">
          <ul className="space-y-1">
            {nodes.map((node) => (
              <li key={node._id} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt
                    size={14}
                    className={
                      node.status === "active"
                        ? "text-green-500"
                        : node.status === "warning"
                          ? "text-yellow-500"
                          : "text-red-500"
                    }
                  />
                  <span>{node.name}</span>
                </div>
                <button
                  className="h-6 w-6 flex items-center justify-center text-gray-500 hover:text-red-500"
                  onClick={() => handleRemoveNode(node._id)}
                >
                  <FaTrashAlt size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Add Node Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Node</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Node Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={newNode.name}
                  onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter node name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium mb-1">
                    Latitude
                  </label>
                  <input
                    id="latitude"
                    type="text"
                    value={newNode.lat}
                    onChange={(e) => setNewNode({ ...newNode, lat: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 51.505"
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium mb-1">
                    Longitude
                  </label>
                  <input
                    id="longitude"
                    type="text"
                    value={newNode.lng}
                    onChange={(e) => setNewNode({ ...newNode, lng: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. -0.09"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={handleAddNode} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Add Node
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView
