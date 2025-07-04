"use client"

import { useState } from "react"
import Link from "next/link"
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
  MapPin,
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  CalendarDays,
  Timer,
  Building,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Clock3,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Mock data for schedules
const schedulesData = [
  {
    id: "SCH-001",
    deliveryId: "DEL-3922",
    from: "Central Warehouse",
    to: "Main Distribution Center",
    dock: "A-1",
    date: "2024-01-15",
    time: "08:30",
    endTime: "10:30",
    driver: {
      id: "DRV-001",
      name: "Sarah Miller",
      phone: "+1 (555) 123-4567",
      avatar: "SM",
    },
    company: "Global Logistics",
    vehicle: "VEH-1001",
    status: "in-progress",
    priority: "high",
    cargo: "Electronics",
    weight: "15 tons",
    notes: "Fragile items - handle with care",
    createdAt: "2024-01-10",
  },
  {
    id: "SCH-002",
    deliveryId: "DEL-3923",
    from: "East Supplier Hub",
    to: "Main Distribution Center",
    dock: "B-2",
    date: "2024-01-15",
    time: "10:00",
    endTime: "12:00",
    driver: {
      id: "DRV-002",
      name: "John Doe",
      phone: "+1 (555) 234-5678",
      avatar: "JD",
    },
    company: "FastFreight Inc.",
    vehicle: "VEH-1002",
    status: "scheduled",
    priority: "medium",
    cargo: "General Goods",
    weight: "8 tons",
    notes: "Standard delivery",
    createdAt: "2024-01-12",
  },
  {
    id: "SCH-003",
    deliveryId: "DEL-3924",
    from: "North Logistics Center",
    to: "Main Distribution Center",
    dock: "C-1",
    date: "2024-01-15",
    time: "13:00",
    endTime: "15:00",
    driver: {
      id: "DRV-003",
      name: "Emma Wilson",
      phone: "+1 (555) 345-6789",
      avatar: "EW",
    },
    company: "Express Shipping",
    vehicle: "VEH-1003",
    status: "scheduled",
    priority: "low",
    cargo: "Textiles",
    weight: "12 tons",
    notes: "Weather dependent delivery",
    createdAt: "2024-01-13",
  },
  {
    id: "SCH-004",
    deliveryId: "DEL-3925",
    from: "South Distribution Hub",
    to: "Main Distribution Center",
    dock: "A-3",
    date: "2024-01-14",
    time: "09:00",
    endTime: "10:00",
    driver: {
      id: "DRV-004",
      name: "Robert Johnson",
      phone: "+1 (555) 456-7890",
      avatar: "RJ",
    },
    company: "Prime Delivery",
    vehicle: "VEH-1004",
    status: "completed",
    priority: "high",
    cargo: "Medical Supplies",
    weight: "3 tons",
    notes: "Temperature controlled",
    createdAt: "2024-01-08",
  },
  {
    id: "SCH-005",
    deliveryId: "DEL-3926",
    from: "West Manufacturing Plant",
    to: "Main Distribution Center",
    dock: "B-4",
    date: "2024-01-16",
    time: "14:30",
    endTime: "16:30",
    driver: {
      id: "DRV-005",
      name: "Michael Brown",
      phone: "+1 (555) 567-8901",
      avatar: "MB",
    },
    company: "City Movers",
    vehicle: "VEH-1005",
    status: "cancelled",
    priority: "medium",
    cargo: "Furniture",
    weight: "20 tons",
    notes: "Cancelled due to weather conditions",
    createdAt: "2024-01-11",
  },
]

// Mock data for locations
const locations = [
  "Central Warehouse",
  "East Supplier Hub",
  "North Logistics Center",
  "South Distribution Hub",
  "West Manufacturing Plant",
  "Main Distribution Center",
  "Secondary Distribution Center",
  "Emergency Storage Facility",
]

// Mock data for docks
const docks = ["A-1", "A-2", "A-3", "A-4", "B-1", "B-2", "B-3", "B-4", "C-1", "C-2", "C-3", "C-4"]

// Mock data for drivers
const drivers = [
  { id: "DRV-001", name: "Sarah Miller", avatar: "SM", vehicle: "VEH-1001" },
  { id: "DRV-002", name: "John Doe", avatar: "JD", vehicle: "VEH-1002" },
  { id: "DRV-003", name: "Emma Wilson", avatar: "EW", vehicle: "VEH-1003" },
  { id: "DRV-004", name: "Robert Johnson", avatar: "RJ", vehicle: "VEH-1004" },
  { id: "DRV-005", name: "Michael Brown", avatar: "MB", vehicle: "VEH-1005" },
  { id: "DRV-006", name: "Lisa Anderson", avatar: "LA", vehicle: "VEH-1006" },
]

