import type { Location } from 'react-router'
import { matchPath, useNavigate } from 'react-router'

import { usePermissions } from './usePermissions'

import { FORBIDDEN_ROUTE, HOME_ROUTE, LOGIN_ROUTE } from '../../constants'
import type { RouteObjectType } from '../../types'
import { getItemFromLS, removeItemFromLS, setItemFromLS } from '../ls-libs'
import { addLocationToHistory, getLocationHistory, setLocationHistory } from '../vars'

export const LAST_PRIVATE_VISITED_ROUTE_WHILE_NOT_CONNECTED_LS_KEY = 'lastPrivateVisitedRoute'

type GoBack = (
	fallback: string,
	options?: {
		// Previous count represents how many location from now you want to go back to
		previousCount?: number
		exclude?: string | string[]
	},
) => void

type UseLocationHistory = {
	goBack: GoBack
	onRouteEnter: (routeConfig: RouteObjectType, location: Location) => void
}

type UseLocationHistoryReturn = UseLocationHistory

const getPreviousLocation = ({
	previousCount = -1,
	exclude,
}: {
	previousCount?: number
	exclude?: string | string[]
}) => {
	const previousLocations = getLocationHistory()
	const index = exclude
		? previousLocations.findIndex((location, i) => {
				if (i < Math.abs(previousCount)) {
					return false
				}

				// If exclude, find index of the first location that doesn't match
				const isExluded =
					typeof exclude === 'string'
						? matchPath(exclude, location.pathname)
						: exclude.some((pathToExclude) => matchPath(pathToExclude, location.pathname))

				return !isExluded
			})
		: Math.abs(previousCount)

	return {
		previous: previousLocations[index],
		remaingHistory: index > -1 ? previousLocations.slice(index + 1) : [],
	}
}

export function useLocationHistory(): UseLocationHistoryReturn {
	const navigate = useNavigate()
	const { hasPermissions } = usePermissions()

	const goBack: GoBack = (fallback, options) => {
		const { previous, remaingHistory } = getPreviousLocation(options || {})

		void navigate(previous || fallback)

		setLocationHistory(remaingHistory || [])
	}

	return {
		goBack,
		onRouteEnter: (routeConfig, location) => {
			// const isAuthenticated = !!authTokenVar()
			const isAuthenticated = true

			if (routeConfig.onlyPublic && isAuthenticated) {
				/**
				 * In case of navigation to a only public route while authenticated
				 * Go back to previously visited page in app or fallback to the home
				 */
				goBack(HOME_ROUTE, { previousCount: 0 })
			} else if (routeConfig.private && !isAuthenticated) {
				/**
				 * In case of navigation to a private route while NOT authenticated
				 * Redirect to login and add the route the user tried to visit in the history
				 */
				void navigate({
					pathname: LOGIN_ROUTE,
					search: location.search,
				})

				addLocationToHistory(location)

				// If user is kickd out or logs out, we save the last private route visited to redirect after login
				setItemFromLS(LAST_PRIVATE_VISITED_ROUTE_WHILE_NOT_CONNECTED_LS_KEY, location)
			} else if (
				isAuthenticated &&
				routeConfig.permissions?.length &&
				// !isCurrentUserLoading &&
				!hasPermissions(routeConfig.permissions)
			) {
				/**
				 * In case of navigation to a private route while authenticated but without permission
				 * Redirect to forbidden page
				 */
				void navigate(FORBIDDEN_ROUTE)
			} else if (!routeConfig?.children && !routeConfig.onlyPublic) {
				// In the invitation for page, once users are logged in, we redirect them to the home page
				if (routeConfig.invitation && isAuthenticated) {
					// We have a special case for the invitation route, we don't want to be redirected to any potential last visited page.
					// If user follows an invitation, we remove this info from the local storage before the redirection happens.
					const lastPrivateVisitedRouteWhileNotConnected: Location | undefined = getItemFromLS(
						LAST_PRIVATE_VISITED_ROUTE_WHILE_NOT_CONNECTED_LS_KEY,
					)

					if (lastPrivateVisitedRouteWhileNotConnected) {
						removeItemFromLS(LAST_PRIVATE_VISITED_ROUTE_WHILE_NOT_CONNECTED_LS_KEY)
					}

					// We can then safely redirect to the home page.
					void navigate(HOME_ROUTE)
				}
				/**
				 * We add the current location to the history only if :
				 * - Current route has no children (to avoid adding Layout route which will result in duplicates)
				 * - Current route is not an only public route
				 */
				addLocationToHistory(location)
			}
		},
	}
}
