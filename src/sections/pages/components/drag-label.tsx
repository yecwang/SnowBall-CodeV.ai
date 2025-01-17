import { useDrag } from 'react-dnd';
import _ from 'lodash';
import { IDragLabelProps } from 'src/types/project/project';
import Label from 'src/components/label';

const DragLabel: React.FC<IDragLabelProps> = ({label, name, code, attributes, importCode}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: {
      id: `${name}_${Date.now()}_${_.random(1000)}`,
      importCode,
      name,
      code, // `<Button id="@@@attributes.id" style={@@@attributes.style} onClick={@@@attributes.onClick} >@@@attributes.text</Button>`
      attributes
    },
    collect: (monitor: { isDragging: () => any; }) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  
  return (
    <Label ref={drag} sx={{
      opacity,
      cursor: 'pointer'
    }}>
      { label }
    </Label>
  )
}

export default DragLabel;