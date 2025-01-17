import { useEffect, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react'
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// ----------------------------------------------------------------------

const loginPaths: Record<string, string> = {
  jwt: paths.auth.jwt.login,
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      const searchParams = new URLSearchParams({ returnTo: window.location.pathname }).toString();
      const loginPath = loginPaths.jwt;
      const href = `${loginPath}?${searchParams}`;
      router.replace(href);
    }
  })
  if (!session) {
    return null;
  }

  return <>{children}</>;
}
