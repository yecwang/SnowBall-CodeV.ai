import React from 'react'


const withUIComponent = (Component: any) => React.forwardRef((props: any, ref: React.Ref<any>) => {
  const convertBooleanType = (v: any) => {
    if (v === 'true') { return true; }
    if (v === 'false') { return false; }
    return v;
  }

  /**
   * Converts the props object by extracting function props and creating passThroughProps.
   * @remarks
   * This function modifies the props object by removing function props and creating a new object with passThroughProps.
   */
  const convertFunctions = () => {
    const { funs, ...otherProps } = props;
    const passThroughProps: any = {};
    const funKeys = [];
    const funProps: any = {};
    Object.keys(otherProps).forEach((item: string) => {
      if (item.startsWith('FUN_')) {
        funKeys.push(item);
        funProps[item] = props[item];
        const realKey = item.replace('FUN_', '');
        passThroughProps[realKey] = (funs as any)[props[item]]; // Explicitly define the type of funs object
      } else {

        passThroughProps[item] = convertBooleanType(props[item]);
      }
      return item;
    });

    return passThroughProps; 
  };

  // convert FUN_<event>={<function_name>} to <event>={<function>}
  const afterConvertFunProps: any = convertFunctions();
  
  return <Component ref={ref} {...afterConvertFunProps} />
})

export default withUIComponent
