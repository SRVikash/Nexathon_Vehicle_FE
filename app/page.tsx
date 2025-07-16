import DashboardPage from "@/components/dashboard-page"
import { MapProvider } from "@/providers/map-provider"

export default function Home() {
  return (
    <MapProvider>
      <DashboardPage />
    </MapProvider>
  )
}
