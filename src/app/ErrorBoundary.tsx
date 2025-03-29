import { captureException, withScope } from '@sentry/react'
import { enqueueSnackbar } from 'notistack'
import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
	children?: ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps> {
	componentDidCatch(error: { message: string; name: string }, errorInfo: ErrorInfo) {
		withScope((scope) => {
			if (errorInfo.componentStack) {
				scope.setExtra('componentStack', errorInfo.componentStack)
			}
			if (errorInfo.digest) {
				scope.setExtra('digest', errorInfo.digest)
			}
			captureException(error)
		})

		enqueueSnackbar({
			variant: 'error',
			message: 'errrrrrrrrrrrrrrrrr',
		})
	}

	render() {
		return <>{this?.props?.children}</>
	}
}
