import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { useEventStateMachine } from '../useEventStateMachine'
import { queryKeys } from '@/lib/queryKeys'
import { createMockEvent, createMockReadiness, createFullReadiness } from '@/test/mocks/factories'

vi.mock('@/data/queries/useTransitionEvent', () => ({
  useTransitionEvent: () => ({ mutate: vi.fn(), isPending: false }),
}))

const EVENT_ID = '00000000-0000-0000-0000-000000000001'

const makeWrapper = (qc: QueryClient) =>
  ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children)

const makeQc = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useEventStateMachine', () => {
  it('returns blocked action when requirements are missing', async () => {
    const qc = makeQc()
    qc.setQueryData(queryKeys.events.detail(EVENT_ID), createMockEvent({ state: 'scheduled' }))
    qc.setQueryData(queryKeys.readiness.detail(EVENT_ID), createMockReadiness())

    const { result } = renderHook(() => useEventStateMachine(EVENT_ID), {
      wrapper: makeWrapper(qc),
    })

    await waitFor(() => expect(result.current.primaryAction).not.toBeNull())
    expect(result.current.primaryAction?.blocked).toBe(true)
  })

  it('returns unblocked action when all requirements satisfied', async () => {
    const qc = makeQc()
    qc.setQueryData(queryKeys.events.detail(EVENT_ID), createMockEvent({ state: 'scheduled' }))
    qc.setQueryData(queryKeys.readiness.detail(EVENT_ID), createFullReadiness())

    const { result } = renderHook(() => useEventStateMachine(EVENT_ID), {
      wrapper: makeWrapper(qc),
    })

    await waitFor(() => expect(result.current.primaryAction).not.toBeNull())
    expect(result.current.primaryAction?.blocked).toBe(false)
  })

  it('displayState reflects optimistic pending state', async () => {
    const qc = makeQc()
    qc.setQueryData(queryKeys.events.detail(EVENT_ID), createMockEvent({ state: 'scheduled' }))
    qc.setQueryData(queryKeys.readiness.detail(EVENT_ID), createFullReadiness())

    const { useOptimisticStore } = await import('@/store/optimisticStore')
    useOptimisticStore.getState().setPending(EVENT_ID, 'ready_for_streaming')

    const { result } = renderHook(() => useEventStateMachine(EVENT_ID), {
      wrapper: makeWrapper(qc),
    })

    await waitFor(() => expect(result.current.displayState).toBe('ready_for_streaming'))
    useOptimisticStore.getState().clearPending(EVENT_ID)
  })

  it('isPending is false when no transition in flight', async () => {
    const qc = makeQc()
    qc.setQueryData(queryKeys.events.detail(EVENT_ID), createMockEvent({ state: 'draft' }))
    qc.setQueryData(queryKeys.readiness.detail(EVENT_ID), createMockReadiness())

    const { result } = renderHook(() => useEventStateMachine(EVENT_ID), {
      wrapper: makeWrapper(qc),
    })

    await waitFor(() => expect(result.current.event).toBeDefined())
    expect(result.current.isPending).toBe(false)
  })
})
