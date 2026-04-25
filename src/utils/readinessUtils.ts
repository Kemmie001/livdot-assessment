import type { ReadinessReport, Requirement, RequirementOwner } from '@/data/types/readiness.types'

export const isReadyForStreaming = (report: ReadinessReport): boolean =>
  report.allSatisfied

export const getMissingRequirements = (report: ReadinessReport): Requirement[] =>
  report.requirements.filter((r) => !r.satisfied)

export const getSatisfiedRequirements = (report: ReadinessReport): Requirement[] =>
  report.requirements.filter((r) => r.satisfied)

export const getRequirementsByOwner = (
  report: ReadinessReport
): Record<RequirementOwner, Requirement[]> => ({
  host: report.requirements.filter((r) => r.owner === 'host'),
  crew: report.requirements.filter((r) => r.owner === 'crew'),
})

export const getCompletionCount = (
  report: ReadinessReport
): { satisfied: number; total: number } => ({
  satisfied: getSatisfiedRequirements(report).length,
  total: report.requirements.length,
})
