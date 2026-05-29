import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'

import { query } from '@/lib/tuyau'
import { queryClient } from '@/lib/query_client'
import { redirectToDashboardIfAuthenticated } from '@/hooks/auth'

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
  beforeLoad: () => redirectToDashboardIfAuthenticated(),
})

function RouteComponent() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const register = useMutation(
    query.auth.register.mutationOptions({
      onSuccess: async () => {
        await queryClient.resetQueries()
        await navigate({ to: '/dashboard' })
      },
      onError: (error: any) => {
        if (error.response?.data?.errors) setErrors(error.response.data.errors)
      },
    }),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    register.mutate({
      body: {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        // @ts-ignore not explicitly defined in validator but accepted
        passwordConfirmation: formData.confirmPassword,
      },
    })
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
          <h2 className="card-title">Create an account</h2>
          <p className="text-base-content/70">
            Enter your information below to create your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Full Name</span>
              </div>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full"
                value={formData.fullName}
                onChange={handleChange('fullName')}
                required
              />
            </label>

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
              <div className="label">
                <span className="label-text-alt opacity-70">
                  We&apos;ll use this to contact you. We will not share your email with anyone else.
                </span>
              </div>
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                id="password"
                type="password"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={handleChange('password')}
                required
              />
              <div className="label">
                <span className="label-text-alt opacity-70">
                  Must be at least 8 characters long.
                </span>
              </div>
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Confirm Password</span>
              </div>
              <input
                id="confirm-password"
                type="password"
                className="input input-bordered w-full"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                required
              />
              <div className="label">
                <span className="label-text-alt opacity-70">Please confirm your password.</span>
              </div>
            </label>

            <div className="form-control mt-2 space-y-2">
              <button type="submit" className="btn btn-primary" disabled={register.isPending}>
                {register.isPending ? 'Creating Account...' : 'Create Account'}
              </button>
              <button type="button" className="btn btn-outline">
                Sign up with Google
              </button>
            </div>

            <p className="text-center text-sm opacity-70">
              Already have an account?{' '}
              <Link to="/auth/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
