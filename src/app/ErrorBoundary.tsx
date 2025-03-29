import { captureException, withScope } from '@sentry/react'
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
	}

	render() {
		return <>{this?.props?.children}</>
	}
}
