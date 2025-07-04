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
  Phone,
  MessageCircle,
  Edit,
  Trash2,
  Building,
  BadgeIcon as IdCard,
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

// Mock data for drivers
const driversData = [
  {
    id: "DRV-001",
    name: "Vikash Kumar",
    email: "vikash.kumar@email.in",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    licenseNumber: "DL01A1234567",
    company: "Bharat Logistics",
    status: "active",
    vehicleAssigned: "VEH-1001",
    joinDate: "2023-01-15",
    totalDeliveries: 245,
    rating: 4.8,
    avatar: "VK",
  },
  {
    id: "DRV-002",
    name: "Nithin Reddy",
    email: "nithin.reddy@email.in",
    phone: "+91 99887 76543",
    whatsapp: "+91 99887 76543",
    licenseNumber: "AP16B2345678",
    company: "Hyderabad Express",
    status: "active",
    vehicleAssigned: "VEH-1002",
    joinDate: "2023-03-20",
    totalDeliveries: 189,
    rating: 4.6,
    avatar: "NR",
  },
  {
    id: "DRV-003",
    name: "Sankalp Nana",
    email: "sankalp.nana@email.in",
    phone: "+91 91234 56789",
    whatsapp: "+91 91234 56789",
    licenseNumber: "MH12C3456789",
    company: "Mumbai Freight Movers",
    status: "active",
    vehicleAssigned: "VEH-1003",
    joinDate: "2023-02-10",
    totalDeliveries: 312,
    rating: 4.9,
    avatar: "SN",
  },
  {
    id: "DRV-004",
    name: "Mahamuni Das",
    email: "mahamuni.das@email.in",
    phone: "+91 93456 78901",
    whatsapp: "+91 93456 78901",
    licenseNumber: "WB20D4567890",
    company: "Kolkata Rapid Transport",
    status: "inactive",
    vehicleAssigned: null,
    joinDate: "2022-11-05",
    totalDeliveries: 156,
    rating: 4.3,
    avatar: "MD",
  },
  {
    id: "DRV-005",
    name: "Sai Kiran",
    email: "sai.kiran@email.in",
    phone: "+91 90123 45678",
    whatsapp: "+91 90123 45678",
    licenseNumber: "TS09E5678901",
    company: "Andhra Cargo Services",
    status: "active",
    vehicleAssigned: "VEH-1004",
    joinDate: "2023-04-12",
    totalDeliveries: 98,
    rating: 4.5,
    avatar: "SK",
  },
  {
    id: "DRV-006",
    name: "Cauvery Raj",
    email: "cauvery.raj@email.in",
    phone: "+91 87654 32109",
    whatsapp: "+91 87654 32109",
    licenseNumber: "KA01F6789012",
    company: "Southern Logistics",
    status: "active",
    vehicleAssigned: "VEH-1005",
    joinDate: "2023-01-28",
    totalDeliveries: 203,
    rating: 4.7,
    avatar: "CR",
  },
];

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

