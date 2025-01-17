import { Box, Stack, Switch, Typography } from "@mui/material";
import { useLocales } from "src/locales";
import { useParams } from "src/routes/hook";
import { attributeList } from 'src/pluginapp-context-manager/ui-lib';
import * as projectActions from 'src/services/server-actions/project/client';
import useServerAction from "src/hooks/use-server-action";
import { useAttributeEditor } from "../../../hooks";
import { Accordions, AttrSelect, AttrInput } from "../components";

export default function ExteriorProps() {
  const _renderInfo = (key: string, attrValue: any, styleConfig: any )=>
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
      <Typography sx={{flex: 1, fontSize: theme => theme.typography.body2}}>{styleConfig.label}</Typography>
      <Typography sx={{flex: 1, fontSize: theme => theme.typography.body2, textAlign: 'end'}}>{attrValue[key] || styleConfig.defaultValue}</Typography>
    </Box>
  const onChange = (targetKey: string, value: any) => {
    onAttributesConfigChange(projectID, {
      [targetKey]: value
    })
  }
  const _onChange = (obj: { [k: string]: any }) => {
    onAttributesConfigChange(projectID, obj);
  }
  const _prepareAdvancedAttribute = () => {
    if (!currentComponentAttr) {
      return null;
    }
    
    const advancedAttribute = `${currentComponentAttr.componentName}Attribute` as keyof typeof attributeList;

    const AdvancedAttributeComponent = attributeList[advancedAttribute];
    return AdvancedAttributeComponent;
  }

  const { t, currentLang } = useLocales()
  const params = useParams();
  const projectID = params.projectID as string;
  const { currentComponentAttr, onAttributesConfigChange } = useAttributeEditor();
  const attrs = currentComponentAttr?.attributes || {}
  const { run: uploadImage } = useServerAction(projectActions.uploadImage);
  const { run: getImages } = useServerAction(projectActions.getImages);

  if (!currentComponentAttr) return null;

  const AdvancedAttributeComponent = _prepareAdvancedAttribute();

  const { componentName, elementID: id } = currentComponentAttr;
  const BaseInfoMap: any = {
    id: {
      label: t('pages.attribute.component_id'),
      type: 'info',
      defaultValue: id,
    },
    componentName: {
      label: t('pages.attribute.component_name'),
      type: 'info',
      defaultValue: componentName,
    },
  }
  const commonProps: any = [
    {
      "key": "label",
      "label": t('Label'),
      "type": "string",
      "component": "TextField",
      "defaultValue": ""
    }
  ];

  return (
    <Accordions title={t('pages.attribute.attribute')}>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
        {
          Object.keys(BaseInfoMap).map((key: any) => _renderInfo(key, attrs, BaseInfoMap[key]))
        }
        {
          commonProps.map((prop: any) => <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography sx={{ fontSize: theme => theme.typography.body2 }}>{prop.label}</Typography>
            { prop.component === 'TextField' ? <AttrInput initialValue={attrs[prop.key] || prop.defaultValue} attributeKey={prop.key} onChange={_onChange} /> : null }
            { prop.component === 'Select' ? <AttrSelect initialValue={attrs[prop.key] || prop.defaultValue} attributeKey={prop.key} options={prop.values} onChange={_onChange} /> : null }
            { prop.component === 'Switch' ? <PropSwitch prop={prop} onChange={onChange} /> : null }           
          </Stack>)
        }
        {
          AdvancedAttributeComponent
            ?
              <AdvancedAttributeComponent
                projectID={projectID}
                onUploadImage={uploadImage}
                getImages={getImages}
                componentAttribute={currentComponentAttr.attributes}
                onChange={_onChange}
                language={currentLang.value}
              />
            : null
        }
      </Box>
    </Accordions>
  )
}

type TProps = {
  prop: any;
  onChange: (targetKey: string, value: any) => void
}
export function PropSwitch({ prop, onChange }: TProps) {
  const { currentComponentAttr } = useAttributeEditor();
  const attrs = currentComponentAttr?.attributes || {}

  return <Switch
    checked={!!((attrs[prop.key] || prop.defaultValue) === 'true' || (attrs[prop.key] || prop.defaultValue) === true)}
    onChange={event => onChange(prop.key, event.target.checked)}
    inputProps={{ 'aria-label': 'controlled' }}
  />
}
