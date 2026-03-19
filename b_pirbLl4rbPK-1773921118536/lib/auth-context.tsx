"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

export type UserRole = "employee" | "boss"

export interface User {
  id: string
  firstName: string
  lastName: string
  discordPseudo: string
  role: UserRole
}

export interface Sale {
  id: string
  sellerId: string
  sellerName: string
  items: { name: string; price: number; quantity: number }[]
  total: number
  date: Date
}

export interface ShiftRecord {
  userId: string
  userName: string
  startTime: Date
  endTime?: Date
}

export interface WeekArchive {
  id: string
  weekStart: Date
  weekEnd: Date
  sales: Sale[]
  totalRevenue: number
  totalTaxes: number
  totalPrimes: number
  netRevenue: number
  topSeller: { name: string; total: number } | null
}

interface AuthContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  isOnDuty: boolean
  shiftStartTime: Date | null
  startShift: () => void
  endShift: () => void
  sales: Sale[]
  addSale: (sale: Omit<Sale, "id" | "date">) => void
  getUserSales: (userId: string) => Sale[]
  getWeeklyTotal: () => number
  getUserWeeklyTotal: (userId: string) => number
  getTopSellers: () => { name: string; total: number; count: number; id: string }[]
  getLeaderboard: () => { id: string; discordPseudo: string; total: number; count: number }[]
  shifts: ShiftRecord[]
  archives: WeekArchive[]
  resetWeek: () => void
  taxRate: number
  primeRate: number
  setTaxRate: (rate: number) => void
  setPrimeRate: (rate: number) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Simulated users database
export const USERS: User[] = [
  { id: "1", firstName: "Sarah", lastName: "Jenkins", discordPseudo: "SarahBoss#0001", role: "boss" },
  { id: "2", firstName: "Marc", lastName: "Rivera", discordPseudo: "MarcVIP#2845", role: "employee" },
  { id: "3", firstName: "Luna", lastName: "Chen", discordPseudo: "LunaStar#7712", role: "employee" },
  { id: "4", firstName: "Tyler", lastName: "Brooks", discordPseudo: "TylerB#3390", role: "employee" },
  { id: "5", firstName: "Jade", lastName: "Williams", discordPseudo: "JadeQueen#5501", role: "employee" },
]

