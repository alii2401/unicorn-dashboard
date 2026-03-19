"use client"

import { useState, useCallback } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { LoginScreen } from "@/components/login-screen"
import { Sidebar } from "@/components/sidebar"
import { ProductGrid } from "@/components/product-grid"
import { Cart } from "@/components/cart"
import { AdminStats } from "@/components/admin-stats"
import { EmployeeStats } from "@/components/employee-stats"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
}

function DashboardContent() {
  const { currentUser } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [activeTab, setActiveTab] = useState("caisse")

  const addToCart = useCallback((product: { id: string; name: string; price: number; category: string }) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id))
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }, [])

  const applyDiscount = useCallback((percentage: number) => {
    setCartItems((prev) =>
      prev.map((item) => ({
        ...item,
        price: Math.round(item.price * (1 - percentage / 100)),
      }))
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  // Show login screen if no user is logged in
  if (!currentUser) {
    return <LoginScreen />
  }

  const isBoss = currentUser.role === "boss"

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex overflow-hidden">
        {activeTab === "caisse" ? (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <ProductGrid onAddToCart={addToCart} />
            </div>
            <Cart
              items={cartItems}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
              onApplyDiscount={applyDiscount}
              onClearCart={clearCart}
            />
          </>
        ) : activeTab === "mystats" ? (
          <div className="flex-1 overflow-y-auto">
            <EmployeeStats />
          </div>
        ) : activeTab === "admin" && isBoss ? (
          <div className="flex-1 overflow-y-auto">
            <AdminStats />
          </div>
        ) : null}
      </main>
    </div>
  )
}

export default function Dashboard() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}
