import type { PermissionsType } from '@shared/types'

type TUsePermissionsProps = () => {
	hasPermissions: (permissionsToCheck: Array<keyof PermissionsType>) => boolean
}

export const usePermissions: TUsePermissionsProps = () => {
	// const { currentMembership } = useCurrentUser()
	const currentMembership: { permissions: PermissionsType } = {
		permissions: {
			isSuperAdmin: true,
			isAdmin: false,
			isDirector: false,
			isSigner: false,
			isAsanSigner: true,
			isEmployee: false,
		},
	}

	const hasPermissions = (permissionsToCheck: Array<keyof PermissionsType>): boolean => {
		if (!currentMembership) return false

		const allPermissions = currentMembership.permissions

		const permissionsFound =
			permissionsToCheck.map((permission) => allPermissions[permission]) || []

		return permissionsFound.every((permission) => !!permission && permission === true)
	}

	return {
		hasPermissions,
	}
}
