import React, { memo } from 'react';
import HttpIcon from '@mui/icons-material/Http';
import BaseNode from '../../basic/BasicNode';
import DynamicEditView, { SchemaConfig } from '../../basic/BasicEditView';
import BasicCodeGen, { CodeGenProps } from '../../basic/BasicCodeGen';
import apiConfigs from './apiConfig';

interface HTTPNodeData {
  label: string;
  description?: string;
}

interface HttpNodeProps {
  id: string;
  data: HTTPNodeData;
  isConnectable: boolean;
}

const Nodes = () => {
  const _convertApiConfigToNodeConfig = (apiConfig: any) => {
    const nodeConfig = {
      name: apiConfig.name,
      type: apiConfig.name,
      description: apiConfig.description,
    };
    return nodeConfig;
  };

  const _convertSchemaConfig = (apiConfig: any) => {
    const schemaConfig: SchemaConfig[] = [];
    // eslint-disable-next-line guard-for-in
    for (const requestPath in apiConfig.request) {
      const parameters = apiConfig.request[requestPath];
      // eslint-disable-next-line guard-for-in
      for (const field in parameters) {
        schemaConfig.push({
          filed: field,
          type: parameters[field].type,
          description: parameters[field].description,
          required: parameters[field].required,
          relationField: 'variables',
        });
      }
    }
    schemaConfig.push({
      filed: 'resVarName',
      type: 'string',
      description: 'Response variable name',
      required: true,
    });
    return schemaConfig;
  };
  const Nodes = apiConfigs.map((apiConfig) => {
    const nodeConfig = _convertApiConfigToNodeConfig(apiConfig);
    const schemaConfig = _convertSchemaConfig(apiConfig);
    const Node = ({ id, data, isConnectable }: HttpNodeProps) => (
      <BaseNode
        id={id}
        isConnectable={isConnectable}
        content={`API: ${nodeConfig.description}`}
        icon={<HttpIcon sx={{ marginRight: 1 }} />}
      />
    );
    const EditView = ({ node, setNode }: any) => (
      <DynamicEditView
        node={node}
        setNode={setNode}
        nodeConfig={nodeConfig}
        schemasConfig={schemaConfig}
        icon={<HttpIcon sx={{ marginRight: 1 }} />}
      />
    );
    const codeGen = (node: any) => {
      const params = [];
      // eslint-disable-next-line guard-for-in
      for (const requestPath in apiConfig.request) {
        // @ts-ignore
        const parameters = apiConfig.request[requestPath];
        // eslint-disable-next-line guard-for-in
        for (const field in parameters) {
          params.push(field);
        }
      }
      // TODO: 请求的库 只require一次 这个看怎么处理 还是最后统一生成的时候 format 处理？ 
      let codeTemplate = `
      import axios from 'axios';
      const axiosInstance = axios.create({
        baseURL: 'https://sisouul.com/',
        timeout: 5000,
      });

      axiosInstance.interceptors.request.use(config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers['x-access-token'] = token;
        }
        return config;
      }, error => {
        return Promise.reject(error);
      });
      `
      if (apiConfig.method === 'POST' || apiConfig.method === 'PUT') {
        codeTemplate += `
        const ${nodeConfig.name} = async (params) => {
          const response = await axiosInstance.${apiConfig.method}('${apiConfig.url}', params);
          return response.data;
        };
        `
      }
      if (apiConfig.method === 'GET') {
        codeTemplate += `
        const ${nodeConfig.name} = async (params) => {
          const response = await axiosInstance.${apiConfig.method}('${apiConfig.url}', { params });
          return response.data;
        };
        `
      }
      codeTemplate += ` const __RES_VAR__ = await ${nodeConfig.name}({${params.map(_=> `${_}: __${_.toUpperCase()}__, `).join('')}});`
      const templateConfig: CodeGenProps["templateConfig"] = {
        __RES_VAR__: {
          value: 'resVarName',
          relation: 'NodeData',
          type: 'identifier',
        },
      }
      for (const field of params) {
        templateConfig[`__${field.toUpperCase()}__`] = {
          value: field,
          relation: 'NodeData',
          type: 'identifier',
        }
      }
      return BasicCodeGen({
        node,
        codeTemplate,
        templateConfig,
      });
    };
    return { type: nodeConfig.name, node: memo(Node), editView: EditView, codeGen };
  });
  return Nodes;
};

export default Nodes;
