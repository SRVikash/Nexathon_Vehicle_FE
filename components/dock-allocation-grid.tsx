"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import axios from "axios";

dayjs.extend(utc);
dayjs.extend(timezone);

interface RawAllocation {
  delivery_id: string;
  company_name: string;
  location: string;
  start_time: string;
  end_time: string;
  status: string;
}

interface RawBlockedSlot {
  company_name: string;
  location: string;
  start_time: string;
  end_time: string;
  reason: string;
}

interface RawDockData {
  dock_section: string;
  dock_number: number;
  allocations: RawAllocation[];
  blocked_slots: RawBlockedSlot[];
}

interface Allocation {
  dockId: string;
  startTime: string;
  endTime: string;
  delivery: string;
  status: string;
  company: string;
}

const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

interface Dock {
  id: string;
  zone: string;
}

export default function DockAllocationGrid() {
  const [hoveredAllocation, setHoveredAllocation] = useState<string | null>(
    null
  );

  const [allocations, setAllocation] = useState<Allocation[]>([]);
  const [docks, setDocks] = useState<Dock[]>([]);

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const res = await axios.get(
          "http://10.91.17.75:8005/dock-allocation/",
          {
            params: { date: "14-06-2025" },
          }
        );
        const data = res.data.data;

        // Helper to format UTC time to Asia/Kolkata hh:mm A
        const formatTime = (utcTime: string) =>
          dayjs.utc(utcTime).tz("Asia/Kolkata").format("hh:mm A");

        // Flatten allocations and blocked slots into a single array
        const transformed = data.flatMap((dock: any) => {
          const dockId = `${dock.dock_section}-${dock.dock_number}`;

          const allocations = dock.allocations.map((alloc: any) => ({
            dockId,
            startTime: formatTime(alloc.start_time),
            endTime: formatTime(alloc.end_time),
            delivery: alloc.delivery_id,
            status: alloc.status,
            company: alloc.company_name,
          }));

          const blockedSlots = dock.blocked_slots.map((block: any) => ({
            dockId,
            startTime: formatTime(block.start_time),
            endTime: formatTime(block.end_time),
            delivery: "BLOCKED",
            status: block.reason,
            company: block.company_name,
          }));

          return [...allocations, ...blockedSlots];
        });

        // Map docks to your Dock type
        const mappedDocks: Dock[] = data.map((dock: any) => ({
          id: `${dock.dock_section}-${dock.dock_number}`,
          zone: dock.dock_section,
        }));

        setDocks(mappedDocks);
        setAllocation(transformed);

        console.log(transformed);
      } catch (error) {
        console.error("Error fetching dock allocations:", error);
      }
    };

    fetchAllocations();
  }, []);

  // Helper to determine if a dock is allocated at a specific time
  const getAllocationForDockAndTime = (dockId: string, time: string) => {
    return allocations.find(
      (a) =>
        a.dockId === dockId &&
        timeSlots.indexOf(a.startTime) <= timeSlots.indexOf(time) &&
        timeSlots.indexOf(a.endTime) > timeSlots.indexOf(time)
    );
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "BLOCKED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "scheduled":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "in-progress":
        return <Truck className="h-3 w-3 mr-1" />;
      case "delayed":
        return <AlertCircle className="h-3 w-3 mr-1" />;
      case "scheduled":
        return <Clock className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

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
              } ${
                dock.zone !== docks[docks.indexOf(dock) - 1]?.zone
                  ? "border-t-2 border-t-gray-300"
                  : ""
              }`}
            >
              <div className="p-2 font-medium flex items-center">
                <Badge variant="outline" className="mr-2">
                  {dock.zone}
                </Badge>
                {dock.id.split("-")[1]}
              </div>

              {/* Time slots */}
              {timeSlots.map((time) => {
                const allocation = getAllocationForDockAndTime(dock.id, time);
                const isStart = allocation && allocation.startTime === time;
                const isHovered = hoveredAllocation === allocation?.delivery;

                if (!allocation) {
                  return (
                    <div
                      key={`${dock.id}-${time}`}
                      className="p-2 border-l border-dashed border-gray-200"
                    ></div>
                  );
                }

                if (isStart) {
                  // Calculate span based on duration
                  const startIndex = timeSlots.indexOf(allocation.startTime);
                  const endIndex = timeSlots.indexOf(allocation.endTime);
                  const span = endIndex - startIndex;

                  return (
                    <div
                      key={`${dock.id}-${time}`}
                      className={`p-2 border-l border-dashed border-gray-200 col-span-${span} relative`}
                      style={{ gridColumn: `span ${span}` }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-full rounded-md border ${getStatusColor(
                              allocation.status
                            )} p-1 text-xs cursor-pointer transition-all ${
                              isHovered
                                ? "ring-2 ring-offset-1 ring-blue-400"
                                : ""
                            }`}
                            onMouseEnter={() =>
                              setHoveredAllocation(allocation.delivery)
                            }
                            onMouseLeave={() => setHoveredAllocation(null)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium truncate">
                                {allocation.delivery}
                              </div>
                              <Badge
                                variant="outline"
                                className={`${getStatusColor(
                                  allocation.status
                                )} text-[10px] h-5`}
                              >
                                {getStatusIcon(allocation.status)}
                                {allocation.status.charAt(0).toUpperCase() +
                                  allocation.status.slice(1)}
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
                  );
                }

                // For continuation cells (covered by the span)
                return null;
              })}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
