import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardCards } from "@/components/dashboard-cards"
import { RecentOrdersTable } from "@/components/recent-orders-table"
import { SalesChart } from "@/components/sales-chart"
import { ProductDistribution } from "@/components/product-distribution"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <DashboardHeader />
      <DashboardCards />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SalesChart />
        <ProductDistribution />
      </div>
      <RecentOrdersTable />
    </div>
  )
}
