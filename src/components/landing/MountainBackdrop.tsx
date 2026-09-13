import { motion } from 'framer-motion'

export function MountainBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grain / Noise layer */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Atmospheric deep radial light */}
      <motion.div 
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.18, 0.26, 0.18],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.22)_0%,_rgba(13,17,23,0.05)_55%,_transparent_75%)] blur-3xl"
      />

      {/* Subtle abstract mountain silhouettes inspired by CREAFTIQ */}
      <svg 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[320px] sm:h-[420px] opacity-40 select-none" 
        viewBox="0 0 1440 480" 
        fill="none" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mountainGradFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#0F172A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="mountainGradMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#0D1117" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
            <stop offset="25%" stopColor="#3B82F6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#2563EB" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Far background mountain ridge */}
        <path
          d="M0 480 L0 260 Q 240 180 440 220 T 880 160 Q 1120 120 1440 240 L 1440 480 Z"
          fill="url(#mountainGradFar)"
        />

        {/* Midground atmospheric mountain peak */}
        <path
          d="M0 480 L0 340 Q 260 270 520 200 T 960 210 Q 1200 240 1440 310 L 1440 480 Z"
          fill="url(#mountainGradMid)"
        />

        {/* Thin electric-blue flowing contour ridge */}
        <motion.path
          d="M0 340 Q 260 270 520 200 T 960 210 Q 1200 240 1440 310"
          stroke="url(#lineGlow)"
          strokeWidth="1.2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.85 }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        />
      </svg>

      {/* Ground soft vignette blend */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-forge-black via-forge-black/80 to-transparent" />
    </div>
  )
}
