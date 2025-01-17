
// @mui
import Box from '@mui/material/Box';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSettingsContext } from 'src/components/settings';
//
import Main from './main';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';
import HeaderToolbar from './header-toolbar';

type Props = {
  children: React.ReactNode;
};

export default function ProjectLayout({ children }: Props) {
  const settings = useSettingsContext();
  const lgUp = useResponsive('up', 'lg');  

  const isHorizontal = settings.themeLayout === 'horizontal';
  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;
  const renderHorizontal = <NavHorizontal />;
  const renderNavVertical = <NavVertical />;

  if (isHorizontal) {
    return (
      <>
        {lgUp ? renderHorizontal : renderNavVertical}
        
        <HeaderToolbar />
        
        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
          }}
        >
          <Main>{children}</Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <HeaderToolbar />
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        { isMini && lgUp ? renderNavMini : renderNavVertical }
        <Main>{children}</Main>
      </Box>
    </>
  );
}
