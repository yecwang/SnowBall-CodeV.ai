import { useState } from 'react';
// hooks
import { useParams } from 'src/routes/hook';
import useServerAction from 'src/hooks/use-server-action';
// utils
import uuidV4 from 'src/lib/client/utils/uuidv4';
// redux
import { useSelector, useDispatch } from 'src/redux/store';
import { setPage, setProject, setSetting } from 'src/redux/slices/project';
// server action
import * as projectActions from 'src/services/server-actions/project/client';
import { PageConfigType } from 'src/pluginapp-context-manager/types';
import _ from 'lodash';


export default function usePages() {
  const _findFullPathByPageID = (pages: any, newPageID: string, currentPageID?: string, currentPath?: string): string | null => {
    if (!currentPageID) {
      return newPageID;
    }
    // eslint-disable-next-line guard-for-in
    for (const k in pages) {
      const newPath = currentPath ? `${currentPath}/${k}` : k;
      if (k === currentPageID) {
        return `${newPath}/${newPageID}`;
      } 
      if (typeof pages[k] === 'object') {
        const foundPath = _findFullPathByPageID(pages[k], newPageID, currentPageID, newPath);
        if (foundPath) {
          return foundPath;
        }
      }
    }
    return null;
  }

  const dispatch = useDispatch()
  const params = useParams();
  const projectID = Number(params.projectID);
  const project = useSelector(store => store.project[projectID]);
  const { run: loadProject } = useServerAction(projectActions.loadProject);
  const { run: addPageToFile } = useServerAction(projectActions.addPage);
  const { run: updatePageNameToFile } = useServerAction(projectActions.updatePageName);
  const { run: deletePageInFile } = useServerAction(projectActions.deletePage);
  const [pageEditStatus, setPageEditStatus] = useState<{ [key: string]: boolean }>({});

  const addPage = async (pageType: PageConfigType, defaultFilename: string, currentPageID?: string) => {
    const _buildDefaultPageCode = (isClientRun: boolean) => `
        import { Box } from 'ui-lib';
        import funs from 'funs';
        ${isClientRun ? '' : 'export default '}function Page() {
          return <Box sx={{
            display: 'flex',
            direction: 'row',
            width: '100%',
            height: '100%',
          }} id="container"></Box>;
        };
        ${isClientRun ? '<Page />' : ''}
      `
    const _findAndAddPage = (current: any, currentPageID?: string) => {
      if (!currentPageID) {
        current[newPageID] = content;
        return true;
      }

      // eslint-disable-next-line guard-for-in
      for (const k in current) {
        if (k === currentPageID) {
          current[k][newPageID] = content;
          return true;
        } 
        if (typeof current[k] === 'object') {
          if (_findAndAddPage(current[k], currentPageID)) {
            return true;
          }
        }
      }

      return false;
    }

    const newPages = _.cloneDeep(project.pages)
    const newPageID = uuidV4();

    const content = pageType === PageConfigType.Directory ? {} : _buildDefaultPageCode(true);
    _findAndAddPage(newPages, currentPageID);
    const pageConfig = {
      type: pageType,
      name: defaultFilename,
      path: _findFullPathByPageID(newPages, newPageID, currentPageID) || '',
    };

    await addPageToFile({ projectID, pageID: newPageID, pageConfig, pageCode: _buildDefaultPageCode(false), pageType })

    dispatch(setPage({ projectID, pages: newPages }));
    dispatch(setSetting({
      projectID,
      setting: {
        ...project.setting,
        pages: {
          ...project.setting.pages,
          [newPageID]: pageConfig,
        }
      }
    }));
    setPageEditStatus(pre => ({ ...pre, [newPageID]: true }))
  };

  const deletePage = async (pageID: string) => {
    await deletePageInFile({ projectID, pageID });
    const projectInfo = await loadProject(String(projectID))
    if (projectInfo.data) {
      dispatch(setProject(projectInfo.data))
    }
  }

  const updatePageName = async (pageID: string, name: string) => {
    await updatePageNameToFile({ projectID, pageID, name });
    setPageEditStatus(pre => ({ ...pre, [pageID]: false }));
    dispatch(setSetting({
      projectID,
      setting: {
        ...project.setting,
        pages: {
          ...project.setting.pages,
          [pageID]: {
            ...project.setting.pages[pageID],
            name
          }
        }
      }
    }));
  }

  return {
    pageEditStatus,
    setPageEditStatus,
    addPage,
    deletePage,
    updatePageName,
  }
}