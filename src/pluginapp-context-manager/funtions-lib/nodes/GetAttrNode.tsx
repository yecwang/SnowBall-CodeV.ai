"use client";

import React, { memo, ChangeEventHandler, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  TextField,
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  SelectChangeEvent,
  Checkbox,
  FormControl,
  InputLabel,
} from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';
import * as t from '@babel/types';
import { SharedContext, Variable } from 'src/pluginapp-context-manager/funtions-lib/utils/VariablesProvider';

import ToolBar from '../utils/ToolBar';

interface GetAttrNodeProps {
  id: string;
  data: {
    label: string;
    attrName?: string;
    componentID?: string;
    variableID?: string;
    variableName?: string;
    attrVariableType?: 'exists' | 'new';
    variableType?: 'let' | 'const';
  };
  isConnectable: boolean;
}

const Node = ({ id, data, isConnectable }: GetAttrNodeProps) => (
  <>
    <ToolBar id={id} />
    <Box sx={{ padding: 1, border: '1px solid #ddd', borderRadius: 1, backgroundColor: '#fafafa' }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Box sx={{ margin: 0, padding: 0, display: 'flex', alignItems: 'center' }}>
        {/* 在一行显示 */}
        <FunctionsIcon sx={{ marginRight: 1 }} />
        <Typography sx={{ borderLeft: '1px solid #ddd', paddingLeft: 1 }}>
          {data?.componentID
            ? `Get Attribute: ${data.attrName} from ${data.componentID}`
            : 'Get Element Attribute By ID'}
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

const EditView: React.FC<EditViewProps> = ({ node = {}, setNode }) => {
  const setAttrName: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setNode({ ...node, data: { ...node.data, attrName: evt.target.value } });
  };
  const handleAttrTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode({
      ...node,
      data: { ...node.data, attrVariableType: event.target.checked ? 'new' : 'exists' },
    });
    setAttrType(event.target.checked ? 'new' : 'exists');
  };
  const setVariableID = (event: SelectChangeEvent) => {
    setNode({ ...node, data: { ...node.data, variableName: event.target.value, variableID: currentVariableID } });
  };
  const setTextVariableID = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode({ ...node, data: { ...node.data, variableName: event.target.value, variableID: currentVariableID  } });
    if (variableType === 'let') {
      const isExists = variables.some((variable: Variable) => variable.id === currentVariableID);
      if (!isExists) {
        setVariables([
          ...variables,
          { id: currentVariableID, name: event.target.value, type: 'string' },
        ]);
      } else {
        setVariables(variables.map((variable: Variable) => {
          if (variable.id === currentVariableID) {
            return { ...variable, name: event.target.value, id: currentVariableID };
          }
          return variable;
        }));
      }
    }
  };
  const handleVariableTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode({ ...node, data: { ...node.data, variableType: event.target.value } });
    setVariableType(event.target.value as 'let' | 'const');
  };
  const setComponentID = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode({ ...node, data: { ...node.data, componentID: event.target.value } });
  };
  const [attrType, setAttrType] = useState<'exists' | 'new'>( node?.data?.attrVariableType || 'exists');
  const [variableType, setVariableType] = useState<'let' | 'const'>( node?.data?.variableType || 'let');
  const [currentVariableID, setCurrentVariableID] = useState<string>(node?.data?.variableID);
  // const [currentVariableName, setCurrentVariableName] = useState<string>(node?.data?.variableID || '');
  const context = React.useContext(SharedContext);
  console.log(context)

  useEffect(() => {
    setAttrType(node?.data?.attrVariableType || 'exists');
  }, [node?.data?.attrVariableType]);

  useEffect(() => {
    setCurrentVariableID(node?.id ? `GET_ATTR_${node.id.replaceAll('-', '')}` : '');
  }, [node?.id]);
  
  if (!context?.setVariables) return <> context not init</>
  const variables = context?.variables || [];
  const setVariables = context?.setVariables
  return (
    <Box
      hidden={!(node?.type === 'getElementAttributeByID')}
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
        Get Element Attribute By ID
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={attrType === 'new'}
                onChange={handleAttrTypeChange}
                name="isNewVariable"
                color="primary"
              />
            }
            label="Is New Variable"
          />
        </Grid>

        {attrType === 'exists' && (
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Variable ID</InputLabel>
              <Select
                value={node?.data?.variableName || ''}
                onChange={setVariableID}
                label="Variable ID"
              >
                {variables.map((variable: Variable) => (
                  <MenuItem key={variable.id} value={variable.id}>
                    {variable.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {attrType === 'new' && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1">Variable Type</Typography>
                <RadioGroup
                  row
                  aria-label="variableType"
                  name="variableType"
                  value={variableType}
                  onChange={handleVariableTypeChange}
                >
                  <FormControlLabel value="let" control={<Radio />} label="let" />
                  <FormControlLabel value="const" control={<Radio />} label="const" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="New Variable ID"
                value={node?.data?.variableName || ''}
                onChange={setTextVariableID}
                variant="outlined"
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Component ID"
            value={node?.data?.componentID || ''}
            onChange={setComponentID}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Attribute Name"
            value={node?.data?.attrName || ''}
            onChange={setAttrName}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const codeGen = (node: any) => {
  const nodeData = node.data;
  if (!nodeData || !nodeData.variableID || !nodeData.attrName ) {
    return null;
  }
  const idParam = t.identifier('id');
  idParam.typeAnnotation = t.tsTypeAnnotation(t.tsStringKeyword());

  const attributeNameParam = t.identifier('attributeName');
  attributeNameParam.typeAnnotation = t.tsTypeAnnotation(t.tsStringKeyword());

  // 创建函数返回类型注解
  const returnTypeAnnotation = t.tsTypeAnnotation(t.tsStringKeyword());

  const returnStatement = t.returnStatement(
    t.memberExpression(
      t.callExpression(
        t.memberExpression(t.identifier('document'), t.identifier('getElementById')),
        [t.identifier('id')]
      ),
      t.identifier('attributeName'),
      true
    )
  );

  const functionDeclaration = t.functionDeclaration(
    t.identifier('getElementAttributeByID'),
    [idParam, attributeNameParam],
    t.blockStatement([returnStatement])
  );
  functionDeclaration.returnType = returnTypeAnnotation;

  const functionCall = t.callExpression(t.identifier('getElementAttributeByID'), [
    t.stringLiteral(nodeData.componentID),
    t.stringLiteral(nodeData.attrName),
  ]);
  if (nodeData.attrVariableType === 'exists') {
    const assignmentExpression = t.assignmentExpression(
      '=',
      t.identifier(nodeData.variableID),
      functionCall
    );

    return [functionDeclaration, t.expressionStatement(assignmentExpression)];
  }
  const varIdentifier = t.identifier(nodeData.variableID);
  varIdentifier.typeAnnotation = returnTypeAnnotation;
  const varDeclaration = t.variableDeclaration('let', [
    t.variableDeclarator(varIdentifier, functionCall),
  ]);
  return [functionDeclaration, varDeclaration];
};

Node.displayName = 'getElementAttributeByID';
Node.icon = FunctionsIcon;
Node.type = 'SYSTEM';
export default memo(Node);
export { EditView, codeGen };
