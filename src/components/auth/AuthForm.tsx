import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, Zap } from 'lucide-react'
import { Button } from '@/components/shared'
import { cn } from '@/utils/cn'
import { registerUser, loginUser } from '@/services/auth'
import toast from 'react-hot-toast'

interface AuthFormProps {
  mode: 'login' | 'register'
}

function mapAuthError(code: string): string {
  const map: Record<string, string> = {
    'auth/email-already-in-use':    'An account with this email already exists.',
    'auth/invalid-email':           'Please enter a valid email address.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password. Please try again.',
    'auth/invalid-credential':      'Invalid email or password.',
    'auth/too-many-requests':       'Too many attempts. Please try again later.',
    'auth/network-request-failed':  'Network error. Check your connection.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate()
  const isLogin = mode === 'login'

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [showPass, setShowPass]       = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    if (!isLogin && !displayName.trim()) {
      setError('Please enter your name.')
      return
    }

    setLoading(true)
    try {
      if (isLogin) {
        await loginUser(email, password)
        toast.success('Welcome back.')
      } else {
        await registerUser(email, password, displayName)
        toast.success('Account created. Welcome to FORGE.')
      }
      navigate('/dashboard')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || ''
      setError(mapAuthError(code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-forge-black flex items-center justify-center px-4 pt-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-forge-blue flex items-center justify-center mb-4">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <p className="text-2xs font-medium tracking-widest2 uppercase text-forge-muted mb-0.5">CREAFTIQ</p>
          <h1 className="text-2xl font-black tracking-widest uppercase text-forge-white">FORGE</h1>
        </div>

        {/* Heading */}
        <h2 className="text-lg font-semibold text-forge-white text-center mb-1">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-forge-muted text-sm text-center mb-8">
          {isLogin
            ? 'Sign in to continue to your creative workspace.'
            : 'Start turning ideas into digital launch plans.'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="forge-label">Your Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Alex Johnson"
                className="forge-input"
                autoComplete="name"
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className="forge-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="forge-input"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div>
            <label className="forge-label">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isLogin ? '••••••••' : 'At least 6 characters'}
                className={cn('forge-input pr-10')}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-forge-muted hover:text-forge-white transition-colors"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
            >
              <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-xs">{error}</p>
            </motion.div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            className="mt-2 tracking-wide"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Switch mode */}
        <p className="text-center text-forge-muted text-sm mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link
            to={isLogin ? '/register' : '/login'}
            className="text-forge-blue hover:text-forge-blue-light transition-colors font-medium"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
