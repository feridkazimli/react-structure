import type { RouteObject } from 'react-router'

export type PermissionsType = {
	isSuperAdmin: boolean
	isAdmin: boolean
	isDirector: boolean
	isEmployee: boolean
	isAsanSigner: boolean
	isSigner: boolean
}

export interface RouteObjectType extends Omit<RouteObject, 'children' | 'path'> {
	path?: string | string[]
	private?: boolean
	onlyPublic?: boolean
	invitation?: boolean
	redirect?: string
	children?: RouteObjectType[]
	permissions?: Array<keyof PermissionsType>
}