// Mock data for companies
const companies = [
  "Global Logistics",
  "FastFreight Inc.",
  "Express Shipping",
  "Prime Delivery",
  "City Movers",
  "Metro Shipping",
  "Urban Logistics",
  "Rapid Transport",
]

export default function SchedulePage() {
  const [collapsed, setCollapsed] = useState(false)
  const [schedules, setSchedules] = useState(schedulesData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false)
  const [newSchedule, setNewSchedule] = useState({
    from: "",
    to: "",
    dock: "",
    date: "",
    time: "",
    endTime: "",
    driverId: "",
    company: "",
    cargo: "",
    weight: "",
    priority: "medium",
    notes: "",
  })

  // Filter schedules based on search and filters
  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.deliveryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.dock.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || schedule.status === statusFilter

    const today = new Date().toISOString().split("T")[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && schedule.date === today) ||
      (dateFilter === "tomorrow" && schedule.date === tomorrow) ||
      (dateFilter === "upcoming" && schedule.date >= today)

    return matchesSearch && matchesStatus && matchesDate
  })

  const handleAddSchedule = () => {
    const selectedDriver = drivers.find((d) => d.id === newSchedule.driverId)
    const scheduleId = `SCH-${String(schedules.length + 1).padStart(3, "0")}`
    const deliveryId = `DEL-${String(3920 + schedules.length + 1)}`

    const schedule = {
      id: scheduleId,
      deliveryId,
      ...newSchedule,
      driver: selectedDriver
        ? {
            id: selectedDriver.id,
            name: selectedDriver.name,
            phone: "+1 (555) 000-0000", // Mock phone
            avatar: selectedDriver.avatar,
          }
        : {
            id: "",
            name: "",
            phone: "",
            avatar: "",
          },
      vehicle: selectedDriver?.vehicle || "",
      status: "scheduled",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setSchedules([...schedules, schedule])
    setNewSchedule({
      from: "",
      to: "",
      dock: "",
      date: "",
      time: "",
      endTime: "",
      driverId: "",
      company: "",
      cargo: "",
      weight: "",
      priority: "medium",
      notes: "",
    })
    setIsAddScheduleOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-primary-light text-primary border-primary-light"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-3 w-3 mr-1" />
      case "in-progress":
        return <Clock3 className="h-3 w-3 mr-1" />
      case "scheduled":
        return <Calendar className="h-3 w-3 mr-1" />
      case "cancelled":
        return <XCircle className="h-3 w-3 mr-1" />
      default:
        return <AlertCircle className="h-3 w-3 mr-1" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex h-screen bg-primary-light/20">
      {/* Sidebar */}
      <div
        className={`bg-sidebar border-r border-primary-dark/20 transition-all duration-300 flex flex-col ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 border-b border-sidebar-hover flex items-center justify-between">
          <div className={`flex items-center gap-2 ${collapsed ? "hidden" : "block"}`}>
            <Warehouse className="h-6 w-6 text-sidebar-text" />
            <span className="font-bold text-sidebar-text">DockMaster</span>
          </div>
          <Warehouse className={`h-6 w-6 text-sidebar-text ${collapsed ? "mx-auto" : "hidden"}`} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={`${collapsed ? "mx-auto" : ""} text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text`}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            <Link href="/" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {!collapsed && <span>Dashboard</span>}
              </Button>
            </Link>
            <Link href="/vehicle-tracking" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text"
              >
                <Truck className="mr-2 h-4 w-4" />
                {!collapsed && <span>Vehicle Tracking</span>}
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover">
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
            <Button variant="ghost" className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover">
              <BarChart className="mr-2 h-4 w-4" />
              {!collapsed && <span>Analytics</span>}
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sidebar-text bg-sidebar-hover">
              <Calendar className="mr-2 h-4 w-4" />
              {!collapsed && <span>Schedule</span>}
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover">
              <MapPin className="mr-2 h-4 w-4" />
              {!collapsed && <span>Map View</span>}
            </Button>
          </nav>
        </div>
        <div className="border-t border-sidebar-hover p-4">
          <Button variant="ghost" className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover">
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
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-primary-dark">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-primary-dark">Schedule Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <Clock className="inline mr-2 h-4 w-4 text-primary" />
                {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
              </div>
              <Avatar>
                <AvatarFallback className="bg-primary text-white">OP</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-primary-light">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary-dark">Total Schedules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-dark">{schedules.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card className="border-primary-light">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary-dark">Today's Schedules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-dark">
                  {schedules.filter((s) => s.date === new Date().toISOString().split("T")[0]).length}
                </div>
                <p className="text-xs text-muted-foreground">Active today</p>
              </CardContent>
            </Card>
            <Card className="border-primary-light">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary-dark">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-dark">
                  {schedules.filter((s) => s.status === "in-progress").length}
                </div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>
            <Card className="border-primary-light">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary-dark">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-dark">
                  {Math.round((schedules.filter((s) => s.status === "completed").length / schedules.length) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">Success rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Management */}
          <Card className="border-primary-light">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-primary-dark">Delivery Schedules</CardTitle>
                  <CardDescription>Manage delivery schedules and dock assignments</CardDescription>
                </div>
                <Dialog open={isAddScheduleOpen} onOpenChange={setIsAddScheduleOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary-dark text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Schedule</DialogTitle>
                      <DialogDescription>Create a new delivery schedule with dock assignment.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="from">From Location</Label>
                          <Select
                            value={newSchedule.from}
                            onValueChange={(value) => setNewSchedule({ ...newSchedule, from: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select origin" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="to">To Destination</Label>
                          <Select
                            value={newSchedule.to}
                            onValueChange={(value) => setNewSchedule({ ...newSchedule, to: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="dock">Assigned Dock</Label>
                          <Select
                            value={newSchedule.dock}
                            onValueChange={(value) => setNewSchedule({ ...newSchedule, dock: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select dock" />
                            </SelectTrigger>
                            <SelectContent>
                              {docks.map((dock) => (
                                <SelectItem key={dock} value={dock}>
                                  Dock {dock}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newSchedule.date}
                            onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={newSchedule.priority}
                            onValueChange={(value) => setNewSchedule({ ...newSchedule, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="time">Start Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newSchedule.time}
                            onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="endTime">End Time</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={newSchedule.endTime}
                            onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="driver">Assigned Driver</Label>
                          <Select
                            value={newSchedule.driverId}
                            onValueChange={(value) => setNewSchedule({ ...newSchedule, driverId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select driver" />
                            </SelectTrigger>
                            <SelectContent>
                              {drivers.map((driver) => (
                                <SelectItem key={driver.id} value={driver.id}>
                                  {driver.name} ({driver.vehicle})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Select
                            value={newSchedule.company}
                            onValueChange={(value) => setNewSchedule({ ...newSchedule, company: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select company" />
                            </SelectTrigger>
                            <SelectContent>
                              {companies.map((company) => (
                                <SelectItem key={company} value={company}>
                                  {company}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cargo">Cargo Type</Label>
                          <Input
                            id="cargo"
                            value={newSchedule.cargo}
                            onChange={(e) => setNewSchedule({ ...newSchedule, cargo: e.target.value })}
                            placeholder="e.g., Electronics, Furniture"
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight">Weight</Label>
                          <Input
                            id="weight"
                            value={newSchedule.weight}
                            onChange={(e) => setNewSchedule({ ...newSchedule, weight: e.target.value })}
                            placeholder="e.g., 15 tons"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={newSchedule.notes}
                          onChange={(e) => setNewSchedule({ ...newSchedule, notes: e.target.value })}
                          placeholder="Additional delivery instructions..."
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddScheduleOpen(false)}
                          className="border-primary-light"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddSchedule}
                          className="bg-primary hover:bg-primary-dark text-white"
                          disabled={
                            !newSchedule.from ||
                            !newSchedule.to ||
                            !newSchedule.dock ||
                            !newSchedule.date ||
                            !newSchedule.time ||
                            !newSchedule.driverId
                          }
                        >
                          Create Schedule
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search schedules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-primary-light"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] border-primary-light">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[140px] border-primary-light">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Schedules Table */}
              <div className="rounded-md border border-primary-light">
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary-light">
                      <TableHead>Schedule ID</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Dock & Time</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedules.map((schedule) => (
                      <TableRow key={schedule.id} className="border-primary-light">
                        <TableCell>
                          <div>
                            <div className="font-medium text-primary-dark">{schedule.id}</div>
                            <div className="text-sm text-muted-foreground">{schedule.deliveryId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">{schedule.from}</div>
                              <div className="text-xs text-muted-foreground">→ {schedule.to}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="flex items-center gap-1">
                                <Warehouse className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm font-medium">Dock {schedule.dock}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Timer className="h-3 w-3" />
                                <span>
                                  {schedule.time} - {schedule.endTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <CalendarDays className="h-3 w-3" />
                                <span>{new Date(schedule.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary text-white">
                                {schedule.driver.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{schedule.driver.name}</div>
                              <div className="text-xs text-muted-foreground">{schedule.vehicle}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{schedule.company}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium">{schedule.cargo}</div>
                            <div className="text-xs text-muted-foreground">{schedule.weight}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(schedule.priority)}>
                            {schedule.priority.charAt(0).toUpperCase() + schedule.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(schedule.status)}>
                            {getStatusIcon(schedule.status)}
                            {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1).replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary-light">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredSchedules.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary-dark mb-2">No schedules found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "Get started by creating your first schedule"}
                  </p>
                  {!searchTerm && statusFilter === "all" && dateFilter === "all" && (
                    <Button
                      onClick={() => setIsAddScheduleOpen(true)}
                      className="bg-primary hover:bg-primary-dark text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Schedule
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
