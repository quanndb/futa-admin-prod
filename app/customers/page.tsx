"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Search, User, Calendar, CreditCard, Mail, Phone, MapPin } from "lucide-react"

// Sample customer data
const customersData = [
  {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY",
    joinDate: "2023-01-15T10:30:00",
    totalBookings: 8,
    totalSpent: 450.75,
    status: "active",
  },
  {
    id: "CUST-002",
    name: "Emily Johnson",
    email: "emily.j@example.com",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, Boston, MA",
    joinDate: "2023-02-20T14:45:00",
    totalBookings: 5,
    totalSpent: 320.5,
    status: "active",
  },
  {
    id: "CUST-003",
    name: "Michael Brown",
    email: "mbrown@example.com",
    phone: "+1 (555) 345-6789",
    address: "789 Pine Rd, Washington, DC",
    joinDate: "2023-03-10T09:15:00",
    totalBookings: 3,
    totalSpent: 175.25,
    status: "inactive",
  },
  {
    id: "CUST-004",
    name: "Sarah Wilson",
    email: "swilson@example.com",
    phone: "+1 (555) 456-7890",
    address: "321 Elm St, Philadelphia, PA",
    joinDate: "2023-04-05T16:20:00",
    totalBookings: 12,
    totalSpent: 780.0,
    status: "active",
  },
  {
    id: "CUST-005",
    name: "David Lee",
    email: "dlee@example.com",
    phone: "+1 (555) 567-8901",
    address: "654 Maple Dr, Chicago, IL",
    joinDate: "2023-05-12T11:40:00",
    totalBookings: 6,
    totalSpent: 410.25,
    status: "active",
  },
]

// Sample booking history data
const bookingHistoryData = [
  {
    id: "BK-001",
    tripId: "TRIP-001",
    route: "New York to Boston",
    departureDate: "2024-01-15T08:00:00",
    seats: 2,
    amount: 91.98,
    status: "completed",
  },
  {
    id: "BK-004",
    tripId: "TRIP-005",
    route: "New York to Washington DC",
    departureDate: "2024-02-19T06:45:00",
    seats: 2,
    amount: 144.0,
    status: "completed",
  },
  {
    id: "BK-008",
    tripId: "TRIP-003",
    route: "Washington DC to Philadelphia",
    departureDate: "2024-03-17T07:15:00",
    seats: 1,
    amount: 38.75,
    status: "upcoming",
  },
  {
    id: "BK-012",
    tripId: "TRIP-002",
    route: "Boston to Washington DC",
    departureDate: "2024-04-16T09:30:00",
    seats: 3,
    amount: 196.5,
    status: "upcoming",
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(customersData)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // Filter customers based on search query and status filter
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const viewCustomerDetails = (customer: any) => {
    setSelectedCustomer(customer)
    setIsDetailsDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
            <CardDescription>View and manage all registered customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search customers..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("active")}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === "inactive" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("inactive")}
                >
                  Inactive
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Total Bookings</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.id}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{formatDate(customer.joinDate)}</TableCell>
                        <TableCell>{customer.totalBookings}</TableCell>
                        <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => viewCustomerDetails(customer)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {customer.status === "active" ? (
                                <DropdownMenuItem>Deactivate Account</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>Activate Account</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Customer Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>Complete information about the customer.</DialogDescription>
            </DialogHeader>
            {selectedCustomer && (
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="bookings">Booking History</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{selectedCustomer.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{selectedCustomer.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{selectedCustomer.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{selectedCustomer.address}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          Account Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Customer ID:</span>
                            <span className="ml-2 font-medium">{selectedCustomer.id}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Join Date:</span>
                            <span className="ml-2">{formatDate(selectedCustomer.joinDate)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <span className="ml-2">{getStatusBadge(selectedCustomer.status)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Booking Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="text-muted-foreground text-sm">Total Bookings</div>
                          <div className="text-2xl font-bold">{selectedCustomer.totalBookings}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-muted-foreground text-sm">Total Spent</div>
                          <div className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-muted-foreground text-sm">Avg. Per Booking</div>
                          <div className="text-2xl font-bold">
                            ${(selectedCustomer.totalSpent / selectedCustomer.totalBookings).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="bookings" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Booking History</CardTitle>
                      <CardDescription>All bookings made by this customer.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Departure</TableHead>
                            <TableHead>Seats</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookingHistoryData.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">{booking.id}</TableCell>
                              <TableCell>{booking.route}</TableCell>
                              <TableCell>{formatDate(booking.departureDate)}</TableCell>
                              <TableCell>{booking.seats}</TableCell>
                              <TableCell>${booking.amount.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge className={booking.status === "completed" ? "bg-green-500" : "bg-blue-500"}>
                                  {booking.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
