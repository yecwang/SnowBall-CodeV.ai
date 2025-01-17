import { useEffect, useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
// hooks
import { ReturnType } from 'src/hooks/use-boolean';
import { useSelector } from 'src/redux/store';
import { useSearchParams } from 'src/routes/hook';
//
import { TFunctionReferences } from 'src/pluginapp-context-manager/types';
import { checkReferences } from 'src/pluginapp-context-manager/parser/function-parser';
import { TableProps } from 'src/components/table';
import { FunctionDeleteType } from './types';

// ----------------------------------------------------------------------

type TProps = {
  confirm: ReturnType;
  functionName?: string
  type: FunctionDeleteType;
  onDeleteRow: VoidFunction;
  table: TableProps;
};
export default function FunctionTableDeleteDialog({ type, table, functionName, onDeleteRow, confirm }: TProps) {
  const _renderDeleteTip = () => {
    if (functionReferenceChecking) {
      return "Checking the function reference...";
    }
    
    if (!Object.keys(functionReferences).length) {
      if (type === FunctionDeleteType.DELETE_ALL) {
        return <>Are you sure want to delete <strong> {table.selected.length} </strong> items?</>;
      }

      return "Are you sure want to delete?";
    }

    return <Grid container sx={{ maxHeight: 400 }}>
      {
        Object.keys(functionReferences).map(functionName => (
          <Grid sx={{ py: 0.5 }}>
            <Typography variant="subtitle2">The function [<b>{functionName}</b>] has the following references:</Typography>
            <List>
              {
                functionReferences[functionName].map(({ callSource, paths }, index) => (
                  <ListItem key={index}>
                    <Typography variant="body2">
                      at {callSource} ({paths.join(' > ')})
                    </Typography>
                  </ListItem>
                ))
              }
            </List>
          </Grid>
        ))
      }

    </Grid>
  }

  const urlSearchParams = useSearchParams();
  const projectID = Number(urlSearchParams.get('projectID'));
  const project = useSelector((state) => state.project[projectID]);
  const [functionReferences, setFunctionReferences] = useState<TFunctionReferences>({});
  const [functionReferenceChecking, setFunctionReferenceChecking] = useState(false);

  useEffect(() => {
    if (!confirm.value) {
      return;
    }

    setFunctionReferenceChecking(true);
    const selectedFunctionNames = type === FunctionDeleteType.DELETE_SINGLE ? [functionName as string] : table.selected;
    const results = checkReferences(project, selectedFunctionNames);
    setFunctionReferenceChecking(false);
    setFunctionReferences(results);
  }, [project, confirm.value, table.selected, type, functionName])

  return <ConfirmDialog
    key={functionName}
    open={confirm.value}
    onClose={confirm.onFalse}
    title="Delete"
    content={_renderDeleteTip()}
    action={
      <Button disabled={functionReferenceChecking} variant="contained" color="error" onClick={onDeleteRow}>
        Delete
      </Button>
    }
  />;
}