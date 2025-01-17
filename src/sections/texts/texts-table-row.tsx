import { format } from 'date-fns';
// @mui
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
// components
import Iconify from 'src/components/iconify';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
//
import { TableProps } from 'src/components/table';
import FunctionTableDeleteDialog from './texts-table-delete-dialog';
import { FunctionDeleteType, TTextTableHeads } from './types';

// ----------------------------------------------------------------------

type Props = {
  row: { id: string; [key: string]: string };
  selected: boolean;
  onSelectRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
  table: TableProps;
  tableHeads: TTextTableHeads;
};

export default function FunctionTableRow({
  row,
  selected,
  table,
  tableHeads,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  const { id, en, cn } = row;
  const confirm = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {
          tableHeads.filter(head => head.id !== 'operation').map((head) => <TableCell>{row[head.id]}</TableCell>)
        }
      
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton color="default" onClick={() => onEditRow()}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete" placement="top" arrow>
            <IconButton color="default" onClick={confirm.onTrue}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <FunctionTableDeleteDialog
        confirm={confirm}
        table={table}
        type={FunctionDeleteType.DELETE_SINGLE}
        functionName={id}
        onDeleteRow={onDeleteRow}
      />
    </>
  );
}


function stringToColor(str: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}
