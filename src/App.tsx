import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { useAuthStore } from '@/store/useAuthStore'
import { Spinner } from '@/components/shared'

// Pages — lazy would be ideal in production; direct imports for simplicity
import { LandingPage }       from '@/pages/LandingPage'
import { LoginPage }         from '@/pages/LoginPage'
import { RegisterPage }      from '@/pages/RegisterPage'
import { DashboardPage }     from '@/pages/DashboardPage'
import { CreateProjectPage } from '@/pages/CreateProjectPage'
import { ForgingPage }       from '@/pages/ForgingPage'
import { WorkspacePage }     from '@/pages/WorkspacePage'

export default function App() {
  const { initialize, initialized, loading } = useAuthStore()

  useEffect(() => {
    const unsubscribe = initialize()
    return unsubscribe
  }, [initialize])

  // Show splash while Firebase Auth initializes
  if (!initialized && loading) {
    return (
      <div className="min-h-screen bg-forge-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-forge-blue/20 border border-forge-blue/30 flex items-center justify-center">
            <span className="text-forge-blue font-bold text-sm tracking-widest">F</span>
          </div>
          <Spinner size="sm" />
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes with Navbar shell */}
      <Route element={<AppShell />}>
        <Route index path="/" element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/forge/new"
          element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>}
        />
        <Route
          path="/forge/:projectId"
          element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>}
        />
      </Route>

      {/* Forging page — full screen, no navbar */}
      <Route
        path="/forge/:projectId/processing"
        element={<ProtectedRoute><ForgingPage /></ProtectedRoute>}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
