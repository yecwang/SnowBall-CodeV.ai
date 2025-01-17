import { useDrag } from 'react-dnd';
import _ from 'lodash';
import { IDragContainerProps } from 'src/types/project/project';
import Box, {BoxProps} from '@mui/material/Box';
import { updateWillInsertLocationComs } from 'src/redux/slices/attribute-editor';
import { useSelector, useDispatch } from 'src/redux/store';

const DragContainer: React.FC<IDragContainerProps & BoxProps> = ({name, code, attributes, importCode, children, sx, ...other}) => {
  const dispatch = useDispatch();
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: {
      id: `${name}_${Date.now()}_${_.random(1000)}`,
      importCode,
      new: true,
      name,
      code, // `<Button id="@@@attributes.id" style={@@@attributes.style} onClick={@@@attributes.onClick} >@@@attributes.text</Button>`
      attributes
    },
    collect: (monitor: { isDragging: () => any; }) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      dispatch(updateWillInsertLocationComs([]));
    }
  });

  const opacity = isDragging ? 0.5 : 1;
  
  return (
    <Box ref={drag}
      sx={{
        width: '100%',
        height: '100%',
        opacity,
        cursor: 'pointer',
        ...sx
      }}
      {...other}
      onMouseDown={(event) => event.stopPropagation()}
    >
      { children }
    </Box>
  )
}

export default DragContainer;