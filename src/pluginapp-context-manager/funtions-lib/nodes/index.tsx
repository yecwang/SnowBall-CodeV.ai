// export all nodes add alias
import DebuggerNode, {
  EditView as Debugger,
  codeGen as DebugCodeGenerate,
} from './DebuggerNode';
import IFNode, {
  EditView as IFNodeEditView,
  codeGen as IFNodeCodeGen,
} from './IFNode';
import StartNode from './StartNode';
import EndNode from './EndNode';
import VariableNode, {
  EditView as VariableEditView,
  codeGen as VariableCodeGen,
} from './VariableNode';

import GetElementAttrByIDNode, {
  EditView as GetElementAttrByID,
  codeGen as GetElementAttrByIDCodeGen,
} from './GetAttrNode';
import PageRouterNode, {
  EditView as PageRouter,
  codeGen as PageRouterCodeGen,
} from './PageRouterNode';

import setAttrNode, {
  EditView as SetAttrEditView,
  codeGen as SetAttrCodeGen,
} from './setAttrNode';
// import HTTPNode, {
//   EditView as HTTPNodeEditView,
//   codeGen as HTTPNodeCodeGen,
// } from './HttpNode';
// const Node: React.FC<PageJumpNodeProps> = ({ id, data, isConnectable }) => (
//   <BaseNode
//     id={id}
//     isConnectable={isConnectable}
//     content={`Send http: ${data.description || ''}`}
//     // icon={<PageIcon sx={{ marginRight: 1 }} />}
//     // additionalStyles={{ backgroundColor: '#e0f7fa' }} // 自定义背景颜色
//   />
// );

// const config = [{
//   node: {
//     content: '',
//   }
// }]

// const exportNodes = config.map(_=> {
//   const node =  memo(({ id, data, isConnectable }) => (
//     <BaseNode
//       id={id}
//       isConnectable={isConnectable}
//       content={`Send http: ${data.description || ''}`}
//       // icon={<PageIcon sx={{ marginRight: 1 }} />}
//       // additionalStyles={{ backgroundColor: '#e0f7fa' }} // 自定义背景颜色
//     />
//   ))
// })


const exportNodes = [
  {type: 'debugger', node: DebuggerNode, editView: Debugger, codeGen: DebugCodeGenerate},
  {type: 'if', node: IFNode, editView: IFNodeEditView, codeGen: IFNodeCodeGen},
  {type: 'start', node: StartNode, editView: null, codeGen: null},
  {type: 'end', node: EndNode, editView: null, codeGen: null},
  {type: 'variable', node: VariableNode, editView: VariableEditView, codeGen: VariableCodeGen},
  {type: 'getElementAttributeByID', node: GetElementAttrByIDNode, editView: GetElementAttrByID, codeGen: GetElementAttrByIDCodeGen},
  {type: 'pageRouter', node: PageRouterNode, editView: PageRouter, codeGen: PageRouterCodeGen},
  {type: 'setElementAttributeByID', node: setAttrNode, editView: SetAttrEditView, codeGen: SetAttrCodeGen},
  // {type: 'HTTP', node: HTTPNode, editView: HTTPNodeEditView, codeGen: HTTPNodeCodeGen},
]
// export { exportNodes as Nodes };
export default exportNodes;
