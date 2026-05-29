import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'

import { query } from '@/lib/tuyau'
import { queryClient } from '@/lib/query_client'
import { getMeQueryOptions } from '@/hooks/auth'

export default function Header() {
  const navigate = useNavigate()
  const { data: user } = useQuery(getMeQueryOptions())

  const logout = useMutation(
    query.auth.logout.mutationOptions({
      onSuccess: async () => {
        queryClient.clear()
        await navigate({ to: '/' })
      },
    }),
  )

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4 sm:px-6 lg:px-8">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl font-semibold">
          StarterKit
        </Link>
      </div>

      <div className="navbar-end hidden md:flex gap-1">
        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-ghost">
              Dashboard
            </Link>
            <button type="button" className="btn btn-ghost" onClick={() => logout.mutate({})}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/auth/login" className="btn btn-ghost">
              Sign in
            </Link>
            <Link to="/auth/register" className="btn btn-primary">
              Get started
            </Link>
          </>
        )}
      </div>

      <div className="navbar-end md:hidden">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-square" aria-label="Menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {user ? (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <button type="button" onClick={() => logout.mutate({})}>
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/auth/login">Sign in</Link>
                </li>
                <li>
                  <Link to="/auth/register" className="btn btn-primary btn-sm">
                    Get started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
