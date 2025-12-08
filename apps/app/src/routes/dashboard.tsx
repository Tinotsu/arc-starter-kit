import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { query } from '@/lib/tuyau'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type AuthController from '../../../api/app/identity/controllers/auth_controller'

type X = AuthController['getMe']
export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user, isLoading, error } = useQuery(query.auth.getMe.queryOptions())

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (error || !user) {
    return <Navigate to="/auth/login" />
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>Here's your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-lg font-medium">{(user as any).fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">{(user as any).email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
