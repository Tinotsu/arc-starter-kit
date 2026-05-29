import { match } from 'ts-pattern'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { isAuthenticatedQueryOptions } from '@/hooks/auth'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { data } = useQuery(isAuthenticatedQueryOptions())

  return (
    <div className="hero min-h-[calc(100vh-4rem)]">
      <div className="hero-content text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            AdonisJS Monorepo Starter Kit
          </h1>
          <p className="py-6 opacity-70">
            A minimal, clean starter template for building modern web applications.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {match(data?.isAuthenticated)
              .with(true, () => (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard
                </Link>
              ))
              .otherwise(() => (
                <>
                  <Link to="/auth/login" className="btn btn-outline btn-lg">
                    Sign in
                  </Link>
                  <Link to="/auth/register" className="btn btn-primary btn-lg">
                    Get started
                  </Link>
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
