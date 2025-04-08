import DashboardNav from "../components/DashboardNav"
import SimulationView from "../components/SimulationView"
import SimulationControls from "../components/SimulationControls"

const SimulationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="container mx-auto p-4 md:p-6">
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
      </main>
    </div>
  )
}

export default SimulationPage
