"use client"

import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import {
  DollarSign,
  Gift,
  TrendingUp,
  Target,
  Clock,
  ShoppingBag,
} from "lucide-react"

const formatPrice = (price: number) => {
  return price.toLocaleString("fr-FR") + "$"
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

const SALES_OBJECTIVE = 50000

export function EmployeeStats() {
  const { currentUser, getUserSales, getUserWeeklyTotal, primeRate } = useAuth()

  if (!currentUser) return null

  const userSales = getUserSales(currentUser.id)
  const weeklyTotal = getUserWeeklyTotal(currentUser.id)
  const prime = Math.round(weeklyTotal * (primeRate / 100))
  const progressPercentage = Math.min((weeklyTotal / SALES_OBJECTIVE) * 100, 100)
  const remainingToObjective = Math.max(SALES_OBJECTIVE - weeklyTotal, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Mes Statistiques
          </h1>
          <p className="text-sm text-muted-foreground">
            Suivi personnel de {currentUser.firstName} {currentUser.lastName}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chiffre d'Affaire Personnel */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Mon Chiffre d{"'"}Affaires
            </span>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            {formatPrice(weeklyTotal)}
          </p>
          <p className="text-xs text-muted-foreground">
            {userSales.length} vente{userSales.length !== 1 ? "s" : ""} cette semaine
          </p>
        </div>

        {/* Prime à Percevoir */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center">
              <Gift className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Ma Prime à Percevoir ({primeRate}%)
            </span>
          </div>
          <p className="text-4xl font-bold text-accent">
            {formatPrice(prime)}
          </p>
          <p className="text-xs text-muted-foreground">
            {primeRate}% de vos ventes personnelles
          </p>
        </div>
      </div>

      {/* Objectif de Vente */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-card-foreground">
              Objectif de la Semaine
            </h2>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {formatPrice(SALES_OBJECTIVE)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className={cn(
              "font-bold",
              progressPercentage >= 100 ? "text-green-400" : "text-foreground"
            )}>
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          
          <div className="h-4 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500 rounded-full",
                progressPercentage >= 100
                  ? "bg-gradient-to-r from-green-500 to-emerald-400"
                  : progressPercentage >= 75
                    ? "bg-gradient-to-r from-accent to-yellow-400"
                    : progressPercentage >= 50
                      ? "bg-gradient-to-r from-primary to-pink-400"
                      : "bg-gradient-to-r from-primary/70 to-primary"
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatPrice(weeklyTotal)}</span>
            {progressPercentage < 100 ? (
              <span>Encore {formatPrice(remainingToObjective)} à atteindre</span>
            ) : (
              <span className="text-green-400 font-medium">Objectif atteint !</span>
            )}
          </div>
        </div>

        {/* Milestone indicators */}
        <div className="flex items-center justify-between pt-2">
          {[25, 50, 75, 100].map((milestone) => (
            <div
              key={milestone}
              className={cn(
                "flex flex-col items-center",
                progressPercentage >= milestone ? "text-accent" : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-3 h-3 rounded-full mb-1",
                  progressPercentage >= milestone
                    ? "bg-accent"
                    : "bg-secondary"
                )}
              />
              <span className="text-xs">{milestone}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Historique Personnel */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-card-foreground">
            Mon Historique de Ventes
          </h2>
          <span className="text-xs text-muted-foreground">(Cette semaine)</span>
        </div>

        {userSales.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucune vente enregistrée cette semaine</p>
            <p className="text-sm">Commencez à vendre pour voir votre historique ici</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Heure
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Articles
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Montant
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Prime
                  </th>
                </tr>
              </thead>
              <tbody>
                {userSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {formatDate(sale.date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {sale.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
                          >
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-card-foreground">
                        {formatPrice(sale.total)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-medium text-accent">
                        +{formatPrice(Math.round(sale.total * (primeRate / 100)))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {userSales.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total: {userSales.length} vente{userSales.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                CA: <span className="font-bold text-foreground">{formatPrice(weeklyTotal)}</span>
              </span>
              <span className="text-sm text-muted-foreground">
                Prime: <span className="font-bold text-accent">{formatPrice(prime)}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
