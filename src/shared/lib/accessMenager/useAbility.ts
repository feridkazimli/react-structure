import { useContext } from 'react'

import { AbilityContext } from './AbilityContext'

export function useAbility() {
	const ability = useContext(AbilityContext)

	if (ability === undefined) {
		throw new Error('useAbility must be used within an AbilityProvider')
	}

	return ability
}
