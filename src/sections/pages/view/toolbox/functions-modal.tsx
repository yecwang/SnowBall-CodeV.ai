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
  GridRowId,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid';

import {ReactFlowProvider} from '@xyflow/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from 'src/components/snackbar';
import useServerAction from 'src/hooks/use-server-action';
import { paths } from 'src/routes/paths';
import * as projectActions from 'src/services/server-actions/project/client';
import i18n from 'i18next';

import { TFunction } from 'src/pluginapp-context-manager/types';
import { useRouter, } from 'src/routes/hook';
import FunctionFlow from 'src/sections/flow-functions/index'

// redux
import { useDispatch, useSelector } from 'src/redux/store';
import React, { useEffect, useState } from 'react';
import { setFunctions } from 'src/redux/slices/project';

interface FunctionsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectID: number;
}

export default function FunctionModal({ open, setOpen, projectID }: FunctionsModalProps) {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [openFunctionFlow, setOpenFunctionFlow] = useState(false);
  const router = useRouter();
  const functions = useSelector((state) => state.project[projectID]?.functions || []);
  const dispatch = useDispatch();
  const { run: updateFunctions } = useServerAction(projectActions.updateFunctions)
  const { enqueueSnackbar } = useSnackbar();
  const [editRowsModel, setEditRowsModel] = useState({});
  const [currentFuncName, setCurrentFuncName] = useState<string>('');
  const apiRef = useGridApiRef();

  useEffect(() => {
    if (functions && functions.length) {
      setRows(
        functions.map((item: TFunction, index: any) => ({
          ...convertRow(item),
          id: index,
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [functions]);

  const convertRow = (func: TFunction) => {
    const newRow = {
      ...func,
    };
    return newRow;
  };

  const convertFunction = (func: TFunction) => {
    const newFunc = {
      ...func,
      name: func.name,
      description: func.description,
      isReturn: func.isReturn || false,
      parameters: func.parameters,
    };
    return newFunc;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    const currentRow = rows.find((row) => row.id === id);
    if (currentRow) {
      setOpenFunctionFlow(true);
      setCurrentFuncName(currentRow.name);
    }
  };

  const handleSaveClick = async (id: GridRowId) => {
    const editRow = apiRef.current.getRowWithUpdatedValues(id, 'name');
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    const newFuncs = rows.map((row) => {
      const newRow = row.id === editRow.id ? editRow : row;
      return convertFunction(newRow as TFunction);
    })
    
    const { error } = await updateFunctions(projectID, newFuncs as TFunction[], "CREATE");
    if (!error) {
      dispatch(setFunctions({ projectID, functions: newFuncs }));
      enqueueSnackbar('Create function success!');
    }
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
    const newFuncs = newRows.map((row) => convertFunction(row as TFunction));
    const { error } = await updateFunctions(projectID, newFuncs as TFunction[]);
    if (!error) {
      dispatch(setFunctions({ projectID, functions: newFuncs }));
      enqueueSnackbar('Delete function success!');
    }
  };

  const addNew = () => {
    const id = rows.length + 1;
    const newRow = {
      id,
      name: '',
      type: 'Private',
      parameters: [],
      description: '',
      isReturn: false,
    };
    setRows([...rows, newRow]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'id' },
    }));
  };
  
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: i18n.t('project_design.functions.name'),
      editable: true,
      type: 'string',
      flex: 1,
    },
    {
      field: 'type',
      headerName: i18n.t('project_design.functions.type'),
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Global', 'Private'],
      flex: 1,
    },
    {
      field: 'parameters',
      headerName: i18n.t('project_design.functions.parameters'),
      renderCell: (params: GridRenderCellParams<any, {name: string, type: string}[]>) => {
        if (params.value && params.value.length) {
          return params.value.map((param) => `${param.name}: ${param.type}`).join(', ');
        }
        return '';
      },
      editable: false,
      flex: 1,
    },
    {
      field: 'description',
      headerName: i18n.t('project_design.functions.description'),
      editable: true,
      flex: 1,
    },
    {
      field: 'isReturn',
      headerName: i18n.t('project_design.functions.isReturn'),
      editable: true,
      type: 'boolean',
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      flex: 1.5,
      headerName: i18n.t('project_design.functions.operation'),
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
            onClick={ _=> handleSaveClick(id)}
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
      <div>
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
          {i18n.t('project_design.functions.edit')}
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
              placeholder={i18n.t('project_design.functions.search_placeholder')}
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
            {i18n.t('project_design.functions.create')}
          </Button>
        </Box>

        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            hideFooterPagination
            onRowModesModelChange={(newModel) => {
              setRowModesModel(newModel);
            }}
            processRowUpdate={(updatedRow) => {
              setRowModesModel({ ...rowModesModel, [updatedRow.id]: { mode: GridRowModes.View } });
              const newRows = rows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
              setRows(newRows);
              return updatedRow;
            }}
            onRowEditStop={(params) => {
              const newRows = rows.map((row) => (row.id === params.id ? params.row : row))
              setRows(newRows);
            }}
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
            {i18n.t('project_design.functions.close')}
          </Button>
        </Box>
      </Box>
      <Modal
        open={openFunctionFlow}
        onClose={() => setOpenFunctionFlow(false)}
      >
        <FunctionFlow functionName={currentFuncName} setOpen={setOpenFunctionFlow} type="edit"/>
      </Modal>
      </div>
    </Modal>
  );
}
