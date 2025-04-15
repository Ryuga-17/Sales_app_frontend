"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Truck, RotateCcw, Printer, FileText } from "lucide-react"

export function OrderActions({ orderId }: { orderId: string }) {
  const { toast } = useToast()
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [shipmentOpen, setShipmentOpen] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const paymentData = {
      order_id: Number.parseInt(orderId),
      payment_date: formData.get("payment_date") as string,
      amount: Number.parseFloat(formData.get("amount") as string),
      payment_method: formData.get("payment_method") as string,
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      if (response.ok) {
        toast({
          title: "Payment recorded",
          description: "The payment has been recorded successfully.",
        })
        setPaymentOpen(false)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to record payment")
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

  const handleShipment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const shipmentData = {
      order_id: Number.parseInt(orderId),
      shipped_date: formData.get("shipped_date") as string,
      carrier: formData.get("carrier") as string,
      tracking_number: formData.get("tracking_number") as string,
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipmentData),
      })

      if (response.ok) {
        toast({
          title: "Shipment created",
          description: "The shipment has been created successfully.",
        })
        setShipmentOpen(false)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to create shipment")
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

  const handleReturn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const returnData = {
      order_id: Number.parseInt(orderId),
      return_date: formData.get("return_date") as string,
      reason: formData.get("reason") as string,
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/api/returns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(returnData),
      })

      if (response.ok) {
        toast({
          title: "Return processed",
          description: "The return has been processed successfully.",
        })
        setReturnOpen(false)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to process return")
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
    <Card>
      <CardHeader>
        <CardTitle>Order Actions</CardTitle>
        <CardDescription>Manage this order</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button className="justify-start gap-2" variant="outline">
          <Printer className="h-4 w-4" />
          Print Order
        </Button>
        <Button className="justify-start gap-2" variant="outline">
          <FileText className="h-4 w-4" />
          Generate Invoice
        </Button>

        {/* Payment Dialog */}
        <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
          <DialogTrigger asChild>
            <Button className="justify-start gap-2">
              <CreditCard className="h-4 w-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handlePayment}>
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
                <DialogDescription>Enter payment details for order #{orderId}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="payment_date">Payment Date</Label>
                  <Input
                    id="payment_date"
                    name="payment_date"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" name="amount" type="number" step="0.01" min="0" placeholder="0.00" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Input id="payment_method" name="payment_method" placeholder="Credit Card, Cash, etc." required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setPaymentOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Record Payment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Shipment Dialog */}
        <Dialog open={shipmentOpen} onOpenChange={setShipmentOpen}>
          <DialogTrigger asChild>
            <Button className="justify-start gap-2" variant="outline">
              <Truck className="h-4 w-4" />
              Create Shipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleShipment}>
              <DialogHeader>
                <DialogTitle>Create Shipment</DialogTitle>
                <DialogDescription>Enter shipment details for order #{orderId}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="shipped_date">Shipment Date</Label>
                  <Input
                    id="shipped_date"
                    name="shipped_date"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="carrier">Carrier</Label>
                  <Input id="carrier" name="carrier" placeholder="FedEx, UPS, etc." required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tracking_number">Tracking Number</Label>
                  <Input id="tracking_number" name="tracking_number" placeholder="Enter tracking number" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShipmentOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Create Shipment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Return Dialog */}
        <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
          <DialogTrigger asChild>
            <Button className="justify-start gap-2" variant="outline">
              <RotateCcw className="h-4 w-4" />
              Process Return
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleReturn}>
              <DialogHeader>
                <DialogTitle>Process Return</DialogTitle>
                <DialogDescription>Enter return details for order #{orderId}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="return_date">Return Date</Label>
                  <Input
                    id="return_date"
                    name="return_date"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason for Return</Label>
                  <Textarea id="reason" name="reason" placeholder="Enter reason for return" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setReturnOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Process Return"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
