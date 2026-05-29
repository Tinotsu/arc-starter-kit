import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { getMeQueryOptions } from '@/hooks/auth'
import { useCheckout } from '@/hooks/billing'

export const Route = createFileRoute('/pricing')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user } = useQuery(getMeQueryOptions())
  const checkout = useCheckout()

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-3">Simple pricing</h1>
        <p className="opacity-70 mb-10">Start free, upgrade when you need more.</p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Free</h2>
              <p className="text-3xl font-bold">$0</p>
              <p className="opacity-70">For getting started</p>
              <ul className="text-sm space-y-2 my-4 text-left w-full">
                <li>✓ Account & dashboard</li>
                <li>✓ Basic features</li>
              </ul>
              {user ? (
                user.isSubscribed ? (
                  <span className="badge badge-ghost">Current plan</span>
                ) : (
                  <span className="badge badge-outline">Your current plan</span>
                )
              ) : (
                <Link to="/auth/register" className="btn btn-outline w-full">
                  Get started
                </Link>
              )}
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-primary">
            <div className="card-body items-center text-center">
              <div className="badge badge-primary">Popular</div>
              <h2 className="card-title">Pro</h2>
              <p className="text-3xl font-bold">$19</p>
              <p className="opacity-70">per month</p>
              <ul className="text-sm space-y-2 my-4 text-left w-full">
                <li>✓ Everything in Free</li>
                <li>✓ Priority support</li>
                <li>✓ All premium features</li>
              </ul>
              {user?.isSubscribed ? (
                <Link to="/dashboard" className="btn btn-primary w-full">
                  Manage on dashboard
                </Link>
              ) : user ? (
                <button
                  type="button"
                  className="btn btn-primary w-full"
                  disabled={checkout.isPending}
                  onClick={() => checkout.mutate({ body: { plan: 'pro' } })}
                >
                  {checkout.isPending ? 'Redirecting…' : 'Subscribe to Pro'}
                </button>
              ) : (
                <Link to="/auth/register" className="btn btn-primary w-full">
                  Sign up to subscribe
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
