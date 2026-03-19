"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import {
  Receipt,
  Trash2,
  Minus,
  Plus,
  Percent,
  Check,
  X,
  ShoppingBag,
} from "lucide-react"
import type { CartItem } from "@/app/page"

interface CartProps {
  items: CartItem[]
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onApplyDiscount: (percentage: number) => void
  onClearCart: () => void
}

const formatPrice = (price: number) => {
  return price.toLocaleString("fr-FR") + "$"
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function Cart({
  items,
  onRemove,
  onUpdateQuantity,
  onApplyDiscount,
  onClearCart,
}: CartProps) {
  const { currentUser, addSale, getUserSales, isOnDuty } = useAuth()
  const [showCustomDiscount, setShowCustomDiscount] = useState(false)
  const [customDiscount, setCustomDiscount] = useState("")
  const [showValidation, setShowValidation] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Get current user's session sales
  const userSales = currentUser ? getUserSales(currentUser.id) : []
  const todaySales = userSales.filter((sale) => {
    const today = new Date()
    return (
      sale.date.getDate() === today.getDate() &&
      sale.date.getMonth() === today.getMonth() &&
      sale.date.getFullYear() === today.getFullYear()
    )
  })
  const sessionTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0)

  const handleValidateSale = () => {
    if (items.length === 0 || !currentUser) return

    // Record the sale
    addSale({
      sellerId: currentUser.id,
      sellerName: `${currentUser.firstName} ${currentUser.lastName}`,
      items: items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
    })

    setShowValidation(true)
    setTimeout(() => {
      setShowValidation(false)
      onClearCart()
    }, 2000)
  }

  const handleCustomDiscount = () => {
    const discount = parseFloat(customDiscount)
    if (discount > 0 && discount <= 100) {
      onApplyDiscount(discount)
      setCustomDiscount("")
      setShowCustomDiscount(false)
    }
  }

  return (
    <aside className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Receipt className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-card-foreground">
              Ticket de Caisse
            </h2>
            <p className="text-xs text-muted-foreground">
              {items.length} article{items.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Receipt className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">Panier vide</p>
            <p className="text-xs">Cliquez sur un produit pour l{"'"}ajouter</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-secondary/30 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-card-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)} / unité
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onRemove(item.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="h-7 w-7"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-medium text-card-foreground">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="h-7 w-7"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <span className="font-bold text-accent">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Session Sales Summary */}
      {todaySales.length > 0 && (
        <div className="px-4 py-3 border-t border-border">
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                MES VENTES DU JOUR
              </span>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {todaySales.slice(0, 5).map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground">
                    {formatDate(sale.date)} - {sale.items.length} article
                    {sale.items.length > 1 ? "s" : ""}
                  </span>
                  <span className="font-medium text-card-foreground">
                    {formatPrice(sale.total)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Total session
              </span>
              <span className="font-bold text-accent">
                {formatPrice(sessionTotal)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-border p-4 space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Percent className="w-4 h-4" />
            REMISE
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onApplyDiscount(10)}
              disabled={items.length === 0}
              className="flex-1"
            >
              -10%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onApplyDiscount(25)}
              disabled={items.length === 0}
              className="flex-1"
            >
              -25%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomDiscount(!showCustomDiscount)}
              disabled={items.length === 0}
              className="flex-1"
            >
              Libre
            </Button>
          </div>

          {showCustomDiscount && (
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                placeholder="% remise"
                value={customDiscount}
                onChange={(e) => setCustomDiscount(e.target.value)}
                className="flex-1"
                min="1"
                max="100"
              />
              <Button
                variant="default"
                size="icon"
                onClick={handleCustomDiscount}
                disabled={!customDiscount}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setShowCustomDiscount(false)
                  setCustomDiscount("")
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-muted-foreground">
              TOTAL
            </span>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        <Button
          onClick={handleValidateSale}
          disabled={items.length === 0 || showValidation || !isOnDuty}
          className={cn(
            "w-full h-14 text-lg font-bold transition-all duration-300",
            showValidation
              ? "bg-green-600 hover:bg-green-600"
              : "bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25"
          )}
        >
          {showValidation ? (
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              VENTE VALIDÉE !
            </span>
          ) : !isOnDuty ? (
            "POINTEZ POUR VENDRE"
          ) : (
            "VALIDER LA VENTE"
          )}
        </Button>

        {!isOnDuty && (
          <p className="text-xs text-center text-muted-foreground">
            Vous devez pointer pour pouvoir enregistrer des ventes
          </p>
        )}
      </div>
    </aside>
  )
}
