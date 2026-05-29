import type { Data } from '@acme/api/data'

import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { getMeQueryOptions, redirectToLoginIfNotAuthenticated } from '@/hooks/auth'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  beforeLoad: async () => await redirectToLoginIfNotAuthenticated(),
})

function RouteComponent() {
  const { data: user } = useSuspenseQuery(getMeQueryOptions())

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="w-full max-w-2xl">
        <UserCard user={user} />
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
