"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, ShoppingCart, Settings, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ModeToggle } from "./mode-toggle"

const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-white px-4 dark:border-gray-800 dark:bg-gray-950 md:hidden">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="mr-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <span className="text-xl font-bold text-teal-600 dark:text-teal-500">SalesHub</span>
        </div>
        <ModeToggle />
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 transform bg-black bg-opacity-50 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform bg-white p-4 transition-transform duration-300 ease-in-out dark:bg-gray-950 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-teal-600 dark:text-teal-500">SalesHub</span>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        <div className="mt-8 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800",
                pathname === item.href && "bg-teal-50 text-teal-600 dark:bg-gray-800 dark:text-teal-500",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden h-screen w-64 flex-shrink-0 flex-col border-r bg-white p-4 dark:border-gray-800 dark:bg-gray-950 md:flex">
        <div className="mb-8 flex items-center">
          <span className="text-xl font-bold text-teal-600 dark:text-teal-500">SalesHub</span>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800",
                pathname === item.href && "bg-teal-50 text-teal-600 dark:bg-gray-800 dark:text-teal-500",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
          <ModeToggle />
        </div>
      </div>
    </>
  )
}
