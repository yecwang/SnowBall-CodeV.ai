import { useCallback, useEffect } from 'react';
import _ from 'lodash';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { updateAttributesConfig, updateCurrentComponentAttribute } from 'src/redux/slices/attribute-editor';
import { useParams } from 'next/navigation';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------
export default function useAttributeEditor() {
  
  const dispatch = useDispatch();
  const params = useParams();
  const projectID = params.projectID as string;
  const functionList = useSelector((state) => state.project[String(projectID)]?.functions || []);
  const projectToolbox = useSelector((state) => state.projectToolbox);
  const currentComponentAttr = useSelector((state) => state.projectAttributes.currentComponentAttr);
  const attributesConfig = useSelector((state) => state.projectAttributes.attributesConfig);
  const { currentLang } = useLocales();

  const cancelCurrentComponentAttr = () => {
    if (currentComponentAttr) {
      dispatch(updateCurrentComponentAttribute({projectID, componentAttr: null}))
    }
  };

  const getAttributes = useCallback((attr: any, toolBoxComponents: any) => {
    if (!attr || !toolBoxComponents) {
      return []
    }
    const currentComponent = toolBoxComponents[attr.componentName];
    if (currentComponent) {
      const currentAttributes = attr.attributes
      const convertedAttributes = Object.keys(currentComponent.attributesConfig||{}).map(item=>{
        const newAttr = _.cloneDeep(currentComponent.attributesConfig[item])
        newAttr.key = item
        newAttr.value = currentAttributes[item]
        return newAttr
      })
      return convertedAttributes
    }
    return []
  }, [])

  useEffect(() => {
    if (projectID) {
      const currentProjectToolBoxComponents = projectToolbox.toolBoxComponents[projectID]
      dispatch(updateAttributesConfig({
        projectID,
        attributesConfig: getAttributes(currentComponentAttr[projectID], currentProjectToolBoxComponents)
      }));
    }
  }, [projectID, currentComponentAttr, projectToolbox.toolBoxComponents, dispatch, getAttributes]);

  const componentTranslation = (key: string, componentName?: string) => {
    key = key.replace('@@@', '');
    const toolBoxComponents = projectToolbox.toolBoxComponents[projectID];
    const currentComponent = toolBoxComponents?.[componentName || currentComponentAttr[projectID]?.componentName || ''];
    const locales = currentComponent?.locales || {};
    const componentLocal = locales[currentLang.value] || {};
    return componentLocal[key] || key;
  };

  const updateCurrentAttributesConfig = useCallback((projectID: string) => {
    const currentProjectToolBoxComponents = projectToolbox.toolBoxComponents[projectID]
    dispatch(updateAttributesConfig({
      projectID,
      attributesConfig: getAttributes(currentComponentAttr[projectID], currentProjectToolBoxComponents)
    }));
  }, [currentComponentAttr, projectToolbox.toolBoxComponents, dispatch, getAttributes])

  const onAttributesConfigChange = useCallback((projectID: string, config: object) => {
    if (!currentComponentAttr || !projectID || !currentComponentAttr[projectID]) {
      return
    }
    const attr: any = _.cloneDeep(currentComponentAttr[projectID])

    attr.attributes = {
      ...attr.attributes,
      ...config
    }
    dispatch(updateCurrentComponentAttribute({projectID, componentAttr: attr}))
    // dispatch(updateAfterUpdateCurentComponentAttr(attr))
  }, [currentComponentAttr, dispatch]);
  
  const resetAttributeEditor = useCallback(async (projectID: string) => {
    // await dispatch(updateAfterUpdateCurentComponentAttr({}))
    await dispatch(updateCurrentComponentAttribute({projectID, componentAttr: null}))
    await dispatch(updateAttributesConfig({projectID, attributesConfig: []}))
  }, [dispatch]);
  
  return {
    attributesConfig,
    currentAttributesConfig: attributesConfig[projectID],
    currentComponentAttr: currentComponentAttr[projectID],
    functionList,
    //
    resetAttributeEditor,
    onAttributesConfigChange,
    updateCurrentAttributesConfig,
    componentTranslation,
    cancelCurrentComponentAttr,
  };
}
