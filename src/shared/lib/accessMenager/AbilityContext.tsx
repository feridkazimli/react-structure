import { subject } from '@casl/ability'
import React, { useMemo } from 'react'

import { type AppAbilities, type AppAbility, createAppAbility, type User } from './ability'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const AbilityContext = React.createContext<AppAbility>(undefined!)

interface AbilityProviderProps {
	user: User
	children?: React.ReactNode
}

export function AbilityProvider({ user, children }: AbilityProviderProps) {
	const ability = useMemo(() => {
		const currentPage = 'User'
		const globalPermissions = user.permissions.global || []
		const modulePermissionsWithouteRole = user.permissions.modules[currentPage]?.['all'] || []
		const modulePermissions = user.permissions.modules[currentPage]?.[user.role] || []

		const mergedPermissions = [
			...globalPermissions,
			...modulePermissionsWithouteRole,
			...modulePermissions,
		]

		return createAppAbility(mergedPermissions)
	}, [user])

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
