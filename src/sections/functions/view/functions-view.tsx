'use client'

import { useState } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Tabs from '@mui/material/Tabs';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSnackbar } from 'src/components/snackbar';
import Label from 'src/components/label';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import useServerAction from 'src/hooks/use-server-action';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hook';
// redux
import { useSelector, useDispatch } from 'src/redux/store';
import { setFunctions } from 'src/redux/slices/project';
// types
import { TFunction } from 'src/pluginapp-context-manager/types';
//
import * as projectActions from 'src/services/server-actions/project/client';
import FunctionTableRow from '../function-table-row';
import NewFunctionForm from '../function-new-form';
import FunctionTableToolbar from '../function-table-toolbar';
import FunctionTableFiltersResult from '../function-table-filters-result';
import FunctionTableDeleteDialog from '../function-table-delete-dialog';
import { FunctionDeleteType, TFunctionTableFilters, TFunctionTableFilterValue } from '../types';

const TABLE_HEAD = [
  { id: 'functionName', label: 'Function Name' },
  { id: 'description', label: 'Description' },
  { id: 'ctime', label: 'Create Time' },
  { id: 'utime', label: 'Update time' },
  { id: 'operation', label: 'Operation', align: 'right' },
];

const defaultFilters: TFunctionTableFilters = {
  searchKeyword: '',
  selectedFunctionNames: [],
  startDate: null,
  endDate: null,
};

export default function FunctionsView() {
  const _handleDeleteRows = async (name?: string) => {
    const selectedRows = name ? [name] : table.selected;
    const newFunctions = dataFiltered.filter((row) => !selectedRows.includes(row.name));

    const { error } = await updateFunctions(projectID, newFunctions);
    if (!error) {
      dispatch(setFunctions({ projectID, functions: newFunctions }));
      confirm.onFalse();
      enqueueSnackbar('Delete function success!');
    }
  };
  const _handleEditRow = (name: string) => {
    router.push(paths.dashboard.project.functions(projectID).edit(name));
  };
  const _renderCustomBreadCrumbs = () => (
    <CustomBreadcrumbs
      heading="List"
      links={[
        {
          name: 'Dashboard',
          href: paths.dashboard.root,
        },
        {
          name: 'Functions',
          href: paths.dashboard.project.functions(projectID).list,
        },
        {
          name: 'List',
        },
      ]}
      action={<Button
        onClick={newFunctionControl.onTrue}
        variant="contained"
        startIcon={<Iconify icon="mingcute:add-line" />}
      >
        New Function
      </Button>}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />
  );
  const _renderNewFunctionDialog = () => (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={newFunctionControl.value}
      onClose={newFunctionControl.onFalse}
      transitionDuration={{
        enter: theme.transitions.duration.shortest,
        exit: theme.transitions.duration.shortest - 80,
      }}
    >
      <DialogTitle sx={{ minHeight: 76 }}>
        New Function
      </DialogTitle>

      <NewFunctionForm onCloseDialog={newFunctionControl.onFalse} />
    </Dialog>
  );
  const _handleFilters = (name: string, value: TFunctionTableFilterValue) => {
    table.onResetPage();
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const _applyFilter = ({
    inputData,
    filters,
    dateError,
  }: {
    inputData: TFunction[];
    filters: TFunctionTableFilters;
    dateError: boolean;
  }) => {
    const { selectedFunctionNames, startDate, endDate, searchKeyword } = filters;
  
    if (searchKeyword) {
      inputData = inputData.filter(
        (func) =>
          func.name.toLowerCase().indexOf(searchKeyword.toLowerCase()) !== -1 ||
          func.description.toLowerCase().indexOf(searchKeyword.toLowerCase()) !== -1
      );
    }
  
    if (selectedFunctionNames.length) {
      inputData = inputData.filter((func) => selectedFunctionNames.includes(func.name));
    }
  
    // if (!dateError) {
    //   if (startDate && endDate) {
    //     inputData = inputData.filter(
    //       (invoice) =>
    //         fTimestamp(invoice.createDate) >= fTimestamp(startDate) &&
    //         fTimestamp(invoice.createDate) <= fTimestamp(endDate)
    //     );
    //   }
    // }
  
    return inputData;
  }

  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const confirm = useBoolean();
  const newFunctionControl = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const settings = useSettingsContext();
  const { run: updateFunctions } = useServerAction(projectActions.updateFunctions)
  const urlSearchParams = useSearchParams();
  const table = useTable({ defaultOrderBy: 'createDate' });
  
  const projectID = Number(urlSearchParams.get('projectID'));
  const tableData = useSelector((state) => state.project[projectID]?.functions || []);
  const denseHeight = table.dense ? 56 : 76;

  const [filters, setFilters] = useState(defaultFilters);
  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;
  const dataFiltered = _applyFilter({ inputData: tableData, filters, dateError });
  const notFound = !dataFiltered.length;
  const canReset = !!filters.selectedFunctionNames.length || (!!filters.startDate && !!filters.endDate) || !!filters.searchKeyword;
  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
  ] as const;

  return <>
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {_renderCustomBreadCrumbs()}

      <Card>
        <Tabs
          value='all'
          onChange={(e, value) => _handleFilters('status', value)}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant='filled'
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>
        <FunctionTableToolbar
          filters={filters}
          onFilters={_handleFilters}
          dateError={dateError}
          functionNameOptions={tableData.map((row) => row.name)}
        />

        {canReset && (
          <FunctionTableFiltersResult
            filters={filters}
            onFilters={_handleFilters}
            onResetFilters={() => setFilters(defaultFilters)}
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) => table.onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.name)
            )}
            action={<Stack direction="row">
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            </Stack>} />
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) => table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.name)
                )} />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <FunctionTableRow
                      key={row.name}
                      row={row}
                      selected={table.selected.includes(row.name)}
                      table={table}
                      onSelectRow={() => table.onSelectRow(row.name)}
                      onEditRow={() => _handleEditRow(row.name)}
                      onDeleteRow={() => _handleDeleteRows(row.name)} />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
    <FunctionTableDeleteDialog
      confirm={confirm}
      onDeleteRow={_handleDeleteRows}
      table={table}
      type={FunctionDeleteType.DELETE_ALL}
    />
    {_renderNewFunctionDialog()}
  </>
}
