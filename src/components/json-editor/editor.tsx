import { SetStateAction, useEffect, useRef, Dispatch } from 'react'
import { JSONEditor, JSONEditorPropsOptional, Mode, Content, OnChange } from 'vanilla-jsoneditor'
// components
import Box from '@mui/material/Box';
import { SxProps, useTheme } from '@mui/material/styles';
//
import "./vanilla-jsoneditor.css";

interface JsonEditorProps extends JSONEditorPropsOptional {
  sx?: SxProps,
  data?: {
    json: any;
    text: undefined;
  },
  handleChange?: Dispatch<SetStateAction<{
    json: any;
    text: undefined;
  }>>,
}

function JSONEditorReact(props: JsonEditorProps) {
  const { sx, data, handleChange } = props;

  const refContainer = useRef<HTMLDivElement>(null)
  const refEditor = useRef<JSONEditor | null>(null)
  const theme = useTheme();

  const themeColorPresets = theme.palette.primary.main;

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current!,
      props: {},
    })

    return () => {
      // destroy editor
      if (refEditor.current) {
        refEditor.current.destroy()
        refEditor.current = null
      }
    }
  }, [])

  useEffect(() => {
    // update props
    if (refEditor.current) {
      const updateProps = {
        mode: 'text' as Mode,
        ...props,
        content: data as Content,
      }
      if (handleChange && typeof handleChange === 'function') {
        updateProps.onChange = handleChange as OnChange
      }
      refEditor.current.updateProps(updateProps)
    }
  }, [props, data, handleChange, themeColorPresets])

  return <Box
    ref={refContainer}
    sx={{
      height: {
        xs: 100,
        sm: 200,
        md: 500,
        lg: 600,
        xl: 800,
      },
      '--jse-theme-color': themeColorPresets,
      '--jse-theme-color-highlight': themeColorPresets,
      ...(sx || {})
    }}
  />
}

export default JSONEditorReact
