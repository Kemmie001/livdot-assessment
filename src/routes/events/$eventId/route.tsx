import { createFileRoute, redirect } from '@tanstack/react-router'
import { queryClient } from '@/lib/queryClient'
import { queryKeys } from '@/lib/queryKeys'
import { eventService } from '@/data/services/eventService'
import { readinessService } from '@/data/services/readinessService'

export const Route = createFileRoute('/events/$eventId')({
  loader: async ({ params: { eventId } }) => {
    try {
      await Promise.all([
        queryClient.ensureQueryData({
          queryKey: queryKeys.events.detail(eventId),
          queryFn: () => eventService.get(eventId),
        }),
        queryClient.ensureQueryData({
          queryKey: queryKeys.readiness.detail(eventId),
          queryFn: () => readinessService.get(eventId),
        }),
      ])
    } catch {
      throw redirect({ to: '/events' })
    }
  },
})
