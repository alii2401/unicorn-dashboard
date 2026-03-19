"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Beer,
  Wine,
  Martini,
  Coffee,
  UtensilsCrossed,
  Crown,
  Sparkles,
  Plus,
  LayoutGrid,
} from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  category: string
}

interface ProductGridProps {
  onAddToCart: (product: Product) => void
}

const categories = [
  {
    id: "bieres",
    label: "BIÈRES",
    icon: Beer,
    color: "from-amber-500 to-yellow-600",
    products: [
      { id: "denvers", name: "Denvers", price: 200 },
      { id: "pils", name: "Pils", price: 250 },
      { id: "red", name: "Red", price: 300 },
      { id: "triple", name: "Triple", price: 350 },
    ],
  },
  {
    id: "alcools",
    label: "ALCOOLS/COCKTAILS",
    icon: Martini,
    color: "from-primary to-pink-600",
    products: [
      { id: "kentucky", name: "Kentucky Peach", price: 250 },
      { id: "mojito", name: "Mojito", price: 250 },
      { id: "tipunch", name: "Ti Punch", price: 250 },
      { id: "blantons", name: "Whisky Blanton's", price: 450 },
      { id: "whiskycoca", name: "Whisky Coca", price: 250 },
      { id: "rhum", name: "Rhum Beach House", price: 350 },
      { id: "skyy", name: "Vodka Skyy", price: 450 },
      { id: "vodkaredbull", name: "Vodka Redbull", price: 250 },
      { id: "cabernet", name: "Vin Cabernet", price: 200 },
      { id: "sake", name: "Saké", price: 150 },
      { id: "eaudevie", name: "Eau de Vie", price: 150 },
      { id: "ouzo", name: "Ouzo", price: 150 },
    ],
  },
  {
    id: "premium",
    label: "PREMIUM",
    icon: Crown,
    color: "from-accent to-yellow-500",
    products: [
      { id: "special", name: "Special Unicorn", price: 600 },
      { id: "champagne", name: "Champagne", price: 1800 },
    ],
  },
  {
    id: "softs",
    label: "SOFTS",
    icon: Coffee,
    color: "from-blue-500 to-cyan-500",
    products: [
      { id: "coca", name: "Coca", price: 50 },
      { id: "eau", name: "Eau", price: 30 },
      { id: "redbull", name: "Redbull", price: 70 },
      { id: "jus", name: "Jus orange/cerise", price: 100 },
    ],
  },
  {
    id: "nourriture",
    label: "NOURRITURE",
    icon: UtensilsCrossed,
    color: "from-emerald-500 to-green-600",
    products: [
      { id: "tapas", name: "Tapas", price: 120 },
      { id: "sushi", name: "Sushi", price: 120 },
      { id: "nems", name: "Nems", price: 190 },
      { id: "risotto", name: "Risotto", price: 230 },
      { id: "fruitsmer", name: "Plateau Fruits de Mer", price: 230 },
      { id: "ramen", name: "Ramen", price: 230 },
      { id: "noodles", name: "Noodles", price: 340 },
    ],
  },
  {
    id: "vip",
    label: "VIP & SERVICES",
    icon: Sparkles,
    color: "from-primary via-pink-500 to-accent",
    products: [
      { id: "poledance", name: "Pole Dance", price: 10000 },
      { id: "lapdance", name: "Lap Dance", price: 15000 },
      { id: "topless", name: "Topless", price: 20000 },
      { id: "specialdance", name: "Special Dance", price: 25000 },
      { id: "carrevip", name: "Carré VIP", price: 2500 },
      { id: "piscine", name: "Location Piscine", price: 5000 },
      { id: "silver", name: "Carte Silver", price: 20000 },
      { id: "limousine", name: "Location Limousine", price: 100000 },
      { id: "unicorn", name: "Location Unicorn", price: 60000 },
    ],
  },
  {
    id: "extras",
    label: "EXTRAS",
    icon: Plus,
    color: "from-purple-500 to-indigo-600",
    products: [
      { id: "cigarettes", name: "Cigarettes x20", price: 2000 },
      { id: "cigare", name: "Cigare x12", price: 1700 },
      { id: "tiramisu", name: "Tiramisu", price: 300 },
      { id: "lemonhaze", name: "Lemon Haze", price: 500 },
      { id: "purplequeen", name: "Purple Queen", price: 300 },
      { id: "northernlight", name: "Northern Light", price: 700 },
    ],
  },
]

// Flatten all products for the "TOUT" view
const allProducts = categories.flatMap((category) =>
  category.products.map((product) => ({
    ...product,
    category: category.id,
    categoryLabel: category.label,
    color: category.color,
  }))
)

const formatPrice = (price: number) => {
  return price.toLocaleString("fr-FR") + "$"
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === "tout" ? "default" : "outline"}
          onClick={() =>
            setActiveCategory(activeCategory === "tout" ? null : "tout")
          }
          className={cn(
            "gap-2 transition-all",
            activeCategory === "tout" &&
              "bg-gradient-to-r shadow-lg from-primary to-accent"
          )}
        >
          <LayoutGrid className="w-4 h-4" />
          TOUT
        </Button>
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() =>
                setActiveCategory(
                  activeCategory === category.id ? null : category.id
                )
              }
              className={cn(
                "gap-2 transition-all",
                activeCategory === category.id &&
                  "bg-gradient-to-r shadow-lg " + category.color
              )}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </Button>
          )
        })}
      </div>

      <div className="space-y-8">
        {/* TOUT View - All products in a single compact grid */}
        {activeCategory === "tout" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                TOUS LES ARTICLES
              </h2>
              <span className="text-sm text-muted-foreground">
                ({allProducts.length} articles)
              </span>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
              {allProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() =>
                    onAddToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      category: product.category,
                    })
                  }
                  className={cn(
                    "group relative p-2 rounded-lg border border-border bg-card hover:bg-secondary/50",
                    "transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10",
                    "flex flex-col items-center justify-center gap-1 min-h-[70px]",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background"
                  )}
                >
                  <span className="text-xs font-medium text-foreground text-center leading-tight line-clamp-2">
                    {product.name}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-bold bg-gradient-to-r bg-clip-text text-transparent",
                      product.color
                    )}
                  >
                    {formatPrice(product.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Views */}
        {activeCategory !== "tout" &&
          categories
            .filter((c) => !activeCategory || c.id === activeCategory)
            .map((category) => {
            const Icon = category.icon
            return (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      category.color
                    )}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">
                    {category.label}
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {category.products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() =>
                        onAddToCart({ ...product, category: category.id })
                      }
                      className={cn(
                        "group relative p-4 rounded-xl border border-border bg-card hover:bg-secondary/50",
                        "transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10",
                        "flex flex-col items-center justify-center gap-2 min-h-[100px]",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                      )}
                    >
                      <span className="text-sm font-medium text-foreground text-center leading-tight">
                        {product.name}
                      </span>
                      <span
                        className={cn(
                          "text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent",
                          category.color
                        )}
                      >
                        {formatPrice(product.price)}
                      </span>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
                    </button>
                  ))}
                </div>
              </div>
)
            })}
        </div>
    </div>
  )
}
