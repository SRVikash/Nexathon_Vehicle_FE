"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, MapPin, Clock, AlertTriangle, Truck, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api"
import { addMinutes, format } from "date-fns"

// Mock data for vehicle tracking
const vehicles = [
  {
    id: "VEH-1001",
    deliveryId: "DEL-3922",
    driver: {
      name: "Sankalpna Mahamuni",
      avatar: "SM",
      phone: "+1 (555) 123-4567",
    },
    vehicle: {
      type: "Truck",
      licensePlate: "XYZ-1234",
      capacity: "20 tons",
    },
    origin: "Guindy",
    destination: "Ekkatuthangal",
    estimatedArrival: "11:15 AM",
    status: "in-transit",
    progress: 0,
    location: { lat: 40.7128, lng: -74.006 },
    checkpoints: [
      {
        id: 1,
        name: "TVS Next Olympia Cyberspace",
        location: "Guindy",
        status: "completed",
        estimatedTime: "",
        actualTime: "",
        notes: "Loaded and departed on schedule",
      },
      {
        id: 2,
        name: "Ekkatuthangal Metro Station",
        location: "Ekkatuthangal",
        status: "upcoming",
        estimatedTime: "11:15 AM",
        actualTime: null,
        notes: "",
      },
    ],
  },
  {
    id: "VEH-1002",
    deliveryId: "DEL-3924",
    driver: {
      name: "Cauvery Kesavasamy",
      avatar: "EW",
      phone: "+1 (555) 987-6543",
    },
    vehicle: {
      type: "Van",
      licensePlate: "ABC-5678",
      capacity: "5 tons",
    },
    origin: "East Supplier Hub",
    destination: "Main Distribution Center",
    estimatedArrival: "12:30 PM",
    status: "in-transit",
    progress: 40,
    location: { lat: 40.7282, lng: -73.994 },
    checkpoints: [
      {
        id: 1,
        name: "Departure",
        location: "East Supplier Hub",
        status: "completed",
        estimatedTime: "10:00 AM",
        actualTime: "10:05 AM",
        notes: "Loaded and departed on schedule",
      },
      {
        id: 2,
        name: "Toll Booth",
        location: "East Bridge Crossing",
        status: "completed",
        estimatedTime: "10:30 AM",
        actualTime: "10:40 AM",
        notes: "Slight delay at toll booth",
      },
      {
        id: 3,
        name: "Highway Exit",
        location: "Exit 27, Industrial Route",
        status: "current",
        estimatedTime: "11:15 AM",
        actualTime: "11:20 AM",
        notes: "Taking industrial route to avoid traffic",
      },
      {
        id: 4,
        name: "City Limits",
        location: "Western Entrance",
        status: "upcoming",
        estimatedTime: "11:45 AM",
        actualTime: null,
        notes: "",
      },
      {
        id: 5,
        name: "Dock Arrival",
        location: "Main Distribution Center",
        status: "upcoming",
        estimatedTime: "12:30 PM",
        actualTime: null,
        notes: "",
      },
    ],
  },
  {
    id: "VEH-1003",
    deliveryId: "DEL-3923",
    driver: {
      name: "Sai",
      avatar: "RJ",
      phone: "+1 (555) 456-7890",
    },
    vehicle: {
      type: "Truck",
      licensePlate: "DEF-9012",
      capacity: "15 tons",
    },
    origin: "North Logistics Center",
    destination: "Main Distribution Center",
    estimatedArrival: "11:45 AM",
    status: "delayed",
    progress: 50,
    location: { lat: 40.7053, lng: -74.014 },
    checkpoints: [
      {
        id: 1,
        name: "Departure",
        location: "North Logistics Center",
        status: "completed",
        estimatedTime: "9:00 AM",
        actualTime: "9:15 AM",
        notes: "Delayed departure due to loading issues",
      },
      {
        id: 2,
        name: "Highway Entrance",
        location: "North Highway Ramp",
        status: "completed",
        estimatedTime: "9:30 AM",
        actualTime: "9:50 AM",
        notes: "Traffic congestion at entrance",
      },
      {
        id: 3,
        name: "Rest Area",
        location: "Mile 78 Rest Stop",
        status: "completed",
        estimatedTime: "10:15 AM",
        actualTime: "10:40 AM",
        notes: "Required driver break",
      },
      {
        id: 4,
        name: "City Entrance",
        location: "North Gate",
        status: "current",
        estimatedTime: "11:00 AM",
        actualTime: "11:30 AM",
        notes: "Delayed due to accident on highway",
      },
      {
        id: 5,
        name: "Dock Arrival",
        location: "Main Distribution Center",
        status: "upcoming",
        estimatedTime: "11:30 AM",
        actualTime: null,
        notes: "Expected delay of 15 minutes",
      },
    ],
  },
]

