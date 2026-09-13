import { motion, useReducedMotion } from 'framer-motion'

export function MountainBackdrop() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle organic noise/grain */}
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Atmospheric deep radial light with slow subtle breathing */}
      <motion.div 
        animate={shouldReduceMotion ? {} : {
          scale: [1, 1.06, 1],
          opacity: [0.18, 0.28, 0.18],
          x: ['-50%', '-48%', '-50%']
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 left-1/2 w-[650px] sm:w-[950px] h-[450px] sm:h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.25)_0%,_rgba(13,17,23,0.08)_50%,_transparent_75%)] blur-3xl"
      />

      {/* Atmospheric blurred mountain landscape — soft and non-distracting */}
      <svg 
        className="absolute bottom-0 right-0 w-full sm:w-[90%] md:w-[75%] h-[350px] sm:h-[500px] md:h-[580px] opacity-35 select-none" 
        viewBox="0 0 1200 600" 
        fill="none" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mtnGradFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#0F172A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="mtnGradMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
            <stop offset="45%" stopColor="#0D1117" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="electricRidge" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
            <stop offset="30%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#60A5FA" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#2563EB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Far background soft ridge */}
        <path
          d="M100 600 L100 360 Q 380 240 620 290 T 1050 190 Q 1140 160 1200 240 L 1200 600 Z"
          fill="url(#mtnGradFar)"
        />

        {/* Midground atmospheric peak */}
        <path
          d="M0 600 L0 440 Q 320 330 580 230 T 980 260 Q 1100 280 1200 380 L 1200 600 Z"
          fill="url(#mtnGradMid)"
        />

        {/* Thin electric blue glowing line flowing across the mountain edge */}
        <motion.path
          d="M0 440 Q 320 330 580 230 T 980 260 Q 1100 280 1200 380"
          stroke="url(#electricRidge)"
          strokeWidth="1.25"
          fill="none"
          initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.85 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
      </svg>

      {/* Ground soft blend to ensure text contrast */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forge-black via-forge-black/80 to-transparent" />
    </div>
  )
}
