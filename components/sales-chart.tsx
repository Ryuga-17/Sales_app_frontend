"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface Order {
  order_id: number
  order_date: string
}

export function SalesChart() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`)
        const data = await response.json()
        setOrders(data)

        // Process data for chart
        const processedData = processOrdersForChart(data)
        setChartData(processedData)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const processOrdersForChart = (orders: Order[]) => {
    // Group orders by month
    const ordersByMonth: Record<string, number> = {}

    orders.forEach((order) => {
      const date = new Date(order.order_date)
      const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

      if (!ordersByMonth[monthYear]) {
        ordersByMonth[monthYear] = 0
      }

      ordersByMonth[monthYear]++
    })

    // Convert to chart data format
    return Object.entries(ordersByMonth).map(([month, count]) => ({
      month,
      orders: count,
      revenue: count * 500, // Simulated revenue
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly sales performance</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-80 items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Loading chart data...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-80 items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        ) : (
          <Tabs defaultValue="line">
            <div className="flex justify-between">
              <TabsList>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="line" className="h-80 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="bar" className="h-80 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
