'use client';

// components
import ProjectDesignLayout from 'src/layouts/project-design';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <ProjectDesignLayout>{children}</ProjectDesignLayout>
  );
}
