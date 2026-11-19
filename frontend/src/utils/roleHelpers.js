export const getRoleFromUser = (user) => user?.groups?.[0] ?? 'Unknown'
export const hasRole = (user, roleName) => user?.groups?.includes(roleName) ?? false
export const canCreate = (user) => hasRole(user, 'Administrator') || hasRole(user, 'Contracts Manager')
export const canDelete = (user) => hasRole(user, 'Administrator')
export const canApprove = (user) => hasRole(user, 'Administrator') || hasRole(user, 'Contracts Manager')
