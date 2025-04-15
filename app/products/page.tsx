import { ProductsHeader } from "@/components/products-header"
import { ProductsTable } from "@/components/products-table"
import { AddProductButton } from "@/components/add-product-button"

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <ProductsHeader />
        <AddProductButton />
      </div>
      <ProductsTable />
    </div>
  )
}
