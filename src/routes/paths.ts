// utils
// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  PROJECT: '/project',
};

// ----------------------------------------------------------------------
const projectDefaultPage = (projectID: number) => `${ROOTS.DASHBOARD}/project/setting?projectID=${projectID}`;

export const paths = {
  project: {
    root: '/project',
    design: (projectID: number) => ({
      setting: `${ROOTS.PROJECT}/${projectID}/setting`,
      database: `${ROOTS.PROJECT}/${projectID}/database`,
      pages: `${ROOTS.PROJECT}/${projectID}/pages`,
      pageItem: (pageID: string) => `${ROOTS.PROJECT}/${projectID}/pages?pageID=${pageID}`,
      functionEdit: (name: string)=> `${ROOTS.PROJECT}/${projectID}/functions/${name}?name=${name}`,
    }),
  },
  preview: (projectID: number) => `/preview/${projectID}`,
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    blank: `${ROOTS.DASHBOARD}/blank`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    project: {
      root: (projectID?: number) => projectID ? projectDefaultPage(projectID): `${ROOTS.DASHBOARD}/project`,
      setting: projectDefaultPage,
      functions: (projectID: number) => ({
        list: `${ROOTS.DASHBOARD}/project/functions?projectID=${projectID}`,
        edit: (name: string) => `${ROOTS.DASHBOARD}/project/functions/${name}?projectID=${projectID}`,
      }),
      variables: (projectID: number) => `${ROOTS.DASHBOARD}/project/variables?projectID=${projectID}`,
      metadata: (projectID: number) => `${ROOTS.DASHBOARD}/project/metadata?projectID=${projectID}`,
      texts: (projectID: number) => `${ROOTS.DASHBOARD}/project/texts?projectID=${projectID}`,
      pages: (projectID: number, pageID: string) => `${ROOTS.DASHBOARD}/project/pages?projectID=${projectID}&pageID=${pageID}`,
    },
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      app_builder: `${ROOTS.DASHBOARD}/app-builder`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${1}/edit`,
      },
    },
  },
};
