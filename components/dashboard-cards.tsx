"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react"

interface DashboardMetrics {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  totalProducts: number
}

export function DashboardCards() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalProducts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch orders
        const ordersResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`)
        const orders = await ordersResponse.json()

        // Fetch products
        const productsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/products`)
        const products = await productsResponse.json()

        // Calculate metrics
        // Note: This is a simplified calculation since we don't have order amounts in the API response
        // In a real app, you'd get this from the backend
        const totalOrders = orders.length
        const totalRevenue = totalOrders * 500 // Placeholder calculation
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
        const totalProducts = products.length

        setMetrics({
          totalOrders,
          totalRevenue,
          averageOrderValue,
          totalProducts,
        })
      } catch (error) {
        console.error("Error fetching metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const cards = [
    {
      title: "Total Revenue",
      value: loading ? "Loading..." : `$${metrics.totalRevenue.toLocaleString()}`,
      description: "Total revenue from all orders",
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: "Total Orders",
      value: loading ? "Loading..." : metrics.totalOrders.toString(),
      description: "Total number of orders",
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Average Order Value",
      value: loading ? "Loading..." : `$${metrics.averageOrderValue.toLocaleString()}`,
      description: "Average value per order",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Total Products",
      value: loading ? "Loading..." : metrics.totalProducts.toString(),
      description: "Total number of products",
      icon: Package,
      color: "text-teal-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`rounded-full p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <CardDescription>{card.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
