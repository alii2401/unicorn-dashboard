"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Trophy,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Percent,
  Gift,
  Building2,
  Archive,
  ChevronDown,
  ChevronUp,
  Settings,
  Sliders,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"

const formatPrice = (price: number) => {
  return price.toLocaleString("fr-FR") + "$"
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

const formatDateShort = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function AdminStats() {
  const { sales, getWeeklyTotal, getTopSellers, resetWeek, archives, taxRate, primeRate, setTaxRate, setPrimeRate } = useAuth()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showFinalConfirm, setShowFinalConfirm] = useState(false)
  const [expandedArchive, setExpandedArchive] = useState<string | null>(null)
  
  const weeklyTotal = getWeeklyTotal()
  const topSellers = getTopSellers()
  const totalSalesCount = sales.length
  
  // Calculate taxes and primes with dynamic rates
  const totalTaxes = Math.round(weeklyTotal * (taxRate / 100))
  const totalPrimes = Math.round(weeklyTotal * (primeRate / 100))
  const netRevenue = weeklyTotal - totalTaxes - totalPrimes

  const handleFirstConfirm = () => {
    setShowResetConfirm(false)
    setShowFinalConfirm(true)
  }

  const handleReset = () => {
    resetWeek()
    setShowFinalConfirm(false)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Administration
            </h1>
            <p className="text-sm text-muted-foreground">
              Accès Patronne - Données confidentielles
            </p>
          </div>
        </div>

        {/* Reset Button with Double Confirmation */}
        {!showResetConfirm && !showFinalConfirm ? (
          <Button
            variant="outline"
            onClick={() => setShowResetConfirm(true)}
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser la Semaine
          </Button>
        ) : showResetConfirm ? (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-sm text-destructive font-medium">Archiver et réinitialiser ?</span>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleFirstConfirm}
            >
              Oui, continuer
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowResetConfirm(false)}
            >
              Annuler
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-red-500/20 border-2 border-red-500 rounded-lg p-3 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-500 font-bold">CONFIRMATION FINALE - Action irréversible</span>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleReset}
            >
              CONFIRMER LE RESET
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFinalConfirm(false)}
            >
              Annuler
            </Button>
          </div>
        )}
      </div>

      {/* Financial Configuration Section */}
      <div className="bg-card border-2 border-accent/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center">
            <Settings className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-card-foreground">
              Configuration Financière
            </h2>
            <p className="text-xs text-muted-foreground">
              Ajustez les pourcentages en temps réel
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tax Rate Slider */}
          <div className="space-y-4 p-4 bg-secondary/30 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-red-400" />
                <span className="font-medium text-card-foreground">Taxe État</span>
              </div>
              <span className="text-2xl font-bold text-red-400">{taxRate}%</span>
            </div>
            <Slider
              value={[taxRate]}
              onValueChange={(value) => setTaxRate(value[0])}
              min={0}
              max={30}
              step={1}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>15% (défaut)</span>
              <span>30%</span>
            </div>
          </div>

          {/* Prime Rate Slider */}
          <div className="space-y-4 p-4 bg-secondary/30 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-accent" />
                <span className="font-medium text-card-foreground">Primes Employés</span>
              </div>
              <span className="text-2xl font-bold text-accent">{primeRate}%</span>
            </div>
            <Slider
              value={[primeRate]}
              onValueChange={(value) => setPrimeRate(value[0])}
              min={0}
              max={25}
              step={1}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>10% (défaut)</span>
              <span>25%</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-center gap-3">
          <Sliders className="w-5 h-5 text-primary" />
          <p className="text-sm text-card-foreground">
            Les modifications sont sauvegardées automatiquement et appliquées instantanément sur tout le dashboard.
          </p>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* CA Total */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              CA Total
            </span>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            {formatPrice(weeklyTotal)}
          </p>
          <p className="text-xs text-muted-foreground">Cette semaine</p>
        </div>

        {/* Total Impôts */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <Percent className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Total Impôts ({taxRate}%)
            </span>
          </div>
          <p className="text-3xl font-bold text-red-400">
            -{formatPrice(totalTaxes)}
          </p>
          <p className="text-xs text-muted-foreground">À reverser à l{"'"}État</p>
        </div>

        {/* Total Primes */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center">
              <Gift className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Total Primes ({primeRate}%)
            </span>
          </div>
          <p className="text-3xl font-bold text-accent">
            -{formatPrice(totalPrimes)}
          </p>
          <p className="text-xs text-muted-foreground">À verser aux employés</p>
        </div>

        {/* Revenu Net */}
        <div className="bg-card border border-primary/30 rounded-xl p-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-pink-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Revenu Net Club
            </span>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {formatPrice(netRevenue)}
          </p>
          <p className="text-xs text-muted-foreground">Après impôts et primes</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-secondary-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Total Ventes
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalSalesCount}</p>
          <p className="text-xs text-muted-foreground">Transactions cette semaine</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Vendeurs Actifs
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">{topSellers.length}</p>
          <p className="text-xs text-muted-foreground">Avec au moins 1 vente</p>
        </div>
      </div>

      {/* Prime Breakdown by Employee */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Gift className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold text-card-foreground">
            Détail des Primes à Verser
          </h2>
        </div>

        <div className="space-y-3">
          {topSellers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucune vente cette semaine
            </p>
          ) : (
            topSellers.map((seller) => {
              const sellerPrime = Math.round(seller.total * (primeRate / 100))
              return (
                <div
                  key={seller.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Users className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{seller.name}</p>
                      <p className="text-xs text-muted-foreground">
                        CA: {formatPrice(seller.total)}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-accent">
                    {formatPrice(sellerPrime)}
                  </span>
                </div>
              )
            })
          )}
        </div>

        {topSellers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total des primes</span>
            <span className="text-xl font-bold text-accent">{formatPrice(totalPrimes)}</span>
          </div>
        )}
      </div>

      {/* Top Sellers Ranking */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold text-card-foreground">
            Classement des Meilleurs Vendeurs
          </h2>
          <span className="text-xs text-muted-foreground">(Cette semaine)</span>
        </div>

        <div className="space-y-3">
          {topSellers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucune vente cette semaine
            </p>
          ) : (
            topSellers.map((seller, index) => (
              <div
                key={seller.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg transition-colors",
                  index === 0
                    ? "bg-gradient-to-r from-accent/20 to-yellow-500/20 border border-accent/30"
                    : index === 1
                      ? "bg-secondary/50"
                      : index === 2
                        ? "bg-secondary/30"
                        : "bg-secondary/10"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                    index === 0
                      ? "bg-gradient-to-br from-accent to-yellow-500 text-accent-foreground"
                      : index === 1
                        ? "bg-gray-400 text-gray-900"
                        : index === 2
                          ? "bg-amber-700 text-white"
                          : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-card-foreground">{seller.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {seller.count} vente{seller.count > 1 ? "s" : ""}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-lg font-bold",
                    index === 0
                      ? "text-accent"
                      : "text-card-foreground"
                  )}
                >
                  {formatPrice(seller.total)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sales History */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-card-foreground">
            Historique Global des Ventes
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Vendeur
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Articles
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    Aucune vente enregistrée
                  </td>
                </tr>
              ) : (
                sales.slice(0, 30).map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {formatDate(sale.date)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-card-foreground">
                        {sale.sellerName}
                      </span>
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
                      <span className="font-bold text-primary">
                        {formatPrice(sale.total)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {sales.length > 30 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Affichage des 30 dernières ventes sur {sales.length}
          </p>
        )}
      </div>

      {/* Archives Section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Archive className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold text-card-foreground">
            Archives des Semaines Précédentes
          </h2>
          <span className="text-xs text-muted-foreground">
            ({archives.length} semaine{archives.length > 1 ? "s" : ""} archivée{archives.length > 1 ? "s" : ""})
          </span>
        </div>

        <div className="space-y-3">
          {archives.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucune archive disponible
            </p>
          ) : (
            archives.map((archive) => (
              <div
                key={archive.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedArchive(expandedArchive === archive.id ? null : archive.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-card-foreground">
                        Semaine du {formatDateShort(archive.weekStart)} au {formatDateShort(archive.weekEnd)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {archive.sales.length} vente{archive.sales.length > 1 ? "s" : ""} enregistrée{archive.sales.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(archive.totalRevenue)}
                    </span>
                    {expandedArchive === archive.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {expandedArchive === archive.id && (
                  <div className="p-4 border-t border-border bg-secondary/10 space-y-4">
                    {/* Archive Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-card rounded-lg p-3 border border-border">
                        <p className="text-xs text-muted-foreground mb-1">CA Total</p>
                        <p className="font-bold text-green-400">{formatPrice(archive.totalRevenue)}</p>
                      </div>
                      <div className="bg-card rounded-lg p-3 border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Impôts (15%)</p>
                        <p className="font-bold text-red-400">-{formatPrice(archive.totalTaxes)}</p>
                      </div>
                      <div className="bg-card rounded-lg p-3 border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Primes (10%)</p>
                        <p className="font-bold text-accent">-{formatPrice(archive.totalPrimes)}</p>
                      </div>
                      <div className="bg-card rounded-lg p-3 border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Revenu Net</p>
                        <p className="font-bold text-primary">{formatPrice(archive.netRevenue)}</p>
                      </div>
                    </div>

                    {/* Top Seller */}
                    {archive.topSeller && (
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-accent/20 to-yellow-500/20 rounded-lg border border-accent/30">
                        <Trophy className="w-5 h-5 text-accent" />
                        <span className="text-sm text-card-foreground">
                          Meilleur vendeur : <span className="font-bold">{archive.topSeller.name}</span>
                        </span>
                        <span className="ml-auto font-bold text-accent">
                          {formatPrice(archive.topSeller.total)}
                        </span>
                      </div>
                    )}

                    {/* Sales List (if available) */}
                    {archive.sales.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Détail des ventes :
                        </p>
                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {archive.sales.map((sale) => (
                            <div
                              key={sale.id}
                              className="flex items-center justify-between p-2 bg-card rounded border border-border text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">
                                  {formatDate(sale.date)}
                                </span>
                                <span className="text-card-foreground font-medium">
                                  {sale.sellerName}
                                </span>
                              </div>
                              <span className="font-bold text-primary">
                                {formatPrice(sale.total)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
