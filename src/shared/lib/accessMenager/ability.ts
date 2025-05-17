import {
	// AbilityBuilder,
	type CreateAbility,
	createMongoAbility,
	type ForcedSubject,
	type MongoAbility,
	type RawRuleOf,
} from '@casl/ability'

export type Permission = RawRuleOf<AppAbility>

export type Permissions = {
	global: Permission[]
	modules: Record<string, Record<string, Permission[]>>
}

export interface User {
	id: number
	email: string
	password: string
	customerNo: number
	role: Roles
	permissions: Permissions
}

export const actions = [
	'all',
	'create',
	'read',
	'update',
	'delete',
	'approve',
	'sign',
	'invite',
] as const
export const subjects = ['User', 'Customer', 'Document', 'Contract', 'all'] as const

export type AppAbilities = [
	(typeof actions)[number],
	(typeof subjects)[number] | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>,
]

// type DefinePermissions = (user: User, builder: AbilityBuilder<AppAbility>) => void
type Roles = 'member' | 'admin' | 'editor' | 'guest' | 'signer' | 'approver'

// const rolePermissions: Record<Roles, DefinePermissions> = {
// 	guest(_, { cannot }) {
// 		cannot(['manage', 'invite', 'update'], 'all').because(
// 			'You are not allowed to manage anything. Please login or register.',
// 		)
// 	},
// 	editor(user, { can }) {
// 		can('invite', 'User')
// 		can('update', 'User', { id: user.id })
// 	},
// 	member(user, { can }) {
// 		can('invite', 'User')
// 		can('update', 'User', { role: 'admin' })
// 	},
// 	admin(_, { can }) {
// 		can('manage', 'all')
// 	},
// }

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

// export function defineAbilityFor(user: User): AppAbility {
// 	const builder = new AbilityBuilder<AppAbility>(createAppAbility)

// 	if (typeof rolePermissions[user.role] === 'function') {
// 		rolePermissions[user.role](user, builder)
// 	} else {
// 		throw new Error(`Trying to use unknown role "${user.role}"`)
// 	}

// 	return builder.build()
// }
