import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, Grid, SelectChangeEvent,
  FormControlLabel, Checkbox, TextField } from '@mui/material';
import * as t from '@babel/types';
import { useParams } from 'src/routes/hook';
import { useSelector } from 'src/redux/store';
import { TPageConfig } from 'src/pluginapp-context-manager/types';

import FunctionsIcon from '@mui/icons-material/Functions';

import ToolBar from '../utils/ToolBar';

interface PageJumpNodeData {
  label: string;
  path?: string;
  name?: string;
  url?: string;
  newWindow?: boolean;
  isExternalLink?: boolean;
}
interface PageJumpNodeProps {
  id: string;
  data: PageJumpNodeData;
  isConnectable: boolean;
}
const Node = ({ id, data, isConnectable }: PageJumpNodeProps) => (
  <>
    <ToolBar id={id} />
    <Box sx={{ padding: 1, border: '1px solid #ddd', borderRadius: 1, backgroundColor: '#fafafa' }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Box sx={{ margin: 0, padding: 0, display: 'flex', alignItems: 'center' }}>
        {/* 在一行显示 */}
        <FunctionsIcon sx={{ marginRight: 1 }} />
        <Typography sx={{ borderLeft: '1px solid #ddd', paddingLeft: 1 }}>
          {`Page Router: ${data.name || data.url || ''}`}
        </Typography>
      </Box>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Box>
  </>
);

interface EditViewProps {
  node: any;
  setNode: (node: any) => void;
}
interface Page {
  name: string;
  path: string;
}

const EditView: React.FC<EditViewProps> = ({ node, setNode }) => {
  const setPage = (evt: SelectChangeEvent) => {
    const name = pages.find(page => page.path === evt.target.value)?.name;
    setNode({ ...node, data: { ...node.data, path: evt.target.value, name } });
  };
  const setUrl = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setNode({ ...node, data: { ...node.data, url: evt.target.value } });
  };
  const setNodeOpenType = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setNode({ ...node, data: { ...node.data, newWindow: evt.target.checked } });
    setNewWindow(evt.target.checked);
  };
  const setNodeExternalLink = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setNode({ ...node, data: { ...node.data, isExternalLink: evt.target.checked } });
    setIsExternalLink(evt.target.checked);
  };
  const [pages, setPages] = useState<Page[]>([]);
  const [newWindow, setNewWindow] = useState(node?.data?.newWindow || false);
  const [isExternalLink, setIsExternalLink] = useState(node?.data?.isExternalLink || false);
  const project = useSelector((state) => state.project);
  const params = useParams();
  const projectID = Number(params.projectID);

  useEffect(() => {
    const projectPagesObj = project[projectID]?.setting?.pages || [];
    const projectPages: Page[] = [];
    // eslint-disable-next-line guard-for-in
    for (const key in projectPagesObj) {
      projectPages.push({ name: projectPagesObj[key].name, path: projectPagesObj[key].path });
    }
    if (projectPages.length) {
      setPages(projectPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box
      hidden={!(node?.type === 'pageRouter')}
      sx={{
        marginTop: 2,
        marginBottom: 2,
        marginLeft: 3,
        marginRight: 3,
        padding: 2,
        border: '1px solid #ddd',
        borderRadius: 1,
        backgroundColor: '#fafafa',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <FunctionsIcon sx={{ marginRight: 1 }} />
        Page Router
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={newWindow} onChange={setNodeOpenType}
            name="isNewWindow"
            color="primary"
            />}
            label="open in new window"
            labelPlacement="start"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={isExternalLink} onChange={setNodeExternalLink}
            name="isExternalLink"
            color="primary"
            />}
            label="is external link"
            labelPlacement="start"
          />
        </Grid>
        {isExternalLink && (
          <Grid item xs={12}>
              <TextField
              value={node?.data?.url || ''}
              onChange={setUrl}
              label="URL"
            />
          </Grid>
        )}
        {!isExternalLink && (
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
              <InputLabel>Page</InputLabel>
              <Select
                value={node?.data?.path || ''}
                onChange={setPage}
                label="Page"
              >
                {pages.map((page: Page) => (
                  <MenuItem key={page.path} value={page.path}>
                    {page.name}
                  </MenuItem>
                ))}
              </Select>
          </FormControl>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

const codeGen = (node: PageJumpNodeProps) => {
  const nodeData = node.data;
  if (!nodeData || !(nodeData.path || nodeData.url)) {
    return null;
  }

  if (nodeData.newWindow) {
    const windowOpenCall = t.expressionStatement(
      t.callExpression(
        t.memberExpression(
          t.identifier('window'),
          t.identifier('open')
        ),
        // @ts-ignore
        [t.stringLiteral(nodeData.isExternalLink ? nodeData.url : nodeData.path)]
      )
    );
    return windowOpenCall;
  }
  const windowLocationAssignment = t.expressionStatement(
    t.assignmentExpression(
      '=',
      t.memberExpression(
        t.memberExpression(
          t.identifier('window'),
          t.identifier('location')
        ),
        t.identifier('href')
      ),
      // @ts-ignore
      t.stringLiteral(nodeData.isExternalLink ? nodeData.url : nodeData.path)
    )
  );
  return windowLocationAssignment;
};

Node.displayName = 'pageRouter';
Node.icon = FunctionsIcon;
Node.type = 'SYSTEM';
export default memo(Node);
export { EditView, codeGen };

