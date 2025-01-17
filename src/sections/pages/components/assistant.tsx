import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
// hooks
import { Box, IconButton, TextField, Slide, InputAdornment, CircularProgress, Dialog  } from '@mui/material';
import useRunner from 'src/sections/pages/hooks/use-runner';

import Iconify from 'src/components/iconify/iconify';
import { useSettingsContext } from 'src/components/settings';
import { NAV } from 'src/layouts/config-layout';
import { W_ATTRIBUTE } from '../config';


const Assistant = () => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [openTags, setOpenTags] = useState([]);
  const {projectID, pageID, changeCode, getPageCode} = useRunner();
  const [msg, setMsg] = useState('');
  const settings = useSettingsContext();


  const handleToggleInput = () => {
    setShowInput((prev) => !prev);
  };
  const handleCloseSlider = () => {
    setShowInput(false);
  };
  const handleSubmit = useCallback(async () => {
    if (!inputValue.trim()) return; // 防止提交空内容
    setLoading(true); // 显示加载框
    let response;
    try {
      const pageCode = getPageCode()
      response = await fetch('/api/gpt', { method: 'POST', body: JSON.stringify({ content: inputValue.trim(), code: pageCode }) });
    } catch(error) {
      console.log('error', error);
      
    }
    if (!response || !response.body) {
      console.error('No response body');
      setLoading(false);
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    let done = false;
    let str = ''
    while (!done) {
      // eslint-disable-next-line no-await-in-loop
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunk = decoder.decode(value, { stream: true });
      const strArr = chunk.split('>')
      if (strArr.length === 2) {
        setMsg(`${str+strArr[0]}>`);
      }
      str += chunk;
    }
    setMsg(str);
    setInputValue('')
    setLoading(false);
  }, [inputValue, getPageCode, setMsg]);

  useEffect(() => {
    const tags = [];
    const tagRegex = /<\/?([a-zA-Z0-9-]+)(\s*[^>]*)>/g;
    let needParentheses = false;
    if (msg.includes('return (')) {
      needParentheses = true;
    }
    let match = tagRegex.exec(msg);
    // eslint-disable-next-line no-cond-assign
    while (match !== null) {
      const tag = match[1];
      if (match[0].endsWith('/>')) {
        match = tagRegex.exec(msg);
        continue
      }
      const isCloseTag = match[0].startsWith('</');
      if (isCloseTag) {
        tags.pop();
      } else {
        tags.push(tag);
      }
      match = tagRegex.exec(msg);
    }
    let endStr = ''
    if (tags.length !== 0) {
      tags.reverse().forEach((tag) => {
        endStr += `</${tag}>\n`;
      });
      if (needParentheses) {
        endStr += ')';
      }
      endStr += '}\n<Page/>\n';
    }
    const code = msg+endStr;
    console.log("code: ", code)
    if (!code) {
      return;
    }
    changeCode(projectID, pageID, code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg]);

  return (
    <Box id="assistant" sx={{ position: 'fixed', bottom: 200, right: W_ATTRIBUTE + 20, zIndex: 9999 }}>
      {/* 悬浮按钮 */}
      <IconButton
        sx={{
          backgroundColor: 'primary.main',
          color: '#fff',
          '&:hover': {
            backgroundColor: 'primary.dark',
            cursor: 'pointer',
          },
          boxShadow: 3,
        }}
        onClick={handleToggleInput}
      >
        {/* outline-assistant */}
        <Iconify width={28} icon="mdi:google-assistant" />
      </IconButton>

      {/* 弹出输入框 */}
      <Slide direction="up" in={showInput} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            bottom: 100,
            left: (settings.themeLayout === 'vertical' ? NAV.W_VERTICAL : NAV.W_MINI) + 20,
            right: W_ATTRIBUTE + 20,
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 2,
            boxShadow: 3,
          }}
        >
          <Iconify width={24} icon='mdi:close-circle' 
          onClick={handleCloseSlider}
          id="close"
            sx={{
              position: 'absolute',
              top: -10,
              right: 0,
              color: 'black',
            }}
            />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="请输入内容"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ bgcolor: 'white', borderRadius: 1 }}
            // 添加回车按钮事件
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSubmit} color="primary">
                    <Iconify width={24} icon="ic:baseline-send" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Slide>
      {/* 加载框 */}
      <Dialog open={loading}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      </Dialog>
    </Box>
  );
};

export default Assistant;