import { useMutation } from '@tanstack/react-query'

import { query } from '@/lib/tuyau'
import { queryClient } from '@/lib/query_client'
import { getMeQueryOptions } from '@/hooks/auth'

export function useCheckout() {
  return useMutation(
    query.billing.checkout.mutationOptions({
      onSuccess: data => {
        if (data.url) {
          window.location.href = data.url
        }
      },
    }),
  )
}

export function useBillingPortal() {
  return useMutation(
    query.billing.portal.mutationOptions({
      onSuccess: data => {
        if (data.url) {
          window.location.href = data.url
        }
      },
    }),
  )
}

export function invalidateUser() {
  return queryClient.invalidateQueries({ queryKey: getMeQueryOptions().queryKey })
}
