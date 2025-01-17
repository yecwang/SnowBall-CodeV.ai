import { useCallback } from 'react';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { updateComponents } from 'src/redux/slices/component-toolbox';

// ----------------------------------------------------------------------
export default function useComponentToolbox() {
  const dispatch = useDispatch();

  const projectToolbox = useSelector((state) => state.projectToolbox);

  const updateToolBoxComponents = useCallback((projectID: string, toolBoxComponents: any) => {
    dispatch(updateComponents({projectID, toolBoxComponents}));
  }, [dispatch]);


  return {
    projectToolbox,
    updateToolBoxComponents,
  };
}
