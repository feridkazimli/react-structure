import React from 'react'

import { HOME_ROUTE } from '@shared/constants'
import type { RouteObjectType } from '@shared/types'

const HomePage = React.lazy(() => import('@pages/home/HomePage'))

const routes: RouteObjectType[] = [
	{
		path: HOME_ROUTE,
		element: <HomePage />,
		private: true,
	},
	{
		path: '/auth',
		element: <div>Auth Page</div>,
		onlyPublic: true,
	},
	{
		path: '/test-1',
		element: <div>Test Private Page</div>,
		private: true,
	},
	{
		path: '/test-2',
		element: <div>Test Permissions Page</div>,
		permissions: ['isAdmin'],
		private: true,
	},
]

export default routes
