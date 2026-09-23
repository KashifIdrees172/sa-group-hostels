import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {
  checkCurrentUserIsAdmin,
  getCurrentSession,
} from '../../services/adminService.js'

export default function ProtectedAdminRoute() {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let active = true

    const verifyAdmin = async () => {
      try {
        const session = await getCurrentSession()

        if (!session) {
          if (active) setAllowed(false)
          return
        }

        const isAdmin = await checkCurrentUserIsAdmin()

        if (active) {
          setAllowed(isAdmin)
        }
      } catch (error) {
        console.error('Admin route verification failed:', error)

        if (active) {
          setAllowed(false)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    verifyAdmin()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-navy/15 border-t-amber animate-spin" />
          <p className="mt-4 text-sm font-semibold text-navy">
            Checking admin access...
          </p>
        </div>
      </div>
    )
  }

  if (!allowed) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet />
}
