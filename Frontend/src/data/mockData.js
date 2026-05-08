export const mockUser = {
  id: 'USR-001',
  name: 'Ayesha Khan',
  email: 'ayesha.khan@company.com',
  role: 'Admin',
  team: 'Product Operations',
}

export const mockStats = {
  completed: 18,
  inProgress: 7,
  pending: 5,
}

export const mockTasks = [
  {
    id: 'TSK-214',
    title: 'Finalize onboarding flow',
    description:
      'Align fields and copy with the updated requirements from Product.',
    status: 'In progress',
    dueDate: '2026-05-02',
    priority: 'High',
    category: 'UX',
    assignee: 'Ayesha Khan',
  },
  {
    id: 'TSK-215',
    title: 'QA checklist for release',
    description: 'Prepare and share regression checklist before the release.',
    status: 'Pending',
    dueDate: '2026-05-04',
    priority: 'Medium',
    category: 'QA',
    assignee: 'Sameer Ali',
  },
  {
    id: 'TSK-216',
    title: 'Update role permissions',
    description: 'Review role scopes and update access to reporting modules.',
    status: 'Completed',
    dueDate: '2026-04-28',
    priority: 'Low',
    category: 'Security',
    assignee: 'Hina Raza',
  },
]
