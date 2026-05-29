import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

import { query } from '@/lib/tuyau'
import { queryClient } from '@/lib/query_client'
import { redirectToDashboardIfAuthenticated } from '@/hooks/auth'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
  beforeLoad: () => redirectToDashboardIfAuthenticated(),
})

function RouteComponent() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const login = useMutation(
    query.auth.login.mutationOptions({
      onSuccess: async () => {
        await queryClient.resetQueries()
        await navigate({ to: '/dashboard' })
      },
      onError: (error: any) => {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors)
        } else {
          setErrors({ general: 'Login failed. Please check your credentials.' })
        }
      },
    }),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    login.mutate({ body: { email: formData.email, password: formData.password } })
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-lg">
        <div className="card-body">
          <h2 className="card-title">Login to your account</h2>
          <p className="text-base-content/70">Enter your email below to login to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {errors.general && (
              <div role="alert" className="alert alert-error">
                <span>{errors.general}</span>
              </div>
            )}

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={handleChange('email')}
                required
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Password</span>
                <a href="#" className="label-text-alt link link-hover">
                  Forgot your password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={handleChange('password')}
                required
              />
            </label>

            <div className="form-control mt-2">
              <button type="submit" className="btn btn-primary" disabled={login.isPending}>
                {login.isPending ? 'Logging in...' : 'Login'}
              </button>
            </div>

            <p className="text-center text-sm opacity-70">
              Don&apos;t have an account?{' '}
              <Link to="/auth/register" className="link link-primary">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
