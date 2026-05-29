import type { Data } from '@acme/api/data'

import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { getMeQueryOptions, redirectToLoginIfNotAuthenticated } from '@/hooks/auth'
import { invalidateUser, useBillingPortal } from '@/hooks/billing'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  beforeLoad: async () => await redirectToLoginIfNotAuthenticated(),
})

function RouteComponent() {
  const { data: user } = useSuspenseQuery(getMeQueryOptions())
  const [checkout, setCheckout] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setCheckout(params.get('checkout'))
  }, [])

  useEffect(() => {
    if (checkout === 'success') {
      void invalidateUser()
    }
  }, [checkout])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        {checkout === 'success' && (
          <div role="alert" className="alert alert-success">
            <span>Subscription activated. Thanks for upgrading!</span>
          </div>
        )}
        <UserCard user={user} />
        <BillingCard user={user} />
      </div>
    </div>
  )
}

export function UserCard({ user }: { user: Data.Identity.User }) {
  return (
    <div className="card bg-base-100 shadow-xl w-full">
      <div className="card-body">
        <h2 className="card-title">Welcome back!</h2>
        <p className="text-base-content/70">Here&apos;s your account information</p>
        <div className="space-y-4 mt-2">
          <div>
            <p className="text-sm opacity-60">Full Name</p>
            <p className="text-lg font-medium">{user.fullName}</p>
          </div>
          <div>
            <p className="text-sm opacity-60">Email</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function BillingCard({ user }: { user: Data.Identity.User }) {
  const portal = useBillingPortal()

  return (
    <div className="card bg-base-100 shadow-xl w-full">
      <div className="card-body">
        <h2 className="card-title">Billing</h2>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-sm opacity-60">Plan</span>
          {user.isSubscribed ? (
            <span className="badge badge-primary capitalize">{user.plan ?? 'pro'}</span>
          ) : (
            <span className="badge badge-ghost">Free</span>
          )}
        </div>
        {user.subscriptionStatus && (
          <p className="text-sm opacity-60 mt-1 capitalize">
            Status: {user.subscriptionStatus.replace('_', ' ')}
          </p>
        )}
        <div className="card-actions justify-end mt-4">
          {user.isSubscribed ? (
            <button
              type="button"
              className="btn btn-outline"
              disabled={portal.isPending}
              onClick={() => portal.mutate({})}
            >
              {portal.isPending ? 'Opening…' : 'Manage billing'}
            </button>
          ) : (
            <Link to="/pricing" className="btn btn-primary">
              Upgrade to Pro
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
