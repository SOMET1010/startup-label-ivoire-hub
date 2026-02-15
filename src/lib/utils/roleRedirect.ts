type UserRole = 'admin' | 'startup' | 'evaluator' | 'structure' | 'investor' | 'public';

const DASHBOARD_PATHS: Record<string, string> = {
  admin: '/admin',
  evaluator: '/admin',
  startup: '/startup',
  structure: '/structure',
  investor: '/investor',
};

export function getDashboardPath(role: UserRole | null): string {
  if (!role) return '/';
  return DASHBOARD_PATHS[role] || '/';
}
