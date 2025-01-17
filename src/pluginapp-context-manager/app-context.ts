import { TFunction, TProjectPages, PageConfigType } from './types'

export default {
  project: {
    1: {
      setting: {
        "pages": { "page1": { type: PageConfigType.Page, name: "default page", id: "page1" } },
        entryPage: "page1",
      },
      pages: {
        page1: `
        import funs from 'funs';
        import { Box } from 'ui-lib';
        import { Button } from 'ui-lib';
        import { TextField } from 'ui-lib';
        import { Image } from 'ui-lib';
        
        export default function Page() {
          
          return <Box sx={{
            height: '200px',
          }} id="container" drop="true">
            <Image id="images2" src="/assets/images/faqs/hero.jpg" alt="图片" sx={{
              height: '280px',
            }} />
            <Box id='box2' drop="true" sx={{
              margin: '10px',
              marginTop: '50px'
            }
            }>
              <TextField id="textfield_username" label="用户名" sx={{width: '100%'}} />
            </Box>
            <Box id='box3' drop="true" sx={{
              margin: '10px'
            }
            }>
              <TextField id="textfield_pwd" label="密码" sx={{width: '100%'}} />
            </Box>
            <Box id='box4' drop="true" sx={{margin: '10px', marginTop: '50px'}}>
              <Button id="Button_1690168685941_500" sx={{width: '100%'}} variant="contained" color="primary" onClick={() => {
                console.log('click event');
              }}>按钮</Button>
            </Box>
          
          </Box>;
        };`
      } as TProjectPages,
      functions: [] as TFunction[],
      variables: [],
      metadata: [],
      texts: [],
    }
  }
}