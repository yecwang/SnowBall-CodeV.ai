import { useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import * as AstUtil from 'src/pluginapp-context-manager/utils/ast-util';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { updateComponents, updateComTreeStructure } from 'src/redux/slices/component-toolbox';
import { updateSelectedComId, updateCurrentComponentAttribute } from 'src/redux/slices/attribute-editor';
import { IAttribute } from 'src/types/project/project';

// ----------------------------------------------------------------------
export default function useToolbox() {
  const dispatch = useDispatch();
  const params = useParams();
  const searchParams = useSearchParams();
  const projectID = params.projectID as string;
  const pageID = searchParams?.get('pageID');
  const projectToolbox = useSelector((state) => state.projectToolbox);
  const project = useSelector((state) => state.project[projectID]);
  const components = projectToolbox.toolBoxComponents[projectID];
  const {comTreeStructure, comStructure} = projectToolbox;
  const { pages, variables, functions } = project || {};
  const currentPage = pages ? pages[pageID||''] : '';


  useEffect(() => {
    // get new com structure in this page
    const {treeStructure, comStructure} = AstUtil.getComTree(currentPage as string);
    dispatch(updateComTreeStructure({comTreeStructure: treeStructure, comStructure}));
  }, [currentPage, dispatch, projectID]);


  const updateToolBoxComponents = useCallback((toolBoxComponents: any) => {
    dispatch(updateComponents({projectID, toolBoxComponents}));
  }, [projectID, dispatch]);

  const getParentNodes = useCallback((id: string) => {
    const parentNodes: any[] = [];
    if (!comStructure) {
      return parentNodes;
    }
    let node = comStructure[id];
    while (node && node.parent) {
      parentNodes.push(node.parent);
      node = comStructure[node.parent];
    }
    return parentNodes;
  }, [comStructure]);
  
  const setSelectedComId = useCallback((event: React.MouseEvent, itemId: string) => {
    const componentAttr: IAttribute = {
      elementID: comStructure[itemId].attributes.id,
      componentName: comStructure[itemId].componentName,
      attributes: comStructure[itemId].attributes,
    };
    dispatch(updateCurrentComponentAttribute({ projectID, componentAttr}))
    dispatch(updateSelectedComId(itemId));
  }, [comStructure, dispatch, projectID])

  return {
    pages,
    variables,
    functions,
    components,
    comTreeStructure,
    setSelectedComId,
    getParentNodes,
    updateToolBoxComponents
  };
}
