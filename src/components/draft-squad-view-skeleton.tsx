'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DraftSquadViewSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="bg-muted/5">
        <CardHeader className="space-y-2 pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" /> {/* Team badge */}
            <Skeleton className="h-7 w-64" /> {/* Team name */}
          </div>
          <div className="flex items-center gap-2 pl-11">
            <Skeleton className="h-4 w-4 rounded-full" /> {/* Manager avatar */}
            <Skeleton className="h-4 w-48" /> {/* Manager name */}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Starting XI */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" /> {/* Icon */}
              <Skeleton className="h-5 w-24" /> {/* "Starting XI" text */}
            </div>
            <div className="grid gap-2">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={`starting-${i}`} className="p-3 bg-background rounded-lg border hover:bg-accent/5 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" /> {/* Player photo */}
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-32" /> {/* Player name */}
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-16" /> {/* Position */}
                          <Skeleton className="h-4 w-4 rounded-full" /> {/* Status indicator */}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6" /> {/* Team logo */}
                      <Skeleton className="h-4 w-16" /> {/* Team abbreviation */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bench */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" /> {/* Icon */}
              <Skeleton className="h-5 w-16" /> {/* "Bench" text */}
            </div>
            <div className="grid gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`bench-${i}`} className="p-3 bg-background rounded-lg border hover:bg-accent/5 transition-colors opacity-75">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" /> {/* Player photo */}
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-32" /> {/* Player name */}
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-16" /> {/* Position */}
                          <Skeleton className="h-4 w-4 rounded-full" /> {/* Status indicator */}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6" /> {/* Team logo */}
                      <Skeleton className="h-4 w-16" /> {/* Team abbreviation */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 