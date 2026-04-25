import { z } from 'zod'
import {
  RequirementSchema,
  RequirementKeySchema,
  RequirementOwnerSchema,
  ReadinessReportSchema,
  RequirementKey,
  RequirementOwner,
} from '@/data/schemas/readiness.schema'

export { RequirementKey, RequirementOwner }
export type RequirementKey = z.infer<typeof RequirementKeySchema>
export type RequirementOwner = z.infer<typeof RequirementOwnerSchema>
export type Requirement = z.infer<typeof RequirementSchema>
export type ReadinessReport = z.infer<typeof ReadinessReportSchema>