export default function DriversPage() {
  const [collapsed, setCollapsed] = useState(false)
  const [drivers, setDrivers] = useState(driversData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false)
  const [newDriver, setNewDriver] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    licenseNumber: "",
    company: "",
    notes: "",
  })

  // Filter drivers based on search and filters
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || driver.status === statusFilter
    const matchesCompany = companyFilter === "all" || driver.company === companyFilter

    return matchesSearch && matchesStatus && matchesCompany
  })

  const handleAddDriver = () => {
    const driverId = `DRV-${String(drivers.length + 1).padStart(3, "0")}`
    const driver = {
      id: driverId,
      ...newDriver,
      status: "active",
      vehicleAssigned: null,
      joinDate: new Date().toISOString().split("T")[0],
      totalDeliveries: 0,
      rating: 0,
      avatar: newDriver.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
    }

    setDrivers([...drivers, driver])
    setNewDriver({
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      licenseNumber: "",
      company: "",
      notes: "",
    })
    setIsAddDriverOpen(false)
  }

  const handleWhatsAppClick = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "")}`, "_blank")
  }

  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, "_blank")
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="flex h-screen bg-primary-light/20">
      {/* Sidebar */}
      <div
        className={`bg-sidebar border-r border-primary-dark/20 transition-all duration-300 flex flex-col ${collapsed ? "w-16" : "w-64"
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
            <Button variant="ghost" className="w-full justify-start text-sidebar-text bg-sidebar-hover">
              <Users className="mr-2 h-4 w-4" />
              {!collapsed && <span>Drivers</span>}
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover">
              <BarChart className="mr-2 h-4 w-4" />
              {!collapsed && <span>Analytics</span>}
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover">
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
              <h1 className="text-xl font-bold text-primary-dark">Driver Management</h1>
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
                <CardTitle className="text-sm font-medium text-primary-dark">Total Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-dark">{drivers.length}</div>
                <p className="text-xs text-muted-foreground">+2 this month</p>
              </CardContent>
            </Card>
            <Card className="border-primary-light">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary-dark">Active Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-dark">
                  {drivers.filter((d) => d.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground">Currently available</p>
              </CardContent>
            </Card>
            <Card className="border-primary-light">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary-dark">Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-dark">{companies.length}</div>
                <p className="text-xs text-muted-foreground">Partner companies</p>
              </CardContent>
            </Card>
            <Card className="border-primary-light">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary-dark">Avg. Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-dark">
                  {(drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">Driver performance</p>
              </CardContent>
            </Card>
          </div>

          {/* Drivers Management */}
          <Card className="border-primary-light">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-primary-dark">Drivers</CardTitle>
                  <CardDescription>Manage your driver database</CardDescription>
                </div>
                <Dialog open={isAddDriverOpen} onOpenChange={setIsAddDriverOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary-dark text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Driver
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Driver</DialogTitle>
                      <DialogDescription>Enter the driver's information to add them to the system.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={newDriver.name}
                            onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newDriver.email}
                            onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={newDriver.phone}
                            onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="whatsapp">WhatsApp</Label>
                          <Input
                            id="whatsapp"
                            value={newDriver.whatsapp}
                            onChange={(e) => setNewDriver({ ...newDriver, whatsapp: e.target.value })}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="license">License Number</Label>
                        <Input
                          id="license"
                          value={newDriver.licenseNumber}
                          onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                          placeholder="DL123456789"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Select
                          value={newDriver.company}
                          onValueChange={(value) => setNewDriver({ ...newDriver, company: value })}
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
                      <div>
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={newDriver.notes}
                          onChange={(e) => setNewDriver({ ...newDriver, notes: e.target.value })}
                          placeholder="Additional information..."
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddDriverOpen(false)}
                          className="border-primary-light"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddDriver}
                          className="bg-primary hover:bg-primary-dark text-white"
                          disabled={!newDriver.name || !newDriver.phone || !newDriver.company}
                        >
                          Add Driver
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
                    placeholder="Search drivers..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="w-[180px] border-primary-light">
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Drivers Table */}
              <div className="rounded-md border border-primary-light">
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary-light">
                      <TableHead>Driver</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>License</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Deliveries</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id} className="border-primary-light">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary text-white">{driver.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-primary-dark">{driver.name}</div>
                              <div className="text-sm text-muted-foreground">{driver.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary hover:bg-primary-light"
                              onClick={() => handlePhoneClick(driver.phone)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:bg-green-50"
                              onClick={() => handleWhatsAppClick(driver.whatsapp)}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <div className="text-sm">{driver.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{driver.company}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <IdCard className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-mono">{driver.licenseNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(driver.status)}>
                            {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {driver.vehicleAssigned ? (
                            <Badge variant="outline" className="border-primary text-primary">
                              {driver.vehicleAssigned}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{driver.totalDeliveries}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{driver.rating}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
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

              {filteredDrivers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary-dark mb-2">No drivers found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== "all" || companyFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "Get started by adding your first driver"}
                  </p>
                  {!searchTerm && statusFilter === "all" && companyFilter === "all" && (
                    <Button
                      onClick={() => setIsAddDriverOpen(true)}
                      className="bg-primary hover:bg-primary-dark text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Driver
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
