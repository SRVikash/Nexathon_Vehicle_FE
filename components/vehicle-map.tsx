"use client"

import { useEffect, useRef, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for vehicle locations
const vehicles = [
  {
    id: "VEH-1001",
    deliveryId: "DEL-3922",
    driver: "Sankalpna Mahamuni",
    status: "in-transit",
    location: { x: 40, y: 45 },
    destination: "Main Distribution Center",
    estimatedArrival: "11:15 AM",
  },
  {
    id: "VEH-1002",
    deliveryId: "DEL-3924",
    driver: "Cauvery Kesavasamy",
    status: "in-transit",
    location: { x: 65, y: 30 },
    destination: "Main Distribution Center",
    estimatedArrival: "12:30 PM",
  },
  {
    id: "VEH-1003",
    deliveryId: "DEL-3923",
    driver: "Sai",
    status: "delayed",
    location: { x: 20, y: 70 },
    destination: "Main Distribution Center",
    estimatedArrival: "11:45 AM",
  },
]

// Mock data for checkpoints
const checkpoints = [
  { id: 1, name: "Central Warehouse", location: { x: 10, y: 20 } },
  { id: 2, name: "Highway Checkpoint", location: { x: 30, y: 35 } },
  { id: 3, name: "City Entrance", location: { x: 50, y: 50 } },
  { id: 4, name: "Distribution Area", location: { x: 70, y: 65 } },
  { id: 5, name: "Main Distribution Center", location: { x: 85, y: 80 } },
]

// Mock data for routes
const routes = [
  { from: { x: 10, y: 20 }, to: { x: 30, y: 35 }, vehicle: "VEH-1001" },
  { from: { x: 30, y: 35 }, to: { x: 50, y: 50 }, vehicle: "VEH-1001" },
  { from: { x: 50, y: 50 }, to: { x: 70, y: 65 }, vehicle: "VEH-1001" },
  { from: { x: 70, y: 65 }, to: { x: 85, y: 80 }, vehicle: "VEH-1001" },

  { from: { x: 15, y: 10 }, to: { x: 40, y: 25 }, vehicle: "VEH-1002" },
  { from: { x: 40, y: 25 }, to: { x: 65, y: 30 }, vehicle: "VEH-1002" },
  { from: { x: 65, y: 30 }, to: { x: 75, y: 60 }, vehicle: "VEH-1002" },
  { from: { x: 75, y: 60 }, to: { x: 85, y: 80 }, vehicle: "VEH-1002" },

  { from: { x: 5, y: 40 }, to: { x: 20, y: 70 }, vehicle: "VEH-1003" },
  { from: { x: 20, y: 70 }, to: { x: 45, y: 75 }, vehicle: "VEH-1003" },
  { from: { x: 45, y: 75 }, to: { x: 85, y: 80 }, vehicle: "VEH-1003" },
]

export default function VehicleMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [hoveredVehicle, setHoveredVehicle] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return

      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight

      drawMap()
    }

    // Initial resize
    resizeCanvas()

    // Listen for window resize
    window.addEventListener("resize", resizeCanvas)

    // Draw the map
    function drawMap() {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      ctx.fillStyle = "#f9f7f7"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "#dbe2ef"
      ctx.lineWidth = 1

      // Draw horizontal grid lines
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw vertical grid lines
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw routes
      routes.forEach((route) => {
        const fromX = (route.from.x / 100) * canvas.width
        const fromY = (route.from.y / 100) * canvas.height
        const toX = (route.to.x / 100) * canvas.width
        const toY = (route.to.y / 100) * canvas.height

        ctx.beginPath()
        ctx.moveTo(fromX, fromY)
        ctx.lineTo(toX, toY)

        // Style based on vehicle
        if (route.vehicle === selectedVehicle || route.vehicle === hoveredVehicle) {
          ctx.strokeStyle = "#3f72af"
          ctx.lineWidth = 3
        } else {
          ctx.strokeStyle = "#dbe2ef"
          ctx.lineWidth = 2
        }

        ctx.stroke()
      })

      // Draw checkpoints
      checkpoints.forEach((checkpoint) => {
        const x = (checkpoint.location.x / 100) * canvas.width
        const y = (checkpoint.location.y / 100) * canvas.height

        // Draw checkpoint marker
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fillStyle = "#112d4e"
        ctx.fill()

        // Draw checkpoint label
        ctx.font = "12px Arial"
        ctx.fillStyle = "#112d4e"
        ctx.textAlign = "center"
        ctx.fillText(checkpoint.name, x, y - 15)
      })

      // Draw vehicles
      vehicles.forEach((vehicle) => {
        const x = (vehicle.location.x / 100) * canvas.width
        const y = (vehicle.location.y / 100) * canvas.height

        // Draw vehicle marker
        ctx.beginPath()

        // Different style for selected/hovered vehicle
        if (vehicle.id === selectedVehicle || vehicle.id === hoveredVehicle) {
          ctx.arc(x, y, 12, 0, Math.PI * 2)
          ctx.fillStyle = vehicle.status === "delayed" ? "#ffc107" : "#3f72af"
        } else {
          ctx.arc(x, y, 10, 0, Math.PI * 2)
          ctx.fillStyle = vehicle.status === "delayed" ? "#ffe082" : "#dbe2ef"
          ctx.strokeStyle = vehicle.status === "delayed" ? "#ffc107" : "#3f72af"
          ctx.lineWidth = 2
          ctx.stroke()
        }

        ctx.fill()

        // Draw vehicle icon
        ctx.fillStyle = "#ffffff"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("🚚", x, y)

        // Draw vehicle ID for selected/hovered vehicle
        if (vehicle.id === selectedVehicle || vehicle.id === hoveredVehicle) {
          ctx.font = "bold 12px Arial"
          ctx.fillStyle = "#112d4e"
          ctx.textAlign = "center"
          ctx.fillText(vehicle.id, x, y - 25)
        }
      })
    }

    // Handle mouse move for hover effects
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Check if mouse is over any vehicle
      let hovered = null
      for (const vehicle of vehicles) {
        const vehicleX = (vehicle.location.x / 100) * canvas.width
        const vehicleY = (vehicle.location.y / 100) * canvas.height

        const distance = Math.sqrt(Math.pow(mouseX - vehicleX, 2) + Math.pow(mouseY - vehicleY, 2))

        if (distance < 15) {
          hovered = vehicle.id
          break
        }
      }

      if (hovered !== hoveredVehicle) {
        setHoveredVehicle(hovered)
        drawMap()
      }
    }

    // Handle click to select vehicle
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Check if clicked on any vehicle
      let clicked = null
      for (const vehicle of vehicles) {
        const vehicleX = (vehicle.location.x / 100) * canvas.width
        const vehicleY = (vehicle.location.y / 100) * canvas.height

        const distance = Math.sqrt(Math.pow(mouseX - vehicleX, 2) + Math.pow(mouseY - vehicleY, 2))

        if (distance < 15) {
          clicked = vehicle.id
          break
        }
      }

      setSelectedVehicle(clicked === selectedVehicle ? null : clicked)
      drawMap()
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("click", handleClick)

    // Initial draw
    drawMap()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("click", handleClick)
    }
  }, [selectedVehicle, hoveredVehicle])

  // Find the selected vehicle data
  const selectedVehicleData = vehicles.find((v) => v.id === selectedVehicle)

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />

      {selectedVehicleData && (
        <Card className="absolute top-4 left-4 w-72 shadow-lg border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-primary-dark">{selectedVehicleData.id}</div>
              {selectedVehicleData.status === "delayed" && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Delayed
                </Badge>
              )}
            </div>
            <div className="text-sm mb-1">
              <span className="text-muted-foreground">Driver:</span> {selectedVehicleData.driver}
            </div>
            <div className="text-sm mb-1">
              <span className="text-muted-foreground">Delivery:</span> {selectedVehicleData.deliveryId}
            </div>
            <div className="text-sm mb-1">
              <span className="text-muted-foreground">Destination:</span> {selectedVehicleData.destination}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">ETA:</span> {selectedVehicleData.estimatedArrival}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md border border-primary-light">
        <div className="text-xs text-muted-foreground mb-1">Map Legend</div>
        <div className="flex items-center text-xs mb-1">
          <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
          <span>Vehicle</span>
        </div>
        <div className="flex items-center text-xs mb-1">
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
          <span>Delayed Vehicle</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 rounded-full bg-primary-dark mr-2"></div>
          <span>Checkpoint</span>
        </div>
      </div>
    </div>
  )
}
