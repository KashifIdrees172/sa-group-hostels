import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../../components/common/Logo.jsx'
import {
  adminLogin,
  sendAdminPasswordReset,
  checkCurrentUserIsAdmin,
  getCurrentSession,
} from '../../services/adminService.js'

export default function AdminLogin() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [checking, setChecking] = useState(true)
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetSubmitting, setResetSubmitting] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let active = true

    const checkSession = async () => {
      try {
        const session = await getCurrentSession()

        if (!session) return

        const isAdmin = await checkCurrentUserIsAdmin()

        if (active && isAdmin) {
          setAlreadyLoggedIn(true)
        }
      } catch (sessionError) {
        console.error('Admin session check failed:', sessionError)
      } finally {
        if (active) {
          setChecking(false)
        }
      }
    }

    checkSession()

    return () => {
      active = false
    }
  }, [])

  const updateField = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password) {
      setError('Please enter your admin email and password.')
      return
    }

    setSubmitting(true)

    try {
      await adminLogin(
        form.email.trim(),
        form.password,
      )

      const requestedPath = location.state?.from?.pathname

      navigate(
        requestedPath?.startsWith('/admin')
          ? requestedPath
          : '/admin/dashboard',
        { replace: true },
      )
    } catch (loginError) {
      console.error('Admin login failed:', loginError)

      setError(
        loginError?.message ||
          'Unable to sign in. Please check your email and password.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgotPassword = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.email.trim()) {
      setError('Enter your admin email address.')
      return
    }
    setResetSubmitting(true)
    try {
      await sendAdminPasswordReset(form.email)
      setResetSent(true)
    } catch (resetError) {
      setError(resetError?.message || 'Unable to send reset email. Please try again.')
    } finally {
      setResetSubmitting(false)
    }
  }

  if (alreadyLoggedIn && !resetMode) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden flex items-center justify-center px-5 py-10">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl border border-navy/10 rounded-[2rem] shadow-2xl shadow-navy/10 p-7 sm:p-9">
          <div className="flex justify-center">
            <Logo
              size={82}
              animated={false}
            />
          </div>

          <div className="text-center mt-5">
            <p className="text-xs uppercase tracking-[0.22em] font-bold text-amber">
              Secure Administration
            </p>

            <h1 className="mt-2 text-3xl font-display font-extrabold text-navy">
              {resetMode ? 'Reset Password' : 'Admin Login'}
            </h1>

            <p className="mt-2 text-sm leading-6 text-charcoal/55">
              {resetMode
                ? 'Enter your admin email to receive a password reset link.'
                : 'Sign in to manage hotel bookings, rooms, prices and parking availability.'}
            </p>
          </div>

          {checking ? (
            <div className="py-12 text-center">
              <div className="w-10 h-10 mx-auto rounded-full border-4 border-navy/15 border-t-amber animate-spin" />
              <p className="mt-3 text-sm text-charcoal/55">
                Checking your session...
              </p>
            </div>
          ) : (
            <form
              onSubmit={resetMode ? handleForgotPassword : handleSubmit}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-sm font-semibold text-navy mb-2"
                >
                  Email Address
                </label>

                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  autoComplete="username"
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3.5 text-sm text-navy outline-none transition focus:border-amber focus:ring-4 focus:ring-amber/10"
                />
              </div>

              {!resetMode && <div>
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-semibold text-navy mb-2"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={updateField}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3.5 pr-12 text-sm text-navy outline-none transition focus:border-amber focus:ring-4 focus:ring-amber/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-charcoal/40 hover:text-navy transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>}

              {resetMode && resetSent && (
                <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  If an account exists for that email, a reset link has been sent. Check your inbox and spam folder.
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || resetSubmitting}
                className="w-full rounded-xl bg-navy px-5 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber hover:text-navy hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {resetMode ? (resetSubmitting ? 'Sending...' : 'Send Reset Link') : (submitting ? 'Signing in...' : 'Login to Dashboard')}
              </button>
              <button type="button" className="w-full text-sm font-semibold text-navy hover:text-amber" onClick={() => { setResetMode((v) => !v); setResetSent(false); setError('') }}>
                {resetMode ? 'Back to Login' : 'Forgot Password?'}
              </button>
            </form>
          )}

          <p className="mt-7 text-center text-xs text-charcoal/40">
            Authorized SA Group administrators only.
          </p>
        </div>
      </div>
    </div>
  )
}
