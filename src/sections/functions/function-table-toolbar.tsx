import { useCallback } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// types
// components
import Iconify from 'src/components/iconify';
//
import { TFunctionTableFilters, TFunctionTableFilterValue } from './types';

// ----------------------------------------------------------------------

type Props = {
  filters: TFunctionTableFilters;
  onFilters: (name: string, value: TFunctionTableFilterValue) => void;
  dateError: boolean;
  functionNameOptions: string[];
};
export default function FunctionTableToolbar({ filters, onFilters, dateError, functionNameOptions }: Props) {
  const _handleFilterSearchKeyword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('searchKeyword', event.target.value);
    },
    [onFilters]
  );
  const _handleFilterFunctionNames = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'selectedFunctionNames',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );
  const _handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );
  const _handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 180 },
        }}
      >
        <InputLabel>Function Names</InputLabel>

        <Select
          multiple
          value={filters.selectedFunctionNames}
          onChange={_handleFilterFunctionNames}
          input={<OutlinedInput label="Function Names" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          sx={{ textTransform: 'capitalize' }}
        >
          {functionNameOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox disableRipple size="small" checked={filters.selectedFunctionNames.includes(option)} />
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DatePicker
        label="Start date"
        value={filters.startDate}
        onChange={_handleFilterStartDate}
        slotProps={{ textField: { fullWidth: true } }}
        sx={{
          maxWidth: { md: 180 },
        }}
      />

      <DatePicker
        label="End date"
        value={filters.endDate}
        onChange={_handleFilterEndDate}
        slotProps={{
          textField: {
            fullWidth: true,
            error: dateError,
          },
        }}
        sx={{
          maxWidth: { md: 180 },
        }}
      />

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.searchKeyword}
          onChange={_handleFilterSearchKeyword}
          placeholder="Search function name or description..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Stack>
  );
}
