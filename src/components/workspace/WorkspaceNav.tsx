import { motion } from 'framer-motion'
import { useForgeStore } from '@/store/useForgeStore'
import type { WorkspaceTab } from '@/types'
import { cn } from '@/utils/cn'
import { useRef } from 'react'

const TABS: { id: WorkspaceTab; label: string }[] = [
  { id: 'overview',   label: 'Overview'   },
  { id: 'brand',      label: 'Brand'      },
  { id: 'product',    label: 'Product'    },
  { id: 'website',    label: 'Website'    },
  { id: 'content',    label: 'Content'    },
  { id: 'marketing',  label: 'Marketing'  },
  { id: 'roadmap',    label: 'Roadmap'    },
]

interface WorkspaceNavProps {
  creativeBoard?: boolean
  onCreativeBoard?: () => void
}

export function WorkspaceNav({ creativeBoard, onCreativeBoard }: WorkspaceNavProps) {
  const { activeTab, setActiveTab } = useForgeStore()
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="sticky top-14 z-30 bg-forge-black/90 backdrop-blur-md border-b border-forge-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={containerRef}
          className="flex items-center gap-0 overflow-x-auto no-scrollbar"
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex-shrink-0 px-4 py-3.5 text-xs font-medium tracking-wider uppercase transition-colors duration-150',
                activeTab === tab.id
                  ? 'text-forge-white'
                  : 'text-forge-muted hover:text-forge-white',
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-forge-blue rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}

          {/* Creative Board */}
          <button
            onClick={onCreativeBoard}
            className={cn(
              'flex-shrink-0 px-4 py-3.5 text-xs font-medium tracking-wider uppercase transition-colors duration-150',
              creativeBoard ? 'text-forge-white' : 'text-forge-muted hover:text-forge-white',
              'ml-auto',
            )}
          >
            Creative Board
          </button>
        </div>
      </div>
    </div>
  )
}
