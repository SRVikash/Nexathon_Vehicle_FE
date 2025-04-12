"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for dock allocations
const docks = [
  { id: "A-1", zone: "A" },
  { id: "A-2", zone: "A" },
  { id: "A-3", zone: "A" },
  { id: "A-4", zone: "A" },
  { id: "B-1", zone: "B" },
  { id: "B-2", zone: "B" },
  { id: "B-3", zone: "B" },
  { id: "B-4", zone: "B" },
  { id: "C-1", zone: "C" },
  { id: "C-2", zone: "C" },
  { id: "C-3", zone: "C" },
  { id: "C-4", zone: "C" },
]

const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

// Mock allocation data
const allocations = [
  {
    dockId: "A-1",
    startTime: "8:00 AM",
    endTime: "10:00 AM",
    delivery: "DEL-3920",
    status: "completed",
    company: "Global Logistics",
  },
  {
    dockId: "A-3",
    startTime: "9:00 AM",
    endTime: "11:00 AM",
    delivery: "DEL-3921",
    status: "completed",
    company: "FastFreight Inc.",
  },
  {
    dockId: "B-1",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    delivery: "DEL-3922",
    status: "in-progress",
    company: "Express Shipping",
  },
  {
    dockId: "A-1",
    startTime: "11:00 AM",
    endTime: "1:00 PM",
    delivery: "DEL-3923",
    status: "delayed",
    company: "Prime Delivery",
  },
  {
    dockId: "C-2",
    startTime: "1:00 PM",
    endTime: "3:00 PM",
    delivery: "DEL-3924",
    status: "scheduled",
    company: "Rapid Transport",
  },
  {
    dockId: "B-4",
    startTime: "8:00 AM",
    endTime: "9:00 AM",
    delivery: "DEL-3925",
    status: "completed",
    company: "City Movers",
  },
  {
    dockId: "A-2",
    startTime: "12:00 PM",
    endTime: "2:00 PM",
    delivery: "DEL-3926",
    status: "scheduled",
    company: "Metro Shipping",
  },
  {
    dockId: "C-3",
    startTime: "2:00 PM",
    endTime: "4:00 PM",
    delivery: "DEL-3927",
    status: "scheduled",
    company: "Urban Logistics",
  },
]

export default function DockAllocationGrid() {
  const [hoveredAllocation, setHoveredAllocation] = useState<string | null>(null)

  // Helper to determine if a dock is allocated at a specific time
  const getAllocationForDockAndTime = (dockId: string, time: string) => {
    return allocations.find(
      (a) =>
        a.dockId === dockId &&
        timeSlots.indexOf(a.startTime) <= timeSlots.indexOf(time) &&
        timeSlots.indexOf(a.endTime) > timeSlots.indexOf(time),
    )
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "delayed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "scheduled":
        return "bg-slate-100 text-slate-800 border-slate-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-3 w-3 mr-1" />
      case "in-progress":
        return <Truck className="h-3 w-3 mr-1" />
      case "delayed":
        return <AlertCircle className="h-3 w-3 mr-1" />
      case "scheduled":
        return <Clock className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Time header */}
          <div className="grid grid-cols-[100px_repeat(9,1fr)] border-b">
            <div className="p-2 font-medium text-sm">Dock</div>
            {timeSlots.map((time) => (
              <div key={time} className="p-2 text-center font-medium text-sm">
                {time}
              </div>
            ))}
          </div>

          {/* Dock rows */}
          {docks.map((dock) => (
            <div
              key={dock.id}
              className={`grid grid-cols-[100px_repeat(9,1fr)] border-b ${
                dock.id === docks[docks.length - 1].id ? "" : "border-b"
              } ${dock.zone !== docks[docks.indexOf(dock) - 1]?.zone ? "border-t-2 border-t-gray-300" : ""}`}
            >
              <div className="p-2 font-medium flex items-center">
                <Badge variant="outline" className="mr-2">
                  {dock.zone}
                </Badge>
                {dock.id.split("-")[1]}
              </div>

              {/* Time slots */}
              {timeSlots.map((time) => {
                const allocation = getAllocationForDockAndTime(dock.id, time)
                const isStart = allocation && allocation.startTime === time
                const isHovered = hoveredAllocation === allocation?.delivery

                if (!allocation) {
                  return <div key={`${dock.id}-${time}`} className="p-2 border-l border-dashed border-gray-200"></div>
                }

                if (isStart) {
                  // Calculate span based on duration
                  const startIndex = timeSlots.indexOf(allocation.startTime)
                  const endIndex = timeSlots.indexOf(allocation.endTime)
                  const span = endIndex - startIndex

                  return (
                    <div
                      key={`${dock.id}-${time}`}
                      className={`p-2 border-l border-dashed border-gray-200 col-span-${span} relative`}
                      style={{ gridColumn: `span ${span}` }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-full rounded-md border ${getStatusColor(allocation.status)} p-1 text-xs cursor-pointer transition-all ${
                              isHovered ? "ring-2 ring-offset-1 ring-blue-400" : ""
                            }`}
                            onMouseEnter={() => setHoveredAllocation(allocation.delivery)}
                            onMouseLeave={() => setHoveredAllocation(null)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium truncate">{allocation.delivery}</div>
                              <Badge
                                variant="outline"
                                className={`${getStatusColor(allocation.status)} text-[10px] h-5`}
                              >
                                {getStatusIcon(allocation.status)}
                                {allocation.status.charAt(0).toUpperCase() + allocation.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <p className="font-bold">{allocation.delivery}</p>
                            <p>{allocation.company}</p>
                            <p className="text-xs text-muted-foreground">
                              {allocation.startTime} - {allocation.endTime}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )
                }

                // For continuation cells (covered by the span)
                return null
              })}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
