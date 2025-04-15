import { OrdersHeader } from "@/components/orders-header"
import { OrdersTable } from "@/components/orders-table"
import { CreateOrderButton } from "@/components/create-order-button"

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <OrdersHeader />
        <CreateOrderButton />
      </div>
      <OrdersTable />
    </div>
  )
}
