import React, { memo } from 'react';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, Grid, SelectChangeEvent,
  FormControlLabel, Checkbox, TextField } from '@mui/material';

import * as yup from 'yup';
  // import PageIcon from '@mui/icons-material/Pageview';
import BaseNode from '../basic/BasicNode';
import DynamicEditView from '../basic/BasicEditView';

interface PageJumpNodeData {
  label: string;
  description?: string;

}
interface HttpNodeProps {
  id: string;
  data: PageJumpNodeData;
  isConnectable: boolean;
}
const Node = ({ id, data, isConnectable }: HttpNodeProps) => (
  <BaseNode
    id={id}
    isConnectable={isConnectable}
    content={`Send http: ${data.description || ''}`}
    // icon={<PageIcon sx={{ marginRight: 1 }} />}
    // additionalStyles={{ backgroundColor: '#e0f7fa' }} // 自定义背景颜色
  />
);

interface EditViewProps {
  node: any;
  setNode: (node: any) => void;
}
const EditView: React.FC<EditViewProps> = ({ node, setNode }) => {
  const nodeConfig = {
    type: 'HTTP',
    name: 'http request',
  }
  const schema = {
    type: 'object',
    properties: {
      input: {
        type: 'string',
        title: '输入框',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          style: {
            width: 240,
          },
        },
      },
    },
  }
  return (
    <DynamicEditView
      node={node}
      setNode={setNode}
      nodeConfig={nodeConfig}
      schema={schema}
    />
  );
}
const codeGen = (node: any) => {
  console.log('node', node)
  return {
    type: 'http',
    data: node.data,
  };
}

Node.displayName = 'pageRouter';
// Node.icon = FunctionsIcon;
Node.type = 'SYSTEM';
export default memo(Node);
export { EditView, codeGen };
