import { create } from "zustand"

export type NodeStatus = "active" | "warning" | "critical"

export interface Node {
  id: string
  name: string
  lat: number
  lng: number
  status: NodeStatus
  voltage?: number
  current?: number
  temperature?: number
  motorStatus?: boolean
  lastMaintenance?: string
  alerts?: string[]
}

interface NodeStore {
  nodes: Node[]
  selectedNodeId: string | null
  setNodes: (nodes: Node[]) => void
  selectNode: (id: string) => void
  getSelectedNode: () => Node | undefined
  updateNodeStatus: (id: string, status: NodeStatus) => void
}

export const useNodeStore = create<NodeStore>((set, get) => ({
  nodes: [],
  selectedNodeId: null,

  setNodes: (nodes) => set({ nodes }),

  selectNode: (id) => set({ selectedNodeId: id }),

  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get()
    return nodes.find((node) => node.id === selectedNodeId)
  },

  updateNodeStatus: (id, status) => {
    const { nodes } = get()
    const updatedNodes = nodes.map((node) => (node.id === id ? { ...node, status } : node))
    set({ nodes: updatedNodes })
  },
}))

// Add detailed data to nodes
export const enrichNodeData = () => {
  const { nodes, setNodes } = useNodeStore.getState()

  const enrichedNodes = nodes.map((node) => ({
    ...node,
    voltage: Math.floor(Math.random() * 50) + 200, // 200-250V
    current: Math.random() * 10, // 0-10A
    temperature: Math.floor(Math.random() * 30) + 20, // 20-50°C
    motorStatus: Math.random() > 0.3, // 70% chance of being on
    lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(), // Random date in last 30 days
    alerts: Math.random() > 0.7 ? ["High temperature", "Voltage fluctuation"] : [],
  }))

  setNodes(enrichedNodes)
}
