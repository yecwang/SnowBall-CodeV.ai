"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Button, Grid } from '@mui/material';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  ReactFlowProvider,
  MiniMap,
  useEdgesState,
  useNodesState,
  useReactFlow,
  MarkerType,
  EdgeTypes,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import * as babelTypes from '@babel/types';
import generate from '@babel/generator';
import Editor from '@monaco-editor/react';
import Nodes from 'src/pluginapp-context-manager/funtions-lib/Nodes';
import useServerAction from 'src/hooks/use-server-action';
import * as projectActions from 'src/services/server-actions/project/client';
import { useParams } from 'src/routes/hook';
import { useSelector } from 'src/redux/store';
import { setFunctions as setProjectFunctions } from 'src/redux/slices/project';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

import { TFunction } from 'src/pluginapp-context-manager/types';

import VariablesProvider from 'src/pluginapp-context-manager/funtions-lib/utils/VariablesProvider';
import Sidebar from './view/Sidebar';
import CustomEdge from './view/CustomEdge';
import ConnectionLine from './view/ConnectionLine';

const initialElements: any[] = [
  { id: '0', type: 'start', data: {}, position: { x: 0, y: 150 } },
  { id: '1', type: 'end', data: {}, position: { x: 0, y: 150 } },
];


const nodeTypes = Nodes.reduce((acc, { type, node }) => {
  // @ts-ignore
  acc[type] = node;
  return acc;
}, {});

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

const _handlerASTCode = Nodes.reduce((acc, { type, codeGen }) => {
  // @ts-ignore
  acc[type] = codeGen;
  return acc;
}, {});

const getId = () => {
  // @ts-ignore
  const cryptoObj = window.crypto || window.msCrypto; // 兼容IE11
  const bytes = new Uint8Array(16);
  cryptoObj.getRandomValues(bytes);

  // eslint-disable-next-line no-bitwise
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // 版本 4
  // eslint-disable-next-line no-bitwise
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // 变体

  // @ts-ignore
  const uuid = [...bytes]
    .map((byte, index) => {
      // 每个字节转换为两位十六进制数
      const hex = byte.toString(16).padStart(2, '0');
      // 插入UUID的分隔符（-）
      return [4, 6, 8, 10].includes(index) ? `-${hex}` : hex;
    })
    .join('');

  return uuid;
};

interface IfInfo {
  ast: any;
  type: string;
  ifRoute?: any[];
  elseRoute?: any[];
}

