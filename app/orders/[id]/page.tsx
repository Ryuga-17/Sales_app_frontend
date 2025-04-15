import { OrderDetails } from "@/components/order-details"
import { OrderActions } from "@/components/order-actions"
import { OrderHeader } from "@/components/order-header"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <OrderHeader orderId={params.id} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrderDetails orderId={params.id} />
        </div>
        <div>
          <OrderActions orderId={params.id} />
        </div>
      </div>
    </div>
  )
}
