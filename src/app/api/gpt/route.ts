import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

import {OPENAI_API_KEY} from 'src/services/config';



export async function POST(request: NextRequest, response: NextResponse) {
  const { content, code } = await request.json();
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY, 
   // baseURL: "https://api.chatanywhere.tech/v1"
  });
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "assistant", content: `你是一个经过训练的WEB UI界面构建小助手！
请根据用户的描述内容，结合原代码内容，使用React, MUI绘制出来现代简约风格的交互界面！
- 现代简约风格的交互界面，采用弹性布局，遵循Material Design 3的设计原则，使用柔和的渐变色背景和简洁的图标。
- 响应式设计，能适配手机端，pad端和电脑PC端。
- 多使用网格布局、卡片式布局，让界面看起来更加整洁
- 如果是网格布局，则在手机端展示1列，pad端展示2列，电脑PC端展示3列。
- 界面内容跟样式要尽可能的跟用户描述内容贴近；
- 一定要尽量多的使用图片跟图标，让界面看起来更加生动；
- 图标组件一定要使用Iconify, Iconify组件从'ui-lib'中导入；
- 图片使用Image组件，从'ui-lib'中导入；
- MUI的组件在顶部引用时一定要通过'ui-lib' 来代替'@mui/material'；
- 顶部引用一定要有这段：import funs from 'funs'；
- 每个组件都需要有一个唯一的组件id，id必须是<组件名>_<时间戳>_<索引>,
- 如果是跟宽高，样式等相关的属性，都需要在sx里面配置实现；
- 返回结果直接输出代码字符串，不需要对代码进行描述和解释，不需要markdown格式；
- 如果用到Image，图片地址都用：/assets/images/faqs/hero.jpg；
- 页面代码不能包含逻辑，只能是纯JSX的组件拼接，不能使用{Array.map(xxxx)} 等逻辑代码；
- 页面名字一定是: Page；
- 如果可以在原代码的基础上更新，就尽量保证原来的代码没有变动，如果不行则返回全新的；
- 返回的代码一定要是完整的React组件代码，可以直接在项目中运行；
- 界面的模版示例如下：
import funs from 'funs';
import { Button } from 'ui-lib';
import { Box } from 'ui-lib';
import { Iconify } from 'ui-lib';
function Page() {
  return <Box id="Button_1690168685888_001" sx={{
    "display": "flex",
    "flexDirection": "column",
    "width": "100%",
    "height": "100%"
  }}>
    <Button id="Button_1690168685941_500" sx={{
      "width": "100%",
      "marginTop": "50px"
    }} variant="contained" color="primary" FUN_onClick="" funs={funs}>按钮</Button>
  </Box>;
}
<Page/>
        ` },
      { role: "user", content: `
原代码如下： 
${code}


用户描述：${content}` }
    ],
    stream: true,
  });


  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.choices[0].delta.content === undefined) {
          continue;
        }
        controller.enqueue(chunk.choices[0].delta.content);
      }
      controller.close();
    }
  });

  return new NextResponse(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    }
  });
}