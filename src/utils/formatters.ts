import { format, formatDistanceToNow, differenceInSeconds, intervalToDuration } from 'date-fns'
import type { RequirementOwner } from '@/data/types/readiness.types'

export const formatEventDate = (iso: string): string =>
  format(new Date(iso), 'MMM d, yyyy · h:mm a')

export const formatRelativeDate = (iso: string): string =>
  formatDistanceToNow(new Date(iso), { addSuffix: true })

export const formatLiveDuration = (startedAtIso: string): string => {
  const seconds = differenceInSeconds(new Date(), new Date(startedAtIso))
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
  const h = String(duration.hours ?? 0).padStart(2, '0')
  const m = String(duration.minutes ?? 0).padStart(2, '0')
  const s = String(duration.seconds ?? 0).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export const formatOwner = (owner: RequirementOwner): string =>
  owner === 'host' ? 'You' : 'Production Crew'
