import { motion } from 'framer-motion'
import { Lightbulb, BarChart2, Palette, Rocket } from 'lucide-react'
import { useEffect, useState } from 'react'

const FLOW_STEPS = [
  { icon: Lightbulb, label: 'IDEA',     color: '#9CA3AF' },
  { icon: BarChart2, label: 'STRATEGY', color: '#60A5FA' },
  { icon: Palette,   label: 'DESIGN',   color: '#818CF8' },
  { icon: Rocket,    label: 'LAUNCH',   color: '#2563EB' },
]

export function AnimatedFlow() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % FLOW_STEPS.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {FLOW_STEPS.map((step, i) => {
        const Icon = step.icon
        const isActive = i === active
        const isPast = i < active

        return (
          <div key={step.label} className="flex items-center gap-2">
            <motion.div
              animate={{
                opacity: isActive ? 1 : isPast ? 0.5 : 0.3,
                scale: isActive ? 1.05 : 1,
              }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500"
                style={{
                  background: isActive
                    ? `rgba(37, 99, 235, 0.15)`
                    : 'rgba(17, 24, 39, 0.8)',
                  border: `1px solid ${isActive ? 'rgba(37,99,235,0.4)' : 'rgba(31,41,55,0.8)'}`,
                  boxShadow: isActive ? '0 0 20px rgba(37, 99, 235, 0.2)' : 'none',
                }}
              >
                <Icon
                  size={16}
                  style={{ color: isActive ? step.color : '#374151' }}
                />
              </div>
              <span
                className="text-2xs font-semibold tracking-widest transition-colors duration-500"
                style={{ color: isActive ? '#F8F9FA' : '#374151' }}
              >
                {step.label}
              </span>
            </motion.div>

            {/* Arrow between steps */}
            {i < FLOW_STEPS.length - 1 && (
              <motion.div
                animate={{ opacity: isPast || isActive ? 0.8 : 0.2 }}
                transition={{ duration: 0.4 }}
                className="text-forge-border mb-4"
              >
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                  <path
                    d="M1 5h12M9 1l4 4-4 4"
                    stroke={active > i ? '#2563EB' : '#1F2937'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: 'stroke 0.4s' }}
                  />
                </svg>
              </motion.div>
            )}
          </div>
        )
      })}
    </div>
  )
}
