import { createContextualCan } from '@casl/react'

import type { AppAbility } from './ability'
import { AbilityContext } from './AbilityContext'

const Can = createContextualCan<AppAbility>(AbilityContext.Consumer)

export default Can
