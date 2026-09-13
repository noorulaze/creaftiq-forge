import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/shared'
import { cn } from '@/utils/cn'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: 'HOW IT WORKS', href: '#how-it-works' },
    { label: 'FEATURES', href: '#features' },
    { label: 'ABOUT', href: '#about' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-forge-black/85 backdrop-blur-md border-b border-forge-border/40 transition-colors">
      <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Wordmark on the left */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 rounded bg-forge-blue/15 border border-forge-blue/30 flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-forge-blue text-xs font-mono font-bold">F</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xs font-semibold tracking-widest3 uppercase text-forge-muted">CREAFTIQ</span>
              <span className="text-xs font-bold tracking-widest2 uppercase text-forge-white">FORGE</span>
            </div>
          </Link>

          {/* Center navigation links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-2xs font-semibold tracking-widest2 uppercase text-forge-muted hover:text-forge-white transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/forge/new">
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight size={13} />}
                iconPosition="right"
                className="text-2xs font-semibold tracking-widest uppercase px-4 py-2 rounded-lg"
              >
                START FORGING
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-forge-muted hover:text-forge-white transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-forge-border bg-forge-navy/95 px-4 py-5 space-y-4"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-xs font-semibold tracking-widest uppercase text-forge-muted hover:text-forge-white py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="pt-2 border-t border-forge-border/60">
              <Link to="/forge/new" onClick={() => setMobileOpen(false)}>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  className="text-xs font-semibold tracking-widest uppercase"
                >
                  START FORGING
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
