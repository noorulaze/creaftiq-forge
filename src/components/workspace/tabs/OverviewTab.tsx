import { useNavigate } from 'react-router-dom'
import { useForgeStore } from '@/store/useForgeStore'
import type { WorkspaceTab } from '@/types'
import { Layers, Package, Globe, FileText, BarChart2, Map, Palette } from 'lucide-react'

const SECTIONS: { tab: WorkspaceTab; icon: React.ElementType; title: string; description: string }[] = [
  { tab: 'brand',     icon: Layers,   title: 'Brand',     description: 'Names, taglines, personality & visual direction' },
  { tab: 'product',   icon: Package,  title: 'Product',   description: 'Features, user journey & value proposition'      },
  { tab: 'website',   icon: Globe,    title: 'Website',   description: 'Architecture, pages, navigation & UX direction'  },
  { tab: 'content',   icon: FileText, title: 'Content',   description: 'Content pillars, post ideas & campaigns'         },
  { tab: 'marketing', icon: BarChart2,title: 'Marketing', description: 'Channels, strategy & campaign concepts'          },
  { tab: 'roadmap',   icon: Map,      title: 'Roadmap',   description: 'NOW / NEXT / LATER action plan'                  },
]

interface OverviewTabProps { projectName: string; idea: string }

export function OverviewTab({ projectName, idea }: OverviewTabProps) {
  const { setActiveTab } = useForgeStore()

  return (
    <div className="space-y-8">
      {/* Project summary */}
      <div className="rounded-xl border border-forge-border bg-forge-surface p-6">
        <p className="section-label mb-3">YOUR IDEA</p>
        <h2 className="text-xl font-semibold text-forge-white mb-3">{projectName}</h2>
        <p className="text-forge-muted text-sm leading-relaxed">{idea}</p>
      </div>

      {/* Quick nav */}
      <div>
        <p className="section-label mb-4">BLUEPRINT SECTIONS</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SECTIONS.map(({ tab, icon: Icon, title, description }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="text-left rounded-xl border border-forge-border bg-forge-surface p-4 hover:border-forge-border2 hover:bg-forge-surface2 transition-all duration-150 group"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-forge-blue/10 border border-forge-blue/20 flex items-center justify-center">
                  <Icon size={13} className="text-forge-blue" />
                </div>
                <span className="text-xs font-semibold tracking-wider uppercase text-forge-white">{title}</span>
              </div>
              <p className="text-forge-muted text-xs leading-relaxed">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
