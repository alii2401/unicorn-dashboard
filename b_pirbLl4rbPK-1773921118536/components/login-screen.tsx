"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { USERS, type User, useAuth } from "@/lib/auth-context"
import { Sparkles, Crown, User as UserIcon } from "lucide-react"

export function LoginScreen() {
  const { setCurrentUser } = useAuth()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Vanilla Unicorn</h1>
          <p className="text-muted-foreground">Sélectionnez votre profil pour continuer</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-card-foreground text-center">
            Qui êtes-vous ?
          </h2>

          <div className="space-y-3">
            {USERS.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                onClick={() => setCurrentUser(user)}
                className={cn(
                  "w-full h-16 justify-start gap-4 text-left transition-all hover:scale-[1.02]",
                  user.role === "boss" &&
                    "border-primary/50 hover:border-primary hover:bg-primary/10"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    user.role === "boss"
                      ? "bg-gradient-to-br from-primary to-accent"
                      : "bg-secondary"
                  )}
                >
                  {user.role === "boss" ? (
                    <Crown className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-secondary-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-card-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.role === "boss" ? "Patronne" : "Employé(e)"}
                  </p>
                </div>
                {user.role === "boss" && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    ADMIN
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Système de gestion - Version 1.0
        </p>
      </div>
    </div>
  )
}
