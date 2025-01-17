import { useParams, usePathname, useSearchParams } from 'next/navigation';

// ----------------------------------------------------------------------

type ReturnType = boolean;

export function useActiveLink(path: string, deep = true): ReturnType {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  
  const fullPath = `${pathname}${queryString ? `?${queryString}` : ''}`;
  const checkPath = fullPath.startsWith('/project');

  const normalActive = checkPath && fullPath === path;

  const deepActive = checkPath && fullPath.includes(path);
  
  return deep ? deepActive : normalActive;
}
