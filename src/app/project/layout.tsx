'use client';

// auth
import { AuthGuard } from 'src/auth/guard';
// components
import ProjectManagementLayout from 'src/layouts/project-management';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
        <ProjectManagementLayout>{children}</ProjectManagementLayout>
    </AuthGuard>
  );
}
