import { wrapUseRoutesV7 } from '@sentry/react'
import React, { type ReactNode } from 'react'
import { type RouteObject, useRoutes } from 'react-router'

import type { RouteObjectType } from '@shared/types/route-types'
import routes from '@app/routes'

interface PageWrapperProps {
	routeConfig: RouteObjectType
	children: ReactNode
}

function PageWrapper({ routeConfig, children }: PageWrapperProps) {

	return <>{children}</>
}

const routesFormatter: (routesToFormat: RouteObjectType[], loggedIn: boolean) => RouteObject[] = (
	routesToFormat,
	loggedIn,
) => {
	return routesToFormat.reduce<RouteObject[]>((acc, route) => {
		const routeConfig = {
			element: (
				<PageWrapper routeConfig={route}>
					<React.Suspense fallback={<>Loading...</>}>{route.element}</React.Suspense>
				</PageWrapper>
			),
			...(route?.children ? { children: routesFormatter(route.children, loggedIn) } : {}),
		}

		if (route.index) {
			acc.push({
				index: true,
				...routeConfig,
			} as RouteObject)
		} else if (!route.path) {
			acc.push(routeConfig)
		} else if (typeof route.path === 'string') {
			acc.push({
				path: route.path,
				...routeConfig,
			})
		} else {
			route.path.map((singlePath) => {
				acc.push({
					path: singlePath,
					...routeConfig,
				})
			})
		}

		return acc
	}, [])
}

export default function Router() {
	const formatedRoutes = routesFormatter(routes, true)
	const useSentyRoutes = wrapUseRoutesV7(useRoutes)

	return useSentyRoutes(formatedRoutes)
}
