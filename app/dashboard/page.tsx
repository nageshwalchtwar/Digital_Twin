import { MapView } from "@/components/map-view"
import { NodeInfo } from "@/components/node-info"
import { AlertPanel } from "@/components/alert-panel"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2">
          <MapView />
        </div>
        <div className="w-full lg:w-1/2">
          <NodeInfo />
        </div>
      </div>
      <AlertPanel />
    </div>
  )
}
