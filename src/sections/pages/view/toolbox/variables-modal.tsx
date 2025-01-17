'use client';

// @mui
import { Box, Button, Modal, Paper, OutlinedInput, InputAdornment } from '@mui/material';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRow,
  GridRowModel,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import CopyIcon from '@mui/icons-material/CopyAll';
import useToolbox from 'src/sections/pages/hooks/use-toolbox';

// components

// redux
import { useDispatch, } from 'src/redux/store';
import { useEffect, useState } from 'react';
import { setVariables } from 'src/redux/slices/project';
// ----------------------------------------------------------------------
import { TVariable } from 'src/pluginapp-context-manager/types';
// import { usePopover } from 'src/components/custom-popover';
import i18n from 'i18next';

interface VariablesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectID: number;
}

interface TRows {
  id: number;
  key: string;
  kind: string;
  type: string;
  value: string;
  description: string;
}

export default function VariablesModal({ open, setOpen, projectID }: VariablesModalProps) {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const { variables } = useToolbox();
  const dispatch = useDispatch();

  useEffect(() => {
    if (variables && variables.length) {
      setRows(
        variables.map((item: TVariable, index: any) => ({
          ...convertRow(item),
          id: index,
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables]);

  const convertRow = (variable: TVariable) => {
    const newRow = {
      ...variable,
    };
    return newRow;
  };


  const convertVariable = (variable: TRows) => {
    const newVar = {
      key: variable.key,
      kind: variable.kind,
      type: variable.type,
      description: variable.description,
      value: variable.value,
    };
    return newVar;
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    if (!newRow.key || !newRow.type || !newRow.kind) {
      throw new Error("key, type and kind are required")
    }
    const sameItem = rows.find(item=>item.id !== newRow.id && item.key === newRow.key);
    if (sameItem) {
      throw new Error("Duplicated id")
    }
    setRowModesModel({ ...rowModesModel, [newRow.id]: { mode: GridRowModes.View } });
    const newRows = rows.map((row) => (row.id === newRow.id ? updatedRow : row))
    setRows(newRows);
    const newvariables = newRows.map((row) => convertVariable(row as TRows))
    // handleSaveVariables(newvariables);
    dispatch(setVariables({ projectID: Number(projectID), variables: newvariables }));
    // console.log('final code2', VariablesParser.generateCode(newvariables))
    return updatedRow;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
    const saveVariables = newRows.map((row) => convertVariable(row as TRows));
    dispatch(setVariables({ projectID: Number(projectID), variables: saveVariables }));
  };

  const addNew = () => {
    const id = rows.length + 1;
    const newRow = { id, key: '', kind: '', type: 'string', value: '', description: '', isNew: true }
    setRows([...rows, newRow]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'id' },
    }));
  };

  const handleCopy = ({ row }: GridRowModel) => {
    // copy row to clipboard
    navigator.clipboard.writeText(JSON.stringify(row));
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: i18n.t('project_design.variables.id'),
      editable: true,
      flex: 1,
    },
    {
      field: 'key',
      headerName: i18n.t('project_design.variables.name'),
      editable: true,
      flex: 1,
    },
    {
      field: 'kind',
      headerName: i18n.t('project_design.variables.type'),
      editable: true,
      type: 'singleSelect',
      valueOptions: ['let', 'const'],
      flex: 1,
    },
    {
      field: 'type',
      headerName: i18n.t('project_design.variables.attribute'),
      editable: true,
      type: 'singleSelect',
      valueOptions: ['string', 'number', 'boolean', 'Array<any>', 'object'],
      flex: 1,
    },
    {
      field: 'value',
      headerName: i18n.t('project_design.variables.default'),
      editable: true,
      flex: 1,
    },
    {
      field: 'description',
      headerName: i18n.t('project_design.variables.description'),
      editable: true,
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      flex: 1.5,
      headerName: i18n.t('project_design.variables.operation'),
      cellClassName: 'actions',
      getActions: (item) => {
        const { id } = item;
        return [
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            sx={{
              color: 'primary.main',
            }}
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            sx={{
              color: 'primary.main',
            }}
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            className="textPrimary"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<CopyIcon />}
            label="Delete"
            className="textPrimary"
            onClick={(_) => handleCopy(item)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const onClose = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          background:
            'linear-gradient(180deg, rgba(211,222,234,0.98) 100%,rgba(238,247,255,0.98) 0%)',
          boxShadow: '0px 0px 10px 1px rgba(5,43,86,0.3)',
          border: '3px solid rgba(225,235,249,0.98)',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="left"
          sx={{
            fontSize: '16px',
            textAlign: 'left',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            borderRadius: '10px',
            color: 'rgba(5,43,86,1)',
          }}
        >
          <img src="/assets/images/project/variables-edit.png" alt="" />
          {i18n.t('project_design.variables.edit')}
        </Box>

        <Box
          display="flex"
          justifyContent="left"
          alignItems="center"
          sx={{
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{
              width: '202px',
              overflow: 'hidden',
            }}
          >
            <OutlinedInput
              placeholder={i18n.t('project_design.variables.search_placeholder')}
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              }
              sx={{ mr: 2, backgroundColor: '#FFFF' }}
            />
          </Box>
          <Button
            sx={{
              mr: 2,
              width: '100px',
              height: '35px',
              lineHeight: '16px',
              borderRadius: '5px',
              background:
                'linear-gradient(180deg, rgba(14,90,90,0.9) 100%,rgba(36,169,169,0.9) 0%)',
              color: 'rgba(238,247,255,1)',
              fontSize: '12px',
              textAlign: 'center',
              boxShadow: '0px 0px 3px 0px rgba(5,43,86,0.3)',
              fontFamily: 'Roboto',
              border: '1px solid rgba(10,121,121,1)',
            }}
          >
            {i18n.t('project_design.variables.import')}
          </Button>
          <Button
            sx={{
              mr: 2,
              width: '100px',
              height: '35px',
              lineHeight: '16px',
              borderRadius: '5px',
              background: 'linear-gradient(180deg, rgba(5,43,86,0.9) 100%,rgba(19,86,159,0.9) 0%)',
              color: 'rgba(238,247,255,1)',
              fontSize: '12px',
              textAlign: 'center',
              boxShadow: '0px 0px 3px 0px rgba(5,43,86,0.3)',
              fontFamily: 'Roboto',
              border: '1px solid rgba(19,86,159,0.9)',
            }}
          >
            {i18n.t('project_design.variables.download')}
          </Button>
          <Button
            startIcon={<AddIcon />}
            sx={{
              marginLeft: 'auto',
              width: '80px',
              height: '40px',
              lineHeight: '20px',
              borderRadius: '10px 10px 0px 0px',
              backgroundColor: 'rgba(208,223,242,0.8)',
              color: 'rgba(5,43,86,1)',
              fontSize: '14px',
              textAlign: 'center',
              fontFamily: 'Roboto',
            }}
            onClick={addNew}
          >
            {i18n.t('project_design.variables.create')}
          </Button>
        </Box>

        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            hideFooterPagination
            onRowModesModelChange={(newModel) => {
              setRowModesModel(newModel);
            }}
            processRowUpdate={processRowUpdate}
            checkboxSelection
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'rgba(208,223,242,0.8)',
                color: 'rgba(5,43,86,1)',
                fontSize: '14px',
                textAlign: 'center',
                fontFamily: 'PingFang SC',
              },
            }}
          />
        </Paper>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="contained" onClick={onClose}>
            {i18n.t('project_design.variables.close')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
