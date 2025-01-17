'use client';

// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
// components
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
// hooks
import { useSearchParams } from 'src/routes/hook';
import { useBoolean } from 'src/hooks/use-boolean';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { useCallback, useEffect, useState } from 'react';
import { setVariables } from 'src/redux/slices/project';
// ----------------------------------------------------------------------
import * as VariablesParser from 'src/pluginapp-context-manager/parser/variable-parser'
import { TVariable } from 'src/pluginapp-context-manager/types';
import { useSnackbar } from 'notistack';


interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}


function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    let id = Math.random();
    setRows((oldRows) => {
      id = oldRows.length + 1;
      return [...oldRows, { id, name: '', type: 'String', value: '', isNew: true }]
    });
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'id' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function VariablesView() {
  const settings = useSettingsContext();
  const urlSearchParams = useSearchParams();
  const projectID = urlSearchParams.get('projectID');
  const project = useSelector((state) => state.project);
  // const [variables, setVariables] = useState<Array<TVariable>>([])
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [deleteItem, setDeleteItem] = useState<TVariable | null>(null);
  const dispatch = useDispatch();

  const columns: GridColDef[] = [
    {
      field: 'key',
      headerName: 'Key',
      width: 250,
      editable: true,
    },
    {
      field: 'kind',
      headerName: 'Kind',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['let', 'const'],
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['string', 'number', 'boolean', 'Array<any>', 'object'],
    },
    {
      field: 'value',
      headerName: 'Value',
      width: 150,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      // @ts-ignore
      getActions: (item) => {
        const {id} = item;
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
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
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
    
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ]
  useEffect(()=>{
    if (!projectID || !project[projectID]) {
      return;
    }
    setRows(project[projectID].variables.map((item: TVariable, index: any) => ({...convertRow(item), id: index})))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])
  const convertRow = (variable: TVariable) => {
    const newRow = {
      ...variable
    }
    return newRow
  }
  const convertVariable = (variable: TVariable) => {
    const newVar = {
      key: variable.key,
      kind: variable.kind,
      type: variable.type,
      value: variable.value,
      description: variable.description,
    }
    return newVar
  }
  const handleSaveVariables = useCallback((variables: TVariable[]) => {
    dispatch(setVariables({ projectID: Number(projectID), variables }))
  }, [dispatch, projectID])

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
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
    console.log('updatedRow: ', updatedRow)
    setRowModesModel({ ...rowModesModel, [newRow.id]: { mode: GridRowModes.View } });
    const newRows = rows.map((row) => (row.id === newRow.id ? updatedRow : row))
    setRows(newRows);
    const newvariables = newRows.map((row) => convertVariable(row as TVariable))
    // @ts-ignore
    handleSaveVariables(newvariables);
    // @ts-ignore
    console.log('final code2', VariablesParser.generateCode(newvariables))
    return updatedRow;
  };
  const onProcessRowUpdateError = (error: Error) => {
    enqueueSnackbar(error.message, { variant: 'error' });
  }
  
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  const handleDeleteClick = (id: GridRowId) => () => {
    const deleteRow = rows.find((row) => row.id === id)
    setDeleteItem(deleteRow as TVariable);
    confirm.onTrue();
  };
  const onDeleteRow = () => {
    if (deleteItem) {
      const newRows = rows.filter((row) => row.key !== deleteItem.key)
      setRows(newRows);
      // @ts-ignore
      handleSaveVariables(newRows.map((row) => convertVariable(row as TVariable)));
    }
    confirm.onFalse();
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Variables </Typography>

      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 620,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        <DataGrid 
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={onProcessRowUpdateError}
          disableRowSelectionOnClick
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Box>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete ${deleteItem ? deleteItem.key : ''} ?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </Container>
  );
}
