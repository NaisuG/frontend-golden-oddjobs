export const ROLE = {
  REQUESTER: 'SOLICITANTE',
  DEVELOPER: 'DESARROLLADOR',
  ADMIN: 'ADMIN'
};

// Roles come from the "cognito:groups" claim (the groups of the Cognito User Pool)
export function getRoles(user) {
  const groups = user?.profile?.['cognito:groups'];
  if (!groups) return [];
  return Array.isArray(groups) ? groups : [groups];
}
