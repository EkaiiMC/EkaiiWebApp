export function addDashes(uuid: string) {
  return uuid.slice(0, 8) + '-' + uuid.slice(8, 12) + '-' + uuid.slice(12, 16) + '-' + uuid.slice(16, 20) + '-' + uuid.slice(20);
}

export function hasDashboardAccess(role: string) {
  return role === 'WHITELISTER' || role === 'DESIGNER' || role === 'DEVELOPER' || role === 'MAINTAINER';
}