// Simulated sales database with some initial data
const generateInitialSales = (): Sale[] => {
  const now = new Date()
  const sales: Sale[] = []
  
  // Generate some sales for the past week
  const sampleItems = [
    { name: "Mojito", price: 250, quantity: 2 },
    { name: "Lap Dance", price: 15000, quantity: 1 },
    { name: "Champagne", price: 1800, quantity: 1 },
    { name: "Whisky Blanton's", price: 450, quantity: 3 },
    { name: "Pole Dance", price: 10000, quantity: 1 },
    { name: "Carré VIP", price: 2500, quantity: 1 },
    { name: "Kentucky Peach", price: 250, quantity: 4 },
    { name: "Pack Limousine", price: 100000, quantity: 1 },
    { name: "Burger Deluxe", price: 800, quantity: 2 },
    { name: "Private Show", price: 25000, quantity: 1 },
  ]

  const sellers = [
    { id: "2", name: "Marc Rivera" },
    { id: "3", name: "Luna Chen" },
    { id: "4", name: "Tyler Brooks" },
    { id: "5", name: "Jade Williams" },
  ]

  for (let i = 0; i < 35; i++) {
    const daysAgo = Math.floor(Math.random() * 7)
    const hoursAgo = Math.floor(Math.random() * 24)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    date.setHours(date.getHours() - hoursAgo)

    const seller = sellers[Math.floor(Math.random() * sellers.length)]
    const numItems = Math.floor(Math.random() * 3) + 1
    const items = []
    let total = 0

    for (let j = 0; j < numItems; j++) {
      const item = sampleItems[Math.floor(Math.random() * sampleItems.length)]
      const quantity = Math.floor(Math.random() * 3) + 1
      items.push({ ...item, quantity })
      total += item.price * quantity
    }

    sales.push({
      id: `sale-${i}`,
      sellerId: seller.id,
      sellerName: seller.name,
      items,
      total,
      date,
    })
  }

  return sales.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isOnDuty, setIsOnDuty] = useState(false)
  const [shiftStartTime, setShiftStartTime] = useState<Date | null>(null)
  const [sales, setSales] = useState<Sale[]>(generateInitialSales)
  const [shifts, setShifts] = useState<ShiftRecord[]>([])
  const [taxRate, setTaxRateState] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vu_tax_rate")
      return saved ? parseFloat(saved) : 15
    }
    return 15
  })
  const [primeRate, setPrimeRateState] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vu_prime_rate")
      return saved ? parseFloat(saved) : 10
    }
    return 10
  })
  const [archives, setArchives] = useState<WeekArchive[]>(() => {
    // Generate some sample archived weeks for demo
    const now = new Date()
    const sampleArchives: WeekArchive[] = []
    
    for (let i = 1; i <= 3; i++) {
      const weekEnd = new Date(now)
      weekEnd.setDate(weekEnd.getDate() - (i * 7))
      const weekStart = new Date(weekEnd)
      weekStart.setDate(weekStart.getDate() - 7)
      
      const revenue = Math.round(150000 + Math.random() * 200000)
      const taxes = Math.round(revenue * 0.15)
      const primes = Math.round(revenue * 0.10)
      
      sampleArchives.push({
        id: `archive-${i}`,
        weekStart,
        weekEnd,
        sales: [],
        totalRevenue: revenue,
        totalTaxes: taxes,
        totalPrimes: primes,
        netRevenue: revenue - taxes - primes,
        topSeller: { 
          name: ["Luna Chen", "Tyler Brooks", "Jade Williams"][i - 1], 
          total: Math.round(revenue * (0.25 + Math.random() * 0.15)) 
        },
      })
    }
    
    return sampleArchives
  })

  const setTaxRate = useCallback((rate: number) => {
    setTaxRateState(rate)
    if (typeof window !== "undefined") {
      localStorage.setItem("vu_tax_rate", rate.toString())
    }
  }, [])

  const setPrimeRate = useCallback((rate: number) => {
    setPrimeRateState(rate)
    if (typeof window !== "undefined") {
      localStorage.setItem("vu_prime_rate", rate.toString())
    }
  }, [])

  const startShift = useCallback(() => {
    if (currentUser) {
      const now = new Date()
      setIsOnDuty(true)
      setShiftStartTime(now)
      setShifts((prev) => [
        ...prev,
        {
          userId: currentUser.id,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          startTime: now,
        },
      ])
    }
  }, [currentUser])

  const endShift = useCallback(() => {
    setIsOnDuty(false)
    setShiftStartTime(null)
    if (currentUser) {
      setShifts((prev) =>
        prev.map((shift) =>
          shift.userId === currentUser.id && !shift.endTime
            ? { ...shift, endTime: new Date() }
            : shift
        )
      )
    }
  }, [currentUser])

  const addSale = useCallback(
    (sale: Omit<Sale, "id" | "date">) => {
      const newSale: Sale = {
        ...sale,
        id: `sale-${Date.now()}`,
        date: new Date(),
      }
      setSales((prev) => [newSale, ...prev])
    },
    []
  )

  const getUserSales = useCallback(
    (userId: string) => {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return sales.filter((sale) => sale.sellerId === userId && sale.date >= oneWeekAgo)
    },
    [sales]
  )

  const getWeeklyTotal = useCallback(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return sales
      .filter((sale) => sale.date >= oneWeekAgo)
      .reduce((sum, sale) => sum + sale.total, 0)
  }, [sales])

  const getUserWeeklyTotal = useCallback(
    (userId: string) => {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return sales
        .filter((sale) => sale.sellerId === userId && sale.date >= oneWeekAgo)
        .reduce((sum, sale) => sum + sale.total, 0)
    },
    [sales]
  )

  const getTopSellers = useCallback(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weeklySales = sales.filter((sale) => sale.date >= oneWeekAgo)

    const sellerStats: Record<string, { name: string; total: number; count: number; id: string }> = {}

    weeklySales.forEach((sale) => {
      if (!sellerStats[sale.sellerId]) {
        sellerStats[sale.sellerId] = { name: sale.sellerName, total: 0, count: 0, id: sale.sellerId }
      }
      sellerStats[sale.sellerId].total += sale.total
      sellerStats[sale.sellerId].count += 1
    })

    return Object.values(sellerStats).sort((a, b) => b.total - a.total)
  }, [sales])

  const getLeaderboard = useCallback(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weeklySales = sales.filter((sale) => sale.date >= oneWeekAgo)

    const sellerStats: Record<string, { id: string; discordPseudo: string; total: number; count: number }> = {}

    weeklySales.forEach((sale) => {
      if (!sellerStats[sale.sellerId]) {
        const user = USERS.find((u) => u.id === sale.sellerId)
        sellerStats[sale.sellerId] = { 
          id: sale.sellerId, 
          discordPseudo: user?.discordPseudo || "Unknown#0000",
          total: 0, 
          count: 0 
        }
      }
      sellerStats[sale.sellerId].total += sale.total
      sellerStats[sale.sellerId].count += 1
    })

    return Object.values(sellerStats).sort((a, b) => b.total - a.total)
  }, [sales])

  const resetWeek = useCallback(() => {
    // Calculate current week stats
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weeklySales = sales.filter((sale) => sale.date >= oneWeekAgo)
    const totalRevenue = weeklySales.reduce((sum, sale) => sum + sale.total, 0)
    const totalTaxes = Math.round(totalRevenue * (taxRate / 100))
    const totalPrimes = Math.round(totalRevenue * (primeRate / 100))
    const netRevenue = totalRevenue - totalTaxes - totalPrimes

    // Find top seller
    const sellerStats: Record<string, { name: string; total: number }> = {}
    weeklySales.forEach((sale) => {
      if (!sellerStats[sale.sellerId]) {
        sellerStats[sale.sellerId] = { name: sale.sellerName, total: 0 }
      }
      sellerStats[sale.sellerId].total += sale.total
    })
    const topSeller = Object.values(sellerStats).sort((a, b) => b.total - a.total)[0] || null

    // Create archive
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - 7)

    const newArchive: WeekArchive = {
      id: `archive-${Date.now()}`,
      weekStart,
      weekEnd: now,
      sales: weeklySales,
      totalRevenue,
      totalTaxes,
      totalPrimes,
      netRevenue,
      topSeller,
    }

    // Only add archive if there were sales
    if (weeklySales.length > 0) {
      setArchives((prev) => [newArchive, ...prev])
    }

    // Reset current week
    setSales([])
    setShifts([])
  }, [sales, taxRate, primeRate])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isOnDuty,
        shiftStartTime,
        startShift,
        endShift,
        sales,
        addSale,
        getUserSales,
        getWeeklyTotal,
        getUserWeeklyTotal,
        getTopSellers,
        shifts,
        archives,
        resetWeek,
        taxRate,
        primeRate,
        setTaxRate,
        setPrimeRate,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
