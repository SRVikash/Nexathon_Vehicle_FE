"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Clock,
  Truck,
  Warehouse,
  Calendar,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock3,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DockAllocationGrid from "@/components/dock-allocation-grid";
import PerformanceChart from "@/components/performance-chart";
import VehicleTracking from "@/components/vehicle-tracking";
import { APP_CONFIG } from "@/lib/config";
import axios from "axios";

function StatusBadge({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    case "in-progress":
    case "in progress":
      return (
        <Badge className="bg-primary-light text-primary hover:bg-primary-light">
          <Clock3 className="mr-1 h-3 w-3" />
          In Progress
        </Badge>
      );
    case "delayed":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <AlertCircle className="mr-1 h-3 w-3" />
          Delayed
        </Badge>
      );
    case "en route":
      return (
        <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">
          <Truck className="mr-1 h-3 w-3" />
          En Route
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}

function formatTime(isoDate: string) {
  const d = new Date(isoDate);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getEtaText(delivery: any) {
  if (
    delivery.status.toLowerCase() === "completed" &&
    delivery.actual_exit_time
  ) {
    return formatTime(delivery.actual_exit_time);
  }
  if (delivery.end_time) {
    return formatTime(delivery.end_time) + " (Est.)";
  }
  return "-";
}

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveries, setDeliveries] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dockRes, deliveryRes] = await Promise.all([
          axios.get("http://10.91.17.75:8005/dock-allocation/", {
            params: { date: "14-06-2025" },
          }),
          axios.get("http://10.91.17.75:8005/recent-delivery/", {
            params: { date: "14-06-2025" },
          }),
        ]);
        // setDockData(dockRes.data);
        setDeliveries(deliveryRes.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="flex h-screen bg-primary-light/20">
      {/* Sidebar */}
      <div
        className={`bg-sidebar border-r border-primary-dark/20 transition-all duration-300 flex flex-col ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 border-b border-sidebar-hover flex items-center justify-between">
          <div
            className={`flex items-center gap-2 ${
              collapsed ? "hidden" : "block"
            }`}
          >
            <img src={APP_CONFIG.logoUrl} alt="App Logo" className="h-6 w-15" />
            <span className="font-bold text-sidebar-text p-4">
              {APP_CONFIG.name}
            </span>
          </div>
          <Warehouse
            className={`h-6 w-6 text-sidebar-text ${
              collapsed ? "mx-auto" : "hidden"
            }`}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={`${
              collapsed ? "mx-auto" : ""
            } text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text`}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {!collapsed && <span>Dashboard</span>}
            </Button>
            <Link href="/vehicle-tracking" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text"
              >
                <Truck className="mr-2 h-4 w-4" />
                {!collapsed && <span>Vehicle Tracking</span>}
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover"
            >
              <Warehouse className="mr-2 h-4 w-4" />
              {!collapsed && <span>Docks</span>}
            </Button>
            <Link href="/drivers" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text"
              >
                <Users className="mr-2 h-4 w-4" />
                {!collapsed && <span>Drivers</span>}
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover"
            >
              <BarChart className="mr-2 h-4 w-4" />
              {!collapsed && <span>Analytics</span>}
            </Button>
            <Link href="/schedule" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {!collapsed && <span>Schedule</span>}
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover"
            >
              <MapPin className="mr-2 h-4 w-4" />
              {!collapsed && <span>Map View</span>}
            </Button>
          </nav>
        </div>
        <div className="border-t border-sidebar-hover p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover"
          >
            <Settings className="mr-2 h-4 w-4" />
            {!collapsed && <span>Settings</span>}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-sidebar-hover"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        <header className="bg-white border-b border-primary-light p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary-dark">
              Dashboard Overview
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <Clock className="inline mr-2 h-4 w-4 text-primary" />
                {new Date().toLocaleDateString()} |{" "}
                {new Date().toLocaleTimeString()}
              </div>
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-primary text-white">
                  OP
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="border-primary-light">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary-dark">
                  Active Deliveries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-dark">24</div>
                <p className="text-xs text-muted-foreground">
                  +2 from yesterday
                </p>
                <Progress value={65} className="h-1 mt-3 bg-primary-light" />
              </CardContent>
            </Card>
            <Card className="border-primary-light">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary-dark">
                  Dock Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-dark">78%</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last week
                </p>
                <Progress value={78} className="h-1 mt-3 bg-primary-light" />
              </CardContent>
            </Card>
            <Card className="border-primary-light">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary-dark">
                  Avg. Wait Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-dark">
                  14 min
                </div>
                <p className="text-xs text-muted-foreground">
                  -3 min from last week
                </p>
                <Progress value={40} className="h-1 mt-3 bg-primary-light" />
              </CardContent>
            </Card>
            <Card className="border-primary-light">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary-dark">
                  On-Time Deliveries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-dark">92%</div>
                <p className="text-xs text-muted-foreground">
                  +2% from last month
                </p>
                <Progress value={92} className="h-1 mt-3 bg-primary-light" />
              </CardContent>
            </Card>
          </div>

          {/* Dock Allocation Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-primary-dark">
                Dock Allocation
              </h2>
              <div className="flex items-center gap-2">
                <Select defaultValue="today">
                  <SelectTrigger className="w-[180px] border-primary-light">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary-light"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  View Schedule
                </Button>
              </div>
            </div>
            <Card className="border-primary-light">
              <CardContent className="pt-6">
                <DockAllocationGrid />
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Tracking Preview Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-primary-dark">
                Vehicle Tracking
              </h2>
              <Link href="/vehicle-tracking">
                <Button className="bg-primary hover:bg-primary-dark text-white">
                  <Truck className="mr-2 h-4 w-4" />
                  View All Vehicles
                </Button>
              </Link>
            </div>
            <Card className="border-primary-light">
              <CardContent className="pt-6">
                <VehicleTracking preview={true} />
              </CardContent>
            </Card>
          </div>

          {/* Delivery Status and Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-primary-light">
              <CardHeader>
                <CardTitle className="text-primary-dark">
                  Recent Deliveries
                </CardTitle>
                <CardDescription>
                  Status updates and confirmation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary-light">
                      <TableHead>Delivery ID</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Dock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>ETA/Completion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveries.map((delivery) => (
                      <TableRow
                        key={delivery.delivery_id}
                        className="border-primary-light"
                      >
                        <TableCell className="font-medium">
                          {delivery.delivery_id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-primary text-white">
                                {getInitials(delivery.driver_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{delivery.driver_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{delivery.dock}</TableCell>
                        <TableCell>
                          <StatusBadge status={delivery.status} />
                        </TableCell>
                        <TableCell>{getEtaText(delivery)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary-light"
                >
                  View All Deliveries
                </Button>
              </CardFooter>
            </Card>

            {/* Your Performance Metrics Card unchanged */}
            <Card className="border-primary-light">
              <CardHeader>
                <CardTitle className="text-primary-dark">
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Efficiency and turnaround times
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Replace this with your actual PerformanceChart */}
                <PerformanceChart />
                <div className="space-y-4 mt-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Average Turnaround Time</span>
                      <span className="font-medium">24 min</span>
                    </div>
                    <Progress value={60} className="h-1 bg-primary-light" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Dock Allocation Accuracy</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-1 bg-primary-light" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Driver Efficiency</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-1 bg-primary-light" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary-light"
                >
                  View Detailed Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
