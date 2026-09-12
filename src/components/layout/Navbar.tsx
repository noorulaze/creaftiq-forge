import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { logoutUser } from '@/services/auth'
import { Button } from '@/components/shared'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

export function Navbar() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isLanding = location.pathname === '/'

  async function handleLogout() {
    try {
      await logoutUser()
      navigate('/')
      toast.success('Signed out.')
    } catch {
      toast.error('Failed to sign out.')
    }
  }

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      'border-b border-forge-border/50 bg-forge-black/80 backdrop-blur-md',
    )}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-forge-blue flex items-center justify-center">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xs font-medium tracking-widest uppercase text-forge-muted">CREAFTIQ</span>
              <span className="text-sm font-bold tracking-widest uppercase text-forge-white">FORGE</span>
            </div>
          </Link>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm text-forge-muted hover:text-forge-white transition-colors px-3 py-1.5"
                >
                  <LayoutDashboard size={14} />
                  My Forges
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-sm text-forge-muted hover:text-forge-white transition-colors px-3 py-1.5 rounded-lg hover:bg-forge-surface"
                  >
                    <div className="w-6 h-6 rounded-full bg-forge-blue/20 border border-forge-blue/30 flex items-center justify-center">
                      <span className="text-2xs font-bold text-forge-blue">
                        {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="max-w-[120px] truncate">
                      {user.displayName || user.email}
                    </span>
                    <ChevronDown size={12} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-forge-border bg-forge-surface shadow-card py-1"
                      >
                        <button
                          onClick={() => { handleLogout(); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-forge-muted hover:text-forge-white hover:bg-forge-border transition-colors"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/forge/new')}
                  icon={<Zap size={13} />}
                >
                  New Forge
                </Button>
              </>
            ) : (
              <>
                {!isLanding && (
                  <Link to="/" className="text-sm text-forge-muted hover:text-forge-white transition-colors px-3 py-1.5">
                    Home
                  </Link>
                )}
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-forge-muted hover:text-forge-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-forge-border bg-forge-navy overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-forge-muted hover:text-forge-white rounded-lg hover:bg-forge-surface transition-colors"
                  >
                    <LayoutDashboard size={14} />
                    My Forges
                  </Link>
                  <Link
                    to="/forge/new"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-forge-white bg-forge-blue rounded-lg"
                  >
                    <Zap size={14} />
                    New Forge
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false) }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-forge-muted hover:text-forge-white rounded-lg hover:bg-forge-surface transition-colors"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full px-3 py-2.5 text-sm text-forge-muted hover:text-forge-white rounded-lg hover:bg-forge-surface transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full px-3 py-2.5 text-sm text-white bg-forge-blue rounded-lg text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
