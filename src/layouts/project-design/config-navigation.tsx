import { useCallback, useEffect, useMemo, useState } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// hooks
import { useParams } from 'src/routes/hook';
import useServerAction from 'src/hooks/use-server-action';
// components
import SvgColor from 'src/components/svg-color';
import Iconify from 'src/components/iconify';
import ArticleIcon from '@mui/icons-material/Article';
import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
// redux
import { useSelector, useDispatch } from 'src/redux/store';
import { setProject } from 'src/redux/slices/project';
// server action
import * as projectActions from 'src/services/server-actions/project/client';
import { PageConfigType, TProjectPages } from 'src/pluginapp-context-manager/types';
import { NavListProps } from 'src/components/nav-section/types';
//
import { NavPopupMenuDivider } from 'src/components/nav-menu';
import Typography from '@mui/material/Typography';
import DialogOperation from 'src/constants/dialog-operation';
import { updateNavDialog } from 'src/redux/slices/nav-dialog';
import usePages from './hooks/use-pages';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  application: <AppSettingsAltIcon />,
  folder: <FolderOpenIcon sx={{ fontSize: '20px' }} />,
  page: <ArticleIcon sx={{ fontSize: '20px' }} />,
  popupMenu: {
    title: <Iconify width={16} icon='carbon:overflow-menu-vertical' />,
    add: <Iconify icon='carbon:add-filled' sx={{ mr: 1.5 }} />,
    newGroup: <Iconify icon='ph:folder-bold' sx={{ mr: 1.5 }} />,
    newPage: <NoteAddIcon sx={{ mr: 1.5 }} />,
    copy: <Iconify icon='iconamoon:copy-fill' sx={{ mr: 1.5 }} />,
    move: <Iconify icon='pepicons-pop:move-y' sx={{ mr: 1.5 }} />,
    delete: <DeleteIcon sx={{ mr: 1.5, color: theme => `${theme.palette.error.main} !important` }} />,
    rename: <DriveFileRenameOutlineIcon sx={{ mr: 1.5 }} />,
  }
};

// ----------------------------------------------------------------------

export function useNavData() {
  const _renderDeleteBtn = () => <Typography variant='inherit' sx={{ fontSize: 'unset', color: theme => `${theme.palette.error.main} !important` }}>
    {t('project.pages.menu.delete')}
  </Typography>;

  const { t } = useLocales();
  const dispatch = useDispatch()
  const params = useParams();
  const projectID = Number(params.projectID);
  const project = useSelector(store => store.project[projectID]);
  const { run: loadProject } = useServerAction(projectActions.loadProject);

  const { pageEditStatus, setPageEditStatus, addPage, deletePage, updatePageName } = usePages();

  const _loadProject = useCallback(async () => {
    if (!projectID) {
      return
    }
    const projectInfo = await loadProject(String(projectID))
    if (projectInfo.data) {
      dispatch(setProject(projectInfo.data))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, projectID])

  useEffect(() => {
    _loadProject()
  }, [_loadProject])

  const _buildPageItems = useCallback((pages: TProjectPages) => {
    const results: NavListProps[] = [];
    for (const pageID of Object.keys(pages || {})) {
      const pageConfig = project.setting.pages[pageID];
      if (!pageConfig) {
        continue;
      }

      if (pageConfig.type === PageConfigType.Directory) {
        results.push({
          title: pageConfig.name,
          path: paths.project.design(projectID).pageItem(pageID),
          icon: ICONS.folder,
          children: _buildPageItems(pages[pageID] as TProjectPages),
          inputValue: pageEditStatus[pageID] ? pageConfig.name : undefined,
          onInputSubmit: (value: string) => updatePageName(pageID, value),
          popupMenu: {
            title: ICONS.popupMenu.title,
            menuItems: [
              {
                title: t('project.pages.menu.rename'),
                icon: ICONS.popupMenu.rename,
                onClick: () => setPageEditStatus(pre => ({ ...pre, [pageID]: true }))
              },
              {
                title: t('project.pages.menu.new_group'),
                icon: ICONS.popupMenu.newGroup,
                onClick: () => addPage(PageConfigType.Directory, t('project.pages.menu.new_group'), pageID)
              },
              {
                title: t('project.pages.menu.new_page'),
                icon: ICONS.popupMenu.newPage,
                onClick: () => addPage(PageConfigType.Page, t('project.pages.menu.new_page'), pageID)
              },
              {
                divider: NavPopupMenuDivider.TOP,
                title: _renderDeleteBtn(),
                icon: ICONS.popupMenu.delete,
                onClick: () => dispatch(updateNavDialog({
                  operation: DialogOperation.DELETE_PAGE,
                  isOpen: true,
                  pageID,
                }))
              },
            ]
          }
        });
        continue;
      }

      if (pageConfig.type === PageConfigType.Page) {
        results.push({
          title: pageConfig.name,
          path: paths.project.design(projectID).pageItem(pageID),
          icon: ICONS.page,
          inputValue: pageEditStatus[pageID] ? pageConfig.name : undefined,
          onInputSubmit: (value: string) => updatePageName(pageID, value),
          popupMenu: {
            title: ICONS.popupMenu.title,
            menuItems: [
              {
                title: t('project.pages.menu.rename'),
                icon: ICONS.popupMenu.rename,
                onClick: () => setPageEditStatus(pre => ({ ...pre, [pageID]: true }))
              },
              {
                title: t('project.pages.menu.copy'),
                icon: ICONS.popupMenu.copy,
              },
              {
                divider: NavPopupMenuDivider.TOP,
                title: _renderDeleteBtn(),
                icon: ICONS.popupMenu.delete,
                onClick: () => dispatch(updateNavDialog({
                  operation: DialogOperation.DELETE_PAGE,
                  isOpen: true,
                  pageID,
                }))
              },
            ]
          } 
        });
      }
    }

    return results;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageEditStatus, t, project])

  const getMenuItems = useCallback(() => {
    if (!projectID || !project) {
      return []
    }
    
    return [
      { title: t('project.setting'), path: paths.project.design(projectID).setting, icon: ICONS.kanban },
      { title: 'DataBase', path: paths.project.design(projectID).database, icon: ICONS.booking },
      { title: t('project.pages.title'), path: paths.project.design(projectID).pages, icon: ICONS.folder,
      children: _buildPageItems(project?.pages || {}),
        popupMenu: {
          title: ICONS.popupMenu.title,
          menuItems: [
            {
              title: t('project.pages.menu.new_group'),
              icon: ICONS.popupMenu.newGroup,
              onClick: () => addPage(PageConfigType.Directory, t('project.pages.menu.new_group'))
            },
            {
              title: t('project.pages.menu.new_page'),
              icon: ICONS.popupMenu.newPage,
              onClick: () => addPage(PageConfigType.Page, t('project.pages.menu.new_page'))
            },
          ]
        }
      }
    ]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectID, project, t, _buildPageItems])

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: '',
        items: getMenuItems(),
      },
    ],
    [getMenuItems]
  );

  return data;
}

