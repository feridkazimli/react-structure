import React from 'react'

// import { useAbility } from '@app/accessMenager/AbilityContext'

export default function HomePage() {
	// const ability = useAbility()

	return (
		<div>
			<p>Hello, HomePage!</p>
			{/* {ability?.can('update', 'User') && <p>You can update 1 User</p>}
			{ability?.can('invite', 'User') && <p>You can invite User</p>}
			{ability?.can('manage', 'User') && <p>You can manage User</p>} */}
		</div>
	)
}
