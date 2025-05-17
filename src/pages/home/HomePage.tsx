import React from 'react'

import { useAbility } from '@shared/lib/accessMenager'

const checks: Array<[string, string, string]> = [
	['create', 'User', 'You {{able}} create User'],
	['read', 'User', 'You {{able}} read User'],
	['update', 'User', 'You {{able}} update User'],
	['delete', 'User', 'You {{able}} delete User'],
	['invite', 'User', 'You {{able}} invite User'],
	['approve', 'User', 'You {{able}} approve User'],
	['sign', 'User', 'You {{able}} sign User'],
]

export default function HomePage() {
	const ability = useAbility()

	return (
		<div>
			<p>Hello, HomePage!</p>
			{checks.map(([action, subject, message]) =>
				ability.can(action, subject) ? (
					<p key={`${action}-${subject}`}>{message.replace('{{able}}', 'can')}</p>
				) : null,
			)}
			{checks.map(([action, subject, message]) =>
				ability.cannot(action, subject) ? (
					<p key={`${action}-${subject}`}>{message.replace('{{able}}', 'cannot')}</p>
				) : null,
			)}
		</div>
	)
}
