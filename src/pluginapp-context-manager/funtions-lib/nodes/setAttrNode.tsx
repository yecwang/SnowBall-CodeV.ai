import React, { memo, ChangeEventHandler, useState, useEffect } from 'react';

import WebIcon from '@mui/icons-material/Web';
import BaseNode from '../basic/BasicNode';
import DynamicEditView, { SchemaConfig } from '../basic/BasicEditView';
import BasicCodeGen, { CodeGenProps } from '../basic/BasicCodeGen';

const schemaConfig: SchemaConfig[] = [
  {
    filed: 'componentID',
    type: 'string',
    required: true,
    description: 'Component ID',
  },
  {
    filed: 'attrName',
    type: 'string',
    required: true,
    description: 'Attribute Name',
  },
  {
    filed: 'isVariable',
    type: 'boolean',
    required: true,
    description: 'is variable',
  },
  {
    filed: 'variableID',
    type: 'string',
    required: true,
    description: 'is variable',
    relationField: 'variables',
    when: {
      field: 'isVariable',
      value: true,
    },
  },
  {
    filed: 'inputValue',
    type: 'string',
    required: true,
    description: 'variable type',
    when: {
      field: 'isVariable',
      value: false,
    },
  },
];

const nodeConfig = {
  name: 'setElementAttributeByID',
  type: 'setElementAttributeByID',
  description: 'Set Element Attribute By ID',
};

interface SetAttributeNodeData {
  label: string;
  description?: string;
}

interface HttpNodeProps {
  id: string;
  data: SetAttributeNodeData;
  isConnectable: boolean;
}

const Node = ({ id, data, isConnectable }: HttpNodeProps) => (
  <BaseNode
    id={id}
    isConnectable={isConnectable}
    content={`API: ${nodeConfig.description}`}
    icon={<WebIcon sx={{ marginRight: 1 }} />}
  />
);

interface EditViewProps {
  node: any;
  setNode: (node: any) => void;
}

const EditView: React.FC<EditViewProps> = ({ node = {}, setNode }) => (
  <DynamicEditView
    nodeConfig={nodeConfig}
    node={node}
    setNode={setNode}
    schemasConfig={schemaConfig}
  />
);

const codeGen = (node: any) => {
  const template = `
    function setElementAttributeByID(componentID, attrName, inputValue) {
      const element = document.getElementById(componentID);
      element.setAttribute(attrName, inputValue)
    }
    setElementAttributeByID(__COMPONENTID__, __ATTRNAME__, __INPUTVALUE__);
  `
  const templateConfig : CodeGenProps["templateConfig"]= {
    __COMPONENTID__: {
      value: node.data.componentID,
      relation: 'NodeData',
      type: 'stringLiteral'
    },
    __ATTRNAME__: {
      value: node.data.attrName,
      relation: 'NodeData',
      type: 'stringLiteral'
    },
    __INPUTVALUE__: {
      value: node.data.isVariable ? `getVariableValue(${node.data.variableID})` : node.data.inputValue,
      relation: 'NodeData',
      type: node.data.isVariable ? 'identifier' : 'stringLiteral'
    }
  }
  return BasicCodeGen({node, codeTemplate: template, templateConfig});
};

Node.displayName = 'setElementAttributeByID';
Node.icon = WebIcon;
Node.type = 'SYSTEM';
export default memo(Node);
export { EditView, codeGen };
