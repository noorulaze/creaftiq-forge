import { motion, useReducedMotion } from 'framer-motion'

export function MountainBackdrop() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. Fine organic grain layer for depth and print-like feel */}
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* 2. Slow breathing celestial atmospheric light aura */}
      <motion.div 
        animate={shouldReduceMotion ? {} : {
          scale: [1, 1.08, 1],
          opacity: [0.22, 0.35, 0.22],
          x: ['-50%', '-48%', '-50%'],
          y: ['0%', '3%', '0%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-48 left-1/2 w-[700px] sm:w-[1100px] h-[500px] sm:h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.3)_0%,_rgba(17,24,39,0.1)_50%,_transparent_75%)] blur-3xl"
      />

      {/* 3. Secondary gentle atmospheric illumination on the right side behind the UI cards */}
      <motion.div 
        animate={shouldReduceMotion ? {} : {
          opacity: [0.15, 0.28, 0.15],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/4 right-0 w-[550px] sm:w-[750px] h-[450px] sm:h-[650px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.22)_0%,_rgba(30,58,138,0.06)_55%,_transparent_80%)] blur-3xl"
      />

      {/* 4. Multi-layered softly blurred Mountain Silhouettes */}
      <svg 
        className="absolute bottom-0 right-0 w-full sm:w-[95%] lg:w-[85%] h-[380px] sm:h-[540px] lg:h-[640px] opacity-40 select-none" 
        viewBox="0 0 1440 700" 
        fill="none" 
        preserveAspectRatio="none"
      >
        <defs>
          {/* Deep distant mountain gradient */}
          <linearGradient id="mtnGradFarLayer" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#1E293B" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0" />
          </linearGradient>

          {/* Atmospheric midground mountain gradient with rich navy tone */}
          <linearGradient id="mtnGradMidLayer" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#0F172A" stopOpacity="0.65" />
            <stop offset="85%" stopColor="#0A0A0F" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0A0A0F" stopOpacity="1" />
          </linearGradient>

          {/* Glowing electric blue ridge gradient flowing through the composition */}
          <linearGradient id="flowingElectricRidge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
            <stop offset="15%" stopColor="#2563EB" stopOpacity="0.3" />
            <stop offset="45%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#60A5FA" stopOpacity="1" />
            <stop offset="90%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
          </linearGradient>

          {/* Secondary softer line gradient */}
          <linearGradient id="subtleContour" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Far background soft ridge — grand scale */}
        <path
          d="M0 700 L0 440 Q 320 280 640 340 T 1150 220 Q 1300 180 1440 280 L 1440 700 Z"
          fill="url(#mtnGradFarLayer)"
        />

        {/* Midground mountain peak with soft blur silhouette */}
        <path
          d="M0 700 L0 510 Q 360 400 680 270 T 1160 310 Q 1320 340 1440 450 L 1440 700 Z"
          fill="url(#mtnGradMidLayer)"
        />

        {/* Secondary subtle contour line */}
        <motion.path
          d="M0 550 Q 360 440 680 320 T 1160 360 Q 1320 390 1440 490"
          stroke="url(#subtleContour)"
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
          initial={shouldReduceMotion ? { opacity: 0.4 } : { opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.5 }}
        />

        {/* Main electric blue flowing contour ridge — intentional, smooth vector */}
        <motion.path
          d="M0 510 Q 360 400 680 270 T 1160 310 Q 1320 340 1440 450"
          stroke="url(#flowingElectricRidge)"
          strokeWidth="1.5"
          fill="none"
          initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.9 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.95 }}
          transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      {/* 5. Seamless ground fade to preserve text readability */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-forge-black via-forge-black/85 to-transparent" />
    </div>
  )
}
