import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-forge-border bg-forge-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-forge-blue flex items-center justify-center">
                <Zap size={12} className="text-white" fill="white" />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase text-forge-white">CREAFTIQ FORGE</span>
            </div>
            <p className="text-forge-muted text-xs max-w-xs">
              Turn an idea into a digital launch plan.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6">
            <Link to="/" className="text-forge-muted hover:text-forge-white text-xs tracking-wide transition-colors">Home</Link>
            <a href="#how-it-works" className="text-forge-muted hover:text-forge-white text-xs tracking-wide transition-colors">How It Works</a>
            <Link to="/login" className="text-forge-muted hover:text-forge-white text-xs tracking-wide transition-colors">Sign In</Link>
            <Link to="/register" className="text-forge-muted hover:text-forge-white text-xs tracking-wide transition-colors">Get Started</Link>
          </nav>

          {/* Built by */}
          <div className="text-right">
            <p className="text-forge-muted text-xs tracking-widest uppercase">BUILT BY</p>
            <p className="text-forge-white text-xs font-semibold tracking-widest uppercase mt-0.5">CREAFTIQ</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-forge-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-forge-muted text-xs">
            © {new Date().getFullYear()} CREAFTIQ. All rights reserved.
          </p>
          <p className="text-forge-muted/50 text-xs">CREAFTIQ FORGE v1.0</p>
        </div>
      </div>
    </footer>
  )
}
