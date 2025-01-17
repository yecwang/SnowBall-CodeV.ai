'use client'

import _ from 'lodash';
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
import TextsTableToolbar from '../texts-table-toolbar';
import TextsTableRow from '../texts-table-row';
import { TTextTableHeads } from '../types';

export default function TextsView() {
  const _handleDeleteRows = async (name?: string) => {
    // const selectedRows = name ? [name] : table.selected;
    // const newFunctions = dataFiltered.filter((row) => !selectedRows.includes(row.name));

    // const { error } = await updateFunctions(projectID, newFunctions);
    // if (!error) {
    //   dispatch(setFunctions({ projectID, functions: newFunctions }));
    //   confirm.onFalse();
    //   enqueueSnackbar('Delete function success!');
    // }
  };
  const _handleEditRow = (name: string) => {
    // router.push(paths.dashboard.project.functions(projectID).edit(name));
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
          name: 'Texts',
          href: paths.dashboard.project.texts(projectID),
        },
        {
          name: 'List',
        },
      ]}
      action={<Button
        onClick={newTextControl.onTrue}
        variant="contained"
        startIcon={<Iconify icon="mingcute:add-line" />}
      >
        New Text
      </Button>}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />
  );
  const _buildTableHeadAndData = () => {
    const tableHeads: TTextTableHeads = [{ id: 'id', label: 'Language ID' }]
    const data = [];
    for (const language of Object.keys(texts)) {
      const languageContent = texts[language];
      tableHeads.push({ id: language, label: languageContent.language });
      for (const key of Object.keys(languageContent)) {
        if (key === 'language') {
          continue;
        }

        data.push({ id: key, [language]: languageContent[key]});
      }
    }

    tableHeads.push({ id: 'operation', label: 'Operation', align: 'right' });

    const grouped = _.groupBy(data, 'id');
    const tableData = _.map(grouped, items => _.mergeWith({}, ...items));

    return { tableHeads, tableData };
  }
  const _applyFilter = (searchKeyword: string, inputData: any[]) => {
    if (searchKeyword) {
      inputData = inputData.filter(data => {
        const checkedKeys = Object.keys(data).filter(key => key !== 'id' && key !== 'operation');
        return checkedKeys.find(key => data[key].indexOf(searchKeyword) !== -1);
      })
    }
  
    return inputData;
  }

  const settings = useSettingsContext();
  const newTextControl = useBoolean();
  const confirm = useBoolean();
  const urlSearchParams = useSearchParams();
  const projectID = Number(urlSearchParams.get('projectID'));
  const [searchKeyword, setSearchKeyword] = useState('');
  const table = useTable({ defaultOrderBy: 'createDate' });
  const texts = useSelector((state) => state.project[projectID]?.texts || {});

  console.log('texts', texts);

  const { tableHeads, tableData } = _buildTableHeadAndData();
  const dataFiltered = _applyFilter(searchKeyword, tableData);
  const denseHeight = table.dense ? 56 : 76;
  const notFound = !dataFiltered.length;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {_renderCustomBreadCrumbs()}

      <Card>
        <TextsTableToolbar
          searchKeyword={searchKeyword}
          onSearchKeyword={(value: string) => setSearchKeyword(value)}
        />
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) => table.onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.id)
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
                headLabel={tableHeads}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) => table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )} />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <TextsTableRow
                      key={row.id}
                      tableHeads={tableHeads}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      table={table}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onEditRow={() => _handleEditRow(row.id)}
                      onDeleteRow={() => _handleDeleteRows(row.id)} />
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
  );
}
