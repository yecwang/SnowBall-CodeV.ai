import { useCallback } from 'react';
import _ from 'lodash';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { updatePageCode } from 'src/redux/slices/project';
// code parser
import { renderCodes } from 'src/pluginapp-context-manager/parser/ui-parser';
import { updateComponentAttributes } from 'src/pluginapp-context-manager/utils/ast-util';
import { TProjectPages } from 'src/pluginapp-context-manager/types';
import { useParams, useSearchParams } from 'src/routes/hook';
import { enqueueSnackbar } from 'src/components/snackbar';
import { useLocales } from "src/locales";

// ----------------------------------------------------------------------
type TUseRunner = {
  projectID?: string;
  pageID?: string
};
export default function useRunner(useRunnerParams?: TUseRunner) {
  const urlSearchParams = useSearchParams();
  const params = useParams();
  const projectID = useRunnerParams?.projectID || params?.projectID as string;
  const pageID = useRunnerParams?.pageID || urlSearchParams?.get('pageID') as string;
  const dispatch = useDispatch();
  const projectToolbox = useSelector((state) => state.projectToolbox);
  const currentComponentAttr = useSelector((state) => state.projectAttributes.currentComponentAttr);
  const project = useSelector((state) => state.project);
  const { t } = useLocales()
  const currentProject = project[projectID];
  
  const getPageCode = useCallback(() => {
    if (!currentProject) {
      return '';
    }

    const pageConfig = currentProject.setting.pages[pageID || ''];
    if (!pageConfig?.path) {
      return '';
    }

    const paths = pageConfig.path.split('/');
    let current =  currentProject.pages;
    for (const key of paths) {
      current = current[key] as TProjectPages;
    }

    return current as unknown as string;
  }, [currentProject, pageID]);

  const render = useCallback((containerId: string) => {
    if (!pageID) {
      return;
    }
    const code = getPageCode();
    try {
      renderCodes(code, containerId, {}, {projectID, pageID})
    } catch(e) {
      // 弹框提示
      enqueueSnackbar(t('pages.generate_page_error'))
      console.log("render error: ", e.message)
    }
  }, [pageID, getPageCode, projectID, t]);

  const changeCode = useCallback(async (projectID: string, pageID: string, code: string) => {
    await dispatch(updatePageCode({projectID: Number(projectID), pageID, code}));
  }, [dispatch]);

  const updateAttributesInSourceCode = useCallback((projectID: string, pageID: string) => {
    const currentAttr = currentComponentAttr[projectID]
    if (!currentAttr) {
      return
    }
    const { pages } = project[projectID]
    const currentTooBoxComponents = projectToolbox.toolBoxComponents[projectID]
    if (!pages || !currentTooBoxComponents) {
      return;
    }
    let newCodes = getPageCode();
    const newAttr = _.cloneDeep(currentAttr)
    try {
      const componentName = currentTooBoxComponents[newAttr.componentName]?.name
      newCodes = updateComponentAttributes(newCodes, newAttr, componentName)
    } catch(e) {
      console.log("e message: ", e.message)
      console.log('Attributes Error: ', newAttr)
    }
    changeCode(projectID, pageID, newCodes)
  }, [currentComponentAttr, project, projectToolbox.toolBoxComponents, getPageCode, changeCode])
  
  const onCodeEditorChange = useCallback((projectID: string|null, pageID: string|null, code: string) => {
    if (!projectID || !pageID) {
      return
    }
    changeCode(projectID, pageID, code)
  }, [changeCode]);
  
  return {
    pageID,
    projectID,
    project,
    projectToolbox,
    currentComponentAttr,
    //
    updateAttributesInSourceCode,
    onCodeEditorChange,
    changeCode,
    render,
    getPageCode,
  };
}
