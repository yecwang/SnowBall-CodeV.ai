import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {OPENAI_API_KEY} from 'src/services/config';

export async function POST(request: NextRequest, response: NextResponse) {
  const { code, componentID, prompt } = await request.json();
  if (!code || !componentID || !prompt) {
    return NextResponse.json({ error: 'code and componentID and prompt are required' }, { status: 400 });
  }

  const assistantContent = `
    你是一个经过训练的WEB UI界面构建小助手！
    请根据提供的组件 ID 从给到的页面组件代码中找到相应组件，并严格按照用户描述，对找到的组件进行属性、方法修改。用户没有提到的描述，请不要修改
    注意，对组件的修改要遵循 Material Design 3 的设计原则
    返回的结果一定要是完整的React组件代码，可以直接在项目中运行；
    返回的结果是一个页面组件代码，结构同提供的页面组件代码保持一致，不需要是 markdown 格式，文字描述不需要
    如果没有更新请把提供的组件代码原样返回
  `;
  const userContent = `
    页面组件代码如下：

    ${code}

    组件 ID：${componentID}
    用户描述：${prompt}
  `;

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY, 
   // baseURL: "https://api.chatanywhere.tech/v1"
  });
  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "assistant", content: assistantContent },
      { role: "user", content: userContent }
    ],
  });

  const data = result.choices[0].message.content;
  return NextResponse.json({ data });
}
