'use client';

// TODO: remove this file  after the attribute area is optimized
// ----------------------------------------------------------------
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import _ from 'lodash';
// @mui
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Iconify from 'src/components/iconify/iconify';
import Autocomplete from '@mui/material/Autocomplete';

// hooks
import { useLocales } from 'src/locales';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useAttributeEditor } from '../../hooks';

// ----------------------------------------------------------------------

export default function AttributeCorrelation() {
  const { t } = useLocales();
  const params = useParams();
  const projectID = params.projectID as string;
  const {
    attributesConfig,
    functionList,
    onAttributesConfigChange,
    updateCurrentAttributesConfig,
    resetAttributeEditor,
  } = useAttributeEditor();
  const config: { [key: string]: any } = useMemo(() => ({}), []);

  const saveAttributeConfig = () => {
    if (!projectID) {
      return;
    }
    console.log('config ====>', config);
    onAttributesConfigChange(projectID, config);
  };

  useEffect(() => {
    if (!projectID) {
      return;
    }
    updateCurrentAttributesConfig(projectID);
  }, [projectID, updateCurrentAttributesConfig]);

  useEffect(() => {
    if (!projectID) {
      return;
    }
    resetAttributeEditor(projectID);
  }, [projectID, resetAttributeEditor]);

  useEffect(() => {
    if (!projectID || !attributesConfig[projectID]) {
      return;
    }
    const currentProjectAttrConfig = attributesConfig[projectID];
    if (currentProjectAttrConfig.length > 0) {
      currentProjectAttrConfig.forEach((item: any) => {
        config[item.key] = item.value;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributesConfig]);

  return (
    <Container>
      <Stack component={Paper} variant="outlined" spacing={3} sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <Typography variant="h6">Attributes</Typography> */}
        </Stack>
        <Box display="flex" alignItems="center" sx={{ justifyContent: 'space-between' }} mb={3}>
          <IconButton size="small">
            <EditIcon />
          </IconButton>
          <TextField label="ID" variant="outlined" size="small" fullWidth />
        </Box>
        <Box display="flex" alignItems="center" sx={{ justifyContent: 'space-between' }} mb={3}>
          <IconButton size="small">
            <TextFieldsIcon />
          </IconButton>
          <TextField variant="outlined" size="small" fullWidth />
        </Box>
        <Box display="flex" alignItems="center" sx={{ justifyContent: 'space-between' }} mb={3}>
          <IconButton size="small">
            <Iconify icon="lucide:database" />
          </IconButton>
          <Autocomplete
            freeSolo
            fullWidth
            id="submit-associate-field"
            disableClearable
            options={['Option 1', 'Option 2', 'Option 3']}
            renderInput={(params) => (
              <TextField
                {...params}
                label="请输入联想数据提交关联字段/变量"
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
        </Box>
        <Box display="flex" alignItems="center" sx={{ justifyContent: 'space-between' }} mb={3}>
          <IconButton size="small">
            <Iconify icon="lucide:square-check" />
          </IconButton>
          <Autocomplete
            freeSolo
            fullWidth
            id="submit-check-condition"
            disableClearable
            options={['Option 1', 'Option 2', 'Option 3']}
            renderInput={(params) => (
              <TextField
                {...params}
                label="请输入联想数据提交核查条件"
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
        </Box>
        <Box display="flex" alignItems="center" sx={{ justifyContent: 'space-between' }} mb={3}>
          <IconButton size="small">
            <Iconify icon="lucide:square-function" />
          </IconButton>
          <Autocomplete
            freeSolo
            fullWidth
            id="submit-format-function"
            disableClearable
            options={['Option 1', 'Option 2', 'Option 3']}
            renderInput={(params) => (
              <TextField
                {...params}
                label="请输入联想数据提交核查函数"
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
        </Box>
        <Box display="flex" alignItems="center" sx={{ justifyContent: 'space-between' }} mb={3}>
          <IconButton size="small">
            <Iconify icon="lucide:database" />
          </IconButton>
          <Autocomplete
            freeSolo
            fullWidth
            id="display-associate-field"
            disableClearable
            options={['Option 1', 'Option 2', 'Option 3']}
            renderInput={(params) => (
              <TextField
                {...params}
                label="请输入联想数据展示关联字段/变量"
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
        </Box>
        <Box display="flex" alignItems="center" sx={{ justifyContent: 'space-between' }} mb={3}>
          <IconButton size="small">
            <Iconify icon="lucide:square-check" />
          </IconButton>
          <Autocomplete
            freeSolo
            fullWidth
            id="display-check-condition"
            disableClearable
            options={['Option 1', 'Option 2', 'Option 3']}
            renderInput={(params) => (
              <TextField
                {...params}
                label="请输入联想数据展示核查条件"
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
        </Box>
        <Box display="flex" alignItems="center" sx={{ justifyContent: 'space-between' }} mb={3}>
          <IconButton size="small">
            <Iconify icon="lucide:square-function" />
          </IconButton>
          <Autocomplete
            freeSolo
            fullWidth
            id="display-format-function"
            disableClearable
            options={['Option 1', 'Option 2', 'Option 3']}
            renderInput={(params) => (
              <TextField
                {...params}
                label="请输入联想数据展示格式化函数"
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
        </Box>
      </Stack>
    </Container>
  );
}
