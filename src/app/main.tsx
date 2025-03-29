/* eslint-disable prettier/prettier */
import { scan } from 'react-scan'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import * as Sentry from '@sentry/react'
import { SnackbarProvider } from 'notistack'
import 'dayjs/locale/az'

import { ErrorBoundary } from '~/app/ErrorBoundary'
import { buildProviderTree } from '~/shared/libs/core'

const client = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 3,
			refetchOnWindowFocus: false,
		},
	},
})

const ProviderTree = buildProviderTree([
	[QueryClientProvider, { client }],
	[SnackbarProvider, { autoHideDuration: 500, maxSnack: 3 }],
	[ErrorBoundary, {}],
])

scan({
	enabled: true,
})

const rootElement = document.getElementById('root')
if (rootElement) {
	createRoot(rootElement, {
		// Callback called when an error is thrown and not caught by an ErrorBoundary.
		onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
			// eslint-disable-next-line no-console
			console.warn('Uncaught error', error, errorInfo.componentStack)
		}),
		// Callback called when React catches an error in an ErrorBoundary.
		onCaughtError: Sentry.reactErrorHandler(),
		// Callback called when React automatically recovers from errors.
		onRecoverableError: Sentry.reactErrorHandler(),
	}).render(
		<React.StrictMode>
			<ProviderTree>
				<>test</>
				<ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
			</ProviderTree>
		</React.StrictMode>,
	)
}
