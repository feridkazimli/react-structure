import type { RouteObject } from 'react-router'

export interface RouteObjectType extends Omit<RouteObject, 'children' | 'path'> {
	path?: string | string[]
	private?: boolean
	onlyPublic?: boolean
	invitation?: boolean
	redirect?: string
	children?: RouteObjectType[]
	// permissions?: Array<keyof TMembershipPermissions>
}
