import { useForgeStore } from '@/store/useForgeStore'
import type { SpecialistRole } from '@/types'
import { cn } from '@/utils/cn'
import { TrendingUp, Palette, Package, Layout, Megaphone, Type } from 'lucide-react'

const SPECIALISTS: { id: SpecialistRole; label: string; shortLabel: string; icon: React.ElementType; description: string }[] = [
  { id: 'strategist',        label: 'Strategist',        shortLabel: 'Strategist',  icon: TrendingUp, description: 'Business & market strategy'    },
  { id: 'creative-director', label: 'Creative Director', shortLabel: 'Creative',    icon: Palette,    description: 'Visual & brand direction'       },
  { id: 'product-architect', label: 'Product Architect', shortLabel: 'Product',     icon: Package,    description: 'Product & feature design'        },
  { id: 'ux-thinker',        label: 'UX Thinker',        shortLabel: 'UX',          icon: Layout,     description: 'User experience & journey'       },
  { id: 'marketer',          label: 'Marketer',          shortLabel: 'Marketer',    icon: Megaphone,  description: 'Marketing & growth'              },
  { id: 'copywriter',        label: 'Copywriter',        shortLabel: 'Copywriter',  icon: Type,       description: 'Words, tone & messaging'         },
]

export function AISpecialists() {
  const { activeSpecialist, setActiveSpecialist } = useForgeStore()

  return (
    <div className="border-b border-forge-border bg-forge-navy/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-2xs text-forge-muted tracking-widest uppercase flex-shrink-0 mr-1">
            SPECIALIST:
          </span>
          {SPECIALISTS.map(({ id, shortLabel, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSpecialist(id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all duration-150',
                activeSpecialist === id
                  ? 'bg-forge-blue/20 border border-forge-blue/30 text-forge-blue'
                  : 'text-forge-muted hover:text-forge-white hover:bg-forge-surface border border-transparent',
              )}
            >
              <Icon size={12} />
              {shortLabel}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
