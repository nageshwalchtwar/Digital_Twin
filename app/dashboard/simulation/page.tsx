import { SimulationView } from "@/components/simulation-view"
import { SimulationControls } from "@/components/simulation-controls"

export default function SimulationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Train Model Simulation</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2">
          <SimulationView />
        </div>
        <div className="w-full lg:w-1/2">
          <SimulationControls />
        </div>
      </div>
    </div>
  )
}
