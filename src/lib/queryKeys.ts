export const queryKeys = {
  events: {
    all: () => ['events'] as const,
    detail: (id: string) => ['events', id] as const,
  },
  readiness: {
    detail: (eventId: string) => ['readiness', eventId] as const,
  },
  operational: {
    detail: (eventId: string) => ['operational', eventId] as const,
  },
}
