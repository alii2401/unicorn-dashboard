"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  CreditCard,
  BarChart3,
  Timer,
  Sparkles,
  Crown,
  User,
  LogOut,
  TrendingUp,
  Lock,
} from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { currentUser, setCurrentUser, isOnDuty, shiftStartTime, startShift, endShift } = useAuth()
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isOnDuty && shiftStartTime) {
      // Calculate elapsed time from shift start
      const updateTimer = () => {
        const elapsed = Math.floor((Date.now() - shiftStartTime.getTime()) / 1000)
        setTimer(elapsed)
      }
      updateTimer()
      interval = setInterval(updateTimer, 1000)
    } else {
      setTimer(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isOnDuty, shiftStartTime])

  const handleToggleDuty = useCallback(() => {
    if (isOnDuty) {
      endShift()
    } else {
      startShift()
    }
  }, [isOnDuty, startShift, endShift])

  const handleLogout = useCallback(() => {
    if (isOnDuty) {
      endShift()
    }
    setCurrentUser(null)
  }, [isOnDuty, endShift, setCurrentUser])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const isBoss = currentUser?.role === "boss"

  const navItems = [
    { id: "caisse", label: "Caisse", icon: CreditCard, visible: true, locked: false },
    { id: "mystats", label: "Mes Statistiques", icon: TrendingUp, visible: true, locked: false },
    { id: "admin", label: "Administration", icon: BarChart3, visible: true, locked: !isBoss },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">
              Vanilla Unicorn
            </h1>
            <p className="text-xs text-muted-foreground">Dashboard Manager</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="bg-secondary/30 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                isBoss
                  ? "bg-gradient-to-br from-primary to-accent"
                  : "bg-secondary"
              )}
            >
              {isBoss ? (
                <Crown className="w-5 h-5 text-primary-foreground" />
              ) : (
                <User className="w-5 h-5 text-secondary-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sidebar-foreground truncate">
                Bienvenue, {currentUser?.firstName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs font-medium rounded-full",
                    isBoss
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {isBoss ? "Patronne" : "Employé(e)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isLocked = item.locked
          
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12",
                activeTab === item.id &&
                  "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                isLocked && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !isLocked && setActiveTab(item.id)}
              disabled={isLocked}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {isLocked && (
                <Lock className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          )
        })}
      </nav>

      {/* Clock In/Out */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-sidebar-foreground flex items-center gap-2">
              <Timer className="w-4 h-4" />
              POINTEUSE
            </span>
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                isOnDuty ? "bg-green-500 animate-pulse" : "bg-red-500"
              )}
            />
          </div>

          {isOnDuty && (
            <div className="text-center space-y-1">
              <p className="text-xs text-green-400 font-medium">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <span className="text-2xl font-mono font-bold text-accent">
                {formatTime(timer)}
              </span>
            </div>
          )}

          <Button
            onClick={handleToggleDuty}
            className={cn(
              "w-full font-semibold transition-all duration-300",
              isOnDuty
                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25"
                : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25"
            )}
          >
            {isOnDuty ? "Fin de Service" : "Prendre Service"}
          </Button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-5 h-5" />
          Se déconnecter
        </Button>
      </div>
    </aside>
  )
}
