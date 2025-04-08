"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const NodeContext = createContext()

export const useNodes = () => useContext(NodeContext)

export const NodeProvider = ({ children }) => {
  const [nodes, setNodes] = useState([])
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch nodes from API
  const fetchNodes = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/api/nodes")
      setNodes(res.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching nodes:", err)
      setError("Failed to fetch nodes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchNodes()
  }, [])

  // Add a new node
  const addNode = async (nodeData) => {
    try {
      const res = await axios.post("/api/nodes", nodeData)
      setNodes([...nodes, res.data])
      return { success: true, node: res.data }
    } catch (err) {
      console.error("Error adding node:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to add node",
      }
    }
  }

  // Update a node
  const updateNode = async (id, nodeData) => {
    try {
      const res = await axios.put(`/api/nodes/${id}`, nodeData)
      setNodes(nodes.map((node) => (node._id === id ? res.data : node)))
      return { success: true, node: res.data }
    } catch (err) {
      console.error("Error updating node:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update node",
      }
    }
  }

  // Delete a node
  const deleteNode = async (id) => {
    try {
      await axios.delete(`/api/nodes/${id}`)
      setNodes(nodes.filter((node) => node._id !== id))
      if (selectedNodeId === id) {
        setSelectedNodeId(null)
      }
      return { success: true }
    } catch (err) {
      console.error("Error deleting node:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete node",
      }
    }
  }

  // Get selected node
  const getSelectedNode = () => {
    return nodes.find((node) => node._id === selectedNodeId)
  }

  // Update node status
  const updateNodeStatus = async (id, status) => {
    try {
      const res = await axios.patch(`/api/nodes/${id}/status`, { status })
      setNodes(nodes.map((node) => (node._id === id ? res.data : node)))
      return { success: true, node: res.data }
    } catch (err) {
      console.error("Error updating node status:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update node status",
      }
    }
  }

  const value = {
    nodes,
    loading,
    error,
    selectedNodeId,
    setSelectedNodeId,
    getSelectedNode,
    fetchNodes,
    addNode,
    updateNode,
    deleteNode,
    updateNodeStatus,
  }

  return <NodeContext.Provider value={value}>{children}</NodeContext.Provider>
}
