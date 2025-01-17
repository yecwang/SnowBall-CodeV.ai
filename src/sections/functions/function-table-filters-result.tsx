// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';
// components
import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';
//
import { TFunctionTableFilters, TFunctionTableFilterValue } from './types';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: TFunctionTableFilters;
  onFilters: (name: string, value: TFunctionTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function FunctionTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const _handleRemoveSelectedFunctionNames = (inputValue: string) => {
    const newValue = filters.selectedFunctionNames.filter((item) => item !== inputValue);
    onFilters('selectedFunctionNames', newValue);
  };
  const _handleRemoveDate = () => {
    onFilters('startDate', null);
    onFilters('endDate', null);
  };

  const shortLabel = shortDateLabel(filters.startDate, filters.endDate);

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.selectedFunctionNames.length && (
          <Block label="Selected function names:">
            {filters.selectedFunctionNames.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => _handleRemoveSelectedFunctionNames(item)}
              />
            ))}
          </Block>
        )}

        {filters.startDate && filters.endDate && (
          <Block label="Date:">
            <Chip size="small" label={shortLabel} onDelete={_handleRemoveDate} />
          </Block>
        )}

        {filters.searchKeyword && (
          <Block label="Keyword:">
            <Chip size="small" label={filters.searchKeyword} onDelete={() => onFilters('searchKeyword', null)} />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
