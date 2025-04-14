import type { RouteObject } from 'react-router'

export type PermissionsType = {
	addonsCreate: boolean
	addonsDelete: boolean
	addonsUpdate: boolean
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
