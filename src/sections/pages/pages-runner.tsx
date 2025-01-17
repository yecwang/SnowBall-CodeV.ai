'use client';

import { useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';


import Assistant from 'src/sections/pages/components/assistant';
// hooks
import { useParams, useSearchParams } from 'src/routes/hook';
import { useRunner } from './hooks'

// ----------------------------------------------------------------------
export default function RunnerView() {
  const urlSearchParams = useSearchParams();
  const params = useParams();
  const projectID = params.projectID as string;
  const pageID = urlSearchParams.get('pageID');
  const { currentComponentAttr, render, updateAttributesInSourceCode } = useRunner();

  useEffect(() => {
    try {
      render("runner-container")
    } catch(error) {
      console.log("render error", error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render])

  useEffect(() => {
    if (!projectID || !pageID) {
      return;
    }
    updateAttributesInSourceCode(projectID, pageID);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentComponentAttr])

  return (
    <>
      <Box id="runner-container" sx={{width: '100%', height: '100%'}} />
      <Assistant />
    </>
  );
}
