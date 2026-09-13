import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { useAuthStore } from '@/store/useAuthStore'
import { Spinner } from '@/components/shared'

// Pages
import { LandingPage }       from '@/pages/LandingPage'
import { LoginPage }         from '@/pages/LoginPage'
import { RegisterPage }      from '@/pages/RegisterPage'
import { DashboardPage }     from '@/pages/DashboardPage'
import { MyForgesPage }      from '@/pages/MyForgesPage'
import { CreateProjectPage } from '@/pages/CreateProjectPage'
import { ForgingPage }       from '@/pages/ForgingPage'
import { IdeaDNAPage }       from '@/pages/IdeaDNAPage'
import { WorkspacePage }     from '@/pages/WorkspacePage'
import { WebsiteBuilderPage } from '@/pages/WebsiteBuilderPage'

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

        {/* Forge routes */}
        <Route path="/forge/new" element={<CreateProjectPage />} />
        <Route path="/forge/:projectId" element={<WorkspacePage />} />
        <Route path="/forge/:projectId/dna" element={<IdeaDNAPage />} />

        {/* Protected routes */}
        <Route
          path="/my-forges"
          element={<ProtectedRoute><MyForgesPage /></ProtectedRoute>}
        />
        <Route
          path="/website-builder"
          element={<ProtectedRoute><WebsiteBuilderPage /></ProtectedRoute>}
        />
        <Route
          path="/dashboard"
          element={<Navigate to="/my-forges" replace />}
        />
      </Route>


      {/* Forging page — full screen, no navbar */}
      <Route
        path="/forge/:projectId/processing"
        element={<ForgingPage />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
