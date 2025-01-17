'use client'

// @mui
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// routes
import { paths } from 'src/routes/paths';
import { useParams, useSearchParams } from 'src/routes/hook';
//
import FunctionsEdit from '../functions-edit';

export default function FunctionsView() {
  const params = useParams();
  const settings = useSettingsContext();
  const urlSearchParams = useSearchParams();
  const projectID = Number(urlSearchParams.get('projectID'));

  return <Container maxWidth={settings.themeStretch ? false : 'lg'}>
    <CustomBreadcrumbs
      heading="Edit"
      links={[
        {
          name: 'Dashboard',
          href: paths.dashboard.root,
        },
        {
          name: 'Functions',
          href: paths.dashboard.project.functions(projectID).list,
        },
        { name: params.name as string },
      ]}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />

    <FunctionsEdit />
  </Container>
}
