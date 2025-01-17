'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { IUserItem } from 'src/types/user/user';
import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

export default function UserEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  // const currentUser = _userList.find((user) => user.id === id);
  const user: IUserItem = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    name: 'Jaydon Frankie',
    email: 'demo@minimals.cc',
    phoneNumber: '+40 777666555',
    country: 'United States',
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    role: 'admin',
    status: '',
    company: '',
    avatarUrl: '',
    isVerified: false
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User',
            href: paths.dashboard.user.root,
          },
          { name: user?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentUser={user} />
    </Container>
  );
}