interface VehicleTrackingProps {
  preview?: boolean
}

export default function VehicleTracking({ preview = false }: VehicleTrackingProps) {
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>("VEH-1001")
  const [selectedTab, setSelectedTab] = useState("active")
  const [vehiclesData, setVehiclesData] = useState(vehicles);

  const toggleVehicle = (vehicleId: string) => {
    if (expandedVehicle === vehicleId) {
      setExpandedVehicle(null)
    } else {
      setExpandedVehicle(vehicleId)
    }
  }

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "current":
        return "bg-primary-light text-primary border-primary-light"
      case "upcoming":
        return "bg-slate-100 text-slate-800 border-slate-200"
      case "delayed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4" />
      case "current":
        return <Truck className="h-4 w-4" />
      case "upcoming":
        return <Clock className="h-4 w-4" />
      case "delayed":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  // If preview mode, only show the first vehicle
  const displayVehicles = preview ? vehiclesData.slice(0, 1) : vehiclesData

  const containerStyle = {
    width: '100%',
    height: '350px',
  }

  const position = {
    lat: 13.1862,
    lng: 80.2208,
  }

  const routeCoordinates = [
    { lat: 13.01649, lng: 80.21481 },
    { lat: 13.01608, lng: 80.21541 },
    { lat: 13.01603, lng: 80.21547 },
    { lat: 13.01589, lng: 80.21538 },
    { lat: 13.01507, lng: 80.21484 },
    { lat: 13.01467, lng: 80.21461 },
    { lat: 13.01424, lng: 80.21435 },
    { lat: 13.01248, lng: 80.21334 },
    { lat: 13.01184, lng: 80.21287 },
    { lat: 13.01196, lng: 80.21268 },
    { lat: 13.01254, lng: 80.21181 },
    { lat: 13.01257, lng: 80.21178 },
    { lat: 13.0127, lng: 80.21154 },
    { lat: 13.01304, lng: 80.21085 },
    { lat: 13.01313, lng: 80.21052 },
    { lat: 13.01315, lng: 80.21028 },
    { lat: 13.01316, lng: 80.21018 },
    { lat: 13.01317, lng: 80.20983 },
    { lat: 13.01312, lng: 80.20971 },
    { lat: 13.01297, lng: 80.20927 },
    { lat: 13.01287, lng: 80.20879 },
    { lat: 13.01284, lng: 80.2084 },
    { lat: 13.01284, lng: 80.208 },
    { lat: 13.01288, lng: 80.20776 },
    { lat: 13.0129, lng: 80.20761 },
    { lat: 13.01293, lng: 80.20726 },
    { lat: 13.01298, lng: 80.20659 },
    { lat: 13.01328, lng: 80.20539 },
    { lat: 13.01349, lng: 80.20474 },
    { lat: 13.01344, lng: 80.20428 },
    { lat: 13.01272, lng: 80.20405 },
    { lat: 13.01214, lng: 80.20404 },
    { lat: 13.011, lng: 80.20385 },
    { lat: 13.0096, lng: 80.20383 },
    { lat: 13.00938, lng: 80.20351 },
    { lat: 13.00989, lng: 80.20349 },
    { lat: 13.01124, lng: 80.20357 },
    { lat: 13.01203, lng: 80.20366 },
    { lat: 13.01276, lng: 80.20396 },
    { lat: 13.01452, lng: 80.20453 },
    { lat: 13.01588, lng: 80.205 },
    { lat: 13.01651, lng: 80.20503 },
    { lat: 13.01648, lng: 80.20444 },
    { lat: 13.01699, lng: 80.20452 },
    { lat: 13.01696, lng: 80.2048 }
  ];

  const [vehiclePosition, setVehiclePosition] = useState(routeCoordinates[0]);
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
  const totalSegments = routeCoordinates.length - 1;

  useEffect(() => {
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const startVehicleMovement = () => {

    setVehiclesData(prevVehicles =>
      prevVehicles.map(vehicle =>
        vehicle.id === "VEH-1001"
          ? {
            ...vehicle, checkpoints: vehicle.checkpoints.map(cp => ({
              ...cp,
              status: cp.id === 1 ? "current" : cp.status,
              actualTime: cp.id === 1 ? format(new Date(), "hh:mm a") : cp.actualTime,
              estimatedTime: cp.id === 1 ? format(addMinutes(new Date(), 8), 'hh:mm a') : cp.estimatedTime, // Set first checkpoint time
            }))
          }
          : vehicle
      )
    );

    let index = 0;
    const stepDuration = 10; // ms between frame updates
    const stepsPerSegment = 30; // total frames between points (100 x 20ms = 2s)



    function interpolate(from: any, to: any, fraction: any) {
      return {
        lat: from.lat + (to.lat - from.lat) * fraction,
        lng: from.lng + (to.lng - from.lng) * fraction,
      };
    }

    function moveToNextSegment() {
      if (index >= routeCoordinates.length - 1) {
        console.log("Arrived at destination");
        setVehiclesData(prevVehicles =>
          prevVehicles.map(vehicle =>
            vehicle.id === "VEH-1001"
              ? {
                ...vehicle, checkpoints: vehicle.checkpoints.map(cp => ({
                  ...cp,
                  actualTime: cp.id === 2 ? format(new Date(), "hh:mm a") : cp.actualTime,
                  status: cp.id === 2 ? "completed" : cp.status,
                }))
              }
              : vehicle
          )
        );
      }
      if (index >= routeCoordinates.length - 1) return;

      const from = routeCoordinates[index];
      const to = routeCoordinates[index + 1];
      let step = 0;

      const id = setInterval(() => {
        step++;
        const fraction = step / stepsPerSegment;
        const newPosition = interpolate(from, to, fraction);
        setVehiclePosition(newPosition);

        // Update progress
        const progressPercent = Math.min(
          100,
          Math.floor(((index + fraction) / totalSegments) * 100)
        );
        setVehiclesData(prev =>
          prev.map(vehicle =>
            vehicle.id === "VEH-1001"
              ? { ...vehicle, progress: progressPercent }
              : vehicle
          )
        );

        if (step >= stepsPerSegment) {
          clearInterval(id);
          index++;
          moveToNextSegment();
        }
      }, stepDuration);
    }

    moveToNextSegment(); // start first segment
  };

  const check_point1 = { lat: 13.01649, lng: 80.21481 };
  const check_point2 = { lat: 13.01696, lng: 80.2048 }

  return (
    <Card className="border-primary-light">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-primary-dark">Vehicle Tracking</CardTitle>
            <CardDescription>Track vehicles across checkpoints</CardDescription>
          </div>
          {!preview && (
            <div className="flex items-center gap-2">
              <Tabs defaultValue="active" className="w-[300px]" onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
              </Tabs>
              <Select defaultValue="today">
                <SelectTrigger className="w-[120px] border-primary-light">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayVehicles.map((vehicle) => (
            <div key={vehicle.id} className="border border-primary-light rounded-lg overflow-hidden">
              {/* Vehicle summary row */}
              <div className="bg-primary-light/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-primary-dark">{vehicle.id}</span>
                        <Badge variant="outline" className="border-primary text-primary">
                          {vehicle.deliveryId}
                        </Badge>
                        {vehicle.status === "delayed" && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Delayed
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {vehicle.origin} → {vehicle.destination}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">ETA: {vehicle.estimatedArrival}</div>
                      <div className="text-xs text-muted-foreground">
                        {vehicle.vehicle.type} • {vehicle.vehicle.licensePlate}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-white">{vehicle.driver.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{vehicle.driver.name}</div>
                        <div className="text-xs text-muted-foreground">{vehicle.driver.phone}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleVehicle(vehicle.id)}
                      aria-label="Toggle vehicle details"
                      className="text-primary hover:bg-primary-light/50"
                    >
                      {expandedVehicle === vehicle.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{vehicle.progress}%</span>
                  </div>
                  <Progress value={vehicle.progress} className="h-2 bg-primary-light" />
                </div>
              </div>

              {/* Expanded checkpoint tracking */}
              {expandedVehicle === vehicle.id && (
                <div className="p-4 bg-background">
                  <div className="relative">
                    {/* Vertical line connecting checkpoints */}
                    <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-primary-light" />

                    {/* Checkpoints */}
                    <div className="space-y-8">
                      {vehicle.checkpoints.map((checkpoint) => (
                        <div key={checkpoint.id} className="flex items-start gap-4 relative">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full z-10 ${checkpoint.status === "completed"
                              ? "bg-green-100"
                              : checkpoint.status === "current"
                                ? "bg-primary-light"
                                : checkpoint.status === "delayed"
                                  ? "bg-yellow-100"
                                  : "bg-slate-100"
                              }`}
                          >
                            {getStatusIcon(checkpoint.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-sm text-primary-dark">{checkpoint.name}</h4>
                                <p className="text-xs text-muted-foreground">{checkpoint.location}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm">
                                  <span className="font-medium">
                                    {checkpoint.actualTime || checkpoint.estimatedTime}
                                  </span>
                                  {checkpoint.actualTime && checkpoint.status !== "upcoming" && (
                                    <span className="text-xs text-muted-foreground ml-1">
                                      (Est: {checkpoint.estimatedTime})
                                    </span>
                                  )}
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs mt-1 ${getStatusColor(checkpoint.status)}`}
                                >
                                  {checkpoint.status.charAt(0).toUpperCase() + checkpoint.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                            {checkpoint.notes && (
                              <p className="text-xs text-muted-foreground mt-1">{checkpoint.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={vehiclePosition}
                    zoom={18}
                  >
                    <Marker position={check_point1}
                      icon={{
                        url: '/start_cp.png',
                        scaledSize: new window.google.maps.Size(50, 50),
                        anchor: new window.google.maps.Point(30, 30),
                      }}
                      label={{
                        text: vehicle.origin,
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                      animation={window.google.maps.Animation.DROP}
                    />
                    <Marker position={vehiclePosition}
                      icon={{
                        url: '/truck.png',
                        scaledSize: new window.google.maps.Size(50, 50),
                        anchor: new window.google.maps.Point(30, 30),
                      }}
                      label={{
                        text: "VEH-1001",
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                      animation={window.google.maps.Animation.DROP}
                    />
                    <Marker position={check_point2}
                      icon={{
                        url: '/end_cp.png',
                        scaledSize: new window.google.maps.Size(50, 50),
                        anchor: new window.google.maps.Point(30, 30),
                      }}
                      label={{
                        text: vehicle.destination,
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                      animation={window.google.maps.Animation.DROP}
                    />
                    <Polyline path={routeCoordinates} options={{ strokeColor: '#3F72AF', strokeWeight: 4 }} />
                  </GoogleMap>

                  <button
                    onClick={startVehicleMovement}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                  >
                    Start Vehicle Movement
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {preview && (
          <div className="mt-4 text-center">
            <Link href="/vehicle-tracking">
              <Button className="bg-primary hover:bg-primary-dark text-white">View All Vehicles and Map</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
