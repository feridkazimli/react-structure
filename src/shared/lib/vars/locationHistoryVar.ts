/**
 * This file defines every types and utils related to the locationHistoryVar (reactive variable)
 * React-router doesn't explicitly give access to the history, not allowing to have fallbacks in case of no previous routes.
 * This var exists to address this problem by allowing to have access to the previous routes.
 */
import type { Location } from 'react-router'

const MAX_HISTORY_KEPT = 10

let _locationHistory: Location[] = []

export const getLocationHistory = (): Location[] => _locationHistory

export const addLocationToHistory = (location: Location) => {
	const current = _locationHistory
	const currentPathname = current[0]?.pathname
	const currentSearchParams = current[0]?.search

	if (location.pathname !== currentPathname || location.search !== currentSearchParams) {
		_locationHistory = [location, ...current].slice(0, MAX_HISTORY_KEPT)
	}
}

export const setLocationHistory = (location: Location[]) => {
	_locationHistory = location.slice(0, MAX_HISTORY_KEPT)
}

export const resetLocationHistory = () => {
	_locationHistory = []
}
