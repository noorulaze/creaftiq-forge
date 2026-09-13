import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Spinner } from '@/components/shared'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, initialized } = useAuthStore()
  const location = useLocation()

  if (!initialized) {
    return (
      <div className="min-h-screen bg-forge-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-forge-muted text-sm tracking-widest uppercase">Loading FORGE</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }


  return <>{children}</>
}
