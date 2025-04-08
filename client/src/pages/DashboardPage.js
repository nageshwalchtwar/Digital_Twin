import DashboardNav from "../components/DashboardNav"
import MapView from "../components/MapView"
import NodeInfo from "../components/NodeInfo"
import AlertPanel from "../components/AlertPanel"

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="container mx-auto p-4 md:p-6">
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
      </main>
    </div>
  )
}

export default DashboardPage
