import { createFileRoute } from '@tanstack/react-router'
import { EventListView } from '@/views/event-list/EventListView'

export const Route = createFileRoute('/events/')({
  component: EventListView,
})
