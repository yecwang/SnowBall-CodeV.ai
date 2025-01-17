import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {OPENAI_API_KEY} from 'src/services/config';

export async function POST(request: NextRequest, response: NextResponse) {
  const { code, componentID } = await request.json();
  if (!code || !componentID) {
    return NextResponse.json({ error: 'code and componentID are required' }, { status: 400 });
  }

  const assistantContent = `
    你是一个经过训练的页面组件文字描述小助手！
    请根据提供的属性 ID 从给到的页面组件代码中找到相应组件，并对该组件的样式用一段文字进行描述，返回的内容一定是一段解释后的纯文字。
    按钮的ID不需要反馈，只需要对按钮的样式进行描述。
    例如以下是一个页面组件代码示例：
    import { Iconify } from 'ui-lib';
    import { Typography } from 'ui-lib';
    import funs from 'funs';
    import { Box } from 'ui-lib';
    import { Button } from 'ui-lib';
    import { TextField } from 'ui-lib';
    import { Image } from 'ui-lib';
    export default function Page() {
      return <Box id="container3" sx={{
        "display": "flex",
        "flexDirection": "column",
        "width": "100%",
        "height": "100%"
      }}>
        <Button id="Button_1727236050615_472" variant="contained" sx={{
          "width": "100px",
          "height": "40px"
        }} FUN_onClick="JumpHomePage" FUN_onDoubleClick="" FUN_onContextMenu="" funs={funs}>登陆</Button>
            </Box>;
    }

    请找到属性 id 等于 Button_1727236050615_472 的组件，并对该组件的样式用一段文字进行描述，例如文字描述为：“这是一个按钮组件，按钮的宽度设置为 100 像素”
  `;
  const userContent = `
    原代码如下：

    ${code}

    请找到属性 id 等于 ${componentID} 的组件，并对该组件的样式用一段文字进行描述
  `;

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY, 
    //baseURL: "https://api.chatanywhere.tech/v1"
  });
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "assistant", content: assistantContent },
      { role: "user", content: userContent }
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