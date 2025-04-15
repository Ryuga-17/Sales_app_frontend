"use client"

import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Order {
  order_id: number
  customer_name: string
  salesperson_name: string
  order_date: string
  status?: string
}

export function OrderHeader({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`)
        const orders = await response.json()
        const foundOrder = orders.find((o: Order) => o.order_id.toString() === orderId)

        if (foundOrder) {
          // Add a simulated status since it's not in the API
          setOrder({
            ...foundOrder,
            status: ["Pending", "Shipped", "Delivered", "Cancelled"][Math.floor(Math.random() * 4)],
          })
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

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
    <div className="flex flex-col gap-4">
      <div>
        <Link href="/orders">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>
      {loading ? (
        <div className="h-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
      ) : order ? (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                Order #{order.order_id}
              </h1>
              <Badge variant="outline" className={getStatusColor(order.status || "")}>
                {order.status}
              </Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Placed on {new Date(order.order_date).toLocaleDateString()} by {order.customer_name}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Order not found</h1>
          <p className="text-gray-500 dark:text-gray-400">The order you are looking for does not exist.</p>
        </div>
      )}
    </div>
  )
}
