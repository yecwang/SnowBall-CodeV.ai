
# SnowBall-CodeV.ai

**SnowBall-CodeV.ai** is an open-source, AI-driven visual application builder framework. Designed for developers and enthusiasts, it provides an intuitive interface for generating and editing applications with minimal coding effort.

## 🚀 Key Features
- **AI-Driven Development**: Automate repetitive tasks, generate code snippets, and optimize workflows with the power of artificial intelligence.
- **Visual Application Builder**: Create, edit, and manage applications through a drag-and-drop interface without diving deep into complex code.
- **Customizable Framework**: Extend and adapt the framework to suit your specific development needs.

## 🎯 Why SnowBall-CodeV.ai?
While this project may not aim to disrupt the industry, it serves as a great resource for exploring the potential of AI in software development. It’s a platform for learning, experimentation, and collaboration.

## 🛠️ Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository**:  
   ```bash
   git clone https://github.com/yecwang/snowball-codev.ai.git

2.	**Install dependencies**:

## NODE.JS

- Node 16.x || 18.x

## Mysql

### Install Mysql

```
docker run --name some-mysql  -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:8.0
```



### Config

```
cd tisoul-app-builder
cp .env.example .env
vi .env

# DB_URL="mysql://root:123456@localhost:3306/tisoul_db"
```

### Run dev

#### USING YARN (Recommend)

```
yarn install
yarn initialize # Initialize the development environment for the first time
yarn dev
```

#### USING NPM

```
npm i OR npm i --legacy-peer-deps
npm run initialize # Initialize the development environment for the first time
npm run dev
```

```
# console
(base) ➜  tisoul-app-builder git:(main) ✗ yarn dev
yarn run v1.22.19
$ yarn prisma:generate && next dev -p 8084
$ prisma generate
Environment variables loaded from .env
Prisma schema loaded from src/services/prisma/schema.prisma

✔ Generated Prisma Client (5.1.1 | library) to ./node_modules/@prisma/client in 47ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client
```

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

```
┌─────────────────────────────────────────────────────────┐
│  Update available 5.1.1 -> 5.5.2                        │
│  Run the following to update                            │
│    yarn add --dev prisma@latest                         │
│    yarn add @prisma/client@latest                       │
└─────────────────────────────────────────────────────────┘
- ready started server on 0.0.0.0:8084, url: http://localhost:8084
- info Loaded env from /Users/lujia/WORKSPACE/git-folder/demo/tisoul-app-builder/.env
- warn You have enabled experimental feature (serverActions) in next.config.js.
- warn Experimental features are not covered by semver, and may cause unexpected or broken application behavior. Use at your own risk.

- event compiled client and server successfully in 364 ms (20 modules)
- wait compiling...
- event compiled client and server successfully in 86 ms (20 modules)
```

open link: http://localhost:8084

## How to add a ServerAction

### Example

1. Add module folder to services/server-actions, eg: project
2. project目录下添加client.ts 跟project.ts
3. project.ts文件在后端服务执行，文件顶部需要添加'use server'标识，然后添加后端的方法逻辑，方法需要用withServerAction包裹， withServerAction是后端的middleware。
4. client.ts是给前端调用的，文件顶部需要添加'use client'标识，然后讲project.ts中的方法用withIntercept再包裹一下然后导出，withIntercept是前端的接口请求拦截器。
5. 前端引入client.ts，调用server action，可直接调用，也可以使用useServerAction调用， useServerAction是一个hook可以将返回数据作为state返回，在组件中调用会更方便一点。
6. 代码示例：
   1. Server 端定义：
      ```js
        'use server'
        // src/services/server-actions/user/user.ts
        export const createUser = withServerAction(CREATE_USER, async (context: ServerActionContext, ...args) => {});
      ```
   2. 客户端拦截器包装后导出
      ```js
        'use client'
        // src/services/server-actions/user/client.ts

        import withIntercept from 'src/lib/client/interceptor'
        import * as User from './user'
        export const createUser = withIntercept(User.createUser)
      ```
   3. 客户端组件内结合 Hook 方式调用
      ```js
        // sections/user/view/user-view.tsx
        import { createUser } from 'src/services/server-actions/user/client.ts'
        function User() {
          const { run, isLoading, data } = useServerAction(createUser);
          useEffect(() => { run() }, []);
          return <>{data.username}</>
        }
      ```

## Build project

如下两个目录用来存放build相关的所有源代码。

* project_source
  该目录下存放project在前端UI界面编辑的源代码

  ```
    ├── 1 // project id
  │   ├── functions
  │   │   └── index.json
  │   ├── metadata  // metadat
  │   │   └── index.json
  │   ├── pages
  │   │   ├── page1.jsx
  │   │   └── page2.jsx
  │   ├── setting
  │   │   └── index.json
  │   ├── texts
  │   │   ├── cn.json
  │   │   └── en.json
  │   └── variables
  │       └── index.json
  ```
* project_base
  该目录下提供用来build project的基础框架。

  ```
  ├── Dockerfile
  ├── README.md
  ├── next-env.d.ts
  ├── next.config.js
  ├── package.json
  ├── public
  ├── src
  │   ├── app
  │   │   ├── 403.tsx
  │   │   ├── 500.tsx
  │   │   ├── [...not_found]
  │   │   │   └── page.tsx
  │   │   ├── coming-soon
  │   │   │   ├── layout.tsx
  │   │   │   └── page.tsx
  │   │   ├── layout.tsx
  │   │   ├── loading.tsx
  │   │   ├── maintenance
  │   │   │   ├── layout.tsx
  │   │   │   └── page.tsx
  │   │   ├── not-found.tsx
  │   │   └── page.tsx
  │   ├── assets
  │   ├── components
  │   ├── config-global.ts
  │   ├── hooks
  │   ├── layouts
  │   ├── locales
  │   ├── redux
  │   ├── routes
  │   ├── sections
  │   ├── theme
  │   └── utils
  ├── tsconfig.json
  └── yarn.lock
  ```

### Project build流程

当build project的时候会创建一个临时目录tmp/hashid, 将project_base这个基础框架copy过去，然后将project_source的文件copy过去，然后运行next的build命令，就会在该临时目录中生成一个out目录，out目录内就是此project编译后的静态文件。

NOTE: 在next.js的后端运行编译命令会编译失败，还没找到解决方法，所以目前是通过data-receive-backend去执行编译命令的。

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

### Context Manager

- 可以拆分到服务器端用
- 修改attributes

### Nav-Bar

- 点击run， 弹出来一个框，可以展示编译后的内容
- 点击按钮，展示源代码

### ConsoleBox

Runner界面下方展示console记录

### 权限及Audit Trail

- 服务端组件，根据权限在服务器端渲染出来菜单相关按钮
- Higher Order Component
- 

### 组件加载

- component-library （module fedaration） 暂时使用mui的基础组件
- App端

### 服务器端拼接编译

- 已整理好base项目，相关编译问题已解决。
- 前端上传page前，需要将最后一行删除，替换为 export default Page
  此处是因为编辑时page代码转换成AST需要有一个ExpressionStatement，而后端放在项目里编译的时候需要export出来这个页面才能正常编译和引用。

### 接口请求是否做下RSA加密
