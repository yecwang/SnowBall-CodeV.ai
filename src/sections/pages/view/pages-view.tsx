'use client';

import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// @mui
import Box from '@mui/material/Box';
// Custom components
import Simulator, { Device, DeviceSwitch } from 'src/components/simulator';
import { HEADER, NAV } from 'src/layouts/config-layout';
import { useSettingsContext } from 'src/components/settings';
import { useSearchParams } from 'src/routes/hook';
import Draggable from 'react-draggable';
//
import { Attribute } from './attribute';
import PagesRunner from '../pages-runner';
import PagesToolbox from './toolbox/pages-toolbox';
import { W_ATTRIBUTE } from '../config';
import { useAttributeEditor } from '../hooks';

export default function PageView() {
  const _calculatePosition = () => {
    const isNavHorizontal = settings.themeLayout === 'horizontal';
    const isNavMini = settings.themeLayout === 'mini';

    const top = HEADER.H_DESKTOP + HEADER.H_HEADER_TOOLBAR + (isNavHorizontal ? HEADER.H_MOBILE : 0);
    // eslint-disable-next-line no-nested-ternary
    const left = (isNavHorizontal ? 0 : isNavMini ? NAV.W_MINI : NAV.W_VERTICAL);
    const right = W_ATTRIBUTE;

    return { top, left, right };
  };

  const settings = useSettingsContext();
  const { top, left, right } = _calculatePosition();
  const offset = 10;
  const [device, setDevice] = useState<Device>(Device.iphone);
  const viewPosition = { top, left, right };
  const onDeviceChange = (value: Device) => setDevice(value);

  const searchParams = useSearchParams();
  const pageID = searchParams.get('pageID');
  const { cancelCurrentComponentAttr } = useAttributeEditor();

  // eslint-disable-next-line
  useEffect(() => { cancelCurrentComponentAttr() }, [pageID]);

  return (
    // Error: Cannot have two HTML5 backends at the same time.
    // Solution: https://github.com/react-dnd/react-dnd/issues/3257#issuecomment-1239254032
    <DndProvider backend={HTML5Backend} context={window}>
      <Box sx={{ position: 'relative', width: 1, height: 1, display: 'flex' }}>
        {/* <PagesRuler /> */}
        <DeviceSwitch device={device} onDeviceChange={onDeviceChange} sx={{ position: 'fixed', zIndex: 9999, top: `${top + offset}px`, left: `${left + offset}px` }} />
        <Box sx={{
          width: 1,
          height: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pr: `${right}px`,
          py: '10px'
        }}>
          <Simulator bespread={device === Device.web} open>
            <PagesRunner />
          </Simulator>
        </Box>
        <Attribute />
        <Draggable bounds='body'>
          <Box sx={{ position: 'fixed', top: top + offset, right: right + offset }}>
            <PagesToolbox />
          </Box>
        </Draggable>
      </Box>
    </DndProvider>
  )
}