const DnDFlow = ({functionName, type, setOpen}: IFunctionFlowProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialElements);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const { screenToFlowPosition } = useReactFlow();
  const [functions, setFunctions] = useState<TFunction[]>([]);

  const { run: updateFunctions } = useServerAction(projectActions.updateFunctions);
  const dispatch = useDispatch();

  const project = useSelector((state) => state.project);
  const params = useParams();
  const projectID = Number(params.projectID);

  const generateAST = () => {
    // @ts-ignore
    const _convertToDGA = (nodes, edges) => {
      // @ts-ignore
      const _addDGANode = (currentNode, DAGMap, needSortArr, index = 0) => {
        const nextNodeIds = currentNode.children;
        DAGMap[currentNode.id] = DAGMap[currentNode.id] || {};
        DAGMap[currentNode.id].children = DAGMap[currentNode.id].children || [];
        DAGMap[currentNode.id].index = index;
        for (const nextNodeId of nextNodeIds) {
          // @ts-ignore
          const _isIN = needSortArr.find((node) => node.id === nextNodeId);
          if (!_isIN) {
            continue;
          }
          DAGMap[currentNode.id].children.push(nextNodeId);
          // @ts-ignore
          const nextNode = needSortArr.find((node) => node.id === nextNodeId);
          // eslint-disable-next-line no-plusplus
          index++;
          _addDGANode(nextNode, DAGMap, needSortArr, index);
        }
      };
      // @ts-ignore
      const existsStartNode = nodes.find((node) => node.type === 'start');
      // @ts-ignore
      const existsEndNode = nodes.find((node) => node.type === 'end');
      if (!existsStartNode || !existsEndNode) {
        return [];
      }
      const graphMap = {};
      for (const edge of edges) {
        // @ts-ignore
        graphMap[edge.source] = graphMap[edge.source] || [];
        // @ts-ignore
        graphMap[edge.source].push(edge.target);
      }
      // @ts-ignore
      const endNode = nodes.find((node) => node.type === 'end');
      // @ts-ignore
      graphMap[endNode.id] = [];

      const DAGArr = [];
      // @ts-ignore
      // eslint-disable-next-line guard-for-in
      for (const key in graphMap) {
        const node = nodes.find((node: any) => node.id === key);
        if (!node) {
          continue;
        }
        DAGArr.push({
          id: key,
          type: node.type,
          // @ts-ignore
          children: graphMap[key],
          index: DAGArr.length + 1,
        });
      }
      const existsStartNodeEdge = DAGArr.find((node) => node.type === 'start');
      const existsEndNodeEdge = DAGArr.find((node) => node.type === 'end');
      if (!existsStartNodeEdge || !existsEndNodeEdge) {
        return [];
      }
      // @ts-ignore
      DAGArr.find((node: any) => node.type === 'start').index = 0;
      DAGArr.sort((a, b) => a.index - b.index);
      const DAGMap: Record<string, any> = {};
      const startNode = DAGArr[0];

      _addDGANode(startNode, DAGMap, DAGArr);
      return Object.keys(DAGMap)
        .map((key) => ({ id: key, ...DAGMap[key] }))
        .sort((a, b) => a.index - b.index);
    };
    const _getFlow = (currentID: string, nodesDGA: any, paths: string[]) => {
      const current = nodesDGA.find((node: any) => node.id === currentID);
      if (!current) {
        return paths;
      }
      paths.push(currentID);
      if (current.children.length === 0) {
        return paths;
      }
      for (const child of current.children) {
        _getFlow(child, nodesDGA, paths);
      }
      return paths;
    };

    const nodesDGA = _convertToDGA(nodes, edges);
    const scopeStack = [];
    let body = [];
    const imports = [];
    const definedFunctions = new Set();

    for (const nodeMap of nodesDGA) {
      const node = nodes.find((node: any) => node.id === nodeMap.id);
      // @ts-ignore
      if (!_handlerASTCode[node.type] || node.skip) {
        continue;
      }
      // @ts-ignore
      const nodeAst = _handlerASTCode[node.type](node, nodesDGA, nodes);
      // TODO: 需要处理后续的 得统一为 数组， if的 也需要处理这块看后面是不是使用scope包裹起来会更好 这样的话就可以统一的处理了 而不是在代码层面上处理 对用户也更友好
      if (!nodeAst) {
        console.warn(`Warning: nodeAst is undefined for node type ${node.type} with id ${node.id}`);
        continue;
      }
      // TODO: 这里的代码是需要优化的
      if (Array.isArray(nodeAst)) {
        const nodeAstArr = _.cloneDeep(nodeAst);
        nodeAstArr.forEach((currentAst, index) => {
          if (currentAst.type === 'ImportDeclaration') {
            imports.push(currentAst);
            nodeAst.splice(index, 1);
          }
          if (currentAst.type === 'FunctionDeclaration') {
            const functionName = currentAst.id.name;
            if (definedFunctions.has(functionName)) {
              nodeAst.splice(index, 1);
            } else {
              definedFunctions.add(functionName);
            }
          }
        })

      } else {
        if (nodeAst.type === 'ImportDeclaration') {
          imports.push(nodeAst);
          continue;
        }
        if (nodeAst.type === 'FunctionDeclaration') {
          const functionName = nodeAst.id.name;
          if (definedFunctions.has(functionName)) {
            continue; // 跳过已定义的函数
          } else {
            definedFunctions.add(functionName);
          }
        }
      }
      if (scopeStack.length) {
        const lastStatement = scopeStack[scopeStack.length - 1];
        if (lastStatement.type === 'if') {
          if (lastStatement.ifRoute && lastStatement.ifRoute.includes(nodeMap.id)) {
            if (Array.isArray(nodeAst)) {
              lastStatement.ast.consequent.body.push(...nodeAst);
            } else {
              lastStatement.ast.consequent.body.push(nodeAst);
            }
            lastStatement.ifRoute = lastStatement.ifRoute.filter((_) => _ !== nodeMap.id);
          }
          if (lastStatement.elseRoute && lastStatement.elseRoute.includes(nodeMap.id)) {
            lastStatement.ast.alternate = lastStatement.ast.alternate || {
              type: 'BlockStatement',
              body: [],
            };
            if (Array.isArray(nodeAst)) {
              lastStatement.ast.alternate.body.push(...nodeAst);
            } else {
              lastStatement.ast.alternate.body.push(nodeAst);
            }
            lastStatement.elseRoute = lastStatement.elseRoute.filter((_) => _ !== nodeMap.id);
          }
          if (
            (!lastStatement.ifRoute || !lastStatement.ifRoute.length) &&
            (!lastStatement.elseRoute || !lastStatement.elseRoute.length)
          ) {
            scopeStack.pop();
          }
        }
      } else if (Array.isArray(nodeAst)) {
        body.push(...nodeAst);
      } else {
        body.push(nodeAst);
      }

      if (node.type === 'if') {
        const ifInfo: IfInfo = { ast: nodeAst, type: 'if' };
        if (nodeMap.children.length > 0) {
          const ifEdges = edges.filter(
            (edge: any) => edge.source === node.id && edge.data && edge.data.if
          );
          const ifIDsIds = ifEdges.map((edge: any) => edge.target);
          const ifNode = nodes.find((node: any) => ifIDsIds && ifIDsIds.includes(node.id)); // TODO: 找到第一个

          const elseEdges = edges.filter(
            (edge: any) => edge.source === node.id && edge.data && !edge.data.if
          );
          const elseIds = elseEdges.map((edge: any) => edge.target);
          const elseNode = nodes.find((node) => elseIds && elseIds.includes(node.id));
          if (ifNode && !elseNode) {
            const ifBranchAllRoute = _getFlow(ifNode.id, nodesDGA, []);
            ifInfo.ifRoute = ifBranchAllRoute;
          }

          if (ifNode && elseNode) {
            const ifBranchAllRoute = _getFlow(ifNode.id, nodesDGA, []);
            const elseBranchRoute = _getFlow(elseNode.id, nodesDGA, []);
            const eqNodeID = ifBranchAllRoute.find((_) => elseBranchRoute.some((e) => e === _));
            if (eqNodeID) {
              ifInfo.ifRoute = ifBranchAllRoute.slice(0, ifBranchAllRoute.indexOf(eqNodeID));
              ifInfo.elseRoute = elseBranchRoute.slice(0, elseBranchRoute.indexOf(eqNodeID));
            } else {
              ifInfo.ifRoute = ifBranchAllRoute;
              ifInfo.elseRoute = elseBranchRoute;
            }
          }
          if (elseNode && elseNode.id && !ifNode) {
            const elseBranchRoute = _getFlow(elseNode.id, nodesDGA, []);
            ifInfo.elseRoute = elseBranchRoute;
          }
        }
        scopeStack.push(ifInfo);
      }
    }
    body = [...imports, ...body];
    const functionDeclaration = babelTypes.functionDeclaration(
      babelTypes.identifier(functionName),
      [],
      babelTypes.blockStatement(body)
    );

    const program = babelTypes.program([
      functionDeclaration,
      // babelTypes.expressionStatement(
      //   babelTypes.callExpression(babelTypes.identifier("executeFlow"), [])
      // ),
    ]);

    // Generate code from AST
    const output = generate(program);
    setGeneratedCode(output.code);
    return output.code;
  };

  useEffect(() => {
    const funcList = project[projectID]?.functions || [];
    setFunctions(funcList);
    const currentFunc = funcList.find((_) => _.name === functionName);
    if (currentFunc && type === 'edit') {
      setNodes(currentFunc.flowNodes || []);
      setEdges(currentFunc.flowEdges || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentNode) {
      setNodes((nds) =>
        nds.map((node: any) => {
          // @ts-ignore
          if (node.id === currentNode.id) {
            return currentNode;
          }
          return node;
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode]);

  useEffect(() => {
    console.log('nodes', nodes);
  }, [nodes]);

  const onConnect = useCallback(
    (params: any) => {
      params.animated = true;
      params.type = 'smoothstep';
      params.style = {
        // stroke: 'red',
        strokeWidth: 2,
      };
      params.markerEnd = {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        // color: '#FF0072',
      };
      const sourceNode = nodes.find((node: NodeTypes) => node.id === params.source);
      if (sourceNode && sourceNode?.type === 'if') {
        // @ts-ignore
        const existsIfEdge = edges.find((edge) => edge.source === params.source);
        params.type = 'custom';
        params.data = params.data || {};
        // @ts-ignore
        params.data.if = !(existsIfEdge && existsIfEdge.data && existsIfEdge.data.if);
      }
      // @ts-ignore
      setEdges((eds) => addEdge(params, eds));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const reactFlowBounds = reactFlowWrapper.current!.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const position = screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  const onNodeClick = (e: React.MouseEvent, node: any) => {
    setCurrentNode(node);
    // setNodeShow(true);
  };

  const clearNode = () => {
    setNodes([]);
    setEdges([]);
    setCurrentNode(null);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const saveCode = async () => {
    
    const code = generateAST();
    const saveFuncs = type === 'create'
      ? [...functions, { name: functionName, description: '', isReturn: false, code, flowNodes: nodes, flowEdges: edges }]
      : functions.map((func) =>
          func.name === functionName ? { ...func, code, flowNodes: nodes, flowEdges: edges } : func
        );
    const {error} = await updateFunctions(projectID, saveFuncs, 'EDIT');
    if (!error) {
      dispatch(setProjectFunctions({ projectID, functions: saveFuncs }));
    }
    setOpen(false);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        height: '80%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
      }}
    >
      <Grid container height="100%">
        <Grid item xs={1}>
          <Sidebar nodeTypes={nodeTypes} />
        </Grid>
        <Grid item xs={8} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onConnect={onConnect}
            onDrop={onDrop}
            connectionLineComponent={ConnectionLine}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </Grid>
        <Grid item xs={3}>
          <VariablesProvider>
          {Nodes.filter((_) => _.editView !== null).map((nodeInfo, index) => (
            // @ts-ignore
            <nodeInfo.editView key={index} node={currentNode} setNode={setCurrentNode} />
            ))}
          </VariablesProvider>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={generateAST}>Generate</Button>
          <Button onClick={clearNode}>Clear</Button>
          <Box
            sx={{ mt: 0.5, height: '300px', marginTop: 3, paddingTop: 1 }}
            style={{ border: '0.5px solid grey' }}
          >
            <Editor language="typescript" value={generatedCode} />
          </Box>
        </Grid>
      </Grid>
      <Button
        sx={{ position: 'fixed', bottom: 0, right: 0, margin: 3 }}
        variant="outlined"
        color="inherit"
        onClick={saveCode}
      >
        Save
      </Button>
    </Box>
  );
};

interface IFunctionFlowProps {
  functionName: string;
  type: 'edit'|'create',
  setOpen: (open: boolean) => void;
}
const FunctionFlow: React.FC<IFunctionFlowProps> = ({functionName, type, setOpen}) => (
  <ReactFlowProvider>
    <DnDFlow functionName={functionName} type={type} setOpen={setOpen} />
  </ReactFlowProvider>
);

export default FunctionFlow;
