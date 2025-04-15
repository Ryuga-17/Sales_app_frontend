"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
}

export function ProductDistribution() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`)
        const data = await response.json()
        setProducts(data)

        // Process data for chart
        const processedData = processProductsForChart(data)
        setChartData(processedData)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const processProductsForChart = (products: Product[]) => {
    // Group products by category
    const productsByCategory: Record<string, number> = {}

    products.forEach((product) => {
      const category = product.category || "Uncategorized"

      if (!productsByCategory[category]) {
        productsByCategory[category] = 0
      }

      productsByCategory[category]++
    })

    // Convert to chart data format
    return Object.entries(productsByCategory).map(([name, value]) => ({
      name,
      value,
    }))
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Distribution</CardTitle>
        <CardDescription>Products by category</CardDescription>
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
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
