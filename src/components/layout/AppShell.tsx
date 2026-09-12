import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './Navbar'

export function AppShell() {
  return (
    <div className="min-h-screen bg-forge-black text-forge-white">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#111827',
            color: '#F8F9FA',
            border: '1px solid #1F2937',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
          success: {
            iconTheme: { primary: '#2563EB', secondary: '#F8F9FA' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#F8F9FA' },
          },
        }}
      />
    </div>
  )
}
