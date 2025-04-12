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
  Layers,
  ZoomIn,
  ZoomOut,
  Locate,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import VehicleTracking from "@/components/vehicle-tracking"
import VehicleMap from "@/components/vehicle-map"
import { APP_CONFIG } from "@/lib/config"

export default function VehicleTrackingPage() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeView, setActiveView] = useState("list")

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
            <span className="font-bold text-sidebar-text">{APP_CONFIG.name}</span>
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
            <Button variant="ghost" className="w-full justify-start text-sidebar-text bg-sidebar-hover">
              <Truck className="mr-2 h-4 w-4" />
              {!collapsed && <span>Vehicle Tracking</span>}
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover">
              <Warehouse className="mr-2 h-4 w-4" />
              {!collapsed && <span>Docks</span>}
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sidebar-text hover:bg-sidebar-hover">
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
              <h1 className="text-xl font-bold text-primary-dark">Vehicle Tracking</h1>
            </div>
            <div className="flex items-center gap-4">
              <Tabs value={activeView} onValueChange={setActiveView} className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="map">Map View</TabsTrigger>
                </TabsList>
              </Tabs>
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
          <Tabs value={activeView} className="w-full">
            <TabsContent value="list" className="mt-0">
              <VehicleTracking />
            </TabsContent>
            <TabsContent value="map" className="mt-0">
              <Card className="border-primary-light">
                <CardContent className="p-0">
                  <div className="relative h-[calc(100vh-160px)] w-full">
                    <VehicleMap />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button size="icon" variant="secondary" className="bg-white shadow-md">
                        <ZoomIn className="h-4 w-4 text-primary-dark" />
                      </Button>
                      <Button size="icon" variant="secondary" className="bg-white shadow-md">
                        <ZoomOut className="h-4 w-4 text-primary-dark" />
                      </Button>
                      <Button size="icon" variant="secondary" className="bg-white shadow-md">
                        <Locate className="h-4 w-4 text-primary-dark" />
                      </Button>
                      <Button size="icon" variant="secondary" className="bg-white shadow-md">
                        <Layers className="h-4 w-4 text-primary-dark" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
