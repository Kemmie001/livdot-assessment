import { createFileRoute } from '@tanstack/react-router'
import { EventDashboardView } from '@/views/event-dashboard/EventDashboardView'

export const Route = createFileRoute('/events/$eventId/')({
  component: EventDashboardView,
})
