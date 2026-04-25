import { CalendarDays, Radio } from 'lucide-react'
import { EventStateBadge } from '@/views/event-list/components/EventStateBadge'
import { formatEventDate } from '@/utils/formatters'
import type { Event } from '@/data/types/event.types'

type Props = { event: Event }

export const EventHeader = ({ event }: Props) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      <h1 className="text-3xl font-medium text-foreground">{event.title}</h1>
      {event.description && (
        <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
      )}
      {event.scheduledAt && event.state !== 'live' && (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          {formatEventDate(event.scheduledAt)}
        </div>
      )}
      {event.state === 'live' && (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600 font-medium">
          <Radio className="h-4 w-4 animate-pulse" />
          Broadcasting live
        </div>
      )}
    </div>
    <EventStateBadge state={event.state} />
  </div>
)
