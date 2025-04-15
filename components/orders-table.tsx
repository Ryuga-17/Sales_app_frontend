"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface Order {
  order_id: number
  customer_name: string
  salesperson_name: string
  order_date: string
  status?: string // This isn't in the API but we'll simulate it
}

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`)
        let data = await response.json()

        // Add a simulated status since it's not in the API
        data = data.map((order: Order) => ({
          ...order,
          status: ["Pending", "Shipped", "Delivered", "Cancelled"][Math.floor(Math.random() * 4)],
        }))

        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(
    (order) =>
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.salesperson_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_id.toString().includes(searchTerm),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500"
      case "Shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500"
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
        <CardDescription>View and manage all customer orders</CardDescription>
        <div className="mt-4">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? "No orders match your search" : "No orders found"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Salesperson</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell className="font-medium">#{order.order_id}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.salesperson_name}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(order.status || "")}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/orders/${order.order_id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View order</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
