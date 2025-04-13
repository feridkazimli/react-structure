import { HOME_ROUTE } from '@shared/constants'
import type { RouteObjectType } from '@shared/types/route-types'

const routes: RouteObjectType[] = [
	{
		path: HOME_ROUTE,
		element: <div>Home</div>,
		onlyPublic: true,
	},
]

export default routes
