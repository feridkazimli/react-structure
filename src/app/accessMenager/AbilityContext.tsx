import { subject } from '@casl/ability'
import React, { useContext, useMemo } from 'react'

import { type AppAbilities, type AppAbility, createAppAbility, type User } from './ability'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const AbilityContext = React.createContext<AppAbility>(undefined!)

interface AbilityProviderProps {
	user: User
	children?: React.ReactNode
}

export function AbilityProvider({ user, children }: AbilityProviderProps) {
	const ability = useMemo(() => createAppAbility(user.permissions), [user])

	const defineAbility = {
		can: (action: AppAbilities[0], _subject: AppAbilities[1]) => {
			return ability.can(action, subject(_subject, user))
		},
		cannot: (action: AppAbilities[0], _subject: AppAbilities[1]) => {
			return ability.cannot(action, subject(_subject, user))
		},
	}

	return <AbilityContext.Provider value={defineAbility}>{children}</AbilityContext.Provider>
}

export function useAbility() {
	const ability = useContext(AbilityContext)

	if (ability === undefined) {
		throw new Error('useAbility must be used within an AbilityProvider')
	}

	return ability
}
