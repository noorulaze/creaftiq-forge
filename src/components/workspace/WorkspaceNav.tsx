import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Palette,
  Layers,
  Globe,
  Film,
  Megaphone,
  Milestone,
  Sparkles,
} from 'lucide-react'
import type { WorkspaceTab } from '@/types'
import { cn } from '@/utils/cn'
import { useRef, useEffect } from 'react'

export type ExtendedWorkspaceTab = WorkspaceTab | 'creativeDirection'

const TABS: { id: ExtendedWorkspaceTab; label: string; icon: any }[] = [
  { id: 'overview',          label: 'Overview',           icon: LayoutDashboard },
  { id: 'brand',             label: 'Brand',              icon: Palette         },
  { id: 'product',           label: 'Product',            icon: Layers          },
  { id: 'website',           label: 'Website',            icon: Globe           },
  { id: 'content',           label: 'Content',            icon: Film            },
  { id: 'marketing',         label: 'Marketing',          icon: Megaphone       },
  { id: 'roadmap',           label: 'Roadmap',            icon: Milestone       },
  { id: 'creativeDirection', label: 'Creative Direction', icon: Sparkles        },
]

interface WorkspaceNavProps {
  currentTab: ExtendedWorkspaceTab
  onTabChange: (tab: ExtendedWorkspaceTab) => void
}

export function WorkspaceNav({ currentTab, onTabChange }: WorkspaceNavProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeBtnRef = useRef<HTMLButtonElement | null>(null)

  // Auto-scroll active tab into view smoothly on mobile/tablet
  useEffect(() => {
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [currentTab])

  return (
    <div className="relative bg-forge-black/95 backdrop-blur-md border-b border-forge-border">
      {/* Subtle edge fades for mobile scroll indication */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-forge-black to-transparent z-10 sm:hidden" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-forge-black to-transparent z-10 sm:hidden" />

      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <div
          ref={containerRef}
          className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1.5 px-2"
        >
          {TABS.map(tab => {
            const isActive = currentTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                ref={isActive ? activeBtnRef : null}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 flex-shrink-0 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wider uppercase transition-all duration-150',
                  isActive
                    ? 'text-forge-white bg-forge-navy/90 font-semibold border border-forge-blue/30 shadow-blue-glow-sm'
                    : 'text-forge-muted hover:text-forge-white hover:bg-forge-surface/60 border border-transparent',
                )}
              >
                <Icon
                  size={14}
                  className={cn(
                    'flex-shrink-0 transition-colors',
                    isActive ? 'text-forge-blue' : 'text-forge-muted'
                  )}
                />
                <span>{tab.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="workspace-tab-indicator"
                    className="absolute -bottom-1.5 left-3 right-3 h-0.5 bg-forge-blue rounded-full shadow-[0_0_8px_#2563EB]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

