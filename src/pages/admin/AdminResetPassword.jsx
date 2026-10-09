import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { updateAdminPassword } from '../../services/adminService.js'

export default function AdminResetPassword() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let mounted = true
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const query = new URLSearchParams(window.location.search)
    const code = query.get('code')
    const tokenHash = query.get('token_hash')
    const type = query.get('type')
    const isRecovery = hash.get('type') === 'recovery' || type === 'recovery' || Boolean(code)
    const checkRecovery = async () => {
      try {
        if (query.get('error') || hash.get('error')) throw new Error(query.get('error_description') || hash.get('error_description') || 'Reset link is invalid or expired.')
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) throw exchangeError
        } else if (tokenHash && type === 'recovery') {
          const { error: verifyError } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' })
          if (verifyError) throw verifyError
        } else if (hash.get('access_token') && hash.get('refresh_token')) {
          const { error: sessionError } = await supabase.auth.setSession({ access_token: hash.get('access_token'), refresh_token: hash.get('refresh_token') })
          if (sessionError) throw sessionError
        }
        if (!isRecovery) throw new Error('Open this page using the password reset link sent to your email.')
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) throw new Error('Your reset link is invalid or expired. Request a new link.')
        if (mounted) {
          setReady(true)
          window.history.replaceState({}, '', '/admin/reset-password')
        }
      } catch (err) { if (mounted) setError(err.message) }
    }
    checkRecovery()
    return () => { mounted = false }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (password.length < 8) return setError('Password must contain at least 8 characters.')
    if (password !== confirm) return setError('Passwords do not match.')
    setLoading(true)
    try {
      await updateAdminPassword(password)
      await supabase.auth.signOut()
      setDone(true)
    } catch (err) { setError(err.message || 'Could not update password.') }
    finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-[2rem] bg-white border border-navy/10 shadow-xl p-8">
        <h1 className="text-3xl font-display font-extrabold text-navy">Set New Password</h1>
        <p className="mt-2 text-sm text-charcoal/60">SA Group secure admin password recovery</p>
        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</p>}
        {done ? (
          <div className="mt-6 space-y-4">
            <p role="status" className="text-green-700">Password updated successfully. Sign in with your new password.</p>
            <button onClick={() => navigate('/admin/login', { replace: true })} className="w-full rounded-xl bg-navy px-5 py-3 text-white font-semibold">Go to Admin Login</button>
          </div>
        ) : ready ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-navy">New Password
              <input required type="password" autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-navy/20 p-3" />
            </label>
            <label className="block text-sm font-semibold text-navy">Confirm Password
              <input required type="password" autoComplete="new-password" minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-2 w-full rounded-xl border border-navy/20 p-3" />
            </label>
            <button disabled={loading} type="submit" className="w-full rounded-xl bg-navy px-5 py-3 text-white font-semibold disabled:opacity-50">{loading ? 'Updating...' : 'Update Password'}</button>
          </form>
        ) : !error ? <p className="mt-6 text-sm">Validating your recovery link...</p> : null}
        <Link className="block mt-6 text-center text-sm font-semibold text-navy hover:text-amber" to="/admin/login">Back to Login</Link>
      </div>
    </main>
  )
}
