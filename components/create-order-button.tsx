"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: number
  name: string
  price: number
}

interface Customer {
  id: number
  name: string
}

interface Salesperson {
  id: number
  name: string
}

// Used internally for the form (string IDs for select inputs)
interface FormOrderItem {
  product_id: string
  quantity: number
}

export function CreateOrderButton() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  const customers: Customer[] = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
  ]

  const salespeople: Salesperson[] = [
    { id: 1, name: "Alice Williams" },
    { id: 2, name: "David Brown" },
    { id: 3, name: "Emily Davis" },
  ]

  const [formData, setFormData] = useState({
    customer_id: "",
    salesperson_id: "",
    order_date: new Date().toISOString().split("T")[0],
    products: [{ product_id: "", quantity: 1 }] as FormOrderItem[],
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5001/api/products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProductChange = (index: number, field: string, value: string) => {
    const updatedProducts = [...formData.products]
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: field === "quantity" ? Number.parseInt(value) : value,
    }
    setFormData((prev) => ({ ...prev, products: updatedProducts }))
  }

  const addProductLine = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { product_id: "", quantity: 1 }],
    }))
  }

  const removeProductLine = (index: number) => {
    const updatedProducts = [...formData.products]
    updatedProducts.splice(index, 1)
    setFormData((prev) => ({ ...prev, products: updatedProducts }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: Number.parseInt(formData.customer_id),
          salesperson_id: Number.parseInt(formData.salesperson_id),
          order_date: formData.order_date,
          products: formData.products.map((item) => ({
            product_id: Number.parseInt(item.product_id),
            quantity: item.quantity,
          })),
        }),
      })

      if (response.ok) {
        toast({
          title: "Order created",
          description: "The order has been created successfully.",
        })
        setOpen(false)
        setFormData({
          customer_id: "",
          salesperson_id: "",
          order_date: new Date().toISOString().split("T")[0],
          products: [{ product_id: "", quantity: 1 }],
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to create order")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>Fill in the details to create a new customer order.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customer_id">Customer</Label>
                <Select
                  value={formData.customer_id}
                  onValueChange={(value) => handleSelectChange("customer_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="salesperson_id">Salesperson</Label>
                <Select
                  value={formData.salesperson_id}
                  onValueChange={(value) => handleSelectChange("salesperson_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select salesperson" />
                  </SelectTrigger>
                  <SelectContent>
                    {salespeople.map((salesperson) => (
                      <SelectItem key={salesperson.id} value={salesperson.id.toString()}>
                        {salesperson.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order_date">Order Date</Label>
              <Input
                id="order_date"
                name="order_date"
                type="date"
                value={formData.order_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Products</Label>
                <Button type="button" variant="outline" size="sm" onClick={addProductLine}>
                  <Plus className="mr-2 h-3 w-3" />
                  Add Product
                </Button>
              </div>
              {formData.products.map((item, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`product_${index}`} className="sr-only">
                      Product
                    </Label>
                    <Select
                      value={item.product_id}
                      onValueChange={(value) => handleProductChange(index, "product_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name} (${product.price.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-20">
                    <Label htmlFor={`quantity_${index}`} className="sr-only">
                      Quantity
                    </Label>
                    <Input
                      id={`quantity_${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                      required
                    />
                  </div>
                  {formData.products.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeProductLine(index)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove product</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}