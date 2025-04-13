/* eslint-disable prettier/prettier */
import { scan } from 'react-scan'
import React from 'react'
import { SnackbarProvider } from 'notistack'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Sentry from '@sentry/react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import 'dayjs/locale/az'
import { buildProviderTree } from '@shared/lib'

import { ErrorBoundary } from '~/app/ErrorBoundary'
import Router from '@app/Router'
import {
	BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router";

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
	[BrowserRouter, { basename: import.meta.env.BASE_URL }],
])

scan({
	enabled: true,
})

Sentry.init({
  dsn: "http://b4b265ad85d04b14b47d4810f93511fb@localhost/1",
  integrations: [
    Sentry.reactRouterV7BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  tracesSampleRate: 1.0,
});

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
				<Router />
				<ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
			</ProviderTree>
		</React.StrictMode>,
	)
}
