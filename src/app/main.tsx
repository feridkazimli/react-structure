/* eslint-disable prettier/prettier */
import { scan } from 'react-scan'
import React from 'react'
import { SnackbarProvider } from 'notistack'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Sentry from '@sentry/react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import 'dayjs/locale/az'
import {
	BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router";
import { buildProviderTree } from '@shared/lib'

import { ErrorBoundary } from '~/app/ErrorBoundary'
import Router from '@app/Router'
import { type User } from '@shared/lib/accessMenager'
import { AbilityProvider } from '@shared/lib/accessMenager'

import permissions from './permissions.json'

const client = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 3,
			refetchOnWindowFocus: false,
		},
	},
})

// const permissions = [
// 	{
// 		action: 'invite',
// 		subject: 'User',
// 	},
// 	{
// 		action: 'update',
// 		subject: 'User',
// 		conditions: {
// 			role: 'admin',
// 		},
// 	},
// 	{
// 		action: 'sign',
// 		subject: 'User',
// 		conditions: {
// 			customerNo: {
// 				$in: [1000111, 1001],
// 			},
// 		},
// 	},
// ]

const user: User = { id: 1, customerNo: 1000111, role: 'admin', email: 'ffff@2df', password: '123456', permissions }

// const ability = defineAbilityFor(user)
// const ability = createAppAbility(user.permissions)
// console.log("🚀 ~ ability ~ ability:", ability)

const ProviderTree = buildProviderTree([
	[QueryClientProvider, { client }],
	[SnackbarProvider, { autoHideDuration: 500, maxSnack: 3 }],
	[ErrorBoundary, {}],
	[AbilityProvider, { user }],
	[BrowserRouter, { basename: import.meta.env.BASE_URL }],
])

scan({
	enabled: true,
})

Sentry.init({
  dsn: "http://b4b265ad85d04b14b47d4810f93511fb@localhost:9000/1",
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
