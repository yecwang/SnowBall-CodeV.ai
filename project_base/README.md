# tisoul-app-builder base

A app builder framework with Plugin design

## NODE.JS

- Node 16.x || 18.x

## USING YARN (Recommend)

- yarn install
- yarn dev

## USING NPM

- npm i OR npm i --legacy-peer-deps
- npm run dev

## TODO:

### folder structure

- Functions
- MetaData
- Settings
- Texts
- Variables
- Pages
  - folder1
    - folder1_page1.tsx
  - folder2
    - folder2_page1.tsx
    - folder2_page2.tsx
  - index.tsx

### 服务器端拼接编译

- 已整理好base项目，相关编译问题已解决。
- 前端上传page前，需要将最后一行删除，替换为 export default Page
  此处是因为编辑时page代码转换成AST需要有一个ExpressionStatement，而后端放在项目里编译的时候需要export出来这个页面才能正常编译和引用。
- 整合base项目跟project的时候，要根据pages目录，每个页面动态创建page目录，以pageID为目录名称，动态生成page.tsx文件
- function的使用
  

### 接口请求是否做下RSA加密
