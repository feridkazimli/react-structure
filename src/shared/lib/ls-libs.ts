export const getItemFromLS = <T>(key: string): T | undefined => {
	const data = typeof window !== 'undefined' ? localStorage.getItem(key) : ''

	try {
		if (data === 'undefined') {
			return undefined
		}

		if (data) {
			try {
				return JSON.parse(data) as T
			} catch {}
		}

		return data as T
	} catch {}
}

export const setItemFromLS = (key: string, value: unknown) => {
	const stringify = typeof value !== 'string' ? JSON.stringify(value) : value

	return localStorage.setItem(key, stringify)
}

export const removeItemFromLS = (key: string) => {
	return localStorage.removeItem(key)
}
