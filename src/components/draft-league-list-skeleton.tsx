'use client'

import { Skeleton } from "@/components/ui/skeleton"

export function DraftLeagueListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-7 w-48" /> {/* League name */}
        <Skeleton className="h-6 w-24" /> {/* Season info */}
      </div>
      <div className="grid gap-4">
        {/* Generate 8 skeleton items for teams */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i} 
            className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-8" /> {/* Rank */}
                  <Skeleton className="h-6 w-48" /> {/* Team name */}
                </div>
                <div className="flex items-center gap-2 pl-11">
                  <Skeleton className="h-4 w-4 rounded-full" /> {/* Avatar */}
                  <Skeleton className="h-4 w-36" /> {/* Manager name */}
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-6 w-24" /> {/* Points */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 