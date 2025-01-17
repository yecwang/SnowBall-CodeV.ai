import { useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react'
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace(paths.auth.jwt.login);
    }
  })
  
  const check = useCallback(() => {
    if (session) {
      router.replace(paths.project.root);
    }
  }, [session, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
