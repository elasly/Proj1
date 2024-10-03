'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Users, CreditCard, Database, Key, LogOut, Menu, Plus, Settings } from 'lucide-react'
import { Nav } from './nav'

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Nav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Button variant="ghost" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">admin@example.com</p>
                    <p className="text-xs leading-none text-muted-foreground">Admin</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Tabs defaultValue="users" className="space-y-4">
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                <TabsTrigger value="database">Database</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>Manage and impersonate users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <Input className="max-w-sm" placeholder="Search users..." />
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add User
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
                          { name: "Bob Smith", email: "bob@example.com", role: "User" },
                          { name: "Charlie Brown", email: "charlie@example.com", role: "User" },
                        ].map((user) => (
                          <TableRow key={user.email}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm">Impersonate</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="subscriptions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Tiers</CardTitle>
                    <CardDescription>Manage subscription plans</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Plan</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Features</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { plan: "Basic", price: "$9.99/mo", features: "Limited access" },
                          { plan: "Pro", price: "$19.99/mo", features: "Full access" },
                          { plan: "Enterprise", price: "Custom", features: "Custom solutions" },
                        ].map((tier) => (
                          <TableRow key={tier.plan}>
                            <TableCell className="font-medium">{tier.plan}</TableCell>
                            <TableCell>{tier.price}</TableCell>
                            <TableCell>{tier.features}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="database" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Database Management</CardTitle>
                    <CardDescription>Manage and clean database</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">Database Status</h3>
                          <p className="text-sm text-gray-500">Last backup: 2 hours ago</p>
                        </div>
                        <Badge>Healthy</Badge>
                      </div>
                      <div className="space-y-2">
                        <Button>Backup Database</Button>
                        <Button variant="outline">Clean Unused Data</Button>
                        <Button variant="outline">Optimize Queries</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Payments and Billing</CardTitle>
                    <CardDescription>Manage payments and billing information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { id: "INV-001", customer: "Alice Johnson", amount: "$99.99", status: "Paid", date: "2023-06-01" },
                          { id: "INV-002", customer: "Bob Smith", amount: "$199.99", status: "Pending", date: "2023-06-02" },
                          { id: "INV-003", customer: "Charlie Brown", amount: "$49.99", status: "Overdue", date: "2023-05-28" },
                        ].map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>{invoice.customer}</TableCell>
                            <TableCell>{invoice.amount}</TableCell>
                            <TableCell>
                              <Badge variant={invoice.status === "Paid" ? "default" : invoice.status === "Pending" ? "secondary" : "destructive"}>
                                {invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{invoice.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}