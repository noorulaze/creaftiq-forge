import { motion } from 'framer-motion'
import { useForgeStore } from '@/store/useForgeStore'
import type { WorkspaceTab } from '@/types'
import { cn } from '@/utils/cn'
import { useRef } from 'react'

export type ExtendedWorkspaceTab = WorkspaceTab | 'creativeDirection'

const TABS: { id: ExtendedWorkspaceTab; label: string }[] = [
  { id: 'overview',          label: 'Overview'           },
  { id: 'brand',             label: 'Brand'              },
  { id: 'product',           label: 'Product'            },
  { id: 'website',           label: 'Website'            },
  { id: 'content',           label: 'Content'            },
  { id: 'marketing',         label: 'Marketing'          },
  { id: 'roadmap',           label: 'Roadmap'            },
  { id: 'creativeDirection', label: 'Creative Direction' },
]

interface WorkspaceNavProps {
  currentTab: ExtendedWorkspaceTab
  onTabChange: (tab: ExtendedWorkspaceTab) => void
}

export function WorkspaceNav({ currentTab, onTabChange }: WorkspaceNavProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="sticky top-14 z-30 bg-forge-black/90 backdrop-blur-md border-b border-forge-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={containerRef}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1"
        >
          {TABS.map(tab => {
            const isActive = currentTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'relative flex-shrink-0 px-4 py-3 text-xs font-medium tracking-wider uppercase transition-colors duration-150',
                  isActive
                    ? 'text-forge-white font-semibold'
                    : 'text-forge-muted hover:text-forge-white',
                )}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="workspace-tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-forge-blue rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
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
